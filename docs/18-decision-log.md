# 18 · Decision log

Append-only. One entry per decision that would be expensive to reverse or that later readers might question. Record the decision, the alternatives, the reasoning, and what would make us revisit it.

Format:

```
### D-NNN · Short title
Date · Status (proposed / decided / superseded by D-MMM)
Decision:
Alternatives considered:
Why:
Revisit if:
```

---

### D-001 · Product name: Dayone
2026-09-12 · Decided
**Decision:** Working name is Dayone (lowercase wordmark "dayone"). Crucible kept as runner-up.
**Alternatives considered:** Flightdeck, Cockpit, Simwork, Oncall, Firedrill, Shipworthy, Groundtruth, Provable, Crucible, Gauntlet, Keel.
**Why:** Candidate-friendly, memorable, expresses the promise ("the interview feels like your first day"), works lowercase, pairs with the sunrise mark.
**Revisit if:** Trademark or domain conflict is found; a design partner reports confusion with an unrelated product.

### D-002 · Primary logo mark: sunrise (concept A)
2026-09-12 · Decided
**Decision:** Half-disc over a baseline in deep purple, Lora wordmark. Lavender variant on dark. App icon on purple tile.
**Alternatives considered:** "01" tile (B), prompt-cursor wordmark (C).
**Why:** Reads at favicon size, carries the "day one" horizon idea, quiet enough to sit beside customer branding.
**Revisit if:** User testing shows the mark is read as a hat or a bowl.

### D-003 · Design language borrowed deliberately
2026-09-12 · Decided
**Decision:** Palette and typography in the spirit of Saffron (warm off-white, near-black ink, deep purple accent, Lora + Geist Mono); component vocabulary in the spirit of OpenRound (embedded workspace, ticket cards, dimension bars, terminal strip).
**Why:** Both are proven to read well to engineering audiences; speed over originality at the mockup stage.
**Revisit if:** Before public launch, to avoid looking derivative of a direct competitor. Budget a brand pass.

### D-004 · Positioning: flight simulator, not "LeetCode for the AI era"
2026-09-12 · Decided
**Decision:** Lead with operational simulation (Debug, Investigate, Review, Operate, Scale) and process scoring. Never summarise the product as LeetCode with AI allowed.
**Alternatives considered:** "Modern LeetCode"; "AI-native assessments" (Saffron's and OpenRound's language).
**Why:** The AI-allowed, real-codebase pitch became consensus in 2025 to 2026 and is already sold by two funded startups and every incumbent. Operational simulation is unbuilt.
**Revisit if:** Discovery shows buyers rank Build above operational modes for senior hires (H2 in `15`).

### D-005 · AI collaboration is a lens, not a mode
2026-09-12 · Decided
**Decision:** Every scenario provides an agent and records its use; AI collaboration is scored in every round. There is no separate "AI round."
**Why:** A separate round would test AI use in isolation, repeating the mistake DSA screens make with algorithms.
**Revisit if:** Customers repeatedly ask for a short standalone "AI fluency" screen; could be offered as a Review round variant.

### D-006 · Wedge: B2B first, candidate side designed-in but not marketed
2026-09-12 · Proposed
**Decision:** Sell to engineering teams for the first 12 months. Run the same scenarios as a free practice tier from month 6 to build calibration data and brand. Revisit candidate-side investment at month 9.
**Alternatives considered:** Candidate practice product first (LeetCode's path); both from day one.
**Why:** Clear buyer and proven willingness to pay; a three-person team cannot grow two products.
**Revisit if:** Discovery shows a long HR-controlled sales cycle, or a candidate-side launch by a competitor gains traction.

### D-007 · Content unit: modes for configuration, families for world, independent rounds by default
2026-09-12 · Proposed
**Decision:** See `12-one-scenario-vs-many-modes.md`. Scenario families share a codebase and story; rounds are mode-shaped and start from canonical state; coupled multi-round simulations reserved for senior and staff.
**Alternatives considered:** Fully separate single-mode scenarios; fully coupled long simulations.
**Why:** Captures orientation savings and realism while keeping measurement clean and configuration simple.
**Revisit if:** Partners never chain rounds, or completion collapses beyond two rounds, or coupled rounds show more signal than expected.

### D-008 · In-sandbox agent model: strong, disclosed, fixed per scenario
2026-09-12 · Proposed
**Decision:** Provide a strong current coding agent rather than a deliberately weakened one. Disclose the model to candidates. Fix per scenario so sessions are comparable.
**Alternatives considered:** Weaker model to keep problems hard (OpenRound's approach); candidate's choice of model (Meta's approach).
**Why:** Realism; reduces incentive to use an external model; process scoring handles the "AI did it" concern.
**Revisit if:** Scenarios become trivially solvable by the agent alone (then raise scenario difficulty, not lower the model), or cost per session exceeds budget.

### D-009 · No webcam, no gaze tracking, no biometrics
2026-09-12 · Decided
**Decision:** Integrity comes from scenario design, trace-based anomaly detection routed to humans, and optional ID verification. Never video proctoring.
**Why:** Candidate trust is the product's reputation; adverse-impact and legal risk of surveillance signals; the trace already carries better signal.
**Revisit if:** A customer segment (regulated, high-stakes) will not buy without it. Even then, prefer a human-led final round.

### D-010 · Integrity flags never change a score
2026-09-12 · Decided
**Decision:** Flags route to human review with evidence and confidence; the score is unaffected until a human acts.
**Why:** A false accusation is the most expensive mistake available to us; fairness monitoring of flags is required.
**Revisit if:** Never, absent a legal requirement.

### D-011 · Score composition: 60% rubric, 30% process signals, 10% outcome
2026-09-12 · Proposed
**Decision:** Starting weights per dimension.
**Why:** Process is the thesis; outcome alone rewards luck and pasted solutions; rubric items carry most of the human-reviewable judgment.
**Revisit if:** Validity data suggests a different mix; expected to change.

### D-012 · Pricing: above Saffron, far below Karat; platform fee plus per-assessment
2026-09-12 · Proposed
**Decision:** Team $490/6, Growth $1,490/20, Scale $3,900/60, extras $75 to $95.
**Why:** Buyer is replacing senior-engineer hours and bad-hire risk; trust, not price, is the constraint; platform fee cushions hiring freezes.
**Revisit if:** Discovery H4 fails; consider per-round-unit pricing.

### D-013 · Compliance on a schedule: SOC 2 Type I by month 12, EU AI Act readiness memo before first paid customer
2026-09-12 · Decided
**Why:** Enterprise conversations die without it and it cannot be rushed later.

---

*Next: D-014 onward as discovery and the concierge test produce decisions.*
