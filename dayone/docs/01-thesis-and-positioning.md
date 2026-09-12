# 01 · Thesis and positioning

Status: draft v1 · September 2026 · owner: founders

## The one-sentence thesis

> If AI can write the code, an interview should test whether an engineer can understand, direct, debug, evaluate and ship software. Dayone puts candidates inside a realistic engineering environment, with AI, and scores how they operate.

## Why now

Three shifts landed between mid-2025 and mid-2026, and together they make the old interview format indefensible.

1. **The job changed.** Google disclosed in April 2026 that 75% of new code at Google is AI-generated and human-approved. CodeSignal's March 2026 survey found 91% of US engineers use agentic coding tools at work. The scarce skill is no longer producing code; it is specifying, steering, verifying and deciding.
2. **The old test broke.** Invisible AI overlays (Interview Coder, Cluely, Leetcode Wizard) made remote LeetCode screens close to worthless. Fabric measured cheating signals in roughly 4 in 10 of 19k AI-proctored interviews; Karat quotes leaders suspecting 80% of take-home submissions are LLM-assisted. Companies are either retreating to in-person loops or redesigning the test.
3. **Big tech gave everyone permission.** Meta added an AI-enabled coding round in October 2025. Google began piloting a Gemini-required code-comprehension round in May 2026. Canva, Shopify, Rippling, Coinbase and Red Hat have AI-allowed rounds. Mid-market hiring committees no longer need to be brave to follow.

Meanwhile 71% of engineering leaders say AI makes technical skill harder to assess, and 70% plan to hire for AI capability while fewer than 30% are investing in the tooling to identify it (Karat, Dec 2025). That gap is the market.

## What we believe that others do not (yet)

The consensus position in 2026 is: "allow AI, use a real codebase, record the transcript." Every incumbent and both AI-native startups have shipped that. We hold four further beliefs that the market has not acted on.

| Belief | Consequence for the product |
| --- | --- |
| **Building a feature is the easiest thing to test and the least differentiating.** Real engineering is mostly operating existing systems under uncertainty. | Lead with Debug, Investigate, Review and Scale scenarios, not "add a feature to this repo". |
| **The unit of assessment is a situation, not a task.** Requirements change, information is incomplete, someone pages you mid-way. | Multi-round simulations with injected events, not single prompts. |
| **Process is the signal; the artefact is a by-product.** Two candidates can submit the same diff with completely different engineering quality. | Instrument everything: prompts, rejected suggestions, what was run before what was changed, reverts. Score the trajectory. |
| **A score that cannot be shown to predict job performance is a vibe.** No one in the category has published validity evidence. | Run validity studies from the first design partners. Make "predictive validity" the enterprise wedge. |

## Positioning

### Against LeetCode and DSA screens

LeetCode is the driving-theory test. Dayone is the flight simulator. We do not claim algorithms are useless; we claim they are the wrong primary signal and the easiest one to fake in 2026. A small fundamentals layer can stay inside a Dayone scenario (see `04-interview-modes.md`).

### Against the incumbents (HackerRank, CodeSignal, Codility, Karat)

They added an AI chat panel and a transcript to an existing IDE and question bank. Their scenarios are still "here is a task, produce code." Their scoring is still mostly pass/fail tests plus an AI-fluency grade layered on top. Their strength is distribution, compliance and integrations, not signal quality. We win on the depth of the simulation and the richness of the process signal; we lose, for now, on SOC 2 and ATS breadth, and must close that gap within a year.

### Against the AI-native startups (Saffron, OpenRound)

They are closest to us and were first. Both do "real feature on a real repo, with a coding agent, scored by AI agents". Saffron's line-level attribution and OpenRound's dimension report are good and we should match them. Neither does operational scenarios (logs, metrics, incidents, data anomalies), multi-round simulations, AI-generated PR review as a first-class mode, a candidate-side practice product, or validity research. That is our whitespace.

### Against Woven

Woven runs human-scored work simulations (review a PR, debug an outage) but positions itself as "AI-proof" and bans AI. We share their scenario philosophy and reject their AI stance. Woven's completion rates among seniors (85%) are a useful proof point that engineers will sit through realistic simulations.

## Positioning statement

> **For** engineering leaders who hire experienced engineers and no longer trust algorithm screens,
> **Dayone is** an engineering assessment platform
> **that** puts candidates inside a realistic, sandboxed production scenario, with AI tools, and scores how they debug, build, verify and decide,
> **unlike** LeetCode-style screens or AI-copilot bolt-ons,
> **because** we simulate the job, instrument the process, and are building the evidence that the score predicts on-the-job performance.

## Taglines under consideration

- Interviews that feel like the job. *(current, on the brand assets)*
- Don't interview engineers on code they can ask AI to write. Interview them on what they do with AI.
- We don't test whether you can solve a puzzle. We test whether we can trust you with production.
- Day one, before day one.

## What we are not

- Not a proctoring or cheating-detection company. Integrity is a feature, not the product.
- Not an AI interviewer that talks to candidates. Scenarios are the interviewer.
- Not a general HR assessment platform. Software engineering only, at least until Series A.
- Not "LeetCode with AI allowed". If the deck can be summarised that way, the deck is wrong.

## Open questions

- Is the wedge B2B (sell to engineering teams) or two-sided (candidate practice product first)? See `03-target-customer.md` and `11-mvp-and-roadmap.md`.
- How much of a fundamentals layer do senior buyers still expect? Test in discovery interviews (`15-customer-discovery-plan.md`).

## Sources

Google AI-generated code share (Pichai, April 2026); CodeSignal agentic tools survey (March 2026); Fabric cheating analysis (July 2025 to Jan 2026); Karat AI Workforce Transformation Report (Dec 2025); Meta AI-enabled coding round (Hello Interview, interviewing.io); Google code-comprehension pilot (May 2026); CoderPad State of Tech Hiring 2026. Full links in `02-market-and-competitors.md`.
