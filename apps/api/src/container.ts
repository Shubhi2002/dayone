import type { Config } from "@dayone/config";
import type { AgentProviderId, EditorProviderId, SandboxProviderId, ScmProviderId } from "@dayone/core";
import { asAgentProviderId, asEditorProviderId, asSandboxProviderId, asScmProviderId } from "@dayone/core";
import type { AppDeps } from "@dayone/application";
import type { AgentProvider, EditorProvider, SandboxProvider, ScmProvider } from "@dayone/ports";
import { ProviderRegistry } from "@dayone/ports";
import {
  ConsoleLogger, ConsoleMailer, HmacTokenSigner, InMemoryBlobStore, InMemoryCompanyRepository, InMemoryJobQueue, InMemoryLinkRepository,
  InMemoryProblemRepository, InMemoryReportRepository, InMemorySessionRepository, InMemorySnapshotStore, InMemoryTraceStore, InProcessModelGateway,
  SystemClock, UlidGenerator,
} from "@dayone/infrastructure";
import { createE2bSandboxProvider } from "@dayone/sandbox-e2b";
import { createLocalSandboxProvider } from "@dayone/sandbox-local";
import { createOpenVscodeEditorProvider } from "@dayone/editor-openvscode";
import { createAgentClaudeCodeProvider } from "@dayone/agent-claude-code";
import { createAgentCodexProvider } from "@dayone/agent-codex";
import { createGithubScmProvider } from "@dayone/scm-github";

export interface Container extends AppDeps { gatewayState: InProcessModelGateway; config: Config; }

/**
 * The single composition root. Everything pluggable is chosen here from config.
 * To add a provider: import its factory, register under a config flag. Nothing else in the codebase changes.
 */
export function buildContainer(config: Config): Container {
  const sandboxes = new ProviderRegistry<SandboxProviderId, SandboxProvider>();
  sandboxes.register(createLocalSandboxProvider());
  if (config.E2B_API_KEY) sandboxes.register(createE2bSandboxProvider({ apiKey: config.E2B_API_KEY, defaultTemplate: config.E2B_DEFAULT_TEMPLATE }));

  const editors = new ProviderRegistry<EditorProviderId, EditorProvider>().register(createOpenVscodeEditorProvider());

  const agentFactories: Record<string, () => AgentProvider> = { "claude-code": createAgentClaudeCodeProvider, codex: createAgentCodexProvider };
  const agents = new ProviderRegistry<AgentProviderId, AgentProvider>();
  for (const id of config.AGENT_PROVIDERS) { const f = agentFactories[id]; if (!f) throw new Error(`Unknown agent provider in AGENT_PROVIDERS: ${id}`); agents.register(f()); }

  const scms = new ProviderRegistry<ScmProviderId, ScmProvider>().register(createGithubScmProvider({ token: config.GITHUB_TOKEN }));

  const gatewayState = new InProcessModelGateway(config.PUBLIC_BASE_URL);
  const logger = new ConsoleLogger();

  // TODO(CP1): swap in Postgres repositories, Redis queue and S3 blob store when DATABASE_URL / REDIS_URL are set.
  return {
    config, gatewayState, logger,
    clock: new SystemClock(), ids: new UlidGenerator(), tokens: new HmacTokenSigner(config.TOKEN_SIGNING_SECRET), mailer: new ConsoleMailer(),
    queue: new InMemoryJobQueue(), gateway: gatewayState,
    repos: { sessions: new InMemorySessionRepository(), links: new InMemoryLinkRepository(), problems: new InMemoryProblemRepository(), companies: new InMemoryCompanyRepository(), reports: new InMemoryReportRepository() },
    stores: { trace: new InMemoryTraceStore(), snapshots: new InMemorySnapshotStore(), blobs: new InMemoryBlobStore() },
    providers: { sandboxes, editors, agents, scms },
    defaults: {
      sandbox: asSandboxProviderId(config.SANDBOX_PROVIDER), editor: asEditorProviderId(config.EDITOR_PROVIDER), scm: asScmProviderId(config.SCM_PROVIDER),
      publicBaseUrl: config.PUBLIC_BASE_URL,
    },
  };
}
