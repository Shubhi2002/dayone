# 12 · One rich scenario or many interview modes?

Status: draft v1 · September 2026 · decision proposed, to be confirmed after the concierge test

## The question

Should a Dayone assessment be **one engineering situation in a sandbox that exercises many skills** (the candidate joins the payments team and, over 90 to 120 minutes, debugs, reviews, redesigns and gets paged), or **a set of distinct interview modes** (a Debug scenario, then a Review scenario, then a Design scenario), each testing one thing well?

This is the most consequential product decision before build. It shapes content authoring, scoring, pricing, candidate fatigue and how the product is explained.

## The case for one rich scenario

1. **It is the thesis.** "Flight simulator, not a quiz" implies continuity: one system, evolving pressure, decisions that carry consequences into the next round. A sequence of unrelated modes is a better quiz, but still a quiz.
2. **Context is expensive for candidates.** Learning a codebase takes 15 to 25 minutes. Doing it three times in three modes wastes half the session on orientation and measures reading speed more than engineering.
3. **Realism.** Real work is not partitioned. The person debugging the latency regression is the one who then reviews the fix PR and then answers "will this hold at 20×?" Watching one person carry a problem across those transitions is the senior-engineer signal.
4. **Judgment shows up in transitions.** Choosing to mitigate before root-causing, or to defer a redesign until measured, only appears when the scenario has a before and an after.
5. **Harder to game.** Later rounds depend on earlier choices; leaked solutions to round 1 do not produce round 3.
6. **A better story to sell.** "Your candidate spent two hours on our payments team" beats "your candidate did three exercises."

## The case for distinct modes

1. **Cleaner measurement.** A Review scenario yields a clean Judgment and Security signal. Inside a long simulation, a weak Review round may be caused by fatigue or by a poor round 1, not by weak review skill. Attribution is muddier.
2. **Content cost and reuse.** A 45-minute Review scenario is a week to author and can be used by every customer. A 120-minute four-round simulation is a month to author, harder to vary, and heavier to run.
3. **Composability for buyers.** Teams want to configure loops: "Review for everyone, Debug for backend, Scale for seniors." Modes are the natural unit of configuration and pricing.
4. **Shorter time-to-signal at the top of the funnel.** A 30-minute Review as a first screen is a real product on its own and cheap to run. A 2-hour simulation is not a first screen.
5. **Fatigue and drop-off.** Completion rates fall with length. Two 45-minute sessions on different days may outperform one 2-hour session.
6. **Failure isolation.** If round 1 goes badly, the candidate's whole session is compromised in a single-scenario design. Distinct modes give a fresh start.
7. **Every competitor is single-mode.** Being multi-mode is already differentiated; multi-round on top is a second bet stacked on the first.

## What the trade-off actually is

The two options are not opposites. The real variables are:

- **Shared world vs. separate worlds:** do the modes happen inside the same codebase and story?
- **Coupled vs. independent rounds:** does round N depend on the candidate's output in round N−1?
- **One sitting vs. several.**

| | Separate worlds | Shared world, independent rounds | Shared world, coupled rounds |
| --- | --- | --- | --- |
| Orientation cost | Paid once per mode | Paid once | Paid once |
| Measurement cleanliness | Highest | High (each round starts from a known state) | Lower (round N inherits round N−1) |
| Realism and transitions signal | Low | Medium | Highest |
| Authoring cost | Lowest per mode | Medium | Highest |
| Gaming resistance | Medium (variants) | Medium-high | Highest |
| Configurability for buyers | Highest | High | Low |
| Completion risk | Lowest per session | Medium | Highest |

**Shared world, independent rounds** captures most of the realism benefit and most of the measurement benefit. The candidate learns one codebase and one story. Each round starts from a canonical state (we reset the repo to the "correct" fix at the start of round 2 regardless of what the candidate did, and tell them so: "your teammate finished the fix overnight; here is the PR"). Modes remain the unit of configuration, but they are drawn from the same scenario family.

## Proposed decision

**Build modes as the unit of content and configuration. Build scenario families as the unit of world. Default loops chain 2 to 3 rounds from one family in a shared world with independent starts. Reserve coupled multi-round simulations for senior and staff loops.**

Concretely:

1. A **scenario family** is one codebase, one company, one story (the payments team, the notification service). It ships with several **rounds**, each a mode-shaped exercise: a Debug round, a Review round (the PR that fixes the Debug bug, authored by an agent), an Operate round, a Scale round.
2. A **loop** is an ordered selection of rounds, with time budgets. Default loops per level are in `04-interview-modes.md`. A 30-minute Review round alone is a valid loop and our cheapest top-of-funnel product.
3. Rounds start from a **canonical state**, not from the candidate's prior output, except in explicitly **coupled** simulations (S1) used for senior and staff hiring where the transition signal is worth the measurement noise.
4. Rounds may be scheduled in **one sitting or split across days**; the report is per loop, with per-round detail.
5. Scoring is per round per dimension, rolled up per loop. Fatigue effects are visible because we can see round order; when we have enough data, we norm for position.

## What this means for other docs

- `04-interview-modes.md`: modes stand; "recommended default loops" become loop templates drawn from families.
- `05-sample-scenarios.md`: D1, R1 and O1 should be rewritten as three rounds of one payments family; D2, S1 rounds as one notification family. I1 and B1 can remain standalone families for now.
- `08-product-design.md`: the round stepper, the "teammate finished it overnight" reset, and per-round time budgets become core UI.
- `10-business-model.md`: price per round-hour rather than per assessment may be cleaner; a 30-minute Review costs less than a 120-minute simulation. Proposed: bill in 30-minute round units, with a loop of 3 units equal to one "assessment."
- `11-mvp-and-roadmap.md`: the MVP builds two families (payments, notifications) with 3 rounds each rather than 6 unrelated scenarios. Same content volume, better product.

## How we will know if this is wrong

- If design partners overwhelmingly assign single rounds and never chain, the shared world is not valued and we simplify to modes.
- If completion collapses beyond two rounds, split sittings by default.
- If round-2 scores correlate more with round-1 scores than with the round-2 rubric, coupling is leaking noise; keep rounds independent.
- If candidates in the experience survey describe the session as "a project" rather than "a test," the shared world is doing its job.
