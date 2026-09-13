import { describe, expect, it } from "vitest";
import { parseTraceEvent } from "./schema.js";

describe("TraceEventSchema", () => {
  it("accepts a valid file.saved event", () => {
    const e = parseTraceEvent({ schemaVersion: 1, id: "01J", sessionId: "s1", at: new Date().toISOString(), source: "extension",
      type: "file.saved", payload: { path: "src/a.ts", contentHash: "a".repeat(32) } });
    expect(e.type).toBe("file.saved");
  });
  it("rejects unknown types and bad payloads", () => {
    expect(() => parseTraceEvent({ schemaVersion: 1, id: "x", sessionId: "s", at: new Date().toISOString(), source: "runtime", type: "nope", payload: {} })).toThrow();
  });
});
