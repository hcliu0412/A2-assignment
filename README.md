# BriefCheck

README word count (body prose only): 1178

## Run and inspect

Keep the project files together and open [BriefCheck.html](BriefCheck.html) in a modern browser. The prototype uses HTML and CSS for the interface and local JavaScript for evaluation, presentation and attempt history. It runs offline without installation or keys. The fictional advisor renders templates from the cited edition. An actual language model and live university documents are outside this build.

## Reproduce a decision

- Enter 1,350 words. Accept the recommendation and inspect the 150-word overrun. Retry, compare editions and reject. Change the input to 1,200 and apply settings: both rules now permit submission.
- Choose file format. PDF produces agreement even though the wording changed. DOCX produces disagreement. TXT produces agreement that submission must change.
- Choose appendix allowance. Compare the old permission with the missing current clause. Seek clarification records an unresolved policy question.
- Switch among the three displays and apply settings with the same input. Each keeps access to evidence. Only the explanation and checking prompt vary. The history records decisions and whether comparison was opened within this page visit. It is practice evidence, not participant data.

## Development record

- **Framing the problem.** My A1 review identified a case where a clear explanation could still mislead a student: the reasoning follows an older assignment brief. I proposed comparing advice alone, explained advice and explained advice with a checking prompt. That earlier review supplied the question and comparison conditions for BriefCheck. The fictional briefs and executable cases were created for A2.
- **Choosing how students check.** Codex proposed two routes: require students to open the clauses before answering, or let them decide immediately. I chose the optional route. The consequence is visible on the first screen: a student can act on the 1,500-word recommendation without seeing the new 1,200-word limit. This also preserves a meaningful choice in all three display conditions.
- **Reviewing the first design.** My first reading of “Check the source” was that it would take me to an original publication or reference. I raised this because the actual control opened two extracts on the same page. Codex changed the label to “Compare brief versions”. The label review records my own reaction. Whether another student anticipates the revised action remains an open usability question.
- **Revising the scope.** I judged the first working prototype, with two fixed scenarios, too simple and asked for a more substantial redesign. Codex proposed and implemented the technical response: editable inputs, separate evaluations for each brief, and a clarification route for missing evidence. A reviewer can now change PDF to DOCX and watch the appropriate decision reverse while the two source clauses stay the same. The [engine](brief-rules.js) and [handlers](brief-ui.js) expose how this works.
- **Reviewing the report.** I asked for an opening that explains the submission problem before introducing the prototype. I also requested recent journal evidence in place of three slide-deck bibliography entries. Codex revised the draft while retaining the relevant Week 2 and Week 4 concepts. The medical citation study supports the question of whether a passage backs a claim. Whether an earlier brief still applies is the separate question explored here.
- **Preparing the handover.** I created the public GitHub repository and initial README. Codex prepared the local project files, [architecture diagram](Architecture.svg) and [three walkthroughs](Storyboards.html). The initial repository commit predates the redesigned prototype. The submission report identifies this project snapshot. Manual browser acceptance remains pending.

## Checks and AI assistance

I used OpenAI Codex to turn the idea into a prototype, suggest implementation options, search for supporting papers, draft the report and README, create the diagram and storyboards, and write and execute the tests. I reviewed the interaction wording, requested a change in technical scope and directed revisions to the argument and evidence. The rule-engine design, code and automated verification were produced by Codex. The runtime advisor uses local templates.

### Project review questions for AI

These questions guide review of the prototype. The development record above describes the decisions made during the project.

| Stage | Question |
|---|---|
| 1. Define the scope from A1 | My A1 review examined how students judge AI assignment advice. Using a case where the AI quotes a genuine but outdated clause, who is the A2 prototype for, what decision does the student need to make, and what can the prototype demonstrate? |
| 2. Decide when to check sources | I prefer to let students answer immediately or inspect both clauses first. Using the same word-limit case, how would compulsory checking change the steps students take and the behaviour we could observe? |
| 3. Design cases that distinguish decisions | If every recommendation based on an old brief is wrong, students can succeed by always selecting “Reject advice”. How would you write two versions of a clause for each of three cases so that accepting, rejecting and seeking clarification are each justified once? |
| 4. Define what the system marks | A 1,501-word report exceeds the old 1,500-word limit and the new 1,200-word limit. Both editions recommend a cut, but by different amounts. Should accepting the advice earn credit? Distinguish agreeing with the action from endorsing its rationale, then check whether the interface makes that distinction clear. |
| 5. Trace the rule engine | How can each edition supply the data for its displayed clause, permitted word count or format, and final feedback? Trace one word-count decision through `brief-rules.js` and identify a change that would alter the result. |
| 6. Compare the three display modes | A1 proposed advice alone, advice with an explanation, and explained advice with a checking prompt. Which text changes when I switch modes? Do the input, access to both sources and marking rule stay consistent? What comparison does this design support? |
| 7. Review the comparison label | When I first saw “Check the source”, I expected it to open a reference. What action would a student expect from that label and from “Compare brief versions”? Design a short task that lets me check the revised wording without revealing the intended action in advance. |
| 8. Identify gaps in automated testing | In `checks.cjs`, which tests cover rule calculations and which cover interaction state? Give me a five-minute manual walkthrough for checking keyboard operation, feedback visibility and the narrow-screen layout. |
| 9. Trace the illustrated interaction | Follow a student who enters 1,350 words, accepts the advice, receives feedback, retries and compares versions. At each step, do the architecture diagram, storyboard and code agree? Which states does the program compute and which words come from the simulated advisor's templates? |
| 10. Review the submission as a marker | With only the final report and the public repository link, could a marker replay all three cases, trace my design decisions, identify the AI contribution and locate the submitted commit? Check against the four rubric criteria and identify the file and edit needed for each gap. |

### Verification

From the project folder, run the [test suite](checks.cjs) with Node.js 18 or later:

    node --test checks.cjs

**Result: 17 passed, 0 failed.**

- **15 rule tests** cover word limits, file formats, missing appendix guidance and invalid inputs. At 1,200 words both editions allow submission. At 1,201 the current edition requires a cut of one word.
- **2 interaction tests** use simulated browser controls to check retry, duplicate submissions, comparison history and all three advice displays.

Browser layout, keyboard navigation and usability with students still need separate checks.

## Files

[Rule engine](brief-rules.js) · [Interaction handlers](brief-ui.js) · [Checks](checks.cjs) · [System architecture](Architecture.svg) · [Three illustrated walkthroughs](Storyboards.html).
