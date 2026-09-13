import type { SandboxHandle, SandboxId } from "@dayone/core";
import { asSandboxId, asSandboxProviderId, ProviderError } from "@dayone/core";
import type { ExecOptions, ExecResult, FileEntry, SandboxProvider, SandboxSpec, SnapshotRef } from "@dayone/ports";
import type { Sandbox as E2bSandbox } from "e2b";

export const E2B_SANDBOX_ID = asSandboxProviderId("e2b");
export interface E2bConfig { apiKey: string; defaultTemplate: string; }

/**
 * E2B implementation. Wraps the `e2b` SDK behind the SandboxProvider port.
 * Keep SDK types inside this file; map to ports types at the boundary.
 */
export function createE2bSandboxProvider(cfg: E2bConfig): SandboxProvider {
  // Lazy import so the package loads without the SDK in unit tests.
  const sdk = () => import("e2b");
  const live = new Map<SandboxId, E2bSandbox>();

  async function connect(h: SandboxHandle): Promise<E2bSandbox> {
    const cached = live.get(h.id);
    if (cached) return cached;
    const { Sandbox } = await sdk();
    const sb = await Sandbox.connect(h.id, { apiKey: cfg.apiKey });
    live.set(h.id, sb);
    return sb;
  }

  return {
    descriptor: {
      id: E2B_SANDBOX_ID, displayName: "E2B (Firecracker)",
      capabilities: { vmIsolation: true, pause: true, snapshot: true, egressPolicy: true, maxSessionMinutes: 24 * 60 },
    },
    async create(spec: SandboxSpec): Promise<SandboxHandle> {
      const { Sandbox } = await sdk();
      const sb = await Sandbox.create(spec.template || cfg.defaultTemplate, {
        apiKey: cfg.apiKey, timeoutMs: spec.timeoutMinutes * 60_000, envs: spec.env, metadata: spec.labels,
      });
      const id = asSandboxId(sb.sandboxId);
      live.set(id, sb);
      return { id, provider: E2B_SANDBOX_ID, createdAt: new Date(), meta: { template: spec.template } };
    },
    async get(id: SandboxId): Promise<SandboxHandle | null> {
      try { await connect({ id, provider: E2B_SANDBOX_ID, createdAt: new Date(), meta: {} }); return { id, provider: E2B_SANDBOX_ID, createdAt: new Date(), meta: {} }; }
      catch { return null; }
    },
    async exec(h: SandboxHandle, command: string, opts: ExecOptions = {}): Promise<ExecResult> {
      const sb = await connect(h);
      const t0 = Date.now();
      if (opts.background) { await sb.commands.run(command, { background: true, cwd: opts.cwd, envs: opts.env }); return { exitCode: null, stdout: "", stderr: "", durationMs: Date.now() - t0 }; }
      try {
        const r = await sb.commands.run(command, { cwd: opts.cwd, envs: opts.env, timeoutMs: opts.timeoutMs ?? 60_000 });
        return { exitCode: r.exitCode, stdout: r.stdout, stderr: r.stderr, durationMs: Date.now() - t0 };
      } catch (e) {
        const err = e as { exitCode?: number; stdout?: string; stderr?: string; message?: string };
        return { exitCode: err.exitCode ?? 1, stdout: err.stdout ?? "", stderr: err.stderr ?? err.message ?? String(e), durationMs: Date.now() - t0 };
      }
    },
    async writeFiles(h: SandboxHandle, files: FileEntry[]): Promise<void> {
      const sb = await connect(h);
      for (const f of files) await sb.files.write(f.path, typeof f.content === "string" ? f.content : toArrayBuffer(f.content));
    },
    async readFile(h: SandboxHandle, path: string): Promise<Uint8Array> {
      const sb = await connect(h);
      const bytes = await sb.files.read(path, { format: "bytes" });
      return bytes;
    },
    async exposeUrl(h: SandboxHandle, port: number): Promise<string> {
      const sb = await connect(h);
      return `https://${sb.getHost(port)}`;
    },
    async pause(h: SandboxHandle): Promise<void> {
      // TODO(CP0 spike): confirm pause/resume API surface for the installed SDK version.
      const sb = await connect(h);
      if ("pause" in sb && typeof (sb as { pause?: () => Promise<unknown> }).pause === "function") await (sb as { pause: () => Promise<unknown> }).pause();
    },
    async resume(h: SandboxHandle): Promise<void> {
      // TODO(CP0 spike): resume via Sandbox.connect / resume depending on SDK version.
      await connect(h);
    },
    async snapshot(_h: SandboxHandle): Promise<SnapshotRef> {
      // Repo snapshots are taken inside the VM by the runtime; a provider-level VM snapshot is optional.
      throw new ProviderError("E2B VM snapshots not implemented in V0; use the runtime snapshotter");
    },
    async destroy(h: SandboxHandle): Promise<void> {
      const sb = await connect(h);
      await sb.kill();
      live.delete(h.id);
    },
  };
}

function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(u8.byteLength);
  copy.set(u8);
  return copy.buffer;
}
