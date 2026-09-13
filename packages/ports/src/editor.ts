import type { EditorProviderId, SandboxHandle } from "@dayone/core";
import type { ProviderDescriptor } from "./descriptor.js";
import type { SandboxProvider } from "./sandbox.js";

export interface EditorCapabilities { extensions: boolean; embeddable: boolean; connectionToken: boolean; }
export interface EditorInstallContext { sandbox: SandboxProvider; handle: SandboxHandle; workspacePath: string; }
export interface EditorStartOptions { port: number; connectionToken: string; extensionsToInstall: string[]; settings: Record<string, unknown>; }
export interface EditorEndpoint { url: string; port: number; }

export interface EditorProvider {
  descriptor: ProviderDescriptor<EditorProviderId, EditorCapabilities>;
  /** Ensure the editor binary is present (usually baked into the template; this is the fallback). */
  install(ctx: EditorInstallContext): Promise<void>;
  installExtension(ctx: EditorInstallContext, vsixOrId: string): Promise<void>;
  start(ctx: EditorInstallContext, opts: EditorStartOptions): Promise<EditorEndpoint>;
}
