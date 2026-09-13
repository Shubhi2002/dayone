# Scoring

Status: v0.1 · 13 September 2026 · implementation lives in `apps/worker` jobs and `packages/application/src/scoring`

## What the score is for

One question for a hiring panel: can we trust this person to build and operate software, with AI, at the level we are hiring for. Every number must be traceable to events in the replay. If a dimension cannot point to evidence, it is not shown.

## Structure

```
Engineering Score (0–10)             weighted mean of assessed dimensions, per role profile
├── Dimensions (0–10 each)           Debugging · Code quality · System design · Testing · Performance · Security · AI collaboration · Engineering judgment
├── Process signals                  deterministic, from the trace
├── Outcome                          goal met, with evidence (tests, benchmark)
├── Key moments                      auto-detected events that justify the dimension scores
└── Recommendation + rationale       V0: human-confirmed; bands only when n ≥ 30
```

V0 (Build) shows only the four dimensions Build carries: Code quality, Testing, AI collaboration, Engineering judgment. Others display "not assessed", never imputed.

## Dimension score = rubric (~60%) + process signals (~30%) + outcome (~10%)

- **Rubric items** come from the problem's `hidden/rubric.yaml`, 4 to 8 per relevant dimension, each anchored at 9 / 6 / 3. Graded by independent rubric agents from the trace and artefacts.
- **Process signals** are computed from events and normalised per problem and level. Examples: `reproduced_before_edit`, `files_read_before_first_edit`, `tests_fail_before_fix`, `suggestions_rejected`, `rejections_with_reason`, `ai_claims_verified`, `blind_accept_events`, `prompt_specificity`, `ai_generated_lines` / `ai_modified_lines` / `human_lines`.
- **Outcome** is weighted low on purpose.

With IDE-extension agents, accept and reject signals come from transcripts and the gateway, so some signals carry `confidence` and the report says when a signal was unavailable for the chosen agent.

## Pipeline

```
trace + snapshots + gateway log + transcripts
  → normaliser (timeline, line attribution, artefacts)
  → signal extractor (deterministic; agent-judged signals use a small model with fixed anchors)
  → rubric agents: N=5 independent runs per rubric item, each returns score + cited event ids + confidence;
    at least two model families; prompt and model version recorded per grade; uncited scores discarded
  → reconciler: median per item; spread = grader agreement; wide spread → human queue; roll-up with role weights
  → report composer: rationale, key moments, debrief questions written only from cited evidence; verifier pass
```

## Human calibration

Three queues: **sampled** (100% in V0, dropping to 10% then 3% once agreement is proven), **flagged** (low agreement, band boundary, outcome/process disagreement, integrity flag), **disputed**. Reviewers grade blind to the automated score in the same replay UI; their scores are kept beside the automated ones forever; overrides are shown on the report.

Targets before sampling drops below 100%: 30 sessions, agent-vs-human within ±1.0 on 85% of rubric items.

## Calibration and validity

- **Anchor sessions** per problem (10 to 20, two human graders) regression-test every grader change.
- **Norming** per problem and level; percentiles only at n ≥ 50.
- **Drift monitoring** weekly: mean score, agreement, override rate, completion.
- **Validity programme**: content validity now (external reviewers per rubric); concurrent validity with partners' panel scores; predictive validity with 3- and 6-month manager ratings, published at n ≥ 150 hires. Expect r ≈ 0.3 to 0.5; do not promise more.
- **Adverse impact** monitored continuously on voluntary, separately stored demographics; integrity flags never change scores and are themselves monitored.

## Disputes

Either side disputes an item → a reviewer with no prior contact grades blind → override if difference > 1.0 → report recomposed with a visible note → 3 business days. V0 handles this by email.
