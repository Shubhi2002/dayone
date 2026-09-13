import { mkdtemp, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";
import type { SandboxHandle, SandboxId } from "@dayone/core";
import { asSandboxId, asSandboxProviderId } from "@dayone/core";
import type { ExecOptions, ExecResult, FileEntry, SandboxProvider, SandboxSpec, SnapshotRef } from "@dayone/ports";

const exec = promisify(execCb);
export const LOCAL_SANDBOX_ID = asSandboxProviderId("local");

export function createLocalSandboxProvider(): SandboxProvider {
  const roots = new Map<SandboxId, string>();
  const rootOf = (h: SandboxHandle) => { const r = roots.get(h.id); if (!r) throw new Error(`Unknown local sandbox ${h.id}`); return r; };
  return {
    descriptor: { id: LOCAL_SANDBOX_ID, displayName: "Local (dev only)", capabilities: { vmIsolation: false, pause: false, snapshot: false, egressPolicy: false, maxSessionMinutes: 24 * 60 } },
    async create(spec: SandboxSpec): Promise<SandboxHandle> {
      const root = await mkdtemp(join(tmpdir(), "dayone-"));
      const id = asSandboxId(root.split("-").pop() ?? "local");
      roots.set(id, root);
      return { id, provider: LOCAL_SANDBOX_ID, createdAt: new Date(), meta: { root, template: spec.template } };
    },
    async get(id: SandboxId) { const root = roots.get(id); return root ? { id, provider: LOCAL_SANDBOX_ID, createdAt: new Date(), meta: { root } } : null; },
    async exec(h: SandboxHandle, command: string, opts: ExecOptions = {}): Promise<ExecResult> {
      const t0 = Date.now();
      try {
        const { stdout, stderr } = await exec(command, { cwd: opts.cwd ?? rootOf(h), env: { ...process.env, ...opts.env }, timeout: opts.timeoutMs ?? 60_000 });
        return { exitCode: 0, stdout, stderr, durationMs: Date.now() - t0 };
      } catch (e) {
        const err = e as { code?: number; stdout?: string; stderr?: string };
        return { exitCode: err.code ?? 1, stdout: err.stdout ?? "", stderr: err.stderr ?? String(e), durationMs: Date.now() - t0 };
      }
    },
    async writeFiles(h: SandboxHandle, files: FileEntry[]) {
      for (const f of files) { const p = join(rootOf(h), f.path); await mkdir(dirname(p), { recursive: true }); await writeFile(p, f.content); }
    },
    async readFile(h: SandboxHandle, path: string) { return new Uint8Array(await readFile(join(rootOf(h), path))); },
    async exposeUrl(_h: SandboxHandle, port: number) { return `http://localhost:${port}`; },
    async pause() { /* unsupported */ },
    async resume() { /* unsupported */ },
    async snapshot(h: SandboxHandle): Promise<SnapshotRef> { return { id: `local-${Date.now()}`, provider: LOCAL_SANDBOX_ID, takenAt: new Date() }; },
    async destroy(h: SandboxHandle) { const root = roots.get(h.id); if (root) { await rm(root, { recursive: true, force: true }); roots.delete(h.id); } },
  };
}
