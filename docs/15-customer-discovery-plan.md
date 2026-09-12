# 15 · Customer discovery plan

Status: draft v1 · September 2026 · run before and alongside design-partner recruitment

## Goal

Twenty-five structured conversations in six weeks that test the riskiest assumptions in our plan before we write code. Discovery is not selling; do not demo in the first 20 minutes.

## Hypotheses to test, ranked by risk

| # | Hypothesis | How we will know | Kill signal |
| --- | --- | --- | --- |
| H1 | Engineering leaders at 50 to 2,000 person companies believe their current technical screen is not predictive and are actively looking to change it | ≥ 60% describe a recent bad hire or a screen they distrust, unprompted or with one nudge | Most say the loop is fine and cheating is not a problem they see |
| H2 | They value operational scenarios (debug, investigate, review, on-call) more than feature-building tasks for experienced hires | When shown the eight modes, ≥ 60% rank Debug, Review or Operate above Build for senior roles | Build is ranked first by most |
| H3 | They will act on process signals and an Engineering Score rather than only reading the diff | When shown mockup 02, they spend time on key moments and process signals, and can say how it would change a debrief | They ask only "did the tests pass" |
| H4 | They will pay $75 to $95 per assessment | ≥ 50% say yes or "depends on X" where X is not price when asked directly after seeing the report | Most anchor at Saffron's $33 to $40 or expect it free |
| H5 | Engineering owns the budget for this at their company | The leader can name who signs and it is in engineering | It routes to HR procurement with a 6-month cycle |
| H6 | Candidates will complete 60 to 120 minute asynchronous simulations at senior level | Interviewees estimate senior completion ≥ 75% and cite examples of take-homes that worked | They report seniors refusing anything over 45 minutes |
| H7 | They prefer library scenarios matched to their stack over forking onto their own repo, at least initially | ≥ 50% prefer library for a first trial | Most say "only if it's our code" |
| H8 | A small fundamentals layer is not required by senior buyers | ≤ 30% insist on algorithm content for senior roles | Most want a DSA component retained |
| H9 | AI-allowed is not a blocker | ≤ 25% would refuse an AI-allowed assessment on principle | The 34% who ban AI are over-represented and immovable |

## Who to talk to

| Segment | Count | Why |
| --- | --- | --- |
| Heads of Engineering / VP Eng / CTO at 50 to 2,000 person companies | 12 | The buyer |
| Staff or senior engineers who run interview loops | 6 | The champion; realism check on scenarios |
| Heads of Talent / senior technical recruiters | 4 | Objections, process, legal, ATS |
| Engineers who interviewed in the last 6 months (senior level) | 3 | Candidate experience and completion realism |

Aim for a spread across US, UK/EU and India, and at least 5 who currently use HackerRank, CodeSignal or Codility.

## Interview guide (45 minutes)

**Opening (5 min).** Who they are, team size, hires in the last 12 months, hires planned.

**Current state (15 min).**
- Walk me through your loop for a senior backend hire, step by step. Who runs each step, how long does it take?
- Tell me about the last hire that did not work out. What did the interview miss?
- Tell me about a great engineer you almost rejected. What nearly went wrong?
- How has AI changed the way your team works day to day? How has it changed your interviews, if at all?
- Have you seen candidates using AI when they were not supposed to? What did you do?
- If you could change one thing about how you assess engineers, what would it be?

**Reactions (15 min).** Show, in this order, without pitching: the eight modes as a list; mockup 01 (candidate workspace); mockup 02 (report).
- Which of these modes would tell you the most about a senior hire? Rank your top three.
- Looking at this report, what would you do with it in a debrief? What is missing? What do you not believe?
- Would you want this on your own codebase, or a realistic library scenario matched to your stack? Why?
- Would you still want an algorithms component? For which levels?

**Value and buying (8 min).**
- If this replaced your algorithm screen and one technical round, what would that be worth per candidate? (Let them answer before offering a number.) Then: "We are thinking $75 to $95 per candidate on a monthly plan." Reaction.
- Who would sign for this at your company? What would they need to see?
- What would stop you from trying it with your next three candidates?

**Close (2 min).** Would you be a design partner (describe the offer briefly)? Who else should I talk to?

## Recording and synthesis

- Notes in a shared template per interview: segment, company size, current loop, pain quotes, mode ranking, report reaction, price reaction, buyer, blockers, partner interest.
- Weekly synthesis: tally each hypothesis as supported / mixed / contradicted; collect verbatim quotes; update `03-target-customer.md`, `13-company-pitch.md` and the risk register.
- Decision meeting at 25 interviews (or at 15 if a kill signal is clear): confirm or change the wedge, the modes to build first, the price, and the MVP scope.

## What we will not do in discovery

- Pitch before minute 20.
- Ask "would you use this?" (everyone says yes). Ask what they did last time and what they would pay.
- Treat one strong opinion as a trend.
- Promise features to get a partner.
