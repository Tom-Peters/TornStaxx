'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../TornStaxx.user.js'),'utf8');
test('Torn PDA metadata is at byte zero with permanent update URLs',()=>{
  assert.ok(src.startsWith('// ==UserScript==\n'));
  assert.match(src,/^\/\/ @name\s+TornStaxx - Unified Torn Command Centre/m);
  assert.match(src,/^\/\/ @version\s+4\.0\.4/m);
  assert.match(src,/^\/\/ @author\s+IamEEKY/m);
  assert.match(src,/^\/\/ @match\s+https:\/\/www\.torn\.com\/\*/m);
  assert.match(src,/^\/\/ @downloadURL\s+https:\/\/raw\.githubusercontent\.com\/Tom-Peters\/TornStaxx\/main\/TornStaxx\.user\.js/m);
  assert.ok(src.includes('// ==/UserScript=='));
});
test('single central launcher and duplicate fallback cleanup',()=>{
  assert.match(src,/getElementById\("staxx-hub-root"\)/);
  assert.match(src,/getElementById\("staxx-fallback-root"\)/);
  assert.match(src,/root\.id = "staxx-hub-root"/);
  assert.match(src,/Torn<span>Staxx<\/span>/);
});
test('four durable IDs have rebranded labels',()=>{
  for(const [id,label] of [['profit','Profit-TornStaxx'],['war','War-TornStaxx'],['happy','Training-TornStaxx'],['company','Company-TornStaxx']])
    assert.ok(src.includes('{id:"'+id+'",label:"'+label+'"'));
});
test('preserves action, diagnostic and evidence routing',()=>{
  for(const feature of ['staxx:register','staxx:ping','staxx:open','staxx:closeall','staxx:actions','staxx:notice','staxx:summary','staxx:activity','staxx-hub-checklist','staxx-hub-session','staxx-hub-find','staxx-hub-diagnostics'])
    assert.ok(src.includes(feature),feature);
  assert.doesNotMatch(src,/GM_xmlhttpRequest|fetch\s*\(\s*['"]https:\/\/api\.torn\.com/);
});


test('War module has separate safe startup and cross-world registration bridge',()=>{
  assert.match(src,/tornstaxx-war-v1/);
  assert.match(src,/kind:'open'/);
  assert.match(src,/d\.kind!=='register'/);
  assert.match(src,/e\.origin!==location\.origin/);
  assert.match(src,/tornstaxx-war-runtime-v1/);
  assert.match(src,/warRuntime\(\)/);
  assert.doesNotMatch(src,/GM_xmlhttpRequest/);
});


test('War panel launch requires actual visible DOM and reports missing acknowledgements',()=>{
  assert.match(src,/function checkWarPanelOpened\(attempt\)/);
  assert.match(src,/getElementById\('warstaxx-root'\)/);
  assert.match(src,/\.querySelector\('\.ws-panel'\)/);
  assert.match(src,/setTimeout\(\(\)=>checkWarPanelOpened\(attempt\),1100\)/);
  assert.match(src,/War panel DOM was detected, but essential UI elements were missing/);
  assert.match(src,/No saved War records or API keys have been deleted/);
});


test('War standalone launch falls back to a real DOM control for isolated PDA scripts',()=>{
 assert.match(src,/getElementById\('warstaxx-dom-open'\)/);
 assert.match(src,/domBridge\.dataset\.section=/);
 assert.match(src,/domBridge\.click\(\)/);
 assert.match(src,/warRoot\?\.style\.display!==\'block\'/);
});


test('War injection diagnostics check actual DOM even without shared storage or registration',()=>{
  assert.match(src,/function warDomEvidence\(\)/);
  assert.match(src,/getElementById\('tornstaxx-war-execution-probe'\)/);
  assert.match(src,/getElementById\('warstaxx-root'\)/);
  assert.match(src,/getElementById\('warstaxx-dom-open'\)/);
  assert.match(src,/if\(!active\[id\]&&\!\(warEvidence\?\.detected\)\)/);
  assert.match(src,/War-TornStaxx launch check:/);
  assert.match(src,/version 0\.2\.4/);
  assert.doesNotMatch(src,/Update the War module itself to v0\.2\.1/);
});

test('War DOM evidence sees an injected panel even with no cross-world registration or storage',()=>{
 const vm=require('node:vm');
 const start=src.indexOf('    function warDomEvidence(){');
 const end=src.indexOf('\n    let warOpenAttempt=',start);
 assert.ok(start>0&&end>start,'Isolated DOM evidence helper exists');
 const evidenceFunction=src.slice(start,end);
 const panel={isConnected:true,style:{display:'none',visibility:'visible'},querySelector:()=>({})};
 const beacon={dataset:{phase:'ready',version:'0.2.4'}};
 const control={id:'warstaxx-dom-open'};
 const registry={
   'tornstaxx-war-execution-probe':beacon,
   'warstaxx-root':panel,
   'warstaxx-dom-open':control
 };
 const document={getElementById:id=>registry[id]||null};
 const code='function warRuntime(){return null;}\n'+evidenceFunction+'\nwarDomEvidence()';
 const result=vm.runInNewContext(code,{document},{timeout:2000});
 assert.equal(result.detected,true);
 assert.equal(result.root,true);
 assert.equal(result.probe,true);
 assert.equal(result.button,true);
 assert.equal(result.ready,true);
 assert.equal(result.phase,'ready');
 assert.equal(result.version,'0.2.4');
 assert.equal(result.visible,false,'a present but closed War panel is detected without false visible state');
 delete registry['warstaxx-root'];
 delete registry['warstaxx-dom-open'];
 const loaderOnly=vm.runInNewContext(code,{document},{timeout:2000});
 assert.equal(loaderOnly.detected,true,'isolated execution beacon still visible');
 assert.equal(loaderOnly.ready,false,'loader is not a completed panel');
 delete registry['tornstaxx-war-execution-probe'];
 const absent=vm.runInNewContext(code,{document},{timeout:2000});
 assert.equal(absent.detected,false,'no DOM/marker means not executed');
});
