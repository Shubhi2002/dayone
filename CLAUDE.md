# Contributing to Dayone (for AI agents and humans)

This file is read by coding agents working in this repository. Keep it short, current and specific. `AGENTS.md` points here.

## What this repo is

The Dayone platform: a control plane, an in-sandbox runtime, and provider plugins for running AI-assisted engineering interviews in isolated sandboxes. Product context is in `README.md`; system design in `docs/ARCHITECTURE.md`; binding decisions in `docs/DECISIONS.md`. Read those three before changing anything structural.

## Non-negotiables

1. **Respect the layer rule.** `packages/core` has no I/O and imports nothing from other packages. `packages/application` imports only `core` and `ports`. `packages/infrastructure` and `packages/providers/*` implement `ports`. `apps/*` are the only places that construct concrete providers. If you need something from a lower layer, define a port.
2. **Everything pluggable goes behind a port.** Sandbox, editor, agent, SCM, repositories, queue, storage, clock, ids, mailer, model gateway. Never call the E2B SDK, a database client or an HTTP client from `application` or `core`.
3. **Trace events are a public schema.** Changing `packages/core/src/events` requires a version bump in the event `schemaVersion`, a note in `docs/EVENTS.md`, and backward-compatible readers.
4. **No secrets in the sandbox image or in events.** Provider API keys never enter a VM; the sandbox gets per-session tokens only. Never log them.
5. **Candidate code is hostile input.** Anything arriving from a sandbox (events, files, transcripts) is validated with Zod at the boundary before use.
6. **Hidden problem content stays hidden.** `.dayone/hidden/` in a problem repo must never reach a candidate sandbox or a candidate-facing response.
7. **TypeScript strict, ESM, Node 22.** No `any` without a comment explaining why. No default exports except where a framework requires them.

## Working conventions

- **Package manager:** npm workspaces (`npm install` at the root). Node 22.
- **Build:** `npm run typecheck` (tsc project references) must pass before you finish. `npm run test` runs Vitest.
- **Folder shape inside a package:** `src/index.ts` re-exports the public surface; keep internals out of `index.ts`.
- **Naming:** ports are `XxxProvider` or `XxxRepository`/`XxxStore`; use cases are verbs (`StartSession`); domain events are past tense (`session.started`).
- **Errors:** throw `DomainError` subclasses from `core`; map to HTTP in `apps/api` only.
- **IDs:** `SessionId`, `ProblemId` etc. are branded strings from `core/ids.ts`; never pass raw strings across layers.
- **Config:** read environment only through `packages/config`. Add new variables to `.env.example` and the Zod schema together.
- **Tests:** unit tests next to code as `*.test.ts`; use the in-memory adapters in `infrastructure` and `providers/sandbox-local`, never a real cloud in unit tests.
- **Docs:** if you change behaviour described in `docs/`, update the doc in the same change. Decisions with lasting consequences get an entry in `docs/DECISIONS.md`.
- **Commits:** small, one concern each. Do not commit generated PNGs unless the source HTML changed.

## How the pieces connect (30-second version)

```
company console ──▶ apps/api ──▶ application use cases ──▶ ports
                                                     │
        providers: sandbox-e2b · editor-openvscode · agent-claude-code · agent-codex · scm-github
                                                     │
                       sandbox VM: sandbox-runtime (bootstrap, event shipper) + vscode-extension
                                                     │
                                  events ──▶ apps/api ingest ──▶ TraceStore ──▶ apps/worker grading
```

## Where to add things

| You want to… | Put it in |
| --- | --- |
| Support a new sandbox vendor | `packages/providers/sandbox-<name>` implementing `SandboxProvider`; register in `apps/api/src/container.ts` |
| Support a new AI agent | `packages/providers/agent-<name>` implementing `AgentProvider`; declare its `kind`, capabilities and required credentials |
| Support a new editor | `packages/providers/editor-<name>` implementing `EditorProvider` |
| Add a new trace event | `packages/core/src/events/` + `docs/EVENTS.md` + the emitter (extension or runtime) + any consumer |
| Add a use case | `packages/application/src/use-cases/` with its own input/output types and a unit test |
| Add an HTTP route | `apps/api/src/routes/`; validate with Zod; call one use case; no business logic in routes |
| Add a background job | `apps/worker/src/jobs/`; job payloads are typed in `application` |
| Add a problem | A **separate repository** following `docs/PROBLEM-FORMAT.md`; start from `examples/problem-template` |

## Things that look tempting and are wrong here

- Putting E2B calls directly in a route handler.
- Storing which agent a candidate chose as a free-text string; use `AgentProviderId`.
- Letting the sandbox call the model vendor directly with our key; it must go through the model gateway with a per-session token.
- Grading from the final diff alone; the trace is the primary input.
- Adding a second language "just for this service".
