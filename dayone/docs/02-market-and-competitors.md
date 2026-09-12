# 02 · Market and competitors

Status: draft v1 · September 2026 · refresh quarterly

## Summary

Demand for AI-era engineering assessment is real, growing and already being served. The thesis "allow AI, real codebase, score the process" became consensus in roughly twelve months. The category has three tiers: incumbents who bolted AI onto existing platforms, two venture-backed AI-native startups doing feature-building assessments, and one human-scored simulation vendor that bans AI. Nobody yet does operational simulations, multi-round scenarios, AI-PR review as a mode, a candidate practice product, or validity research. That is where Dayone should play.

## Demand evidence

| Signal | Figure | Source, date |
| --- | --- | --- |
| Hiring leaders allowing AI in interviews (broadly or with limits) | 46% | CoderPad State of Tech Hiring 2026 |
| Hiring leaders still banning AI entirely | 34% | CoderPad 2026 |
| Leaders deciding case by case | 20% | CoderPad 2026 |
| Engineering leaders saying AI makes skills harder to assess | 71% | Karat, Dec 2025 (n=400, US/India/China) |
| Leaders planning to hire for AI capability | 70% | Karat, Dec 2025 |
| Leaders investing in systems to identify AI-ready talent | <30% | Karat, Dec 2025 |
| Leaders saying weak engineers deliver neutral or negative value with AI | 59% | Karat, Dec 2025 |
| US engineers using agentic coding tools at work | 91% | CodeSignal survey, Mar 2026 |
| New code at Google that is AI-generated | 75% | Sundar Pichai, Apr 2026 |
| AI-proctored interviews showing cheating signals | 38.5% | Fabric, 19,368 interviews, Jul 2025 to Jan 2026 (vendor data) |
| AI-assisted interviews run on CoderPad alone | 35,000+ | CoderPad, 2026 |
| Senior SWE completion rate on realistic simulations | 85% | Woven (vendor data) |

**Big-tech adoption timeline.** Meta AI-enabled coding round (Oct 2025, expanding 2026, four criteria: problem solving, code quality, verification, communication). Canva replaced its CS fundamentals interview with AI-assisted coding (Jun 2025). Google Gemini-required code-comprehension pilot for junior and mid-level SWE (May 2026). Shopify, Rippling, Coinbase, Red Hat, Microsoft all report AI-allowed rounds. Amazon, Goldman Sachs and Anthropic still prohibit AI in interviews.

**Market size.** Estimates vary by an order of magnitude depending on definition and should not be quoted as fact: "technical assessment software" $1.2B (2026) growing ~9.5% CAGR (OpenPR); "technical assessment platform" $6.6B (2026) growing ~14% CAGR (MarketIntelo); broader definitions to $14B+. The useful structural fact from MarketIntelo: Fortune 500 penetration is above 85%, SME penetration below 40%.

**Headwind.** SWE hiring volume is down from 2021 to 2022 levels, especially at junior levels. Offsetting tailwind: per-hire stakes are up. Sell to "we hire fewer, so each one must be right," not to volume screeners.

## Competitor teardown

### Tier 1: AI-native startups (closest to us)

**Saffron** · trysaffron.ai · YC Spring 2026, Afore Capital · SF · 3 people
- Candidates build real features on the customer's actual GitHub repo in a browser IDE with Claude Code. 10+ AI agents score against a custom rubric. Every line classified human / AI-generated / AI-modified. Full keystroke and prompt replay. AI-generated debrief questions. Zero interviewer time.
- Pricing: Basic $199/mo (5 assessments), Premium $499/mo (15), Enterprise custom. $49 per extra assessment. $5 Claude Code budget included per assessment.
- Design: warm off-white, deep purple, Lora serif, Geist Mono. Strong.
- Weaknesses: feature-building only; single task; no operational data (logs, metrics, DB); no candidate side; thin moat acknowledged by outside analysts; tiny team.

**OpenRound** · openround.ai · built by Fabric (Bengaluru, angel-stage, ~$110k raised) · Fabric's core business is an AI recruiting OS for CRED, Meesho, Kearney
- Real codebase, slightly ambiguous ticket, CLI coding agent (Claude Code / Codex style), deliberately weaker models to keep problems hard. Report with six dimensions (Analysis, Discovery, Planning, Judgement, Execution, AI Collaboration) and an overall score with a Recommended flag. Live discussion round inside the platform. Public assessment library with "For Practice" and "For Hiring" items, so they are experimenting with a candidate side. Claims one 90-minute session replaces two interview rounds.
- Weaknesses: a side product of a recruiting-OS company; India-first; small library; feature-building only.

### Tier 2: Incumbents with AI bolted on

**CodeSignal** · ~$87.5M raised (Index, Menlo)
- May 2025: Cosmo AI co-pilot in the IDE (full and guided modes) with transcripts. Aug 2025: AI-Assisted Advanced Coding certified assessment. Mar 2026: agentic coding assessments around Claude Code, Cursor, Codex, followed by a human explain-your-decisions step. Reportedly a third of customers adopted the AI-assisted format in 2025. Still bans AI in the standard GCA. Pricing (Jul 2026): Build $79/mo annual, Grow $479/mo annual, credit-based. Expanding into AI interviewers for non-engineering roles.

**HackerRank** · $60M Series D (2022), revenue estimates unreliable ($20M to $220M depending on source)
- Jul 2025 AI-assisted interviews. Jul 2026 IDE with inline completion, file-aware chat, Plan Mode, Agent Mode. Aug 2026 AI Fluency Evaluation distinguishing strategic use from overreliance. Desktop App Mode for lockdown proctoring. 7,500+ questions. Starter $165/mo, Pro $375/mo. Greenhouse, Lever, Ashby integrations. Deepest distribution in the category.

**Karat** · $110M Series C (2021), $1.1B valuation, layoffs 2023, acquired Triplebyte, AspectAI and Byteboard (Jan 2025)
- NextGen (Dec 2025): production-grade codebase, VS Code, built-in AI assistant, every session led by a certified human interviewer; external AI tools prohibited. Byteboard brought project-based, two-part assessments (technical reasoning + implementation). Publishes the most useful research in the category. Enterprise, high-touch, expensive.

**Codility**
- Screen, Interview and Skills Intelligence. VS Code environments with terminal, packages, multi-file. "Growing library of AI-specific tasks." SOC 2, ISO 27001, designed by I/O psychologists with documented methodology. Their compliance and methodology posture is what enterprise buyers will hold us to.

### Tier 3: The counter-position

**Woven Teams**
- Human-powered simulations: review a PR, debug an outage, hand off work. Double-blind scoring by two certified engineers against a deterministic rubric, third engineer to reconcile. 30 to 120 minutes. 85% senior completion. Explicitly "AI-proof": prefers testing review of AI-generated code to allowing AI. A June 2026 review called that positioning a liability. Woven proves the scenario format works and the human-scoring model is expensive.

### Adjacent

- **Interview Coder, Cluely, Leetcode Wizard.** The cheating tools. Interview Coder Pro is $299/mo; Leetcode Wizard claims a 93% pass rate. They are our best marketing argument.
- **Byteboard** (now Karat), **Qualified.io**, **DevSkiller**, **CodeSubmit**, **TestDome**: project-based assessment vendors without a real AI-era story.
- **AI interviewers** (Fabric, Braintrust AIR, AltHire, micro1, Mercor): talk-to-a-bot screening at volume. Different product; possible channel partners.

## Feature matrix

| Capability | Saffron | OpenRound | CodeSignal | HackerRank | Karat | Codility | Woven | **Dayone (planned)** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AI allowed in assessment | Yes | Yes | Optional | Optional | Built-in only | Yes | No | Yes, expected |
| Customer's own repo | Yes | Matched to stack | No | No | No | No | No | Yes, forked scenarios |
| Feature-building tasks | Yes | Yes | Yes | Yes | Yes | Yes | Some | Yes |
| Debug with logs, metrics, DB | No | No | No | No | No | No | Partial | **Yes** |
| Investigate data / production anomaly | No | No | No | No | No | No | No | **Yes** |
| AI-generated PR review mode | No | No | No | No | No | No | Partial (human PR) | **Yes** |
| Multi-round, changing requirements | No | No | No | No | No | No | No | **Yes** |
| Process scoring (prompts, rejections, reverts) | Yes | Yes | Transcript | AI fluency grade | Human | Partial | Human | Yes, deeper |
| Line-level code attribution | Yes | No | No | No | No | No | n/a | Yes |
| Human calibration | No | Live discussion | Explain step | Interviewer | Yes | Optional | Yes | Sampled |
| Candidate practice side | No | Early | No | Community | No | No | No | **Planned** |
| Published validity evidence | No | No | No | No | Some | I/O psych method | No | **Planned** |
| SOC 2 / ISO | Unknown | Unknown | Yes | Yes | Yes | Yes | Yes | Year 1 target |
| ATS integrations | No | No | Yes | Yes | Yes | Yes | Yes | Year 1 target |

## Implications

1. Do not lead with "AI allowed" or "real codebase". Both are table stakes. Lead with the simulation and the operational modes.
2. Match Saffron's attribution and OpenRound's report on day one; they set the floor.
3. Budget for SOC 2 Type I in the first twelve months. Enterprise conversations die without it.
4. Start collecting validity data with the first design partners. It is slow, so start early.
5. Watch Karat closely. They have the money, the research habit and the Byteboard IP to build what we are describing.

## Sources

- Saffron: https://www.trysaffron.ai/ · https://www.ycombinator.com/companies/saffron
- OpenRound / Fabric: https://www.openround.ai/ · https://fabrichq.ai/ · Tracxn profile
- CodeSignal AI-assisted launch: https://codesignal.com/newsroom/press-releases/codesignal-launches-ai-assisted-coding-assessments-and-interviews-redefining-technical-hiring-in-the-ai-era/ · agentic assessments: https://www.interviewquery.com/p/codesignal-ai-assisted-technical-interviews
- HackerRank AI IDE comparison: https://www.hackerrank.com/writing/ai-assisted-ide-shootout-hackerrank-vs-codesignal-vs-coderpad-q3-2025
- Karat NextGen: https://karat.com/karat-launches-nextgen-interviews-the-first-human-led-ai-enabled-talent-evaluation-solution/ · report: https://karat.com/resource/ai-workforce-transformation-report/ · Byteboard acquisition: https://www.geekwire.com/2025/technical-recruiting-startup-karat-makes-third-acquisition-swooping-up-byteboard/
- Codility: https://www.codility.com/
- Woven: https://www.woventeams.com/ · review: https://www.joinnextdev.com/blog/woven-teams-review-still-worth-it-in-2026
- Meta AI-enabled round: https://www.hellointerview.com/blog/meta-ai-enabled-coding · Google pilot: https://customcareer.miami.edu/blog/2026/05/14/googles-ai-assisted-coding-interview-2026-guide/ · policies overview: https://devsunite.com/blog/can-you-use-ai-in-a-coding-interview-the-2026-rules
- Cheating: https://www.cnbc.com/2025/03/09/google-ai-interview-coder-cheat.html · https://fabrichq.ai/blogs/interview-cheating-in-2026-the-rise-of-ai-tools-like-cluely-and-interview-coder
- Market size: https://marketintelo.com/report/technical-assessment-platform-market · https://www.openpr.com/news/4237667/technical-assessment-software-market-by-type-and-application
