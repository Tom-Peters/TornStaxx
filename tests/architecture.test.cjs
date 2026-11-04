'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../TornStaxx.user.js'),'utf8');
test('Torn PDA metadata is at byte zero with permanent update URLs',()=>{
  assert.ok(src.startsWith('// ==UserScript==\n'));
  assert.match(src,/^\/\/ @name\s+TornStaxx - Unified Torn Command Centre/m);
  assert.match(src,/^\/\/ @version\s+4\.0\.0/m);
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
