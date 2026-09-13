import { describe, expect, it } from "vitest";
import { loadConfig } from "@dayone/config";
import { asProblemId, asAgentProviderId } from "@dayone/core";
import { buildContainer } from "./container.js";
import { buildServer } from "./server.js";

describe("api smoke", () => {
  it("lists problems and creates a link with allowed agents", async () => {
    const config = loadConfig({ NODE_ENV: "test", TOKEN_SIGNING_SECRET: "test-secret-123" });
    const c = buildContainer(config);
    await c.repos.problems.upsert({
      id: asProblemId("demo"), title: "Demo", summary: "A demo problem for tests", mode: "build", level: "mid", stack: ["node"], timeBudgetMinutes: 60,
      repo: { url: "https://github.com/dayone/demo", ref: "main" }, sandbox: { template: "dayone-base", vcpu: 2, memoryMb: 4096, ports: [], egress: [] },
      agents: { allowedDefault: [asAgentProviderId("claude-code"), asAgentProviderId("codex")], budgetMinor: 500 }, variants: [], dimensions: { primary: ["testing"], secondary: [] },
    });
    const app = await buildServer(c, config);
    const list = await app.inject({ method: "GET", url: "/v1/company/problems" });
    expect(list.json().problems).toHaveLength(1);
    const link = await app.inject({ method: "POST", url: "/v1/company/links", payload: { problemId: "demo", allowedAgents: ["claude-code"] } });
    expect(link.statusCode).toBe(200);
    expect(link.json().url).toContain("/i/");
    const token = link.json().url.split("/i/")[1];
    const redeem = await app.inject({ method: "POST", url: "/v1/candidate/links/redeem", payload: { token } });
    expect(redeem.json().autoSelected).toBe(true);
    expect(redeem.json().agents[0].id).toBe("claude-code");
  });
});
