# 17 · Legal, fairness and compliance

Status: draft v1 · September 2026 · this is a planning note, not legal advice; engage employment counsel in the US, UK and EU before the first paid customer

## Why this doc exists before the technical plan

Dayone is an employment assessment that uses automated decision support. That places it inside several regulatory regimes at once, some of which are new and strict. Getting the design right now is cheap; retrofitting consent flows, audit logging, bias audits and explainability into a shipped scoring pipeline is expensive. Compliance is also a sales asset: Codility sells on I/O psychology and ISO certifications, and enterprise buyers will hold us to that bar.

## Regimes that apply

| Regime | What it requires of us | Design consequence |
| --- | --- | --- |
| **US Title VII and EEOC Uniform Guidelines on Employee Selection Procedures** | Selection procedures must be job-related and consistent with business necessity; monitor for adverse impact (four-fifths rule as a screen); validation evidence if impact is found | Work-sample design with documented content validity; adverse-impact monitoring by dimension and by scenario; the validity programme in `07-scoring-architecture.md` |
| **NYC Local Law 144 (Automated Employment Decision Tools)** | Annual independent bias audit published; candidate notice at least 10 business days before use; disclosure of data categories | Bias-audit-ready data model from day one; customer-facing notice templates; a public audit summary page per year for customers using Dayone in NYC |
| **Illinois, Colorado, California and other state AI-in-hiring laws (evolving)** | Notice, impact assessments, opt-out or alternative process in some cases, retention limits | Alternative-process support (a customer can offer a human-led equivalent); configurable retention; impact assessment template |
| **EU AI Act** | Employment-related AI systems for recruitment and evaluation are **high-risk**: risk management, data governance, technical documentation, logging, human oversight, accuracy and robustness, transparency, conformity assessment before market; obligations phasing in through 2026 to 2027 | Human-in-the-loop by design (calibration, disputes); complete trace logging (we already need it); technical documentation as a living artefact; a named person responsible for compliance |
| **GDPR / UK GDPR** | Lawful basis (customer's legitimate interest or consent), data minimisation, DPIA for high-risk processing, Article 22 rights around solely automated decisions with legal or similarly significant effects, access and erasure rights, international transfer mechanisms | We are a processor for customers; DPA with every customer; DPIA template; candidate data access and deletion self-service; EU hosting option on the roadmap; scores are decision support, and the customer's human makes the decision (documented) |
| **India DPDP Act 2023** | Notice and consent, purpose limitation, data principal rights | Same consent and deletion flows; check cross-border rules as they are notified |
| **ADA / Equality Act accessibility** | Reasonable accommodation; the assessment must not screen out on disability | Extended time and screen-reader mode on request without justification; keyboard-first UI; avoid timing-as-signal where it would penalise accommodations (normalise per accommodation type) |
| **SOC 2 / ISO 27001** | Not law, but table stakes for enterprise procurement | SOC 2 Type I by month 12, Type II by month 24 (see roadmap) |

## Design principles that follow

1. **The human decides.** Dayone produces a recommendation and evidence. The customer's hiring panel makes the decision, and our terms and UI say so. This matters under GDPR Article 22 and the EU AI Act, and it is also true.
2. **Every score is explainable.** Each dimension links to rubric items and replay moments. Candidates can receive their report. No black-box composite.
3. **Job-relatedness by construction.** Scenarios are work samples of the actual job. Rubrics are reviewed by external senior engineers. Documentation of that review is kept per scenario.
4. **Notice before, not after.** Customer invitation templates include what is assessed, that AI is provided, what is recorded, how scores are used, how to request accommodation, and how to dispute. In NYC, ten business days ahead.
5. **Collect demographics separately and voluntarily.** An optional, anonymous self-identification form after the session, stored apart from the score, used only for aggregate adverse-impact analysis. Never visible to customers per candidate.
6. **Monitor adverse impact continuously.** Score and pass-rate distributions by group, per scenario and per dimension, four-fifths rule as a screen, investigation and scenario revision when triggered. Report to customers on request and in the annual audit.
7. **Integrity flags never change a score.** They route to human review only (`09-anti-gaming-and-integrity.md`). Flag rates are themselves monitored for adverse impact.
8. **Minimise data.** No video, no webcam, no biometrics. Trace data is what is needed for grading and replay. Sandbox destroyed after session. Default retention 12 months for hiring sessions, configurable by customer, with candidate deletion on request unless the customer has a legal hold.
9. **Accommodations are first-class.** Extended time, screen-reader mode, alternative colour theme, and a documented alternative human-led process the customer can offer.
10. **Training data discipline.** We do not train models on customer code. Candidate traces may be used to improve grading only under the terms disclosed in the notice, anonymised, and with an opt-out.

## Artefacts to produce before the first paid customer

- Data Processing Agreement (customer as controller, Dayone as processor) with sub-processor list (cloud, model providers, ID verification if enabled).
- Candidate notice template and privacy notice (short, plain language).
- Data Protection Impact Assessment template, filled for the MVP.
- Accommodation policy and process.
- Dispute policy (`07-scoring-architecture.md`) published to candidates.
- Retention and deletion policy; self-service deletion.
- Scenario validity file: per scenario, the job analysis rationale, the external reviewer sign-offs, the rubric, revision history.
- Adverse-impact monitoring spec and dashboard design.
- EU AI Act readiness memo: classification, obligations, timeline, owner.
- Security baseline (encryption, access logging, tenancy isolation) written down, as the first step toward SOC 2.

## Sales-facing compliance kit (month 6)

One-page "How Dayone keeps assessments fair and lawful," the DPA, the candidate notice template, the accommodation policy, the dispute policy, and a summary of the validity programme. Enterprise deals will ask for all of it; mid-market deals will be reassured by its existence.

## Open questions for counsel

- Whether providing the AI agent inside the assessment changes the analysis of "solely automated" processing in any jurisdiction.
- Bias-audit methodology and auditor selection for NYC LL144 given our small early n.
- How Dayone's role (processor) interacts with the EU AI Act's provider obligations, which fall on us regardless.
- Whether candidate practice mode (B2C) needs a separate legal basis and notice.
