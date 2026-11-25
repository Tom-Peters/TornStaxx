'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const s=fs.readFileSync(require('node:path').join(__dirname,'../TornStaxx.user.js'),'utf8');const rank=vm.runInNewContext(s.slice(s.indexOf('    function easyAwardCandidate'),s.indexOf('    function meritWeight'))+';rankAchievementPlans');const rows=[{"key":"honors:1","kind":"honors","name":"Historian","description":"Read a chronicle","completed":false},{"key":"medals:2","name":"Threshold","progress":{"remaining":0,"percent":100},"plan":{"counter":"attackswon"}},{"key":"medals:3","name":"Near finish","progress":{"remaining":2,"percent":98},"plan":{"tool":"war","counter":"attackswon","energy":50,"nerve":0,"money":null,"days":null}},{"key":"medals:4","name":"Company","progress":{"remaining":2,"percent":99},"plan":{"tool":"company","counter":"jobpointsused","days":null}},{"key":"medals:5","name":"Unmeasured","description":"unknown"}];
test('quick wins and threshold-ready awards are ranked without historical pace',()=>{const a=rank(rows,false);assert.equal(a[0].name,'Threshold');assert.ok(a.some(x=>x.name==='Historian'));assert.ok(a.some(x=>x.name==='Near finish'));assert.ok(!a.some(x=>x.name==='Unmeasured'));});
test('hold suppresses war tasks; earned awards never qualify; low resource modes exclude uncertain spend',()=>{assert.ok(!rank(rows,true).some(x=>x.name==='Near finish'));assert.ok(!rank(rows.map(x=>({...x,completed:true})),false).length);assert.ok(!rank(rows,false,'save-money').some(x=>x.name==='Near finish'));});

test('started milestones fill spare places after quick opportunities without an ETA',()=>{
  const measured=(key,percent,tool='war')=>({
    key,kind:'medals',name:key,completed:false,progress:{current:percent,target:100,remaining:100-percent,percent},
    plan:{counter:key,tool,days:null,energy:null,nerve:null,money:null}
  });
  const projects=[measured('A',80),measured('B',70),measured('C',90),measured('D',60),measured('E',55),measured('F',0)];
  const list=rank([rows[0],...projects],false);
  assert.deepEqual(Array.from(list,x=>x.name),['Historian','C','A','B','D']);
  assert.equal(list[1].easy.tier,'Longer-term goal');
  assert.equal(rank(projects,true).length,0);
  assert.equal(rank(projects,false,'save-energy').length,0);
  assert.equal(rank(projects,false,'save-money').length,0);
});

const planner=vm.runInNewContext(s.slice(s.indexOf('    function easyAwardCandidate'),s.indexOf('    function meritWeight'))+
  ';({awardCandidates,fundingAwards,trackedUnlockState})');
const noon=Date.UTC(2026,10,25,12),minute=60000,hour=60*minute;
function milestone(key,name,counter,current,target,extra={}){
  return {key,name,kind:key.split(':')[0],description:name,completed:false,
    progress:{current,target,remaining:target-current,percent:100*current/target},
    plan:{counter,tool:'general',energy:0,nerve:0,money:0,...extra}};
}
test('energy, cash, hidden IDs and the UTC deadline apply before picking five',()=>{
  const soon=milestone('honors:20','Course','degree20',3,4,{forecast:'course',days:1,eta:noon+hour});
  const midnight=milestone('honors:21','Tomorrow','degree21',3,4,{forecast:'course',days:1,eta:noon+12*hour});
  const pace=milestone('medals:22','Trips','traveltimes',98,100,{days:1,rate:10,historyDays:30,energy:0,nerve:4,money:50});
  const unknown=milestone('honors:23','Unknown cash','attackswon',90,101,{money:null,energy:25});
  const all=[soon,midnight,pace,unknown,rows[1]];
  const pick=p=>Array.from(rank(all,false,'balanced',{now:noon,updated:noon,...p}),x=>x.name);
  assert.deepEqual(pick({todayOnly:true,noEnergy:true,noCash:true}),['Course']);
  assert.ok(pick({todayOnly:true,noEnergy:true}).includes('Trips'));
  assert.ok(!pick({noCash:true}).includes('Unknown cash'));
  assert.ok(!pick({todayOnly:true}).includes('Threshold'));
  assert.ok(!pick({todayOnly:true}).includes('Tomorrow'));
  assert.ok(!pick({hidden:new Set(['honors:20'])}).includes('Course'));
  const many=Array.from({length:7},(_,i)=>milestone('medals:'+(i+50),'Goal '+i,'goal'+i,80-i,100));
  const key=rank(many,false)[0].key;
  assert.equal(rank(many,false,'balanced',{hidden:new Set([key])}).length,5);
  assert.ok(!rank(many,false,'balanced',{hidden:new Set([key])}).some(x=>x.key===key));
});
test('shared actions respect counter direction, ownership and hidden awards across a search',()=>{
  const canada=milestone('honors:4','Canada','cantravel',48,50),travel=milestone('medals:4','All trips','traveltimes',99,100);
  const japan=milestone('honors:5','Japan','japtravel',47,50);
  const catalog=[canada,travel,japan,{...travel,key:'honors:6',completed:true}];
  assert.deepEqual(Array.from(rank([canada],false,'balanced',{catalog})[0].shared,x=>x.key),[travel.key]);
  assert.equal(rank([travel],false,'balanced',{catalog})[0].shared.length,0);
  assert.equal(rank([canada],false,'balanced',{catalog,hidden:new Set([travel.key])})[0].shared.length,0);
});
test('funding orders the full candidate pool by time and excludes circular or untimed awards',()=>{
  const list=Array.from({length:8},(_,i)=>milestone('honors:'+(i+50),'Course '+i,'degree'+i,2,3,{forecast:'course',eta:noon+(8-i)*hour,days:1}));
  list.push({...rows[1],key:'medals:4'},milestone('honors:100','Award count','awards',9,10,{days:1,rate:1000,historyDays:30}));
  list.push({kind:'honors',key:'honors:130',name:'10-stack',description:'Increase a merit upgrade to its maximum'});
  const options={now:noon,updated:noon,hidden:new Set(['honors:57']),balance:10,goals:{1:10},upgrades:[{id:1,name:'Life',level:9}]};
  const candidates=planner.awardCandidates(list,false,'balanced',options);
  const picked=planner.fundingAwards(candidates,20);
  assert.equal(picked.length,7);
  assert.deepEqual(Array.from(picked,x=>x.x.name),['Course 6','Course 5','Course 4','Course 3','Course 2','Course 1','Course 0']);
  assert.equal(planner.fundingAwards(candidates,2).length,2);
  assert.equal(planner.fundingAwards(candidates,0).length,0);
});
test('confirmed tracked unlocks survive repeated snapshots and acknowledgement',()=>{
  assert.equal(planner.trackedUnlockState(undefined,true,false),'seen');
  assert.equal(planner.trackedUnlockState(undefined,false,false),'unearned');
  assert.equal(planner.trackedUnlockState('unearned',true,false),'new');
  assert.equal(planner.trackedUnlockState(undefined,true,true),'new');
  assert.equal(planner.trackedUnlockState('new',true,false),'new');
  assert.equal(planner.trackedUnlockState('seen',true,false),'seen');
});
