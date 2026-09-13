# Problem repository format

Status: v0.1 · 13 September 2026 · schema in `packages/problem-kit` · example in `examples/problem-template`

Every problem statement is a **separate repository**. The platform loads it by URL and pinned ref, validates it, strips hidden content, and provisions a sandbox from it.

## Layout

```
<problem-repo>/
├── .dayone/
│   ├── problem.yaml          manifest (validated by problem-kit)
│   ├── ticket.md             what the candidate reads; written like a real ticket
│   ├── setup.sh              runs once in the sandbox after clone (install deps, seed data, start services)
│   ├── variants/             optional; one folder per variant with files that overlay the repo
│   │   ├── a/
│   │   └── b/
│   └── hidden/               NEVER shipped to a candidate sandbox
│       ├── truth.md          what is actually going on, for graders and reviewers
│       ├── rubric.yaml       rubric items with 9 / 6 / 3 anchors, mapped to dimensions
│       ├── traps.md          decoys and AI-favoured wrong answers we planted, and why
│       └── tests/            graded test suite, copied outside the writable tree at provisioning
├── src/ …                    the actual codebase the candidate works in
├── tests/ …                  the tests the candidate can see and run
└── README.md                 normal project README (part of the realism)
```

## `problem.yaml`

```yaml
schemaVersion: 1
id: payments-latency-regression          # stable, kebab-case; used in the marketplace and persisted data
title: Latency regression in payment-service after deploy
mode: build                               # build | debug | review
level: mid                                # junior | mid | senior | staff
stack: [java, spring, postgres]
timeBudgetMinutes: 90
summary: >
  p95 latency jumped from 250 ms to 1.8 s after v2.14.0 …
sandbox:
  template: dayone-java-21               # SandboxProvider template id (image with toolchain)
  size: { vcpu: 2, memoryMb: 4096 }
  ports: [8080]
  setup: .dayone/setup.sh
  egress: [package-registries]            # allow-list categories in addition to the control plane
tests:
  visible: "./gradlew test"               # what the candidate can run
  graded: ".dayone/hidden/tests"          # path copied outside the writable tree
agents:
  allowedDefault: [claude-code, codex]    # company can narrow this when generating a link
  budgetUsd: 5
variants:
  strategy: overlay                       # overlay | none (generator later)
  pool: [a, b, c]
dimensions:                               # which score dimensions this problem carries primary signal for
  primary: [debugging, testing]
  secondary: [performance, code-quality, engineering-judgment]
```

## Rules

- `hidden/` is stripped by the scenario service before the repository reaches a sandbox. The loader refuses to serve a problem if `hidden/` is referenced from anywhere the candidate can read.
- `setup.sh` must be idempotent and finish in under 60 s from a warm template; long installs belong in the template image.
- Graded tests are copied to a read-only path outside the workspace and executed by the runtime; candidates can add tests, which are graded separately.
- A variant overlay may replace files and set environment variables but never change `problem.yaml`.
- Bugs are correct-looking decisions with a wrong assumption, never typos; every problem has a red herring and at least one plausible wrong fix an agent is likely to suggest. Document both in `hidden/traps.md`.
- Problems are versioned by git ref; the platform pins a ref per marketplace entry and records it on every session.

## Validation

`problem-kit` exposes `loadProblem(dir)` which parses `problem.yaml` with Zod, checks that referenced paths exist, checks that nothing outside `.dayone/hidden` references it, and returns a `ProblemManifest`. Run `npx dayone-problem validate .` inside a problem repo (CLI to be added).
