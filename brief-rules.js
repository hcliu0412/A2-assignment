/* Executable fictional clauses. The same values drive the wording and both evaluations. */
'use strict';
const BriefRules = (() => {
  const editions = {
    cited: {id:'V1', date:'2 September 2026', limit:1500, formats:['PDF','DOCX'], appendix:true},
    current: {id:'V2', date:'14 October 2026', limit:1200, formats:['PDF'], appendix:null}
  };
  const topics = {
    words:{title:'Word limit', clause:'§2.1', initial:1350},
    format:{title:'File format', clause:'§3.2', initial:'PDF'},
    appendix:{title:'Appendix allowance', clause:'§4.1', initial:'appendix'}
  };
  function evaluate(topic, input, edition) {
    const entry = topics[topic], rules = editions[edition];
    if (!entry || !rules) throw Error('Unknown case or edition.');
    let permitted, excerpt, reason;
    if (topic === 'words') {
      if (typeof input !== 'number' || !Number.isSafeInteger(input) || input < 1 || input > 99999)
        throw Error('Enter a whole word count from 1 to 99,999.');
      const difference = rules.limit - input;
      permitted = difference >= 0;
      excerpt = 'The report must be no longer than ' + rules.limit.toLocaleString('en-GB') + ' words.';
      reason = difference === 0 ? 'The report is exactly at the limit.' :
        Math.abs(difference).toLocaleString('en-GB') + ' words ' + (permitted ? 'below' : 'above') + ' the limit.';
    } else if (topic === 'format') {
      if (!['PDF','DOCX','TXT'].includes(input)) throw Error('Select a listed format.');
      permitted = rules.formats.includes(input);
      excerpt = 'Submit the report in ' + rules.formats.join(' or ') + ' format.';
      reason = input + (permitted ? ' is listed' : ' is absent from the list of permitted formats') + '.';
    } else {
      if (input !== 'appendix') throw Error('Unknown appendix request.');
      permitted = rules.appendix;
      excerpt = permitted === null ? 'No corresponding clause in this edition.' : 'One supporting appendix may be attached.';
      reason = permitted === null ? 'The current brief gives no appendix rule. Ask the module team before attaching it.' : 'One supporting appendix is permitted.';
    }
    return {permitted, excerpt, reason, version:rules.id, date:rules.date, clause:permitted === null ? 'No matching clause' : entry.clause};
  }
  function review(topic,input) {
    const cited=evaluate(topic,input,'cited'), current=evaluate(topic,input,'current');
    const decision=current.permitted===null ? 'defer' : cited.permitted===current.permitted ? 'accept' : 'reject';
    return {topic,input,cited,current,decision};
  }
  return {topics,evaluate,review};
})();
if (typeof module !== 'undefined' && module.exports) module.exports=BriefRules;
