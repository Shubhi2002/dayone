import type { AgentKind, AgentProviderId, ModelVendor, SandboxHandle, SessionId } from "@dayone/core";
import type { TraceEvent } from "@dayone/core";
import type { ProviderDescriptor } from "./descriptor.js";
import type { EditorProvider } from "./editor.js";
import type { SandboxProvider } from "./sandbox.js";

export interface AgentCapabilities {
  reportsProposals: boolean;       // emits accept/reject of proposed edits (via transcript or hook)
  customBaseUrl: boolean;          // can be pointed at our gateway
  models: string[];                // pinnable models; first is default
  headless: boolean;
}
export interface AgentInstallContext { sandbox: SandboxProvider; handle: SandboxHandle; editor: EditorProvider; workspacePath: string; }
export interface AgentConfigureContext {
  sessionId: SessionId;
  gatewayBaseUrl: string;          // our agent gateway
  gatewayKey: string;              // per-session virtual key
  model: string | null;
  workspacePath: string;
}
export interface AgentConfiguration {
  env: Record<string, string>;
  editorSettings: Record<string, unknown>;
  files: { path: string; content: string }[];
}
export interface TranscriptMeta { sessionId: SessionId; path: string; }

export interface AgentProvider {
  descriptor: ProviderDescriptor<AgentProviderId, AgentCapabilities>;
  kind: AgentKind;
  vendors: ModelVendor[];
  install(ctx: AgentInstallContext): Promise<void>;
  configure(ctx: AgentConfigureContext): Promise<AgentConfiguration>;
  transcriptPaths(): string[];
  parseTranscript(raw: Uint8Array, meta: TranscriptMeta): TraceEvent[];
}
