'use strict';
const el = id => document.getElementById(id);
const modes = {plain:'Advice only',explain:'Explanation',prompt:'Explanation + checking prompt'};
const decisions = {accept:'Accept advice',reject:'Reject advice',defer:'Seek clarification'};
let active, mode, opened, answered, attempts=0;
function setTopicFields() {
  const topic=el('topic').value;
  el('wordsField').hidden=el('words').disabled=topic!=='words';
  el('formatField').hidden=el('format').disabled=topic!=='format';
}
function sourceCard(label, source) {
  const card=document.createElement('section');
  card.className='sheet';
  for (const [tag,content] of [['h3',label+' · '+source.version],['small',source.date+' · '+source.clause],['p',source.excerpt]]) {
    const child=document.createElement(tag); child.textContent=content; card.append(child);
  }
  return card;
}
function start(topic,input,selectedMode) {
  active=BriefRules.review(topic,input);
  mode=selectedMode; opened=false; answered=false;
  const title=BriefRules.topics[topic].title;
  el('context').textContent=title+' / '+modes[mode];
  el('question').textContent=topic==='words' ? 'Can I submit a '+input.toLocaleString('en-GB')+'-word report?' :
    topic==='format' ? 'Can I submit my report as '+input+'?' : 'Can I attach one supporting appendix?';
  el('claim').textContent=active.cited.permitted ? 'Yes, you can submit it this way.' : 'No, this submission needs a change.';
  el('why').textContent=active.cited.excerpt; el('why').hidden=mode==='plain';
  el('prompt').hidden=mode!=='prompt';
  el('pair').replaceChildren(sourceCard('Cited brief',active.cited),sourceCard('Current brief',active.current));
  el('sources').open=false; el('choices').hidden=false; el('feedback').hidden=true;
}
function decide(choice) {
  if (answered) return;
  answered=true;
  const checked=opened || el('sources').open;
  const correct=choice===active.decision;
  el('choices').hidden=true; el('feedback').hidden=false;
  el('verdict').textContent=correct?'Your decision fits the available evidence.':'Reconsider the recommended action.';
  el('trace').textContent='Current brief · '+active.current.version+' · '+active.current.clause+' — '+active.current.reason;
  el('difference').textContent=active.decision==='defer' ? 'A missing clause leaves this question unresolved.' :
    active.decision==='reject' ? 'The revision reverses the recommendation for this input.' :
    'Both editions reach the same decision for this input, even though their wording differs.';
  const record=document.createElement('li');
  record.textContent=[el('question').textContent,modes[mode],checked?'Comparison opened':'Comparison skipped',decisions[choice],'Expected: '+decisions[active.decision]].join(' · ');
  el('history').prepend(record); el('count').textContent=String(++attempts); el('feedback').focus();
}
el('topic').addEventListener('change',setTopicFields);
el('setup').addEventListener('submit', event=>{
  event.preventDefault();
  const topic=el('topic').value;
  const input=topic==='words'?el('words').valueAsNumber:topic==='format'?el('format').value:'appendix';
  start(topic,input,el('mode').value); el('question').tabIndex=-1; el('question').focus();
});
el('sources').addEventListener('toggle',()=>{if(el('sources').open && !answered) opened=true;});
for(const button of document.querySelectorAll('[data-choice]')) button.addEventListener('click',()=>decide(button.dataset.choice));
el('retry').addEventListener('click',()=>{start(active.topic,active.input,mode);el('question').tabIndex=-1;el('question').focus();});
const preset = new URLSearchParams(location.search).get('case');
if (preset === 'format' || preset === 'appendix') el('topic').value = preset;
setTopicFields();
start(el('topic').value, BriefRules.topics[el('topic').value].initial, 'prompt');
