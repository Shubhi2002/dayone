# 05 · Sample scenarios

Status: draft v1 · September 2026 · 16 scenarios · each needs a build spec before implementation

## Scenario template

Every scenario is specified with the same fields so they can be built, graded and compared consistently.

```
ID · Title
Mode(s) · Level · Length · Stack
Premise          what the candidate is told, in the voice of a ticket or a colleague
Environment      what is in the sandbox (repo size, data, tooling, telemetry)
Hidden truth     what is actually going on (never shown to the candidate)
Traps            decoys and AI-favoured wrong answers we deliberately include
Rounds           for multi-round scenarios, the injected events
Rubric anchors   what a 9, a 6 and a 3 look like
Primary signals  which Engineering Score dimensions this scenario feeds
Variants         how we vary it so leaked solutions do not transfer
```

Levels: J = junior, M = mid, S = senior, St = staff.

---

## Debug

### D1 · Payment-service latency regression after deploy
**Debug** · M/S · 90 min · Java, Spring, Postgres, HikariCP
- **Premise.** INC-2291: p95 latency on `charge` rose from 250 ms to 1.8 s after v2.14.0. Error rate flat. No infra changes.
- **Environment.** 6k-line service, docker-compose with Postgres and a stub gateway, Grafana-style metrics with deploy marker, 6 hours of logs, load-test harness, 43 tests (41 passing).
- **Hidden truth.** The new retry loop acquires a pooled connection and opens a transaction, then sleeps in exponential backoff while holding both. Under partial gateway degradation the pool saturates.
- **Traps.** AI will suggest raising the pool size (moves the bottleneck to Postgres). Two failing tests are unrelated flakes. A slow query in an unrelated endpoint shows in the logs.
- **Rounds.** 1 Reproduce · 2 Root cause and fix · 3 Verify with load test.
- **Rubric anchors.** 9: reproduces first, rejects pool-size fix with reasoning, releases connection before backoff, adds a test asserting no connection held during backoff, shows p95 back under 500 ms. 6: finds the cause after trying the pool-size fix, fixes it, no regression test. 3: raises pool size, declares success from a single request.
- **Signals.** Debugging, Testing, Performance, AI collaboration.
- **Variants.** Language (Go with pgx, Node with pg), the held resource (file lock, Redis lock), the retry trigger.

### D2 · Duplicate notifications under load
**Debug** · M · 60 min · Go, Redis, worker pool
- **Premise.** Customers occasionally receive the same email twice. Support has 30 examples. Happens only in the evening.
- **Environment.** Queue-based notification service, Redis, two workers, seeded event history reproducing the duplicates.
- **Hidden truth.** Visibility timeout on the queue is shorter than the p99 template-render time at peak; the message is redelivered while still processing. Idempotency key is computed after send.
- **Traps.** A retry policy that looks culpable but is correct. AI suggests deduplicating in the email provider.
- **Rubric anchors.** 9: correlates timing with render latency, moves idempotency check before send, extends visibility or heartbeats, adds a test with a slow renderer. 3: adds a "sent" set in memory that does not survive restarts.
- **Signals.** Debugging, System design, Testing.
- **Variants.** Queue technology, whether the dedupe key exists at all.

### D3 · Flaky test that is actually a real bug
**Debug** · J/M · 45 min · Python, pytest
- **Premise.** `test_reconcile_batch` fails one run in twenty. The team has marked it flaky. You suspect otherwise.
- **Environment.** 2k-line batch reconciliation module, seeded CI history showing failure pattern.
- **Hidden truth.** Dictionary iteration order dependence combined with a set-based diff drops an item when two records share a key prefix. It is a real data-loss bug.
- **Traps.** AI suggests adding a retry decorator to the test. The obvious fix (sorting) hides the bug without fixing it.
- **Rubric anchors.** 9: makes the failure deterministic, identifies the data-loss path, fixes the diff, adds a targeted test. 3: adds `@flaky(retries=3)`.
- **Signals.** Debugging, Testing, Judgment.

### D4 · Memory growth in a long-running service
**Debug** · S · 75 min · Node/TypeScript
- **Premise.** Pods restart every ~9 hours on OOM since last Tuesday. No deploy that day.
- **Environment.** Streaming ingestion service, heap snapshots at three points, metrics, the config change that happened on Tuesday (a feature flag flipped by product, visible only in the flag audit log).
- **Hidden truth.** Flag enabled per-tenant metrics labels; label cardinality explodes the in-process metrics registry.
- **Traps.** A classic-looking event-listener leak that is actually bounded. AI focuses on the code, not the config.
- **Rubric anchors.** 9: checks what changed on Tuesday including non-code changes, confirms with heap snapshots, bounds cardinality, adds an alert. 3: increases the memory limit.
- **Signals.** Debugging, Performance, Judgment.

---

## Investigate

### I1 · Checkout conversion dropped 12% yesterday
**Investigate** · M/S · 60 min · SQL (DuckDB/Postgres), event data
- **Premise.** Head of Growth: "Conversion fell from 3.4% to 3.0% yesterday. No deploys. What happened?"
- **Environment.** 90 days of sessions and events (2M rows), feature-flag history, deploy log, three Slack threads (one blames a marketing campaign, one a CDN incident, one is idle chatter), a dashboard.
- **Hidden truth.** A flag enabling a new address-validation vendor rolled to 50% of Android users. The vendor rejects valid addresses in two countries. Overall conversion drop is entirely explained by Android × those countries.
- **Traps.** The marketing campaign did bring lower-intent traffic, which explains about a fifth of the drop and will satisfy a shallow analysis. The CDN incident lasted 11 minutes and is irrelevant.
- **Rubric anchors.** 9: segments by platform, geography and flag exposure; quantifies each contribution; recommends flag rollback and a vendor bug report; states confidence and how to confirm. 6: finds the Android drop but attributes it to the campaign. 3: writes a paragraph about the campaign.
- **Signals.** Judgment, Debugging, System design.
- **Variants.** Which dimension carries the effect, size of the red herring's true contribution.

### I2 · Why is the nightly job taking 4× longer?
**Investigate / Debug** · M · 45 min · Python, Postgres
- **Premise.** ETL finishes at 06:40 instead of 03:10. SLA is 05:00. Started three weeks ago, gradually.
- **Environment.** Job code, query plans, table statistics over time, DB metrics.
- **Hidden truth.** A new upstream table grew past the planner's threshold and a join flipped from hash to nested loop because statistics are stale; autovacuum was disabled on that table by a migration.
- **Traps.** AI suggests adding an index that helps a little. The gradual onset suggests data growth alone.
- **Rubric anchors.** 9: reads the plan, spots the plan change, finds the disabled autovacuum, fixes the root cause and the symptom. 3: adds an index and calls it done.
- **Signals.** Performance, Debugging, Judgment.

### I3 · Ledger does not balance
**Investigate** · S · 60 min · SQL, Python
- **Premise.** Finance: "Month-end ledger is off by $4,212.17. Find out why before the auditors do."
- **Environment.** Transactions, ledger entries, refund events, FX rate table, reconciliation scripts.
- **Hidden truth.** Refunds issued in a different currency from the original charge use the refund-day FX rate, while the ledger reverses at the charge-day rate. The difference matches the discrepancy exactly.
- **Traps.** A handful of genuinely duplicated entries that sum to a different, smaller amount.
- **Rubric anchors.** 9: reconciles to the cent, explains both effects, proposes the accounting treatment and a test. 6: finds the duplicates, cannot explain the rest.
- **Signals.** Judgment, Debugging.

---

## Review

### R1 · Would you ship this AI-generated transfers PR?
**Review** · M/S · 45 min · Python, FastAPI, Postgres
- **Premise.** PR #412 from a coding agent adds `POST /transfers`. CI is green. The ticket says "users can move money between their own accounts."
- **Environment.** Diff (184 lines, 4 files), the repo in a sandbox, the agent available for questions.
- **Hidden truth (planted issues).** Critical: no ownership check on the source account; non-atomic double write and read-modify-write race. High: no insufficient-balance guard; not idempotent under retries. Medium: float for currency; tests written by the agent test the code rather than the requirement. Low: missing audit log entry; inconsistent error type.
- **Traps.** The diff is clean and well-commented. Tests pass. One tempting nit (naming) is a distraction.
- **Rubric anchors.** 9: finds both criticals and both highs, ranks them correctly, blocks, writes a summary that a junior author could act on. 6: finds the race but not the authorisation issue; requests changes. 3: approves with naming nits.
- **Signals.** Judgment, Security, Code quality, Testing.
- **Variants.** Domain (inventory reservation, seat booking, credit allocation) with the same issue classes.

### R2 · Review a caching PR that will corrupt data
**Review** · S · 40 min · Go
- **Premise.** Agent PR adds a read-through cache to the profile service "to cut DB load 60%."
- **Hidden truth.** Cache key omits tenant ID; writes do not invalidate; TTL is 24 hours; serialisation drops a field with a zero value.
- **Rubric anchors.** 9: finds the cross-tenant leak first, then invalidation, and asks for a cache-hit-rate measurement before merging. 3: approves because the benchmark in the PR description looks good.
- **Signals.** Security, Judgment, System design.

### R3 · Review a human PR from a junior teammate
**Review** · J/M · 30 min · TypeScript
- **Premise.** A teammate's first PR: adds pagination to a list endpoint.
- **Hidden truth.** Off-by-one on the last page, unstable sort causing duplicates across pages, N+1 query. Also, it works and the teammate is proud of it.
- **Rubric anchors.** 9: finds all three, explains the unstable-sort issue with an example, and writes the review kindly and specifically. 3: "LGTM" or a wall of nits.
- **Signals.** Code quality, Judgment. Also our only scenario that scores communication tone explicitly.

---

## Build

### B1 · Add rate limiting to an API gateway
**Build** · M · 75 min · Java or Node, Redis
- **Premise.** Ticket: "Add per-API-key rate limiting: 100 req/min, return 429 with Retry-After. Must not affect internal traffic."
- **Environment.** 8k-line gateway with existing middleware chain, conventions, 120 tests, Redis available.
- **Hidden truth.** "Internal traffic" is identified by a header that can be spoofed unless the existing mTLS check is reused. The middleware order matters: auth must run before rate limiting so unauthenticated floods do not consume a real key's budget.
- **Traps.** AI writes an in-memory limiter that does not work across instances. Existing tests use a helper the AI will not discover unless the candidate reads the test directory.
- **Rubric anchors.** 9: reads existing middleware and tests first, uses Redis with a sliding window or token bucket, places the middleware correctly, reuses mTLS for internal detection, tests the 429 path and the internal bypass. 3: in-memory counter, wrong middleware order, no tests.
- **Signals.** Code quality, Testing, Judgment, Security.

### B2 · Implement soft delete without breaking 40 call sites
**Build** · M/S · 60 min · Python, Django
- **Premise.** Compliance needs soft delete for `Customer` with a 30-day restore window. Do not break anything.
- **Hidden truth.** Three call sites rely on cascade deletes; two reports must exclude soft-deleted rows; one admin export must include them.
- **Rubric anchors.** 9: finds all call sites, chooses a default manager approach, handles the three special cases explicitly, adds a scheduled purge, tests restore. 3: adds a boolean and a filter in one place.
- **Signals.** Code quality, Judgment, Testing.

---

## Scale

### S1 · Notification service must survive a 20× spike
**Scale, multi-round with Debug and Operate** · S/St · 120 min · Go, Redis, Postgres
- **Round 1 (Debug, 35 min).** D2's duplicate-send bug, to learn the system.
- **Round 2 (Operate + Scale, 45 min).** Event: marketing campaign, traffic 20×, queue depth exploding, provider rate-limiting, budget capped at 3× infra spend. Mitigate to p99 under 60 s without dropping messages, then propose the redesign.
- **Round 3 (Scale, 30 min).** Event: second region comes online; users must not receive duplicates across regions; provider quotas are per region.
- **Round 4 (Scale, 10 min, written).** Event: 99.99% availability target. What changes, what does it cost, what would you push back on?
- **Hidden truth.** Workers are CPU-bound on template rendering; batching and pre-rendering unlock most of the headroom; provider rate limits require a token bucket per provider; cross-region dedupe needs a shared idempotency store or region-affinity by user.
- **Rubric anchors.** 9: measures before proposing, mitigates reversibly (pause low-priority notifications, scale workers, enable batching), writes trade-offs with numbers, carries the design forward across rounds, pushes back on 99.99% with a cost argument. 3: proposes Kafka in round 2 without measuring.
- **Signals.** System design, Performance, Judgment, Debugging.

### S2 · Multi-tenant SaaS hits its first enterprise customer
**Scale** · S · 90 min · any
- **Premise.** A customer 50× larger than the current largest signs. Their data must be isolated for compliance, and their reports time out today.
- **Environment.** Shared-schema multi-tenant app, query metrics per tenant, current architecture diagram.
- **Hidden truth.** Two hot queries lack tenant-leading indexes; the report path needs async generation; isolation can be per-schema for this tenant without a full re-architecture.
- **Rubric anchors.** 9: proposes the minimal isolation that meets the compliance requirement, fixes the indexes, implements async reports, names what breaks at the next 10×. 3: proposes database-per-tenant for everyone.
- **Signals.** System design, Performance, Judgment.

---

## Secure

### X1 · Audit the file-upload service before launch
**Secure** · M/S · 60 min · Node, S3-compatible storage
- **Premise.** Security review before Friday's launch. Report and fix the top three.
- **Hidden truth (8 planted).** Path traversal in filename handling; IDOR on download by numeric ID; signed URLs valid for 7 days and not bound to the user; SSRF via "import from URL"; content-type trusted from client; no size limit; API key logged at debug level; missing rate limit on upload.
- **Traps.** A dependency with a known CVE that is not actually reachable. An "obvious" XSS that is already mitigated by CSP.
- **Rubric anchors.** 9: finds at least six including IDOR and signed-URL binding, prioritises by exploitability, fixes three without breaking uploads, does not over-claim the unreachable CVE. 3: runs a scanner, reports the CVE, misses IDOR.
- **Signals.** Security, Judgment, Code quality.

---

## Test

### T1 · Harden the tests around a pricing engine
**Test** · J/M · 45 min · Python
- **Premise.** Pricing engine with 70% coverage and a bug report that "discounts sometimes stack wrong." Improve the tests; find the bug.
- **Hidden truth.** Percentage and fixed discounts are applied in insertion order rather than the documented order; a hidden mutation set of 40 mutants measures the new suite.
- **Rubric anchors.** 9: reads the spec, writes property-style or table-driven tests, finds and fixes the ordering bug, mutation score above 80%. 3: bumps line coverage with assertion-free tests.
- **Signals.** Testing, Code quality, Debugging.

---

## Operate

### O1 · You are on call: error rate 3% and climbing
**Operate** · S · 45 min · any
- **Premise.** Paged at 02:14. Dashboard shows 5xx rate 3.2% and rising. A stakeholder is asking for an update in 10 minutes. Runbook exists and is partly stale.
- **Hidden truth.** A dependency's deploy 20 minutes ago changed a response schema; the fix is a rollback on their side or a compatibility shim on ours; a feature flag can route around the dependency for most users.
- **Traps.** The stale runbook says to restart pods (does nothing). AI suggests hot-patching the parser in production.
- **Rubric anchors.** 9: reads the dashboard and recent changes across services, flips the flag to protect users within minutes, sends a clear status update, then root-causes and writes a two-paragraph incident note. 3: restarts pods, then starts reading code, no communication.
- **Signals.** Judgment, Debugging, System design.

---

## Coverage summary

| Mode | Scenarios | Levels covered |
| --- | --- | --- |
| Debug | D1, D2, D3, D4 | J to S |
| Investigate | I1, I2, I3 | M to S |
| Review | R1, R2, R3 | J to S |
| Build | B1, B2 | M to S |
| Scale | S1, S2 | S to St |
| Secure | X1 | M to S |
| Test | T1 | J to M |
| Operate | O1 (+ S1 round 2) | S |

Gaps to fill before launch: a junior-level Investigate, a frontend Debug (rendering performance or state bug), a data-pipeline Build, and a mobile-adjacent Review.

## Content principles

1. **Every bug is a correct-looking decision with a wrong assumption**, never a typo.
2. **Every scenario includes at least one AI-favoured wrong answer.** The agent should be genuinely useful and occasionally confidently wrong.
3. **Every scenario has a red herring** that explains part of the evidence.
4. **Every scenario can be varied** along at least two axes without changing the rubric.
5. **Realism over cleverness.** If a staff engineer at the customer would say "that would never happen here," cut it.
6. **The candidate must be able to finish.** Target 70 to 85% completion at the intended level.
