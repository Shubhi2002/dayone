# 07 · Scoring architecture

Status: draft v1 · September 2026 · conceptual; implementation choices deferred

## Design goals

1. **Consistent.** Two identical sessions get the same score. The same session graded twice gets the same score.
2. **Explainable.** Every number points to moments in the replay.
3. **Calibrated.** Scores mean the same thing across scenarios, levels and time.
4. **Contestable.** A customer or candidate can dispute a score and get a real re-review.
5. **Valid.** Over time, demonstrably correlated with on-the-job performance.
6. **Cheap enough.** Grading cost must stay a small fraction of assessment price.

## Pipeline overview

```
Session trace ──▶ Trace normaliser ──▶ Signal extractor ──▶ Rubric agents (N) ──▶ Reconciler ──▶ Report composer
   (events,           (timeline,           (process              (per rubric        (agreement,        (scores, moments,
    diffs,             attribution,         signals,              item: score +      outlier            rationale,
    prompts,           artefacts)           key-moment            evidence +         handling,          debrief Qs)
    runs)                                   candidates)           confidence)        weights)
                                                                        │
                                                                        ▼
                                                              Human calibration queue
                                                              (sampled + flagged + disputed)
```

### 1 · Session trace

Everything the candidate does is an event with a timestamp: file opened, edit (as a diff), command run with output, test results, metrics panel query, log filter, DB query, prompt sent, agent response, agent tool calls, suggestion applied or rejected, note written, submission. The agent runs inside our sandbox so its full I/O is captured. Screen recording is not needed and not wanted.

### 2 · Trace normaliser

Produces a canonical timeline, computes line-level attribution (each final line tagged human / AI-generated / AI-modified with a confidence), and packages artefacts: final diff, test results, benchmark results, written notes and summaries.

### 3 · Signal extractor

Deterministic where possible. Computes the process signals in `06-engineering-score.md` directly from the timeline (for example `reproduced_before_edit` is a timestamp comparison). Agent-judged signals (`prompt_specificity`, `convention_adherence`) use a small model with a fixed rubric and few-shot anchors, and their outputs are themselves inputs to the rubric agents, not final scores.

Also proposes **key-moment candidates**: events that match patterns worth surfacing (first correct hypothesis, rejection of an AI suggestion, a revert, a mitigation, a verification run).

### 4 · Rubric agents

For each rubric item in the scenario, N independent grader runs (start with N = 5; Saffron and OpenRound use 10+, and we should test whether more than 5 changes outcomes). Each grader receives: the rubric item with its 9 / 6 / 3 anchors, the hidden truth, the relevant slice of the timeline, the artefacts, and the extracted signals. It returns a score, the evidence (event IDs) that justifies it, and a confidence.

Rules:
- Graders never see other graders' output.
- Graders are told the level being assessed and the scenario's intended difficulty.
- Graders must cite evidence; a score without citations is discarded and re-run.
- Prompt and model version are recorded per grade so scores can be re-run when either changes.
- Use at least two different model families across the N runs to reduce shared blind spots.

### 5 · Reconciler

- Median of the N scores per rubric item, with the spread recorded as **grader agreement**.
- If spread exceeds a threshold (start at 2.0 points on the 10 scale), the item is flagged for human calibration.
- Rubric item scores roll up into dimension scores using the 60 / 30 / 10 mixing rule with process signals and outcome.
- Dimension scores roll up into the overall score using the role profile weights.
- The reconciler also selects the final key moments: the highest-evidence events cited by graders, de-duplicated, capped at 5 to 7.

### 6 · Report composer

A separate model pass writes the rationale, the debrief questions and the key-moment descriptions in plain language, constrained to reference only the reconciled evidence. It cannot change any number. Its output is checked by a small verifier pass for claims that do not appear in the evidence set.

## Human calibration

Automated grading alone will not be trusted by senior buyers, and it should not be. Human review has three entry points.

| Queue | What enters | Who reviews | Purpose |
| --- | --- | --- | --- |
| **Sampled** | A random 10% of sessions in month 1 to 3, falling to 3% once agreement is stable | Dayone calibration engineers (contract senior engineers, paid per review) | Measure agent-vs-human agreement per rubric item; catch systematic drift |
| **Flagged** | Low grader agreement; outcome and process strongly disagree; integrity flags; candidate near a band boundary | Same | Correct individual scores; identify rubric items that are ambiguous |
| **Disputed** | Customer or candidate disputes | A different reviewer than any prior human on the session | Fairness and trust |

Human reviewers grade blind to the automated score, using the same rubric and the same replay UI. Their scores are recorded alongside agent scores forever. When a human overrides, the report says so.

Target: agent-vs-human agreement within ±1.0 on the 10 scale for 90% of rubric items before human sampling drops below 10%.

## Calibration across scenarios and time

- **Anchor sessions.** For each scenario, 10 to 20 sessions hand-graded by two humans become the anchor set. Every grader model or prompt change is regression-tested against anchors before deployment.
- **Level norming.** Percentiles and process-signal normalisation are computed per scenario family and level. A new scenario shows no percentiles until n ≥ 50.
- **Drift monitoring.** Weekly: mean score per scenario, grader agreement, human override rate, completion rate. A scenario whose mean drifts more than 0.7 in a month is investigated for leakage or grader drift.

## Validity programme

This is the long-term moat and it starts with the first design partner.

**Content validity** (now). Rubrics are reviewed by at least three senior engineers external to Dayone per scenario. Documented.

**Concurrent validity** (months 3 to 9). For candidates a customer hires, compare Dayone dimension scores with the customer's own interview panel scores. Also run current employees of design partners through scenarios (anonymised, voluntary) and compare with manager ratings.

**Predictive validity** (months 9 to 24). For hired candidates, collect a structured manager rating at 3 and 6 months (a 6-item form, 5 minutes) and, where the customer permits, objective signals (time to first merged PR, review turnaround). Report correlation per dimension. Publish once n ≥ 150 hires across ≥ 5 customers.

**Adverse impact monitoring** (continuous). Score distributions by self-reported demographic group (optional, candidate-provided, stored separately). The four-fifths rule as the first screen. See `17-legal-fairness-and-compliance.md`.

Expectation management: structured work-sample tests historically show validity around r = 0.3 to 0.5 for job performance. If we get r ≈ 0.4 on manager ratings we are comfortably ahead of DSA screens. Do not promise more.

## Dispute process

1. Customer or candidate raises a dispute in the report UI, choosing the rubric items or dimensions in question and writing a reason.
2. A human reviewer with no prior contact with the session grades those items blind.
3. If the human differs from the automated score by more than 1.0, the human score replaces it and the report is re-composed with a visible note.
4. Response within 3 business days. Both parties see the outcome.
5. Disputes and outcomes feed the flagged-queue thresholds and rubric revisions.

## Cost model (estimate, to be measured)

Per 90-minute session: trace normalisation and signal extraction are negligible; rubric agents at 5 runs × ~30 rubric items × ~8k tokens in / 400 out on a mid-tier model plus report composition should land under $3; human sampling at 10% × $40 per review adds $4 averaged. Grading total under $10 per session at launch, falling with sampling rate. Compare with an assessment price of $150 to $300.

## Open design questions

- Should candidates see rubric items before the session (transparency, less gaming risk than it sounds) or only after?
- Do we grade the agent's behaviour too (model version, how often it was wrong) so scores are comparable when the agent model changes?
- How do we handle candidates who use the agent barely or not at all? Proposed: AI collaboration marked "insufficient evidence" rather than scored low, and the report says so.
