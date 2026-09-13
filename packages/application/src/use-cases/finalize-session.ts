import { asSessionId, NotFoundError } from "@dayone/core";
import type { AppDeps } from "../deps.js";

/** After submit: ship agent transcripts, take the final snapshot, destroy the sandbox, revoke keys, enqueue grading. */
export class FinalizeSession {
  constructor(private readonly deps: AppDeps) {}
  async execute(input: { sessionId: string }): Promise<void> {
    const { repos, providers, defaults, stores, clock, ids, queue, gateway, logger } = this.deps;
    const session = await repos.sessions.get(asSessionId(input.sessionId));
    if (!session) throw new NotFoundError("Session not found");
    const s = session.snapshot();
    if (!s.sandbox || !s.agent) { logger.warn("finalize without sandbox or agent", { sessionId: s.id }); return; }
    const sandboxes = providers.sandboxes.get(s.sandbox.provider);
    const agent = providers.agents.get(s.agent.agent);

    // Transcripts written by the agent extension become normalised agent events.
    for (const pattern of agent.transcriptPaths()) {
      const list = await sandboxes.exec(s.sandbox, `ls -1 ${pattern} 2>/dev/null || true`);
      for (const path of list.stdout.split("\n").map((x) => x.trim()).filter(Boolean)) {
        const raw = await sandboxes.readFile(s.sandbox, path).catch(() => null);
        if (raw) await stores.trace.append(agent.parseTranscript(raw, { sessionId: s.id, path }));
      }
    }
    // Final snapshot of the workspace (hidden content is not in the workspace by construction).
    const tar = await sandboxes.exec(s.sandbox, "cd /workspace && tar -czf /tmp/final.tar.gz --exclude=node_modules --exclude=.git . && echo ok");
    if (tar.exitCode === 0) {
      const bytes = await sandboxes.readFile(s.sandbox, "/tmp/final.tar.gz");
      await stores.snapshots.put(s.id, "final", bytes);
    }
    await sandboxes.destroy(s.sandbox);
    if (s.agent.gatewayKeyId) await gateway.revokeKey(s.agent.gatewayKeyId);
    await stores.trace.append([{
      schemaVersion: 1, id: ids.next(), sessionId: s.id, at: clock.now().toISOString(), source: "control-plane",
      type: "sandbox.destroyed", payload: { provider: s.sandbox.provider, sandboxId: s.sandbox.id, reason: "submitted" },
    }]);
    session.transition("grading", clock.now());
    await repos.sessions.save(session);
    await queue.enqueue("session.grade", { sessionId: s.id }, { dedupeKey: `grade:${s.id}` });
  }
}
