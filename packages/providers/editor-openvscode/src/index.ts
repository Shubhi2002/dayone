import { asEditorProviderId, ProviderError } from "@dayone/core";
import type { EditorEndpoint, EditorInstallContext, EditorProvider, EditorStartOptions } from "@dayone/ports";

export const OPENVSCODE_EDITOR_ID = asEditorProviderId("openvscode");
const BIN = "/opt/openvscode/bin/openvscode-server";
const DATA_DIR = "/home/user/.openvscode-server";

export function createOpenVscodeEditorProvider(): EditorProvider {
  return {
    descriptor: { id: OPENVSCODE_EDITOR_ID, displayName: "VS Code (OpenVSCode Server)", capabilities: { extensions: true, embeddable: true, connectionToken: true } },
    async install(ctx: EditorInstallContext): Promise<void> {
      const r = await ctx.sandbox.exec(ctx.handle, `test -x ${BIN} && echo present`);
      if (!r.stdout.includes("present")) throw new ProviderError("OpenVSCode Server missing from template; bake it into the image");
    },
    async installExtension(ctx: EditorInstallContext, vsixOrId: string): Promise<void> {
      const target = vsixOrId === "dayone.trace" ? "/opt/dayone/dayone-trace.vsix" : vsixOrId;
      const r = await ctx.sandbox.exec(ctx.handle, `${BIN} --server-data-dir ${DATA_DIR} --install-extension ${target}`, { timeoutMs: 120_000 });
      if (r.exitCode !== 0) throw new ProviderError(`Extension install failed: ${vsixOrId}`, { stderr: r.stderr.slice(0, 500) });
    },
    async start(ctx: EditorInstallContext, opts: EditorStartOptions): Promise<EditorEndpoint> {
      const settings = JSON.stringify({
        "extensions.autoUpdate": false, "extensions.autoCheckUpdates": false, "workbench.enableExperiments": false,
        "telemetry.telemetryLevel": "off", "workbench.startupEditor": "none", "security.workspace.trust.enabled": false,
        ...opts.settings,
      });
      await ctx.sandbox.writeFiles(ctx.handle, [{ path: `${DATA_DIR}/data/Machine/settings.json`, content: settings }]);
      for (const ext of opts.extensionsToInstall) await this.installExtension(ctx, ext);
      await ctx.sandbox.exec(ctx.handle,
        `${BIN} --host 0.0.0.0 --port ${opts.port} --connection-token ${opts.connectionToken} --server-data-dir ${DATA_DIR} --disable-telemetry --default-folder ${ctx.workspacePath} > /tmp/openvscode.log 2>&1`,
        { background: true });
      // Wait for the port.
      for (let i = 0; i < 30; i++) {
        const r = await ctx.sandbox.exec(ctx.handle, `curl -s -o /dev/null -w '%{http_code}' http://localhost:${opts.port}/?tkn=${opts.connectionToken} || true`);
        if (r.stdout.trim().startsWith("2") || r.stdout.trim().startsWith("3")) break;
        await new Promise((res) => setTimeout(res, 500));
      }
      const base = await ctx.sandbox.exposeUrl(ctx.handle, opts.port);
      return { url: `${base}/?tkn=${opts.connectionToken}&folder=${encodeURIComponent(ctx.workspacePath)}`, port: opts.port };
    },
  };
}
