import type { SessionId, TraceEvent } from "@dayone/core";
import type { BlobStore, SnapshotStore, TraceStore } from "@dayone/ports";

export class InMemoryTraceStore implements TraceStore {
  private readonly m = new Map<string, TraceEvent[]>();
  async append(events: TraceEvent[]): Promise<void> {
    for (const e of events) { const list = this.m.get(e.sessionId) ?? []; list.push(e); this.m.set(e.sessionId, list); }
  }
  async read(sessionId: SessionId, opts: { after?: string; limit?: number } = {}): Promise<TraceEvent[]> {
    const list = (this.m.get(sessionId) ?? []).filter((e) => !opts.after || e.at > opts.after);
    return list.slice(0, opts.limit ?? list.length);
  }
  async count(sessionId: SessionId): Promise<number> { return (this.m.get(sessionId) ?? []).length; }
}
export class InMemorySnapshotStore implements SnapshotStore {
  private readonly m = new Map<string, Uint8Array>();
  async put(sessionId: SessionId, ref: string, tarGz: Uint8Array): Promise<void> { this.m.set(`${sessionId}/${ref}`, tarGz); }
  async get(sessionId: SessionId, ref: string): Promise<Uint8Array | null> { return this.m.get(`${sessionId}/${ref}`) ?? null; }
  async list(sessionId: SessionId): Promise<string[]> { return [...this.m.keys()].filter((k) => k.startsWith(`${sessionId}/`)).map((k) => k.split("/")[1] ?? ""); }
}
export class InMemoryBlobStore implements BlobStore {
  private readonly m = new Map<string, Uint8Array>();
  async put(key: string, data: Uint8Array): Promise<string> { this.m.set(key, data); return `memory://${key}`; }
  async get(key: string): Promise<Uint8Array | null> { return this.m.get(key) ?? null; }
}
