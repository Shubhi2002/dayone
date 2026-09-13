import { describe, expect, it } from "vitest";
import { candidateVisiblePaths, isHiddenPath } from "./strip.js";
describe("hidden path stripping", () => {
  it("removes .dayone/hidden and keeps the rest", () => {
    expect(candidateVisiblePaths([".dayone/hidden/rubric.yaml", ".dayone/ticket.md", "src/a.ts", "./.dayone/hidden/tests/t.js"]))
      .toEqual([".dayone/ticket.md", "src/a.ts"]);
    expect(isHiddenPath(".dayone/hiddenx/a")).toBe(false);
  });
});
