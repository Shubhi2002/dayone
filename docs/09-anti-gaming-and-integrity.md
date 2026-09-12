# 09 · Anti-gaming and integrity

Status: draft v1 · September 2026

## Stance

Dayone is not a proctoring product and must not feel like one. We protect the signal in three ways, in order of preference: **design scenarios that are hard to game**, **detect anomalies from the trace we already have**, and only then **add friction**. Anything that makes an honest senior engineer feel surveilled is a net loss even if it catches a cheater.

The threat model changes when AI is allowed. "Used ChatGPT" is no longer cheating. The remaining threats are:

| Threat | Description | Severity |
| --- | --- | --- |
| **Leakage** | Scenario content and solutions circulate (Glassdoor, Discord, Blind, prep sites) | High, certain over time |
| **Proxy candidate** | Someone else sits the assessment | High, rare |
| **External stronger model** | Candidate pastes our scenario into a frontier model outside the sandbox that outperforms the in-sandbox agent | Medium |
| **Coaching in real time** | A friend or paid coach guides the candidate over a call | Medium |
| **Process theatre** | Candidate performs the behaviours we score (stating hypotheses, "rejecting" AI suggestions) without the substance | Medium, grows as our rubric becomes known |
| **Sandbox escape or tampering** | Modifying tests, telemetry or the grader's inputs | Low if engineered properly |

## 1 · Design: make gaming expensive and low-value

**Variants.** Every scenario ships with a variant generator (see `08-product-design.md`). Identifiers, numbers, the red herring, trap ordering, and often the concrete bug within the same class are varied per session. Knowing "the payment scenario is about holding a connection during backoff" helps a little; it does not produce the fix in the candidate's variant, and the rubric scores the process of getting there. Target: at least 6 to 12 materially different variants per scenario at launch, generated, not hand-written.

**Process over artefact.** Because 60% of a dimension score comes from rubric items about how the candidate worked and 30% from process signals, a pasted-in solution scores poorly: no reproduction, no hypotheses, no verification, a diff that appears in one edit. That pattern is itself a flag.

**The agent is already the best available help.** With a strong coding agent inside the sandbox, the marginal value of an external model is smaller than in a DSA screen. We can also deliberately choose the in-sandbox model to be strong enough that going outside gains little. (OpenRound does the opposite, using weaker models to keep problems hard; we prefer realism plus process scoring.)

**Multi-round and event-driven scenarios** resist preparation because the second and third rounds depend on what the candidate did in the first.

**Written summaries and debrief questions.** The end-of-session summary and the AI-checked debrief questions test understanding of the candidate's own work. A proxy or a pasted solution fails these.

**Retire on signal, not on schedule.** Scenario-level monitoring (mean score drift, time-to-correct-hypothesis collapsing, identical unusual approaches across candidates) triggers review and retirement of a variant pool. We also search the public web and prep communities monthly for our scenario text.

## 2 · Detect: use the trace we already have

All of these are computed from the session trace; none require a webcam.

- **Paste-shaped edits.** Large single edits with no preceding reads or agent interaction, especially matching a known reference solution.
- **Impossible speed.** Time-to-correct-hypothesis far below the scenario's observed distribution with no supporting investigation events.
- **Behavioural discontinuity.** Typing cadence, command style or prompt style changing sharply mid-session (proxy handover).
- **Focus and idle patterns.** Long idle gaps followed by bursts of fully formed work. We record window focus loss as an event but never block on it.
- **Solution-scenario mismatch.** Fixes that address the canonical bug rather than the variant's bug (a strong leakage signal).
- **Summary mismatch.** The written summary describes work not present in the trace.
- **Agent-transcript anomalies.** Prompts that quote the hidden truth or use internal rubric vocabulary.

Detections produce an **integrity flag with a confidence and the evidence**, attached to the report and routed to human review. Flags are never shown as verdicts. The report language is "reviewer attention recommended," not "cheating detected." False accusations are the most expensive mistake we can make.

## 3 · Friction: as little as possible, escalated by customer choice

Default (all customers):
- Email verification and a single-use invitation link.
- Sandbox network egress restricted to what the scenario needs. Copy and paste are allowed (real engineers paste), but paste events are recorded.
- Session bound to one browser session; reconnection allowed, concurrent sessions not.

Optional (customer-selected, disclosed to candidates in advance):
- Identity check at start via a third-party ID verification provider, matched to the name on the offer later. Recommended for final-round use.
- Live "join the session" for a human interviewer, or a 15-minute recorded debrief conversation after submission.
- Restricted mode: block paste of content larger than N characters from outside the sandbox.

Never:
- Webcam proctoring, gaze tracking, room scans, keystroke biometrics as identity, or blocking the candidate from leaving the tab.

## Content security

- Scenario packages, hidden truths and rubrics are stored encrypted with access logged. Contract scenario authors sign NDAs and see only the scenarios they write.
- Candidates never receive the hidden truth for hiring scenarios; practice scenarios draw from separate variant pools.
- Customer-forked scenarios on private repos: the repo never leaves the customer's isolated sandbox tenancy; agents grading it run in that tenancy; we do not train on customer code. Put this in the contract and on the website.

## Sandbox integrity

- Tests, telemetry generators and the trace recorder run outside the candidate's writable filesystem; the candidate can run tests but cannot edit the graded test set (they can add tests, which are graded separately).
- The load-test and metrics pipeline is read-only to the candidate except through the scenario's intended interfaces.
- Post-session, the sandbox is destroyed; the trace and artefacts are what get graded, and they are checksummed at recording time.

## Fairness interaction

Anti-gaming signals must be validated for adverse impact like any other score input. Typing cadence, idle patterns and prompt style vary across languages, disabilities and cultures. Rule: an integrity flag can trigger human review; it can never lower a score by itself. See `17-legal-fairness-and-compliance.md`.

## Metrics to watch

- Variant pool size per scenario; sessions per variant.
- Scenario score drift (monthly).
- Integrity flag rate, human-confirmed rate, false-positive rate.
- Public leakage findings per month.
- Candidate survey: "I felt trusted during the assessment" (target ≥ 4.5 / 5).
