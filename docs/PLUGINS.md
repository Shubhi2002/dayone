# Plugins: providers and ports

Status: v0.1 · 13 September 2026 · mirrors `packages/ports`

Everything that could be swapped is a **port** (an interface in `packages/ports`) with one or more **providers** (packages implementing it). Use cases in `packages/application` depend on ports only. `apps/api/src/container.ts` is the single composition root that decides which providers are active, driven by `packages/config`.

## The ports

| Port | What it abstracts | V0 providers | Later |
| --- | --- | --- | --- |
| `SandboxProvider` | Creating, exposing, executing in, pausing, snapshotting and destroying an isolated VM | `sandbox-e2b`, `sandbox-local` (dev, no cloud) | Daytona, Fly Machines, self-hosted Firecracker |
| `EditorProvider` | Installing and starting a browser IDE inside a sandbox, installing extensions, producing the proxied URL | `editor-openvscode` | code-server, Monaco-based custom shell |
| `AgentProvider` | Making one AI coding agent available inside a sandbox and knowing how to capture its activity | `agent-claude-code`, `agent-codex` (both `kind: "ide-extension"`) | `kind: "hosted"` agent host with a first-class apply/decline gate |
| `ScmProvider` | Fetching a problem repository at a pinned ref | `scm-github` | GitLab, local path |
| `TraceStore` | Append-only event storage and range reads | in-memory, Postgres | |
| `SnapshotStore` | Storing snapshots and diffs | in-memory, object storage | |
| `SessionRepository`, `LinkRepository`, `ProblemRepository`, `CompanyRepository` | Persistence for entities | in-memory, Postgres | |
| `JobQueue` | Enqueue and consume typed background jobs | in-memory, Redis | |
| `ModelGateway` | Issue per-session virtual keys, log and meter model traffic, enforce budgets | in-process gateway in `apps/api` | separate service |
| `Clock`, `IdGenerator`, `TokenSigner`, `Mailer` | Small infrastructure concerns kept out of use cases | in-memory / real | |

## Provider contract

Every provider exports a `Descriptor` and an implementation:

```ts
export interface ProviderDescriptor<Id extends string, Caps> {
  id: Id;                    // stable, lower-kebab, used in config and persisted data
  displayName: string;
  capabilities: Caps;        // what this provider can and cannot do, so use cases can adapt
}
```

Use cases must consult capabilities rather than branching on provider id. Example: `SandboxCapabilities.pause` decides whether idle sessions are paused or left running.

### `AgentProvider` in detail

```ts
export interface AgentProvider {
  descriptor: ProviderDescriptor<AgentProviderId, AgentCapabilities>;
  kind: "ide-extension" | "hosted";
  /** Which model vendors this agent talks to, so the gateway can issue the right virtual keys. */
  vendors: ModelVendor[];
  /** Install the agent into a sandbox that already has the editor. */
  install(ctx: AgentInstallContext): Promise<void>;
  /** Environment and settings that point the agent at the gateway with a per-session key. */
  configure(ctx: AgentConfigureContext): Promise<AgentConfiguration>;
  /** Files the agent writes that we ship at session end (transcripts), as glob patterns. */
  transcriptPaths(): string[];
  /** Parse shipped transcripts into normalised agent events. */
  parseTranscript(raw: Buffer, meta: TranscriptMeta): AgentEvent[];
}
```

`AgentCapabilities` records whether the agent reports proposals and their accept/reject outcome, whether it supports a custom base URL, which models it can be pinned to, and whether it can run headless. The company console reads descriptors to show the selectable agents; the link stores `allowedAgents: AgentProviderId[]`; the candidate's choice is validated against that list.

### `SandboxProvider` in detail

```ts
export interface SandboxProvider {
  descriptor: ProviderDescriptor<SandboxProviderId, SandboxCapabilities>;
  create(spec: SandboxSpec): Promise<SandboxHandle>;
  get(id: SandboxId): Promise<SandboxHandle | null>;
  exec(handle: SandboxHandle, command: string, opts?: ExecOptions): Promise<ExecResult>;
  writeFiles(handle: SandboxHandle, files: FileEntry[]): Promise<void>;
  exposeUrl(handle: SandboxHandle, port: number): Promise<string>;
  pause(handle: SandboxHandle): Promise<void>;
  resume(handle: SandboxHandle): Promise<void>;
  snapshot(handle: SandboxHandle): Promise<SnapshotRef>;
  destroy(handle: SandboxHandle): Promise<void>;
}
```

`SandboxSpec` carries the template id, size, timeout, environment variables (per-session tokens only), and the egress policy. Providers that cannot enforce egress must say so in capabilities; the orchestrator refuses to run candidate sessions on them.

## Adding a provider

1. Create `packages/providers/<port>-<name>` with `package.json`, `tsconfig.json`, `src/index.ts` exporting the descriptor and a factory `create<Name>Provider(config)`.
2. Implement the port. Keep vendor SDK types inside the package; map to `ports` types at the boundary.
3. Add unit tests using recorded fixtures, not live cloud calls.
4. Register in `apps/api/src/container.ts` under a config flag; add the flag to `packages/config` and `.env.example`.
5. Document capabilities and quirks in the package `README.md`; add a row to the table above.

## Rules

- Providers never import `application` or other providers.
- Providers never persist anything themselves; they return handles the use cases store.
- A provider's `id` never changes once persisted data refers to it.
- Secrets reach providers through `packages/config` at construction time, never through use-case inputs.
