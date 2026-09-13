# Roadmap: V0 and checkpoints

Status: v0.2 · 13 September 2026 · weekly sprints · two engineers plus a founder on problems, partners and grading

## V0 shipped means

> A real company picks a Build problem, chooses the allowed agents, generates a link; a real candidate completes the task in our E2B sandbox using the agent they chose; the company reads a report with a score, key moments and a replay; the session cost us under $20.

Target: first real candidate at a design partner by the end of week 4; three partners running sessions by week 6.

## Build order

```
Week 0   manual run of problem one with friendly engineers → learn what the report must say
Week 1   link → sandbox → IDE in the browser                        CP1
Week 2   agent choice → agent extension via gateway → trace → replay CP2
Week 3   submit → grading → report                                   CP3
Week 4   marketplace → allowed agents → generate link → sessions → report view   CP4 = shipped
Week 6   three partners, real data, next-mode decision               CP5
```

The riskiest, most novel path first (sandbox, agent, trace); the console last. Human grading before automated grading. One problem until it is great, then three. Manual for anything that runs fewer than 30 times a week.

## Checkpoints

### CP0 · Day 3 · Decisions locked, spike done
- E2B template with the problem-one repo and OpenVSCode Server reachable from a browser; cold and warm start, resume and hourly cost measured.
- `.dayone/problem.yaml` for problem one written and reviewed by one external senior engineer.
- Claude Code and Codex extensions confirmed to install in OpenVSCode Server and to honour a custom base URL for the agent gateway.
- Three design partners committed with candidates expected in weeks 4 to 6.
- Go/no-go: does the IDE render inside our shell's iframe? If not, switch to the extension-based shell now.

### CP1 · End of week 1 · "Hello, sandbox"
- Signed link → cookie → VM from template → IDE in our shell in under 10 s warm, under 60 s cold.
- Tests run from the terminal; graded tests outside the writable tree; egress allow-list on.
- Session destroyed on close or after 2 hours; snapshot saved; reconnect restores the VM.
- Go/no-go: three team members complete problem one without leaving the shell.

### CP2 · End of week 2 · "Agent and trace"
- Candidate chooses an agent from the link's allowed set; the runtime installs only that extension and points it at the agent gateway.
- Gateway logs prompts, completions, tokens and cost per session; budget enforced.
- Dayone extension emits edits (source-tagged), saves, commands, test results; snapshotter every 30 s; transcripts shipped at end.
- Replay reconstructs the tree at any timestamp beside the gateway log.
- Go/no-go: every file change in an internal session is explained by a human edit or an agent action.

### CP3 · End of week 3 · "First report"
- Wrap-up questions; submit → snapshot → destroy → grading job; signals; 5 rubric-agent runs per item with evidence; reconciler; human review UI; report page with V0 scope.
- Five friendly external engineers complete problem one; each report hand-reviewed; cost per session measured.
- Go/no-go: a founder reading only the report reaches the same view as after the full replay for at least 4 of 5.

### CP4 · End of week 4 · "V0 shipped"
- Console: magic-link login, marketplace with three problems and preview, generate link with allowed agents, sessions list, report and replay, email invitation with candidate notice.
- Legal minimum: candidate notice, privacy notice, DPA template, 12-month retention, deletion by email.
- Design partner one runs one real candidate.
- Go/no-go: the partner used the report in their debrief.

### CP5 · End of week 6 · "Three partners, real data"
- ≥ 15 real sessions; completion, survey, cost, time-to-report, agent-vs-human agreement measured.
- Decisions: next mode (default Review), whether human review can drop below 100%, agent model defaults per agent, whether to start the variant generator.

## Deferred, with triggers

| Item | Pull forward when |
| --- | --- |
| Debug mode (telemetry synthesis, multi-service) | Two of three partners ask for it at CP5 |
| Review mode (diff viewer, light VM) | Default next mode after CP5 |
| Hosted agent (`AgentProvider.kind = "hosted"`) with first-class apply/decline gate | Transcript-based accept/reject proves too lossy for scoring, or planted suggestions are needed |
| Repo forking onto customer code | A paying partner requires it |
| Variant generator | Any leakage signal, or > 50 sessions on one problem |
| Warm pool > 2 per problem | Median start > 10 s or > 20 sessions/day |
| ATS integrations, SSO | First enterprise-shaped partner |
| Percentiles and recommendation bands | n ≥ 30 per problem |
| Split sittings, ID verification | Partner request |
| Self-hosted sandboxes (Go fleet manager) | Spend > $5k/month, VPC requirement, or provider limits |
| Dispute UI, PDF export | > 5 disputes/month, or a partner asks |
| Candidate practice tier | B2B revenue covers the team |

## Weekly cadence

Monday plan against the current checkpoint only; daily 15 minutes on "what blocks the checkpoint"; Friday demo to partners even when ugly; every session's replay watched and hand-graded by the founder until CP5 says otherwise; deferred list re-ranked only at CP5.

## Pre-decided responses to date risks

| Risk | Response |
| --- | --- |
| IDE iframe is fragile | After 3 days, ship the guide as a webview extension; IDE becomes the page |
| An agent extension will not honour a custom base URL | Route that agent through a sandbox-local proxy that rewrites the vendor host; if impossible, drop it from the V0 allowed set |
| E2B limits (session length, concurrency) | Pro plan; alternate provider behind `SandboxProvider` |
| Trace gaps at CP2 | Rely on snapshotter for attribution; mark the gap in the report; fix week 5 |
| Poor grader agreement at CP3 | Human-confirmed scores only; automated score internal |
| Partner slips | Three more friendly externals so CP4 still exercises the loop |
| Cost > $20/session | Smaller VM for Node problems; cheaper default model per agent; 3 grader runs with human confirmation |
