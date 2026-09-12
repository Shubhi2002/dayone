# 16 · Risks and open questions

Status: draft v1 · September 2026 · review monthly; move resolved items to `18-decision-log.md`

## Risk register

Likelihood and impact on a 1 to 5 scale. Score = L × I.

| # | Risk | L | I | Score | Early warning | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | **Thesis is consensus; incumbents ship "simulation mode"** inside existing enterprise contracts before we have distribution | 4 | 5 | 20 | HackerRank or CodeSignal announce multi-round or incident scenarios | Depth (operational modes, coupled rounds), validity data, candidate side; move fast on design partners; never compete on price | Founders |
| R2 | **Buyers like the demo but keep a human in the loop and will not pay for async** | 3 | 5 | 15 | Pilot conversion under 3 of 8; "we'd use this alongside, not instead" | Offer live-join and human-led debrief variants; price the human layer; test in discovery (H3, H4) | Founders |
| R3 | **Scenario content is slow and expensive to author** | 4 | 4 | 16 | More than 3 weeks per scenario; fewer than 6 variants | Authoring toolkit and linter; paid external author network; families with shared worlds (`12`) | Content lead |
| R4 | **Automated grading disagrees with humans or drifts** | 3 | 5 | 15 | Agreement under 80%; dispute rate over 8% | Anchor sets, multi-model graders, evidence citations, high human sampling until proven | Scoring lead |
| R5 | **Adverse impact found in scores or integrity flags** | 3 | 5 | 15 | Four-fifths screen fails on any dimension or scenario | Design for job-relatedness; monitor from first 200 sessions; revise scenarios; counsel engaged early | Founders + counsel |
| R6 | **Content leaks and scores inflate** | 4 | 3 | 12 | Score drift, collapsing time-to-hypothesis, public postings | Variants, process-weighted scoring, monitoring, retirement | Content lead |
| R7 | **Agent token cost or provider policy makes per-assessment cost too high** | 2 | 4 | 8 | Token cost per session over $10; provider ToS changes | Multi-provider agent host; budgets; charge long simulations as 1.5 units | Eng lead |
| R8 | **Senior candidates refuse or abandon long sessions** | 2 | 4 | 8 | Completion under 70% at senior level | Split sittings, shorter default loops, better invitations, practice scenario | Product |
| R9 | **Hiring downturn deepens; budgets frozen** | 3 | 3 | 9 | Pipeline stalls; partners pause roles | Platform fee, annual plans, "hire fewer, hire right" pitch | Founders |
| R10 | **Two-person or three-person team spreads across B2B, candidate side and content** | 4 | 4 | 16 | Slipping milestones in more than one area | B2B first, candidate side designed-in not marketed; hire content help early | Founders |
| R11 | **EU AI Act high-risk obligations arrive faster than our compliance capacity** | 3 | 4 | 12 | Enterprise EU prospects ask for conformity documentation | Readiness memo now; documentation as a living artefact; EU hosting option | Founders + counsel |
| R12 | **A false cheating accusation becomes public** | 2 | 5 | 10 | Any flag shown to a customer without human review | Flags never change scores; human review before any customer sees a flag; careful language | Product |
| R13 | **Karat uses Byteboard IP and its research habit to build this first** | 3 | 4 | 12 | Karat NextGen adds async simulations or an event mechanic | Speed, mid-market focus where Karat is weak, candidate side | Founders |
| R14 | **Model provider becomes a competitor** (assessment product from a lab or from GitHub) | 2 | 4 | 8 | Announcements | Content and validity moat; be the neutral multi-model platform | Founders |
| R15 | **Sandbox security incident** (escape, data exposure of customer code) | 2 | 5 | 10 | Pen-test findings | Isolation by design, customer code in customer tenancy, third-party pen test before forking ships | Eng lead |

## Open questions

Grouped by when they need an answer.

### Before design partners (weeks 0 to 6)

- **Wedge:** B2B first with candidate side designed-in (proposed) or two-sided from day one? Decide after discovery.
- **Shared-world families vs. standalone modes:** proposed in `12`; confirm after concierge sessions.
- **Price:** $75 to $95 per assessment or per 30-minute round unit? Test both framings in discovery.
- **Agent model policy:** strong frontier model (realism, less incentive to go outside) or deliberately weaker (OpenRound's approach, harder problems)? Proposed: strong, disclosed, fixed per scenario.
- **Do candidates see rubric items before the session?**

### Before build (weeks 6 to 8)

- **Which two scenario families first** and in which two stacks? Discovery will tell us the stack mix.
- **Build vs. buy for the browser IDE, sandbox orchestration and agent host.** Technical planning, not this doc, but the decision shapes cost per session.
- **How many grader runs** (5 vs. 10) and how many model families?
- **Who are the first three external rubric reviewers per scenario?**

### During MVP (months 1 to 6)

- **Do buyers read process signals?** If not, redesign the report before adding more signals.
- **Is 60/30/10 the right mix** of rubric, process and outcome? Only data will say.
- **Does coupling rounds add signal or noise?** Compare S1-style coupled sessions with independent rounds.
- **What is the actual cost per session?**
- **Are integrity flags firing fairly?**

### Later

- When to start the candidate practice tier in earnest.
- Whether to grade the agent's own behaviour to normalise across model versions.
- Adjacent roles: data engineering first, or SRE?
- Fundraising timing and narrative: after 8 converted partners and the first agreement data, or earlier on the thesis?

## Assumptions we are consciously making

Written down so we notice when they stop being true.

1. Companies will keep hiring experienced engineers at meaningful volume through 2027.
2. Coding agents remain available to third-party platforms at reasonable cost.
3. Structured work samples remain legally the most defensible assessment format.
4. Engineering leaders, not HR, control the interview loop at companies under 2,000 people.
5. Candidates prefer a realistic simulation over an algorithm screen, and will say so publicly.
6. No competitor publishes credible predictive validity data in the next 18 months.
