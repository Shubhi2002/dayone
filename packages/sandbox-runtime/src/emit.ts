import { randomBytes } from "node:crypto";
import type { EventPayload, EventSource, EventType, TraceEvent } from "@dayone/core";

/** Build a well-formed event locally; the shipper sends it. */
export function makeEvent<T extends EventType>(sessionId: string, source: EventSource, type: T, payload: EventPayload<T>): TraceEvent {
  return { schemaVersion: 1, id: `${Date.now().toString(32)}${randomBytes(8).toString("hex")}`, sessionId, at: new Date().toISOString(), source, type, payload } as TraceEvent;
}
