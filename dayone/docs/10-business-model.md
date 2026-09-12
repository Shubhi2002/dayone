# 10 · Business model

Status: draft v1 · September 2026 · numbers are planning assumptions, not forecasts

## What we sell

A hiring team buys **confidence per candidate**. The unit is the assessment (one candidate through one configured loop, typically 60 to 120 minutes across one or two scenarios). Around that unit we sell a platform: library, forking onto their repos, reports, replays, integrations, calibration and support.

## Pricing

Benchmarks: Saffron $199/mo for 5 and $499/mo for 15 (about $33 to $40 per assessment, $49 extra). CodeSignal Build $79/mo annual, Grow $479/mo, credit-based. HackerRank Starter $165/mo, Pro $375/mo. Karat is high-touch enterprise, thousands per hire. Woven is human-scored and priced accordingly.

Our assessments are longer, richer and more expensive to run than Saffron's, and we position on signal quality for experienced hires. Price above Saffron, well below Karat.

| Plan | Monthly | Included assessments | Effective per-assessment | Extra | For |
| --- | --- | --- | --- | --- | --- |
| **Pilot** | $0 for 60 days | 10 | n/a | n/a | Design partners; converts to Team |
| **Team** | $490 | 6 | ~$82 | $95 | Companies hiring 1 to 3 engineers a month |
| **Growth** | $1,490 | 20 | ~$75 | $85 | 3 to 8 hires a month; adds repo forking, ATS integration, role profiles |
| **Scale** | $3,900 | 60 | ~$65 | $75 | Larger teams; adds SSO, custom scenarios, calibration reviews, quarterly validity report |
| **Enterprise** | custom, annual | volume | negotiated | | SOC 2 report, data residency, dedicated calibration engineer, adverse-impact reporting |

Annual prepay: 2 months free. Human calibration review on demand: $60 per session. Custom scenario authored for the customer: $4,000 to $8,000 one-off plus hosting.

Why per-assessment with a platform fee, not pure seats: usage tracks value delivered and hiring volume is lumpy; a platform fee keeps revenue from going to zero in a hiring freeze and pays for library maintenance.

Why not undercut Saffron: our buyer is replacing a 60 to 90 minute senior-engineer interview (loaded cost $150 to $300) and a bad-hire risk measured in months of salary. $75 to $95 is not the constraint; trust is.

## Unit economics per assessment (planning estimate)

| Cost item | Estimate | Notes |
| --- | --- | --- |
| Sandbox compute (90 min, 2 to 4 vCPU, services, warm pool overhead) | $1.50 to $3.00 | Depends on scenario weight and idle warm pool |
| In-sandbox coding agent tokens | $3 to $8 | Saffron includes a $5 Claude budget; multi-round scenarios use more |
| Grading (rubric agents, report composition) | $2 to $3 | See `07-scoring-architecture.md` |
| Human calibration sampling | $4 at 10%, $1.20 at 3% | Falls as agreement stabilises |
| Telemetry synthesis, storage, replay | $0.30 | |
| **Total COGS** | **$11 to $18** | |
| Gross margin at $75 to $95 | **80% to 86%** | Healthy; improves as sampling drops and scenarios are optimised |

Watch items: agent token prices are volatile in both directions; multi-round staff-level scenarios can hit $15 in tokens alone; charge them as 1.5 assessments.

## Revenue model (illustrative, first 24 months)

Assumptions: average revenue per paying customer $1,600/month at month 12 (mix of Team and Growth, some overage), $2,400 at month 24 (more Scale, first enterprise). Monthly logo churn 2.5%.

| Milestone | Paying customers | MRR | ARR |
| --- | --- | --- | --- |
| Month 6 (pilots converting) | 8 | ~$10k | ~$120k |
| Month 12 | 30 | ~$48k | ~$580k |
| Month 18 | 65 | ~$130k | ~$1.6M |
| Month 24 | 110 | ~$260k | ~$3.1M |

This is a "did we find product-market fit in the mid-market" plan, not a venture-scale plan by itself. Venture scale comes from (a) enterprise displacement once validity data exists, (b) the candidate side, and (c) adjacent roles. None of those are in these numbers.

## Go-to-market

### Phase 1 (months 0 to 6): design partners, founder-led

- 8 to 12 design partners from warm network, AI-native startups and companies whose engineering leaders have publicly complained about interviews. Free pilot, weekly feedback, logo and quote rights, first access to validity reports. See `14-design-partner-program.md`.
- Founder sells every deal. The demo is one scenario run live, then one real report. Never slides first.

### Phase 2 (months 6 to 18): repeatable mid-market motion

- **Content marketing built on the data we uniquely have.** "What 1,000 senior engineers actually did with an AI agent when debugging production." "How often engineers accept a wrong AI fix." This is the category's most interesting data and only simulation platforms can produce it.
- **The public practice scenario** as the top-of-funnel for both candidates and hiring managers ("try the assessment yourself").
- **Engineering-leader communities**: CTO Slack groups, LeadDev, Rands Leadership, podcasts. Sell to engineers, not to HR.
- **ATS marketplaces** (Greenhouse, Lever, Ashby) once integrations ship; low-volume but high-intent.
- **Partnerships**: recruiting agencies placing senior engineers (they pay for a differentiated signal); AI-interviewer vendors who screen at volume and need a deep second stage.
- One AE at month 9, one at month 15, both engineering-literate. A solutions engineer at month 12 for forking and custom scenarios.

### Phase 3 (months 18+): enterprise

- Requires SOC 2 Type II, SSO, data residency options, adverse-impact reporting, and the first published validity study.
- Land in one business unit with a Scale plan; expand on the strength of the validity report.

## Candidate side (option value, not year-one revenue)

Free practice tier from month 6, capped per month. Possible later monetisation: premium practice ($15 to $25/mo), verified Engineering Score profile shareable with employers, employer access to opt-in candidate pool. Do not chase this revenue until B2B is stable; do build the data flywheel.

## Key metrics

- Pilots started, pilot-to-paid conversion (target ≥ 50%).
- Assessments per customer per month; net revenue retention (target ≥ 110%).
- Gross margin per assessment (target ≥ 80%).
- Candidate completion rate at senior level (target ≥ 80%), candidate experience score (≥ 4.5/5).
- Report-to-decision time at customers (are they using it in the debrief?).
- Time to first published validity result.

## Risks to the model

- Agent token costs rising or a model-provider policy change on assessment use.
- Incumbent bundling: HackerRank or CodeSignal ships "simulation mode" inside an existing enterprise contract. Our answer is depth and validity, not price.
- Hiring downturn deepening. Platform fee and enterprise annuals cushion it; the pitch "hire fewer, hire right" fits it.
- Long enterprise procurement. Do not build the plan on enterprise before month 18.
