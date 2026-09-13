import type { SandboxHandle, SandboxId, SandboxProviderId } from "@dayone/core";
import type { ProviderDescriptor } from "./descriptor.js";

export interface SandboxCapabilities {
  vmIsolation: boolean;          // Firecracker/Kata-level isolation; candidate sessions require true
  pause: boolean;
  snapshot: boolean;
  egressPolicy: boolean;         // can enforce an allow-list
  maxSessionMinutes: number;
}
export interface SandboxSpec {
  template: string;
  vcpu: number;
  memoryMb: number;
  timeoutMinutes: number;
  env: Record<string, string>;   // per-session tokens only, never vendor keys
  egressAllow: string[];         // hosts or categories
  labels: Record<string, string>;
}
export interface ExecOptions { cwd?: string; env?: Record<string, string>; timeoutMs?: number; background?: boolean; }
export interface ExecResult { exitCode: number | null; stdout: string; stderr: string; durationMs: number; }
export interface FileEntry { path: string; content: string | Uint8Array; mode?: number; }
export interface SnapshotRef { id: string; provider: SandboxProviderId; takenAt: Date; }

export interface SandboxProvider {
  descriptor: ProviderDescriptor<SandboxProviderId, SandboxCapabilities>;
  create(spec: SandboxSpec): Promise<SandboxHandle>;
  get(id: SandboxId): Promise<SandboxHandle | null>;
  exec(handle: SandboxHandle, command: string, opts?: ExecOptions): Promise<ExecResult>;
  writeFiles(handle: SandboxHandle, files: FileEntry[]): Promise<void>;
  readFile(handle: SandboxHandle, path: string): Promise<Uint8Array>;
  exposeUrl(handle: SandboxHandle, port: number): Promise<string>;
  pause(handle: SandboxHandle): Promise<void>;
  resume(handle: SandboxHandle): Promise<void>;
  snapshot(handle: SandboxHandle): Promise<SnapshotRef>;
  destroy(handle: SandboxHandle): Promise<void>;
}
