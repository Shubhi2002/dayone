# 11 · MVP and roadmap

Status: draft v1 · September 2026 · pre-build

## The question the MVP must answer

> Will engineering leaders change their interview loop to use a simulation-based assessment, pay for it, and trust its score enough to act on it?

Everything in the MVP exists to answer that. Anything that does not is cut.

## What we already know, so do not need to test

- Companies will allow AI in assessments (46% do; Meta and Google do).
- Engineers will complete 60 to 120 minute realistic simulations (Woven 85% senior completion, OpenRound and Saffron claims).
- Buyers will pay $30 to $50 per assessment for feature-building-on-a-repo (Saffron's pricing exists and they have customers).

## What we do not know, and the MVP tests

1. Do buyers value **operational scenarios** (Debug, Investigate, Review, Operate) over feature-building enough to choose us? Signal: which scenarios design partners actually assign.
2. Do buyers act on **process signals and the Engineering Score**, or do they scroll to the diff? Signal: report engagement, debrief usage, interview feedback.
3. Will they pay **$75 to $95 per assessment**? Signal: pilot conversion at list price.
4. Can we produce a **trustworthy automated score** with human sampling at 10%? Signal: agent-vs-human agreement, dispute rate.
5. Can non-employees **author scenarios** in days, not weeks? Signal: time and cost per scenario from contract authors.

## Pre-build phase (now to build start, about 8 weeks)

Not code. See `15-customer-discovery-plan.md` and `14-design-partner-program.md`.

- 25 discovery interviews with engineering leaders and senior interviewers.
- 8 signed design partners (LOI-level commitment: they will run at least 10 real candidates through the pilot).
- 6 scenarios fully specified to the template in `05-sample-scenarios.md`, rubrics reviewed by three external senior engineers each.
- Concierge test: run 3 to 5 real candidates at 2 design partners through a scenario using off-the-shelf pieces (a cloud dev environment, a coding agent CLI, screen recording, hand grading). Ugly and manual, but it produces the first real reports and tells us whether the report changes a hiring decision before we build anything.
- Legal and fairness review of the assessment design (`17-legal-fairness-and-compliance.md`).
- Decide the wedge: B2B first, candidate side designed-in (`03-target-customer.md`).

## MVP scope (build months 1 to 4)

### In

**Scenarios (6).** D1 payment latency, D2 duplicate notifications, I1 conversion drop, R1 AI-generated transfers PR, B1 rate limiting, O1 on-call. Two stacks (Java/Spring and Python/FastAPI or Node) so most backend teams find a match. Each with at least 6 variants. Multi-round only as D2 → O1 chained (a light version of S1), to test the event mechanic without building the full Scale mode.

**Candidate workspace.** Browser IDE (embed an existing web editor), terminal, tabbed panel with Terminal / Logs / Metrics / Database / Tests, agent panel with apply/reject, ticket and file tree, timer and round stepper, notes, submission with written summary. Autosave and reconnection.

**Simulation engine, minimum.** Scenario package format; per-session sandbox from a container image with warm pool of 3; telemetry as pre-generated files plus a live load-test for the Debug scenarios; event scheduler for the single chained scenario; agent host with fixed model, budget and full I/O capture; append-only trace.

**Scoring.** Trace normaliser, deterministic process signals, 5-run rubric agents with evidence citations, reconciler, report composer with verifier, human calibration queue (a simple internal review UI on top of the replay). Line-level attribution v1.

**Recruiter console.** Library with preview and assign, candidate invite and pipeline, report with replay and key moments, share link, CSV export. Single team per customer, email login. No forking, no ATS, no SSO.

**Integrity.** Single-use links, egress-restricted sandbox, paste and focus events recorded, trace-based flags routed to human review. Nothing visible to candidates beyond a plain statement of what is recorded.

**Candidate report** (post-decision) and a 10-minute practice scenario.

### Out (explicitly)

Repo forking onto customer code; Scale mode and 4-round simulations; Secure and Test modes; ATS integrations; SSO; PDF export; percentiles (n too small); public practice product; mobile; custom role-profile weights beyond three presets; live interviewer join; ID verification integration; localisation.

### MVP success criteria (end of month 6)

| Metric | Target |
| --- | --- |
| Design partners running real candidates | ≥ 6 of 8 |
| Real candidate sessions | ≥ 150 |
| Senior completion rate | ≥ 80% |
| Candidate experience score | ≥ 4.3 / 5 |
| Reports used in a debrief (self-reported by partner) | ≥ 70% of sessions |
| Hiring decisions where partner says the report changed or confirmed the call | ≥ 50% |
| Agent-vs-human agreement within ±1.0 | ≥ 85% of rubric items |
| Dispute rate | ≤ 5% |
| Pilot-to-paid conversion at list price | ≥ 4 of 8 |
| Cost per assessment | ≤ $20 |

If conversion is under 3 of 8, stop and diagnose before building more. The most likely failure is "great candidate experience, buyers still want a human in the loop," which points to a live-join or human-led variant rather than to abandoning the thesis.

## Roadmap after MVP

### Months 5 to 9: make it sellable

- Repo forking (scenario adapted onto customer code) for Build and Review modes.
- Scale mode with full S1 (4 rounds) and S2.
- Greenhouse, Lever, Ashby integrations. SSO. PDF export.
- SOC 2 Type I started (target completion by month 12).
- Scenario count to 20 across 4 stacks; add frontend Debug and a data-pipeline Build.
- Percentiles once n ≥ 50 per scenario family.
- Concurrent validity study running at 3 partners.
- First data-driven content piece published.
- First AE hired.

### Months 9 to 15: make it a category

- Secure and Test modes.
- Public practice tier with separate variant pools; Engineering Score profile for candidates (opt-in sharing).
- Scenario authoring toolkit and linter for external authors; paid author network.
- Human "join the session" option for final rounds.
- Predictive validity data collection (3- and 6-month manager ratings) live at ≥ 5 customers.
- SOC 2 Type II underway; adverse-impact reporting in the console.
- Second AE, solutions engineer.

### Months 15 to 24: enterprise and moat

- First published validity study (target n ≥ 150 hires).
- Enterprise plan: data residency, dedicated calibration engineer, custom scenarios at scale.
- Adjacent roles explored: data engineering (Investigate is already there), SRE (Operate), security engineering (Secure).
- Candidate side monetisation decision.

## Sequencing principles

1. Real candidates before more features. Every month without real sessions is a month without calibration data.
2. Content is the product. Scenario quality beats UI polish at every stage.
3. Score trust before score automation. Keep human sampling high until agreement is proven.
4. Compliance on a schedule, not on demand. SOC 2 and adverse-impact tooling take longer than any feature.
5. Validity from day one. It cannot be back-filled.
