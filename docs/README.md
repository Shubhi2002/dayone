# Dayone docs

The knowledge base for people and agents working on the platform. Product research, market analysis and business planning were moved out of this repo when implementation started; only documents that shape the code remain.

| Doc | What it answers | Read when |
| --- | --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the system is built: tiers, components, the session lifecycle, how agents run in the sandbox, how the trace is captured | Before any structural change |
| [DECISIONS.md](DECISIONS.md) | What has been decided, why, and what would reopen it | Before proposing an alternative |
| [ROADMAP.md](ROADMAP.md) | V0 definition, checkpoints with exit criteria, what is deliberately deferred | When planning a sprint |
| [DOMAIN.md](DOMAIN.md) | Glossary, entities, the session state machine | When touching `packages/core` |
| [PLUGINS.md](PLUGINS.md) | The provider interfaces and how to add a sandbox, editor, agent or SCM plugin | When adding or changing a provider |
| [PROBLEM-FORMAT.md](PROBLEM-FORMAT.md) | How a problem repository is structured and validated | When authoring or loading problems |
| [EVENTS.md](EVENTS.md) | The trace event schema and versioning rules | When emitting or consuming events |
| [SCORING.md](SCORING.md) | Dimensions, process signals, grading pipeline, human review | When working on grading or reports |
| [PRINCIPLES.md](PRINCIPLES.md) | Product, integrity, privacy and fairness rules the code must uphold | Always; especially for anything candidate-facing |
| [diagrams/](diagrams/) | End-to-end flow and architecture diagrams (HTML sources render to PNG via `design/render.sh ../docs/diagrams`) | For presentations and onboarding |

Conventions for these docs: each has a status line, uses plain language, and is updated in the same change as the code it describes.
