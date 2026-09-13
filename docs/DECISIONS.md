# Decisions

Status: live · append-only · one entry per decision that would be expensive to reverse or that a contributor might question

Format: **Decision** · Alternatives · Why · Revisit if. Newest at the bottom.

---

### D-001 · Product name: Dayone
2026-09-12 · Decided. Lowercase wordmark, sunrise mark. Crucible was the runner-up. Revisit on trademark conflict.

### D-002 · Positioning: a flight simulator for engineers, not "LeetCode with AI allowed"
2026-09-12 · Decided. Lead with realistic operational scenarios and process scoring. "Allow AI, real codebase" alone is table stakes in 2026.

### D-003 · AI collaboration is a lens on every mode, not a separate round
2026-09-12 · Decided. Every scenario provides an agent; how it is used is scored everywhere.

### D-004 · No webcam, no gaze tracking, no biometrics; integrity flags never change a score
2026-09-12 · Decided. Integrity comes from scenario design, trace-based anomaly detection and human review. Flags route to humans only.

### D-005 · Score composition starts at 60% rubric, 30% process signals, 10% outcome
2026-09-12 · Proposed. Outcome weighted low so pasted solutions score poorly and correct diagnoses that ran out of time score well. Expected to change with data.

### D-006 · Modes: Build, Debug, Review; V0 ships Build only
2026-09-13 · Decided. Build has the simplest sandbox and exercises the whole flow. Debug and Review follow on the same infrastructure. Revisit if partners will not trial without an operational mode.

### D-007 · V0 company flow: marketplace → pick problem → choose allowed agents → generate link → candidate sandbox
2026-09-13 · Decided. No candidate account or GitHub login. Candidate picks one agent from the allowed list at start.

### D-008 · Every problem statement is its own repository
2026-09-13 · Decided. The platform repo holds no problem content. A problem repo follows `PROBLEM-FORMAT.md` and is pinned by ref. Why: independent versioning, external authors, clean permissions, hidden content stripped at load time.

### D-009 · Sandbox: E2B Firecracker microVMs, behind `SandboxProvider`
2026-09-13 · Decided. Alternatives: GitHub Codespaces (needs a GitHub identity per candidate, no embed, no instrumentation, no self-host), Daytona (Docker by default, VM type opt-in; first-party Go SDK), self-hosting (12 to 18 months of platform work). E2B is Firecracker by default, per-second billing, TypeScript SDK, open source with a self-host path. Revisit if spend passes about $5k/month, a customer needs our VPC, or provider limits block a scenario.

### D-010 · Candidate sessions always run VM-isolated, never in shared-kernel containers
2026-09-13 · Decided. Candidate and agent code is hostile input.

### D-011 · IDE: OpenVSCode Server inside the sandbox, framed by our shell, behind `EditorProvider`
2026-09-13 · Decided. Full VS Code in days; MIT; extensions load, so both our trace extension and third-party agent extensions work. Fallback if iframe embedding fights us for more than three days: make the IDE the page and ship the guide panel as a webview extension.

### D-012 · Agents in V0: IDE extensions (Claude Code, Codex) chosen per session, behind `AgentProvider`
2026-09-13 · Decided. Company selects the allowed set on the link; candidate selects one at start. Alternatives: our own agent host on the Claude Agent SDK (first-class apply/decline gate, Anthropic-only); Managed Agents with a self-hosted environment; embedding an open-source agent. Why: fastest path to agents candidates already use, vendor choice for the company, and the extension model matches how engineers work. Trade-off accepted: the apply/decline step is the extension's UI, so accept and reject events come from transcripts, and planted suggestions are not scriptable. `AgentProvider.kind = "hosted"` is reserved so a first-party agent host can be added without touching the rest.

### D-013 · All agent model traffic goes through our agent gateway with per-session virtual keys
2026-09-13 · Decided. The sandbox never holds a vendor key. The gateway logs prompts and completions as trace events, meters cost, enforces budgets, and makes the agent trace vendor-neutral. Extensions are configured via their base-URL settings.

### D-014 · TypeScript everywhere; Go reserved for two future components
2026-09-13 · Decided. Console, shell, API, worker, sandbox runtime and IDE extension are TypeScript. Why: the VS Code extension API, the E2B SDK and the agent SDKs are TypeScript-first; a two-engineer team should run one language; V0 load is far below where Go's runtime matters. Go is planned for a static in-VM sidecar if Node is ever removed from the image, and for a fleet manager if we self-host. The IDE proxy is off-the-shelf, not custom code in any language.

### D-015 · Stack: npm workspaces, Fastify, Zod, Postgres, S3-compatible storage, Redis queue, one region
2026-09-13 · Decided. Vitest for tests. Region chosen by where the first design partners are.

### D-016 · Layered architecture with ports; nothing pluggable is imported directly
2026-09-13 · Decided. `core` → `ports` → `application` → (`infrastructure`, `providers`) → `apps`. Providers register in one composition root. See `PLUGINS.md`.

### D-017 · Trace events are a versioned public schema
2026-09-13 · Decided. Every event carries `schemaVersion`; readers are backward compatible; changes are documented in `EVENTS.md`.

### D-018 · Definition of "V0 shipped" and the 4-week target
2026-09-13 · Decided. A real company generates a link, a real candidate completes a Build task with a chosen agent, the company reads a report with score, key moments and replay, and the session cost under $20. First real candidate by end of week 4; three partners by week 6. See `ROADMAP.md`.

### D-019 · Build order: vertical slice first, console last; human grading before automated grading
2026-09-13 · Decided. Every session is hand-graded until 30 sessions and agreement within ±1.0 on 85% of rubric items; partners see the human-confirmed score.

### D-020 · V0 report scope
2026-09-13 · Decided. Outcome, four Build-relevant dimensions (Code quality, Testing, AI collaboration, Engineering judgment), key moments, line attribution, replay, written answers, three debrief questions. No percentiles or bands until n ≥ 30.

### D-021 · Deferred-list discipline
2026-09-13 · Decided. Anything not required by D-018 goes to the deferred list in `ROADMAP.md` with a written trigger; re-ranked only at CP5.

---

*Next: D-022.*
