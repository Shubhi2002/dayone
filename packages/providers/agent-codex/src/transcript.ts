import { createHash } from "node:crypto";
import type { AgentProviderId, TraceEvent } from "@dayone/core";
import type { TranscriptMeta } from "@dayone/ports";

/**
 * Best-effort parser for the agent's JSONL transcript into `agent.tool_call` events.
 * The exact transcript shape is vendor-specific and changes; keep this tolerant and unit-tested with fixtures.
 */
export function parseTranscriptLines(text: string, meta: TranscriptMeta, agent: AgentProviderId): TraceEvent[] {
  const out: TraceEvent[] = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    let rec: Record<string, unknown>;
    try { rec = JSON.parse(line) as Record<string, unknown>; } catch { continue; }
    const tool = pickString(rec, ["tool", "name", "tool_name"]);
    if (!tool) continue;
    const outcome = normaliseOutcome(pickString(rec, ["outcome", "status", "decision"]));
    const at = pickString(rec, ["timestamp", "ts", "time"]) ?? new Date().toISOString();
    out.push({
      schemaVersion: 1, id: createHash("sha1").update(meta.path + line).digest("hex").slice(0, 26), sessionId: meta.sessionId,
      at: new Date(at).toISOString(), source: "agent-transcript", type: "agent.tool_call",
      payload: { agent, tool, argsHash: createHash("sha256").update(JSON.stringify(rec["input"] ?? rec["args"] ?? {})).digest("hex"), outcome },
    });
  }
  return out;
}
function pickString(rec: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) { const v = rec[k]; if (typeof v === "string") return v; }
  return undefined;
}
function normaliseOutcome(v: string | undefined): "accepted" | "rejected" | "auto" | "unknown" {
  if (!v) return "unknown";
  const s = v.toLowerCase();
  if (["accepted", "approved", "allow", "allowed", "yes"].includes(s)) return "accepted";
  if (["rejected", "denied", "deny", "no", "cancelled"].includes(s)) return "rejected";
  if (["auto", "auto_approved", "bypass"].includes(s)) return "auto";
  return "unknown";
}
