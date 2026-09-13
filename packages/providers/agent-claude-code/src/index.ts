import type { TraceEvent } from "@dayone/core";
import { asAgentProviderId } from "@dayone/core";
import type { AgentConfiguration, AgentConfigureContext, AgentInstallContext, AgentProvider, TranscriptMeta } from "@dayone/ports";
import { parseTranscriptLines } from "./transcript.js";

export const CLAUDE_CODE_AGENT_ID = asAgentProviderId("claude-code");
const EXTENSION_ID = "anthropic.claude-code";

export function createAgentClaudeCodeProvider(): AgentProvider {
  return {
    descriptor: {
      id: CLAUDE_CODE_AGENT_ID, displayName: "Claude Code",
      capabilities: { reportsProposals: true, customBaseUrl: true, models: ["claude-opus-5", "claude-sonnet-5"], headless: false },
    },
    kind: "ide-extension",
    vendors: ["anthropic"],
    async install(ctx: AgentInstallContext): Promise<void> {
      // Prefer a VSIX pinned in the template; fall back to the marketplace id.
      await ctx.editor.installExtension({ sandbox: ctx.sandbox, handle: ctx.handle, workspacePath: ctx.workspacePath }, EXTENSION_ID);
    },
    async configure(ctx: AgentConfigureContext): Promise<AgentConfiguration> {
      // Point the extension at the agent gateway with the per-session virtual key. Vendor keys never enter the VM.
      const env: Record<string, string> = { ANTHROPIC_BASE_URL: ctx.gatewayBaseUrl, ANTHROPIC_API_KEY: ctx.gatewayKey, ...(ctx.model ? { ANTHROPIC_MODEL: ctx.model } : {}) };
      return {
        env,
        editorSettings: { "claude-code.model": ctx.model ?? undefined },
        files: [{ path: "/home/user/.dayone/agent.env", content: Object.entries(env).map(([k, v]) => `${k}=${v}`).join("\n") + "\n" }],
      };
    },
    transcriptPaths(): string[] { return ["/home/user/.claude/projects/*/*.jsonl"]; },
    parseTranscript(raw: Uint8Array, meta: TranscriptMeta): TraceEvent[] { return parseTranscriptLines(Buffer.from(raw).toString("utf8"), meta, CLAUDE_CODE_AGENT_ID); },
  };
}
