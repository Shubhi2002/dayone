# 04 · Interview modes

Status: draft v1 · September 2026

## How to read this

A **mode** is a family of scenarios with a shared shape, shared instrumentation and a shared primary signal. Modes are the recruiter-facing vocabulary ("assign a Debug scenario") and the internal taxonomy for building scenario content. A single scenario can blend modes across rounds; see `12-one-scenario-vs-many-modes.md` for the argument about how far to push that.

**AI collaboration is not a mode.** It is a lens applied to every mode, because in every scenario the candidate has an agent and we record how they use it. Treating it as a separate round would recreate the mistake of testing skills in isolation.

## The eight modes

| # | Mode | The situation | Primary dimensions | Secondary | Typical length |
| --- | --- | --- | --- | --- | --- |
| 1 | **Debug** | Something is broken or slow in a working system. Find the cause, fix it, prove it. | Debugging, Testing | Performance, Code quality, Judgment | 60 to 90 min |
| 2 | **Investigate** | A number moved and nobody knows why. Logs, metrics, DB, tickets, chat threads. Explain it. | Judgment, Debugging | System design, Performance | 45 to 60 min |
| 3 | **Review** | Here is a PR (usually AI-generated). Would you ship it? | Judgment, Security, Code quality | Testing, Performance | 30 to 45 min |
| 4 | **Build** | Add a capability to an unfamiliar codebase without breaking it. | Code quality, Testing | Judgment, System design | 60 to 90 min |
| 5 | **Scale** (evolutionary design) | The system works. Now traffic, regions or SLOs change. Adapt it, and implement the first step. | System design, Performance | Judgment, Debugging | 90 to 120 min, multi-round |
| 6 | **Secure** | Audit a working service. Find, prioritise and fix vulnerabilities. | Security, Judgment | Code quality, Testing | 45 to 60 min |
| 7 | **Test** | Production code with weak tests. Find the gaps, write the suite, catch the planted bug. | Testing, Code quality | Debugging | 45 to 60 min |
| 8 | **Operate** (incident) | You are paged. Triage, mitigate, communicate, then fix properly. | Judgment, Debugging | System design, Performance | 45 to 60 min, timed pressure |

Fundamentals (algorithmic thinking) are not a mode either. Where they matter they appear inside a scenario: a Debug case where the fix requires recognising an O(n²) hot path, or a Scale case that needs a consistent-hashing decision. The candidate never sees "implement a binary tree."

## Mode details

### 1 · Debug

- **Setup.** A service with a realistic bug or regression, plus the evidence a real engineer would have: logs, metrics with a deploy marker, failing or flaky tests, a ticket written by a non-expert, a load-test harness.
- **What good looks like.** Reproduce before changing anything. Form a hypothesis, test it cheaply. Reject plausible-but-wrong fixes (the AI will offer them). Fix the cause, not the symptom. Add a regression test. Verify with the same tool that showed the problem.
- **What we instrument.** Order of actions (ran tests before editing? looked at metrics before code?), hypotheses stated to the agent, AI suggestions rejected with reasons, reverts, time to first correct hypothesis, whether the verification step happened.
- **Traps to plant.** A decoy that explains some of the symptoms. An AI-favoured fix that moves the bottleneck. A second, unrelated bug that a careless fix exposes.
- **Anti-pattern to avoid in content.** Bugs that are typos. Real regressions come from correct-looking code with the wrong lifecycle, scope, ordering or assumption.

### 2 · Investigate

- **Setup.** A business or production anomaly with no obvious code cause. A warehouse or database, an event stream, feature-flag history, deploy history, two or three internal chat threads (at least one red herring), a dashboard.
- **What good looks like.** Frame the question precisely. Segment the metric (by platform, region, cohort, flag). Rule things out in order of likelihood and cost. Write a conclusion with confidence level and what would confirm it.
- **What we instrument.** Queries written (and whether they answer the question asked), segmentation strategy, how the red herring was handled, quality of the written conclusion, whether the candidate said "I don't know yet" where appropriate.
- **Why it matters.** Closest to what senior engineers actually do, and almost nobody assesses it. Also our bridge to data and analytics roles later.

### 3 · Review

- **Setup.** A PR that passes CI, usually authored by a coding agent, with a linked ticket. The candidate can read the diff, open the sandbox, run things, and ask the agent. They log findings with severity, choose ship / request changes / block, and write a summary for the author.
- **What good looks like.** Finds the issues that matter (atomicity, authorisation, idempotency, race conditions, precision, missing requirement) and ranks them correctly. Does not drown the author in nits. Notices that passing tests were written by the same agent and test the code, not the requirement.
- **What we instrument.** Recall and precision against the planted-issue key, severity calibration, whether the candidate verified a suspected issue by running it, tone and usefulness of the summary.
- **Why it matters.** As AI writes more code, this is the skill that grows in value fastest. It is also cheap to author, hard to cheat (no artefact to paste), and short. Likely the best top-of-funnel scenario.

### 4 · Build

- **Setup.** An existing codebase of 2k to 10k lines with conventions, tests and a CI config. A ticket with a little ambiguity and one non-obvious constraint. Never a blank editor.
- **What good looks like.** Reads before writing. Follows the codebase's conventions rather than the agent's defaults. Asks or decides explicitly on the ambiguity. Tests the new behaviour and the old. Leaves the code better than found.
- **What we instrument.** Exploration before first edit, convention adherence, handling of the ambiguity, test coverage of new paths, size and coherence of the diff, how much AI-generated code was reviewed versus accepted wholesale.
- **Caveat.** This is what every competitor already does. Ship it because buyers expect it, but never lead with it.

### 5 · Scale (evolutionary design)

- **Setup.** A working service with an architecture diagram and live metrics. Round 1 is usually a small Debug or Build task to learn the system. Then an event: traffic 20×, second region, new SLO, new compliance constraint. The candidate proposes changes, writes down trade-offs, and implements the first step in the sandbox.
- **What good looks like.** Measures before redesigning. Proposes the smallest change that meets the new requirement. Names what breaks next. Writes trade-offs a teammate could disagree with.
- **What we instrument.** Trade-off document quality, whether the proposal is grounded in the observed metrics, correctness of the implemented step, how the design changes across rounds (do they carry forward or restart?).
- **Why it matters.** Replaces "design Uber" with design that is anchored in a real system and testable. The multi-round shape is unique to us.

### 6 · Secure

- **Setup.** A working service with 6 to 10 planted weaknesses of varying subtlety (path traversal, IDOR, signed-URL flaw, SSRF, unsafe deserialisation, missing rate limit, secret in a log line). Candidate reports, prioritises and fixes the top few.
- **What good looks like.** Finds the subtle ones, not only the scanner-detectable ones. Prioritises by exploitability and impact. Fixes without breaking behaviour. Does not report false positives with high confidence.
- **What we instrument.** Recall by subtlety tier, precision, prioritisation quality, fix correctness, whether the agent was used to explain a class of vulnerability versus to hunt blindly.

### 7 · Test

- **Setup.** Production code with a weak or misleading test suite and at least one latent bug the existing tests miss. Candidate improves the suite; a hidden mutation set measures what the new tests actually catch.
- **What good looks like.** Identifies the missing cases by reading the code, not by guessing. Writes tests that fail for the right reasons. Finds the latent bug.
- **What we instrument.** Mutation score, whether the latent bug's test was written, test readability, whether the candidate deleted or fixed misleading tests.

### 8 · Operate (incident)

- **Setup.** The candidate is on call. A page arrives with a dashboard, a runbook (possibly out of date), logs, and a stakeholder asking for an update. Clock pressure is real and visible.
- **What good looks like.** Triage order (user impact first). Mitigate before root-causing (feature flag, rollback, scale) when appropriate. Communicate clearly and early. Then root-cause. Writes a short post-incident note.
- **What we instrument.** Time to mitigation, safety of the mitigation (reversible?), communication quality and timing, whether root-causing waited until users were safe.
- **Why it matters.** Distinguishes seniors from strong mid-levels better than almost anything. Most companies have no way to assess it today.

## Mode by seniority

| Mode | Junior / new grad | Mid-level | Senior | Staff+ |
| --- | --- | --- | --- | --- |
| Debug | Core, simpler bugs | Core | Core | Optional |
| Investigate | Light | Core | Core | Core |
| Review | Light (human PR) | Core (AI PR) | Core | Core |
| Build | Core | Core | Optional | Rarely |
| Scale | No | Light | Core | Core, multi-round |
| Secure | No | Optional | Optional | Optional |
| Test | Core | Optional | Optional | No |
| Operate | No | Light | Core | Core |

## Recommended default loops

- **Mid-level backend, 90 min total:** Review (30) + Debug (60).
- **Senior backend, 2 sessions:** Debug with Operate event (75) · Scale multi-round (90).
- **Staff, 1 long simulation:** Scale multi-round starting from a Debug task, with an Operate event injected in round 2 and an Investigate question in round 3 (120).
- **New grad, 60 min:** Build (45) + short Review of a human PR (15).

## Coverage check against the Engineering Score

| Dimension | Modes that carry primary signal |
| --- | --- |
| Debugging | Debug, Investigate, Operate |
| Code quality | Build, Review |
| System design | Scale, Investigate |
| Testing | Test, Debug, Build |
| Performance | Debug, Scale |
| Security | Secure, Review |
| AI collaboration | All (lens) |
| Engineering judgment | Review, Investigate, Operate, Scale |

Every dimension has at least two modes carrying primary signal, so no dimension depends on a single scenario type.
