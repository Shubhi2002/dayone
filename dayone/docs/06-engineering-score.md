# 06 · The Engineering Score

Status: draft v1 · September 2026 · the scoring model will change once validity data exists

## What the score is for

The Engineering Score answers one question for a hiring panel: **can we trust this person to build and operate real software, with AI, at the level we are hiring for?** It is a decision aid, not a ranking. It must be explainable to the candidate and defensible to a regulator.

## Structure

```
Engineering Score           0 to 10, one decimal, weighted by role profile
├── 8 dimensions            0 to 10 each
│   ├── Debugging
│   ├── Code quality
│   ├── System design
│   ├── Testing
│   ├── Performance
│   ├── Security
│   ├── AI collaboration
│   └── Engineering judgment
├── Process signals         counts and ratios derived from the session trace
├── Outcome                 did the scenario's goal get met, with evidence
├── Key moments             auto-detected events that justify the dimension scores
└── Recommendation          Recommended / Consider / Not recommended, with a written rationale
```

Anything shown to a customer must be traceable to evidence in the session replay. If a dimension score cannot point to moments, it is not shown.

## Dimension definitions

| Dimension | What it measures | Evidence we look for | Evidence we ignore |
| --- | --- | --- | --- |
| **Debugging** | Getting from symptom to cause efficiently and correctly | Reproduce-first behaviour, hypothesis quality, use of telemetry, decoys rejected, cause found | Speed alone; number of files opened |
| **Code quality** | Would a teammate be happy to inherit this change | Convention adherence, diff coherence, naming, error handling, absence of dead code, size proportional to task | Formatting (linters handle it); personal style |
| **System design** | Choosing structure that fits the constraints | Trade-offs written down, proposals grounded in measurement, awareness of what breaks next, smallest sufficient change | Buzzword count; drawing a diagram |
| **Testing** | Proving the change does what it claims, and keeps doing it | Regression test for the bug, tests fail before fix and pass after, mutation score, edge cases named | Line coverage percentage |
| **Performance** | Knowing where time goes and proving improvement | Measured before and after, correct bottleneck identified, benchmark used | Micro-optimisations without measurement |
| **Security** | Noticing what can go wrong when someone is hostile | Authorisation, input handling, secrets, atomicity, prioritisation by exploitability | Scanner output pasted uncritically |
| **AI collaboration** | Using the agent as a strong junior, not an oracle | Specific prompts, verification of claims, rejection of wrong suggestions with reasons, delegation of boilerplate, reverts of bad AI changes | Volume of prompts (in either direction) |
| **Engineering judgment** | Deciding well under uncertainty and time | Triage order, choosing to mitigate before fixing, saying "I don't know yet", pushing back on a bad requirement, scoping | Confidence of tone |

## How a dimension score is produced

Each dimension score combines three inputs, in this order of weight:

1. **Rubric items (about 60%).** Each scenario defines 4 to 8 observable rubric items per relevant dimension, each anchored at 9 / 6 / 3 (see `05-sample-scenarios.md`). Graded by independent rubric agents from the session trace and artefacts, reconciled as described in `07-scoring-architecture.md`.
2. **Process signals (about 30%).** Derived automatically from the trace. Listed below. Normalised against the distribution for that scenario and level, so a signal means "compared with other seniors on this scenario."
3. **Outcome (about 10%).** Did the stated goal get met, with the evidence the scenario demands (tests green, p95 under target, vulnerabilities fixed). Weighted low on purpose: a candidate who runs out of time with a correct diagnosis and a written plan is worth more than one who lands a lucky fix.

The 60/30/10 split is a starting assumption to be tuned against validity data.

## Process signals

These are derived from the trace, never self-reported. Each has a definition precise enough to compute.

**Investigation behaviour**
- `reproduced_before_edit`: a test run, load test or query that exercises the reported symptom occurred before the first file edit.
- `telemetry_consulted`: metrics or logs panel opened, and a query or filter applied, before the first hypothesis stated.
- `hypotheses_stated`: count of explicit hypotheses in prompts or notes ("I suspect X because Y").
- `time_to_correct_hypothesis`: minutes from start to the first statement that matches the hidden truth.

**Change behaviour**
- `files_read_before_first_edit`: count and whether they include the relevant ones.
- `diff_size_ratio`: lines changed divided by the reference solution's lines changed.
- `reverts`: number of changes the candidate undid, and whether the reverted change was harmful.
- `convention_adherence`: agent-judged match to the codebase's existing patterns.

**Verification behaviour**
- `tests_added`, `tests_fail_before_fix` (the regression test was demonstrated to catch the bug), `mutation_score` where applicable.
- `verified_with_original_tool`: the same instrument that revealed the problem was used to confirm the fix.

**AI collaboration**
- `prompts_total`, `prompt_specificity` (agent-judged: references files, constraints, or hypotheses vs. "fix this").
- `suggestions_accepted`, `suggestions_rejected`, `rejections_with_reason`.
- `ai_claims_verified`: statements by the agent that the candidate then tested or checked.
- `hallucinations_caught`: agent claims that were false and that the candidate identified as false.
- `ai_generated_lines`, `ai_modified_lines`, `human_lines` (line-level attribution, Saffron-style).
- `blind_accept_events`: AI-generated change applied and not subsequently read, run or tested before the next prompt.

**Judgment and operations**
- `mitigation_before_root_cause` (Operate mode): a reversible user-protecting action preceded deep investigation.
- `time_to_mitigation`, `mitigation_reversible`.
- `communication_events`: status updates written when the scenario requested them, and their timing.
- `decoy_time_share`: fraction of the session spent on the planted red herring.

## Derived composites shown on the report

- **Independent reasoning** (0 to 100): hypotheses stated before asking the agent, weighted by whether they were correct.
- **AI validation** (0 to 100): share of consequential agent claims and changes that were verified.
- **Prompt specificity** (0 to 100).
- **Delegation** (0 to 100): share of AI-generated code that was boilerplate or tests versus core logic, adjusted for whether core logic from the agent was reviewed.

## Weighting by role profile

The overall score is a weighted mean of dimensions. Customers pick a profile or edit the weights. Defaults:

| Dimension | New grad | Mid backend | Senior backend | Staff / platform | Frontend mid | Security-leaning |
| --- | --- | --- | --- | --- | --- | --- |
| Debugging | 15 | 20 | 18 | 12 | 18 | 12 |
| Code quality | 20 | 15 | 12 | 8 | 18 | 10 |
| System design | 5 | 10 | 18 | 25 | 8 | 12 |
| Testing | 20 | 15 | 12 | 8 | 15 | 10 |
| Performance | 5 | 10 | 10 | 12 | 12 | 6 |
| Security | 5 | 8 | 10 | 10 | 7 | 25 |
| AI collaboration | 15 | 12 | 10 | 10 | 12 | 10 |
| Engineering judgment | 15 | 10 | 10 | 15 | 10 | 15 |

Weights sum to 100. A dimension with no primary signal in the assigned scenarios is shown as "not assessed" and excluded from the mean, never imputed.

## Recommendation bands

Bands are set per customer and per role, defaulting to:

- **Recommended:** overall ≥ 7.5 and no primary dimension below 5.
- **Consider:** overall 6.0 to 7.4, or overall ≥ 7.5 with one primary dimension below 5 (the report names it as the debrief focus).
- **Not recommended:** overall < 6.0.

The band is advice. The report always includes a two-to-four sentence written rationale and the debrief questions that would most change the panel's mind.

## Percentile context

Each dimension shows the candidate's percentile among completed sessions on the same scenario family and level (minimum n = 50 before percentiles are shown). Percentiles never feed the score; they are context only.

## What the candidate sees

Candidates receive their own report after the customer's decision is communicated, or immediately in practice mode: dimension scores, key moments, and the rationale, without the hidden truth for hiring scenarios. This is a candidate-experience decision and a fairness decision; see `17-legal-fairness-and-compliance.md`.

## Known weaknesses of this design

- The 8 dimensions are not independent. Judgment correlates with everything. Factor analysis on the first thousand sessions will tell us whether 8 is the right number.
- Process signals reward a particular style of working (explicit, verbal, methodical). Some excellent engineers are quiet and fast. The rubric agents must score outcomes-of-process, not verbosity; `hypotheses_stated` must accept hypotheses expressed as actions (running a specific query) not only as sentences.
- Line-level attribution is noisy when candidates heavily edit AI output. Report it as a range.
- Without validity data, the weights are opinions. Say so in the report footer until they are not.
