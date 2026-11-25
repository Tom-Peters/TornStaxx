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
