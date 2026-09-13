import type { TraceEvent } from "@dayone/core";

/** Deterministic process signals from the trace (docs/SCORING.md). Pure function; unit-test it heavily. */
export interface ProcessSignals {
  eventCount: number;
  testsRanBeforeFirstEdit: boolean;
  firstEditAt: string | null;
  testRuns: number;
  agentPrompts: number;
  agentToolCalls: number;
  agentAccepted: number;
  agentRejected: number;
  agentCostMinor: number;
  snapshots: number;
}

export function extractSignals(events: TraceEvent[]): ProcessSignals {
  const sorted = [...events].sort((a, b) => a.at.localeCompare(b.at));
  const s: ProcessSignals = {
    eventCount: sorted.length, testsRanBeforeFirstEdit: false, firstEditAt: null, testRuns: 0,
    agentPrompts: 0, agentToolCalls: 0, agentAccepted: 0, agentRejected: 0, agentCostMinor: 0, snapshots: 0,
  };
  let sawTestBeforeEdit = false;
  for (const e of sorted) {
    switch (e.type) {
      case "tests.ran": s.testRuns++; if (!s.firstEditAt) sawTestBeforeEdit = true; break;
      case "file.changed": if (!s.firstEditAt) { s.firstEditAt = e.at; s.testsRanBeforeFirstEdit = sawTestBeforeEdit; } break;
      case "agent.prompt": s.agentPrompts++; break;
      case "agent.completion": s.agentCostMinor += e.payload.costMinor; break;
      case "agent.tool_call":
        s.agentToolCalls++;
        if (e.payload.outcome === "accepted") s.agentAccepted++;
        if (e.payload.outcome === "rejected") s.agentRejected++;
        break;
      case "snapshot.taken": s.snapshots++; break;
      default: break;
    }
  }
  return s;
}
