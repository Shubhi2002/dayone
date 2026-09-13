import type { SandboxSpec } from "@dayone/ports";
import { asSessionId, NotFoundError, ProviderError } from "@dayone/core";
import type { AppDeps } from "../deps.js";

export interface ProvisionSessionInput { sessionId: string; }
export interface ProvisionSessionOutput { editorUrl: string; }

/**
 * Orchestrates: sandbox → repo (hidden stripped) → editor + Dayone extension → chosen agent → gateway key → start.
 * Runs in the worker. Idempotent: a session with a sandbox attached is not provisioned twice.
 */
export class ProvisionSession {
  constructor(private readonly deps: AppDeps) {}

  async execute(input: ProvisionSessionInput): Promise<ProvisionSessionOutput> {
    const { repos, providers, defaults, gateway, clock, ids, stores, logger } = this.deps;
    const session = await repos.sessions.get(asSessionId(input.sessionId));
    if (!session) throw new NotFoundError("Session not found");
    const s = session.snapshot();
    if (!s.agent) throw new ProviderError("Session has no agent selected");
    const problem = await repos.problems.get(s.problemId);
    if (!problem) throw new NotFoundError("Problem not found");

    const sandboxes = providers.sandboxes.get(defaults.sandbox);
    if (!sandboxes.descriptor.capabilities.vmIsolation) throw new ProviderError("Refusing to run a candidate session without VM isolation");
    const editor = providers.editors.get(defaults.editor);
    const agent = providers.agents.get(s.agent.agent);
    const scm = providers.scms.get(defaults.scm);

    const now = clock.now();
    session.transition("provisioning", now);
    await repos.sessions.save(session);

    try {
      // 1. Sandbox with per-session tokens only.
      const key = await gateway.issueKey(session.id, agent.vendors, problem.agents.budgetMinor, s.timeBudgetMinutes * 2);
      const ingestToken = await this.deps.tokens.sign({ sessionId: session.id, kind: "sandbox" }, s.timeBudgetMinutes * 2 * 60);
      const spec: SandboxSpec = {
        template: problem.sandbox.template, vcpu: problem.sandbox.vcpu, memoryMb: problem.sandbox.memoryMb,
        timeoutMinutes: Math.ceil(s.timeBudgetMinutes * 1.5) + 15,
        env: { DAYONE_SESSION_ID: session.id, DAYONE_INGEST_TOKEN: ingestToken, DAYONE_API_URL: defaults.publicBaseUrl },
        egressAllow: [defaults.publicBaseUrl, ...agent.vendors.map((v) => gateway.baseUrlFor(v)), ...problem.sandbox.egress],
        labels: { sessionId: session.id, problemId: problem.id },
      };
      const t0 = Date.now();
      const handle = await sandboxes.create(spec);
      session.attachSandbox(handle);

      // 2. Repository at the pinned ref; hidden content is stripped before upload (see problem-kit).
      const archive = await scm.fetch({ url: problem.repo.url, ref: s.problemRef });
      const workspacePath = "/workspace";
      await sandboxes.writeFiles(handle, [{ path: "/tmp/problem.tar.gz", content: archive.tarGz }]);
      await sandboxes.exec(handle, `mkdir -p ${workspacePath} && tar -xzf /tmp/problem.tar.gz -C ${workspacePath} --exclude='.dayone/hidden' && rm /tmp/problem.tar.gz`);
      await sandboxes.exec(handle, `cd ${workspacePath} && DAYONE_VARIANT=${s.variant} bash .dayone/setup.sh`, { timeoutMs: 120_000 });

      // 3. Editor + Dayone trace extension, then the chosen agent.
      const ctx = { sandbox: sandboxes, handle, workspacePath };
      await editor.install(ctx);
      await editor.installExtension(ctx, "dayone.trace");
      await agent.install({ ...ctx, editor });
      const agentCfg = await agent.configure({
        sessionId: session.id, gatewayBaseUrl: gateway.baseUrlFor(agent.vendors[0] ?? "other"), gatewayKey: key.secret, model: s.agent.model, workspacePath,
      });
      if (agentCfg.files.length) await sandboxes.writeFiles(handle, agentCfg.files);

      // 4. Start the editor with a connection token; the IDE proxy maps a per-session subdomain to this URL.
      const connectionToken = ids.next();
      const endpoint = await editor.start(ctx, {
        port: 3000, connectionToken, extensionsToInstall: [],
        settings: { ...agentCfg.editorSettings, "dayone.sessionId": session.id, "dayone.apiUrl": defaults.publicBaseUrl },
      });

      session.transition("live", clock.now());
      await repos.sessions.save(session);
      await stores.trace.append([{
        schemaVersion: 1, id: ids.next(), sessionId: session.id, at: clock.now().toISOString(), source: "control-plane",
        type: "sandbox.provisioned", payload: { provider: sandboxes.descriptor.id, sandboxId: handle.id, coldStartMs: Date.now() - t0 },
      }]);
      logger.info("session live", { sessionId: session.id, editorUrl: endpoint.url });
      return { editorUrl: endpoint.url };
    } catch (err) {
      logger.error("provisioning failed", { sessionId: session.id, err: String(err) });
      session.fail(String(err), clock.now());
      await repos.sessions.save(session);
      const handle = session.snapshot().sandbox;
      if (handle) await sandboxes.destroy(handle).catch(() => undefined);
      throw err;
    }
  }
}
