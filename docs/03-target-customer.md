# 03 · Target customer

Status: draft v1 · September 2026 · validate in discovery interviews before locking

## The decision this doc has to make

Dayone could start in three places. Pick one for the first twelve months.

| Option | Who pays | Why it is attractive | Why it is risky |
| --- | --- | --- | --- |
| **A. B2B mid-market engineering teams** | Companies, per assessment or per seat | Clear buyer, clear pain, competitors have proven willingness to pay ($199 to $499/mo) | Crowded; incumbents have distribution; sales cycle needs SOC 2 |
| **B. Candidate practice product first** | Candidates, freemium; later companies | LeetCode's real moat is its candidate community; builds brand, data and a talent pool no B2B competitor has | Slow revenue; consumer growth is hard; risk of becoming "another prep site" |
| **C. Both from day one** | Both | Data flywheel: practice sessions calibrate scoring, calibrated scoring sells to companies | Two products with a three-person team is how startups die |

**Recommendation: A first, with B designed in from the start but not marketed.** Sell to companies, run the same scenarios as a free "practice" tier to build the candidate pool and calibration data, and only invest in candidate growth once B2B revenue covers the team. Revisit at month 9.

## Primary customer (first 12 months)

**Segment.** Product and infrastructure software companies, 50 to 2,000 employees, hiring 5 to 60 engineers a year, US, UK, EU and India, where engineering leadership owns the interview process rather than HR.

**Why them.**
- They hire experienced engineers where DSA screens are most resented and least predictive.
- They already use Cursor, Claude Code or Copilot on the job, so "assess with AI" is obvious to them.
- They are big enough to pay and to care about consistency, small enough to change their interview loop in a quarter without a procurement committee.
- SME penetration of assessment platforms is below 40%, versus above 85% for the Fortune 500.

### Buyer: Head of Engineering / VP Engineering / CTO (at smaller companies, the CTO or founding engineer)

- **Pain they will say out loud:** "Our interviews don't tell us who can actually do the job." "We've been burned by a hire who passed every round and couldn't ship." "Half our take-homes are obviously ChatGPT."
- **Pain they will not say:** their senior engineers hate running interviews, and a bad hire costs them months and political capital.
- **What they buy:** confidence in the hiring decision, fewer interviewer hours, a defensible process.
- **What kills the deal:** false negatives on strong candidates, anything that looks like a proctoring tool, a demo that looks like "LeetCode with a chat box."

### Champion: Staff or Senior engineer who runs the interview loop

- Wants scenarios that would not embarrass them in front of a strong candidate.
- Wants to spend less time in interviews and more time in the debrief.
- Will judge us on the realism of a single scenario. Show them the payment-service latency case, not a slide.

### Economic influencer: Head of Talent / Recruiting lead

- Cares about candidate drop-off, time-to-hire, ATS integration, and not getting sued.
- Will ask about completion rates, adverse impact, and where the data lives.

### User: the candidate

- Not the buyer, but their experience is the product's reputation. Woven reports 85% senior completion; OpenRound sells "the most enjoyable interview they've ever done." A candidate who enjoys a Dayone assessment and does not get the offer is still a future champion at their next company.

## Secondary customers (months 9 to 24)

- **AI-native startups and AI labs** hiring forward-deployed and applied engineers. Small volume, high visibility, great logos. OpenRound already targets this niche with an FDE hiring playbook.
- **Recruiting agencies and staffing firms** placing senior engineers. They pay for signal they can show clients. Fabric's parent business proves the channel exists.
- **Bootcamps and upskilling programs** that want a graduation credential employers trust. Candidate side, not hiring side.

## Enterprise (year 2+)

Fortune 500 engineering orgs. Requires SOC 2 Type II, SSO, data residency, ATS integrations, adverse-impact reporting, procurement patience. Karat, HackerRank and Codility live here. Do not sell here until the validity study exists; it is the only thing that will displace an incumbent.

## Who we are not for

- **Volume screeners** running thousands of junior applicants through a funnel. Our cost per assessment (sandbox plus agent tokens plus grading) is too high and our scenarios are too long. HackerRank and CodeSignal own this.
- **Companies that ban AI in interviews on principle.** Amazon, Goldman Sachs, Anthropic. Not worth arguing with in year one.
- **Non-engineering roles.** Data science and analytics are adjacent and tempting (the Investigate mode overlaps). Say no until year two.
- **Companies that want a talking AI interviewer.** Different product.
- **Anyone who wants us to be a proctoring tool.** Integrity features exist; the product is the simulation.

## Jobs to be done (buyer language)

1. "Tell me whether this senior engineer can walk into our codebase and be useful in week one."
2. "Give me a consistent bar across interviewers so the debrief is about the candidate, not the interviewer."
3. "Get my staff engineers out of first-round interviews without lowering the bar."
4. "Show me how this person works with AI, because that is how they will work here."
5. "Give me something I can defend if a rejected candidate or a regulator asks how we decided."

## Assumptions to validate in discovery (see `15-customer-discovery-plan.md`)

- Buyers will pay $150 to $300 per senior-candidate assessment when it replaces a 60 to 90 minute engineer-led round.
- Buyers prefer library scenarios matched to their stack over scenarios forked onto their own repo, at least at first. (Saffron bets the opposite.)
- Engineering leaders, not recruiting, control the budget for this at companies under 2,000 people.
- Candidates will complete a 60 to 90 minute asynchronous simulation at senior level without a human present. (Woven and OpenRound data suggest yes.)
