# 13 · Pitching Dayone to companies

Status: draft v1 · September 2026 · for founder-led sales to engineering leaders

## Who is in the room

Primary: Head of Engineering, VP Eng, CTO. Secondary: the staff engineer who runs the loop, and Head of Talent. Sell to the engineer in the room. The recruiter needs to not object; the engineer needs to be excited.

## The pitch in 30 seconds

> Your engineers ship with AI every day. Your interviews still pretend they don't, and the candidates who game them best are not the ones you want. Dayone drops a candidate into a realistic production scenario, with an AI agent, and shows you how they actually engineer: how they debug, what they verify, which AI suggestions they reject, and how they decide under pressure. One 90-minute session replaces your algorithm screen and one technical round, and you get a report your panel can act on.

## The pitch in 3 minutes (narrative)

1. **The job changed.** Three quarters of new code at Google is AI-generated. Your team uses Cursor or Claude Code. The scarce skill is steering, verifying and deciding.
2. **The test broke.** Invisible AI overlays pass LeetCode screens. Take-homes are one-shotted. Your best signal has become your weakest.
3. **Everyone's fix is shallow.** The big platforms added a chat panel and a transcript. The task is still "build a feature." That measures whether someone can prompt, not whether you can trust them with production.
4. **Dayone is the flight simulator.** A real service, real logs and metrics, a ticket, an agent, and a clock. Then the requirements change. We record every decision.
5. **You get a score you can defend.** Eight dimensions, each backed by moments in a replay. Process signals like "reproduced before editing" and "rejected a wrong AI fix with a reason." Debrief questions written for your panel.
6. **It gets better with your data.** We are building the evidence that these scores predict on-the-job performance, and design partners get it first.

Then stop talking and run a scenario live.

## The demo

Never slides first. Order:

1. **Show the candidate view** for D1 (payment-service latency). Let them read the ticket. Ask: "What would you do first?" Let them drive for two minutes. They will open metrics. Good.
2. **Show the agent panel** and the moment the agent proposes raising the pool size. Ask: "Would you accept that?" The engineer in the room says no and explains why. Say: "That, right there, is what we score."
3. **Switch to the report** for a real (anonymised) session. Two seconds on the score, then straight to key moments and the replay at 00:14 where the candidate rejected the fix.
4. **Show the library** and how they would configure a loop for their next senior backend role.
5. Close with the pilot offer.

Total: 15 minutes. Leave 15 for questions.

## Objections and answers

| Objection | Answer |
| --- | --- |
| "We already allow AI in our interviews." | Good, so you agree on the premise. What are you measuring about how they use it? Show the AI collaboration panel and the blind-accept signal. |
| "Our engineers like doing the interviews." | Keep them for the final round. Dayone replaces the screen and first technical round, so your engineers spend their time on candidates who have already shown they can operate. Show interviewer hours saved. |
| "Candidates will hate a 90-minute take-home." | It is not a take-home; it is a job. Woven sees 85% senior completion on simulations. OpenRound's candidates call it the best interview they've done. We will share our completion and experience scores monthly. |
| "How do I know they didn't cheat?" | With the agent in the sandbox, there is little to gain from outside help, and we score the process: a pasted solution has no reproduction, no hypotheses, no verification. Flags go to a human, never to the score. And there is no webcam, which your candidates will thank you for. |
| "Is this just Saffron / CodeSignal?" | They test whether someone can build a feature with AI. We test whether someone can operate a system: debug it, review AI's PR, survive a traffic spike, get paged. Show the library filter. |
| "An AI is grading my candidates?" | Five independent graders per rubric item with cited evidence, a human review on a sample and on every disagreement or dispute, and you can watch the replay yourself. We publish agreement rates. |
| "What about bias and legal exposure?" | Structured, job-related work samples are the most defensible assessment format there is. We monitor adverse impact, keep humans in the loop, disclose to candidates, and support dispute and deletion. Detail in our compliance note. |
| "We need SOC 2 / SSO / Greenhouse." | SOC 2 Type I on the roadmap for month 12, Greenhouse, Lever and Ashby by month 9. For the pilot, candidate data is minimal and we sign a DPA. |
| "What does it cost?" | $75 to $95 per assessment on a plan, less than one hour of a senior engineer's loaded time, and the pilot is free. |
| "How do we know the score means anything?" | Today: rubric validity from external senior engineers, and you will see the evidence for every number. Within a year: a validity study against manager ratings. You get that data first if you are a design partner. Nobody else in the category is even collecting it. |

## Proof points to carry

- Industry: 46% allow AI; 71% of leaders say skills are harder to assess; Meta and Google run AI-enabled rounds; 91% of engineers use agentic tools.
- Ours (fill in as they exist): completion rate, experience score, agent-human agreement, a named design partner quote, the "AI-favoured wrong fix" acceptance rate across sessions (the single most quotable stat we will produce).

## The pilot offer

- 60 days, 10 assessments, free. Two scenarios matched to their stack. Weekly 30-minute feedback call. We hand-review every report in the pilot.
- In return: at least 10 real candidates, a debrief interview after each hiring decision, permission to collect manager ratings at 3 and 6 months for hires, a logo and a quote if they are happy.
- Conversion: Team or Growth plan at list price. Design partners keep a 20% discount for the first year.

## Deck outline (for after the demo, or when a deck is required)

1. Title: Interviews that feel like the job.
2. The job changed (one chart: AI-generated code share, agentic tool adoption).
3. The test broke (cheating tool screenshots, the 38% stat).
4. What everyone else did (chat panel bolted onto a quiz).
5. Dayone: the flight simulator (one mockup, mockup 01).
6. Modes (Debug, Investigate, Review, Build, Scale, Secure, Test, Operate).
7. A real report (mockup 02).
8. How scoring works and how we keep it honest (graders, human calibration, disputes).
9. Candidate experience (completion, experience score, no webcam).
10. Integrity without surveillance.
11. Validity programme: what we are building that nobody else is.
12. Pricing and the pilot.
13. Team.

## Pitch hygiene

- Say "assessment" and "scenario," not "test" and "question."
- Never say "LeetCode for the AI era." Say "flight simulator."
- Show a candidate report before a pricing slide, always.
- Do not claim predictive validity we do not have. Say "we are building the evidence" and show the plan.
- Write down every objection we hear and add it to this doc.
