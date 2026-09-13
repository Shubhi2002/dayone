import type { AgentProviderId, EditorProviderId, SandboxProviderId, ScmProviderId } from "@dayone/core";
import type {
  AgentProvider, BlobStore, Clock, CompanyRepository, EditorProvider, IdGenerator, JobQueue, LinkRepository, Logger,
  Mailer, ModelGateway, ProblemRepository, ProviderRegistry, ReportRepository, SandboxProvider, ScmProvider,
  SessionRepository, SnapshotStore, TokenSigner, TraceStore,
} from "@dayone/ports";

/** Everything a use case may need. Built once in the composition root; use cases pick what they use. */
export interface AppDeps {
  clock: Clock;
  ids: IdGenerator;
  tokens: TokenSigner;
  logger: Logger;
  mailer: Mailer;
  queue: JobQueue;
  gateway: ModelGateway;
  repos: {
    sessions: SessionRepository;
    links: LinkRepository;
    problems: ProblemRepository;
    companies: CompanyRepository;
    reports: ReportRepository;
  };
  stores: { trace: TraceStore; snapshots: SnapshotStore; blobs: BlobStore };
  providers: {
    sandboxes: ProviderRegistry<SandboxProviderId, SandboxProvider>;
    editors: ProviderRegistry<EditorProviderId, EditorProvider>;
    agents: ProviderRegistry<AgentProviderId, AgentProvider>;
    scms: ProviderRegistry<ScmProviderId, ScmProvider>;
  };
  defaults: { sandbox: SandboxProviderId; editor: EditorProviderId; scm: ScmProviderId; publicBaseUrl: string };
}
