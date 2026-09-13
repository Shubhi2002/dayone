import { describe, expect, it } from "vitest";
import { Session } from "./session.js";
import { asAgentProviderId, asCompanyId, asLinkId, asProblemId, asSessionId } from "./ids.js";

const base = () => Session.create({
  id: asSessionId("s1"), linkId: asLinkId("l1"), companyId: asCompanyId("c1"), problemId: asProblemId("p1"),
  problemRef: "main", variant: "a", allowedAgents: [asAgentProviderId("claude-code")], timeBudgetMinutes: 60, createdAt: new Date(),
});

describe("Session state machine", () => {
  it("follows the happy path", () => {
    const s = base(); const now = new Date();
    s.selectAgent({ agent: asAgentProviderId("claude-code"), model: null, gatewayKeyId: null, selectedAt: now }, now);
    s.transition("provisioning", now); s.transition("live", now); s.transition("submitted", now);
    s.transition("grading", now); s.transition("graded", now); s.transition("reported", now);
    expect(s.state).toBe("reported");
  });
  it("rejects agents outside the allowed list", () => {
    const s = base();
    expect(() => s.selectAgent({ agent: asAgentProviderId("codex"), model: null, gatewayKeyId: null, selectedAt: new Date() }, new Date())).toThrow();
  });
  it("rejects invalid transitions", () => {
    expect(() => base().transition("live", new Date())).toThrow();
  });
});
