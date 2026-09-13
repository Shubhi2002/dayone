# Domain model and glossary

Status: v0.1 · 13 September 2026 · mirrors `packages/core`

## Glossary

| Term | Meaning |
| --- | --- |
| **Company** | A customer organisation. Has users (hiring managers, recruiters). |
| **Problem** | A problem statement: a separate repository following `PROBLEM-FORMAT.md`, pinned by ref, with a mode, level, stack, time budget, default allowed agents, ticket, hidden truth and rubric. The marketplace lists problems. |
| **Variant** | A concrete instance of a problem with parameters applied (names, numbers, decoy) so leaked solutions do not transfer. V0: hand-written variants. |
| **Mode** | The shape of the task: `build`, `debug`, `review`. V0 supports `build`. |
| **Agent** | An AI coding assistant available inside the sandbox, identified by `AgentProviderId` (`claude-code`, `codex`, …). Kinds: `ide-extension` (V0) or `hosted` (later). |
| **Interview link** | A single-use, signed URL created by a company for one candidate: problem, variant policy, allowed agents, time budget, expiry, role profile. Redeeming it creates a Session. |
| **Session** | One candidate working one problem once. Owns the state machine, the chosen agent, the sandbox handle, the trace, the snapshots, the report. |
| **Sandbox** | The isolated VM for one session, created by a `SandboxProvider` from the problem's template. Destroyed after submit. |
| **Trace** | The append-only sequence of events for a session (`EVENTS.md`). The primary input to scoring. |
| **Snapshot** | The working tree at a point in time (hidden-branch commit); the final snapshot is the diff that gets graded alongside the trace. |
| **Report** | Score, dimension scores, key moments, evidence, debrief questions, written answers; company view and candidate view. |
| **Role profile** | Weights per dimension for a level and role (for example senior backend). |
| **Rubric item** | One observable behaviour anchored at 9 / 6 / 3, defined in the problem's hidden folder, graded from the trace. |
| **Agent gateway** | Our proxy for model traffic; issues per-session virtual keys; logs and meters. |

## Entities

```
Company ──< CompanyUser
Company ──< InterviewLink >── Problem (repo ref, mode, level, stack, timeBudget, allowedAgents default)
InterviewLink ──1 Session ──1 SandboxHandle
Session ──< TraceEvent
Session ──< Snapshot
Session ──1 Report ──< DimensionScore, KeyMoment, RubricItemScore
Session ──1 AgentSelection (AgentProviderId, model, gateway key id)
```

All IDs are branded strings (`SessionId`, `ProblemId`, `LinkId`, `CompanyId`, `AgentProviderId`). Money is in integer minor units. Times are ISO-8601 UTC strings at the boundary and `Date` inside.

## Session state machine

```
created ──▶ agent_selected ──▶ provisioning ──▶ live ⇄ paused
   │              │                 │              │
   │              │                 └─▶ failed     ├─▶ submitted ──▶ grading ──▶ graded ──▶ reported
   │              │                                └─▶ expired
   └──────────────┴──▶ expired
```

| State | Entered when | Invariants |
| --- | --- | --- |
| `created` | Link redeemed (candidate opened it) | No sandbox yet. Allowed agents copied from the link. |
| `agent_selected` | Candidate chose one of the allowed agents | `agent` is set and is in `allowedAgents`. |
| `provisioning` | Orchestrator started creating the sandbox | Idempotent: retry is safe; at most one sandbox per session. |
| `live` | Editor reachable, runtime registered | Clock running against `timeBudget`. Events accepted only in `live` and `paused`. |
| `paused` | Idle > 10 min or candidate paused | Sandbox paused if the provider supports it; clock stopped. |
| `submitted` | Candidate submitted wrap-up | No more events accepted after final snapshot; sandbox scheduled for destruction. |
| `grading` | Grading job started | |
| `graded` | Pipeline and human review complete | Report exists; company can see it. |
| `reported` | Company decision recorded | Candidate view unlocked. |
| `expired` | Link or session time exceeded | Sandbox destroyed; partial trace retained. |
| `failed` | Provisioning or runtime failure | Sandbox destroyed; error recorded; candidate offered retry. |

Transitions are the only way to change state (`Session.transition(to)` in `core`), and each emits a domain event (`session.<state>`) that also lands in the trace.

## Domain rules worth encoding

- A candidate can choose only from the link's `allowedAgents`; if the list has one entry, selection is automatic.
- `hidden` problem content is never part of any entity that leaves the scenario service except `GradingInput`.
- A session's `timeBudget` is a guide for the candidate and a hard stop only at `timeBudget × 1.5`.
- Events with a timestamp earlier than the last accepted event by more than 60 s are stored but flagged (`clock_skew`).
- Nothing in `core` knows about E2B, VS Code, Claude or Codex; those are `AgentProviderId` and `SandboxProviderId` values.
