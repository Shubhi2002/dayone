import { z } from "zod";

/** Trace event schema. See docs/EVENTS.md. Bump SCHEMA_VERSION on breaking changes. */
export const SCHEMA_VERSION = 1 as const;

export const EventSource = z.enum(["extension", "runtime", "gateway", "control-plane", "agent-transcript"]);
export type EventSource = z.infer<typeof EventSource>;

const iso = z.string().datetime({ offset: true });
const hash = z.string().regex(/^[a-f0-9]{16,64}$/);

export const payloads = {
  "session.state_changed": z.object({ from: z.string(), to: z.string(), actor: z.enum(["candidate", "company", "system"]) }),
  "session.agent_selected": z.object({ agent: z.string(), model: z.string().nullable() }),
  "sandbox.provisioned": z.object({ provider: z.string(), sandboxId: z.string(), coldStartMs: z.number().int().nonnegative() }),
  "sandbox.destroyed": z.object({ provider: z.string(), sandboxId: z.string(), reason: z.string() }),
  "runtime.registered": z.object({ runtimeVersion: z.string(), editor: z.string(), agent: z.string() }),
  "runtime.heartbeat": z.object({ uptimeMs: z.number().int().nonnegative() }),
  "file.changed": z.object({
    path: z.string(), textLength: z.number().int().nonnegative(), contentHash: hash,
    sourceHint: z.enum(["human", "agent-suspected", "unknown"]),
    range: z.object({ startLine: z.number().int(), endLine: z.number().int() }).optional(),
  }),
  "file.saved": z.object({ path: z.string(), contentHash: hash }),
  "editor.focus": z.object({ path: z.string().optional(), panel: z.string().optional() }),
  "terminal.command": z.object({ command: z.string(), cwd: z.string(), exitCode: z.number().int().nullable(), durationMs: z.number().int().nonnegative() }),
  "tests.ran": z.object({
    suite: z.enum(["visible", "graded", "candidate"]), passed: z.number().int(), failed: z.number().int(),
    failures: z.array(z.object({ name: z.string(), message: z.string().max(2000) })).max(200),
  }),
  "agent.prompt": z.object({ agent: z.string(), vendor: z.string(), model: z.string(), inputTokens: z.number().int(), promptHash: hash, promptRef: z.string() }),
  "agent.completion": z.object({ agent: z.string(), vendor: z.string(), model: z.string(), outputTokens: z.number().int(), costMinor: z.number().int(), latencyMs: z.number().int(), completionRef: z.string() }),
  "agent.tool_call": z.object({ agent: z.string(), tool: z.string(), argsHash: hash, outcome: z.enum(["accepted", "rejected", "auto", "unknown"]) }),
  "agent.budget_exhausted": z.object({ spentMinor: z.number().int(), capMinor: z.number().int() }),
  "snapshot.taken": z.object({ ref: z.string(), filesChanged: z.number().int(), trigger: z.enum(["interval", "save-burst", "submit", "manual"]) }),
  "candidate.note": z.object({ text: z.string().max(5000) }),
  "candidate.answer": z.object({ questionId: z.string(), text: z.string().max(10000) }),
  "integrity.flag": z.object({ kind: z.string(), confidence: z.number().min(0).max(1), evidence: z.array(z.string()) }),
} as const;

export type EventType = keyof typeof payloads;
export const EVENT_TYPES = Object.keys(payloads) as EventType[];

const envelopeBase = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  id: z.string().min(1),
  sessionId: z.string().min(1),
  at: iso,
  receivedAt: iso.optional(),
  source: EventSource,
  flags: z.array(z.enum(["clock_skew", "replayed", "unverified"])).optional(),
});

/** Validates the envelope, then the payload against the schema for `type`. Use at every boundary. */
export const TraceEventSchema = envelopeBase
  .extend({ type: z.enum(EVENT_TYPES as [EventType, ...EventType[]]), payload: z.unknown() })
  .superRefine((v, ctx) => {
    const r = payloads[v.type].safeParse(v.payload);
    if (!r.success) for (const i of r.error.issues) ctx.addIssue({ ...i, path: ["payload", ...i.path] });
  })
  .transform((v) => ({ ...v, payload: payloads[v.type].parse(v.payload) }));

export type TraceEvent = {
  [T in EventType]: z.infer<typeof envelopeBase> & { type: T; payload: z.infer<(typeof payloads)[T]> };
}[EventType];
export type EventPayload<T extends EventType> = z.infer<(typeof payloads)[T]>;

export function parseTraceEvent(input: unknown): TraceEvent {
  return TraceEventSchema.parse(input) as TraceEvent;
}
