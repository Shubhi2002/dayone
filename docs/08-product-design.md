# 08 · Product design

Status: draft v1 · September 2026 · mockups in `../mockups/`

## Three surfaces, one engine

```
Candidate workspace ◀──┐
                        ├── Simulation engine (scenarios, sandboxes, events, agent, trace)
Recruiter console  ◀───┘        │
                                ▼
                         Scoring pipeline (see 07) ──▶ Reports
```

Everything the candidate does happens inside a Dayone sandbox in the browser. Nothing is installed locally. The agent runs inside the sandbox too, so its full activity is part of the trace.

## Candidate experience

### Principles

1. **It should feel like a good first day, not an exam.** A ticket, a codebase, tooling that works, a colleague (the agent), and a clear goal. No trick questions, no "gotcha" phrasing.
2. **Everything a real engineer would have is there.** Logs, metrics, database, tests, runbook, deploy history, the agent. If it would be unrealistic to withhold it, do not withhold it.
3. **Using AI is expected and visible.** The agent panel is always open. The UI says plainly that prompts are part of the assessment. No hidden judgement.
4. **Time pressure is honest.** One visible timer, generous for the intended level, and rounds that state their own budget. Operate scenarios add pressure deliberately and say so.
5. **Nothing is lost.** Autosave every change. Reconnection restores state. A crash is our fault, never the candidate's.
6. **Respect at the end.** A clear submission step, a thank-you, an expected timeline, and later a report they can learn from.

### Before the session

- Invitation email from the company via Dayone with: what the format is, that AI is expected, how long it takes, what to have ready (nothing), and a link to a 10-minute **practice scenario** so the environment is not a surprise.
- Scheduling: candidate picks a start time within the company's window; the sandbox is warmed 5 minutes before.
- Identity: light-touch, see `09-anti-gaming-and-integrity.md`.
- Accessibility check: font size, colour theme, keyboard-only navigation, screen-reader compatibility of the editor and panels.

### During the session (see mockup 01)

Layout: ticket and file tree on the left; editor and a tabbed bottom panel (Terminal, Metrics, Logs, Database, Tests, Ports) in the centre; agent on the right; timer, round stepper and Submit in the top bar; status bar with test state and sandbox health.

- **The ticket** is written the way a real ticket is written: by a non-expert, with a goal, some context, and one or two things that are slightly wrong or vague.
- **Round stepper** shows where the candidate is and what is next, without revealing injected events.
- **Notes** panel for the candidate's own hypotheses and decisions. Encouraged, not required; counts as evidence for the judgment dimension.
- **Agent panel** behaves like a real CLI coding agent (reads files, runs commands, proposes diffs with apply/reject). Model is fixed per scenario and disclosed. A per-session token budget is shown; it is generous but finite, and running out is not a failure.
- **Events** (multi-round scenarios) arrive as a modal with a pager-style note, the changed requirements, and explicit objectives (see mockup 05). The round clock starts on acknowledge.
- **Submission** asks for the artefact plus a short written summary ("what did you find, what did you change, what would you do next with more time"). The summary is graded.

### After the session

- Immediate: confirmation, what happens next, expected date to hear back, and an optional 2-question experience survey.
- Later: the candidate report (see `06-engineering-score.md`, "What the candidate sees") once the company has communicated its decision, or immediately in practice mode.
- Candidates can request their data or its deletion at any time.

### Practice mode (candidate side, planned)

Same scenarios as hiring, marked "For practice," with the full report including the hidden truth after submission. Free tier with a monthly cap. Serves three purposes: candidate familiarity, brand, and scoring calibration data. Hiring scenarios and practice scenarios are drawn from different variant pools of the same family so practice does not leak hiring content.

## Recruiter and hiring-team experience

### Personas

- **Hiring manager / engineering lead**: chooses scenarios, reads reports, runs debriefs.
- **Recruiter coordinator**: invites candidates, tracks completion, syncs with the ATS.
- **Interviewer / calibration engineer**: watches replays, disputes or annotates scores, writes debrief notes.

### Console (see mockup 03)

- **Overview**: live sessions, pending reports, completion rate, time-to-report.
- **Scenario library**: filter by mode, level, stack, length. Preview any scenario as a candidate would see it. Assign as-is or **fork** onto a connected repo (the rubric adapts; the sandbox builds from the customer's Dockerfile). Each scenario shows sessions run, completion rate, and which dimensions it carries.
- **Assessments**: a configured loop for a role: scenarios, order, time limits, role profile weights, recommendation bands, who receives reports.
- **Candidates**: pipeline table with status, score, strongest dimension, and next action. Bulk invite via CSV or ATS.
- **Reports**: the Engineering Score report (see mockup 02), with replay, key moments, dispute button, share link with expiry, PDF export.
- **Integrations**: Greenhouse, Lever, Ashby first; SSO; Slack notifications.
- **Settings**: team, roles, data retention, candidate-facing branding (logo and colour on the invitation and workspace header).

### Report design principles (mockup 02)

- Score and recommendation are visible in two seconds; evidence is one click away.
- Every dimension shows a bar, a number and, on hover, the rubric items and key moments that produced it.
- Process signals are shown as plain-language statements ("Reproduced before touching code"), not only as metrics.
- The report includes what to ask in the debrief. It should make the human conversation better, not replace it.
- Grader agreement and human-review status are always visible. Uncertainty is shown, not hidden.

### Replay

A timeline scrubber over the session: reading, running, editing and prompting phases colour-coded; key moments as markers. Clicking a moment shows the editor, terminal and agent panel at that instant. Playback at 1× to 8×. Interviewers can annotate moments; annotations are visible to the hiring team and to the calibration queue.

## The simulation engine

The engine is what makes Dayone a simulator rather than a code editor with a question. Conceptually:

| Component | Responsibility |
| --- | --- |
| **Scenario package** | Code repo(s), Dockerfile or compose, seed data, telemetry generators, ticket text, hidden truth, traps, events, rubric, variant parameters. Versioned. |
| **Variant generator** | Produces a concrete instance from a scenario package: renamed identifiers, shifted numbers, alternate red herring, different trap ordering. Same rubric. |
| **Sandbox** | Isolated per-session environment running the scenario's services, with the agent, a terminal, and network egress restricted to what the scenario allows. Warm pool for fast start. Destroyed after the session; trace retained. |
| **Telemetry synthesiser** | Generates realistic logs and metrics consistent with the hidden truth, including the deploy marker and the red herring. Metrics respond to the candidate's changes (a fixed service really does show lower p95 in the load test). |
| **Event scheduler** | Fires round transitions and injected events on time or on trigger (for example, when round-1 tests go green). |
| **Agent host** | Runs the coding agent inside the sandbox with a fixed model, records all I/O, enforces the token budget, and exposes apply/reject controls so acceptances and rejections are explicit events. |
| **Trace recorder** | Append-only event log for the session; the single source of truth for scoring and replay. |

Scenario packages are the content asset. They must be authorable by senior engineers who are not Dayone employees within a few days each, with a linter that checks for the content principles in `05-sample-scenarios.md` (has a red herring, has an AI-favoured wrong answer, has variant axes, rubric anchors present).

## Accessibility, localisation, devices

- Keyboard-first; all panels reachable without a mouse.
- Light and dark themes from day one (the palette in `../mockups/tokens.css` has a dark counterpart in `../brand/brand.css`).
- English first; ticket text and UI strings localisable; code is code.
- Desktop only for candidates. Recruiter reports readable on mobile.
- Extended time and screen-reader mode available on request without justification.

## What we deliberately leave out

- Video or webcam. Not needed for the signal and harmful for trust.
- A talking AI interviewer. The scenario is the interviewer.
- Live pair-interview mode in v1. Possibly later as "join the session" for a human interviewer, but asynchronous is the wedge.
- Whiteboard-style design canvas. Design is expressed in a written trade-off doc and in code.
