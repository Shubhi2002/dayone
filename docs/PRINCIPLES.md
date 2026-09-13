# Principles the code must uphold

Status: v0.1 · 13 September 2026 · product, integrity, privacy and fairness rules distilled from the research phase; these bind implementation

## Candidate experience

1. **It should feel like a good first day, not an exam.** A ticket, a codebase, working tooling, an agent, a clear goal. No trick phrasing.
2. **Everything a real engineer would have is there.** Tests, README, terminal, the agent. If withholding it would be unrealistic, do not withhold it.
3. **Using AI is expected and visible.** The candidate chooses an agent from the allowed set; the UI says plainly that prompts are part of the assessment.
4. **Time pressure is honest.** One visible timer, generous for the level; the budget is a guide, the hard stop is 1.5×.
5. **Nothing is lost.** Autosave, snapshot every 30 s, reconnect restores the same sandbox. A crash is our fault.
6. **Respect at the end.** Clear submission, what happens next, and later a report they can learn from.

## Integrity without surveillance

7. **No webcam, gaze tracking, screen recording, or keystroke biometrics. Ever.** We record edits, commands, tests and agent traffic inside the sandbox.
8. **Process over artefact.** Scoring weights how the work was done, so pasted solutions score poorly by construction.
9. **Variants, not question banks.** Every session is a materially different instance where the problem supports it.
10. **Integrity flags route to humans and never change a score.** Report language is "reviewer attention recommended", never "cheating detected".
11. **Sandbox output is untrusted input.** Validate at every boundary.

## Privacy and data

12. **Minimise.** Trace, snapshots, answers, agent traffic; nothing else. Large content in object storage by reference.
13. **No vendor keys or company secrets in the sandbox.** Per-session tokens only, revoked at end.
14. **Hidden problem content never reaches a candidate.**
15. **Retention default 12 months**, configurable per company; deletion on request; candidates can request their data.
16. **We do not train on customer code.** Candidate traces may improve grading only anonymised and with opt-out, as disclosed in the notice.

## Fairness and compliance (design-level)

17. **The human decides.** Dayone produces a recommendation with evidence; the company's panel makes the decision. Terms and UI say so.
18. **Every score is explainable** to rubric items and replay moments. No black-box composite.
19. **Job-relatedness by construction**: work samples of the actual job, rubrics reviewed by external senior engineers, documented per problem.
20. **Notice before, not after.** Candidate notice covers what is assessed, that AI is provided, what is recorded, how scores are used, accommodations, disputes. Jurisdictions with advance-notice rules (for example New York City) are honoured by the link's notice period.
21. **Demographics voluntary and stored separately**, used only for aggregate adverse-impact monitoring.
22. **Accommodations are first-class**: extended time, screen-reader mode, theme, split sittings later; no justification required.
23. **Timing is never a raw score input** in a way that would penalise accommodations; normalise per accommodation type.

## Engineering

24. **Nothing hard-coupled.** Providers behind ports; one composition root; capabilities over provider-id branching.
25. **Layers point inward.** `core` has no I/O.
26. **Trace schema is public and versioned.**
27. **Manual before automated** for anything that runs fewer than 30 times a week.
28. **Docs change with the code.** A decision with lasting consequences gets a `DECISIONS.md` entry.
