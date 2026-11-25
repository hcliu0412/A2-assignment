'use strict';
// Run with node --test checks.cjs. No third-party dependencies.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const rules=require('./brief-rules.js');
for(const [topic,input,expected] of [
  ['words',1,'accept'],['words',1199,'accept'],['words',1200,'accept'],['words',1201,'reject'],
  ['words',1350,'reject'],['words',1500,'reject'],['words',1501,'accept'],['words',99999,'accept'],
  ['format','PDF','accept'],['format','DOCX','reject'],['format','TXT','accept'],['appendix','appendix','defer']
]) test(topic+' / '+input,()=>assert.equal(rules.review(topic,input).decision,expected));
test('Missing clause preserves uncertainty',()=>assert.equal(rules.review('appendix','appendix').current.permitted,null));
test('Total number of words above current limit',()=>assert.match(rules.review('words',1350).current.reason,/150 words above/));
test('Invalid inputs are rejected',()=>{
  for(const input of [NaN,0,-1,1.2,100000,'1350']) assert.throws(()=>rules.review('words',input));
  assert.throws(()=>rules.review('format','ZIP'));
});
function harness(){
  const read=file=>fs.readFileSync(path.join(__dirname,file),'utf8');
  class Control{
    constructor(){this.events={};this.children=[];this.open=false;}
    addEventListener(name,fn){this.events[name]=fn;}
    fire(name){this.events[name]({preventDefault(){}});}
    replaceChildren(...children){this.children=children;}
    prepend(child){this.children.unshift(child);}
    append(child){this.children.push(child);}
    focus(){}
  }
  const html=read('BriefCheck.html');
  const ids=Object.fromEntries([...html.matchAll(/ id="([^"]+)"/g)].map(m=>[m[1],new Control()]));
  const buttons=[...html.matchAll(/ data-choice="([^"]+)"/g)].map(m=>Object.assign(new Control(),{dataset:{choice:m[1]}}));
  ids.topic.value='words';ids.words.valueAsNumber=1350;ids.format.value='PDF';ids.mode.value='prompt';
  const document={getElementById:id=>ids[id],createElement:()=>new Control(),querySelectorAll:()=>buttons};
  vm.runInNewContext(read('brief-ui.js'),{BriefRules:rules,document,URLSearchParams,location:{search:""}});
  return {ids,choose:value=>buttons.find(b=>b.dataset.choice===value).fire('click')};
}
test('Optional comparison, retry, duplicate protection and a fresh case',()=>{
  const {ids,choose}=harness();
  choose('accept');assert.match(ids.verdict.textContent,/Reconsider/);assert.match(ids.history.children[0].textContent,/skipped/);
  choose('reject');assert.equal(ids.count.textContent,'1');
  ids.retry.fire('click');ids.sources.open=true;ids.sources.fire('toggle');ids.sources.open=false;ids.sources.fire('toggle');
  choose('reject');assert.match(ids.verdict.textContent,/fits/);assert.match(ids.history.children[0].textContent,/opened/);
  ids.topic.value='appendix';ids.topic.fire('change');ids.setup.fire('submit');assert.equal(ids.sources.open,false);
  choose('defer');assert.match(ids.trace.textContent,/Ask the module team/);assert.equal(ids.count.textContent,'3');
});
test('Presentation changes visibility while preserving source access and the decision',()=>{
  const {ids,choose}=harness();
  for(const m of ['plain','explain','prompt']){
    ids.mode.value=m;ids.setup.fire('submit');
    assert.equal(ids.why.hidden,m==='plain');assert.equal(ids.prompt.hidden,m!=='prompt');
    assert.equal(ids.pair.children.length,2); choose('reject');assert.match(ids.verdict.textContent,/fits/);
  }
});
