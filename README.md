# Dayone

**Interviews that feel like the job.** Dayone puts a candidate inside a realistic, sandboxed engineering environment with an AI coding agent, records how they work, and gives the hiring team a report on how they think, build, verify and decide, not just whether the final code is correct.

This repository is the platform: the control plane, the in-sandbox runtime, the provider plugins, and the docs that define how it all fits together. Problem statements (the codebases candidates work on) live in **separate repositories**, one per problem, following the format in [docs/PROBLEM-FORMAT.md](docs/PROBLEM-FORMAT.md).

## V0 in one paragraph

A company browses the problem marketplace, picks a **Build** problem, chooses which AI agents the candidate may use, and generates a single-use interview link. The candidate opens the link in a browser, picks one of the allowed agents, and lands in a **VS Code (OpenVSCode Server)** workspace running inside an **E2B Firecracker microVM** that already contains the problem repository, its dependencies and tests. Everything the candidate does is captured as a trace: edits, commands, test runs, agent prompts and responses. On submit the sandbox is destroyed, the trace is graded, and the company gets a report with a score, key moments and a replay.

Three modes are planned: **Build** (V0), **Debug**, **Review**.

## Repository layout

```
dayone/
├── README.md                   this file
├── CLAUDE.md                   guide for AI agents and humans contributing to this repo
├── docs/                       knowledge base (architecture, decisions, formats, roadmap)
│   └── diagrams/               end-to-end flow and architecture diagrams (HTML sources + PNG)
├── design/                     UI mockups and brand assets (HTML sources + PNG)
├── apps/
│   ├── api/                    HTTP API (Fastify) · composition root for providers
│   ├── worker/                 background jobs (provisioning, grading)
│   └── web/                    company console + candidate shell (placeholder in V0 skeleton)
├── packages/
│   ├── core/                   domain model: entities, state machines, errors (no I/O)
│   ├── ports/                  interfaces every plugin implements (sandbox, editor, agent, scm, stores)
│   ├── application/            use cases that orchestrate ports (no framework code)
│   ├── infrastructure/         adapters: in-memory + Postgres repositories, queue, storage
│   ├── providers/
│   │   ├── sandbox-e2b/        SandboxProvider for E2B
│   │   ├── sandbox-local/      SandboxProvider for local development (no cloud)
│   │   ├── editor-openvscode/  EditorProvider for OpenVSCode Server
│   │   ├── agent-claude-code/  AgentProvider: Claude Code VS Code extension
│   │   ├── agent-codex/        AgentProvider: OpenAI Codex VS Code extension
│   │   └── scm-github/         ScmProvider: fetch problem repositories
│   ├── sandbox-runtime/        code that runs inside the sandbox VM (bootstrap, event shipper)
│   ├── vscode-extension/       the Dayone trace-capture extension installed in the IDE
│   ├── problem-kit/            schema + loader for problem repositories
│   └── config/                 typed environment configuration
└── examples/
    └── problem-template/       a minimal problem repository to copy
```

## Principles the code follows

1. **Nothing is hard-coupled.** Sandboxes, editors, agents, source control, storage and queues are plugins behind interfaces in `packages/ports`. Adding a provider means adding a package and registering it in the composition root. See [docs/PLUGINS.md](docs/PLUGINS.md).
2. **Layers point inward.** `core` knows nothing about I/O. `application` depends on `core` and `ports`. `infrastructure` and `providers` implement ports. `apps` wire everything together. No layer imports from a layer above it.
3. **The trace is the product.** Every action becomes a typed, timestamped event with a stable schema. See [docs/EVENTS.md](docs/EVENTS.md).
4. **Candidate sessions run in VM-isolated sandboxes**, never in shared-kernel containers, with an egress allow-list.
5. **TypeScript everywhere**: browser, server, sandbox runtime and IDE extension share one language and one set of types.

## Getting started

```bash
npm install
npm run typecheck
npm run dev:api        # starts the API with local (no-cloud) providers
```

Copy `.env.example` to `.env` and fill in provider keys to run against E2B. Full setup notes in [CLAUDE.md](CLAUDE.md).

## Docs

Start with [docs/README.md](docs/README.md). The three documents everyone should read: [ARCHITECTURE.md](docs/ARCHITECTURE.md), [DECISIONS.md](docs/DECISIONS.md), [ROADMAP.md](docs/ROADMAP.md).

## Status

Pre-V0. The skeleton compiles and the layers are in place; the provider implementations are stubs to be filled in checkpoint by checkpoint (see the roadmap). Nothing here is production-ready yet.
