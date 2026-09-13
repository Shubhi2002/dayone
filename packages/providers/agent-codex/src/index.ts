import type { TraceEvent } from "@dayone/core";
import { asAgentProviderId } from "@dayone/core";
import type { AgentConfiguration, AgentConfigureContext, AgentInstallContext, AgentProvider, TranscriptMeta } from "@dayone/ports";
import { parseTranscriptLines } from "./transcript.js";

export const CODEX_AGENT_ID = asAgentProviderId("codex");
const EXTENSION_ID = "openai.chatgpt";

export function createAgentCodexProvider(): AgentProvider {
  return {
    descriptor: {
      id: CODEX_AGENT_ID, displayName: "OpenAI Codex",
      capabilities: { reportsProposals: true, customBaseUrl: true, models: ["gpt-5-codex", "gpt-5"], headless: false },
    },
    kind: "ide-extension",
    vendors: ["openai"],
    async install(ctx: AgentInstallContext): Promise<void> {
      // Prefer a VSIX pinned in the template; fall back to the marketplace id.
      await ctx.editor.installExtension({ sandbox: ctx.sandbox, handle: ctx.handle, workspacePath: ctx.workspacePath }, EXTENSION_ID);
    },
    async configure(ctx: AgentConfigureContext): Promise<AgentConfiguration> {
      // Point the extension at the agent gateway with the per-session virtual key. Vendor keys never enter the VM.
      const env: Record<string, string> = { OPENAI_BASE_URL: ctx.gatewayBaseUrl, OPENAI_API_KEY: ctx.gatewayKey, ...(ctx.model ? { CODEX_MODEL: ctx.model } : {}) };
      return {
        env,
        editorSettings: { "codex.model": ctx.model ?? undefined },
        files: [{ path: "/home/user/.dayone/agent.env", content: Object.entries(env).map(([k, v]) => `${k}=${v}`).join("\n") + "\n" }],
      };
    },
    transcriptPaths(): string[] { return ["/home/user/.codex/sessions/**/*.jsonl"]; },
    parseTranscript(raw: Uint8Array, meta: TranscriptMeta): TraceEvent[] { return parseTranscriptLines(Buffer.from(raw).toString("utf8"), meta, CODEX_AGENT_ID); },
  };
}
