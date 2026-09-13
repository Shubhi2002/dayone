# Trace events

Status: v0.1 · 13 September 2026 · schema in `packages/core/src/events` · `schemaVersion: 1`

The trace is the product. Every action in a session becomes an event with this envelope:

```ts
interface TraceEvent<T extends EventType = EventType> {
  schemaVersion: 1;
  id: string;             // ulid, assigned by the emitter
  sessionId: SessionId;
  type: T;                // dotted, past tense
  at: string;             // ISO-8601 UTC, emitter clock
  receivedAt?: string;    // set by ingest
  source: "extension" | "runtime" | "gateway" | "control-plane" | "agent-transcript";
  payload: EventPayload[T];
  flags?: ("clock_skew" | "replayed" | "unverified")[];
}
```

## Event types (V0)

| Type | Source | Payload highlights |
| --- | --- | --- |
| `session.created` … `session.reported` | control-plane | state, actor |
| `session.agent_selected` | control-plane | `agent: AgentProviderId`, `model` |
| `sandbox.provisioned` / `sandbox.destroyed` | control-plane | provider id, sandbox id, timings |
| `runtime.registered` / `runtime.heartbeat` | runtime | versions, uptime |
| `file.changed` | extension | `path`, `range`, `textLength`, `sourceHint: "human" \| "agent-suspected" \| "unknown"`, `contentHash` |
| `file.saved` | extension | `path`, `contentHash` |
| `editor.focus` | extension | `path` or `panel` |
| `terminal.command` | runtime | `command` (redacted), `cwd`, `exitCode`, `durationMs` |
| `tests.ran` | runtime | `suite: "visible" \| "graded" \| "candidate"`, `passed`, `failed`, `failures[]` |
| `agent.prompt` | gateway | `agent`, `vendor`, `model`, `inputTokens`, `promptHash`, `promptRef` (object storage) |
| `agent.completion` | gateway | `outputTokens`, `costMinor`, `latencyMs`, `completionRef` |
| `agent.tool_call` | agent-transcript | `tool`, `argsHash`, `outcome: "accepted" \| "rejected" \| "auto" \| "unknown"` |
| `agent.budget_exhausted` | gateway | spent, cap |
| `snapshot.taken` | runtime | `ref`, `filesChanged`, trigger |
| `candidate.note` | extension or shell | text |
| `candidate.answer` | control-plane | question id, text |
| `integrity.flag` | control-plane | kind, confidence, evidence event ids (never a verdict) |

Full payload schemas are Zod objects in `core`; ingest rejects anything that does not validate.

## Rules

1. **Append-only.** Events are never updated or deleted except by whole-session deletion for privacy requests.
2. **Emitters assign ids and timestamps**; ingest adds `receivedAt` and flags skew rather than rewriting `at`.
3. **Large content lives in object storage.** Events carry hashes and refs, not file bodies or full prompts.
4. **Redaction at the emitter.** Secrets, tokens and emails are redacted before an event leaves the sandbox; ingest redacts again.
5. **Versioning.** Adding an optional field is non-breaking. Renaming, removing or changing semantics bumps `schemaVersion`; readers must handle all versions still in storage.
6. **Everything from a sandbox is untrusted.** Ingest validates the session token, the schema, and rate limits per session.

## Derived data

Process signals (`SCORING.md`) are computed from events and stored separately; they are never written back as events. Key moments reference event ids.
