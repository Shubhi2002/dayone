import { describe, expect, it } from "vitest";
import type { TraceEvent } from "@dayone/core";
import { extractSignals } from "./signals.js";

const ev = (type: TraceEvent["type"], payload: unknown, at: string): TraceEvent =>
  ({ schemaVersion: 1, id: at, sessionId: "s", at, source: "runtime", type, payload } as TraceEvent);

describe("extractSignals", () => {
  it("detects tests run before the first edit", () => {
    const s = extractSignals([
      ev("tests.ran", { suite: "visible", passed: 5, failed: 1, failures: [] }, "2026-01-01T00:00:01Z"),
      ev("file.changed", { path: "a", textLength: 1, contentHash: "a".repeat(32), sourceHint: "human" }, "2026-01-01T00:00:02Z"),
    ]);
    expect(s.testsRanBeforeFirstEdit).toBe(true);
    expect(s.testRuns).toBe(1);
  });
});
