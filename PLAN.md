# PLAN.md — Forge Digital: Master Company & Platform Blueprint

> **ASSUMPTION:** No company name, brand name, or technology stack was supplied in the founding brief. This document invents and locks a concrete identity — **"Forge Digital"** (legal/brand name), platform name **"Forge"** — so that every downstream section (brand, UI, code, database) can be internally consistent instead of staying abstract. If the founders choose a different name, the *structure, reasoning, and systems* in this document remain valid — only literal strings (brand name, domain, token prefixes) need a find-and-replace pass. This substitution cost is intentionally kept low: the brand name appears as a small number of tokens (`forge-*` CSS variables, `FORGE_` env vars, `@forge/*` package scope), not scattered as prose throughout the architecture.

---

## 00. Document Control

### 00.1 Purpose

PLAN.md is the single source of truth for Forge Digital — the company, the brand, and the digital platform (marketing website + client portal + admin backend). It exists so that three founders, and anyone who joins later, can trace every business decision, design decision, and line of code back to a documented reason.

PLAN.md is not a pitch deck, not a mood board, and not a technical README. It is the layer that sits **above** all of those and explains why they say what they say.

### 00.2 Scope

In scope:
- Business model, market, customers, pricing, revenue
- Brand identity and visual system
- Website and client portal UX/UI, page-by-page
- Full technical architecture: repo, database, API, auth, payments, infra
- Internal operations: sales, delivery, project management, support
- Marketing, SEO, content, growth
- Roadmap, MVP definition, deferred features, risks
- Decision log and "why" index

Out of scope (explicitly, so no one assumes otherwise):
- Legal contract templates (referenced, not drafted — **PROFESSIONAL REVIEW REQUIRED**)
- Tax/GST filing mechanics (referenced, not drafted — **PROFESSIONAL REVIEW REQUIRED**)
- Detailed visual design files (Figma files are the source for pixel-level design; PLAN.md defines the *system* they must follow)
- Day-to-day task tracking (lives in the project management tool defined in §34, not in this document)

### 00.3 Version & Status

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | **DRAFT — awaiting founder ratification** |
| Owners | All three founders (co-equal ownership of this document) |
| Last updated | 2026-08-25 |
| Next review | At end of Week 4 (see §55 Roadmap), and at every ADR addition |

### 00.4 Change Policy

PLAN.md is a living document but not an easily-edited one. Rules:

1. **Anyone (of the three founders) may propose a change.** Proposals happen as a new entry in the Decision Log (§59) before the document body is edited — the log entry is the discussion; the body edit is the ratified output.
2. **A change to a decision that other sections depend on requires updating every dependent section in the same edit.** Example: changing the database from PostgreSQL to something else requires updating §23, §24, §29, §30, and the Final "Why" Index (§66) in the same commit. Partial updates that leave contradictions are not acceptable — see §00.6.
3. **Founder-structure decisions (§53) require unanimous agreement.** Product/technical decisions require 2-of-3 agreement, with the domain-lead founder (see §53) having tie-break authority within their domain.
4. **Every ratified change gets a Decision Log entry**, even small ones, using the ADR format in §59. Small changes may use an abbreviated one-paragraph entry; changes that reverse a prior decision must use the full format and must reference the ID they supersede.
5. PLAN.md is versioned in git alongside the codebase it governs (see §45 for repo/branching). A change to PLAN.md that materially changes what should be built is itself a reviewable pull request.

### 00.5 How Decisions Are Added

```text
1. Identify the open question or the reason the current decision no longer fits.
2. Write a Decision Log entry (§59 format) — Context, Decision, Alternatives considered,
   Reasoning, Consequences, Revisit trigger.
3. Get 2-of-3 founder sign-off (or unanimous, if it's a founder-structure decision).
4. Edit the affected section(s) of PLAN.md body to reflect the new decision.
5. Update §66 (Final "Why" Index) if the decision is one a future reader would search for.
6. Update §60 (Implementation Task Tree) if the decision creates or removes work.
```

### 00.6 How Obsolete Decisions Are Marked

Obsolete decisions are never silently deleted from the Decision Log — history matters for avoiding repeated mistakes. Instead:

- The old ADR entry's `Status` field changes from `Accepted` to `Superseded by ADR-XXX`.
- The document body (the section itself, e.g. §23 Technical Architecture) is updated to reflect only the *current* decision — the body is always current-state, never a historical narrative. History lives in the Decision Log, not in the section prose.
- A superseded decision is never reused as justification elsewhere in the document. If §40 cites a technology choice from §23, and §23's choice changes, §40's citation must be checked and updated.

### 00.7 How Contradictions Are Resolved

If two sections of PLAN.md conflict (e.g., §08 promises a deliverable that §32 doesn't support), resolve using the **Source of Truth Hierarchy**:

```text
1. Business reality       — can we actually deliver/afford this?
2. User needs             — what does the customer or client actually need?
3. Security                — does either option create risk?
4. Accessibility           — does either option exclude users?
5. Maintainability         — can 3 founders keep maintaining this?
6. Simplicity               — which option has fewer moving parts?
7. Performance               — which option is faster where it matters?
8. Scalability                 — which survives 10x growth better?
9. Developer convenience        — which is nicer to build?
10. Personal preference           — taste, only when nothing above decides it.
```

The higher-numbered concern never overrides a lower-numbered one. A "developer convenience" argument (9) never beats a "security" argument (3). When a real conflict is found, it is resolved via a Decision Log entry that explicitly names which section is corrected and why, using this hierarchy as the stated reasoning.

### 00.8 Notation Used Throughout This Document

- **ASSUMPTION:** — a fact this document treats as true without external validation. Flagged so it can be checked later.
- **VALIDATION REQUIRED:** — a claim (usually about the market or customer behavior) that must be tested with real data before being relied on for a large decision.
- **PROFESSIONAL REVIEW REQUIRED:** — legal, tax, or compliance content that a qualified professional must review before the company relies on it.
- **OPEN DECISION:** — a fork in the road this document deliberately leaves unresolved, with a stated trigger for when it must be resolved.

---

## 01. Executive Summary

### 01.1 Company Concept

**Forge Digital** is an India-based, three-founder digital services company that designs, builds, and grows digital products and brand assets for small and mid-sized businesses — starting in India, architected from day one to serve international clients without a rebuild.

Forge is not a freelance collective and not a 200-person agency pretending to be a "studio." It is a **productized service company**: a small, disciplined team that sells a defined menu of packaged outcomes (a website, a brand identity, a managed social presence, a web application) at fixed or clearly-scoped prices, backed by a real delivery system (client portal, project pipeline, QA process) — not just three people juggling WhatsApp threads and Google Drive links.

### 01.2 Business Model

Revenue comes from three layers, deliberately built in this order:

1. **Project revenue (Year 1 core):** fixed-scope, fixed-price packages — websites, brand identities, apps, creative campaigns. This is the layer that pays the bills first because it converts fastest and requires no platform to exist yet.
2. **Retainer revenue (introduced Month 2-3):** ongoing social media management, SEO, and website maintenance sold as monthly subscriptions to the same clients who bought a project. This is the layer that produces predictable monthly recurring revenue (MRR) and is the actual point of the client portal.
3. **Productized/scale revenue (Year 2+, deferred deliberately - see §57):** templated micro-products (a "starter website in 5 days" SKU, pre-built brand kits) and eventually a light SaaS component. Not built until the first two layers prove the team can deliver reliably.

See §05 for the full business-model evaluation and scoring that led to this choice.

### 01.3 Target Customers

**Primary ICP (Year 1):** Indian small and mid-sized businesses (Rs.5L-5Cr annual revenue) that are past the "my cousin built our website" stage but too small for a traditional ad agency - D2C brands, local service businesses scaling past one city, B2B SMEs, and funded early-stage startups needing a credible web presence fast. Full segmentation and ranking is in §06.

**Secondary ICP:** other agencies and studios who need white-label development or design capacity they do not have in-house.

**Future ICP (post Year 1, international):** SMBs and startups in the US/UK/UAE/Australia who are price-sensitive relative to their local market but value-sensitive relative to fully outsourced/offshore shops - Forge's India cost base is a genuine structural advantage here, not just a talking point.

### 01.4 Core Problem

Businesses in Forge's target segment face three compounding problems:

- **Fragmentation:** they hire a freelance designer, a separate developer, a separate "social media guy," and get a mismatched result with no single point of accountability.
- **Opacity:** pricing and scope are usually verbal, revisions are unlimited-and-therefore-endless, and there is no visibility into where a project actually stands.
- **Disposability:** once a project ships, the relationship usually ends - there is no structured path to retained, compounding work (maintenance, growth, iteration), so agencies re-sell the same acquisition cost over and over instead of building recurring revenue, and clients get no continuity.

### 01.5 Solution

Forge sells **one accountable team, one visible process, one place to track everything** - through a combination of:

- A tight, well-defined service menu (§07) instead of "we do everything."
- Productized packages with explicit inclusions/exclusions (§08) instead of open-ended scope.
- A client portal (§32) that shows real project status, files, approvals, and invoices - replacing the WhatsApp-thread-as-project-management-tool pattern that defines the freelance/small-agency market.
- A retainer path baked into the sales process from the first conversation, so "what happens after launch" has an answer before launch happens.

### 01.6 Services (Full Menu - see §07 for phasing)

Website design & development, web applications, mobile applications (Phase 2), UI/UX design, branding & visual identity, graphic design & marketing creatives, social media management & strategy, content creation, video editing & motion graphics, 3D modeling/visualization (Phase 2+), SEO, digital marketing/paid media, e-commerce builds, automation & custom software (Phase 2+), AI-assisted service add-ons (Phase 2).

Not every listed service launches on day one - §07 explicitly separates Launch / Phase 2 / Phase 3 / Avoid, because a three-person team offering fourteen services on day one is the single fastest way to deliver all fourteen badly. See §64 ("Do Not Do This") - "unnecessary services" is listed explicitly as a founding-stage failure mode.

### 01.7 Positioning

Forge positions itself between two inadequate alternatives:

- **Below** traditional ad agencies: agencies are slow, expensive, and built for enterprise retainers a Rs.20L/year business cannot afford or justify.
- **Above** individual freelancers and freelance marketplaces: freelancers are cheap but unaccountable, inconsistent in quality, and disappear mid-project.

Forge's stated position: *"A real team, a real process, a fair price - everything a growing business needs to look and run like a bigger one, without agency overhead or freelancer risk."*

### 01.8 Competitive Advantage

1. **Process as product.** The client portal and defined pipeline (§34) are themselves a competitive advantage most 3-person shops do not build - clients feel the difference in the first week.
2. **Narrow, deep service menu** instead of shallow breadth - Forge is credibly excellent at fewer things rather than mediocre at many (see §02 Founding Principles).
3. **India cost base** with international-grade process and design output - the same structural advantage Indian IT services have had for decades, applied to a modern productized-agency model instead of body-shop outsourcing.
4. **Founder-operated quality control** at this stage - every deliverable passes through a founder's eyes (see §46 Operations), which is a real quality advantage a 3-person company has *specifically because* it has not scaled yet - and a reason not to hire prematurely (§54).

### 01.9 Revenue Model (headline - full model in §10)

- **Year 1 target composition:** roughly 70% project revenue, 30% retainer/MRR revenue by Month 12, growing retainer share every month after Month 3.
- **Unit economics goal:** every project sold should have a documented path to a retainer conversation at delivery (see §46 Operations - Delivery stage always includes a retainer pitch).

VALIDATION REQUIRED: All revenue targets, conversion rates, and pricing points in this document are informed estimates built from stated market patterns (§04), not from Forge's own sales data, because Forge has no sales data yet. §51 (Financial Model) explicitly separates Conservative / Realistic / Aggressive scenarios for this reason.

### 01.10 Initial Strategy

1. Land the first 5-10 paying projects through founder networks and direct outreach (§47 Sales) - not through the website, because the website does not exist yet and should not be the first bottleneck.
2. Build the marketing website and a minimal client portal in parallel with those first projects (§55 Roadmap, Week 1-4), using the first real projects as the initial portfolio content.
3. Introduce retainers starting with the first delivered clients (§46).
4. Only after the delivery system is proven (roughly Month 3-4) invest in inbound marketing/SEO (§48) and portfolio-driven positioning at scale.

### 01.11 Long-Term Vision

Within 3 years, Forge Digital is a recognized, profitable, primarily-retainer-funded digital studio serving Indian and international clients, with a small (5-10 person) full-time team augmented by a vetted contractor bench (§54), a light productized/SaaS revenue layer supplementing services revenue (§57, deferred), and a brand reputation strong enough that inbound demand exceeds outbound sales effort. The company stays intentionally small and high-margin rather than chasing agency-scale headcount - see §02.3 "Simplicity before scale."

---

## 02. Founding Principles

These principles are the filter every later decision in this document passes through. When two later sections seem to disagree, check which principle each is trying to satisfy — that usually resolves the disagreement without invoking the full Source of Truth Hierarchy (§00.7).

### 02.1 Customer Value Over Feature Count

**What it means:** A feature, service, or portal capability ships because a named customer problem requires it — not because it is easy to build, impressive to demo, or common in competitor products.

**Why it exists:** Three founders have finite hours. Every hour spent on a feature no client asked for is an hour not spent on delivery quality or sales, which are what actually make money at this stage.

**Example:** The client portal ships with a "project status" view because clients repeatedly ask "where are we?" — a real, observed problem (§03.1). It does not ship with a built-in whiteboard/brainstorming tool just because project-management SaaS products often have one.

**Anti-example:** Building a custom drag-and-drop page builder into the portal "in case clients want to self-edit their site" — no client segment in §06 has asked for this, and it would take longer to build than ten real projects take to deliver.

**How it affects decisions:** Every feature proposal in this document that reaches implementation must trace to a section in §03 (Problem Definition) or a specific ICP need in §06. Features that cannot make that trace go into §57 (Deferred Features), not into the roadmap.

### 02.2 Quality Over Quantity

**What it means:** Forge would rather turn down a project than deliver it badly, and would rather offer 4 services done excellently than 12 done adequately.

**Why it exists:** In a market defined by inconsistent freelancers (§04), consistent quality is the actual differentiator. A single bad delivery costs more in reputation (referrals are the primary Year 1 channel — §47) than the revenue from three good ones is worth.

**Example:** §07 explicitly separates "Launch Services" from "Phase 2/3" — new services are added only once the team has the capacity and skill to deliver them at the same bar as existing ones.

**Anti-example:** Accepting a 3D visualization project in Month 1 because the client is paying well, when no founder has real 3D production experience yet (see §07 "Services to Avoid").

**How it affects decisions:** Any service or feature not yet at "excellent" internal confidence stays in Phase 2/3 (§07) or Deferred (§57), regardless of revenue temptation. See §46 for the internal QA gate every deliverable passes before client delivery.

### 02.3 Simplicity Before Scale

**What it means:** Build the simplest system that correctly serves today's actual load (3 founders, dozens of clients) — not the system that would serve 10,000 clients. Scale the architecture when there is scale to serve, not before.

**Why it exists:** Premature scale-architecture (microservices, complex state management, multi-region infra) costs real time up front and ongoing maintenance burden a 3-person team cannot absorb, for a benefit that does not exist yet. This principle directly drives the technical stack chosen in §23 and the "no fake complexity" rule applied throughout §26-§28.

**Example:** A single Next.js monorepo application (§23-25) instead of separate frontend/backend services with independent deploys.

**Anti-example:** Standing up Kubernetes, a message queue, and a microservice per domain (leads, projects, billing) for a system with three internal users and a few dozen clients.

**How it affects decisions:** Any architecture proposal must answer "what does this cost us to run and maintain this week, with 3 people?" before "what does this enable at scale?" See §64 for a concrete list of prohibited premature-scale patterns.

### 02.4 Automation Where Appropriate, Human Craft Where Valuable

**What it means:** Repetitive, low-judgment work (status emails, invoice reminders, meta-description drafts, first-pass image compression) is automated. Work that defines the client's actual perception of quality (design decisions, brand strategy, code architecture, final creative sign-off) stays human, founder-reviewed, at minimum through Year 1.

**Why it exists:** Automating the wrong layer (e.g., fully AI-generated final designs with no human review) is exactly how the freelance/marketplace market already fails clients (§04) — Forge's differentiation is caring where it matters. Automating the right layer (§50 AI System) is how three people deliver at a scale that would otherwise need six.

**Example:** AI-assisted first-draft copywriting and image upscaling (§50) are allowed and encouraged. AI-generated final brand logos shipped without a designer's revision are not (§50.5 — quality control).

**Anti-example:** Marketing "AI-powered instant branding" as a product before the company has a documented internal process for the human quality gate that makes AI output client-ready.

**How it affects decisions:** §50 requires every AI-assisted deliverable to have a named human review step before client delivery — no exceptions in Year 1.

### 02.5 Transparent Pricing

**What it means:** Every service Forge sells has a published starting price or a clear, explainable reason it doesn't (custom/enterprise scope only). No "call us for pricing" as a default stalling tactic.

**Why it exists:** Opacity is a named customer pain point (§03.1) in the existing market. Transparent pricing is also a qualification filter — it repels clients whose budget doesn't fit before a founder spends an hour on a call that goes nowhere (§47 Sales — a scarce-founder-time protection mechanism).

**Example:** §08-09 publish package price bands (Starter/Growth/Premium) directly on the pricing page (§20).

**Anti-example:** Hiding all pricing behind a contact form with no indicative range, forcing every lead through a sales call regardless of budget fit.

**How it affects decisions:** Any new package added to §08 must ship with a price band before it appears on the public site. Fully custom scope (enterprise) is the only case allowed to say "custom quote," and even then a floor price is stated (§09.6).

### 02.6 Sustainable Growth Over Vanity Growth

**What it means:** Forge grows at a pace its delivery quality (02.2) and founder bandwidth (§54) can sustain. Client count, headcount, and service breadth all follow from proven delivery capacity, not the reverse.

**Why it exists:** The single most common failure mode for small agencies is overselling ahead of delivery capacity, which triggers the exact quality collapse this document is designed to prevent (see §58 Risks, R-01).

**Example:** §54 defines concrete hiring triggers (e.g., "≥3 concurrent active projects per founder for 2 consecutive months") rather than hiring speculatively.

**Anti-example:** Taking on 15 simultaneous client projects with 3 founders because the leads happened to convert that month, then missing every deadline.

**How it affects decisions:** §34 (Project Management System) enforces a WIP (work-in-progress) cap per founder as a structural constraint, not just a policy.

### 02.7 No Unnecessary Complexity

**What it means:** Every table, service, page, dependency, or abstraction must justify its own existence independently. "It might be useful later" is not sufficient justification (see §26 "No Fake Complexity").

**Why it exists:** Complexity compounds. A single unnecessary database table or unused API endpoint is cheap in isolation but expensive in aggregate, and directly increases the surface area a 3-person team must secure, test, and maintain (§38, §43).

**Example:** The client portal V1 (§32) has no built-in real-time chat — email notifications and comment threads on files/tasks suffice for V1 volume, and chat's real-time infra cost is not justified yet.

**Anti-example:** Adding a generic "workflow builder" feature so that "clients can automate their own processes," a feature with no named requester and no current use.

**How it affects decisions:** §66 (Final "Why" Index) exists specifically so that anyone questioning "why does this exist" can find the answer — anything that cannot get a real answer there should not exist.

---

## 03. Problem Definition

Each problem below states the current situation, the pain it causes, the existing alternatives and why they are inadequate, Forge's proposed solution, and how the assumption will be validated. Problems are separated by whose problem they are — conflating "customer problem" with "founder problem" is a common cause of building the wrong thing first.

### 03.1 Customer Problems

**C1 — No single accountable team.**
- *Current situation:* SMBs assemble ad-hoc teams of freelancers (designer, developer, "social media person") found through referrals or marketplaces.
- *Pain:* When something goes wrong, each freelancer points to the others' work. No one owns the outcome.
- *Existing alternatives:* Hire a full agency (too expensive/slow for this segment) or keep managing freelancers directly (time cost falls on the business owner, who is not a project manager).
- *Why inadequate:* Agencies price for enterprise retainers; freelancer management is a full-time skill business owners don't have time to develop.
- *Our solution:* One Forge team, one contract, one point of contact (project owner, §34), for the full scope.
- *Validation:* VALIDATION REQUIRED — confirm via the first 10 discovery calls (§47) that "who do I call when something's wrong" is a stated pain, not an assumed one.

**C2 — No visibility into project status.**
- *Current situation:* Status lives in scattered WhatsApp messages, emails, and verbal updates.
- *Pain:* Client anxiety, repeated "any update?" messages, disputes about what was agreed.
- *Existing alternatives:* Some agencies use generic PM tools (Trello, Asana) shared with clients — better than nothing, but built for internal teams, not client-facing.
- *Why inadequate:* Generic PM tools expose internal clutter (unrelated tasks, internal comments) and require the client to learn a tool built for something else.
- *Our solution:* Purpose-built client portal project view (§32) showing only what the client needs: milestones, current stage, files awaiting approval, next action.
- *Validation:* VALIDATION REQUIRED — track "status update requests per project" before and after portal adoption once V1 ships.

**C3 — Unclear, expanding scope.**
- *Current situation:* Verbal or loosely-documented scope; "just one more revision" becomes the default.
- *Pain:* Freelancers/agencies either eat the cost (unsustainable) or the relationship sours over unmet expectations.
- *Existing alternatives:* Detailed legal contracts (rare below enterprise tier) or simply absorbing scope creep.
- *Why inadequate:* Legal contracts alone don't prevent the day-to-day ambiguity of "is this in scope?" — that needs a documented package definition, not just a clause.
- *Our solution:* Every package (§08) explicitly lists inclusions AND exclusions; revisions are numbered and tracked in the portal (§32.5), with a clear price for going beyond them (§09.5).
- *Validation:* Track disputed-scope incidents per project starting Month 1; target zero after package/portal adoption.

**C4 — No continuity after launch.**
- *Current situation:* Relationship ends at delivery; the business is left to maintain its own website/social presence or find a new vendor.
- *Pain:* Sites go stale, security patches lapse, social presence goes dormant, SEO gains erode.
- *Existing alternatives:* Hire an in-house person (expensive, hard to justify below a certain size) or repeat the freelancer search.
- *Why inadequate:* In-house hire is overkill for most SMBs' actual ongoing need (a few hours/week of qualified attention).
- *Our solution:* Retainer packages (§08.4, §10) sold at the point of delivery as the natural next step, not a hard upsell.
- *Validation:* VALIDATION REQUIRED — retainer attach rate is one of the two or three most important numbers in §51 and must be tracked from the first delivered client.

### 03.2 Founder/Company Problems

**F1 — Limited capital.**
- *Current situation:* Three founders, no external funding assumed. ASSUMPTION: bootstrapped, not seeking investment in Year 1.
- *Pain:* Cannot outspend competitors on ads, cannot carry idle payroll, cannot afford expensive tooling.
- *Our response:* Service-led revenue from Week 1 (no runway-burning pre-revenue build phase), low-cost managed infrastructure (§23), founder-delivered work before any hiring (§54).

**F2 — Limited hours, three people, many disciplines needed.**
- *Current situation:* Design, development, sales, marketing, ops, and finance all need attention, with only three people.
- *Pain:* Context-switching cost; risk of no one owning a critical function (see §53 for how this is resolved).
- *Our response:* §53 assigns clear domain leadership per founder so responsibilities don't silently fall through gaps, plus the narrow service menu (§07) to reduce the total surface area three people must cover well.

**F3 — No existing brand reputation or portfolio.**
- *Current situation:* Zero case studies, zero testimonials, zero inbound trust signals at Day 0.
- *Pain:* Cold outreach and cold website visitors have no social proof to evaluate.
- *Our response:* §47 prioritizes founder-network-sourced first clients specifically because early trust must come from relationships, not brand equity that doesn't exist yet; §55 roadmap sequences portfolio-building before inbound-marketing investment.

**F4 — No established internal process.**
- *Current situation:* Nothing has been built yet — no client portal, no admin tooling, no documented delivery process.
- *Pain:* Risk of ad-hoc, inconsistent delivery exactly like the freelancers Forge positions against (§01.7) — an existential risk to the brand promise itself.
- *Our response:* This document. §34 defines the process before the platform automates it; the process must be provably run manually (via checklist/spreadsheet if needed) before it is worth encoding into software (see §55, Week 1-2).

### 03.3 Market Problems

**M1 — Commoditization pressure from freelance marketplaces and AI tools.**
- *Current situation:* Marketplaces (Fiverr, Upwork) and AI content/design tools push perceived price for basic creative/dev work toward zero.
- *Pain for the market as a whole:* Downward price pressure on undifferentiated services.
- *Our response:* Explicit non-participation in commodity-price competition (§09 pricing strategy is value-based, not race-to-bottom); positioning (§01.7) is built around process/accountability, which marketplaces structurally cannot offer.

**M2 — Fragmented competitive landscape with no clear "productized studio" category leader in India, at this segment, yet.**
- *Current situation:* The market has agencies, freelancers, and a small number of productized/subscription design services (mostly US-based, e.g. design-subscription models), but ASSUMPTION: no dominant Indian player owns this specific "productized studio for Indian SMBs" position yet.
- *Our response:* §04 and §11 build positioning around this gap. VALIDATION REQUIRED before over-committing marketing spend to this specific claim.

### 03.4 Operational Problems

**O1 — Founder time is the bottleneck resource, not money, in Year 1.**
- *Current situation:* Every hour a founder spends on non-delivery, non-sales work is an hour not spent on the two things that generate revenue.
- *Our response:* §46 operations design explicitly minimizes founder admin overhead (templated proposals, templated contracts, portal-automated status updates) from Day 0, not as a "later" optimization.

**O2 — No repeatable, documented delivery process yet.**
- *Current situation:* Same as F4, viewed operationally: every project risks reinventing the process.
- *Our response:* §34's state machine (Lead -> ... -> Closed) is the same process for every project regardless of service type, so it only needs to be learned once and improved centrally.

### 03.5 Technical Problems

**T1 — No platform exists yet; must be built fast without becoming unmaintainable.**
- *Current situation:* Zero lines of code at Day 0.
- *Our response:* §23-28 stack and architecture decisions are explicitly optimized for "fast to build correctly, cheap to run, maintainable by 2-3 developers who are also doing client work," not for theoretical scale.

**T2 — Client data (files, contracts, payment references) must be handled securely from Day 0, not retrofitted.**
- *Current situation:* No security posture exists yet.
- *Our response:* §38 is written before a single line of application code, specifically so security is designed in, not bolted on. See §00.7 — security ranks above maintainability and simplicity in the Source of Truth Hierarchy.

---

## 04. Market Analysis

Facts, assumptions, and hypotheses are kept in explicitly separate subsections per the founding brief's instruction not to present assumptions as facts.

### 04.1 Facts

- India has one of the largest and fastest-growing populations of small and mid-sized businesses digitizing their customer-facing presence, driven by broader smartphone/internet penetration and UPI-driven digital commerce growth. ASSUMPTION-FREE — this is a well-documented macro trend, though exact figures are not cited here and should be sourced from current industry reports (e.g., IAMAI, NASSCOM) before being used in investor-facing materials. PROFESSIONAL REVIEW REQUIRED if this document's figures are ever quoted externally without a cited source.
- Global demand for outsourced digital services (design, development, marketing) to India-based teams is an established, decades-long pattern (traditional IT services, and more recently design/dev studios), driven by cost-structure differences between India and US/UK/EU/AU markets.
- Freelance marketplaces (Fiverr, Upwork, Freelancer.com) and no-code website builders (Wix, Squarespace, Shopify) are widely available, low-cost alternatives to hiring a studio, and materially affect the SMB segment's default expectations around price.
- AI-assisted design and content tools (image generation, AI copywriting, AI website builders) are now mainstream and are actively used by both competitors and unserved DIY customers as of 2026.

### 04.2 Assumptions

ASSUMPTION: Indian SMBs in the ₹5L-5Cr revenue band are, on average, underserved by structured, process-driven digital studios and are currently served primarily by individual freelancers or informal referral networks.

ASSUMPTION: A meaningful share of this segment is willing to pay a premium over freelance-marketplace rates in exchange for accountability, single-point-of-contact delivery, and visible process — this is the core bet the business model (§05) is built on.

ASSUMPTION: International (US/UK/UAE/AU) SMB clients are reachable by an India-based studio without a local sales presence, via outbound + inbound content marketing, once the studio has an English-language portfolio credible enough to compete on international freelance/agency-comparison sites.

ASSUMPTION: The retainer model (ongoing social/SEO/maintenance) is sellable to a majority of project clients at point of delivery, rather than requiring a separate, harder sales motion.

### 04.3 Hypotheses (require direct testing, not just market reasoning)

HYPOTHESIS H1: A client portal with visible project status materially increases referral rate compared to WhatsApp-only project communication. *Test:* track referral source and portal engagement per client starting Month 2; compare referral rate for portal-active vs. portal-inactive clients after 6 months of data.

HYPOTHESIS H2: Transparent published pricing (§08-09) increases lead-to-call conversion rate on the website versus a "contact for pricing" model, by pre-qualifying budget fit. *Test:* not testable until the website has traffic (Month 2+); track quote-request-to-call show-rate once live.

HYPOTHESIS H3: The narrow Launch service menu (§07.1) does not meaningfully suppress lead volume compared to advertising the full service list. *Test:* monitor inquiries for non-launch services (e.g., 3D, mobile apps) during Year 1 to gauge unmet demand size before deciding whether to accelerate Phase 2 (§07.2).

### 04.4 Competitor Categories

| Category | Examples (types, not brand endorsements) | Strength | Weakness Forge exploits |
|---|---|---|---|
| Traditional ad/branding agencies | Full-service agencies serving mid-large enterprise | Deep creative bench, established brand | Priced and structured for enterprise retainers; slow; overkill process for SMB budgets |
| Freelance marketplaces | Individual freelancers via Fiverr/Upwork/local referral | Cheap, flexible | No accountability, inconsistent quality, no continuity, client bears PM burden |
| Boutique design/dev studios | Small (2-10 person) studios, often project-only | Good design quality, personal service | Usually no retainer/portal system; capacity-constrained; often no defined package pricing |
| No-code DIY tools | Wix, Squarespace, Shopify, Canva | Very cheap, instant | Generic output, no strategy/brand thinking, business owner's time cost is hidden but real |
| Productized design subscriptions (mostly international) | Flat-fee unlimited-request design subscription models | Predictable pricing, fast turnaround | Mostly US-priced (expensive for Indian SMBs), narrow to design-only, no full-stack dev/brand/social integration |

### 04.5 Pricing Patterns Observed in the Market

- Freelance marketplace pricing for a basic business website in India commonly ranges from a few thousand to the low tens of thousands of rupees, with highly inconsistent quality and scope.
- Boutique studio project pricing is typically scope-based and opaque, often requiring a sales call before any number is shared.
- Retainers (social media management, SEO) in the Indian SMB market are commonly sold in the low-to-mid four-figure to five-figure monthly range depending on scope, ASSUMPTION based on general market observation, VALIDATION REQUIRED against current direct competitor pricing before finalizing §09.

### 04.6 AI Impact on the Market

AI tools compress the cost and time of first-draft creative and boilerplate code production. This has two effects Forge's strategy must account for:

1. **Downward pressure on commodity work pricing** — logo generation, basic copywriting, template websites. Forge's response is explicit: don't compete on commodity production speed; compete on strategy, taste, accountability, and integration (§01.7, §50).
2. **Upward pressure on delivery efficiency for the studio itself** — AI-assisted internal workflows (§50) let a 3-person team deliver at a capacity that previously required more headcount, which is a genuine structural advantage *if* paired with the human quality gate (§02.4) that prevents AI-generated slop from reaching clients.

### 04.7 Emerging Trends Relevant to Forge

- Rising SMB expectation of "software-like" experiences even from service vendors (status dashboards, self-serve invoices) — directly informs §32.
- Increasing SMB willingness to pay for retainer/subscription relationships over one-off projects, mirroring broader SaaS-ification of services.
- Growing importance of short-form video and social content as a primary discovery channel for SMBs' own customers, which supports content/social services (§07) remaining core, not peripheral.

---

## 05. Business Model

### 05.1 Models Evaluated

| Model | Description |
|---|---|
| Pure Agency | Fully custom, quoted-per-project, no standard packages, no portal |
| Pure Studio (Design/Dev only) | Narrow craft focus (e.g. only brand + web design), no marketing services |
| Productized Agency | Standard packages at published prices, defined scope, repeatable process |
| Marketplace | Platform connecting external freelancers to clients; Forge takes a cut, doesn't deliver directly |
| Hybrid (Productized Agency + Retainers) | Productized project packages, paired with an ongoing retainer layer sold at delivery |
| Agency + SaaS | Services business that also builds and sells its own software product |
| Agency + Products | Services business that also sells templated/digital products (templates, kits) directly |

### 05.2 Scoring

Scale: 1 (worst) - 5 (best) for this specific company (3 founders, limited capital, India-first). Weighted toward criteria that matter most at this stage: startup cost, founder fit, and operational difficulty are weighted highest because they determine whether the company survives Year 1 at all.

| Criteria | Pure Agency | Pure Studio | Productized Agency | Marketplace | **Hybrid (chosen)** | Agency+SaaS | Agency+Products |
|---|---|---|---|---|---|---|---|
| Startup cost (low=5) | 4 | 4 | 4 | 2 | 4 | 2 | 3 |
| Complexity to run (low=5) | 3 | 4 | 4 | 2 | 4 | 2 | 3 |
| Revenue potential (Yr1) | 3 | 2 | 4 | 2 | 4 | 2 | 3 |
| Scalability (long-term) | 2 | 2 | 4 | 5 | 4 | 5 | 4 |
| Recurring revenue potential | 2 | 1 | 3 | 3 | 5 | 5 | 3 |
| Founder fit (3-person, broad skill mix) | 3 | 2 | 4 | 1 | 4 | 2 | 3 |
| Market demand fit (§04, §06) | 3 | 2 | 4 | 2 | 5 | 3 | 3 |
| Competition faced | 2 | 3 | 3 | 2 | 4 | 3 | 3 |
| Operational difficulty (low=5) | 2 | 4 | 4 | 2 | 4 | 2 | 3 |
| **Total (/45)** | 24 | 24 | 34 | 21 | **38** | 26 | 28 |

### 05.3 Chosen Model: Hybrid — Productized Agency with a Retainer Layer

**What:** Forge sells fixed-scope, fixed-price project packages (§08) as the primary Year 1 offer, with every project explicitly designed to convert into a monthly retainer (social/SEO/maintenance) at delivery. A light Agency+Products/SaaS layer is deliberately deferred to Year 2+ (§57) once the core motion is proven.

**Why this model over the alternatives:**
- **vs. Pure Agency:** Pure agency (fully custom, verbally quoted) reproduces the exact opacity problem (§03.1, C3) Forge exists to fix, and does not create the recurring revenue needed for founder financial stability.
- **vs. Marketplace:** A marketplace model requires two-sided liquidity (freelancer supply + client demand) before it works at all — an unsolvable cold-start problem for a company with zero brand equity (§03.2, F3), and it fundamentally means Forge doesn't control quality, which contradicts §02.2.
- **vs. Agency+SaaS (now):** Building a SaaS product before proving the service delivery model would split three founders' attention across two unproven things at once, violating §02.3 (Simplicity before scale) and §02.6 (Sustainable growth). This is why Agency+SaaS is the *destination* (§01.11 long-term vision) but not the Year 1 model.
- **vs. Pure Studio (narrow craft only):** Too narrow to generate the recurring revenue that makes the business durable, and doesn't match the primary ICP's actual need (§06), which is broader than pure design craft.

**Why not the "obvious" alternative (pure agency, quote everything):** It is the default most freelancer collectives drift into by accident, precisely because it requires no upfront productization work. Forge is deliberately choosing the harder-upfront, easier-to-scale path instead.

### 05.4 What This Model Requires To Work

1. A tightly defined package menu (§08) — without it, "productized" collapses back into "pure agency."
2. A retainer pitch built into delivery, not bolted on afterward (§46 Operations, Delivery stage).
3. A portal that makes retainer value visible on an ongoing basis (§32) — clients don't renew subscriptions they can't see the value of.
4. Founder discipline to say no to fully custom, unproductized scope requests that don't fit a package (§08's "what's NOT included" is enforced, not aspirational).

---

## 06. Customer Segments

### 06.1 Segment Profiles

**S1 — D2C / E-commerce Brands (early-to-growth stage)**
- *Profile:* Founder-led brands selling physical products online, ₹10L-2Cr revenue, 1-15 employees.
- *Problems:* Need a converting storefront, consistent social content, and ongoing performance marketing support.
- *Budget:* Moderate-to-good for project work; retainer budget tied directly to observed ROI (harder to hold if results dip).
- *Buying behavior:* Fast-moving, comparison-shops 2-3 vendors, decides within 1-2 weeks.
- *Decision maker:* Founder or marketing lead, usually the same person.
- *Acquisition channel:* Instagram/LinkedIn outreach, referrals from other founders, e-commerce founder communities.
- *Typical objections:* "Can you guarantee sales?" (cannot promise; must reframe to conversion/quality metrics), price vs. Shopify-template DIY.
- *Services needed:* E-commerce build, brand refresh, social content, paid ads support.
- *Recurring potential:* High — needs constant content and campaign refresh.
- *Profitability:* Medium-high; e-commerce builds are higher effort but well-paid.
- *Difficulty:* Medium — demanding on speed and results-orientation.

**S2 — Local Service Businesses Scaling Past One Location**
- *Profile:* Clinics, salons, gyms, education/coaching businesses, real estate, home services — ₹20L-5Cr revenue, expanding beyond a single city/branch.
- *Problems:* Outdated or absent website, inconsistent local social presence, no lead-capture system.
- *Budget:* Good for one-time project; retainer budget modest but stable (less ROI-volatility-sensitive than S1).
- *Buying behavior:* Slower decision cycle, relationship- and trust-driven, referral-sensitive.
- *Decision maker:* Owner, sometimes with a family member/manager involved.
- *Acquisition channel:* Referrals, local business networks, WhatsApp/Google Business presence, direct founder outreach.
- *Typical objections:* "We got a website for ₹5,000 from someone else" — needs value-based reframing (§09.2).
- *Services needed:* Website, local SEO, social media management, lead-capture forms.
- *Recurring potential:* Very high — this segment most reliably converts to long-term retainers because the value (steady local leads) compounds and is easy to demonstrate.
- *Profitability:* Good, especially at retainer stage (lower ongoing effort per ₹ than S1's fast-changing campaigns).
- *Difficulty:* Low-medium — most forgiving segment for a new studio to learn on.

**S3 — B2B SMEs (manufacturing, IT services, trading, professional services)**
- *Profile:* ₹1Cr-5Cr+ revenue, sells to other businesses, often has an outdated or purely brochure-style web presence.
- *Problems:* Website doesn't reflect current credibility/scale; no real digital lead generation; brand feels dated.
- *Budget:* Good-to-high for project work (brand + website); retainer interest lower (B2B sales cycles are relationship/referral-driven, less social-media-dependent).
- *Buying behavior:* Slow, considered, often requires a formal proposal/pitch.
- *Decision maker:* Owner or a designated marketing/ops head; sometimes a small committee.
- *Acquisition channel:* Referrals, LinkedIn outreach, industry associations.
- *Typical objections:* "Do you understand our industry?" — requires case studies/credibility signals (§20, portfolio pages).
- *Services needed:* Website redesign, brand refresh, sales collateral/graphic design, LinkedIn content.
- *Recurring potential:* Medium — maintenance retainers yes, heavy social retainers less so.
- *Profitability:* High per project (larger scope, less price sensitivity than S1/S2); slower sales cycle costs founder time.
- *Difficulty:* Medium-high — longer sales cycle strains founder time (§03.4, O1).

**S4 — Funded Early-Stage Startups**
- *Profile:* Pre-seed to Series A, needs a credible web presence fast to support fundraising/launch.
- *Problems:* Needs speed and polish simultaneously; internal team (if any) is focused on product, not marketing site.
- *Budget:* Variable — can be very good post-funding, tight pre-funding.
- *Buying behavior:* Fast, founder-to-founder rapport-driven, values speed over process.
- *Decision maker:* Startup founder/CEO directly.
- *Acquisition channel:* Startup founder networks, accelerator/incubator communities, referrals.
- *Typical objections:* Timeline pressure, sometimes unrealistic budget expectations relative to scope.
- *Services needed:* Landing page/website, pitch deck design, brand identity, occasionally web app MVP support.
- *Recurring potential:* Low-medium initially (cash-constrained), can become high-value if the startup grows and needs an ongoing dev/design partner.
- *Profitability:* Medium — fast turnaround requested often compresses margin (rush fees, §09.6, exist partly for this segment).
- *Difficulty:* Medium — fast timelines, but founder-to-founder communication is efficient.

**S5 — Other Agencies/Studios (White-Label Partner)**
- *Profile:* Small agencies or freelancers who need overflow design/dev capacity under their own brand.
- *Problems:* Capacity constraints, missing a specific skill (e.g., a design agency needing dev capacity).
- *Budget:* Wholesale/lower margin (they resell at markup) but zero sales/marketing cost for Forge.
- *Buying behavior:* Relationship-based, ongoing once trust is established.
- *Decision maker:* Agency owner/project lead.
- *Acquisition channel:* Founder network, industry relationships.
- *Typical objections:* Confidentiality/quality-consistency concerns (must be handled contractually, PROFESSIONAL REVIEW REQUIRED for white-label/NDA terms).
- *Services needed:* Development capacity primarily, sometimes design.
- *Recurring potential:* Medium-high once trust is built — can become a stable base-load revenue source that smooths lead-flow volatility.
- *Profitability:* Lower margin per hour, but very low customer-acquisition cost.
- *Difficulty:* Low delivery difficulty, but requires strict confidentiality discipline.

**S6 — International SMBs (Future ICP)**
- *Profile:* US/UK/UAE/AU small businesses and startups.
- *Problems:* Same core problems as domestic segments, but the "existing alternative" comparison is different — usually a local agency at higher price, or an offshore option they don't trust yet.
- *Budget:* Generally higher absolute budgets than Indian segments (currency advantage).
- *Buying behavior:* Requires strong portfolio/trust signals since there's no local-network warmth.
- *Decision maker:* Owner/marketing lead.
- *Acquisition channel:* Content marketing/SEO (§48), international freelance platforms, outbound once credible portfolio exists.
- *Typical objections:* Time zone/communication concerns, quality trust given "offshore" stereotypes — must be actively countered with process transparency (§01.8's actual competitive advantage).
- *Services needed:* Same menu as domestic, typically web/app development and design skew higher than social/local-SEO.
- *Recurring potential:* High once trust established.
- *Profitability:* Highest per-hour of any segment, due to currency differential.
- *Difficulty:* High initially — cannot be pursued credibly until Forge has a strong portfolio and case studies (§55 roadmap sequences this deliberately after domestic traction).

### 06.2 Segment Ranking (Year 1 priority)

| Rank | Segment | Rationale |
|---|---|---|
| 1 | S2 — Local service businesses | Best combination of achievable sales cycle, high retainer conversion, and forgiving learning curve for a new team. |
| 2 | S1 — D2C/E-commerce brands | Strong project revenue and social/content synergy with launch services; slightly harder retainer stickiness than S2. |
| 3 | S5 — Other agencies (white-label) | Excellent for smoothing founder utilization and cash flow with near-zero CAC; deliberately kept secondary so it doesn't crowd out brand-building direct-client work. |
| 4 | S3 — B2B SMEs | High project value but longest sales cycle; pursued opportunistically via referral rather than actively prospected in Month 1-2. |
| 5 | S4 — Startups | Good for portfolio credibility and founder-network fit; deprioritized slightly due to rush-timeline margin pressure. |
| 6 | S6 — International SMBs | Correct long-term segment, explicitly deferred until domestic portfolio/case studies exist (§55). |

### 06.3 ICP Selection

- **Primary ICP:** S2 (Local service businesses scaling past one location) and S1 (D2C/e-commerce brands) — both actively prospected from Day 0.
- **Secondary ICP:** S5 (agency white-label partners) — pursued opportunistically through founder relationships, not a dedicated outbound motion in Year 1.
- **Future ICP:** S6 (International SMBs) — explicitly gated behind having 8-10 strong case studies (see §55, Month 4-6 milestone) and a functioning, published portfolio (§20.3).

S3 and S4 are not excluded — they are simply not the segments Forge's limited Month 1-3 outbound hours are deliberately pointed at; they will still convert opportunistically via referral.

---

## 07. Service Architecture

### 07.1 Launch Services (Day 0)

Selected because they (a) match at least one founder's existing hands-on skill per §53, (b) require no specialized equipment/vendor relationships to start, and (c) directly address the top-ranked segments' (§06.2) stated needs.

| # | Service | Maps to Segment Need | Founder-Ready? |
|---|---|---|---|
| L1 | Website Design & Development | S1, S2, S3, S4 (core need, all segments) | Yes |
| L2 | UI/UX Design | S4 (app-adjacent), general | Yes |
| L3 | Branding & Visual Identity | S2, S3, S4 | Yes |
| L4 | Graphic Design & Marketing Creatives (incl. posters, social creatives, sales collateral) | All segments | Yes |
| L5 | Social Media Management & Strategy | S1, S2 (highest recurring value) | Yes |
| L6 | Content Creation (written + basic visual/short-form) | S1, S2, S5 | Yes |
| L7 | SEO (on-page + local SEO) | S2, S3 | Yes |
| L8 | E-commerce Builds (as a Website Development subtype, not a separate team) | S1 | Yes |

**Common operational table (Launch Services):**

| Service | Typical Delivery Time | Primary Tools | Recurring Potential | Base Margin Target |
|---|---|---|---|---|
| L1 Website | 2-4 weeks | Next.js/Tailwind (§23), Figma | Medium (maintenance retainer) | 55-65% |
| L2 UI/UX Design | 1-3 weeks (scoped per screen count) | Figma | Low standalone (usually bundled into L1) | 60-70% |
| L3 Branding | 2-3 weeks | Figma, Adobe Illustrator | Low standalone, high as prerequisite to L1/L4/L5 | 60-70% |
| L4 Graphic Design/Creatives | 2-5 days per batch | Figma, Adobe Photoshop/Illustrator | Medium (bundled into L5 retainer) | 65-75% |
| L5 Social Media Mgmt | Ongoing monthly | Canva/Figma, scheduling tool (Buffer/Later — ASSUMPTION, vendor TBD), analytics | **High — primary MRR driver** | 50-60% (labor-heavy) |
| L6 Content Creation | Ongoing/batch | Docs, Canva, AI-assisted drafting (§50) | Medium-High (bundled with L5) | 55-65% |
| L7 SEO | Ongoing monthly (min. 3-month engagement) | Google Search Console, Ahrefs/Ubersuggest (ASSUMPTION — tool TBD based on budget) | High | 50-60% |
| L8 E-commerce | 3-6 weeks | Same as L1 + payment gateway integration | Medium-High | 50-60% (higher complexity) |

**Per-service detail (differentiating information not captured in the table above):**

**L1 — Website Design & Development**
- *Customer problem:* No credible, converting web presence (§03.1, C1/C3 both apply).
- *Process:* Discovery -> sitemap/IA -> wireframe -> visual design (Figma) -> client approval -> development -> QA -> launch (mirrors §34 state machine at the project level).
- *Dependencies:* Brand assets (existing or bundled via L3), content/copy (client-provided or bundled via L6).
- *Risks:* Scope creep on "just one more page/section" (mitigated by §08's explicit page-count limits), client-side content delays blocking timeline (mitigated by a content-deadline clause in the process, §46).
- *Quality standard:* Must pass the Definition of Done in §43 (performance budget, accessibility baseline, cross-device QA) before delivery — no exceptions for timeline pressure.

**L5 — Social Media Management & Strategy**
- *Customer problem:* Inconsistent or absent social presence (§03.1, C4 — continuity problem, this is the retainer service that solves it structurally).
- *Process:* Monthly content calendar proposal -> client approval -> production -> scheduled publishing -> monthly performance report (§34, §46).
- *Dependencies:* Brand guidelines (L3) and a content pillar strategy (§49) must exist before month-1 content is produced — never start social management without this, or output looks inconsistent within weeks.
- *Risks:* Client expects follower/sales growth guarantees — must be explicitly excluded from scope (§08's "what's not included") and reframed to engagement/consistency metrics Forge can actually control.
- *Quality standard:* Every post reviewed against brand voice guidelines (§11.5) before scheduling; no AI-generated caption/image ships without human review (§02.4, §50.5).

**L7 — SEO**
- *Customer problem:* Business is invisible in local/organic search (§03.1, C1 indirectly — visibility is part of "credible presence").
- *Process:* Technical audit -> keyword/local-pack strategy -> on-page implementation -> monthly content/link-building cadence -> monthly ranking/traffic report.
- *Risks:* Overpromising rankings is a known industry scam pattern (§04.4) — Forge explicitly never guarantees specific rankings or timelines in any proposal or contract (see §64 "Do Not Do This").
- *Quality standard:* Every recommendation must be traceable to a documented technical or content finding, not generic checklist busywork.

### 07.2 Phase 2 Services (introduced Month 4-6, after Launch services are running reliably — see §55)

| Service | Why deferred to Phase 2 | Trigger to introduce |
|---|---|---|
| Web Applications (custom, beyond marketing sites) | Requires deeper backend/product-thinking capacity than Launch-phase bandwidth allows alongside sales-building | First 2-3 website clients delivered smoothly; a qualified lead requests it |
| Video Editing & Motion Graphics | Needs either a dedicated skill investment or trusted contractor (§54); not a Day-0 founder skill per §53 | A founder or trusted contractor demonstrates production-ready quality; or 3+ leads request it |
| Digital Marketing / Paid Media (as a *managed* service, not creative-only) | Requires ad-account management discipline and creates real financial liability if mismanaged (client ad spend) — should not be run without a clear internal process | Dedicated SOP exists (§46) and a founder/contractor has hands-on platform certification/experience |
| Automation & Light Custom Software | Valuable upsell once client relationship and trust are established, but too open-ended to sell cold | First inbound requests from existing retainer clients (natural expansion, not cold-sold) |
| AI-Assisted Service Add-ons (e.g., AI chatbot setup, AI content ops for clients) | Market and internal tooling still maturing; needs Forge's own internal AI workflow (§50) proven first | Internal AI workflow (§50) has been running reliably for Forge's own delivery for 2+ months |

### 07.3 Phase 3 Services (Year 2+)

| Service | Why deferred this far | Trigger |
|---|---|---|
| Mobile Applications | High build/QA/maintenance cost, requires platform-specific skill (iOS/Android) not assumed present in founding team | Team has hired or contracted a mobile-capable developer AND a client's project genuinely requires native (not a wrapped web app) |
| 3D Modeling / Visualization | Specialized tooling (Blender/Cinema4D) and skill; niche demand relative to core segments | Demonstrated recurring demand from D2C/product clients (§06, S1) for product visualization |
| Productized/SaaS layer (§01.11, §57) | Requires the service business to be stable and profitable first — building a product before the studio is proven risks both | Service revenue is stable and retainer-funded per §51's Realistic scenario for 2+ consecutive quarters |

### 07.4 Services To Avoid (indefinitely, not just "later")

| Service/Practice | Why avoided |
|---|---|
| Large-scale enterprise custom software builds | Requires project-management and QA infrastructure a 3-person team cannot responsibly staff; failure risk (missed enterprise SLAs) threatens the whole brand |
| Guaranteed-ranking SEO or guaranteed-sales marketing | Not deliverable honestly; a known market scam pattern Forge explicitly positions against (§01.7, §07.1 L7) |
| Print production & physical fulfillment (posters as *printed, shipped* goods) | Operational/logistics business, not a digital services business — design the poster, do not become a print-and-ship vendor |
| Managing client ad spend without a dedicated, qualified process | Real financial liability without the operational maturity to back it (see §07.2 gating for when this becomes Phase 2) |
| Unlimited-revision packages | Structurally reproduces the scope-creep problem (§03.1, C3) Forge exists to solve; revisions are always numbered (§08) |

---

## 08. Service Packages

Packages exist so that "productized" (§05.3) is real, not aspirational. Every package explicitly states inclusions, limits, and — critically — exclusions, because unstated exclusions are how scope creep happens (§03.1, C3).

### 08.1 Website Package Tiers

**Starter Website** — target: S2 local service business needing a first credible site.
- *Deliverables:* Up to 5 pages (Home, About, Services, Contact, one more), mobile-responsive, contact form, basic on-page SEO setup, 1 round of revisions per page.
- *Timeline:* 2 weeks from content-received.
- *Price:* ASSUMPTION — starting ₹35,000 (indicative; final pricing confirmed against §09 and live competitor check, VALIDATION REQUIRED before publishing).
- *Excludes:* Custom illustrations, e-commerce functionality, copywriting (client provides content, or add L6 as a paid add-on), more than 1 revision round, ongoing maintenance (sold separately, §08.4).

**Growth Website** — target: S1/S3 needing a stronger, larger site.
- *Deliverables:* Up to 10 pages, custom component design (not template), blog setup, on-page SEO, basic analytics setup, 2 rounds of revisions.
- *Timeline:* 3-4 weeks.
- *Price:* ASSUMPTION — starting ₹85,000.
- *Excludes:* E-commerce (see E-commerce package), copywriting beyond light editing, more than 2 revision rounds.

**Premium Website / E-commerce** — target: S1 e-commerce, S3 larger B2B.
- *Deliverables:* Up to 20 pages or full e-commerce catalog integration, payment gateway integration, custom animations/interactions, full SEO technical setup, 3 rounds of revisions, 30-day post-launch support window.
- *Timeline:* 5-6 weeks.
- *Price:* ASSUMPTION — starting ₹1,80,000.
- *Excludes:* Custom backend systems beyond standard e-commerce (see Enterprise/Custom), ongoing content updates after the 30-day window (retainer, §08.4).

**Enterprise/Custom** — target: S3/S4/S5 with non-standard scope.
- *Deliverables:* Fully scoped per discovery call; no fixed inclusion list.
- *Price:* Custom quote with a stated floor of ₹2,50,000 (§09.6 — even custom work states a floor, per §02.5 transparent pricing).
- *Excludes:* N/A — scope is defined per-project in a signed statement of work (PROFESSIONAL REVIEW REQUIRED for the SOW/contract template).

### 08.2 Branding Package Tiers

**Starter Brand Kit:** Logo (primary + 1 alternate lockup), color palette, 2 fonts, basic 1-page brand guide. 2 concepts presented, 2 revision rounds. ASSUMPTION price: starting ₹25,000. Excludes: full brand strategy workshop, stationery/collateral design, brand voice/messaging documentation (see Growth tier).

**Growth Brand Identity:** Everything in Starter, plus brand strategy session, brand voice/messaging guide, business card/letterhead/social template kit, full brand guideline document (mirrors §11-15 structure at client scale). ASSUMPTION price: starting ₹65,000.

**Premium Brand System:** Everything in Growth, plus packaging/signage-ready assets, extended icon/pattern system, presentation template, 3 concepts, 3 revision rounds. ASSUMPTION price: starting ₹1,40,000.

### 08.3 Social Media & Content Retainer Tiers

**Starter Retainer:** 12 posts/month (mix of static + basic motion), 1 platform, monthly content calendar approval, monthly performance summary. ASSUMPTION price: ₹18,000/month. Excludes: paid ad management, video editing beyond basic reels, community management (comment/DM responses) beyond business hours.

**Growth Retainer:** 20 posts/month, 2 platforms, content calendar + 1 short-form video/week, monthly strategy call, monthly report with recommendations. ASSUMPTION price: ₹35,000/month. Excludes: paid ad spend management (add-on), influencer outreach.

**Premium Retainer:** 30 posts/month, up to 3 platforms, 2 short-form videos/week, community management during business hours, quarterly strategy deep-dive. ASSUMPTION price: ₹60,000/month. Excludes: ad spend itself (client pays platform directly; Forge can add managed ad service per §07.2 once launched).

### 08.4 Maintenance & SEO Retainers

**Website Maintenance:** Uptime monitoring, security/plugin updates (if applicable), monthly content updates (up to 2 hours), monthly backup verification. ASSUMPTION price: ₹6,000/month. Excludes: new feature development (quoted separately), design changes beyond minor text/image swaps.

**SEO Retainer:** Ongoing technical + content SEO per §07.1 L7. ASSUMPTION price: starting ₹20,000/month, minimum 3-month commitment (SEO requires time to show results — this minimum is stated up front to set correct expectations, directly addressing §07.1 L7's "no guaranteed rankings" risk by setting a realistic timeline instead).

### 08.5 What Is Never Included In Any Package (applies globally)

- Unlimited revisions (violates §02.7, reproduces §03.1 C3).
- Client's own third-party costs (domain registration, hosting beyond what's specified, stock photo licenses beyond a small bundled allowance, ad spend) — these are always passed through at cost, never silently absorbed.
- Guaranteed business outcomes (sales, rankings, follower counts) — see §07.4.
- Work outside the signed scope without a change order (§09.5 defines the change-order pricing mechanism).

---

## 09. Pricing Strategy

### 09.1 Pricing Philosophy

Forge prices primarily on **value + market position**, informed by cost as a floor, not as the anchor. Pure cost-plus pricing under-prices differentiated work (§01.8's competitive advantages are exactly what value-based pricing captures); pure market-matching risks racing to the bottom against marketplace freelancers (§04.5) whom Forge is explicitly not competing with on price.

| Pricing approach | Used for | Why |
|---|---|---|
| Cost-based (floor only) | Internal minimum-viable-price check on every package | Ensures no package is sold below the labor + overhead cost to deliver it (§09.4) |
| Value-based | Branding, website packages, enterprise/custom | Client's willingness to pay is driven by business impact (credibility, conversion), not hours spent |
| Market-based | Retainers (social/SEO) | These are actively comparison-shopped against other named competitors (§04.4), so price must stay within a defensible band |
| Productized (fixed, published) | All Starter/Growth/Premium package tiers | Core to the business model (§05.3) — see §02.5 |
| Custom quote (floored) | Enterprise/custom scope only | Explicitly the *only* category allowed to skip a published price, and even then a floor is published (§08.1) |

### 09.2 Pricing Formula (internal working tool, not client-facing)

```text
Package Price = Base Labor Cost / (1 - Target Margin)

Where:
Base Labor Cost = Sum of (estimated hours per role x internal hourly cost per role)
Target Margin   = 55-70% depending on service (see §07.1 table) — chosen because:
  - Below 55%, retainer/founder-time-based services stop being sustainable at solo/three-person scale
  - Above 70% invites competitive undercutting on comparably-scoped launch services
```

Example (Starter Website): estimated 22 founder-hours at an internal cost basis of ₹700/hr = ₹15,400 base labor cost. At a 60% target margin: ₹15,400 / 0.4 = ₹38,500 -> rounded to the published ₹35,000-40,000 band. This shows the published Starter Website price (§08.1) is not an arbitrary round number — it is load-bearing against the formula above.

ASSUMPTION: the ₹700/hr internal cost basis is a placeholder derived from a target founder draw (see §51) divided by available billable hours/month — it must be recalculated once §51's financial model is finalized with real founder compensation numbers, and whenever founder compensation changes.

### 09.3 When Pricing Should Change

- Recalculate the internal hourly cost basis (§09.2) whenever founder compensation targets change (§51).
- Raise published package prices when the sales team (§47) observes a >70% quote-acceptance rate sustained over 90 days at the current price (signal of underpricing relative to demand) — OPEN DECISION: the exact acceptance-rate threshold is a starting hypothesis, not a fixed rule; revisit after the first quarter of real sales data.
- Never lower a published package price to win a specific deal — use the discount rules (§09.4) instead, which are bounded and logged, rather than an ad-hoc race to the bottom.

### 09.4 Discount Rules

| Situation | Allowed discount | Approval needed |
|---|---|---|
| Multi-service bundle (e.g., Website + Branding together) | Up to 10% off combined price | Any founder |
| Referral from an existing client | Flat 5% | Any founder |
| Non-profit / early-stage founder-network goodwill case | Up to 15%, case-by-case | 2-of-3 founder sign-off, logged in Decision Log-style note (not a formal ADR, but tracked) |
| "Just to win the deal" price cut with no structural reason | **Not allowed** | N/A — this is explicitly listed in §64 as a prohibited practice |

### 09.5 Additional Work, Revisions, and Rush Fees

- **Extra revision round (beyond package limit):** flat fee per round, ASSUMPTION ₹3,000-8,000 depending on package tier, published in the contract/SOW.
- **Change order (scope addition mid-project):** priced using the same formula as §09.2, applied to the incremental hours, always confirmed in writing (portal change-order flow, §32.5) before work starts.
- **Rush fee:** +25-40% surcharge when a client requests a timeline shorter than the standard delivery time in §07.1/§08, applied only when the founders assess it's actually deliverable without compromising §02.2 quality — a rush fee is never used to justify quality compromise.

### 09.6 Minimums, Milestones, and Cancellation

- **Minimum project value:** ASSUMPTION ₹25,000 — below this, founder time cost exceeds the sustainable margin; smaller requests are redirected to the Starter package or politely declined.
- **Payment milestones (project work):** 40% upfront (non-refundable booking of production capacity) / 40% at design approval / 20% at final delivery — chosen to protect cash flow (§51) while keeping the client's financial commitment proportional to delivered value at each stage.
- **Payment terms (retainers):** billed monthly in advance; a 30-day notice period applies to cancellation (protects Forge from zero-notice MRR loss while remaining fair to the client — no long lock-in contracts, which would contradict §02.5 transparency and §01.7 positioning against agency-style lock-in).
- **Cancellation fee (project work, client-initiated mid-project):** client forfeits the milestone payment already made for work in progress; any additional hours already delivered beyond that milestone are billed at the standard hourly-equivalent rate. PROFESSIONAL REVIEW REQUIRED to finalize this as enforceable contract language.

---

## 10. Revenue Model

### 10.1 Revenue Streams

| Stream | Type | Description |
|---|---|---|
| One-time projects | Non-recurring | Website, branding, e-commerce builds, one-off design work |
| Retainers | Recurring (MRR) | Social media management, SEO, website maintenance |
| Add-ons / change orders | Non-recurring, attached to existing engagement | Extra revisions, scope additions, rush delivery |
| Upsells | Recurring or non-recurring | e.g., a website client adding a branding package later, a retainer client adding paid-ad management once Phase 2 launches |
| Cross-sells | Non-recurring, new engagement type | e.g., a branding-only client later buying a website |
| Future: productized/SaaS | Recurring | Deferred to Year 2+ (§57) |

### 10.2 Modeling Average Client Value

```text
Average Initial Project Value (blended across package tiers, ASSUMPTION):  ~Rs.65,000
Retainer attach rate at delivery (ASSUMPTION, VALIDATION REQUIRED):         ~40% of project clients
Average retainer value (blended across tiers):                              ~Rs.28,000/month
Average retainer lifespan (ASSUMPTION, VALIDATION REQUIRED):                 ~9 months before churn/pause

Blended Customer Lifetime Value (illustrative, not a guarantee):
  = Average Project Value + (Retainer Attach Rate x Average Retainer Value x Average Retainer Lifespan)
  = Rs.65,000 + (0.40 x Rs.28,000 x 9)
  = Rs.65,000 + Rs.1,00,800
  = ~Rs.1,65,800 blended LTV per acquired project client
```

This calculation exists to make one thing visible to the founders: **the retainer attach rate is the single highest-leverage number in the entire business model** — it matters more than the initial project price. This is why §46 (Operations) makes the retainer pitch a mandatory, structured step of every project's Delivery stage rather than an optional afterthought, and why §51 tracks it explicitly as a KPI from Month 1.

### 10.3 MRR / ARR Modeling (headline — full scenario modeling in §51)

```text
If Forge closes ~4 new project clients/month by Month 6 (Realistic scenario, see §51):
  New retainer clients/month  = 4 x 40% attach rate           = ~1.6/month
  Cumulative retainer clients by Month 12 (accounting for ~9-month avg lifespan and some churn)
    ~ builds toward 10-14 active retainer clients by Month 12
  MRR by Month 12 (at ~Rs.28,000 blended average)              ~ Rs.2.8L-3.9L/month
  ARR run-rate exiting Year 1                                   ~ Rs.34L-47L
```

These figures are Realistic-scenario illustrations for internal planning only — see §51.4 for Conservative and Aggressive variants and the assumptions each depends on. VALIDATION REQUIRED against actual Month 1-3 sales data before this model is used for any external (investor/lender) purpose.

### 10.4 Gross Margin & Contribution Margin

- **Gross margin target (blended):** 55-65%, consistent with the per-service targets in §07.1 and the pricing formula in §09.2.
- **Contribution margin (per retainer client, after direct delivery labor cost, before fixed overhead):** target ≥50% — retainers must remain individually profitable on a standalone basis, not just "profitable in aggregate," because a single over-serviced retainer client can quietly consume a disproportionate share of founder hours (§34's WIP cap exists partly to prevent this).
- **Fixed overhead (tooling, hosting, subscriptions — see §51.2):** kept deliberately low in Year 1 so gross margin converts to real founder income rather than being absorbed by tooling costs that don't yet have the client volume to justify them.

---

## 11. Brand Strategy

### 11.1 Name Direction

**Chosen: "Forge Digital"** (ASSUMPTION, see document header). "Forge" is chosen deliberately over generic alternatives ("Studio," "Labs," "Digital Co.") because it carries an active verb meaning ("to forge" = to make something durable through skilled, deliberate work under heat/pressure) that maps directly onto the brand promise: *real craft, applied with discipline, producing something built to last* — the opposite of disposable freelance output (§03.1). It also gives the visual identity (§12) a coherent, non-arbitrary metaphor (fire, metal, tools, craftsmanship) instead of a palette chosen for taste alone.

### 11.2 Brand Promise

*"We build the digital presence your business has earned — designed with craft, delivered with process, maintained as a partner, not a vendor."*

### 11.3 Positioning Statement

For growing Indian businesses who are underserved by both expensive agencies and unaccountable freelancers, Forge Digital is the productized digital studio that delivers agency-quality branding, websites, and growth support through a transparent, trackable process — because a growing business deserves a team that treats its digital presence as durable infrastructure, not a disposable project.

### 11.4 Personality

| Trait | Means | Does Not Mean |
|---|---|---|
| Capable | Confident, competent, shows work rather than claims it | Arrogant, jargon-heavy |
| Grounded | Plain language, realistic promises (§07.4 — no guaranteed rankings) | Boring, overly corporate |
| Deliberate | Process-visible, considered, unhurried in the ways that matter (design decisions) | Slow in the ways that don't matter (response time, admin) |
| Warm | Human, approachable, founder-accessible | Casual to the point of unprofessional |

### 11.5 Voice & Messaging Rules

- Plain language over jargon: say "we'll show you three homepage concepts" not "we'll ideate on visual direction alternatives."
- Specific over vague: say "12 posts/month across Instagram and Facebook" not "consistent social presence."
- Honest about limits: never imply guaranteed outcomes (§07.4) — reframe to what Forge actually controls (quality, consistency, process).
- No fear-based sales language ("your competitors are already ahead") — Forge's message is aspirational and evidence-based (portfolio, process), not anxiety-based; this is a deliberate choice consistent with §02.6 (sustainable, not manipulative growth).

### 11.6 Story (short form, for About page — full version in §20.6)

Forge Digital started because three people kept seeing the same problem from different sides of the table: talented freelancers with no system behind them, and small businesses paying agency prices for freelancer-level accountability — or the reverse. Forge exists to be the version of a digital studio that treats a growing business's website, brand, and online presence the way it deserves to be treated: as something built once, built well, and built to keep working.

### 11.7 Mission & Vision

- **Mission:** Give every growing business access to a digital presence and process previously reserved for companies with in-house teams or agency budgets.
- **Vision:** To be the studio Indian SMBs recommend to each other by name — and, over time, a studio serving businesses well beyond India on the same promise.

### 11.8 Values

| Value | What it looks like in practice |
|---|---|
| Craft over speed-for-its-own-sake | Timelines are realistic, not artificially compressed to win deals (§02.2) |
| Radical clarity | Every price, scope, and timeline is written down (§02.5, §08) |
| Accountability | One team, one point of contact, no finger-pointing between "the designer" and "the developer" (§03.1, C1) |
| Sustainable ambition | Growth the team can deliver on, not growth for its own sake (§02.6) |

### 11.9 Tagline Concepts

1. "Built to last." — direct, short, plays on the forge metaphor without being cute.
2. "Craft, with a process." — leads with the differentiator (§01.8.1) directly.
3. "Your digital presence, forged properly." — most literal use of the name; higher risk of feeling gimmicky, kept as a secondary/campaign-only option rather than the primary tagline.

**Primary tagline: "Built to last."** — chosen for #1 because it's the shortest, most memorable, and works across every service line without needing the visitor to parse a metaphor first.

---

## 12. Visual Identity

### 12.1 Logo Strategy

- **Symbol:** An abstract anvil/spark mark — a simple geometric form suggesting an anvil silhouette with a single angular "spark" notch, rendered in a single weight so it scales down to a 16px favicon without losing legibility. ASSUMPTION: exact vector execution is a design-production task (Figma), not something this document specifies pixel-by-pixel — PLAN.md specifies the *system* the mark must satisfy (below), not the artwork itself.
- **Wordmark:** "Forge" set in the display typeface (§14.1) at a fixed custom letter-spacing (tightened slightly from body default, per §14.5), always lowercase in the primary lockup (`forge`) to reinforce the "grounded, not corporate" personality trait (§11.4); "Digital" appears only in the full legal lockup (invoices, contracts, footer legal line), never in the primary marketing lockup.
- **Primary lockup:** symbol + wordmark, horizontal arrangement, used on light backgrounds (website header, business cards).
- **Secondary lockup:** symbol alone, used where space is constrained (favicon, social avatar, app icon).

### 12.2 Logo Usage Rules

- **Clear space:** minimum clear space around the logo equals the height of the symbol on all sides — no other element (text, image edge, page margin) may enter that space.
- **Minimum size:** primary lockup never renders below 120px wide (digital) / 30mm wide (print); symbol-only lockup never below 24px (digital) / 6mm (print) — below this the spark notch loses legibility.
- **Incorrect usage (explicitly prohibited):** stretching/skewing the mark, recoloring the symbol to a non-approved color, placing the primary lockup on a busy photographic background without a solid-color safe area behind it, rotating the mark, adding drop shadows/bevels/3D effects (contradicts the flat, deliberate personality in §11.4).

### 12.3 Photography Direction

Real work and real people over stock-photo abstraction: client project screenshots, behind-the-scenes process shots, and (with permission) real client photos take priority over generic "team laughing at laptop" stock imagery — this is a direct expression of §11.4 "Capable... shows work rather than claims it." Where stock photography is unavoidable (e.g., before enough client photography exists), it must be warm-toned (matching §13's palette temperature) and candid rather than overly polished/corporate.

### 12.4 Illustration & Iconography

- Icon style: single-weight line icons (not filled, not duotone) at a consistent 1.5px stroke, matching the geometric simplicity of the logo symbol (§12.1). Sourced from a consistent icon set (ASSUMPTION: Phosphor Icons or Lucide — both open-license, consistent-stroke sets suitable for a design system) rather than mixing icon families, which would break visual consistency (§16 components all reference this single icon set).
- Illustration use is minimal and deliberate in V1 — see §64: "decorative illustration with no functional purpose" is listed as a thing to avoid in early-stage brand build-out, since it's high production cost for a company with founder-time as the scarce resource (§03.2, F2).

### 12.5 3D & Motion Style (Phase 2+, per §07.3)

Deferred in detail until 3D visualization becomes an active service (§07.3) — specifying a 3D style before the team has 3D production capability would be speculative. OPEN DECISION: revisit this subsection when §07.3's 3D trigger condition is met.

### 12.6 Motion Principles (applies now, to UI motion — see §16 for component-level animation specs)

- Motion is functional, not decorative: it communicates state change (loading, success, transition), never plays purely for delight at the cost of perceived speed.
- Standard easing and duration tokens are defined in §15.7 and must be used instead of ad-hoc values — this is the same "semantic token over raw value" principle applied to motion (§13.5 explains the equivalent reasoning for color).
- Respects `prefers-reduced-motion` — see §40 (Accessibility).

### 12.7 Patterns & Backgrounds

A single geometric background pattern (subtle, low-opacity repeating angular lines evoking metalwork/forging texture) is approved for use in large empty-state or hero backgrounds, always at low opacity (≤8%) over the base surface token so it never competes with foreground content. No other decorative background pattern is introduced without a Decision Log entry, to prevent pattern-proliferation diluting brand consistency.

---

## 13. Color System

### 13.1 Why Semantic Tokens, Not Raw Hex Values

Every component in the codebase (§16) references a **semantic token** (e.g., `--color-text-muted`) rather than a raw hex value (e.g., `#6B655C`) for three concrete reasons:

1. **Theming:** light/dark mode (§13.4) is implemented by redefining what a token *points to*, not by writing conditional logic in every component. A component that hardcodes `#FFFFFF` for a background cannot support dark mode without being edited; a component that reads `var(--color-surface)` supports both automatically.
2. **Consistency:** if the brand's primary color needs adjusting (e.g., a contrast fix discovered in §13.3), it changes in one place (the token definition) instead of requiring a find-and-replace across every component file — a direct application of §02.7 (no unnecessary complexity, single source of truth).
3. **Meaning over appearance:** `--color-error` documents *intent* ("this is an error state") independent of its current visual value, so a future rebrand or accessibility fix never requires re-auditing which hex codes "meant" what.

### 13.2 Brand Palette

The palette is built around the "forge" metaphor (§11.1): a warm ink/graphite neutral base (evoking worked metal and workshop materials) with an ember-orange primary and a spark-gold accent (evoking heat/fire), balanced by a cool steel-grey secondary that keeps the palette from feeling purely decorative.

| Token | Hex | RGB | HSL | Role |
|---|---|---|---|---|
| `--color-primary` | `#D9622B` | `217, 98, 43` | `19°, 70%, 51%` | Ember — primary CTAs, links, brand accents |
| `--color-primary-hover` | `#C1531F` | `193, 83, 31` | `19°, 72%, 44%` | Primary hover/active state |
| `--color-secondary` | `#3D4A52` | `61, 74, 82` | `203°, 15%, 28%` | Steel — secondary buttons, headers on dark sections |
| `--color-accent` | `#F2A93B` | `242, 169, 59` | `36°, 88%, 59%` | Spark — highlights, badges, sparingly used |
| `--color-success` | `#2F8F5B` | `47, 143, 91` | `148°, 51%, 37%` | Success states, positive metrics |
| `--color-warning` | `#D98C0F` | `217, 140, 15` | `37°, 87%, 45%` | Warning states, caution messaging |
| `--color-error` | `#C93B3B` | `201, 59, 59` | `0°, 57%, 51%` | Error states, destructive actions |
| `--color-info` | `#2E6FB0` | `46, 111, 176` | `210°, 59%, 44%` | Informational states |

### 13.3 Contrast Requirements & Findings

Target: WCAG 2.1 AA minimum across the platform (full accessibility scope in §40). Two concrete findings from checking this palette (per-pair calculations, not assumed):

- **`--color-text` (`#1A1815`) on `--color-background` (`#FAFAF8`):** contrast ratio ≈ **16.95:1** — comfortably exceeds AAA (7:1) for body text.
- **White text on `--color-primary` (`#D9622B`):** contrast ratio ≈ **3.67:1** — meets AA for large text (≥18px, or ≥14px bold) and for UI component boundaries (3:1), but **does not** meet AA for small body text (4.5:1). **Rule, enforced in the Button component spec (§16.1):** primary-filled buttons must use the UI-text size scale (§14.4, minimum 16px, semibold) — primary color is never used as a background behind small body-sized text. This is a concrete example of why §13.1's semantic-token reasoning matters in practice: a raw-hex implementation could easily violate this without the constraint being visible anywhere.

### 13.4 Light Theme Tokens (default)

| Token | Hex | HSL |
|---|---|---|
| `--color-background` | `#FAFAF8` | `60°, 17%, 98%` |
| `--color-surface` | `#FFFFFF` | `0°, 0%, 100%` |
| `--color-surface-elevated` | `#F4F3EF` | `48°, 19%, 95%` |
| `--color-text` | `#1A1815` | `36°, 11%, 9%` |
| `--color-text-muted` | `#6B655C` | `36°, 8%, 39%` |
| `--color-border` | `#E4E1D9` | `44°, 17%, 87%` |

### 13.5 Dark Theme Tokens

| Token | Hex | HSL |
|---|---|---|
| `--color-background` | `#15130F` | `40°, 17%, 7%` |
| `--color-surface` | `#1C1A16` | `40°, 12%, 10%` |
| `--color-surface-elevated` | `#242019` | `38°, 18%, 12%` |
| `--color-text` | `#F2F0EA` | `45°, 24%, 93%` |
| `--color-text-muted` | `#A8A296` | `40°, 9%, 62%` |
| `--color-border` | `#33302A` | `40°, 10%, 18%` |

`--color-primary`, `--color-secondary`, `--color-accent`, and the four semantic status colors (§13.2) stay the same hex values in both themes for brand consistency — only the neutral scale (background/surface/text/border) inverts. This mirrors §13.1's theming reasoning: brand identity should not shift between light and dark mode, only the neutral canvas around it should.

### 13.6 Dark Theme Justification (V1 Scope)

OPEN DECISION: dark mode is specified here as a token architecture (so implementing it later is cheap — just swapping which values the tokens resolve to, §13.1's whole point) but is **not** required for MVP (§56) — the client portal and marketing site ship light-theme-only in V1, with the token structure already in place so dark mode is a follow-up styling task, not a re-architecture, when prioritized.

---

## 14. Typography System

### 14.1 Typefaces

| Role | Typeface | Why |
|---|---|---|
| Display (headlines, hero text, section titles) | **Fraunces** (variable serif) | Carries warmth and craft character consistent with §11.4's "grounded, warm" personality — a geometric sans would read too generic/corporate for a brand built around the "forge/craft" metaphor (§11.1) |
| UI & Body (everything functional: paragraphs, labels, buttons, forms) | **Inter** (variable sans) | Highly legible at small sizes, excellent number/tabular figure support (needed for pricing tables, invoices — §35), open-license and well-supported as a variable font (performance benefit, §39) |
| Code (rare — technical docs, any code snippets shown in admin tooling) | **IBM Plex Mono** | Distinct from both display and UI faces so code is unambiguously code; open license, pairs cleanly with Inter |

Both Fraunces and Inter are variable fonts specifically so the platform loads one font file per family instead of separate files per weight — a direct performance decision (§39.4 covers font-loading strategy) driven by this typeface choice, not an afterthought.

### 14.2 Type Scale (tokens)

A 1.25 (major third-adjacent) modular scale, base 16px, chosen for enough visual hierarchy between steps without producing awkwardly large jumps at the top of the scale that would force custom line-height overrides on every heading.

| Token | Size (rem / px) | Line Height | Typical Use |
|---|---|---|---|
| `--font-size-xs` | 0.75rem / 12px | 1.5 | Fine print, timestamps, badges |
| `--font-size-sm` | 0.875rem / 14px | 1.5 | Secondary UI text, form hints |
| `--font-size-base` | 1rem / 16px | 1.6 | Body text, default |
| `--font-size-lg` | 1.25rem / 20px | 1.5 | Lead paragraphs, card titles |
| `--font-size-xl` | 1.5625rem / 25px | 1.4 | Small section headings (h4) |
| `--font-size-2xl` | 1.953rem / 31px | 1.3 | Section headings (h3) |
| `--font-size-3xl` | 2.441rem / 39px | 1.2 | Page headings (h2) |
| `--font-size-4xl` | 3.052rem / 49px | 1.1 | Hero/display headings (h1) |
| `--font-size-5xl` | 3.815rem / 61px | 1.05 | Homepage hero only, desktop breakpoint and above |

### 14.3 Weights

| Token | Weight | Use |
|---|---|---|
| `--font-weight-regular` | 400 | Body text |
| `--font-weight-medium` | 500 | UI labels, emphasized body text |
| `--font-weight-semibold` | 600 | Buttons, card titles, nav items |
| `--font-weight-bold` | 700 | Headings |

### 14.4 UI Typography Rules

- Minimum readable UI text size: 14px (`--font-size-sm`) anywhere; body copy defaults to 16px (`--font-size-base`) — never smaller, per §40 accessibility baseline.
- Buttons always use `--font-weight-semibold` at minimum `--font-size-sm` (14px) — and, per §13.3's contrast finding, primary-filled buttons specifically use `--font-size-base` (16px) or larger to satisfy AA contrast for the ember-on-white combination.

### 14.5 Letter Spacing & Responsive Scaling

- Display headings (`--font-size-3xl` and above) use a slightly tightened letter-spacing token (`--tracking-tight: -0.02em`) — large serif type at default tracking looks loose; this is a standard large-type correction, not a stylistic flourish.
- The wordmark (§12.1) uses `--tracking-tight` at all times, including at small logo sizes, for lockup consistency.
- Responsive scaling: `--font-size-4xl` and `--font-size-5xl` scale down one step at the `sm` breakpoint (§17) using `clamp()` rather than fixed breakpoint overrides, so headline size responds smoothly to viewport width instead of jumping at fixed points.

### 14.6 Why Not More Typefaces

Two type families (plus one mono, used rarely) is a deliberate ceiling. Every additional typeface is another font file to load (performance cost, §39), another set of pairing decisions designers must get right, and another way visual consistency can erode across dozens of pages built by different people over time. This is the typography-specific instance of §02.7 (no unnecessary complexity).

---

## 15. Design Tokens

### 15.1 Token Architecture Overview

Tokens are organized in three layers, a standard, well-justified pattern:

```text
1. Primitive tokens   — raw values (e.g., a specific hex, a specific rem value). Rarely referenced directly.
2. Semantic tokens     — named by role/intent (e.g., --color-text, --space-card-padding). What components use.
3. Component tokens      — narrow overrides for a single component when it genuinely needs to diverge
                           (e.g., --button-radius if it must differ from the global --radius-md).
```

Components reference layer 2 (semantic) almost exclusively. Layer 3 exists but is used sparingly — see §16 for the rule that a component-specific token requires a stated reason, not a default habit (same reasoning as §02.7).

### 15.2 Spacing Scale

Base unit 4px, chosen because it divides evenly into the most common icon/asset sizes used (16, 24, 32px) without producing fractional pixel values at typical zoom levels.

| Token | Value | Typical Use |
|---|---|---|
| `--space-1` | 4px | Icon-to-label gap |
| `--space-2` | 8px | Tight internal padding (badges, chips) |
| `--space-3` | 12px | Form field internal padding |
| `--space-4` | 16px | Default card/section internal padding |
| `--space-6` | 24px | Gap between related components |
| `--space-8` | 32px | Gap between distinct sections within a page |
| `--space-12` | 48px | Section vertical padding (mobile) |
| `--space-16` | 64px | Section vertical padding (desktop) |
| `--space-24` | 96px | Major page-section separation (desktop hero, etc.) |

### 15.3 Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Badges, small chips |
| `--radius-md` | 8px | Buttons, inputs, cards (default) |
| `--radius-lg` | 16px | Modals, large panels |
| `--radius-full` | 9999px | Avatars, pill badges |

### 15.4 Shadows

| Token | Value (approx.) | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(26,24,21,0.06)` | Cards at rest |
| `--shadow-md` | `0 4px 12px rgba(26,24,21,0.10)` | Dropdowns, popovers |
| `--shadow-lg` | `0 12px 32px rgba(26,24,21,0.16)` | Modals |

Shadow color is derived from `--color-text` (§13.4) at low opacity rather than pure black, so shadows read as "warm ink" consistent with the palette rather than a generic grey — a small but deliberate consistency detail.

### 15.5 Borders

| Token | Value |
|---|---|
| `--border-width-default` | 1px |
| `--border-width-focus` | 2px |
| `--border-color-default` | `var(--color-border)` |
| `--border-color-focus` | `var(--color-primary)` |

### 15.6 Z-Index Scale

A fixed, small enumerated scale — not arbitrary per-component numbers — to prevent the classic "z-index: 9999" arms race.

| Token | Value | Use |
|---|---|---|
| `--z-base` | 0 | Default document flow |
| `--z-dropdown` | 100 | Dropdowns, select menus |
| `--z-sticky` | 200 | Sticky headers |
| `--z-overlay` | 300 | Modal/drawer backdrop |
| `--z-modal` | 400 | Modal/drawer content |
| `--z-toast` | 500 | Toast notifications (always above modals) |

### 15.7 Motion Tokens

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 120ms | Micro-interactions (hover, focus) |
| `--duration-base` | 200ms | Standard transitions (dropdown open, tab switch) |
| `--duration-slow` | 320ms | Modal/drawer enter-exit |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default easing |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Entrances |
| `--ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Exits |

### 15.8 Breakpoints & Container Widths

Matches the responsive design targets in §17.

| Token | Value | Notes |
|---|---|---|
| `--bp-xs` | 375px | Small phones |
| `--bp-sm` | 640px | Large phones |
| `--bp-md` | 768px | Tablets |
| `--bp-lg` | 1024px | Small laptops |
| `--bp-xl` | 1280px | Desktops |
| `--bp-2xl` | 1440px | Large desktops |
| `--container-max` | 1200px | Max content width at `xl` and above — text/content never stretches full-bleed on large monitors, which would hurt readability (long line lengths) |

### 15.9 How Tokens Map Into Code

Tokens are defined as CSS custom properties at the `:root` level (light theme) and re-scoped under a `[data-theme="dark"]` selector (dark theme, §13.5), then consumed via Tailwind's theme configuration (`tailwind.config.ts`, see §25/§26 for exact file location) so that utility classes like `bg-surface` or `text-muted` resolve to the semantic tokens rather than Tailwind's default color palette. This is the concrete mechanism behind §13.1's "components use semantic tokens, not raw hex" rule — it's enforced structurally (Tailwind's default palette is intentionally disabled in config, not just avoided by convention), not left to developer discipline alone.

---

## 16. Design System — Components

### 16.0 Conventions Applied To Every Component (stated once, not repeated per component)

- **File location pattern:** primitives live at `components/ui/<name>.tsx`; composite/marketing components live at `components/marketing/<name>.tsx`; portal-specific composites live at `components/portal/<name>.tsx` (full repo tree in §25).
- **Styling:** every component consumes semantic tokens only (§13.1, §15.1) — no raw hex, no raw px values outside the token scale, enforced by an ESLint rule (§28.6).
- **Accessibility baseline (all interactive components):** visible focus ring using `--border-color-focus`/`--border-width-focus` (§15.5), full keyboard operability, correct ARIA role/state, minimum 44x44px touch target on mobile. Component-specific a11y notes below only cover what's *additional* to this baseline.
- **Testing baseline:** every component in this section gets a unit/render test (renders without error, all variants render) plus, for interactive components, an interaction test (keyboard + click) — see §43.1 for the testing tool and pattern.
- **Dependencies:** primitives depend only on `lib/utils.ts` (class-merging helper) and Radix UI primitives (§23) where unstyled-primitive behavior (focus trapping, portal rendering) is needed rather than reimplemented — see §16.11 for why Radix specifically.

### 16.1 Form Controls

| Component | Purpose | Variants | States | Non-obvious a11y/interaction note |
|---|---|---|---|---|
| **Button** | Primary interactive trigger for actions | `primary` (filled, ember), `secondary` (filled, steel), `outline`, `ghost`, `destructive` (error color) | default, hover, active, focus, disabled, loading (spinner replaces label, label kept in DOM for screen readers via `aria-busy`) | Primary variant enforces min. 16px/semibold text per §13.3's contrast finding — this is a structural constraint, not a style preference |
| **Input** | Single-line text entry | `text`, `email`, `password` (with visibility toggle), `search` (with clear icon) | default, focus, error (border + helper text turns `--color-error`), disabled, read-only | Error state always pairs with a text message via `aria-describedby` — color alone never signals error (§40 — never rely on color alone) |
| **Textarea** | Multi-line text entry | fixed-height, auto-grow | same as Input | Auto-grow variant caps at a max height (8 lines) then scrolls internally, to avoid pushing page layout unpredictably |
| **Select** | Choose one from a list | native-backed (mobile-friendly) vs. custom Radix-based (desktop, searchable for >8 options) | default, focus, error, disabled | Searchable variant only activates above 8 options — below that, search adds friction rather than removing it |
| **Checkbox** | Boolean or multi-select choice | single, group (with a "select all" parent showing indeterminate state) | unchecked, checked, indeterminate, disabled | Indeterminate state has a real use: bulk-select rows in admin tables (§33) |
| **Radio** | Single choice from a small visible set | standard, card-style (used for package-tier selection in proposals, §34) | default, checked, disabled | Card-style variant is used specifically where the options benefit from more visual weight than a small circle (e.g. choosing a package tier) |
| **Switch** | Instant-effect boolean toggle (not a form-submit checkbox) | default | on, off, disabled, loading (for toggles that hit an API immediately, e.g. notification preferences §37) | Distinguished from Checkbox by *intent*: Switch = takes effect immediately; Checkbox = staged until form submit. Using the wrong one for the wrong intent is an explicit "don't" (§64) |
| **Form** | Layout/validation wrapper around the above | — | — | Wraps React Hook Form + Zod (§23) — validation schema colocated with the form component, not duplicated client/server (server re-validates the same Zod schema, §30.2) |
| **File Uploader** | Upload files (project assets, deliverables) | drag-and-drop zone, click-to-browse fallback | idle, drag-over, uploading (per-file progress bar), success, error (per-file, with retry) | Full spec in §36 (File Management) — this entry is the UI component only; storage/security/versioning logic lives in §36, not duplicated here |

### 16.2 Overlays

| Component | Purpose | Variants | States | Non-obvious note |
|---|---|---|---|---|
| **Modal** | Focused, blocking task (confirmations, forms that must complete before returning to context) | `sm`/`md`/`lg` width | open, closing (exit animation, §15.7), open-with-scroll (long content) | Focus-trapped (Radix Dialog), closes on `Escape` and backdrop click *unless* it contains unsaved form state, in which case backdrop click prompts a confirm-discard step — never silently discards user input |
| **Drawer** | Non-blocking side panel for supplementary content (e.g., file detail, quick-view) without leaving the current page context | left/right slide-in | same as Modal | Used instead of Modal specifically when the underlying page context still matters to the user (e.g., viewing a file's detail while a project list stays visible behind it) — see §16.0 "non-usage" pattern: Modal and Drawer are not interchangeable, the choice communicates whether context is preserved |
| **Dropdown** | Contextual menu of actions/options anchored to a trigger | menu (actions), select-list (see Select) | open, closed | Auto-flips placement to stay in viewport (Radix Popper) |
| **Tooltip** | Supplementary, non-critical hint text on hover/focus | default | visible (200ms delay on hover, instant on focus) | Never contains the *only* copy of essential information — anything in a tooltip must also be reachable without hover, for touch/keyboard users (§40) |

### 16.3 Feedback

| Component | Purpose | Variants | States | Non-obvious note |
|---|---|---|---|---|
| **Toast** | Transient, non-blocking system feedback (e.g., "Invoice sent") | success, error, info, warning (maps to §13.2 status colors) | entering, visible (4s auto-dismiss, pauses on hover), exiting | Highest z-index token (`--z-toast`, §15.6) — always visible above modals, since a toast can legitimately fire while a modal is open (e.g., background save confirmation) |
| **Alert** | Persistent, inline, page-level message (not auto-dismissing) | success, error, info, warning | static, dismissible (optional close icon) | Distinguished from Toast by persistence: Alert stays until dismissed or the underlying condition resolves; Toast always auto-dismisses. Using Alert for a transient message is listed in §64 as a content-model mistake |
| **Empty State** | Communicates "no data yet" without looking broken | list-empty, search-no-results, first-use (with a clear CTA to create the first item) | — | Every list/table view in the portal and admin (§32, §33) must define its own empty-state copy — a generic "No items" is explicitly insufficient (§21 content rules) |
| **Loading State** | Communicates in-progress fetch/action | skeleton (layout-matching placeholder, preferred for initial page loads), spinner (small, for in-place actions like button loading) | — | Skeleton preferred over spinner for anything that takes >300ms and has a predictable layout, because it reduces perceived layout shift (§39 performance) |
| **Error State** | Communicates a failed fetch/action with a recovery path | inline (form field), page-level (failed data load, with retry action), full-page (crash boundary) | — | Every error state must offer a next action (retry, go back, contact support) — an error state with no recoverable action is explicitly prohibited (§42) |
| **Success State** | Confirms a completed action | inline (checkmark + message), full-page (e.g., post-checkout confirmation) | — | Full-page success states always restate what happens next (e.g., "we'll email your invoice"), not just confirm completion — reduces support-question volume |

### 16.4 Content Display

| Component | Purpose | Variants | Content rules |
|---|---|---|---|
| **Card** | Generic content container, base for the specialized cards below | default, interactive (hover-elevates, whole card clickable) | Never nests another Card directly inside a Card — nested elevation reads as a bug, not a hierarchy (§64) |
| **Badge** | Small status/category label | neutral, success, warning, error, info, accent (maps to §13.2 tokens) | Max 2 words — badges are scanned, not read |
| **Avatar** | Represents a person (client contact, team member) | image, initials-fallback (generated from name, using `--color-secondary` background) | Initials fallback is deterministic per user (same person always gets the same background tint) so returning users are visually recognizable even without a photo |
| **Table** | Structured, sortable/filterable tabular data (primarily admin, §33) | default, with-row-selection (checkboxes), with-pagination | Horizontal scroll inside its own container on narrow viewports — the page itself never scrolls horizontally (§17, §39) |
| **Pagination** | Navigate multi-page result sets | numbered, load-more (used in blog/portfolio listing where "load more" fits content-browsing behavior better than page numbers) | Numbered variant used for admin/data tables where jumping to a specific page matters; load-more used for content browsing where sequential scanning is the norm |
| **Breadcrumb** | Shows hierarchical location within the site/portal | default | Only shown where hierarchy is genuinely 2+ levels deep — omitted on top-level pages where it would just repeat the page title (§64) |
| **Tabs** | Switch between related views without a full navigation | default, pill-style | Content behind inactive tabs is unmounted, not just hidden, to avoid loading cost for content the user may never view (§39) — exception: forms-in-tabs preserve state via the Form component's own state management, not the Tabs component |
| **Accordion** | Progressive disclosure of long-form content (primarily FAQs, §20.9) | single-open, multi-open | Single-open used for FAQ (reduces visual clutter of a long open list); multi-open used for filterable spec/comparison content where users may want several sections open at once |
| **Timeline** | Shows a sequence of dated events (project milestones, §32.2) | vertical (portal), horizontal (compact, dashboard summary) | Directly renders the project state machine (§34) — this is not a generic timeline widget, its steps are the actual pipeline stages, not free-text |

### 16.5 Marketing & Composite Components

| Component | Purpose | Key content fields | Notes |
|---|---|---|---|
| **Hero** | Above-the-fold page opener | Headline, subhead, primary CTA, secondary CTA (optional), supporting image/visual | Every page type in §20 defines its own hero copy — Hero is a layout component, not a copy template |
| **Section** | Generic vertical page block with consistent spacing (`--space-16`/`--space-24`, §15.2) | Optional eyebrow label, heading, body | The single component responsible for consistent section rhythm down a page — pages never hand-roll section spacing (§64) |
| **Service Card** | Represents one service on the Services page (§20.4) | Icon, name, one-line description, "starting at" price, link | Price is always shown (§02.5 transparent pricing) — a Service Card with no price is a content-model violation |
| **Pricing Card** | Represents one package tier (§08) | Tier name, price, billing cadence, included-features list, excluded-features list (collapsed by default), CTA | Exclusions are always present, even if collapsed — omitting them contradicts §08.5 |
| **Project Card** | Represents one portfolio project (§20.5) | Cover image, client/project name, service tags, link to case study | Service tags link back to the relevant Service page — a concrete internal-linking requirement carried from §22 (SEO architecture) |
| **Testimonial** | Client quote/social proof | Quote, name, role/company, optional photo, optional linked case study | Never fabricated or paraphrased beyond light editing for length — see §64 for the explicit prohibition on fake/composited testimonials |
| **CTA (Call to Action block)** | Page-level or section-level conversion prompt | Heading, one-line support text, primary button | Every marketing page (§20) ends with exactly one CTA block — never zero, never competing multiple CTAs at the same visual weight (§19 UX rule) |

### 16.6 Navigation

| Component | Purpose | Behavior |
|---|---|---|
| **Navigation (header)** | Primary site/portal navigation | Marketing site: sticky, collapses to a hamburger + Drawer below `--bp-md` (§17). Portal: persistent sidebar on desktop, bottom-tab-style collapse on mobile (§17.6) |
| **Footer** | Secondary navigation, legal links, contact | Marketing site only — the portal and admin do not use a marketing footer (their "footer" is just the sidebar's bottom-anchored account/logout control) — a deliberate distinction so portal screens stay task-focused (§64) |

### 16.7 Why Radix UI Primitives (referenced throughout this section)

Interactive components that require non-trivial accessible behavior (focus trapping, portal rendering, keyboard navigation patterns, correct ARIA wiring) are built on top of Radix UI's unstyled primitives rather than hand-rolled from scratch.

- **Why:** getting focus-trapping and ARIA correct by hand for Modal/Dropdown/Select/Tabs is a well-known, easy-to-get-subtly-wrong problem (§40 accessibility is ranked above developer convenience in the Source of Truth Hierarchy, §00.7) — using a maintained, widely-used primitive is the maintainable choice for a 2-3 person engineering team, not a "trendy dependency" (§28's "no random technology" rule is satisfied here specifically because this solves a real, hard requirement).
- **Alternative considered:** hand-building these behaviors. **Rejected** because it duplicates well-solved accessibility engineering for no product benefit, and every hand-rolled a11y bug becomes Forge's bug to find and fix instead of an upstream-maintained one.
- **Alternative considered:** a full pre-styled component library (e.g., Chakra, MUI). **Rejected** because pre-styled libraries fight the custom token system (§13-15) — Forge needs unstyled *behavior* primitives, not another design system layered under its own.

---

## 17. Responsive Design

Responsive design is defined by **behavior change**, not just resizing — per breakpoint, this section states what actually changes in structure, not just scale.

### 17.1 Breakpoint Behavior Summary

| Breakpoint | Width | Navigation | Grid | Typography | Cards |
|---|---|---|---|---|---|
| Base (mobile) | 320-374px | Hamburger + full-screen Drawer nav | Single column | Display sizes clamp to their minimum (§14.5) | Full-width, stacked |
| `xs` | 375-639px | Same as base | Single column | Same | Full-width, stacked |
| `sm` | 640-767px | Hamburger, Drawer nav narrows to 320px panel | 2-column for card grids (Service/Project cards) | Display sizes begin scaling up via `clamp()` | 2-up grid |
| `md` | 768-1023px | Hamburger persists (tablet still touch-primary); portal sidebar becomes a collapsible icon-rail | 2-3 column | Mid-scale | 2-3 up grid |
| `lg` | 1024-1279px | Full horizontal nav appears (marketing site); portal sidebar fully expanded | 3-column standard | Full desktop scale | 3-up grid |
| `xl` | 1280-1439px | Same as `lg`, content width caps at `--container-max` (1200px, §15.8) | 3-4 column | Full scale | 3-4 up grid |
| `2xl` | 1440-1919px | Same as `xl` — no further nav change | Same max content width, more surrounding whitespace, not more columns | Same | Same column count — cards grow whitespace, not count, to avoid overly wide cards |
| `1920px+` | Ultra-wide | Same | Same | Same | Same — the site never simply "spreads out" content at ultra-wide; `--container-max` caps line length and grid width for readability (§14, line-length reasoning) |

### 17.2 Navigation Change Detail

- **< `md` (768px):** primary nav is a hamburger icon opening a full-screen or near-full-screen Drawer (§16.2) with large tap targets (≥44px, §16.0), because thumb-reach and tap-accuracy dominate at this width.
- **`md` (tablet):** marketing site still uses the hamburger pattern (touch remains the primary input even at tablet width) — this is a deliberate deviation from "just show desktop nav a bit smaller," because a cramped horizontal nav at 768px is a common real-world usability failure this document explicitly avoids.
- **≥ `lg`:** full horizontal navigation with visible top-level items, dropdown for secondary items (Services submenu, §18).
- **Portal sidebar specifically:** below `md`, the sidebar collapses to a bottom tab bar (5 max items — Dashboard, Projects, Files, Messages, Account) rather than a hamburger, because portal users return to the same 3-5 destinations repeatedly and bottom-tab access is faster than a hamburger-drawer round-trip for that usage pattern (§19 journey mapping).

### 17.3 Grid Collapse Detail

Card grids (Service, Project, Pricing) use CSS Grid with `auto-fit`/`minmax()` rather than fixed breakpoint-specific column counts — the number of columns falls out naturally from available width and a minimum card width (280px), which keeps the grid from ever producing an awkward partial column at in-between viewport widths not explicitly listed above.

### 17.4 Content Reordering

Content order changes (not just visual stacking) in exactly two documented cases, to avoid the general anti-pattern of "reflowing content order" becoming an untracked, ad-hoc habit:

1. **Homepage hero (§20.1):** the supporting visual moves from beside the headline (desktop) to below the headline/CTA (mobile) — CTA must remain above the fold on mobile, so the visual, not the CTA, moves down.
2. **Pricing page (§20.8):** the "Growth" tier (the recommended default) is visually reordered to the first (leftmost) card position on mobile single-column layout, matching its "highlighted/recommended" badge, whereas desktop keeps strict Starter -> Growth -> Premium left-to-right order since all three are simultaneously visible there.

### 17.5 Images & Media

- All images use responsive `srcset`/Next.js `<Image>` (§23) with art-directed crops for the hero image specifically (portrait-oriented crop below `sm`, landscape above) — not just the same crop scaled down.
- Video (case study/portfolio) uses a static poster-frame image on mobile with tap-to-play rather than autoplay, to protect mobile data usage and comply with the motion-preference rule (§40).

### 17.6 Buttons & Touch Targets

Below `md`, all interactive elements meet the 44x44px minimum touch target (§16.0) even where the visual element (e.g., an icon-only button) is smaller — achieved via invisible padding, not by inflating the visual size of every icon.

---

## 18. Information Architecture

### 18.1 Sitemap — Marketing Site (public, `forgedigital.in` — domain is illustrative, see §22.1)

| URL | Purpose | Audience | User Intent | SEO Purpose | Conversion Purpose | Primary CTA | Secondary CTA |
|---|---|---|---|---|---|---|---|
| `/` | Explain what Forge is and who it's for, in seconds | Cold traffic, referral clicks | "What is this and is it for me?" | Ranks for brand name + broad "digital studio India" terms | Route to Services or Contact | "See our work" or "Get a quote" (see §20.1 for final choice) | "View services" |
| `/services` | Show the full menu with clear entry points | Warm traffic evaluating fit | "What exactly do they offer?" | Hub page, internally links every service page (§22.7) | Route to a specific service page | "Explore [service]" per card | "Get a quote" |
| `/services/[slug]` (x8, one per Launch service §07.1) | Deep-dive on one service: process, deliverables, price | High-intent, often from search | "Can they do X, and what does it cost?" | Primary organic-search landing page per service keyword | Book a call / request quote for that service | "Get a quote for [service]" | "See related work" |
| `/work` | Portfolio index, builds credibility | Evaluating trust/quality | "Have they done this before, well?" | Internal-linking hub to case studies | Route to a case study or Contact | "View case study" per card | "Start your project" |
| `/work/[slug]` | Single case study, proof of outcome | High-intent, credibility-checking | "What did they actually deliver, and did it work?" | Long-form content, ranks for client-industry + service terms | Convert credibility into a lead | "Start a project like this" | "See more work" |
| `/about` | Humanize the team, build trust | Considering a longer-term relationship (esp. retainer clients) | "Who am I actually working with?" | Brand-term ranking support | Soft — route deeper into site | "Meet the process" (-> `/process`) | "Contact us" |
| `/process` | Explain the delivery pipeline (maps to §34) | Skeptical of freelancer/agency chaos specifically | "How do they actually work, day to day?" | Supports positioning-related search terms | Reduce anxiety before Contact | "Start your project" | — |
| `/pricing` | Publish package pricing (§08) | High-intent, budget-checking | "Can I afford this?" | Low organic-search value, high conversion value | Primary — direct-to-purchase-intent page | "Get started" per tier | "Book a call to discuss custom scope" |
| `/contact` | Convert intent into a lead | High-intent | "How do I start?" | Low SEO value | Primary conversion page | "Send inquiry" (form, §21.9) | Direct WhatsApp/email link |
| `/blog` | Content hub | Top-of-funnel, organic search | "Learning about [topic]" | Primary organic-acquisition surface (§22.9, §48-49) | Soft — route to relevant service | "Read more" per post | Newsletter signup (Phase 2, §57) |
| `/blog/[slug]` | Single article | Top-of-funnel, organic search | Answer a specific question | Long-tail keyword targeting | Convert reader into lead via contextual CTA | In-article contextual CTA linked to relevant service | "Explore [related service]" |
| `/privacy` | Legal disclosure | Anyone checking data handling | Compliance/trust check | Minimal | None | — | — |
| `/terms` | Legal disclosure | Anyone checking terms before signing | Compliance/trust check | Minimal | None | — | — |
| `/404` | Handle broken/missing URLs gracefully | Anyone hitting a dead link | "Where did the page go?" | None (noindex) | Recover the visit — route back into the site | "Go to homepage" | Search bar or top services links |

### 18.2 Sitemap — Client Portal (`portal.forgedigital.in`, authenticated)

| URL | Purpose | Audience | Primary CTA |
|---|---|---|---|
| `/login` | Authenticate | Existing clients | "Log in" |
| `/signup` | Complete account setup from an admin-issued invite (§31.2 — not open self-signup, see §18.4 for why) | Newly onboarded clients | "Set password & continue" |
| `/dashboard` | At-a-glance status across all of a client's projects/invoices | All logged-in clients | Link into the relevant project |
| `/projects` | List all of a client's projects | Clients with 2+ concurrent/past projects | Open a project |
| `/projects/[id]` | Single project detail — status, milestones, files, approvals (§32.2) | Active project clients | Approve/comment on current milestone |
| `/projects/[id]/files` | Full file list for a project (§36) | Active project clients | Download / view file |
| `/invoices` | List all invoices | All clients | Pay / view invoice |
| `/invoices/[id]` | Single invoice detail, payment | Clients with a due invoice | "Pay now" |
| `/settings` | Account/profile/notification preferences | All clients | Save changes |

### 18.3 Sitemap — Admin (`portal.forgedigital.in/admin`, role-gated — see §31.4 for why same app, not a separate domain)

| URL | Purpose |
|---|---|
| `/admin` | Founder-facing operational dashboard — active projects, leads needing response, overdue invoices |
| `/admin/leads` | Lead pipeline (§34 states: New -> Qualified -> Proposal -> ...) |
| `/admin/clients` | Client list/detail (contact info, project history, retainer status) |
| `/admin/projects` | All projects across all clients, filterable by state/founder-owner |
| `/admin/projects/[id]` | Full internal project view — everything the client sees, plus internal notes, cost tracking, QA checklist (§34, §46) |
| `/admin/proposals` | Proposal drafting/tracking (§34) |
| `/admin/invoices` | Invoice creation/tracking (§35) |
| `/admin/content` | Lightweight CMS for blog posts and portfolio/case-study entries (§22, §49) |
| `/admin/settings` | Team accounts, notification defaults, package/pricing config |

### 18.4 Pages Explicitly NOT Created (and why)

| Page NOT built | Why not |
|---|---|
| Public self-serve signup for the client portal | Clients are onboarded by a founder after a signed proposal (§34) — open self-signup would let anyone create a portal account with no associated project, adding moderation burden and security surface (§38) for zero business benefit at this stage |
| A public "team" page listing individual bios beyond the About page's brief founder section | Three founders; a dedicated full team directory page is premature until headcount (§54) justifies it — folded into `/about` instead |
| A public API / developer docs page | No public API exists (§30 — the API serves the portal/admin only, it is not a product) |
| A separate "Careers" page | No active hiring in Year 1 beyond the triggers in §54; a careers page with nothing open creates a dead-end, low-trust experience |
| Live chat widget on the marketing site | Requires real-time staffing Forge doesn't have with 3 founders focused on delivery (§03.4, O1) — the Contact form + WhatsApp/email link (§21.9) serves the same intent without an unstaffed-chat credibility risk |
| A dedicated mobile app for clients (native) | The responsive portal web app (§17) serves the actual V1 need; a native app is a Phase 3+ consideration only if usage data ever justifies it (§57) |

---

## 19. Website UX — User Journeys

### 19.1 First-Time Visitor (cold traffic, e.g. from search or a shared link)

```text
1. Lands on Homepage or a /services/[slug] page (most common entry points per §22)
2. Reads hero + immediately visible social proof (client logos/testimonial strip, §20.1)
3. Scans service overview -> clicks into a specific service OR scrolls to see process/pricing signal
4. Checks /work for credibility if not yet convinced
5. Checks /pricing if budget-fit is the remaining question
6. Converts via /contact, or exits
```
*Design implication:* every one of steps 2-5 must be reachable within 1-2 clicks of the homepage (§18.1) — a first-time visitor who has to hunt for pricing or portfolio will leave (§39 performance + §19 UX both defend against this).

### 19.2 Returning Visitor (has seen the brand before, e.g. via a referral mention)

```text
1. Often lands directly on /pricing or /contact (higher intent already)
2. May go straight to /work to verify quality before committing
3. Converts faster than a first-time visitor — the site's job here is to not get in the way
```
*Design implication:* pricing and contact must never require multi-step navigation "to protect the sales conversation" — this would contradict §02.5 (transparent pricing) for the exact visitor segment most ready to convert.

### 19.3 Lead (has submitted the Contact form or been referred, pre-client)

```text
1. Submits /contact form (§21.9) or is introduced via referral/outreach (§47)
2. Receives an automated acknowledgment email (§37) within minutes
3. Founder follow-up call within the SLA defined in §47 (target: same business day)
4. Receives a proposal (§34) — not yet in the portal (portal access starts at signed proposal, §18.4)
5. Signs proposal + pays deposit (§09.6) -> becomes a Client, portal account is created
```

### 19.4 Client (active project)

```text
1. Receives portal invite email (§37) -> completes /signup
2. Lands on /dashboard, sees active project status
3. Reviews milestones as they complete, approves/comments (§32.2)
4. Receives notifications (email + in-portal, §37) at each status change
5. Pays milestone invoices via /invoices/[id]
6. At delivery, receives the retainer pitch (§46 Delivery stage) — accepts or declines
```

### 19.5 Returning Client (retainer or repeat project)

```text
1. Logs into /dashboard directly (bookmarked/muscle-memory), sees ongoing retainer status or a new project
2. For retainer clients: reviews monthly content calendar/report on a predictable cadence (§08.3)
3. For repeat-project clients: journey re-enters at 19.3 step 4 (proposal), but skips re-signup (account already exists)
```

### 19.6 Admin (Founder, day-to-day operator)

```text
1. Logs into /admin, dashboard surfaces: leads awaiting response, projects awaiting the founder's next action, overdue invoices
2. Works the lead pipeline (§34) or updates project status, which immediately reflects in the client's portal view
3. Generates/send invoices (§35), reviews QA checklist before marking a milestone client-visible (§46)
```
*Design implication:* the admin dashboard is a task-prioritization tool, not just a data browser — it must surface "what needs my attention right now," directly serving §03.4 (O1 — founder time is the scarce resource).

### 19.7 Founder (Strategic/Operational, not day-to-day task view)

```text
1. Reviews the KPI summary (§51) — MRR, active retainer count, pipeline value, WIP per founder (§34)
2. Uses this view weekly/monthly, not daily — distinct from the daily operator view in 19.6
```

---

## 20. Page Specifications

Each page is specified top to bottom. These are layout/content-block specifications, not pixel-level design (pixel-level design is a Figma-file responsibility per §00.2).

### 20.1 Homepage (`/`)

```text
1. Navigation (sticky, §16.6)
2. Hero: headline ("Built to last." framing, §11.9) + subhead stating who it's for + primary CTA
   ("Get a quote") + secondary CTA ("See our work") + supporting visual (real project screenshot,
   not stock, §12.3)
3. Trust strip: client logos or a 2-3 line aggregate proof statement (e.g., "X projects delivered")
   — only shown once real numbers exist; see §64 for the "don't fabricate proof" rule
4. Services overview: Service Card grid (§16.5) for the 8 Launch services (§07.1), each linking to
   its /services/[slug] page
5. Process teaser: 4-step abbreviated version of §34's pipeline, linking to /process for detail
6. Featured work: 3 Project Cards (§16.5), linking to /work
7. Testimonial block: 1-2 Testimonial components (§16.5)
8. Pricing teaser: abbreviated 3-tier price signal, linking to /pricing (not the full Pricing Card
   detail — avoids duplicating /pricing's full content, §21 content-duplication rule)
9. Final CTA block (§16.5)
10. Footer (§16.6)
```

### 20.2 Services Overview (`/services`)

```text
1. Navigation
2. Page header: heading + one-paragraph framing of "why a narrow menu" (a soft expression of
   §02.2/§07 reasoning, told in customer-facing language, not internal-strategy language)
3. Service Card grid — all 8 Launch services, full descriptions (longer than homepage teaser)
4. CTA block: "Not sure what you need? Book a free consult"
5. Footer
```

### 20.3 Individual Service Page (`/services/[slug]`)

```text
1. Navigation
2. Hero: service name + one-line value statement + primary CTA ("Get a quote for [service]")
3. "Who this is for" block — maps directly to the relevant ICP(s) from §06
4. Deliverables list — pulled directly from §07's per-service deliverables, never diverges from
   what §08 packages actually include (a content-architecture rule enforced in §21.3)
5. Process for this specific service (abbreviated from §07's per-service process notes)
6. Package/pricing snapshot for this service (linking to full /pricing for combined packages)
7. Related work: Project Cards filtered by this service tag (§16.5's tag-linking rule)
8. FAQ (Accordion, §16.4) — 3-5 questions specific to this service
9. CTA block
10. Footer
```

### 20.4 Portfolio / Work (`/work`)

```text
1. Navigation
2. Page header
3. Filter control (by service type — reuses the same tags as Service Cards, §16.5)
4. Project Card grid
5. CTA block
6. Footer
```

### 20.5 Case Study Detail (`/work/[slug]`)

```text
1. Navigation
2. Header: client/project name, service tags, one-line outcome statement
3. Challenge section: the client's problem before Forge (mirrors §03.1 structure, told in that
   client's specific terms)
4. Approach section: what Forge did, referencing the relevant service process (§07)
5. Visual showcase: real screenshots/mockups of the delivered work
6. Outcome section: concrete results where available and honestly attributable (§64 — never
   claims causation Forge can't support, e.g. "sales increased" without a defensible basis)
7. Testimonial from that client, if available
8. Related case studies (2-3, same service tag)
9. CTA block
10. Footer
```

### 20.6 About (`/about`)

```text
1. Navigation
2. Header: brand story (§11.6, expanded to full length here)
3. Founders section: 3 short bios (name, role/domain per §53, one photo, one line of relevant
   background) — no more than this; a full team directory is out of scope (§18.4)
4. Values section (pulled from §11.8)
5. Link to /process for "how we actually work"
6. CTA block
7. Footer
```

### 20.7 Process (`/process`)

```text
1. Navigation
2. Header
3. Timeline component (§16.4) rendering an abbreviated, client-facing version of the §34 pipeline:
   Discovery -> Proposal -> Kickoff -> Design -> Development/Production -> Review -> Delivery ->
   (optional) Ongoing Retainer — client-facing labels differ slightly from the internal state-machine
   names in §34 where the internal name would be confusing to a client (e.g. internal "QUALIFIED"
   has no client-facing equivalent at all, since it precedes any client contact)
4. Portal preview: 1-2 screenshots of the client portal (§32), directly addressing the "visibility"
   value proposition (§03.1, C2)
5. CTA block
6. Footer
```

### 20.8 Pricing (`/pricing`)

```text
1. Navigation
2. Header: short framing statement on transparent pricing (§02.5, told to the customer)
3. Service category tabs or sections (Websites / Branding / Social & Content / SEO & Maintenance)
   — matches §08's package groupings exactly, never invents a different grouping here
4. Pricing Card grid per category (Starter / Growth / Premium, §16.5) — each card's exclusion list
   present but collapsed by default (§16.5 content rule)
5. Enterprise/Custom callout block with the stated price floor (§08.1)
6. FAQ (Accordion) — billing/payment/revision-policy questions (§09)
7. CTA block
8. Footer
```

### 20.9 Contact (`/contact`)

```text
1. Navigation
2. Header: short, low-friction framing ("Tell us about your project")
3. Contact form — full field spec in §21.9
4. Direct-contact alternative (email address, WhatsApp Business link) for visitors who prefer not
   to use a form — addresses a real accessibility/preference gap a form-only page would create
5. Footer (no additional CTA block here — the form itself IS the page's single CTA, per §16.5's
   "exactly one CTA per page" rule; a second competing CTA here would work against the page's one job)
```

### 20.10 Blog Index (`/blog`)

```text
1. Navigation
2. Header
3. Featured/most-recent post (larger card)
4. Post grid (Project-Card-pattern reused for blog post previews, §16.5's "one Card family" principle
   avoiding a bespoke blog-card component with no meaningful difference)
5. Category filter (matches content pillars, §49.1)
6. Pagination (load-more variant, §16.4)
7. Footer
```

### 20.11 Blog Post (`/blog/[slug]`)

```text
1. Navigation
2. Article header: title, publish date, author (founder name, builds credibility per §11.4)
3. Article body (rich text — see §22.9 for content-model/CMS notes)
4. Contextual mid-article and end-of-article CTA linking to the most relevant service page
   (never the generic homepage — specific service page always outperforms generic CTA relevance)
5. Related posts (2-3, same category)
6. Footer
```

### 20.12 Client Portal — Login (`/login`)

```text
1. Minimal chrome (logo only, no full marketing nav — the portal is a task tool, not a browsing
   experience, §64)
2. Email + password fields, "forgot password" link (§31.3)
3. Primary CTA: "Log in"
4. No public "sign up" link (§18.4 — accounts are invite-only)
```

### 20.13 Client Portal — Signup (`/signup`, invite-token gated)

```text
1. Minimal chrome
2. Pre-filled email (from the invite), name field, password + confirm fields
3. Primary CTA: "Set password & continue" -> lands on /dashboard
```

### 20.14 Client Portal — Dashboard (`/dashboard`)

```text
1. Portal navigation (sidebar desktop / bottom-tabs mobile, §17.2)
2. Greeting + at-a-glance summary: active project count, next milestone due, any invoice due
3. Project summary cards (one per active project) — status, next action needed from the client
   (e.g., "Awaiting your approval on: Homepage design")
4. Recent activity feed (last 5 status-relevant events)
5. Quick links: Invoices, Files, Settings
```

### 20.15 Client Portal — Projects List (`/projects`)

```text
1. Portal navigation
2. Filter (active / past)
3. Project Card list, each linking to /projects/[id]
```

### 20.16 Client Portal — Project Detail (`/projects/[id]`)

```text
1. Portal navigation
2. Project header: name, current state (from §34's state machine, client-facing label per §20.7's
   labeling note), overall progress indicator
3. Timeline (§16.4) — milestones with status (upcoming / in progress / awaiting your approval /
   approved / delivered)
4. Current-action panel: if a milestone awaits client approval, this is the most visually prominent
   element on the page (directly serves §03.1 C2 — visibility)
5. Files tab/section (§20.17)
6. Comments/messages thread scoped to this project (§32.5 — not a general chat, project-scoped only)
7. Linked invoices for this project
```

### 20.17 Client Portal — Files (`/projects/[id]/files`)

```text
1. Portal navigation + project sub-nav
2. Upload zone (File Uploader component, §16.1) — only visible if the client has upload permission
   for the current stage (§36.3)
3. File list, grouped by milestone/stage, each with: name, uploader, date, download action
4. Version indicator where a file has been superseded (§36.4)
```

### 20.18 Client Portal — Invoices (`/invoices`, `/invoices/[id]`)

```text
List view:
1. Portal navigation
2. Invoice list: number, project, amount, status (due / paid / overdue), date

Detail view:
1. Portal navigation
2. Invoice line items, total, due date
3. Payment action ("Pay now" -> payment provider flow, §35) if unpaid; download PDF always available
```

### 20.19 Client Portal — Settings (`/settings`)

```text
1. Portal navigation
2. Profile fields (name, email, phone)
3. Password change
4. Notification preferences (§37.4) — Switch components per notification type
```

### 20.20 Admin Dashboard (`/admin`)

```text
1. Admin navigation (sidebar)
2. "Needs your attention" panel: unresponded leads past SLA, milestones awaiting internal QA,
   overdue invoices — the single most important panel on the page (§19.6 design implication)
3. Pipeline snapshot: lead/project counts per state (§34)
4. WIP-per-founder indicator (§02.6, §34's WIP cap made visible, not just policy)
```

### 20.21 404 Page

```text
1. Minimal navigation (logo, link home)
2. Friendly message (on-brand voice, §11.5 — not a generic server-default message)
3. Primary CTA: "Go to homepage"
4. Secondary: links to Services and Contact (most likely intended destinations)
```

### 20.22 Error Page (500 / unhandled application error)

```text
1. Minimal chrome
2. Apologetic, plain-language message — never expose a stack trace or internal error detail to the
   user (§38 security, §42 error handling)
3. "Try again" action + a support-contact fallback
```

### 20.23 Maintenance Page

```text
1. Minimal chrome
2. Message stating the platform is temporarily unavailable, with an expected-return note if known
3. Contact fallback (email) so urgent client needs aren't fully blocked
```

### 20.24 Privacy Policy (`/privacy`) & Terms (`/terms`)

```text
1. Minimal chrome
2. Standard legal document layout (table of contents + sections)
```
PROFESSIONAL REVIEW REQUIRED — the actual legal content of both pages must be drafted/reviewed by a qualified professional before publishing; this document specifies only that the pages exist and their structural placement in the sitemap (§18.1).

---

## 21. Content Architecture

### 21.1 Website Copy Structure Principles

- **Specificity over adjectives:** every page favors concrete facts (post counts, page counts, timelines, prices) over unverifiable adjective-stacking ("best-in-class," "world-class") — a direct expression of §11.5's voice rules.
- **One CTA per page, at the primary weight:** stated in §16.5 and enforced across every page spec in §20 — secondary CTAs exist but are visually and hierarchically subordinate.
- **No content duplication across pages with different intents:** e.g., the homepage's pricing teaser (§20.1) never repeats the full Pricing Card detail from `/pricing` (§20.8) — each page's content is scoped to that page's specific job (§18.1's "purpose" column).

### 21.2 Headline Formula

Primary headlines (Hero components, §16.5) follow a consistent construction: **[Outcome] + [for whom] + [differentiator]**. Example (Homepage): "A digital presence built to last — for growing Indian businesses who've outgrown freelancers." This formula is a starting discipline for whoever writes copy, not a rigid template that must be visible in the wording — variation is expected, the *information* the formula requires (outcome, audience, differentiator) is what's non-negotiable.

### 21.3 Service Description Content Rules

Every service page's deliverables list (§20.3) must be **generated from the same source of truth as §07/§08** — in practice, this means the CMS content model for a service page (§22.9) includes a structured "deliverables" field that references package data rather than a free-text field a writer could let drift out of sync with the actual package definition. This is a content-architecture enforcement of §00.4's "dependent sections must stay consistent" rule, applied to marketing copy specifically.

### 21.4 CTA Copy Rules

- CTAs are verbs + specific object: "Get a quote for branding," not "Learn more" or "Submit."
- Never use urgency-manufacturing language ("Only 2 spots left!") unless literally true and currently the case — false scarcity contradicts §11.5's honesty rule and §02.6's non-manipulative growth principle.

### 21.5 Case Study Content Rules

Every case study (§20.5) must include: a specific, named problem (not generic), Forge's actual approach (not generic "we designed a beautiful website"), and an honestly-attributable outcome. If a concrete metric isn't available or isn't honestly attributable to Forge's work specifically, the outcome section states qualitative results instead of fabricating a number — see §64 for the explicit prohibition on invented metrics.

### 21.6 Testimonial Content Rules

Testimonials are collected verbatim (or lightly edited only for length/clarity, with the client's approval of the edited version) — never written by Forge and attributed to a client without that client's explicit review and consent. PROFESSIONAL REVIEW REQUIRED if testimonial usage rights aren't already covered by the standard client contract (§52).

### 21.7 Blog Content Rules

- Every post maps to one of the content pillars defined in §49.1 — no off-pillar posts, to keep the blog's SEO authority (§22.9) concentrated rather than diffuse.
- Every post includes at least one internal link to a relevant service page (§21.4's CTA rule applied inline, not just at the end).
- Minimum quality bar: a post must answer the question implied by its target keyword completely enough that a reader doesn't need to immediately search again — thin, keyword-stuffed content is explicitly prohibited (§64, §22 SEO integrity).

### 21.8 FAQ Content Rules

FAQ entries (used in Accordion components, §16.4, on service pages and the pricing page) must be real questions the founders have actually been asked (via sales calls, §47) — not speculative "what an FAQ page usually has" filler. This keeps the FAQ genuinely useful rather than decorative, consistent with §02.7.

### 21.9 Contact Form — Full Specification

```text
CONTACT FORM

Purpose:
Convert a high-intent visitor into a qualified lead with enough information for a founder to
prepare for the first call, reducing wasted discovery-call time (§03.4, O1).

Fields:
- Name (required)
- Email (required)
- Company (optional)
- Service interested in (required, single-select from the 8 Launch services + "Not sure")
- Budget range (required, select: bands matching §08's package price floors, plus "Not sure yet")
- Timeline (required, select: ASAP / 1 month / 1-3 months / Flexible)
- Message (optional, free text)

Why each field exists:
- Name/Email: minimum viable contact info.
- Company: context for the founder before the call; optional because solo-founder/individual
  clients (e.g. a personal brand) may not have one.
- Service: routes the inquiry and pre-frames the call.
- Budget range: pre-qualifies fit against §08 pricing *before* founder time is spent — directly
  serves §02.5's stated purpose (repel clearly-mismatched leads early).
- Timeline: flags rush-fee (§09.6) conversations early and helps prioritize response order.
- Message: optional because required free-text fields suppress form completion rates; the
  structured fields above already capture what's essential.

Validation:
- Name: non-empty, max 100 chars.
- Email: valid email format (client + server-side, §30.2).
- Service/Budget/Timeline: must be one of the enumerated options (server validates against the
  same enum used to render the select, §30.2 — no free-text injection into what should be structured data).

Required fields: Name, Email, Service, Budget range, Timeline.

Error states: inline, per-field, below the field, using the Input/Select error variant (§16.1) —
never a single generic top-of-form error summary alone (though a summary may additionally appear
for screen-reader users navigating a long form, per §40).

Success state: form is replaced by a confirmation message ("Thanks — we'll respond within one
business day") rather than a redirect, so the user isn't taken away from context unexpectedly.

Loading state: submit button enters the Button loading variant (§16.1); form fields disable to
prevent double-submission.

Spam prevention: honeypot field (invisible to real users, filled only by bots) plus server-side
rate limiting by IP (§30.5) — no visible CAPTCHA in V1, since CAPTCHAs measurably hurt legitimate
completion rates and the honeypot + rate-limit combination is sufficient at expected V1 traffic
volume (OPEN DECISION: revisit if spam volume becomes a real problem post-launch).

Accessibility: all fields properly labeled (not placeholder-only labels, §40), error messages
linked via aria-describedby, full keyboard operability, focus moves to the first error on failed
submit.

Analytics: `contact_form_submitted` event fired on success, with `service` and `budget_range`
as properties (no PII in analytics properties — name/email are never sent to the analytics
provider, §41.3, §38.7).

API: `POST /api/leads` (§30.3).

Database: creates a row in the `leads` table (§29.4).

Email notification: triggers an internal notification to all three founders (§37.2) and an
auto-acknowledgment email to the submitter (§37.2).

CRM integration: none in V1 — the `leads` table in the admin (§18.3, §33) IS the lead tracking
system; a dedicated external CRM is explicitly deferred (§57) until lead volume exceeds what the
admin's lead list can reasonably manage.

Security: server-side validation is authoritative regardless of client-side validation (§38.4);
input is sanitized before storage/display to prevent stored XSS in the admin lead view (§38.3).

Mobile behavior: fields stack full-width; select fields use native mobile pickers for better
platform-native usability (§16.1's native-backed Select variant).

Desktop behavior: two-column layout for Name/Email and Budget/Timeline pairs to reduce scroll
length; Message field remains full-width.

File location: `app/(marketing)/contact/page.tsx` renders the page; the form itself is
`components/marketing/contact-form.tsx` (§25 repo structure).

Tests: renders all fields; client validation blocks empty required fields; successful submit
calls the API and shows the success state; failed submit shows field-level errors; honeypot
field submission is silently rejected server-side without revealing to the bot that it was
caught (§43.1 for the testing pattern this follows).

Acceptance criteria: a user can submit a valid inquiry in under 60 seconds on mobile; an invalid
submission never reaches the database; both founders receive the internal notification within
1 minute of a valid submission (§37's delivery-time expectation).
```

---

## 22. SEO Architecture

### 22.1 URL Strategy

- All URLs are lowercase, hyphen-separated, human-readable (`/services/website-design-development`, not `/services/1` or `/svc?id=1`).
- Service page slugs match the service names used consistently across §07/§08/§20/§21 — one canonical slug per service, never renamed without a redirect (§22.4).
- No unnecessary URL depth: service pages are one level deep (`/services/[slug]`), not nested under artificial categories.

### 22.2 Metadata

Every page defines a unique `<title>` (50-60 chars target) and `meta description` (140-160 chars target) — templated per page type (service, case study, blog post) but populated with page-specific content, never a single sitewide default reused across pages (a common, damaging SEO mistake this document explicitly avoids, §64).

### 22.3 Canonicals

Every page sets a self-referencing canonical tag by default; paginated list views (`/blog?page=2`) canonicalize appropriately per standard pagination SEO handling rather than each treated as fully distinct content.

### 22.4 Redirects

Any URL change (service slug rename, case study removal) requires a 301 redirect from the old URL — enforced as a checklist item in the deploy process (§44) whenever a content-model change touches existing published URLs.

### 22.5 Sitemap & Robots

- `sitemap.xml` auto-generated at build time from the CMS content (all published services, case studies, blog posts, static pages) — never hand-maintained (a hand-maintained sitemap silently drifts out of date, violating §02.7's "no unnecessary manual process where automation is appropriate," §02.4).
- `robots.txt` disallows `/admin`, `/dashboard`, `/projects`, `/invoices`, `/settings`, `/api` — the entire authenticated portal/admin surface is excluded from crawling (also enforced by authentication itself, §31 — robots.txt is defense-in-depth, not the actual access control).

### 22.6 Structured Data (Schema.org)

- Homepage/About: `Organization` schema.
- Service pages: `Service` schema.
- Case studies: no strong standard schema type fits well; omitted rather than misusing an unrelated schema type just to have one (§64 — don't add structured data with no correct type to apply).
- Blog posts: `Article` schema (headline, author, datePublished).

### 22.7 Open Graph

Every page defines OG title/description/image — case studies and blog posts use a specific per-entry image (not a single sitewide default), since social-share appearance is a real first impression for content-marketing traffic (§48).

### 22.8 Internal Linking Strategy

- Service pages <-> relevant case studies link bidirectionally (§16.5's Project Card tag-linking rule, §20.3/§20.5).
- Blog posts link to relevant service pages contextually (§21.7).
- Homepage links to all top-level sitemap sections (§18.1) — no orphaned pages; every page in §18.1 must be reachable via at least one internal link from another indexed page (checked as part of the pre-launch checklist, §67).

### 22.9 Content Strategy (headline — full detail in §49)

The blog and case-study content model both live in the admin CMS (§18.3, §33) as structured content types (not raw HTML pasted in) so that title/description/OG fields, schema data, and internal-linking fields (§21.3, §21.7) are enforced by the content model itself rather than left to writer discipline alone — the same "structural enforcement over convention" reasoning used for tokens (§13.1) and form validation (§21.9), applied here to content integrity.

---

## 23. Technical Architecture

### 23.1 Selection Philosophy

Every technology below is chosen against one question: **does this solve a real, stated requirement from §01-§22, at a cost 2-3 people can run and maintain?** (§02.3, §28's "no random technology" rule). None are chosen for trend, resume-value, or boilerplate-familiarity reasons.

### 23.2 Stack Decisions

| Layer | Chosen | Why (real requirement it solves) | Alternative(s) Considered | Why Rejected | Migration Implication |
|---|---|---|---|---|---|
| Frontend framework | **Next.js (App Router) + React + TypeScript** | Single framework covers marketing site (SEO-critical, needs SSR/SSG, §22) AND the authenticated portal/admin (needs client interactivity) without running two separate frontend stacks — directly serves §02.3 | Separate SPA (Vite/React) + static marketing site; SvelteKit/Remix | SPA-only fails SEO requirements (§22) without extra SSR tooling anyway, reintroducing the complexity it was meant to avoid. Remix/SvelteKit are capable alternatives but have a smaller India-hiring talent pool and less mature ecosystem for the specific integrations needed (Auth.js, Vercel), raising §54 hiring risk later | Framework migration would require a substantial rewrite; mitigated by keeping business logic in `features/`/`lib/` decoupled from framework-specific page code (§25, §27) so the *logic* migrates more easily than the UI layer would |
| Styling | **Tailwind CSS** | Directly implements the token architecture (§15.9) via config-driven utility classes; avoids hand-writing/maintaining a separate CSS-in-JS runtime | CSS Modules; styled-components/CSS-in-JS | CSS Modules would require re-deriving Tailwind's design-token-to-utility mapping by hand, more code to maintain for the same result. CSS-in-JS adds runtime cost (§39) for no benefit this project needs | Low — Tailwind classes are additive; a future design-system change updates `tailwind.config.ts` centrally (§15.9) |
| UI primitives | **Radix UI (unstyled)** | See §16.7 — solves real accessibility-engineering requirements | Headless UI; hand-built | Headless UI has a narrower component set than Radix for this project's needs (Radix covers Dialog, Popover, Select, Tabs, etc. more completely) | Low — Radix is a behavior layer under Forge's own styled components (§16), so swapping it affects `components/ui/*` internals, not consuming code |
| Backend | **Next.js Route Handlers + Server Actions (same app, no separate backend service)** | The client portal/admin's data needs (§30-37) don't require independent scaling from the frontend at this company's size — a separate backend service is exactly the premature-scale complexity §02.3/§64 prohibit | Separate Node/Express or NestJS API service | A separate service means two deployments, two sets of environment config, and a network hop between frontend and API for zero current benefit — pure operational cost for a 3-person team (§54) | If the platform ever needs independent API scaling (unlikely before significant growth), the `features/*` business-logic layer (§27) is structured so it could be extracted into a standalone service without a full rewrite |
| Language | **TypeScript (strict mode)** | Catches a real, common class of bugs (wrong shape passed between DB/API/UI) before runtime, valuable specifically because a small team has less code-review bandwidth to catch these manually | Plain JavaScript | Would remove a safety net a small team benefits from disproportionately (fewer reviewers per PR means more that must be caught by tooling, not people) | N/A — this is a Day-0 decision, not one requiring later migration |
| Database | **PostgreSQL** (managed, see Hosting) | Relational data (clients, projects, invoices, milestones — §29) has real relationships and needs real transactional integrity (e.g., invoice + payment status must never desync) | MongoDB / other NoSQL; MySQL | NoSQL would require Forge to hand-build the relational integrity Postgres gives for free (foreign keys, transactions) — solving a problem NoSQL is worse at, for no offsetting benefit at this data scale. MySQL is a viable alternative but Postgres has stronger native support for the JSON columns and full-text search Forge's content model (§22.9) benefits from | Standard SQL — migrating between managed Postgres providers (§23.3) is low-risk; migrating away from relational modeling entirely would be a large rewrite, which is exactly why this choice is made deliberately up front |
| ORM | **Prisma** | Type-safe query layer that generates TypeScript types directly from the schema (§29), removing an entire class of DB/application type-mismatch bugs | Drizzle ORM; raw SQL | Drizzle is a reasonable, lighter-weight alternative; Prisma is chosen for its more mature migration tooling (§29.7) and larger ecosystem, which matters more than raw query performance at this project's scale | Schema is defined once in `prisma/schema.prisma` (§25) — migrating ORMs would require rewriting the data-access layer in `features/*`, but the underlying Postgres schema itself is portable |
| Authentication | **Auth.js (NextAuth v5), credentials provider + database sessions** | Handles session management, CSRF-safe auth flows, and role-based access (§31) without building auth primitives by hand — a security-critical area where "don't roll your own" is the correct default (§38, ranked above developer convenience in §00.7) | Clerk / Auth0 (managed auth-as-a-service); hand-rolled auth | Managed auth-as-a-service adds a recurring per-user cost that doesn't scale well for a cost-sensitive Year-1 business (§51) and adds an external dependency for a function Auth.js handles adequately in-app. Hand-rolled auth repeats the exact "don't reinvent security-critical primitives" mistake §38 warns against | Auth.js's database session model stores sessions in Postgres (§29.3) — migrating providers later would require a data migration of the `Session`/`Account` tables, a known, well-documented Auth.js migration path |
| File storage | **Cloudflare R2** (S3-compatible object storage) | Client-uploaded files (§36) need durable, access-controlled object storage with predictable cost | AWS S3; Vercel Blob | S3 is a fine alternative but R2's zero-egress-fee pricing matters concretely for a file-heavy client portal (design files, deliverables) where clients repeatedly download large files — a direct cost-control decision (§51), not a trend choice | S3-compatible API means migrating to actual S3 later (if ever needed) requires only a config/credentials change, not a rewrite of `lib/storage.ts` (§25) |
| Payments (India) | **Razorpay** | Handles UPI, cards, and netbanking — the payment methods Forge's primary-ICP clients (§06) actually use; required for §35 | Stripe (India support is limited for the payment methods above); PayU | Stripe's India-specific payment method coverage is weaker than Razorpay's for UPI/netbanking specifically, which are the dominant methods for this ICP | Payment provider logic is isolated in `lib/payments/razorpay.ts` (§25) behind a common internal interface, so adding Stripe alongside it (not replacing it) for international clients (§06, S6) is additive, not a rewrite |
| Payments (international, Phase 2+ per §06 S6) | **Stripe** | Best-supported option for US/UK/AU card payments once international clients are actively pursued | Razorpay international support | Razorpay's international coverage is secondary to its India-specific strength; Stripe is the stronger choice specifically for the international-client use case | Additive alongside Razorpay (see above), gated behind the same trigger as ICP S6 (§06.3) |
| Transactional email | **Resend** | Needed for §37 (notifications) — invoice, status-change, and lead-notification emails need reliable delivery and simple templating | SendGrid; Postmark; raw SMTP | SendGrid/Postmark are both viable; Resend is chosen for its React-based email templating (`react-email`), which lets the same component patterns/tokens (§13-16) apply to email templates instead of maintaining a separate HTML-email toolchain | Low — email sending is isolated in `lib/email.ts` (§25) |
| Content (CMS) | **Custom, in-app content model (Postgres tables + admin UI), not a third-party headless CMS** | Content volume (blog posts, case studies, service copy) is small enough that a dedicated CMS product is unjustified overhead (§02.7) — the admin app (§33) already needs to exist for leads/projects, so extending it to manage content is near-zero marginal cost | Sanity; Contentful; Strapi | Each adds a separate vendor relationship, a separate access-control system to keep in sync with Forge's own auth (§31), and a monthly cost — solving a problem (content editing UI) Forge can solve more cheaply as a small addition to software it's building anyway | If content volume/editorial complexity grows significantly (e.g., a non-technical marketing hire needs a much richer editing experience), a headless CMS becomes reconsiderable — tracked as an Open Decision, not a current need |
| Analytics | **Plausible** (or self-hosted equivalent) | Privacy-respecting, cookieless analytics avoids a cookie-consent-banner UX burden (§40) and keeps PII out of a third-party analytics vendor (§38.7) | Google Analytics 4 | GA4 is free and more feature-rich, but its data collection model raises privacy/PII concerns (§38, §40) and typically requires a cookie-consent banner that adds UX friction to every page (§21.1's "specificity, no unnecessary friction" spirit) | Analytics events are already abstracted through a single `lib/analytics.ts` wrapper (§25, §41) — swapping providers changes one file, not every call site |
| Error tracking | **Sentry** | Needed for §42 — the team must know about production errors without relying on clients to report them | Rollbar; self-hosted logging only | Sentry has the most mature Next.js-specific integration (server + client error capture in one SDK), reducing setup/maintenance burden for a small team | Low — isolated to SDK init + error boundary wiring |
| Hosting | **Vercel** | Zero-config deployment for Next.js specifically (built by the same team), integrated preview deployments per PR (§44), integrated CDN/edge network | Self-hosted (Docker + a VPS); Netlify; AWS Amplify | Self-hosting would require the 3-person team to own server/infra maintenance (patching, scaling, uptime) that Vercel's managed platform handles — a direct, unjustifiable cost under §02.3 for a team whose time is the scarcest resource (§03.4, O1) | Next.js is portable to any Node-compatible host if ever needed (self-hosted, or another platform); Vercel-specific features used (e.g., Edge Middleware) are limited to auth routing (§25) to keep this migration path realistic |
| CDN | **Vercel Edge Network** (bundled with Hosting) | Static asset and edge-rendering delivery, no separate configuration needed | Cloudflare CDN (separate) | Would add a second vendor and configuration surface for a capability Vercel already provides bundled | N/A |
| Monitoring (uptime) | **Vercel Analytics + a lightweight uptime check (e.g., a scheduled health-check ping, tool TBD)** | Needs to know if the site/portal goes down, per §44/§45 | Full observability platform (Datadog, etc.) | A full observability platform is disproportionate cost/complexity for current traffic/scale (§02.3) | Revisit if/when the team scales (§54) and operational complexity grows |
| CI/CD | **GitHub Actions + Vercel Git integration** | Automated test runs on PR (§43) and automatic preview/production deploys tied to git branches (§44-45) | GitLab CI; CircleCI; Jenkins | GitHub Actions is chosen specifically because it's free at this usage scale and integrates natively with the git-hosting platform already in use (§45.1) — introducing a second CI vendor would be unjustified | N/A |

### 23.3 ASSUMPTION Flags on Vendor Choices

ASSUMPTION: specific managed-Postgres provider (e.g., Neon, Supabase, or Vercel Postgres) is not locked in this document — §29 assumes standard PostgreSQL features only (no provider-specific extensions), so the provider choice is a deployment-config decision made at implementation time (§55, Week 1) based on then-current pricing, not a decision that affects the schema or application code.

---

## 24. System Architecture

### 24.1 Layered View

```text
Browser (client device — desktop/mobile, marketing visitor or authenticated portal/admin user)
   |
CDN / Edge (Vercel Edge Network) — static assets, edge-cached marketing pages, edge middleware
   |                                for auth-route protection (§25's middleware.ts)
Next.js Application (single deployed app — see §24.2 for why this collapses several
   |                  "layers" of the generic diagram into one runtime)
   |-- Server Components / Pages  — render marketing + authenticated UI
   |-- Route Handlers / Server Actions — the API surface (§30)
   |-- Middleware — auth/role gating before a request reaches a protected route (§31.4)
   |
Business Logic (features/*, lib/*) — validation, authorization checks, orchestration
   |                                  (§27) — deliberately NOT framework-coupled
   |
Data Layer (Prisma Client) — typed query layer over PostgreSQL (§29)
   |
PostgreSQL (managed) — durable relational storage
   |
Object Storage (Cloudflare R2) — client files/deliverables (§36)
   |
External Providers — Razorpay/Stripe (§35), Resend (§37), Sentry (§42), Plausible (§41)
```

### 24.2 Why This Collapses the "Textbook" Layered Diagram

A textbook Browser -> CDN -> Frontend -> Application -> API -> Services -> Database -> Storage diagram implies separately deployed, independently scaled tiers. Forge's actual architecture (§23) deliberately collapses Frontend, Application, API, and Services into **one deployed Next.js application** — this is not a simplification of the diagram for this document's sake, it is the real, intended architecture, and stating it explicitly here prevents a future engineer from "fixing" this into unnecessary separate services under the mistaken belief that the collapsed diagram was just documentation shorthand. See §02.3 and §64 for the standing prohibition on introducing this kind of premature-scale complexity.

### 24.3 Request Flow Example (concrete trace, ties §24.1 to a real user action)

```text
1. Client submits the Contact form (§21.9) -> POST request to /api/leads
2. Vercel Edge routes the request to the nearest Next.js serverless function instance
3. Route Handler (app/api/leads/route.ts) parses + validates the request body against the shared
   Zod schema (§27.5) — the SAME schema the client-side form used, imported from lib/validation/
4. features/leads/create-lead.ts orchestrates: writes to the `leads` table via Prisma (§29.4),
   triggers a notification via lib/email.ts (Resend, §37.2)
5. Response returns to the client; client shows the success state (§21.9)
6. Analytics event fires client-side (§41) via lib/analytics.ts (Plausible)
```

This trace exists specifically to make §24.1's abstract layer list concrete — every layer named above is visible as a real file/step in this trace, not an abstraction with no code behind it.

### 24.4 Authentication & Authorization Flow (headline — full detail in §31)

```text
1. middleware.ts intercepts requests to /dashboard/*, /projects/*, /invoices/*, /settings/*,
   and /admin/* (§25)
2. Checks for a valid Auth.js session (database-backed, §23.2)
3. No session -> redirect to /login (with a return-to param)
4. Valid session, but role does not match the route's required role (client vs. admin, §31.4)
   -> redirect to the user's correct home (/dashboard for clients, /admin for team members)
5. Valid session + correct role -> request proceeds to the page/Route Handler, which performs
   any additional resource-level authorization (e.g., "does this client own this specific
   project ID?" — §31.5) before returning data
```

---

## 25. Repository Architecture

### 25.1 Full Repository Tree

```text
/
├── app/
│   ├── (marketing)/                 # public site route group — no auth required
│   │   ├── layout.tsx                # marketing nav + footer shell (§16.6)
│   │   ├── page.tsx                   # Homepage (§20.1)
│   │   ├── services/
│   │   │   ├── page.tsx                # Services overview (§20.2)
│   │   │   └── [slug]/page.tsx          # Individual service page (§20.3)
│   │   ├── work/
│   │   │   ├── page.tsx                # Portfolio (§20.4)
│   │   │   └── [slug]/page.tsx          # Case study detail (§20.5)
│   │   ├── about/page.tsx              # (§20.6)
│   │   ├── process/page.tsx            # (§20.7)
│   │   ├── pricing/page.tsx            # (§20.8)
│   │   ├── contact/page.tsx            # (§20.9)
│   │   ├── blog/
│   │   │   ├── page.tsx                # (§20.10)
│   │   │   └── [slug]/page.tsx          # (§20.11)
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── (portal)/                    # authenticated client route group
│   │   ├── layout.tsx                # auth guard + portal nav shell (§16.6, §24.4)
│   │   ├── dashboard/page.tsx          # (§20.14)
│   │   ├── projects/
│   │   │   ├── page.tsx                # (§20.15)
│   │   │   └── [id]/
│   │   │       ├── page.tsx             # (§20.16)
│   │   │       └── files/page.tsx        # (§20.17)
│   │   ├── invoices/
│   │   │   ├── page.tsx                # (§20.18 list)
│   │   │   └── [id]/page.tsx            # (§20.18 detail)
│   │   └── settings/page.tsx           # (§20.19)
│   ├── admin/                       # role-gated internal app (§18.3)
│   │   ├── layout.tsx                # admin-role auth guard + admin nav shell
│   │   ├── page.tsx                    # (§20.20)
│   │   ├── leads/page.tsx
│   │   ├── clients/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx            # internal project view (§32 vs §33 delta)
│   │   ├── proposals/page.tsx
│   │   ├── invoices/page.tsx
│   │   ├── content/                    # blog/case-study CMS (§23.2)
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── settings/page.tsx
│   ├── login/page.tsx                # (§20.12)
│   ├── signup/page.tsx                # (§20.13)
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # Auth.js handler (§31)
│   │   ├── leads/route.ts               # (§21.9, §30.3)
│   │   ├── projects/[id]/route.ts
│   │   ├── invoices/[id]/route.ts
│   │   └── webhooks/
│   │       ├── razorpay/route.ts         # (§35.4)
│   │       └── stripe/route.ts           # (Phase 2, §23.2)
│   ├── layout.tsx                    # root layout — fonts (§14.1), theme tokens (§13)
│   ├── not-found.tsx                  # (§20.21)
│   ├── error.tsx                       # (§20.22)
│   └── globals.css                      # token definitions (§13-15) + Tailwind directives
├── components/
│   ├── ui/                           # primitives (§16.1-16.4) — button.tsx, input.tsx, etc.
│   ├── marketing/                     # composite marketing components (§16.5) — hero.tsx, etc.
│   ├── portal/                         # portal-specific composites — project-timeline.tsx, etc.
│   └── admin/                           # admin-specific composites — lead-table.tsx, etc.
├── features/                         # business-logic modules, one folder per domain (§27.2)
│   ├── leads/                          # create-lead.ts, lead-notifications.ts
│   ├── projects/                        # state-machine transitions (§34), milestone logic
│   ├── invoices/                         # invoice generation, payment-status sync (§35)
│   ├── auth/                              # role/session helpers beyond raw Auth.js config
│   └── notifications/                      # notification dispatch logic (§37)
├── lib/                               # cross-cutting, framework-agnostic utilities (§27.3)
│   ├── db.ts                            # Prisma client singleton
│   ├── auth.ts                           # Auth.js configuration
│   ├── email.ts                           # Resend wrapper + react-email templates
│   ├── storage.ts                          # R2 client wrapper (§36)
│   ├── analytics.ts                         # Plausible event wrapper (§41)
│   ├── payments/
│   │   ├── razorpay.ts
│   │   └── stripe.ts
│   ├── utils.ts                              # class-merge helper, generic small utilities
│   └── validation/                            # shared Zod schemas (client + server, §27.5)
├── types/                              # shared TS types/DTOs not generated by Prisma
├── config/                              # site-nav config, package/pricing config (§21.3 source of truth), content-pillar config (§49.1)
├── public/                               # static assets, favicon, og-default.png
├── prisma/
│   ├── schema.prisma                       # (§29)
│   ├── migrations/
│   └── seed.ts                              # dev/staging seed data
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/                               # one-off maintenance/ops scripts (§45.7)
├── docs/
│   ├── PLAN.md                              # this document
│   └── adr/                                  # individual ADR files mirroring §59
├── .github/workflows/                        # CI pipelines (§44-45)
├── middleware.ts                              # auth/role route protection (§24.4)
├── tailwind.config.ts                          # token-to-utility mapping (§15.9)
├── next.config.js
├── package.json
├── tsconfig.json
└── .env.example
```

### 25.2 Why Route Groups, Not Separate Apps

`(marketing)`, `(portal)`, and `admin` are Next.js route groups within one app, not three separate deployed applications. This directly follows §23.2's "no separate backend service" reasoning applied to the frontend as well: three founders cannot maintain three deployment pipelines, three sets of shared-component duplication risk, and three places for the design system (§13-16) to drift out of sync. A single app with route-group-scoped layouts gets the organizational separation (different nav shells, different auth requirements) without the operational cost of separate deployments.

### 25.3 Why `features/` Is Separate From `components/`

`components/` holds presentation (how something looks and renders); `features/` holds business logic (what happens, what's allowed, how state transitions). This split exists so that business logic (e.g., the project state machine, §34) is testable and reasoned-about independently of any specific UI, and so that a page component's job stays legible: fetch/orchestrate via `features/`, render via `components/` — never both mixed inline in a page file for anything beyond trivial pages (§27.1 elaborates this rule with examples).

---

## 26. File-by-File Documentation

This section documents the files that carry real architectural weight — the ones a new engineer must understand correctly to avoid breaking the system's intent. Not every one of the ~150 files in the repository is listed (that would be a generated file index, not documentation); these are the files whose *reasoning* isn't obvious from the code alone.

### 26.1 `middleware.ts`

```text
PATH: /middleware.ts
WHY IT EXISTS: Auth/role route protection must run before a request reaches any page or Route
  Handler under /dashboard, /projects, /invoices, /settings, or /admin (§24.4) — Next.js
  Middleware is the only mechanism that runs at the edge, before rendering begins.
PRIMARY RESPONSIBILITY: Check session validity and role, redirect unauthenticated/unauthorized
  requests before any protected code runs.
SECONDARY RESPONSIBILITIES: None — kept deliberately minimal (see below).
WHAT BELONGS HERE: Route-matching logic, session-cookie presence/validity check, redirect logic.
WHAT DOES NOT BELONG HERE: Resource-level authorization (e.g., "does this client own project
  #123?") — middleware only knows the route pattern and the session, not the specific resource
  being requested; that check happens in the Route Handler/page itself (§24.4 step 5, §31.5).
  Business logic of any kind does not belong here.
DEPENDENCIES: lib/auth.ts (session-check helper).
USED BY: Every request matching the configured route patterns (Next.js runtime, not imported
  by application code).
DATA FLOW: Request -> middleware reads session cookie -> allow / redirect.
TESTING: Integration test hitting protected routes with no session, wrong-role session, and
  correct-role session, asserting the redirect/allow behavior (§43.2).
WHY THIS LOCATION: Next.js requires middleware.ts at the project root to be picked up by the
  framework's routing layer — not a stylistic choice.
ALTERNATIVES CONSIDERED: Per-page auth checks (a `getServerSideProps`-style guard in every
  page). REJECTED because it's easy to forget on a new page — a missed check silently exposes
  a route. Centralizing in middleware makes "protected by default" the structural default
  rather than something each new page must remember to opt into (§38 — security should not
  depend on every future contributor remembering a step).
```

### 26.2 `lib/db.ts`

```text
PATH: /lib/db.ts
WHY IT EXISTS: Prisma Client must be instantiated once and reused — in serverless environments,
  creating a new client per request exhausts database connections quickly.
PRIMARY RESPONSIBILITY: Export a single, memoized Prisma Client instance.
WHAT BELONGS HERE: Client instantiation, connection-pooling configuration.
WHAT DOES NOT BELONG HERE: Any actual queries — this file exports the client, it never contains
  a `.findMany()` or similar call itself; queries live in `features/*` (§27.4).
DEPENDENCIES: @prisma/client, prisma/schema.prisma (generated types).
USED BY: Every file under features/*/  that touches the database.
DATA FLOW: N/A (provides the connection, not a data flow itself).
TESTING: Not directly unit-tested (it's configuration); covered implicitly by any integration
  test that hits the database (§43.2).
WHY THIS LOCATION: `lib/` is for cross-cutting infrastructure utilities with no business meaning
  of their own (§25.1) — a database connection is infrastructure, not a feature.
ALTERNATIVES CONSIDERED: Instantiating Prisma Client inline wherever needed. REJECTED —
  guaranteed to eventually cause connection-exhaustion bugs in serverless deployment (§23.2's
  hosting choice makes this a real, not theoretical, risk).
```

### 26.3 `lib/validation/lead.ts`

```text
PATH: /lib/validation/lead.ts
WHY IT EXISTS: The Contact form (§21.9) needs identical validation rules on the client (fast
  feedback) and server (authoritative — §38.4 "client validation is never trusted alone").
  Defining the rule once and importing it in both places is the only way to guarantee they
  can't drift apart.
PRIMARY RESPONSIBILITY: Export a Zod schema describing valid lead-submission input.
WHAT BELONGS HERE: Field types, constraints (§21.9's validation rules), and derived TypeScript
  types (`z.infer<typeof leadSchema>`).
WHAT DOES NOT BELONG HERE: Anything about what happens AFTER validation succeeds (that's
  features/leads/create-lead.ts, §26.4) — this file only answers "is this input shaped
  correctly," not "what do we do with it."
DEPENDENCIES: zod.
USED BY: components/marketing/contact-form.tsx (client-side validation), app/api/leads/route.ts
  (server-side, authoritative validation, §26.5).
DATA FLOW: Raw form input -> schema.safeParse() -> typed, validated data or field-level errors.
TESTING: Unit tests asserting valid input passes, each invalid case (missing required field,
  malformed email, out-of-enum select value) fails with the expected error path (§43.1).
WHY THIS LOCATION: `lib/validation/` groups all shared Zod schemas so any developer knows where
  to look for "what does the server consider valid input" across every form in the app (§27.5).
ALTERNATIVES CONSIDERED: Defining validation separately in the form component and the API
  route. REJECTED — this is precisely the drift risk described in §00.4 (dependent logic must
  be updated together), and doing so manually in two places is exactly the kind of manual
  synchronization this document repeatedly avoids in favor of structural enforcement (§13.1,
  §21.3, §22.9 all make the same architectural argument for their respective domains).
```

### 26.4 `features/leads/create-lead.ts`

```text
PATH: /features/leads/create-lead.ts
WHY IT EXISTS: "Submitting a lead" is a business operation with multiple steps (persist, notify
  founders, send acknowledgment) that must happen together and is meaningful independent of
  the HTTP request that triggers it (§24.3's request-flow trace, step 4).
PRIMARY RESPONSIBILITY: Orchestrate the full lead-creation operation.
WHAT BELONGS HERE: Calling the Prisma insert, calling the notification dispatch (§37), any
  business rule about lead creation (e.g., future rate-limiting-by-email logic if ever added).
WHAT DOES NOT BELONG HERE: HTTP concerns (status codes, request parsing) — those belong in the
  Route Handler that calls this function (§26.5); this function is framework-agnostic and could
  be called from a script or a future non-HTTP trigger without modification.
DEPENDENCIES: lib/db.ts, lib/validation/lead.ts (for the inferred type, not re-validation —
  validation already happened in the Route Handler before this function is called), 
  features/notifications/dispatch.ts.
USED BY: app/api/leads/route.ts.
DATA FLOW: Validated lead data in -> DB row created -> notification dispatched -> created lead
  record returned.
TESTING: Integration test against a test database — asserts a row is created and the
  notification dispatcher is called with correct arguments (mocked at the dispatch boundary,
  §43.2).
WHY THIS LOCATION: features/ groups business logic by domain (§25.3) — this is the "leads"
  domain's core write operation.
ALTERNATIVES CONSIDERED: Writing this logic directly inside the Route Handler. REJECTED for
  anything beyond the most trivial operations — it becomes untestable without spinning up an
  HTTP request/response cycle, and it can't be reused if a second entry point (e.g., a future
  admin-side "manually add a lead" action) needs the same operation (§27.2).
```

### 26.5 `app/api/leads/route.ts`

```text
PATH: /app/api/leads/route.ts
WHY IT EXISTS: The Contact form (§21.9) needs a POST endpoint (§30.3).
PRIMARY RESPONSIBILITY: Parse the incoming request, validate it (lib/validation/lead.ts),
  call features/leads/create-lead.ts, translate the result into an HTTP response.
WHAT BELONGS HERE: Request parsing, calling validation, calling the feature function, HTTP
  status/response shaping, rate-limit check (§21.9's spam-prevention, §30.5).
WHAT DOES NOT BELONG HERE: Business logic (delegated to features/leads/, §26.4) and validation
  rules themselves (delegated to lib/validation/, §26.3) — this file is intentionally thin,
  a translation layer between HTTP and business logic.
DEPENDENCIES: lib/validation/lead.ts, features/leads/create-lead.ts.
USED BY: The Contact form's client-side fetch call (components/marketing/contact-form.tsx).
DATA FLOW: HTTP POST body -> validate -> create-lead.ts -> HTTP response (201 + created lead
  summary, or 400 + field errors).
TESTING: Integration test posting valid/invalid payloads, asserting correct status codes and
  response shape (§43.2); honeypot-field submission asserted to return a 200 without actually
  creating a record (§21.9's spam-prevention behavior).
WHY THIS LOCATION: Next.js App Router convention — Route Handlers live under app/api/ (§25.1).
ALTERNATIVES CONSIDERED: A Server Action instead of a Route Handler. Server Actions were
  considered for this specific form since Next.js supports both; a Route Handler was chosen
  instead because the Contact form is public/unauthenticated and benefits from being a
  conventional, directly-testable HTTP endpoint with an explicit rate-limit layer (§30.5) —
  Server Actions are used elsewhere in the portal/admin (§27.4) where the caller is always an
  authenticated React client, a case where their tighter framework integration is a net benefit
  instead of an added layer of indirection.
```

### 26.6 `features/projects/state-machine.ts`

```text
PATH: /features/projects/state-machine.ts
WHY IT EXISTS: The project pipeline (§34) is a formal state machine — encoding valid states and
  valid transitions in one explicit place prevents an invalid transition (e.g., "Delivered"
  jumping back to "Proposal") from ever being possible in code, not just in process documentation.
PRIMARY RESPONSIBILITY: Define the enumerated states, the map of valid transitions per state,
  and a `transition(project, toState, actor)` function that throws if a transition is invalid.
WHAT BELONGS HERE: State/transition definitions, transition-guard logic (e.g., "cannot move to
  DELIVERED unless the QA checklist, §46, is complete").
WHAT DOES NOT BELONG HERE: UI rendering of the state (that's components/portal/project-timeline.tsx
  and components/admin/*, which read the current state but don't decide what's next).
DEPENDENCIES: types/project.ts (state enum type).
USED BY: Every Route Handler/Server Action that changes a project's state (admin project actions,
  §33; portal approval actions, §32.4).
DATA FLOW: Current state + requested transition + actor role -> validated new state or a thrown
  error with a client-safe message.
TESTING: Unit tests enumerating every valid and invalid transition pair (§43.1) — this file's
  correctness is high-leverage (a bug here could let a project skip QA, §46), so its test
  coverage is treated as non-negotiable, unlike more generic utility files.
WHY THIS LOCATION: features/projects/ — this is the projects domain's central business rule.
ALTERNATIVES CONSIDERED: Enforcing valid transitions only via admin-UI dropdown options (i.e.,
  just don't show invalid options in the UI). REJECTED — a UI-only constraint doesn't protect
  the Route Handler/API layer itself; per §00.7's Source of Truth Hierarchy, security/data-
  integrity (ranked above developer convenience) requires the guarantee to live server-side.
```

### 26.7 `config/packages.ts`

```text
PATH: /config/packages.ts
WHY IT EXISTS: §21.3 requires that service-page deliverables and pricing-page package details
  come from one source of truth, not independently maintained marketing copy — this file IS
  that source of truth.
PRIMARY RESPONSIBILITY: Export the structured definition of every package (§08) — tier name,
  price, included/excluded items, revision limits.
WHAT BELONGS HERE: Structured package data only.
WHAT DOES NOT BELONG HERE: Long-form marketing prose (taglines, hero copy) — this file holds
  the factual/structural data that must stay consistent (price, inclusions), not the persuasive
  copy around it, which can vary by page without creating a consistency risk.
DEPENDENCIES: None (pure data).
USED BY: app/(marketing)/pricing/page.tsx, app/(marketing)/services/[slug]/page.tsx, and the
  Pricing Card / Service Card components (§16.5).
DATA FLOW: Static import -> rendered directly into the relevant pages at build time.
TESTING: A schema/shape test (§43.1) ensuring every package entry has all required fields
  (price, inclusions, exclusions) — prevents a content-entry mistake (e.g., a forgotten
  exclusions list) from silently shipping, directly enforcing §08.5.
WHY THIS LOCATION: config/ holds structured, mostly-static configuration data that isn't user-
  editable-at-runtime content (contrast with the CMS content in admin/content, §23.2, which IS
  runtime-editable) — packages change rarely enough that a code change + deploy (§44) is the
  right update mechanism, not a database-backed admin UI.
ALTERNATIVES CONSIDERED: Storing packages in the database, editable via the admin CMS.
  REJECTED for V1 — package changes are rare, deliberate, founder-level pricing decisions
  (§09.3), not frequent content edits; a code-reviewed, git-tracked change (§45.1) is a more
  appropriate control for pricing changes than an unreviewed admin-UI edit would be. OPEN
  DECISION: revisit if package configuration needs to change frequently enough that the
  deploy-per-change cost becomes a real friction point.
```

### 26.8 `prisma/schema.prisma`

```text
PATH: /prisma/schema.prisma
WHY IT EXISTS: The single source of truth for the database schema (§29) — Prisma generates
  both the actual SQL migrations and the TypeScript types from this one file.
PRIMARY RESPONSIBILITY: Define every table, column, relationship, and index.
WHAT BELONGS HERE: Schema definition only.
WHAT DOES NOT BELONG HERE: Seed data (prisma/seed.ts, separate file) or query logic
  (features/*, §26.4).
DEPENDENCIES: None.
USED BY: Every file that imports the Prisma Client's generated types (effectively all of
  features/*).
DATA FLOW: Schema change -> `prisma migrate dev` generates a migration file (§29.7) -> applied
  to the database -> types regenerated -> TypeScript compiler surfaces any now-incompatible code.
TESTING: Migrations are tested by applying them to a disposable test database in CI (§43.3,
  §45.5) before being trusted against staging/production.
WHY THIS LOCATION: Prisma's tooling convention requires this file at prisma/schema.prisma.
ALTERNATIVES CONSIDERED: Hand-written SQL migrations with a separate manually-maintained types
  file. REJECTED — manually keeping types in sync with schema is exactly the kind of manual-
  synchronization risk this document structurally avoids elsewhere (§26.3, §21.3).
```

### 26.9 `components/ui/button.tsx`

```text
PATH: /components/ui/button.tsx
WHY IT EXISTS: Button is used dozens of times across the site/portal/admin (§16.1) — one
  implementation prevents dozens of near-duplicate, slightly-inconsistent button implementations.
PRIMARY RESPONSIBILITY: Render the Button component per the full spec in §16.1 (variants,
  states, sizing, contrast rule for the primary variant).
WHAT BELONGS HERE: Variant/size styling (via a class-variance-authority or equivalent variant
  helper), loading-state logic, disabled-state handling, forwarding refs/props correctly.
WHAT DOES NOT BELONG HERE: Any business logic about what a specific button click DOES —
  Button never knows or cares whether its onClick submits a lead or deletes a project; that
  logic is supplied by whatever page/component renders it.
DEPENDENCIES: lib/utils.ts (class-merge helper), design tokens via Tailwind classes (§15.9).
USED BY: Nearly every page and composite component in the codebase.
DATA FLOW: N/A (presentational component).
TESTING: Renders each variant/size/state without error; loading state disables interaction and
  exposes `aria-busy`; keyboard activation (Enter/Space) fires onClick (§43.1, §16.0's a11y
  baseline).
WHY THIS LOCATION: components/ui/ per §25.1 — a primitive, not a composite or feature-specific
  component.
ALTERNATIVES CONSIDERED: Using a pre-built button component from a full component library
  (e.g., MUI Button) instead of a custom one. REJECTED — see §16.7's broader reasoning: a
  pre-styled library component fights the custom token system rather than consuming it cleanly.
```

### 26.10 What Should NOT Exist (files/patterns explicitly prohibited)

| DO NOT CREATE | Reason |
|---|---|
| `store/` (Redux or similar global state store) | No cross-cutting client state complex enough to justify it — Server Components + React state + URL state cover the portal/admin's actual needs (§27.6 elaborates). Adding Redux "for scale" before there's state complexity that needs it is the exact anti-pattern §02.7/§64 prohibit |
| `utils/index.ts` or `helpers/index.ts` as a catch-all grab-bag | A single unstructured dumping ground for unrelated functions becomes unmaintainable and undiscoverable within months — `lib/` is organized by what each file actually does (§25.1), never a generic "misc" file |
| `services/` folder duplicating `features/` | Would create two competing places for business logic with no clear rule for which one to use — see §27.2 for why `features/` alone is the single answer |
| A generic `api-client.ts` wrapping every possible fetch call in a bespoke abstraction | Next.js Server Components/Actions already remove most client-side data-fetching boilerplate (§24.1) — building a generic API-client abstraction on top solves a problem this architecture doesn't have (§26.5's "why not a Server Action" note explains the one deliberate exception) |
| Per-component CSS/SCSS files (`button.module.css` alongside `button.tsx`) | Tailwind (§23.2) is the styling system — a parallel CSS-file-per-component system would mean two ways to style anything, undermining the single-token-source reasoning in §13.1 |
| A `constants.ts` file mixing unrelated global constants (feature flags, copy strings, business-rule numbers) | Each of those belongs in a domain-appropriate location instead (feature flags in config/, package pricing in config/packages.ts per §26.7, business-rule numbers colocated with the logic that uses them, e.g. §26.6's state machine) — a single undifferentiated constants file is the same "grab-bag" anti-pattern as the utils/ entry above |

---

## 27. Code Organization

### 27.1 Component Architecture

Page files (`app/**/page.tsx`) are orchestration-only: fetch/derive data (via `features/`), compose components (from `components/`), and contain minimal inline logic — a page file that grows past roughly 60-80 lines of logic (excluding JSX composition) is a signal that logic should move into `features/` (§27.2). This is a guideline enforced by code review (§45.3), not a hard lint rule, because the right threshold varies by page complexity.

### 27.2 Feature Architecture

Each folder under `features/` represents one business domain (leads, projects, invoices, auth, notifications — §25.1) and contains: the orchestration functions (like §26.4's `create-lead.ts`), domain-specific business rules (like §26.6's state machine), and domain-specific types where they're not shared broadly enough to warrant `types/`. A feature folder is the answer to "where does the logic for X domain live" — there is deliberately no second competing location (§26.10's prohibition on a parallel `services/` folder).

### 27.3 Business Logic Placement Rule

```text
Is it "what does the UI look like"?              -> components/
Is it "what happens / what's allowed / how does state change"?  -> features/
Is it infrastructure with no business meaning of its own (DB connection, email client,
  storage client)?                                -> lib/
Is it a pure, stateless, reusable-across-domains helper (e.g., a date formatter)?  -> lib/utils.ts
  or a small dedicated lib/ file if it grows beyond a few related functions
```

### 27.4 Data Access

All database access goes through Prisma Client (`lib/db.ts`, §26.2), called only from `features/*` files — page components and Route Handlers never import `lib/db.ts` directly. This keeps data-access logic testable and centrally located per domain (§27.2), and means a future data-access change (e.g., adding a caching layer) touches `features/*` in one place per domain rather than being scattered across every page that happens to need that data.

### 27.5 API & Validation

Every externally-provided input (form submissions, API request bodies) is validated with a Zod schema from `lib/validation/` (§26.3's pattern, applied consistently) before it reaches any `features/*` function — `features/*` functions are written assuming their input is already valid and typed, keeping business logic free of defensive re-validation clutter.

### 27.6 State Management

- **Server state** (data from the database) is fetched in Server Components wherever possible (Next.js App Router default) — no client-side global store duplicating server data.
- **Local UI state** (a dropdown's open/closed state, a form's in-progress values) uses plain React `useState`/`useReducer`, colocated with the component that owns it.
- **Cross-component client state that genuinely needs to be shared** (rare — e.g., a multi-step proposal-builder wizard in the admin, §33) uses React Context scoped to that specific feature, not a global store — see §26.10 for why a global store (Redux etc.) is not introduced.
- **Server-derived form state** (e.g., "which fields failed validation") is handled via React Hook Form (§16.1) plus the Server Action/Route Handler's returned error shape, not duplicated into a separate client store.

### 27.7 Types

Types generated by Prisma (from `prisma/schema.prisma`, §26.8) are the source of truth for database-shaped data and are re-exported (not redefined) from `types/` where a friendlier public name is useful. Types with no database representation (e.g., a form's validated-input type, derived via `z.infer`, §26.3) live alongside their Zod schema in `lib/validation/`, not duplicated separately in `types/`.

### 27.8 Utilities

A function belongs in `lib/utils.ts` only if it is pure, has no business meaning, and is used in 2+ unrelated places — a function used once stays inline where it's used (§64 — "utilities used once" are explicitly listed as unnecessary abstraction).

### 27.9 Configuration & Environment Variables

- Static, code-level configuration (package data, nav structure, content-pillar list) lives in `config/` (§25.1, §26.7).
- Secrets and environment-specific values (database URL, API keys for Razorpay/Resend/Sentry/etc.) are read from environment variables, validated at startup via a single `lib/env.ts` schema (a Zod schema describing every required env var) so a missing/malformed environment variable fails fast at boot rather than causing a confusing runtime error deep in a request handler.
- `.env.example` documents every required variable with a placeholder value and a one-line comment on what it's for — kept in sync manually as a checklist item in the PR template (§45.3) whenever a new env var is introduced.

---

## 28. Coding Standards

### 28.1 Naming

- Files: `kebab-case.tsx` for components, `kebab-case.ts` for other modules.
- Components: `PascalCase` for the exported component name, matching common React convention.
- Functions/variables: `camelCase`.
- Types/interfaces: `PascalCase`, no `I` prefix (e.g., `Project`, not `IProject`) — the prefix adds no information TypeScript's tooling doesn't already surface.
- Booleans: prefixed `is`/`has`/`can` (`isLoading`, `hasError`, `canEdit`) for immediate readability at call sites.

### 28.2 Imports & Exports

- Named exports by default; a default export is used only for page/layout files (Next.js convention requires it) and single-purpose files where a default clearly reads better (e.g., a component file exporting exactly one component).
- Absolute imports via a configured `@/` path alias (e.g., `@/components/ui/button`) instead of relative `../../../` chains — configured once in `tsconfig.json`, removes a whole class of fragile-relative-path errors when files move.

### 28.3 Functions & Components

- Components are function components using hooks — no class components (no requirement in this codebase needs the class-component lifecycle model, and mixing both patterns would add cognitive overhead for no benefit).
- A function does one job; if a function's name needs "and" to describe it accurately, it should usually be two functions.

### 28.4 Hooks

Custom hooks live either colocated with the single component that uses them (if used once — consistent with §27.8's "no premature abstraction" rule applied to hooks specifically) or in a `hooks/` subfolder within the relevant `features/` domain if shared across that domain's components. No single project-wide `hooks/` grab-bag folder, for the same reason `utils/index.ts` is prohibited (§26.10).

### 28.5 Types

`strict` mode is enabled in `tsconfig.json` (§23.2). `any` is disallowed by lint rule except in narrowly justified, commented exceptions (e.g., typing a third-party library's untyped callback) — an `any` without a comment explaining why it's unavoidable fails code review (§45.3).

### 28.6 Errors

- Expected, handleable errors (validation failure, not-found) are returned as typed result values or thrown as a small set of custom error classes (`ValidationError`, `NotFoundError`, `AuthorizationError`) that Route Handlers catch and translate to the correct HTTP status — never a generic `throw new Error("something went wrong")` with no machine-distinguishable type.
- Unexpected errors (genuine bugs, third-party outages) are allowed to propagate to the nearest error boundary (`app/error.tsx`, §20.22) or Route Handler catch-all, which logs to Sentry (§23.2) and returns a generic, safe message to the client (§38 — never leak internals in an error response).

### 28.7 Async Handling

`async`/`await` throughout — no raw `.then()` chains, for consistent readability and consistent error-handling via `try`/`catch`. Every `await` that can realistically fail (any network/DB call) is wrapped in error handling at the appropriate layer (§28.6), not left to bubble unhandled.

### 28.8 Comments & Documentation

Comments explain **why**, not **what** — code should be legible enough that a comment restating what a line does is unnecessary; a comment is warranted specifically when a decision isn't obvious from the code alone (e.g., §26.5's comment-worthy "why a Route Handler and not a Server Action here" reasoning). This mirrors this entire document's philosophy (§00, "maximum useful clarity") applied at the code-comment level.

### 28.9 Logging

Server-side logs use structured logging (a consistent `{ level, message, context }` shape) rather than free-text `console.log`, so logs are filterable/searchable once volume grows beyond what a human can read line-by-line. No `console.log` left in committed code outside of scripts (`scripts/`, §25.1) — caught by lint rule (§45.3's CI checks).

---

## 29. Database

### 29.1 Design Principles

- Every table exists because a named page, feature, or business process in §01-§28 needs it — none are speculative (§02.7, §26.10).
- Normalized to 3NF by default; the only deliberate denormalization is noted explicitly where it occurs (§29.4, `Lead.convertedClientId` — a convenience pointer, not duplicated data).
- Soft-delete (a nullable `deletedAt` timestamp) is used for business records with retention/audit requirements (invoices, clients, projects); hard delete is used only where retention has no business or legal value (e.g., expired sessions) — see §29.13 for the full lifecycle policy.

### 29.2 Entity Relationship Overview

```text
User ──< belongs to (nullable) >── Client ──< has many >── Project ──< has many >── Milestone
  │                                    │                        │                       │
  │                                    │                        ├─< has many >── File    │
  │                                    │                        ├─< has many >── Comment  │
  │                                    ├─< has many >── Invoice ─┘ (Invoice can link to    │
  │                                    │        └─< has many >── InvoiceLineItem  Project) │
  │                                    ├─< has many >── Retainer                            │
  │                                    └─< has many >── Testimonial                          │
  ├─< has many >── Notification
  ├─< has many >── Session, Account (Auth.js)
  └─< creates >── ContentPost, CaseStudy (as author, TEAM role only)

Lead ──(on conversion)──> Client
Proposal ──belongs to── Lead or Client
CaseStudy ──optionally links── Testimonial, Client
AuditLog ──references── any entity (polymorphic, append-only)
```

### 29.3 Auth.js Standard Tables

`User` (extended with Forge-specific fields, §29.5), `Account`, `Session`, `VerificationToken` — schema and purpose defined by the Auth.js Prisma adapter convention (§23.2); not redesigned custom, specifically so upstream Auth.js updates remain compatible without manual schema reconciliation.

### 29.4 `Lead`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| name | text | not null |
| email | text | not null |
| company | text | nullable |
| service | enum(ServiceType) | not null |
| budgetRange | enum(BudgetRange) | not null |
| timeline | enum(TimelineUrgency) | not null |
| message | text | nullable |
| status | enum(LeadStatus: NEW, CONTACTED, QUALIFIED, DISQUALIFIED, CONVERTED) | not null, default NEW |
| convertedClientId | uuid | FK -> Client.id, nullable |
| createdAt | timestamptz | not null, default now() |

*Indexes:* `status` (admin pipeline filtering, §33), `createdAt` (recency sort). *Relationships:* optionally converts to one `Client`. *Lifecycle:* created via §21.9's Contact form or manually by a founder (§46); moves through `LeadStatus` per §34; disqualified leads are retained (not deleted) for pipeline-conversion-rate reporting (§51). *Privacy:* contains PII (name, email) — subject to the retention policy in §29.13 and §38.9. *Deletion behavior:* soft-delete only on explicit request (e.g., a GDPR-style erasure request from an international lead, §52.5) — PROFESSIONAL REVIEW REQUIRED on exact retention/erasure obligations once international clients (§06, S6) are active.

### 29.5 `User` (extended)

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| email | text | unique, not null |
| passwordHash | text | nullable (nullable to allow future OAuth providers without a password) |
| name | text | not null |
| phone | text | nullable |
| role | enum(UserRole: CLIENT, TEAM) | not null |
| clientId | uuid | FK -> Client.id, nullable (set only when role=CLIENT) |
| emailVerifiedAt | timestamptz | nullable |
| createdAt / updatedAt | timestamptz | not null |

*Constraint (application-level, enforced in `features/auth/`, not expressible as a raw SQL constraint):* `clientId` must be non-null when `role = CLIENT` and null when `role = TEAM` — validated in the user-creation feature function (§27.2) rather than the schema, since Prisma/Postgres can't cleanly express a conditional-nullability constraint. *Indexes:* `email` (unique, login lookup), `clientId`. *Lifecycle:* TEAM users created via a seed/admin process (§55, Week 1 — the 3 founders); CLIENT users created via the invite flow at proposal-acceptance (§31.2, §34). *Privacy:* PII — §38.9. *Deletion:* soft-delete; a deleted user's historical Comments/Files remain (attributed to "former user") for project-record integrity rather than being deleted, which would corrupt project history other parties still need (§29.13).

### 29.6 `Client`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| companyName | text | not null |
| industry | text | nullable |
| source | enum(AcquisitionSource: REFERRAL, OUTREACH, INBOUND, PARTNER) | not null |
| notes | text | nullable (internal-only, never exposed via the client-facing portal API, §30.6) |
| createdAt | timestamptz | not null |

*Relationships:* has many `User` (contacts), `Project`, `Invoice`, `Retainer`, `Testimonial`. *Lifecycle:* created when a Lead converts (§29.4) or directly by a founder for a referral-sourced client with no prior Lead record. *Privacy:* `notes` is internal-only — a concrete example of §31.5's resource-level authorization (a Client row is readable by its own Users, but specific columns are further restricted even within that access). *Deletion:* soft-delete only — a Client with any Project/Invoice history is never hard-deleted (§52's contract/invoice retention obligations, PROFESSIONAL REVIEW REQUIRED).

### 29.7 `Project`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| clientId | uuid | FK -> Client.id, not null |
| name | text | not null |
| serviceType | enum(ServiceType) | not null |
| packageTier | enum(PackageTier: STARTER, GROWTH, PREMIUM, CUSTOM) | not null |
| state | enum(ProjectState) | not null, default LEAD (see §34 for the full enum) |
| founderOwnerId | uuid | FK -> User.id (role=TEAM), not null |
| startDate | date | nullable |
| targetDeliveryDate | date | nullable |
| createdAt / updatedAt | timestamptz | not null |

*Indexes:* `clientId`, `state` (admin pipeline view, §33), `founderOwnerId` (WIP-per-founder view, §20.20). *Relationships:* has many `Milestone`, `File`, `Comment`; optionally linked from `Invoice`. *Lifecycle:* the full state machine is §34 — this column is the canonical, single source of project status referenced by both the client portal (§32) and admin (§33) views, so they can never disagree about status (a direct structural fix for §03.1's C2 problem). *Deletion:* soft-delete only, for the same retention reasoning as Client.

### 29.8 `Milestone`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| projectId | uuid | FK -> Project.id, not null |
| name | text | not null |
| description | text | nullable |
| order | integer | not null |
| status | enum(MilestoneStatus: UPCOMING, IN_PROGRESS, AWAITING_APPROVAL, APPROVED, DELIVERED) | not null, default UPCOMING |
| dueDate | date | nullable |
| completedAt | timestamptz | nullable |

*Indexes:* `projectId, order` (composite, ordered milestone rendering). *Relationships:* has many `File`, `Comment` (both optionally scoped to a specific milestone). *Lifecycle:* created from a package-tier template at project kickoff (§34), individually progressed by the founder team; the client-facing "current action" panel (§20.16) is derived directly from the first non-APPROVED/DELIVERED milestone in `order`. *Deletion:* hard-delete only allowed pre-kickoff (a template correction); never deleted once any File/Comment references it.

### 29.9 `File`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| projectId | uuid | FK -> Project.id, not null |
| milestoneId | uuid | FK -> Milestone.id, nullable |
| uploadedByUserId | uuid | FK -> User.id, not null |
| name | text | not null |
| storageKey | text | not null (R2 object key, §36) |
| size | integer | not null (bytes) |
| mimeType | text | not null |
| version | integer | not null, default 1 |
| supersedesFileId | uuid | FK -> File.id (self-relation), nullable |
| createdAt | timestamptz | not null |

*Indexes:* `projectId`, `milestoneId`. *Relationships:* self-referential version chain via `supersedesFileId` (§36.4). *Lifecycle/Privacy:* the row is metadata only — actual bytes live in R2 (§23.2), access-controlled via signed URLs (§36.3), never served through a public/unauthenticated path. *Deletion:* soft-delete on the row; underlying R2 object retained per the backup policy (§36.7) even after a row is soft-deleted, in case of accidental-deletion recovery within a bounded window (30 days, ASSUMPTION).

### 29.10 `Comment`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| projectId | uuid | FK -> Project.id, not null |
| milestoneId | uuid | FK -> Milestone.id, nullable |
| authorUserId | uuid | FK -> User.id, not null |
| body | text | not null |
| createdAt | timestamptz | not null |

*Indexes:* `projectId, createdAt`. *Lifecycle:* always project-scoped, never a general/direct-message thread (§32.5's deliberate scope limitation, §64). *Privacy:* visible to the project's Client-role Users and any TEAM-role user (internal team sees all client threads — no separate "internal-only" comment flag in V1, kept simple per §02.7; if internal-only notes are needed they go in `Client.notes` or a future dedicated field, not overloaded onto this table).

### 29.11 `Invoice` & `InvoiceLineItem`

| Table | Key Columns | Notes |
|---|---|---|
| `Invoice` | id, clientId (FK), projectId (FK, nullable — retainer invoices aren't tied to one project), number (human-readable, sequential), amountTotal, currency, status (enum: DRAFT, SENT, PAID, OVERDUE, CANCELLED), dueDate, paidAt, razorpayOrderId, razorpayPaymentId | `razorpayOrderId`/`razorpayPaymentId` are references only — no card/bank details are ever stored (§35.2, §38.6) |
| `InvoiceLineItem` | id, invoiceId (FK), description, quantity, unitAmount | Line items make the invoice PDF (§35.3) and portal detail view (§20.18) render from structured data rather than a pre-rendered blob |

*Lifecycle:* full detail in §35. *Deletion:* invoices are never hard-deleted once `SENT` (financial/legal record, PROFESSIONAL REVIEW REQUIRED for exact retention period per §52).

### 29.12 Remaining Tables (summarized — full column lists follow the same pattern as above)

| Table | Purpose | Key relationships |
|---|---|---|
| `Retainer` | Tracks an active recurring engagement (§08.3-08.4, §10) | belongs to Client; generates monthly `Invoice` rows via a scheduled job (§45.6) |
| `Proposal` | Tracks a sent proposal pre-conversion (§34) | belongs to Lead or Client; on acceptance, creates/links a Project |
| `Notification` | In-app notification records (§37) | belongs to User; `type` + `payload` (jsonb) drive rendering, avoiding a rigid column-per-notification-type schema for a still-evolving notification set |
| `ContentPost` | Blog posts (§22.9, §49) | authored by a TEAM User; includes SEO fields (§22.2) as first-class columns, not an afterthought |
| `CaseStudy` | Portfolio case studies (§20.5) | optionally linked to Client and Testimonial |
| `Testimonial` | Client quotes (§21.6) | belongs to Client; `approvedAt` timestamp records the client's explicit consent (§21.6) |
| `AuditLog` | Append-only record of sensitive actions (role changes, invoice edits, project state changes) | polymorphic reference (`entityType` + `entityId`) — exists specifically for §38.10 (audit logging), never updated or deleted |

### 29.13 Data Lifecycle & Retention Policy (cross-table summary)

| Data category | Retention approach | Reasoning |
|---|---|---|
| Business/financial records (Invoice, Project, Client) | Soft-delete, retained indefinitely by default | Legal/audit value (PROFESSIONAL REVIEW REQUIRED for a hard retention-period policy) |
| Communication (Comment) | Retained with the Project (soft-deleted together) | Project history integrity — a partial comment thread is worse than a fully retained or fully removed one |
| Disqualified/stale Leads | Retained, soft-deletable on request | Pipeline-conversion-rate reporting value (§51) outweighs storage cost at this data volume |
| Sessions/VerificationTokens | Hard-deleted on expiry (scheduled cleanup, §45.6) | No retention value once expired — a pure security-hygiene case for hard deletion (§38) |
| Files (object storage) | Soft-deleted row, object retained 30 days then purged (ASSUMPTION) | Balances accidental-deletion recovery against storage cost (§36.7) |

### 29.14 Why Not Denormalize For Read Performance (yet)

No table in this schema is denormalized for query-performance reasons — at Forge's expected Year-1 data volume (dozens of clients, hundreds of projects/invoices at most), normalized joins via Prisma are not a performance risk (§39.6 covers the actual, different performance priorities: images, fonts, JS bundle size — not database query shape at this scale). Denormalization before there's a measured performance problem would be optimizing for a load the system doesn't have, the same anti-pattern §02.3/§64 prohibit elsewhere.

---

## 30. API

### 30.1 API Design Principles

The API (Route Handlers + Server Actions, §23.2) is **internal-only** — it serves the marketing site's forms, the client portal, and the admin app. It is explicitly not a public/versioned product API (§18.4 — no public API docs page exists). This means: no API versioning scheme is needed yet (breaking changes are coordinated with the single frontend that consumes them, in the same repo, same deploy), and authentication is always session-based (§31), never API-key-based.

### 30.2 Validation Convention (applies to every endpoint below)

Every endpoint validates its input against a Zod schema from `lib/validation/` (§26.3, §27.5) before any business logic runs. Invalid input always returns `400` with field-level error detail; this is not restated per-endpoint below.

### 30.3 Endpoint Reference

| Method & Route | Auth | Authorization | Input | Business Logic (delegates to) | Output | Rate Limit |
|---|---|---|---|---|---|---|
| `POST /api/leads` | None (public) | None | Contact form fields (§21.9) | `features/leads/create-lead.ts` | 201 + lead id | 5 req/hour/IP (§30.5) |
| `POST /api/auth/[...nextauth]` | Auth.js-managed | N/A | Credentials (email/password) | Auth.js internal | Session cookie set | Auth.js built-in throttling |
| `GET /api/projects` | Session required | CLIENT: own projects only; TEAM: all | Query filters (state, optional) | `features/projects/list.ts` | Project[] (client-facing shape, §30.6) | Standard authenticated rate limit (§30.5) |
| `GET /api/projects/[id]` | Session required | CLIENT: only if `project.clientId === session.user.clientId`; TEAM: any | — | `features/projects/get.ts` | Project detail incl. Milestones | — |
| `PATCH /api/projects/[id]` | Session required | TEAM only (clients never directly edit project state — they approve via a dedicated action below) | Partial project fields | `features/projects/update.ts` | Updated Project | — |
| `POST /api/projects/[id]/milestones/[milestoneId]/approve` | Session required | CLIENT: only own project, only if milestone.status = AWAITING_APPROVAL | Optional approval comment | `features/projects/state-machine.ts` (§26.6) via `features/projects/approve-milestone.ts` | Updated Milestone + triggers notification (§37) | — |
| `POST /api/projects/[id]/comments` | Session required | CLIENT: own project; TEAM: any | Comment body | `features/projects/add-comment.ts` | Created Comment | — |
| `POST /api/projects/[id]/files` | Session required | CLIENT: own project, only if upload-permitted stage (§36.3); TEAM: any | Multipart file upload | `features/files/upload.ts` | File metadata + signed download URL | Per-file size limit enforced (§36.2) |
| `GET /api/invoices` | Session required | CLIENT: own; TEAM: all | — | `features/invoices/list.ts` | Invoice[] | — |
| `GET /api/invoices/[id]` | Session required | CLIENT: own only; TEAM: any | — | `features/invoices/get.ts` | Invoice detail + line items | — |
| `POST /api/invoices/[id]/pay` | Session required | CLIENT: own only | — | `features/invoices/initiate-payment.ts` | Razorpay order/session details (§35.4) | — |
| `POST /api/webhooks/razorpay` | Razorpay signature verification (not session-based, §30.4) | N/A | Razorpay webhook payload | `features/invoices/handle-payment-webhook.ts` | 200 ack | N/A (verified by signature, not rate-limited the same way) |
| `POST /api/admin/proposals` | Session required | TEAM only | Proposal fields | `features/proposals/create.ts` | Created Proposal | — |
| `POST /api/admin/proposals/[id]/send` | Session required | TEAM only | — | `features/proposals/send.ts` (triggers §37 email) | Updated Proposal | — |
| `POST /api/admin/clients/[id]/invite` | Session required | TEAM only | New client-contact email | `features/auth/create-invite.ts` | Invite sent (§37) | — |
| `PATCH /api/admin/projects/[id]/state` | Session required | TEAM only | Target state | `features/projects/state-machine.ts` transition | Updated Project | — |
| `GET/POST/PATCH /api/admin/content/*` | Session required | TEAM only | ContentPost/CaseStudy fields | `features/content/*` | Content entity | — |

### 30.4 Webhook Authentication (distinct from session auth)

`POST /api/webhooks/razorpay` (and the Phase-2 Stripe equivalent) cannot use session cookies — the caller is Razorpay's server, not a logged-in browser. Instead, the endpoint verifies Razorpay's webhook signature (HMAC, using the webhook secret, §38.5) on every request before processing; a request with an invalid/missing signature is rejected with `401` and logged as a potential security event (§38.10).

### 30.5 Rate Limiting

Public, unauthenticated endpoints (`/api/leads`) are the primary abuse target and get explicit per-IP rate limits. Authenticated endpoints are protected primarily by requiring a valid session (raising the cost of abuse) plus a coarser standard authenticated-rate-limit as defense-in-depth (§38.8) — not because authenticated abuse is expected at Forge's scale, but because "no limit at all" is never the right default for a mutating endpoint (§38's ranking above developer convenience, §00.7).

### 30.6 Output Shaping — Client-Facing vs. Internal

Every endpoint that serves both the client portal and the admin app (e.g., Project data) returns a **role-shaped response** — internal-only fields (`Client.notes`, internal QA-checklist state, founder cost-tracking notes) are stripped for CLIENT-role sessions at the `features/*` layer (§27.2), not filtered client-side after the fact. This is a deliberate structural choice: filtering sensitive fields *before* they leave the server means a frontend bug can never accidentally render internal data to a client (§38 — security ranked above convenience, §00.7).

### 30.7 Error Response Shape (consistent across all endpoints)

```text
{ "error": { "code": "VALIDATION_ERROR" | "NOT_FOUND" | "FORBIDDEN" | "RATE_LIMITED" | "INTERNAL",
             "message": "human-readable, safe-to-display message",
             "fields": { "email": "Invalid email address" }  // present only for VALIDATION_ERROR
} }
```
A consistent shape means the frontend has exactly one error-handling code path (§28.6) instead of per-endpoint special cases.

### 30.8 Logging

Every mutating endpoint logs (structured, §28.9): actor (user id or "anonymous" for public endpoints), action, entity affected, and outcome (success/failure) — this is the practical implementation mechanism behind the `AuditLog` table (§29.12) for the subset of actions defined as sensitive (§38.10 lists exactly which actions require an `AuditLog` row versus a log-only record).

---

## 31. Authentication

### 31.1 Signup (Client)

Clients do **not** self-register (§18.4). The flow is: a founder sends an invite (`POST /api/admin/clients/[id]/invite`, §30.3) after a proposal is accepted (§34) -> the invited email receives a signed, time-limited invite link (§37.2) -> `/signup` (§20.13) pre-fills the email and lets the client set a password -> a `User` row (role=CLIENT, linked `clientId`) is created and a session starts immediately.

*Why invite-only, restated with the security angle §18.4 didn't cover:* an open signup form is also an unauthenticated write endpoint that must be hardened against abuse (§38.8) for a capability (arbitrary account creation) that provides Forge zero business value — removing the feature removes the attack surface entirely, the strongest possible mitigation (§38's principle of minimizing attack surface, not just defending it).

### 31.2 Signup (Team/TEAM role)

TEAM users (the three founders, and any future hires, §54) are created via a seed script (`prisma/seed.ts`, §25.1) at initial setup, and later via a TEAM-only admin action (not built in V1 — three founders are seeded once; a "team member invite" admin feature is added when §54's first hire actually happens, avoiding building it speculatively, §02.7).

### 31.3 Login / Logout

Standard Auth.js credentials-provider flow (§23.2): email + password -> Auth.js verifies the password hash (bcrypt/argon2, §38.2) -> database session created -> session cookie (`httpOnly`, `secure`, `sameSite=lax`, §38.5) set. Logout invalidates the session server-side (deletes the `Session` row, §29.3) — not just clearing the client-side cookie, which would leave the session valid if the cookie were ever replayed.

### 31.4 Password Reset

Standard token-based flow: user requests reset -> a time-limited (1 hour, ASSUMPTION), single-use token is generated and emailed (§37.2) -> reset link sets a new password and invalidates the token -> all other active sessions for that user are invalidated (§38.2 — a password reset should end any session that might exist because the old password was compromised).

### 31.5 Email Verification

Client accounts are effectively pre-verified by the invite flow itself (the invite was sent to a specific email the founder chose to trust, §31.1) — a separate email-verification step is not required for CLIENT accounts in V1. `User.emailVerifiedAt` is still recorded (set at invite-acceptance) so the schema doesn't need to change if a more general self-serve flow is ever added later (§57).

### 31.6 Sessions

Database-backed sessions (§23.2's rationale) — a session row can be individually revoked (used by §31.4's reset flow and available as a manual admin action if a device is ever reported lost/stolen, §38). Session duration: 30 days sliding expiration for CLIENT and TEAM roles alike (ASSUMPTION — ties to §51's tooling-cost assumptions only indirectly; primarily a UX/security balance, OPEN DECISION on the exact duration pending real usage patterns).

### 31.7 Roles

Two roles only: `CLIENT` and `TEAM` (§29.5). No finer-grained internal role hierarchy (e.g., "admin" vs. "junior team member") in V1 — with three founders and no hires yet, a role hierarchy would be speculative complexity with no current distinction to encode (§02.7, §64). **OPEN DECISION:** revisit when §54's first hire happens and a real "what should a new hire NOT be able to do on day one" question exists.

### 31.8 Permissions (Resource-Level Authorization)

Role alone (§31.7) answers "can this user reach this type of endpoint" (enforced in `middleware.ts`, §26.1) — it does not answer "can this specific CLIENT user see this specific Project." That second check (resource-level authorization) happens inside each `features/*` function (§27.4): every query scoped to a CLIENT-role actor filters by `clientId` derived from the session, never from a client-supplied parameter (§38.3 — trusting a client-supplied ID for authorization is a classic IDOR vulnerability class this rule structurally prevents).

### 31.9 Admin Access

"Admin" is not a separate role — it is the `TEAM` role accessing the `/admin` route group (§25.1), gated the same way as any other protected route (§24.4). All three founders have identical TEAM-role access in V1 (§53 defines domain *responsibility*, which is a process/organizational concept — it is deliberately not encoded as a technical permission restriction between founders, since artificially limiting a co-founder's system access would contradict the trust and shared-accountability basis §53 itself is built on).

### 31.10 Client Access Boundaries

A CLIENT-role user can only ever see/act on data belonging to their own `Client` record (§31.8) — including when a `Client` has multiple contact `User`s (e.g., a business owner and a marketing manager both need portal access): both see the same underlying Project/Invoice data, scoped by `clientId`, not by individual user-level project assignment, since Forge's engagement is with the Client (the business), not with an individual contact person.

---

## 32. Client Portal

### 32.1 What Should Exist (V1) vs. Future

| Capability | V1 | Future | Reasoning |
|---|---|---|---|
| Dashboard (status summary) | Yes | — | Directly serves §03.1 C2 |
| Project detail + milestone timeline | Yes | — | Core visibility promise |
| Milestone approval | Yes | — | Required for the state machine (§34) to progress without a phone call |
| Files (view/download, scoped upload) | Yes | — | §36 |
| Comments (project-scoped) | Yes | — | Replaces WhatsApp-as-PM-tool (§03.1 C2) |
| Invoices (view/pay) | Yes | — | §35 |
| Notification preferences | Yes | — | §37.4 |
| Contracts (view signed agreement) | Yes (static PDF link) | Full e-signature-in-portal flow | V1 uses an external e-signature tool (§52) and simply links the signed document; building e-signature in-house is a large, security-sensitive scope with no differentiation value (§64) |
| Real-time chat | No | Reconsider if comment-thread response-time data shows real need | §02.7 — comments + email notification (§37) cover V1 volume |
| Multi-project Gantt/roadmap view | No | Reconsider at higher concurrent-project-per-client volume | No current client has enough simultaneous projects to need this (§06 segment profiles) |
| Client-editable project scope/requirements doc | No | Phase 2 | Scope is fixed at proposal-acceptance (§08.5) — a self-edit feature would undermine the fixed-scope model the whole business is built on |
| Retainer content-calendar approval UI | No (V1: shared via file/PDF + comment) | Phase 2, dedicated calendar UI | Real feature but not blocking for early retainer clients; §55 sequences it after core project-flow V1 ships |

### 32.2 Dashboard, Projects, Milestones (see §20.14-20.16 for the page-level layout spec)

The portal's data model is entirely the `Project`/`Milestone` schema (§29.7-29.8) rendered through a CLIENT-role lens (§30.6) — there is no separate "portal-only" data model, which would risk exactly the status-disagreement problem (§03.1, C2) the portal exists to solve.

### 32.3 Tasks

There is no separate `Task` entity distinct from `Milestone` in V1 — a milestone (§29.8) is the right granularity for what a client needs to see ("Homepage design," "Development," not internal sub-tasks like "set up staging environment"). Internal task-level granularity, if the team wants it, is tracked in whatever internal tool the founders choose for their own work planning (§34.5) — deliberately not modeled in Forge's own database, since it has no client-facing purpose and would be scope the client-facing product doesn't need (§02.7).

### 32.4 Approvals & Revisions

Approval is a `Milestone.status` transition (`AWAITING_APPROVAL -> APPROVED`, §29.8) triggered by the client via `POST /projects/[id]/milestones/[milestoneId]/approve` (§30.3). A revision request is recorded as a `Comment` on that milestone plus the milestone status staying at `AWAITING_APPROVAL` — there is no separate `Revision` entity; a revision is simply "approval withheld, with feedback," which keeps the data model smaller without losing any needed information (§02.7). The **revision count** used for billing (§09.5's extra-revision fee) is tracked by counting revision-request Comments per milestone in `features/projects/`, not by a dedicated counter column — recomputed, not stored, since it's cheap to compute and storing a redundant counter risks it silently drifting from the actual comment history.

### 32.5 Messages (Comments)

Project-scoped only (§29.10) — never a general inbox. This is a deliberate, stated scope limit (§16.0/§64): a general messaging feature invites off-topic, unstructured communication that the portal is specifically designed to replace (§03.1 C2's WhatsApp-thread problem), not reproduce inside the portal.

### 32.6 Contracts & Invoices

Contracts: see §32.1 (external e-signature tool, linked not embedded). Invoices: full detail in §35; portal surface is §20.18.

---

## 33. Admin Platform

### 33.1 Purpose

The admin app (`/admin`, §25.1) is the founders' operating system for running the company day-to-day — it is not a stripped-down version of the client portal, it is a genuinely different tool serving §19.6's journey (task-prioritization, not just data browsing).

### 33.2 Leads

`/admin/leads` (§18.3): a filterable/sortable list of the `Lead` table (§29.4), grouped by `status`. Each lead's detail view surfaces everything needed to run the first call: submitted form data (§21.9), plus a manual-entry area for call notes (stored as `Client.notes` once converted, or a lightweight pre-conversion note field on `Lead` — ASSUMPTION: added to `Lead` schema as `internalNotes text nullable` if not already implied by §29.4; flagged here as a schema note rather than duplicating the full table definition).

### 33.3 Clients

`/admin/clients` — list/detail view of `Client` (§29.6) plus every linked Project/Invoice/Retainer, giving a founder a single-screen view of a client's full history before any call or negotiation (directly reduces the founder-time cost of context-gathering, §03.4 O1).

### 33.4 Projects

`/admin/projects` mirrors the client-facing project view (§32.2) plus internal-only additions: the QA checklist gate (§46.4) that must be complete before a milestone can move to client-visible `AWAITING_APPROVAL`, internal cost/hour tracking (feeds §51's margin tracking), and the founder-owner assignment (§29.7's `founderOwnerId`, feeding the WIP cap, §02.6).

### 33.5 Services & Packages

Not a separate admin-editable database feature in V1 — service/package definitions live in code (`config/packages.ts`, §26.7) by deliberate design (§26.7's alternatives-considered note on why this isn't a DB-backed, admin-editable feature yet).

### 33.6 Proposals

`/admin/proposals` — draft, send, and track proposals (`Proposal` table, §29.12) against a Lead or existing Client. Sending a proposal (§30.3) generates a proposal document (ASSUMPTION: rendered from a template using `config/packages.ts` data plus custom scope notes, as a PDF or a shareable link — exact rendering mechanism is an implementation detail not load-bearing for this document) and moves the associated Lead to `PROPOSAL` status (§34).

### 33.7 Contracts

Contract generation/signature is handled via an external e-signature tool (§32.1) — the admin's role is only to track *that* a contract was sent/signed (a status field on `Proposal` or `Client`, ASSUMPTION) and link to the signed document, not to build contract-generation logic in-house. PROFESSIONAL REVIEW REQUIRED for the actual contract template content (§52).

### 33.8 Payments & Invoices

`/admin/invoices` — full detail in §35; this admin view is where invoices are created/sent and payment status is monitored.

### 33.9 Content (Portfolio & Blog CMS)

`/admin/content` — the lightweight CMS (§23.2's rationale) for `ContentPost` and `CaseStudy` (§29.12). A structured form (not a raw HTML editor) enforcing the required SEO/content fields (§21.3, §22.2, §22.9) — a content author cannot publish a post missing a meta description, for example, because the form validates it the same way any other structured input is validated (§27.5's pattern applied to content, not just transactional data).

### 33.10 Analytics

The admin surfaces a small, curated set of business KPIs (§51) — active project count, MRR, pipeline value, lead-conversion rate — computed from Forge's own database (Lead/Project/Invoice/Retainer tables), not from the website analytics tool (Plausible, §23.2, which covers *visitor* behavior, a different concern, §41). No general-purpose "build your own report" analytics builder in V1 (§64 — speculative flexibility with no current requester).

### 33.11 Team

No dedicated `/admin/team` management UI in V1 (§31.2 — TEAM users are seeded, not self-service-managed, until the first hire, §54).

### 33.12 Settings

`/admin/settings` — notification defaults (§37.4's admin-configurable defaults, distinct from each user's personal preferences) and any operational configuration that isn't code-level (§27.9's config/ vs. runtime-settings distinction — Settings holds things that change based on business operations, not code deploys).

---

## 34. Project Management System

### 34.1 State Machine

```text
LEAD
  │  (founder qualifies: budget/scope/timeline fit, §47)
  ▼
QUALIFIED
  │  (proposal drafted and sent, §33.6)
  ▼
PROPOSAL
  │  (client negotiates scope/price, §09.4's bounded discount rules apply here)
  ▼
NEGOTIATION
  │  (client accepts, deposit invoice sent, §35.3 — Lead converts to Client, §29.4)
  ▼
WON
  │  (deposit paid, portal invite sent, §31.1 — kickoff scheduled)
  ▼
ONBOARDING
  │  (kickoff complete, milestone templates instantiated per package tier, §29.8)
  ▼
ACTIVE
  │  (all milestones complete, internal QA checklist passed, §46.4)
  ▼
REVIEW
  │  (client reviews final delivery — this is the project-level review, distinct from
  │   per-milestone approval, §32.4, which happens continuously through ACTIVE)
  ▼
APPROVED
  │  (final files delivered, final invoice sent, §35.3)
  ▼
DELIVERED
  │  (retainer pitch made, §46.5 — outcome doesn't gate this transition; the project is
  │   considered closed whether or not a retainer is attached)
  ▼
CLOSED
```

*Note on Lead vs. Project states:* `LEAD` through `WON` are tracked on the `Lead` entity (`LeadStatus`, §29.4 — a narrower enum: NEW/CONTACTED/QUALIFIED/DISQUALIFIED/CONVERTED); `ONBOARDING` through `CLOSED` are tracked on the `Project` entity (`ProjectState`, §29.7). This split exists because a Lead and a Project are genuinely different entities with different lifecycles (a Lead can be disqualified and never become a Project at all) — encoding all eleven states on a single entity would force awkward nullable fields for the Lead-only or Project-only-relevant data. §00.7 note: this is a deliberate divergence between this document's narrative pipeline description (which reads as one continuous flow, matching how a founder mentally thinks about it, §20.7) and the literal schema (which splits it in two, for data-modeling correctness) — both are correct at their respective level, and this note exists specifically to prevent that divergence from reading as a contradiction (§00.7).

### 34.2 Transition Rules & Guards

Every transition is guarded in code (§26.6's `state-machine.ts` pattern, applied across both the Lead and Project state enums) — e.g., `ACTIVE -> REVIEW` requires every Milestone to be `APPROVED` or `DELIVERED` AND the internal QA checklist (§46.4) to be marked complete; attempting the transition otherwise throws a typed error the admin UI surfaces as a specific, actionable message ("2 milestones still awaiting client approval"), not a generic failure.

### 34.3 WIP Cap

`founderOwnerId` (§29.7) plus a simple rule enforced in `features/projects/`: a founder should not have more than N (ASSUMPTION: 4) projects simultaneously in `ONBOARDING` through `REVIEW` states. This is surfaced as a warning in the admin dashboard (§20.20) rather than a hard technical block — a hard block would prevent legitimate exceptions (e.g., a founder temporarily covering for another); the goal is *visibility* into overload risk (§02.6), not bureaucratic enforcement.

### 34.4 Delivery Stage Detail (the retainer-pitch mandate, §01.9, §10.2)

The `APPROVED -> DELIVERED` transition in the admin UI requires the founder to explicitly record a retainer-pitch outcome (Pitched-Accepted / Pitched-Declined / Not-Yet-Pitched, the last one flagged as an incomplete-delivery-checklist warning, not a hard block) — this is a structural nudge (§34.2's guard pattern) that turns §01.9's "every project should have a retainer conversation" from a policy statement into something the software actually surfaces if skipped.

### 34.5 Internal Task-Level Work Tracking

Deliberately out of scope for Forge's own database (§32.3) — the founders use an off-the-shelf tool for their own day-to-day task breakdown (ASSUMPTION: e.g., Linear or a simple Kanban tool, vendor TBD at implementation time, §55) rather than Forge building internal task management into its own product. This is a direct application of §02.7: internal task-level granularity has no client-facing or business-model purpose that would justify building and maintaining it.

---

## 35. Payment System

### 35.1 Pricing Reference

All prices originate from `config/packages.ts` (§26.7) or a founder-entered custom amount for Enterprise/Custom scope (§08.1) — an `Invoice`/`InvoiceLineItem` (§29.11) never invents its own pricing logic independently.

### 35.2 What Is (and Is Not) Stored

Forge stores: invoice line items, amounts, currency, status, and Razorpay's own reference IDs (`razorpayOrderId`, `razorpayPaymentId`, §29.11). Forge **never** stores card numbers, CVVs, UPI PINs, or any raw payment-instrument data — the payment provider (Razorpay/Stripe, §23.2) handles instrument capture entirely on their own PCI-compliant infrastructure; Forge's server only ever sees a reference ID and a status. This is both a security requirement (§38.6) and a direct reduction of Forge's compliance burden (storing cardholder data would trigger PCI-DSS obligations Forge has no reason to take on, PROFESSIONAL REVIEW REQUIRED if this ever changes).

### 35.3 Invoice Lifecycle

```text
DRAFT   — created by a founder (deposit, milestone, or final invoice per §09.6's milestone
           schedule, or a monthly retainer invoice auto-generated per §29.12's scheduled job)
  │
SENT     — emailed to the client (§37.2) with a portal link (§20.18)
  │
PAID / OVERDUE — status updates automatically via the Razorpay webhook (§30.3, §30.4) on
  │              successful payment, or via a scheduled check against `dueDate` for overdue
  │              flagging (§45.6)
  ▼
(CANCELLED — manual founder action, e.g. a project cancellation, §09.6)
```

### 35.4 Payment Confirmation Flow

```text
1. Client clicks "Pay now" (§20.18) -> POST /api/invoices/[id]/pay (§30.3)
2. features/invoices/initiate-payment.ts creates a Razorpay order, returns order details to
   the client
3. Client completes payment via Razorpay's hosted checkout (card/UPI/netbanking — Forge's
   frontend never directly handles payment-instrument input, §35.2)
4. Razorpay sends a webhook to /api/webhooks/razorpay (§30.4) on completion
5. features/invoices/handle-payment-webhook.ts verifies the signature, updates Invoice.status
   to PAID, sets paidAt, triggers a payment-confirmation notification (§37.2) to both the
   client and the founders
```
*Why webhook-driven, not just trusting the client-side "success" callback:* a client-side success callback can be spoofed or interrupted (browser closed mid-flow); the webhook is the authoritative, server-to-server source of truth for payment status (§38 — never trust the client for a security/financial-integrity-relevant fact).

### 35.5 Refunds

Handled manually by a founder via the Razorpay dashboard directly (no in-app refund UI in V1) — refund requests are rare enough at Year-1 volume that building a dedicated in-app flow is premature (§02.7); the `Invoice.status` is manually updated to reflect a refund (ASSUMPTION: a `REFUNDED` status value, added to the enum if this becomes frequent enough to need in-app tracking — OPEN DECISION, revisit if refund volume grows).

### 35.6 Failed Payments

A failed payment attempt does not change `Invoice.status` (it stays `SENT`/due) — the webhook handler (§35.4) logs the failure (§28.9) but takes no destructive action; the client simply sees the invoice as still unpaid and can retry. No automatic dunning/retry-email sequence in V1 (ASSUMPTION — a manual founder follow-up is sufficient at Year-1 invoice volume; automated dunning is a reasonable Phase-2 addition once volume justifies it, §57).

### 35.7 International Payments

Deferred alongside ICP S6 (§06.3) — Stripe integration (§23.2) activates when international clients are actively pursued, using the same `Invoice`/webhook pattern as Razorpay (§35.4), with `Invoice.currency` already modeled to support non-INR amounts from Day 0 (§29.11) so this is an additive provider integration, not a schema change, when the time comes.

---

## 36. File Management

### 36.1 Upload

Files are uploaded via the File Uploader component (§16.1) to `POST /api/projects/[id]/files` (§30.3), which streams the file to Cloudflare R2 (§23.2) and writes the `File` metadata row (§29.9) only after a successful upload — preventing orphaned metadata rows pointing at objects that don't actually exist in storage.

### 36.2 Storage & Limits

Per-file size limit: 100MB (ASSUMPTION — covers design files/videos at Launch-service scope; revisit if 3D/video deliverables, §07.2-07.3, need a higher limit once those services launch). Files are stored in R2 under a key structure of `{clientId}/{projectId}/{fileId}` — never a predictable/guessable path used for direct access (§36.3 covers actual access control, this key structure is about internal organization, not security by itself).

### 36.3 Permissions

- **Download:** any User (CLIENT or TEAM) with access to the parent Project (§31.8/§31.10) can download any File on it — via a short-lived signed URL (§38.6) generated per request, never a permanently public object URL.
- **Upload:** TEAM can always upload. CLIENT can upload only when the current Milestone's stage is configured as client-upload-permitted (e.g., a "provide your logo/content" milestone) — an explicit per-milestone flag (ASSUMPTION: `Milestone.clientUploadEnabled boolean`, added to §29.8's schema) rather than a blanket "clients can always upload," which would create clutter/confusion about what stage of the process a random client upload belongs to.

### 36.4 Naming & Versioning

Uploaded filenames are preserved as displayed metadata (`File.name`, §29.9) but the actual R2 storage key uses the generated `fileId`, not the original filename — avoiding filename collisions and any risk of a malicious filename affecting storage-path handling (§38.3). Re-uploading a file that should replace a prior one creates a new `File` row with `supersedesFileId` pointing at the old one (§29.9) — the old version remains downloadable (version history, §20.17's version indicator), never silently overwritten.

### 36.5 Downloads

Signed URLs (§36.3) expire after a short window (ASSUMPTION: 15 minutes) — long enough for a real download to complete, short enough that a leaked/shared link doesn't grant indefinite access (§38.6).

### 36.6 Expiration & Deletion

Soft-delete only from the application's perspective (§29.9, §29.13) — a "deleted" file disappears from the portal/admin UI immediately but the underlying R2 object is retained for 30 days (ASSUMPTION) before a scheduled job (§45.6) permanently purges it, providing an accidental-deletion recovery window without indefinite storage-cost accumulation.

### 36.7 Backup

R2 objects are covered by the storage provider's own durability guarantees (not a separate Forge-managed backup system, §23.2's managed-infrastructure reasoning applied here too) — Forge's own backup responsibility is limited to the PostgreSQL database (§45.4), since the `File` metadata rows are what make R2 objects discoverable/attributable; losing the database without a backup would effectively strand the R2 objects even if R2 itself is durable.

---

## 37. Notifications

### 37.1 Channels

**Email** (transactional, via Resend, §23.2) and **in-app** (`Notification` table, §29.12, surfaced in the portal/admin UI). No SMS/WhatsApp-API notification channel in V1 (ASSUMPTION — email is sufficient for the transactional volume and urgency level of Year-1 events; WhatsApp Business API integration is a reasonable Phase-2 addition given §04's observed market channel preferences, tracked in §57).

### 37.2 Events & Templates

| Event | Channel(s) | Recipient(s) | Template notes |
|---|---|---|---|
| New lead submitted (§21.9) | Email | All 3 founders | Immediate, includes full form detail so a founder can prep for the call without opening the admin |
| Lead acknowledgment | Email | Lead submitter | Auto-sent immediately, sets the "1 business day" response expectation (§21.9) |
| Proposal sent | Email | Client/Lead contact | Includes proposal link |
| Portal invite | Email | New client contact | Includes signed invite link (§31.1), expires in 7 days (ASSUMPTION) |
| Milestone awaiting approval | Email + in-app | Client contact(s) | Fires on `Milestone.status -> AWAITING_APPROVAL` |
| Milestone approved/comment added | Email + in-app | The other party (founder if client approved/commented; client if founder updated) | Keeps both sides informed without requiring either to poll the portal |
| Invoice sent | Email | Client contact(s) | Includes "Pay now" link |
| Payment confirmed | Email + in-app | Client contact(s) + founders | §35.4 |
| Payment overdue | Email | Client contact(s) + founders | Triggered by the scheduled overdue check (§35.3, §45.6) |
| Project state change (major transitions only — Onboarding, Review, Delivered) | Email + in-app | Client contact(s) | Minor internal states (§34.1's Lead-side states) never notify the client — only client-relevant transitions do |

### 37.3 Retry Logic & Failure Handling

Email sends go through Resend's API; a failed send (provider error) is retried up to 3 times with exponential backoff (ASSUMPTION: standard backoff schedule) via a background retry mechanism (§45.6's scheduled-job infrastructure) — a permanently failed send (after retries exhausted) creates an in-app `Notification` as a fallback (so the recipient isn't silently left uninformed if email delivery is broken) and logs the failure for founder visibility (§28.9, §42).

### 37.4 Preferences

Users can toggle in-app vs. email per notification category (not per individual event — categories: Project Updates, Invoices, Marketing/Content, §20.19's Settings page) via `Switch` components (§16.1). **Exception (non-toggleable):** payment-related notifications (invoice sent, payment confirmed/overdue) and security notifications (password reset) are always sent via email regardless of preference — these are not "marketing-adjacent" notifications a user should be able to silence, they're operationally/financially load-bearing (§38's security-over-convenience ranking applied to notification design specifically).

---

## 38. Security Architecture

### 38.1 Authentication Security

Passwords hashed with bcrypt/argon2 (never reversible encryption, never plaintext, §31.3); Auth.js's built-in CSRF protection is enabled for all auth flows; failed login attempts are rate-limited per email+IP (§38.8) to slow credential-stuffing attempts.

### 38.2 Authorization

Two-layer model: role-level (middleware, §26.1) + resource-level (`features/*`, §31.8) — restated here because authorization bugs are consistently one of the highest-impact vulnerability classes in multi-tenant SaaS-shaped products, and this document treats it as a first-class architectural concern, not an incidental detail of §30-31.

### 38.3 XSS (Cross-Site Scripting)

React's default JSX escaping handles the majority case automatically. The specific risk areas requiring deliberate attention: (a) `ContentPost`/`CaseStudy` rich-text body content (§29.12) — rendered through a sanitizing markdown/rich-text renderer, never raw `dangerouslySetInnerHTML` on unsanitized input; (b) any user-supplied text displayed elsewhere in the admin (e.g., `Lead.message`, §29.4) — treated as plain text, never rendered as HTML, closing the exact stored-XSS risk flagged in §21.9's Contact Form spec.

### 38.4 CSRF

Auth.js provides CSRF tokens for credential-based auth actions by default (§38.1). State-changing API routes (§30) additionally rely on `sameSite=lax` session cookies (§31.6) as a second layer — a cross-site request cannot carry an authenticated session cookie under this setting for the mutating-request patterns this API uses.

### 38.5 Injection

Prisma's parameterized queries (§23.2) prevent SQL injection by construction — raw SQL (`$queryRaw`) is disallowed by convention except in narrowly justified, reviewed cases (mirroring §28.5's `any`-type exception pattern: rare, commented, reviewed). Webhook signature verification (§30.4) prevents payload-injection via forged webhook calls.

### 38.6 Secrets & Sensitive Data Handling

- Environment variables (§27.9) hold all API keys/secrets — never committed to git (`.env` is gitignored; `.env.example` holds placeholders only, §26's env-var documentation pattern).
- Payment instrument data is never stored (§35.2).
- File access is via short-lived signed URLs, never permanent public links (§36.5).
- Session cookies are `httpOnly` (inaccessible to JavaScript, mitigating XSS-driven session theft) and `secure` (HTTPS-only, §38.1/§31.3).

### 38.7 Third-Party Data Exposure

Analytics (§23.2, Plausible) receives no PII — page views and event names/properties only, explicitly excluding name/email/phone (§21.9's analytics spec, §41.3). Error tracking (Sentry) is configured to scrub known PII fields (email, name) from error payloads before transmission (ASSUMPTION: Sentry's built-in data-scrubbing feature configured accordingly at implementation time).

### 38.8 Rate Limiting

Applied at two levels: public unauthenticated endpoints (strict, IP-based, §30.5) and a coarser authenticated-endpoint baseline (defense-in-depth, §30.5) — plus login-attempt-specific throttling (§38.1). Implementation: ASSUMPTION — a simple in-memory or Redis-backed limiter is sufficient at Year-1 traffic volume; a dedicated rate-limiting service (e.g., Upstash) is a reasonable lightweight addition if self-hosted in-memory limiting proves insufficient across multiple serverless instances (OPEN DECISION, revisit based on real traffic).

### 38.9 File Upload Security

Uploaded files (§36.1) are validated for MIME type and size before acceptance; files are served back to users via signed URLs with the original content-type, and R2 object storage is configured so uploaded files are never directly executed or interpreted as scripts by any part of the platform (they are inert, downloadable objects only — never rendered as executable content in any context).

### 38.10 Audit Logs

`AuditLog` (§29.12) records: role changes, invoice creation/edits, project state transitions, and file deletions — the set of actions where "who did what, when" matters for dispute resolution or security investigation. Every write to `AuditLog` is append-only (no update/delete path exists in `features/*` for this table) — an audit log that can itself be edited defeats its own purpose.

### 38.11 Privacy & Data Retention (cross-reference)

Full retention policy is §29.13; PII inventory is implicitly every table marked "contains PII" throughout §29. PROFESSIONAL REVIEW REQUIRED for a formal privacy policy (§20.24) and for confirming retention periods meet applicable law once international clients (subject to GDPR-adjacent obligations, §06 S6) are served.

### 38.12 What Happens When Something Malicious Occurs (concrete failure scenarios)

| Scenario | Response |
|---|---|
| Brute-force login attempt | Rate limiting (§38.8) slows it; repeated failures from one IP/email are logged (§28.9) for founder visibility; account lockout is NOT used (avoids a denial-of-service vector where an attacker locks out a legitimate user by repeatedly failing their login) — throttling, not lockout, is the chosen mitigation |
| Stolen session cookie | `httpOnly`/`secure` cookies (§38.6) minimize the chance of theft via XSS; if a session is confirmed compromised, a founder can manually revoke it via a direct database action (no dedicated admin UI for this in V1 — rare enough to not need one yet, §02.7) |
| Forged webhook call (fake "payment succeeded") | Signature verification (§30.4) rejects it before any business logic runs; rejected attempts are logged as a security event (§38.10-adjacent logging) |
| SQL injection attempt via a form field | Prevented structurally by Prisma's parameterization (§38.5) — not dependent on input sanitization catching it |
| A client attempts to access another client's project by guessing/editing a URL ID | Resource-level authorization (§31.8) returns 404 (not 403 — see below) before any data is returned |
| Malicious file upload (e.g., disguised executable) | MIME/size validation (§38.9) at upload; files are never executed by the platform regardless |

*Why 404, not 403, for cross-tenant access attempts:* returning 403 confirms to an attacker that the resource ID exists but is forbidden; returning 404 (§30.7's error shape, `NOT_FOUND`) reveals nothing about whether the ID is valid, which is the more conservative, information-leakage-minimizing choice (§38 ranked above minor UX clarity loss for this specific case, §00.7).

---

## 39. Performance Architecture

### 39.1 Rendering Strategy

Marketing pages (§20.1-20.11) use static generation (SSG) or incremental static regeneration where content comes from the CMS (§23.2) — these pages have no per-visitor personalization, so serving a pre-rendered page from the edge (§24.1's CDN layer) is both faster and cheaper than server-rendering per request. Portal/admin pages (§20.12-20.20) use server-side rendering per request (they're inherently personalized/authenticated, so static generation doesn't apply) with React Server Components minimizing the client-side JS needed for the initial render.

### 39.2 Caching

- Static marketing pages: cached at the edge (§24.1), revalidated on content publish (ContentPost/CaseStudy changes trigger on-demand revalidation, ASSUMPTION via Next.js's `revalidatePath`, rather than a fixed time-based cache that could show stale content after an intentional publish).
- Database query results are not separately cached in V1 (§29.14's reasoning — data volume doesn't yet justify a caching layer's added complexity).

### 39.3 Images

Next.js `<Image>` component (§17.5) handles responsive sizing, modern-format (WebP/AVIF) conversion, and lazy-loading below the fold automatically — chosen specifically because hand-rolling responsive image logic (multiple manual `srcset` entries, manual format conversion) is exactly the kind of solved-problem reinvention §28's "no random technology" principle warns against reinventing.

### 39.4 Fonts

Variable fonts (§14.1) loaded via `next/font`, which self-hosts and subsets font files at build time (no runtime request to Google Fonts' CDN, avoiding both a third-party request waterfall and the associated privacy/consent question of a client's browser calling an external font host directly).

### 39.5 JavaScript

Server Components (§39.1) keep most portal/admin UI on the server by default; client-side JS bundles are limited to genuinely interactive components (forms, the file uploader, dropdowns — §16). No large client-side state-management library (§27.6, §26.10) keeps the baseline client bundle small without a deliberate optimization pass being required — the architecture avoids the problem by construction rather than needing to fix it later.

### 39.6 API Performance

Endpoints are expected to resolve in well under 500ms at Year-1 data volume given the normalized-but-small schema (§29.14) — no specific optimization work is scoped for V1; this is a stated expectation to make clear that if a specific endpoint is later found to be slow, that is a signal to investigate (missing index, N+1 query), not an expected/accepted baseline.

### 39.7 Database Performance

Indexes are defined per table based on actual query patterns used by the admin/portal views (§29's per-table "Indexes" notes) — not a blanket "index everything" approach, which would slow writes for no read benefit on rarely-filtered columns (§02.7 applied to database design specifically).

### 39.8 CDN

Vercel's Edge Network (§23.2) serves static assets and cached marketing pages globally by default — relevant even for an India-first business because international visitors (§06, S6, future) and traveling Indian users both benefit, at no additional configuration cost.

### 39.9 Lazy Loading

Below-the-fold images lazy-load by default (§39.3); heavier, rarely-needed client-side code (e.g., a rich-text editor used only in `/admin/content`, §33.9) is code-split so it's never downloaded by portal/marketing-site visitors who will never touch that admin feature.

### 39.10 Performance Budget (concrete target, ties back to §17's responsive/mobile-first design)

Marketing pages target a Largest Contentful Paint under 2.5s and a total JS payload under 200KB (gzipped) on the homepage specifically, given mobile-first traffic expectations for the primary ICP (§06) — stated as a concrete number specifically so "is this fast enough" has a checkable answer during QA (§43.4) rather than being a vague aspiration.

---

## 40. Accessibility

### 40.1 Target Standard

WCAG 2.1 Level AA across the marketing site and client portal (the admin app, being internal-only and used exclusively by the three founders, targets the same baseline but is held to a slightly lower verification priority in QA — §43.4 — since it has no external-user accessibility-compliance exposure; it is not exempted from the underlying good practices, just deprioritized in testing order under time constraints).

### 40.2 Keyboard Navigation

Every interactive element (§16.0's baseline) is reachable and operable via keyboard alone — Tab/Shift+Tab for focus movement, Enter/Space for activation, Escape to close overlays (§16.2). No keyboard trap exists anywhere except the deliberate, correct focus-trap inside an open Modal/Drawer (§16.2), which releases focus properly on close.

### 40.3 Focus Management

Visible focus ring on every focusable element (`--border-color-focus`, §15.5) — never suppressed via `outline: none` without a replacement indicator. Focus moves programmatically to the first error on a failed form submit (§21.9) and into a newly-opened Modal/Drawer (§16.2), returning to the triggering element on close.

### 40.4 Screen Readers

Semantic HTML is the default (`<button>` for actions, `<nav>` for navigation, proper heading hierarchy per page, §20) rather than generic `<div>`s with click handlers. ARIA roles/attributes are used where semantic HTML alone is insufficient (custom Select/Tabs/Accordion via Radix, §16.7) — never used to patch over non-semantic markup that should have been semantic in the first place.

### 40.5 Contrast

§13.3's computed contrast findings are the enforced baseline — any new color usage introduced later must be checked against the same AA thresholds (4.5:1 body text, 3:1 large text/UI components) before shipping, not assumed acceptable by eye.

### 40.6 Forms

Every field has a real, associated `<label>` (never placeholder-text-as-label, §21.9) — placeholder text, where used, supplies example formatting only, never the field's sole identifying label (a well-documented accessibility failure mode this document explicitly avoids).

### 40.7 Error Messages

Form errors are announced to assistive technology via `aria-describedby`/`aria-live` (§21.9, §16.1) — not communicated by color/icon alone (§16.1's Input error-state note explicitly restates this).

### 40.8 Motion Preferences

`prefers-reduced-motion` is respected globally — animations (§15.7, §12.6) reduce to instant/near-instant transitions for users who've set this OS-level preference, rather than every component needing to remember this individually (implemented once, centrally, in the motion-token application layer, §15.9's mechanism extended to also gate on this media query).

---

## 41. Analytics

### 41.1 Purpose & Boundaries

Analytics answers "is the marketing site working" (traffic, conversion) — it is explicitly not a surveillance or PII-collection system (§38.7). Business-outcome analytics (leads, revenue, retainer status) live in Forge's own database and admin views (§33.10), not the visitor-analytics tool — these are two different concerns with two different tools, deliberately not conflated.

### 41.2 Tool

Plausible (§23.2) — cookieless, no consent-banner requirement, cannot identify individual visitors.

### 41.3 Event Reference

| Event | Trigger | Properties | Purpose | Destination |
|---|---|---|---|---|
| `page_view` | Every page load (auto-tracked) | `path`, `referrer` | Traffic/funnel visibility | Plausible |
| `contact_form_submitted` | §21.9 success | `service`, `budget_range` (no PII, §21.9) | Lead-source/service-interest signal | Plausible |
| `service_page_viewed` | Landing on `/services/[slug]` | `service_slug` | Which services drive the most interest (§07 phasing decisions can be informed by this) | Plausible |
| `pricing_viewed` | Landing on `/pricing` | — | High-intent-visitor volume tracking | Plausible |
| `case_study_viewed` | Landing on `/work/[slug]` | `case_study_slug` | Portfolio-content effectiveness | Plausible |
| `cta_clicked` | Any primary CTA click (§16.5) | `cta_location`, `cta_label` | Which page sections actually convert attention into action | Plausible |
| `blog_post_viewed` | Landing on `/blog/[slug]` | `post_slug`, `category` | Content-pillar performance (§49.4) | Plausible |

### 41.4 What Is Deliberately Not Tracked

Individual visitor identity, IP-level tracking beyond Plausible's own privacy-preserving aggregate model, and any cross-site tracking (§38.7, §40's user-respecting posture extended to analytics specifically) — a stricter posture than most competitors take, consistent with §11.4's "grounded, honest" brand personality applied to the company's own technical choices, not just its marketing copy.

---

## 42. Error Handling

### 42.1 Principles

Every error state gives the user a next action (§16.3's Error State component rule, restated as a platform-wide principle) — no dead end. Internal error detail (stack traces, database error messages) is never shown to the end user (§38.6-adjacent) — always translated to the safe, generic message defined in §30.7's error shape.

### 42.2 Client Errors (4xx-equivalent, user-correctable)

Form validation errors (§21.9, §16.1) — inline, specific, actionable ("Enter a valid email address," not "Invalid input").

### 42.3 Server Errors (5xx-equivalent, not user-correctable)

Caught by the nearest error boundary (`app/error.tsx`, §20.22) or Route Handler catch-all (§28.6) — logged to Sentry (§23.2) with full internal detail for the team, while the user sees the generic Error Page (§20.22) with a retry action and support-contact fallback.

### 42.4 API Errors

Consistent shape (§30.7) with a machine-readable `code` and human-readable `message` — the frontend's single error-handling code path (§28.6) maps known codes to specific UI treatment (e.g., `RATE_LIMITED` shows a "please wait and try again" message rather than a generic failure).

### 42.5 Database Failures

A database connection/query failure surfaces as a generic `INTERNAL` error to the user (§42.3's treatment) while being logged with full detail server-side — the user is never shown a raw database error message (a real, common security/UX failure this document explicitly prevents, §38.6).

### 42.6 Network Failures (client-side)

Failed `fetch` calls (e.g., a user loses connectivity mid-action) show an inline retry affordance rather than a full-page failure where avoidable — e.g., a failed milestone-approval submit (§32.4) keeps the user's context intact and offers "Try again," rather than forcing a full page reload that would lose any in-progress comment text.

### 42.7 Payment Failures

§35.6 — no destructive state change on a failed payment attempt; the user can always retry.

### 42.8 Upload Failures

§16.1's File Uploader error state — per-file, with a retry action, so one failed file in a multi-file upload batch doesn't require re-uploading the successful files alongside it.

---

## 43. Testing

### 43.1 Unit Tests

Cover: `lib/validation/*` schemas (§26.3), `features/*` business logic in isolation (especially the state machine, §26.6, whose correctness is treated as non-negotiable), and `components/ui/*` primitives (render + interaction, §16.0's testing baseline). Tool: ASSUMPTION — Vitest (fast, native ESM/TypeScript support, minimal config overhead relative to Jest for a Next.js/TypeScript codebase).

### 43.2 Integration Tests

Cover: Route Handlers against a real (test) database — asserting the full request -> validation -> business logic -> DB -> response chain for the highest-risk endpoints (auth, payments, project-state transitions, §30.3's endpoint table). Tool: ASSUMPTION — Vitest + a disposable test-database instance (spun up in CI, §45.5), or Playwright's API-testing mode if consolidating tooling proves simpler at implementation time (OPEN DECISION, low-stakes tooling choice deferred to implementation).

### 43.3 End-to-End (E2E) Tests

Cover the critical user journeys (§19) end-to-end in a real browser: Contact form submission (§21.9), full auth flow (§31), milestone approval (§32.4), and invoice payment against Razorpay's test/sandbox mode (§35.4). Tool: ASSUMPTION — Playwright. Not every page/flow needs E2E coverage — E2E tests are reserved for flows where a regression would be high-cost (revenue-affecting, trust-affecting) and where unit/integration coverage alone can't verify the full real-browser behavior (e.g., actual keyboard focus movement, §40.3).

### 43.4 Accessibility Testing

Automated: `axe-core` integrated into E2E test runs (catches the mechanically-detectable subset of WCAG issues — missing labels, contrast failures, missing ARIA). Manual: a pre-launch keyboard-only and screen-reader spot-check (§55's launch checklist, §67) covering the highest-traffic pages (Homepage, Contact, a Service page, the portal Dashboard) — full manual audit of every page is not scoped for V1 given founder time constraints (§03.4, O1), but the highest-traffic/highest-stakes pages are not skipped.

### 43.5 Performance Testing

Lighthouse CI (or equivalent, ASSUMPTION) run against the §39.10 performance budget on every PR touching marketing pages specifically (§45.3) — catching a performance regression before it merges rather than discovering it in production.

### 43.6 Security Testing

No dedicated penetration-testing budget in V1 (cost-prohibitive at this stage, §51) — mitigated by: relying on well-vetted libraries for security-critical primitives (Auth.js, Prisma — §23.2's "don't roll your own" reasoning, §38), automated dependency-vulnerability scanning (§45.3's CI checks, via GitHub's built-in Dependabot alerts), and the structural mitigations documented throughout §38. **VALIDATION REQUIRED:** a professional security review is recommended once the platform handles a meaningful volume of real client payment/file data — flagged here as a forward-looking item, not a Year-1 budget line (§51).

### 43.7 What Requires Tests (and what doesn't)

| Requires tests | Does not require dedicated tests |
|---|---|
| `features/*` business logic (especially state machines, payment/webhook handling) | Purely presentational, low-risk `components/ui/*` visual variants beyond a basic render check (§16.0's baseline still applies, but exhaustive visual-variant testing is a design-review job, §62, not an automated-test job) |
| `lib/validation/*` schemas | Static marketing copy content itself (content accuracy is an editorial/review process, §21, not a test) |
| Auth/authorization logic (§31, §38.2) | Third-party library internals (Auth.js, Prisma, Radix) — trusted, not re-tested by Forge |
| Payment/webhook handling (§35) | — |
| The project/lead state machines (§34) | — |

---

## 44. Deployment

### 44.1 Environments

| Environment | Purpose | Database | Deployed from |
|---|---|---|---|
| Local | Individual founder development | Local Postgres instance or a dev-tier managed instance (§23.3) | Developer's machine |
| Preview | Review a specific change before merge | Shared staging database (or an ephemeral per-PR database, ASSUMPTION — cost/complexity tradeoff decided at implementation time, OPEN DECISION) | Automatic, every PR (Vercel Git integration, §23.2) |
| Staging | Final check before production, using production-like data volume | Dedicated staging database, periodically refreshed from a sanitized production snapshot (§45.4) | `main` branch, or a dedicated `staging` branch (§45.1 — exact branch strategy) |
| Production | Live site/portal/admin | Production database | `main` branch (or a `production` branch, per §45.1), on merge |

### 44.2 CI/CD Pipeline

```text
1. PR opened -> GitHub Actions runs: lint, typecheck, unit tests (§43.1), integration tests
   (§43.2) against an ephemeral test database
2. Vercel automatically builds and deploys a Preview environment for the PR
3. Lighthouse CI (§43.5) runs against the Preview URL for marketing-page changes
4. Code review (§45.3) — at least one other founder approves
5. Merge to main -> CI re-runs full suite -> Vercel deploys to Production automatically
6. Post-deploy: smoke-test critical paths (ASSUMPTION — a small automated post-deploy check
   hitting /, /contact, /login) before considering the deploy fully verified
```

### 44.3 Database Migrations in the Pipeline

`prisma migrate deploy` runs as an explicit, separate CI step before the application deploy completes (§29.7's migration-testing note, §45.5) — never run manually/ad-hoc against production, and never allowed to run implicitly as a side effect of application startup (a startup-triggered migration risks a race condition across multiple serverless instances starting simultaneously).

### 44.4 Rollback

Vercel's deployment model keeps prior deployments available for instant rollback (re-pointing production traffic to the previous build) if a deploy introduces a critical issue — this covers application-code rollback. Database migrations are NOT automatically rolled back with an application rollback (§45.5 covers the migration-specific rollback discipline this requires: migrations are written to be backward-compatible with the previous application version for at least one deploy cycle, so an application rollback never leaves the database in a shape the rolled-back code can't handle).

---

## 45. DevOps

### 45.1 Git & Branching

Trunk-based, simplified for a 3-person team: `main` is always deployable (§44.1's Production source). Feature branches (`feat/<short-description>`) are created per unit of work, opened as a PR against `main`, and deleted after merge. No long-lived `develop` branch or complex Git Flow — that branching complexity solves a large-team coordination problem Forge doesn't have (§02.3 applied to git workflow specifically).

### 45.2 Pull Requests

Every change, including founder-authored ones, goes through a PR — even for a 3-person team, a PR is the mechanism that triggers CI (§44.2) and creates a reviewable record tied to the Decision Log (§00.5) for any change significant enough to warrant one. Trivial changes (a typo fix) don't require a lengthy review, but still go through the same automated pipeline.

### 45.3 Code Review & CI Checks

Required CI checks before merge: lint (ESLint, including the semantic-token/no-raw-hex rule referenced in §16.0 and the no-`console.log` rule from §28.9), typecheck (`tsc --noEmit`), unit + integration tests (§43.1-43.2), and the Lighthouse performance budget check (§43.5) for marketing-page changes. Review focuses on: does this match the architecture in §23-28, is the change covered by tests where §43.7 requires it, and does it need a PLAN.md update (§00.4-00.5) because it changes a documented decision.

### 45.4 Backups

Automated daily database backups (managed by the Postgres provider, §23.3) with a minimum 7-day retention (ASSUMPTION, adjust based on provider defaults/pricing) — plus a monthly manual verification that a backup can actually be restored (an untested backup is not a real backup; this check is a recurring operational task, §46.7).

### 45.5 Migrations

Prisma migrations (§26.8) are: written locally, tested against a local/CI database (§44.3), reviewed in the PR alongside the schema change, and applied via the explicit CI deploy step (§44.3) — never hand-edited directly against production. A migration that would cause data loss (e.g., dropping a column) requires an explicit two-step process (deploy code that stops using the column first, then a follow-up migration that drops it) to keep rollback safety (§44.4) intact.

### 45.6 Scheduled Jobs

A small set of recurring jobs (ASSUMPTION: implemented as Vercel Cron or an equivalent scheduled-function mechanism, §23.2's hosting choice): overdue-invoice flagging (§35.3), monthly retainer invoice generation (§29.12), expired-file purge (§36.6), expired-session cleanup (§29.13), and notification-retry processing (§37.3). Each job is idempotent (safe to run twice if triggered twice) — a hard requirement for any scheduled-job system, since "exactly once" delivery is not guaranteed by most scheduling infrastructure.

### 45.7 One-Off Scripts

`scripts/` (§25.1) holds one-off maintenance scripts (e.g., a one-time data backfill) — run manually by a founder against a specific environment, never automatically triggered, and deleted or archived once their purpose is served rather than accumulating indefinitely (§02.7 applied to script hygiene).

### 45.8 Monitoring

Sentry (§23.2) for error tracking; a lightweight uptime check (§23.2) for availability; Vercel's built-in deployment/function logs for request-level debugging. No dedicated on-call rotation/paging system in V1 (three founders, low traffic — a missed alert for a few hours is an acceptable risk at this stage; PagerDuty-style tooling is Phase-2-or-later infrastructure, revisit at §54's team-scaling trigger points).

---

## 46. Operations

### 46.1 End-to-End Workflow Overview

```text
Lead handling -> Sales -> Proposal -> Contract -> Payment -> Onboarding -> Production -> QA
  -> Delivery -> Support -> Retention
```
This mirrors §34's state machine but is described here from the *human process* angle — who does what, not what the database records.

### 46.2 Lead Handling

A new lead (§21.9, §33.2) is acknowledged automatically (§37.2) and must receive a **founder response within 1 business day** (the stated SLA, §19.3) — whichever founder is "on lead duty" that week (a simple rotating assignment, avoiding the diffusion-of-responsibility failure mode where all three founders assume someone else will respond, §53).

### 46.3 Sales

Full playbook in §47 — operationally, this stage is: qualification call -> scoping -> proposal (§33.6) -> negotiation (§09.4's bounded discount rules) -> close.

### 46.4 Onboarding & Production, with the Internal QA Gate

At `WON -> ONBOARDING` (§34.1), a kickoff call confirms scope/timeline and the milestone template for the sold package (§08) is instantiated (§29.8). Production proceeds milestone by milestone. **Before any milestone is marked `AWAITING_APPROVAL` (i.e., before a client ever sees it), it passes an internal QA checklist** — the specific checklist is service-dependent (e.g., for a website milestone: cross-browser check, mobile responsiveness check per §17, accessibility spot-check per §40, broken-link check) but the *rule* that a QA gate exists before client visibility is universal, and is what makes §02.2 ("quality over quantity") an enforced practice rather than an aspiration.

### 46.5 Delivery & the Retainer Pitch

At `APPROVED -> DELIVERED` (§34.1, §34.4), the founder delivering the project has a structured retainer conversation (not a generic "let us know if you need anything else") — presenting the specific retainer package (§08.3-08.4) most relevant to what was just delivered, with pricing, as a natural continuation of the relationship. This conversation is scripted at a high level (not word-for-word) in the sales playbook (§47.6) so quality doesn't depend on which founder happens to be delivering.

### 46.6 Support

Post-delivery, non-retainer clients have no ongoing support obligation beyond the 30-day post-launch window stated in applicable packages (§08.1's Premium tier) — support requests beyond that are either a paid maintenance retainer (§08.4) engagement or a new change-order-priced request (§09.5), never open-ended free support, which would undermine the same margin discipline §09 is built around.

### 46.7 Retention

Retainer clients (§08.3-08.4) are retained through demonstrated, visible value (the monthly report cadence stated in each retainer package) rather than lock-in contracts (§09.6's 30-day notice, no long-term lock-in) — retention here means "the client doesn't want to leave," not "the client is contractually stuck," a deliberate philosophical choice consistent with §02.6 (sustainable, not manipulative growth) and §11.5 (honest brand voice).

### 46.8 Founder Time Allocation (operational implication of §03.4, O1)

Weekly founder time is understood to split roughly across: delivery work (majority, especially Year 1), sales/lead-response (§46.2), and admin/ops overhead — the entire point of §32-37's platform build is to shrink that third category (status updates, invoice chasing, file organization) so more time stays in the first two, higher-leverage categories.

---

## 47. Sales

### 47.1 Lead Sourcing

Year 1 priority order (§01.10): founder personal/professional networks first (fastest trust, zero CAC), then direct outreach to §06's primary ICPs (S1/S2), then referrals from delivered clients (compounding, starts after the first few deliveries), then inbound via the website/SEO (§48) once it has enough content/traffic to matter (§55 sequences this after Month 3-4).

### 47.2 Outreach

Direct outreach (LinkedIn/email/WhatsApp Business, matching each segment's actual channel preference per §06's segment profiles) is personalized per prospect — referencing something specific about their business, never a mass-blasted template with only the recipient's name swapped in. Volume target: ASSUMPTION 15-20 targeted outreach contacts per founder per week during active prospecting periods (Month 1-3 especially, before referral/inbound volume builds).

### 47.3 Qualification

A lead is "qualified" (§34.1's `QUALIFIED` state) when it clears three checks: budget fits a published package band or a credible custom-scope range (§08-09), timeline is realistic given current WIP (§34.3), and the service requested is in Launch scope (§07.1) or a reasonable judgment-call exception. A lead that fails these is politely declined or referred elsewhere rather than force-fit into a package that doesn't match (§02.2, §02.6).

### 47.4 Calls

Discovery call structure (ASSUMPTION, refined after real calls): (1) understand the business and the actual problem behind the request, not just the stated request, (2) confirm budget/timeline fit, (3) explain the relevant package(s) and process (§20.7), (4) set expectations on next steps and proposal timing. Target call length: 20-30 minutes — long enough to genuinely qualify and build trust, short enough to protect founder time (§03.4, O1).

### 47.5 Proposals & Follow-Ups

Proposals (§33.6) are sent within 2 business days of a qualifying call. A single scheduled follow-up (ASSUMPTION: 3 business days after sending, if no response) is standard practice — follow-up beyond that is judgment-based per lead rather than an automated drip sequence, since at Year-1 volume a founder's personal judgment on a specific prospect outperforms generic automation, and automating this prematurely would risk feeling impersonal in exactly the relationship-driven segments (§06, S2/S3) Forge prioritizes.

### 47.6 Closing

Closing means: proposal accepted, deposit invoice sent and paid (§09.6, §35.3), kickoff scheduled. The retainer pitch (§46.5) is explicitly a *separate*, later conversation (at delivery, not at initial close) — bundling it into the initial close would pressure a prospect who hasn't yet experienced Forge's delivery quality into a recurring commitment, undermining the trust-building, evidence-based sales approach §11.5/§02.6 commit to.

### 47.7 Retainers (as a distinct, ongoing sales motion)

Beyond the delivery-stage pitch (§46.5), retainer clients are also a source of expansion revenue (§10.1's upsell/cross-sell streams) — reviewed quarterly per client for tier-upgrade or additional-service fit (e.g., a Starter Retainer client whose engagement metrics justify a Growth-tier conversation), rather than left static for the life of the relationship.

---

## 48. Marketing

### 48.1 Channel Priorities (Year 1)

| Channel | Priority | Why |
|---|---|---|
| Referral (from delivered clients) | Highest | Zero CAC, highest trust, directly incentivized by delivery quality (§02.2) and the retainer-visibility loop (§10.2) |
| LinkedIn (founder personal + company page) | High | Matches B2B/owner-decision-maker behavior for S2/S3 (§06); low production cost, founder-authentic voice fits §11.5 |
| Instagram | High | Matches S1 (D2C) discovery behavior and doubles as a live portfolio of Forge's own social/content work (a credible self-demonstration for the exact service being sold, §07.1 L5) |
| SEO / Blog content | Medium, ramping | Compounding but slow-starting (§04.7) — investment begins Month 1 (§55) but is not expected to be a meaningful lead source before Month 4-6 |
| Email (newsletter) | Deferred | §57 — no substantial list exists yet; premature before content/audience base exists |
| Paid ads | Deferred | Capital-intensive relative to Year-1 budget (§51); revisit once organic channels and conversion data (§41) establish a baseline worth paying to amplify |
| Partnerships (agencies, complementary vendors) | Medium | Ties to §06 S5 (white-label) and cross-referral relationships (e.g., a web-hosting reseller, an accountant serving the same SMB segment) |

### 48.2 Social Media (Forge's Own)

Forge's own Instagram/LinkedIn presence is run to the same standard as a client Growth Retainer (§08.3) — a direct, credible demonstration of the service being sold (§48.1's Instagram rationale), maintained by the founder(s) with the most relevant skill (§53) rather than treated as an afterthought squeezed in around client work.

### 48.3 SEO (cross-reference)

Full architecture in §22; content execution in §49.

### 48.4 Content (cross-reference)

Full detail in §49.

### 48.5 Email

Deferred per §48.1 — when introduced (§57), it will be a value-first newsletter (process insights, not pure promotion) sent to the blog audience, consistent with §11.5's non-manipulative voice.

### 48.6 Partnerships & Referrals

A structured (not just informal) referral ask is built into the delivery process (§46.5's delivery-stage conversation naturally includes "who else do you know who might need this") — asking is deliberate practice, not left to happen organically or not at all.

### 48.7 Paid Acquisition

Deferred (§48.1). **OPEN DECISION:** revisit once organic-channel conversion data (§41) exists to inform whether paid spend would have a defensible payback period, rather than starting paid ads speculatively.

---

## 49. Content System

### 49.1 Content Pillars

| Pillar | Topics | Maps to |
|---|---|---|
| Process & Transparency | "How we price," "What a typical timeline looks like," "How to brief a designer" | §01.7 positioning, §02.5 |
| Service Education | "What's the difference between UI and UX design," "Do you need a website or a landing page" | §07's service menu, drives §22's service-page SEO |
| Client Industry Insight | Content relevant to S1/S2/S3's own businesses (e.g., "local SEO basics for clinics") | §06 ICP relevance, positions Forge as understanding the client's world, not just design/dev craft |
| Behind the Work | Case-study-adjacent process posts, not full case studies (§20.5) but shorter looks at specific decisions | Builds on real project work (§55 sequences this after real projects exist) |

### 49.2 Formats

Primarily long-form blog posts (§22.9, §20.11) and short-form social content (Instagram/LinkedIn, §48.2) — video/motion content is a Phase 2 addition (§07.2) once that production capability exists, not attempted with mismatched quality in V1 (§02.2).

### 49.3 Production Process

Draft (founder-written or AI-assisted first draft, §50.3) -> founder review/edit (mandatory human pass, §02.4/§50.5) -> publish via the admin CMS (§33.9) -> distribute (social snippet derived from the post, shared across §48.1's priority channels).

### 49.4 Approval

Any founder can publish directly (no multi-stage approval chain needed at 3-person scale, §02.3) — but every post is read by at least one founder besides the author before publishing, as a lightweight quality/brand-voice check (§11.5), tracked informally rather than as a formal workflow state (§02.7 — a full approval-workflow feature is unnecessary complexity at this team size).

### 49.5 Distribution

Every blog post is repurposed into at least one LinkedIn post and one Instagram-appropriate asset (a quote graphic or carousel, using the design system's tokens, §13-16) — content is never published to the blog alone and left to be discovered by search traffic exclusively; the distribution step is treated as part of "publishing," not an optional follow-up.

### 49.6 Analytics

`blog_post_viewed` (§41.3) plus qualitative tracking of which posts generate contact-form submissions with a `Referer` matching a blog URL (a simple query against existing analytics/lead data, not a dedicated attribution-modeling tool — proportionate to Year-1 content volume, §02.7).

---

## 50. AI System

### 50.1 Purpose

AI is used internally to increase what three people can deliver (§02.4, §04.6) — it is not, in V1, sold as a distinct client-facing "AI service" product (that's a Phase 2 addition, §07.2, gated behind Forge's own internal AI workflow being proven first).

### 50.2 Internal AI Usage — Design

AI-assisted moodboard/reference generation and first-pass image upscaling/background-removal for production assets — always followed by human design refinement (§50.5); AI is never the source of a final, client-delivered visual asset without a designer's deliberate pass.

### 50.3 Internal AI Usage — Development

AI-assisted code scaffolding (boilerplate component structure, test-case drafting per §43's patterns) — always reviewed in the normal PR process (§45.2-45.3) exactly like human-written code; AI-authored code carries no different review bar.

### 50.4 Internal AI Usage — Marketing & Content

AI-assisted first-draft copywriting for blog posts (§49.3) and social captions — always through the mandatory human edit pass (§49.3/§49.4) before publishing; AI drafts are treated as a starting point that speeds up a founder's writing process, not as publishable output.

### 50.5 Human Quality Control (the non-negotiable gate)

Every AI-assisted deliverable — internal or (eventually) client-facing — passes a named human review step before being considered final (§02.4). This is not a suggestion; it's treated with the same seriousness as the QA gate in §46.4, because AI-generated content that reaches a client unreviewed is the fastest way to violate §02.2 (quality over quantity) and damage the exact trust §01.8 depends on.

### 50.6 AI Services For Clients (Phase 2, §07.2)

Deferred until: (a) Forge's own internal AI-assisted workflow has run reliably for 2+ months (§07.2's stated trigger), and (b) a specific, well-scoped offering (e.g., "AI chatbot setup for your website," "AI-assisted content operations") can be packaged with the same rigor as any other service (§08's package-definition standard) rather than sold as vague "AI-powered" hand-waving (§64 prohibits exactly this kind of unsubstantiated claim).

### 50.7 Risks

| Risk | Mitigation |
|---|---|
| AI-generated content reaching a client unreviewed | §50.5's mandatory human gate |
| Over-reliance eroding the craft-quality brand promise (§01.8, §11.4) | AI usage is explicitly scoped to acceleration of human work, never replacement of human judgment on final creative/strategic decisions (§02.4) |
| Client skepticism/negative perception of AI-assisted work if disclosed poorly | Handled honestly per §11.5's voice rules — Forge doesn't hide AI-assisted process steps if asked, but also doesn't lead marketing with "AI-powered" claims that could imply lower human involvement than is actually the case |
| Rapid tooling change requiring frequent re-evaluation | Reviewed informally at the same cadence as other tooling decisions (§45.8's monitoring/ops review rhythm), not treated as a one-time V1 decision |

---

## 51. Financial Model

All figures in this section are ASSUMPTION-based planning estimates, not historical data (Forge has none yet, §04.2) — VALIDATION REQUIRED against real Month 1-3 results, at which point this section should be revised (§00.5) rather than left as an untouched Day-0 artifact. PROFESSIONAL REVIEW REQUIRED before any figures here are used for tax, loan, or investor purposes.

### 51.1 Startup Budget (one-time, pre-Month-1)

| Item | Estimated Cost (₹) | Notes |
|---|---|---|
| Company registration/incorporation | 15,000-25,000 | PROFESSIONAL REVIEW REQUIRED — exact structure (§52.1) affects cost |
| Domain + initial tooling setup | 3,000 | Domain registration, basic setup |
| Design tooling (Figma, initial month) | 0-2,000 | Free tier likely sufficient initially |
| Brand identity production (logo, if outsourced rather than founder-produced) | 0 | ASSUMPTION: produced in-house by a founder (§53), not outsourced — zero cash cost, founder-time cost only |
| Legal (contract/SOW template drafting) | 15,000-40,000 | PROFESSIONAL REVIEW REQUIRED — one-time template creation, reused for every client thereafter |
| **Total estimated one-time startup cost** | **~₹35,000-70,000** | Deliberately low — consistent with §02.3/§03.2 (F1, limited capital) and the bootstrapped ASSUMPTION (§01.9) |

### 51.2 Monthly Fixed Costs (ramping — Month 1 vs. Month 6 steady-state)

| Item | Month 1 (₹) | Month 6+ (₹) | Notes |
|---|---|---|---|
| Hosting (Vercel) | 0 (free tier) | ~1,700 | Pro tier once traffic/team needs exceed free tier |
| Database (managed Postgres) | 0 (free tier) | ~2,000 | §23.3 |
| Object storage (R2) | ~200 | ~500 | Usage-based, scales with file volume (§36) |
| Transactional email (Resend) | 0 (free tier) | ~1,700 | §37 |
| Error tracking (Sentry) | 0 (free tier) | 0-1,500 | Free tier likely sufficient through Year 1 |
| Analytics (Plausible) | ~800 | ~1,600 | §41 |
| Design tooling (Figma) | ~1,000 | ~1,000 | |
| Misc. (domain renewal amortized, productivity tools) | ~500 | ~1,500 | |
| **Total monthly fixed cost** | **~₹2,500** | **~₹10,000-11,000** | Payment-processing fees (Razorpay, ~2% per transaction) are variable, not fixed, and are already netted into the margin figures in §09-10 |

### 51.3 Founder Compensation

ASSUMPTION: founders draw minimal/no fixed salary in Month 1-3, reinvesting revenue into the company and covering personal expenses from savings/runway — transitioning to a modest, equal draw (ASSUMPTION: ₹40,000-60,000/month per founder) once MRR (§10.3) reliably covers it, per the Realistic scenario's Month 4-6 trajectory below. **OPEN DECISION:** exact founder compensation policy (equal draw vs. performance-linked, timing of the transition) is a founder-structure decision requiring unanimous agreement (§00.4, §53) — this document states a planning placeholder, not a ratified policy.

### 51.4 Revenue Scenarios (12-Month Projection)

Building on §10.2-10.3's illustrative model. All three scenarios share the same pricing (§08-09) and margin assumptions (§07.1, §10.4) — they differ only in sales-execution pace (leads closed per month).

| Metric (Month 12 exit) | Conservative | Realistic | Aggressive |
|---|---|---|---|
| New project clients/month (steady-state, Month 6+) | 2 | 4 | 7 |
| Retainer attach rate | 30% | 40% | 45% |
| Active retainer clients by Month 12 | 6-8 | 10-14 | 18-22 |
| Blended average retainer value | ₹24,000/mo | ₹28,000/mo | ₹32,000/mo |
| MRR at Month 12 | ~₹1.5L-1.9L | ~₹2.8L-3.9L | ~₹5.8L-7.0L |
| ARR run-rate exiting Year 1 | ~₹18L-23L | ~₹34L-47L | ~₹70L-84L |
| Approx. total Year-1 revenue (project + retainer, cumulative) | ~₹22L-28L | ~₹42L-55L | ~₹80L-95L |

*How to read this table:* the Conservative scenario is not a "worst case" (a genuine worst case — near-zero sales — is a real, if less likely, possibility not modeled here since it isn't useful for planning); it represents slower-than-expected but still-functioning sales execution. The Aggressive scenario assumes strong referral compounding (§46.7, §48.6) kicks in earlier than typical. **The Realistic scenario is the one used for founder compensation planning (§51.3) and hiring-trigger planning (§54)** — Conservative and Aggressive exist to bound the range, not to be individually planned against.

### 51.5 Gross Margin & Contribution Margin (recap with figures)

Applying §10.4's 55-65% blended gross margin target to the Realistic scenario's ~₹42L-55L Year-1 revenue: **~₹24L-34L gross profit before fixed overhead (§51.2) and founder compensation (§51.3).** After ~₹1L-1.3L/year fixed overhead (§51.2's steady-state monthly cost annualized) and a conservative founder-draw assumption, this leaves a meaningful reinvestment/profit margin even in Year 1 — the model is deliberately built so the company is not dependent on Year-2 growth just to survive Year 1, consistent with §01.9's "revenue from Week 1" strategy.

### 51.6 Break-Even Analysis

```text
Fixed monthly cost (Month 6+ steady-state, §51.2):        ~Rs.10,500/month
Blended gross margin (§10.4):                              ~60%
Break-even monthly revenue (before founder draw):
  = Fixed cost / Gross margin
  = Rs.10,500 / 0.60
  = ~Rs.17,500/month

This is a very low bar relative to even the Conservative scenario's steady-state monthly
revenue (§51.4) — meaning tooling/infrastructure break-even is not a meaningful Year-1 risk.
The real financial risk is founder-income sustainability (§51.3), not company survival in a
pure cost-coverage sense. This is a deliberate, positive consequence of §23's low-cost managed-
infrastructure stack choice (§02.3) — the platform itself was never a large cost the business
needed to grow into.
```

### 51.7 Cash Flow Considerations

- Milestone-based payment terms (§09.6: 40/40/20) mean project cash inflow is front-loaded relative to delivery cost, protecting cash flow — a deliberate pricing-structure decision, not incidental.
- Retainers billed monthly in advance (§09.6) similarly front-load cash relative to service delivery within that month.
- The main cash-flow risk is the sales ramp-up lag in Month 1-2 (before the first deposits land) — covered by the low startup budget (§51.1) and minimal Month 1 fixed costs (§51.2), both deliberately kept low for exactly this reason.

### 51.8 Key Metrics To Track From Day 1 (tying back to §10.2's stated highest-leverage number)

| Metric | Why it's tracked |
|---|---|
| Retainer attach rate | §10.2 — the single highest-leverage number in the business model |
| Lead-to-qualified-call conversion | Validates §04.2/§04.3's market assumptions/hypotheses |
| Qualified-call-to-close conversion | Sales process effectiveness (§47) |
| MRR (month-over-month) | Primary recurring-revenue health signal |
| WIP per founder (§34.3) | Sustainable-growth guardrail (§02.6) |
| Gross margin per project/retainer (actual vs. §09.2's formula target) | Validates the pricing formula against real delivery cost |

---

## 52. Legal / Compliance

PROFESSIONAL REVIEW REQUIRED throughout this entire section — it states the *questions this document identifies as needing resolution*, not resolved legal answers. No content here should be treated as legal or tax advice.

### 52.1 Company Structure

ASSUMPTION: a Limited Liability Partnership (LLP) or Private Limited Company structure (both common for small Indian services businesses) is more appropriate than an unregistered partnership, given the platform handles client payments and data from Day 0 (§35, §38) — the liability protection matters concretely here, not just formally. **OPEN DECISION, PROFESSIONAL REVIEW REQUIRED:** the specific choice between LLP and Private Limited depends on founder equity/investment plans (e.g., Private Limited is generally more suited if outside investment is ever sought, §01.9's long-term vision) and should be made with a company-secretary/CA's input before incorporation (§55, Day 0).

### 52.2 Contracts

Every client engagement requires a signed contract/Statement of Work before work begins (§34.1's `WON` transition) — covering scope (referencing the package definition, §08), payment terms (§09.6), IP ownership/transfer terms (§52.3), confidentiality, and termination/cancellation terms (§09.6). PROFESSIONAL REVIEW REQUIRED to draft the initial template (§51.1's startup-budget line item) — this document specifies *that* a contract is required and *what* it must cover, not the enforceable legal language itself.

### 52.3 Intellectual Property & Copyright

Standard practice (ASSUMPTION, to be confirmed in the contract template, §52.2): IP in final, paid-for deliverables transfers to the client upon full payment; Forge retains the right to display the work in its own portfolio (§20.5) unless the client specifically requests confidentiality (a common, reasonable client request — especially relevant for pre-launch/stealth-mode clients, §06 S4) — recorded as a flag on the `CaseStudy`/`Client` record (ASSUMPTION: a `portfolioUseAllowed boolean`, added to the schema, §29.6/§29.12) so this preference is structurally enforced rather than relying on someone remembering it.

### 52.4 Privacy & Data Protection

Forge collects and stores personal data (lead/client contact info, §29.4-29.5) and must comply with applicable Indian data-protection law (the Digital Personal Data Protection Act framework, ASSUMPTION as of this document's writing — PROFESSIONAL REVIEW REQUIRED to confirm current applicable obligations) and, once international clients are served (§06 S6), potentially GDPR-adjacent obligations for EU-connected data subjects. The Privacy Policy page (§20.24) must be drafted to accurately reflect the actual data practices documented in §29.13 and §38.11 — never a generic template disconnected from what the platform actually does.

### 52.5 Data Subject Requests

The platform's data model (§29) supports the practical mechanics of an access/erasure request (a `Client`/`User`'s data is identifiable and scoped, §31.8) even though a dedicated self-serve request UI is not built in V1 — requests are handled manually by a founder in V1 (ASSUMPTION: acceptable given expected Year-1 request volume; revisit if volume or regulatory obligation makes manual handling insufficient).

### 52.6 GST

ASSUMPTION: GST registration is required once Forge crosses the applicable turnover threshold for services (or immediately, depending on structure/state — PROFESSIONAL REVIEW REQUIRED) — invoices (§35, §29.11) are structured with GST-inclusive line-item support from Day 0 (`InvoiceLineItem` amounts can carry a tax-rate field, ASSUMPTION added to schema) so this isn't a schema change when registration becomes mandatory.

### 52.7 International Clients & Taxes

Serving international clients (§06 S6) raises export-of-services GST treatment questions and potential foreign-tax-withholding questions depending on the client's jurisdiction — PROFESSIONAL REVIEW REQUIRED before actively invoicing international clients (§55 gates this appropriately behind the domestic-traction milestone anyway, §06.3, giving time to resolve this properly rather than under time pressure).

### 52.8 Employment/Contractor Law

Once §54's hiring triggers are met, contractor vs. employee classification (with real legal/tax consequences in India) must be handled correctly per role — PROFESSIONAL REVIEW REQUIRED at that point; not a Day-0 concern given the current three-founders-only team.

---

## 53. Founder Structure

### 53.1 Domain Assignment

Three founders, each with a primary domain of leadership (final call within that domain, per §00.4's 2-of-3/tie-break rule) — while all three remain hands-on across the business, especially in Year 1 (§03.2, F2).

| Founder | Primary Domain | Covers |
|---|---|---|
| Founder 1 — Business & Growth Lead | Sales, client relationships, finance, operations | §46-47, §51, day-to-day P&L ownership |
| Founder 2 — Design & Brand Lead | Brand, UI/UX, creative direction, content/social | §11-16, §20-21, §48-49 |
| Founder 3 — Technology & Product Lead | Engineering, architecture, platform, security | §23-31, §38-45 |

This assignment is a starting allocation based on the assumed founding-team skill mix implied by the original brief (business/design/technical breadth needed to cover the full service menu, §07) — **ASSUMPTION**, to be confirmed/reassigned by the actual three founders based on real skills and preference, not treated as fixed by this document.

### 53.2 Decision Rights

| Decision type | Who decides |
|---|---|
| Within a founder's primary domain, day-to-day | That founder, unilaterally |
| Cross-domain or company-level (pricing changes, new service launch, hiring) | 2-of-3 agreement (§00.4) |
| Founder-structure changes (equity, roles, this section itself) | Unanimous (§00.4) |
| Emergency/time-sensitive (e.g., a security incident requiring immediate action) | Any founder can act unilaterally in the moment, with a mandatory debrief/Decision-Log entry (§59) within 48 hours |

### 53.3 Approval Rights

- Client-facing commitments (custom scope, non-standard discounts beyond §09.4's bounded rules) require the domain-lead founder's sign-off at minimum, 2-of-3 for anything beyond §09.4's stated bounds.
- Code changes: standard PR review (§45.2-45.3) — the Technology Lead (Founder 3) has final say on architecture-level disagreements, consistent with §00.4's domain tie-break rule.
- Brand/design changes: Founder 2 has final say on visual-identity-level disagreements, same principle.

### 53.4 Financial Authority

ASSUMPTION: joint signing authority on the company bank account with a stated threshold (e.g., any single expense/payment above ₹50,000 requires 2-of-3 confirmation, below that any founder can act) — PROFESSIONAL REVIEW REQUIRED to formalize this as an actual banking/company-structure control (§52.1), not just an internal norm.

### 53.5 Technical Authority

Founder 3 (§53.1) has final authority on architecture decisions that affect §23-28, subject to the same 2-of-3 override for company-level implications (e.g., a technology choice with meaningful cost implications is cross-domain, not purely technical).

### 53.6 Creative Authority

Founder 2 (§53.1) has final authority on brand/visual-identity decisions (§11-16) for the same reasons — a design system with three people able to unilaterally override its rules stops being a system (§13.1's whole justification for token-based consistency would erode if final creative say-so were unclear).

### 53.7 Disagreement Resolution

1. Discuss directly, referencing the relevant PLAN.md section and the Source of Truth Hierarchy (§00.7) if the disagreement is about which principle should win.
2. If unresolved, escalate to a 2-of-3 vote (§53.2) for anything short of a founder-structure decision.
3. If a founder-structure-level disagreement remains unresolved after direct discussion, PROFESSIONAL REVIEW REQUIRED (e.g., a founder agreement/mediation clause, ideally established proactively in the founders' agreement at company formation, §52.1, rather than improvised during an actual dispute).

---

## 54. Team Scaling

### 54.1 Principle

Hiring follows demonstrated capacity constraint, not anticipated growth (§02.6) — every trigger below is a *measured* condition, not a calendar date, so hiring timing responds to reality rather than a Day-0 plan that may not match how Year 1 actually unfolds.

### 54.2 Hiring Triggers

| Role | Trigger | Why this specific trigger |
|---|---|---|
| Contractor — Designer (part-time/project-basis first) | Any founder sustains >3 concurrent active design-heavy milestones for 2+ consecutive weeks (§34.3's WIP cap being persistently exceeded) | Concrete, measurable overload signal rather than a subjective "we're busy" feeling |
| Contractor — Developer | Same WIP-overload signal, development-specific; or a qualified Phase 2 web-app project (§07.2) is sold and exceeds current bandwidth | Ties hiring directly to revenue-generating capacity need, not speculative growth |
| Full-time Designer or Developer (converting from contractor) | A contractor engaged under the above triggers has sustained 3+ months of consistent utilization | Validates the demand is durable, not a temporary spike, before committing to fixed payroll cost (§51.3) |
| Sales/Business Development hire | Founder(s) collectively cannot respond to leads within the §46.2 SLA (1 business day) for 2+ consecutive weeks, AND MRR (§51.4) supports the added fixed cost | Protects the lead-response SLA that's core to the trust-building positioning (§01.7) without hiring ahead of revenue |
| Project Manager | Concurrent active project count exceeds what founder-level oversight (§46.4's QA gate, §34.3's WIP visibility) can maintain without quality slipping — a qualitative trigger, watched for via §46.4 QA-gate failure-rate upticks as an early warning sign | A PM role only has clear value once there's genuinely too much concurrent work for founders to personally track — hiring one earlier just adds a coordination layer with nothing yet to coordinate |
| Marketer (dedicated) | Content/social production (§49) consistently falls behind the published cadence (§08.3's package commitments) due to founder bandwidth | Protects retainer-client-facing commitments specifically, since missed content cadence directly damages the retention thesis (§46.7) |
| Contractors (video/3D/mobile, tied to Phase 2/3 services, §07.2-07.3) | The specific service's launch trigger (already stated per-service in §07.2-07.3) is met | Service-launch and hiring-for-that-service are the same decision, not sequenced separately |

### 54.3 Contractor-First Philosophy

Every role above is triggered as a contractor/part-time engagement first, converting to full-time only after sustained utilization (§54.2's Designer/Developer row) — this reduces fixed-cost risk during the period when demand durability is still being confirmed, directly serving §02.6 (sustainable growth) and §51.3 (founder-compensation-first cash discipline).

### 54.4 What Hiring Does NOT Fix

Hiring is never used to compensate for a broken process (§34, §46) — if quality or timeline problems stem from an undocumented/ad-hoc process rather than genuine capacity shortage, the fix is process discipline (enforcing what §34/§46 already specify) before adding headcount, since adding people to a broken process compounds the problem rather than solving it (a restatement of a well-known operations principle, applied here deliberately).

---

## 55. Roadmap

### 55.1 Day 0

- **Objective:** Legal, brand, and technical foundations started simultaneously so no single track blocks the others.
- **Tasks:** Initiate company registration (§52.1, PROFESSIONAL REVIEW REQUIRED — kicked off, not necessarily completed same day); register domain; lock brand identity basics (logo direction, palette, type — §11-14, Founder 2); initialize the git repository with the structure in §25; all three founders ratify PLAN.md (§00.3's status moves from DRAFT toward accepted).
- **Dependencies:** None — this is the starting point.
- **Owner:** All three founders, per §53.1 domain split.
- **Deliverable:** Registered domain, repo initialized, brand basics locked, legal process started.
- **Definition of Done:** PLAN.md ratified; repo exists with the §25 skeleton committed.
- **Success metric:** All four Day-0 tasks started within the same week.

### 55.2 Week 1

- **Objective:** Begin sales motion immediately (§01.10) while technical foundation is built in parallel.
- **Tasks:** Founder outreach begins (§47.1-47.2); SOW/contract template drafting started (§52.2, PROFESSIONAL REVIEW REQUIRED); Next.js app scaffolded (§23, §25); design tokens (§13-15) implemented in `globals.css`/`tailwind.config.ts`; Auth.js configured (§31); Prisma schema (§29) drafted and first migration run against a dev database.
- **Dependencies:** 55.1 complete.
- **Owner:** Founder 1 (outreach), Founder 3 (technical scaffolding), Founder 2 (tokens/brand-in-code).
- **Deliverable:** A running (unstyled-content) local dev environment; first outreach contacts made.
- **Definition of Done:** `npm run dev` runs locally with auth and DB connected; ≥10 outreach contacts made.
- **Success metric:** At least 1 discovery call scheduled by end of week.

### 55.3 Week 2

- **Objective:** Core marketing pages and component library exist; database schema is real.
- **Tasks:** Build `components/ui/*` core primitives (§16.1-16.4); build Homepage, Services overview, and one Service page (§20.1-20.3); implement the full `Lead`/`User`/`Client`/`Project` schema (§29.4-29.7); continue outreach and discovery calls.
- **Dependencies:** 55.2.
- **Owner:** Founder 2 (design/component build), Founder 3 (schema), Founder 1 (calls/qualification).
- **Deliverable:** Homepage + Services pages functional in a Preview deployment (§44.1).
- **Definition of Done:** Preview URL is shareable and reviewable by all three founders.
- **Success metric:** ≥3 qualifying discovery calls completed.

### 55.4 Week 3

- **Objective:** Site nears public-launch readiness; first proposal(s) go out.
- **Tasks:** Build remaining marketing pages (About, Process, Pricing, Contact — §20.6-20.9); wire the Contact form end-to-end (§21.9, §26.4-26.5); build a minimal admin lead-list view (§33.2); send first proposal(s) (§33.6, §47.5).
- **Dependencies:** 55.3.
- **Owner:** Founder 2 (remaining pages), Founder 3 (form/admin wiring), Founder 1 (proposals).
- **Deliverable:** Full marketing site content-complete in Preview; ≥1 proposal sent.
- **Definition of Done:** Every §18.1 marketing URL renders real (not placeholder) content.
- **Success metric:** ≥1 proposal sent; site ready for public launch pending final QA.

### 55.5 Week 4

- **Objective:** Public launch of the marketing site; first client signed; minimal portal ready for onboarding.
- **Tasks:** Final QA pass (§43.4's pre-launch checklist, §67); publish to production (§44); build minimal portal V1 (Dashboard, Project detail, Files, Invoices — §20.14-20.18) sufficient for a first client's actual project; close first client (§47.6) if a proposal is accepted.
- **Dependencies:** 55.4.
- **Owner:** All three founders.
- **Deliverable:** Live public marketing site; first signed client, if sales timing allows.
- **Definition of Done:** Site live at the production domain; §67's pre-launch checklist passed.
- **Success metric:** Marketing site live; 1+ client signed or in final negotiation.

### 55.6 Month 2

- **Objective:** First project(s) in active production; content engine starts.
- **Tasks:** Onboard and begin production on signed client(s) (§46.4); publish first 2-4 blog posts (§49); implement sitemap/schema/OG (§22.5-22.7); begin building out the admin's project/proposal views more fully (§33.4, 33.6).
- **Dependencies:** 55.5.
- **Owner:** Rotates per project per §53.1's domain-appropriate delivery work; Founder 2 leads content.
- **Deliverable:** First project(s) progressing through milestones; blog live with real content.
- **Success metric:** 3-5 total signed clients; first milestone deliveries on schedule.

### 55.7 Month 3

- **Objective:** First retainer conversion; QA/delivery process proven, not just documented.
- **Tasks:** Deliver first project(s), run the retainer pitch (§46.5); formalize the QA checklist (§46.4) based on real learnings from Month 2's production work; publish first real case study (§20.5) from delivered work.
- **Dependencies:** 55.6.
- **Owner:** Delivering founder per project; Founder 1 leads retainer conversations.
- **Deliverable:** First retainer client (target); first published case study.
- **Success metric:** ≥1 retainer conversion; §51.8's key metrics being tracked with real data for the first time.

### 55.8 Month 4-6

- **Objective:** Portfolio credibility builds; sales/delivery rhythm becomes repeatable; Phase 2 triggers actively monitored.
- **Tasks:** Continue sales/delivery cycle; grow published case studies toward the 8-10 needed to responsibly pursue ICP S6 (§06.3); evaluate Phase 2 service triggers (§07.2) against real lead patterns (§04.3's H3 hypothesis test); evaluate first contractor-hiring trigger (§54.2).
- **Dependencies:** 55.7.
- **Owner:** All three founders, per §53.
- **Deliverable:** 8-10 case studies; a founder decision (Decision Log entry, §59) on whether any Phase 2 service or contractor hire is triggered.
- **Success metric:** Revenue/MRR tracking toward the Realistic scenario (§51.4) trajectory; retainer attach rate (§10.2) validated with real data (§04.3's H1/H2 hypotheses tested).

### 55.9 Month 7-12

- **Objective:** Scale what's proven; begin cautious international outreach; approach Year-1 financial targets.
- **Tasks:** Launch any Phase 2 services whose triggers were met (§07.2); begin S6 international outreach if the portfolio gate (§06.3) is satisfied; formalize first full-time hire if §54.2's conversion trigger is met; run the full §51.4 Realistic-scenario tracking.
- **Dependencies:** 55.8.
- **Owner:** All three founders.
- **Deliverable:** Year-1 close: MRR/ARR figures against the §51.4 scenarios; a written retrospective (informal, but real — feeding Year 2 planning).
- **Success metric:** Realistic-scenario MRR (§51.4) reached or a documented, honest account of the gap and why (§00.7-consistent — facing a miss honestly rather than reframing it).

### 55.10 Year 2

- **Objective:** Evaluate the productized/SaaS layer (§01.11, §57) and Phase 3 services (§07.3) from a position of proven service-delivery stability, not speculation.
- **Tasks:** Formal review of whether §07.3/§57's stated triggers have been met; team-scaling review against §54; brand/positioning refresh review if market data (§04) has meaningfully shifted.
- **Dependencies:** 55.9, and specifically the "2+ consecutive quarters of stable, retainer-funded revenue" trigger stated in §07.3.
- **Owner:** All three founders.
- **Deliverable:** A Year-2 strategic plan, itself a PLAN.md revision (§00.4-00.5) rather than a separate document — this document's own §00.4 change process is the mechanism by which Year 2 planning actually happens.

---

## 56. MVP Definition

"V1"/MVP is precisely: **the marketing site (§20.1-20.11) + a minimal client portal (Dashboard, Project detail with milestone approval, Files, Invoices, Settings — §20.14-20.19) + a minimal admin (Leads, Clients, Projects, Proposals, Invoices — §33.2-33.8) supporting the Launch service menu (§07.1) end-to-end.** Everything else is Phase 2/3 (§07.2-07.3) or explicitly Deferred (§57).

| Feature | Priority | Reason | Dependency | Owner | Status |
|---|---|---|---|---|---|
| Marketing site (all §18.1 pages) | P0 | No sales motion works without a credible web presence (§01.5) | Brand basics (§55.1) | Founder 2 | Planned (§55.2-55.5) |
| Contact form -> Lead pipeline | P0 | Primary inbound conversion mechanism (§21.9) | Marketing site | Founder 3 | Planned (§55.4) |
| Admin: Leads, Clients, Projects, Proposals | P0 | Sales cannot run without pipeline visibility (§33.2-33.6) | DB schema (§29) | Founder 3 | Planned (§55.3-55.6) |
| Client portal: Dashboard, Project detail, Milestone approval | P0 | Core visibility promise (§03.1 C2) — the platform's central differentiation | Project schema, state machine (§29.7, §34) | Founder 3 | Planned (§55.5) |
| Client portal: Files | P0 | Deliverables must reach clients somewhere other than email (§36) | Storage integration (§23.2) | Founder 3 | Planned (§55.5) |
| Invoicing + Razorpay payment | P0 | Revenue collection is non-negotiable for MVP (§35) | Razorpay integration | Founder 3 | Planned (§55.5-55.6) |
| Notifications (email, core events) | P0 | Portal value collapses without timely notification (§37) | Resend integration | Founder 3 | Planned (§55.4-55.5) |
| Admin: Content CMS (blog/case studies) | P1 | SEO/content strategy (§48-49) needs it, but can start with a handful of hand-coded posts if truly necessary | Admin base | Founder 2/3 | Planned (§55.6) |
| Retainer billing automation (scheduled monthly invoices) | P1 | Needed once the first retainer converts (~Month 3, §55.7), not Day 0 | Invoice system | Founder 3 | Planned (§55.6-55.7) |
| In-app notification preferences (§37.4) | P2 | Nice-to-have refinement; email-only is acceptable for early volume | Notification system | Founder 3 | Deferred to post-launch polish |
| Retainer content-calendar approval UI | P2 (V1: file/PDF + comment) | Real need but not launch-blocking (§32.1) | Portal comments/files | Founder 2/3 | Deferred (§57) |
| Everything in §57 | Explicitly out of MVP | See §57 for individual reasoning | — | — | Deferred |

---

## 57. Deferred Features

Consolidated from the deferral notes scattered through §07, §18, §32-33, §35, §48, and §50 — gathered here as one reference list so "is X deferred, and why" never requires hunting across the document.

| Feature | Why tempting | Why deferred | Trigger for reconsideration |
|---|---|---|---|
| Mobile applications (native) | "Every modern platform needs an app" is a common but often-wrong instinct | Responsive web (§17) serves V1 client needs; native has real ongoing platform-maintenance cost (§07.3) | A specific client need that genuinely requires native (not just "would be nice"), with mobile-capable dev capacity in place |
| 3D modeling/visualization service | Visually impressive, differentiating in a portfolio | No current team skill/tooling; niche demand relative to core ICPs (§07.3) | Demonstrated recurring demand from D2C/product clients |
| Full productized/SaaS product | The long-term vision (§01.11) — exciting, the "real" destination | Building it before the service business is stable risks both (§05.3) | 2+ consecutive quarters of stable, retainer-funded revenue (§07.3) |
| Public self-serve portal signup | Feels more "modern SaaS" than invite-only | Adds unauthenticated attack surface for zero business benefit (§18.4, §31.1) | Not anticipated to ever be reconsidered under the current invite-gated onboarding model — would require a fundamentally different sales motion to justify |
| Live chat widget on marketing site | Feels responsive/modern | Requires real-time staffing three founders don't have (§18.4) | Dedicated support/success hire (§54) with bandwidth to staff it |
| Real-time in-portal chat (vs. comment threads) | Feels more "instant" than comments | Comment threads + notifications (§32.5, §37) cover V1 volume; real-time infra is added complexity (§02.7) | Comment-thread response-time data shows a real need for instant messaging |
| In-house e-signature for contracts | Full control over the flow, no external tool dependency | Large, security-sensitive scope with no differentiation value (§32.1) | Not anticipated — external e-signature tools solve this well and cheaply |
| Database-backed, admin-editable package/pricing | More flexible than a code-level config file | Pricing changes are rare, deliberate, and benefit from code review (§26.7) | Package configuration needs to change frequently enough that deploy-per-change becomes real friction |
| External CRM integration | Feels more "enterprise" | The admin's own Lead/Client views ARE the CRM at this data volume (§21.9) | Lead volume exceeds what the admin's built-in views can reasonably manage |
| Automated dunning/refund workflows | Reduces manual payment-chasing work | Rare enough at Year-1 volume to handle manually (§35.5-35.6) | Refund/failed-payment volume grows enough to justify automation |
| Email newsletter | Compounding content-marketing asset | No substantial subscriber base exists yet; premature before content/audience base is built (§48.1, §48.5) | A meaningful blog-reader base exists to make a newsletter worth the production effort |
| Paid advertising | Faster lead volume than organic | Capital-intensive relative to Year-1 budget; no conversion-data baseline yet to spend against efficiently (§48.1, §48.7) | Organic-channel conversion data (§41) establishes a defensible payback-period baseline |
| WhatsApp Business API notification channel | Matches a real regional communication preference (§04.7) | Email covers V1 transactional volume/urgency adequately (§37.1) | Client feedback or observed low email-engagement signals a real need |
| Client-facing AI service offerings | Market momentum, visible demand for "AI-powered" services (§04.6) | Forge's own internal AI workflow must be proven first; unscoped "AI-powered" claims contradict §11.5's honesty rule (§50.6) | Internal AI workflow runs reliably for 2+ months AND a specific, well-scoped offering can be defined |
| Headless CMS (third-party) replacing the in-app content model | More powerful editing experience | Current content volume doesn't justify the added vendor relationship/cost (§23.2) | Content volume/editorial complexity grows enough that a non-technical hire needs much richer tooling |
| Formal on-call/paging system (PagerDuty-style) | "Real" companies have this | Three founders, low Year-1 traffic — a missed alert for a few hours is an acceptable risk at this stage (§45.8) | Team-scaling triggers in §54 are met and traffic/stakes grow accordingly |
| Dedicated internal task-management system (built into Forge's own product) | Would unify everything in "one tool" | No client-facing purpose; an off-the-shelf tool solves the founders' own planning need adequately (§32.3, §34.5) | Not anticipated — this is a deliberate, likely-permanent scope boundary, not a timing question |
| Fine-grained internal role hierarchy (beyond CLIENT/TEAM) | Feels more "enterprise-ready" | No real distinction exists yet with 3 co-equal founders (§31.7) | §54's first hire creates a genuine "what should a new hire NOT access" question |
| Custom report-builder in admin analytics | Flexible, powerful-sounding | No requester, no current need beyond the curated KPI set (§33.10) | A specific, repeated reporting need emerges that the curated KPI set can't answer |
| Multi-project Gantt/roadmap view in the portal | Looks sophisticated | No current client has enough simultaneous projects to need it (§32.1) | Client base's average concurrent-project count rises meaningfully |
| Client-editable scope/requirements documents | Feels collaborative | Undermines the fixed-scope package model the business is built on (§32.1, §08.5) | Not anticipated under the current productized-package model — would require a business-model change, not just a feature addition |

---

## 58. Risks

Probability and Impact are rated Low/Medium/High for Year-1 conditions specifically — both should be re-rated periodically (§00.5), not treated as fixed.

| ID | Risk | Probability | Impact | Warning Signs | Prevention | Response |
|---|---|---|---|---|---|---|
| R-01 | Overselling beyond delivery capacity, quality collapses | Medium | High | WIP-per-founder (§34.3) persistently over cap; QA-gate (§46.4) failure rate rising | WIP cap visibility (§34.3); sales qualification discipline (§47.3) | Pause new sales temporarily; triage active projects; be transparent with affected clients about timeline |
| R-02 | Founder burnout / unavailability (illness, personal) | Medium | High | Sustained overtime, missed SLAs (§46.2) | Realistic WIP caps (§02.6); contractor bench started early (§54.3) | Redistribute the affected founder's active projects among the other two; communicate proactively with clients |
| R-03 | Founder disagreement causes decision paralysis | Medium | Medium | Repeated unresolved Decision Log entries (§59) on the same topic | Clear decision-rights structure (§53.2-53.3); Source of Truth Hierarchy (§00.7) | Escalate per §53.7; if truly stuck, default to the domain-lead founder's call and revisit later with real data |
| R-04 | Underpricing erodes margins as real costs become clear | Medium | Medium | Actual project hours consistently exceed the §09.2 formula's estimate | Formula-based pricing with margin floor (§09.2); track actual vs. estimated hours per project | Recalculate and raise published prices (§09.3); apply learnings to the formula's hour estimates |
| R-05 | Client non-payment / bad debt | Low-Medium | Medium | Overdue invoice flags (§35.3) accumulating for one client | Milestone-based payment structure front-loads risk protection (§09.6, §51.7) | Pause further work at the next unpaid milestone; escalate per the contract's terms (§52.2) |
| R-06 | Scope creep despite documented package boundaries | Medium | Medium | Frequent unbilled "just one more thing" requests | Explicit inclusion/exclusion lists (§08); change-order pricing (§09.5) | Enforce the change-order process consistently, even when uncomfortable — inconsistent enforcement undermines the whole model |
| R-07 | Quality inconsistency across the three founders' individual work | Medium | High | Client feedback differs noticeably by which founder delivered | Shared design system (§13-16) and QA checklist (§46.4) as consistency mechanisms | Cross-founder review before client-facing delivery, especially in each founder's non-primary domain |
| R-08 | Negative public review / reputation damage | Low | High | A dissatisfied client escalates publicly rather than through the relationship | Consistent quality bar (§02.2); honest expectation-setting (§07.4, §11.5) prevents most disputes before they start | Respond promptly and professionally; resolve the underlying issue; never respond defensively/publicly-argumentatively |
| R-09 | Data breach / security incident | Low | High | Unusual access patterns, failed-login spikes (§38.12) | §38's full security architecture; minimal PII collection (§38.7); no stored payment data (§35.2) | Follow an incident-response process (PROFESSIONAL REVIEW REQUIRED to formalize one before it's needed); notify affected parties per applicable law (§52.4) |
| R-10 | Payment provider outage or account dispute | Low | Medium | Razorpay service status alerts | Provider abstraction in `lib/payments/` (§23.2) reduces (not eliminates) switching cost | Communicate delay to affected clients; escalate with provider support; Stripe integration (§23.2) provides a partial fallback path once built |
| R-11 | Key vendor price increase or shutdown (hosting, DB, storage) | Low-Medium | Medium | Vendor pricing/policy announcements | Standard, portable technology choices (§23.2's migration-implication column) avoid deep lock-in | Execute the documented migration path for the affected layer; budget buffer (§51.2) absorbs modest price increases |
| R-12 | Contractor unreliability (missed deadlines, quality gaps) | Medium | Medium | Late/low-quality contractor deliverables | Contractor-first, trial-before-convert hiring philosophy (§54.3) | Maintain the QA gate (§46.4) for contractor work with zero exception; have a backup contractor relationship where feasible |
| R-13 | Legal/compliance misstep (contract gap, GST, IP dispute) | Low-Medium | Medium-High | Recurring client questions the contract doesn't clearly answer | Professional-reviewed contract template (§52.2) used consistently, no ad-hoc verbal agreements | PROFESSIONAL REVIEW REQUIRED promptly on any specific incident; do not attempt to resolve a real legal dispute without counsel |
| R-14 | Cash flow gap during a slow sales month | Medium | Medium | Pipeline value (§20.20) trending down for 2+ consecutive weeks | Low fixed costs (§51.2); milestone/retainer front-loaded billing (§51.7) | Intensify outreach (§47.2); delay discretionary spend; draw down founder-compensation buffer if one exists |
| R-15 | Over-reliance on founder network for leads; network exhausts | Medium | Medium | Outreach-to-qualified-call conversion rate declining over Month 2-4 | Parallel channel investment from Day 0 (§48.1 — referral, content/SEO, not network alone) | Accelerate content/SEO investment (§48.3, §49) ahead of the originally planned Month 4-6 timeline if needed |
| R-16 | Retainer churn higher than the §51.4 model assumes | Medium | Medium-High | Cancellation notices (§09.6) exceeding modeled attrition | Value-visible retainer delivery (monthly reports, §08.3-08.4); no-lock-in model builds trust rather than resentment (§46.7) | Conduct honest churn-reason interviews; adjust the retainer offering or delivery quality based on real feedback, not assumption |
| R-17 | Competitor undercutting on price | Medium | Low-Medium | Lost deals citing price specifically, from comparably-scoped competitors | Value-based positioning (§01.7-01.8, §09.1) targets clients who aren't purely price-driven | Reinforce differentiation in sales conversations (§47.4); resist the urge to discount outside §09.4's bounded rules |
| R-18 | AI tools commoditize Launch-service work faster than Forge adapts | Medium | Medium | Declining inbound interest in commodity-tier offerings (e.g., basic logo/copy work) specifically | Internal AI adoption (§50) keeps Forge's own delivery efficient; positioning centers on judgment/accountability, not raw production speed (§04.6) | Accelerate the shift toward strategy/process-differentiated positioning; consider retiring the most commoditized package tiers |
| R-19 | Broader market downturn reduces SMB marketing/dev budgets | Low-Medium | High | Macro indicators; rising lead-to-close cycle length industry-wide | Diversified segment focus (§06) and low fixed-cost structure (§51.2, §51.6) provide resilience | Shift focus toward retention/retainer revenue (more resilient than new-project sales in a downturn) and toward recession-resistant segments |
| R-20 | Technical debt accumulates from moving fast pre-launch | Medium | Low-Medium | Increasing bug rate, slowing feature-delivery velocity | Coding standards (§28), code review (§45.3), test coverage requirements (§43.7) from Day 0 | Schedule dedicated debt-paydown time once past initial launch pressure (§55.6+) rather than perpetually deferring it |
| R-21 | Single point of failure: one founder holds disproportionate technical/design knowledge | Medium | Medium | Only one founder can resolve a given class of issue | Documentation discipline (§26, this document itself); code review spreads knowledge (§45.3) | Cross-training time explicitly budgeted; treat as a standing agenda item, not a one-time fix |
| R-22 | Client IP/content dispute (e.g., unlicensed third-party assets used in a delivered project) | Low | Medium | Client or third party raises a usage-rights question | Asset-licensing discipline in production process (§46.4's QA checklist should include a license-check item) | PROFESSIONAL REVIEW REQUIRED; resolve per the contract's IP terms (§52.3) |
| R-23 | Founder equity/exit disagreement | Low | High | Any founder expressing serious intent to leave | A founders' agreement addressing exit/vesting (PROFESSIONAL REVIEW REQUIRED, §52.1) established early, before it's needed under pressure | Follow the founders' agreement's process; avoid improvising equity decisions during an active dispute |
| R-24 | Currency/FX risk on international payments (Phase 2+, §06 S6) | Low (Year 1) | Low-Medium | Only relevant once international invoicing begins | Stripe's native multi-currency handling (§23.2); price in the client's local currency where practical | Absorb minor FX fluctuation as a cost of doing international business; reprice if fluctuation becomes material |
| R-25 | Regulatory change (data protection law evolution) | Low-Medium | Medium | New legislation/amendments announced | Data model already scoped/identifiable per user (§29, §52.5) rather than sprawling, easing adaptation | PROFESSIONAL REVIEW REQUIRED to assess and implement any required changes promptly |
| R-26 | Over-investment in premature platform features (self-inflicted, contradicts this document's own principles) | Medium | Medium | A feature ships that has no traced justification per §66's "why" index | This entire document's structure (§02.7, §64, MVP discipline §56) exists specifically to prevent this | Any founder can flag a feature against §02.7/§64 and request a Decision Log review (§59) before/after building it |
| R-27 | Under-investment in QA leads to a visibly bad client delivery | Low-Medium | High | QA checklist (§46.4) skipped or rushed under deadline pressure | QA gate is structurally required before client-visibility (§34.2's transition guard), not just a policy | Treat any bypass as a serious process failure requiring a Decision Log-style incident note, not a one-off excused exception |
| R-28 | Revenue concentration risk (losing one large retainer client materially hurts MRR) | Medium | Medium | Any single client exceeds ~15-20% of total MRR | Segment diversification (§06); active new-client acquisition even while retainers grow | Accelerate acquisition efforts if concentration is identified; avoid becoming dependent on any single account |
| R-29 | Founder time misallocated toward admin over delivery/sales | Medium | Medium | Founder-reported time split (§46.8) skewing toward admin | Platform automation (§32-37) specifically targets this category for reduction | Periodically audit where founder hours actually go; invest further automation effort where the audit shows the biggest gap |
| R-30 | Brand/positioning doesn't resonate as expected once tested with real prospects | Medium | Medium | Consistent objections that §11's positioning doesn't address well | Positioning is explicitly flagged with VALIDATION REQUIRED (§01.7, §04) rather than assumed correct | Revise messaging (§11.5) based on real objection patterns from §47.4's calls — treat brand messaging as testable, not fixed |
| R-31 | File/data loss due to backup failure | Low | High | Failed backup-verification check (§45.4) | Automated daily backups + monthly restore verification (§45.4) | Restore from the most recent verified backup; if verification itself has been failing, this is a process failure requiring immediate correction |
| R-32 | Fraudulent lead submissions or payment fraud attempts | Low-Medium | Low-Medium | Spam-pattern leads (§21.9's spam prevention), suspicious payment patterns | Honeypot + rate limiting (§21.9); Razorpay's own fraud detection on the payment side (§35) | Block/ignore confirmed spam sources; escalate suspected payment fraud to Razorpay's dispute process |

---

## 59. Decision Log

Full ADR format per §00.5. Entries are compact by design — the full reasoning lives in the referenced section; this log records *that a decision was made, when, against what alternatives* so the history is searchable without duplicating the section prose.

**ADR-001 — Brand identity: "Forge Digital"**
Status: Accepted (ASSUMPTION pending real founder ratification). Date: 2026-08-25. Context: No name was specified in the founding brief; every downstream section needed a concrete identity to stay consistent (document header). Decision: Adopt "Forge Digital" / "Forge," built around a craft/durability metaphor. Alternatives: Generic "Studio"/"Digital Co." naming — rejected for carrying no distinct meaning to build a visual/verbal identity system around (§11.1). Consequences: All brand, visual, and code-level tokens (`forge-*`, `FORGE_`) trace to this name. Revisit when: Founders choose a different name — see the document header for the substitution scope.

**ADR-002 — Business model: Hybrid Productized Agency + Retainer**
Status: Accepted. Context: §05.1-05.2's model comparison. Decision: Productized project packages with a mandatory retainer pitch at delivery (§05.3). Alternatives: Pure agency, marketplace, Agency+SaaS-first — scored lower (§05.2) or premature (§05.3). Consequences: Requires disciplined package definition (§08) and a structured delivery-stage sales step (§46.5) to actually work. Revisit when: Retainer attach-rate data (§51.8) after 6 months suggests the model isn't converting as assumed (§04.3, H1).

**ADR-003 — Technical stack: Next.js monolith, single deployed app**
Status: Accepted. Context: §23.2's requirement-by-requirement evaluation. Decision: Next.js (App Router) covering marketing, portal, and admin in one deployment, no separate backend service. Alternatives: Separate SPA + API service — rejected as premature-scale complexity (§02.3, §23.2). Consequences: Business logic (`features/*`, §27.2) kept framework-decoupled specifically to ease a future extraction if ever needed. Revisit when: Independent API scaling becomes a real, measured need (unlikely before significant growth).

**ADR-004 — Database: PostgreSQL + Prisma**
Status: Accepted. Context: Relational client/project/invoice data with real integrity requirements (§23.2, §29.1). Decision: Managed PostgreSQL, Prisma ORM. Alternatives: NoSQL (rejected — would hand-build relational integrity Postgres gives free), Drizzle ORM (viable, Prisma chosen for migration tooling maturity). Consequences: Schema-first workflow (§26.8); standard SQL keeps provider migration low-risk. Revisit when: Never anticipated for the relational model itself; provider (not engine) may change per §23.3.

**ADR-005 — Authentication: Auth.js, database sessions, invite-only client signup**
Status: Accepted. Context: §23.2, §31.1. Decision: Auth.js credentials provider, database-backed sessions, no public client self-signup. Alternatives: Managed auth-as-a-service (Clerk/Auth0) — rejected on recurring per-user cost at Year-1 scale; hand-rolled auth — rejected per §38's "don't roll your own" security principle. Consequences: Session revocation is possible (§31.6); invite-only removes an entire attack-surface category (§31.1). Revisit when: Not anticipated to change without a fundamental business-model shift (e.g., open self-serve products, §57).

**ADR-006 — Payments: Razorpay primary (India), Stripe deferred (international)**
Status: Accepted. Context: §23.2, §06 S6. Decision: Razorpay for all Year-1 (domestic) payments; Stripe added additively when international clients are actively pursued. Alternatives: Stripe-only — rejected for weaker India-specific payment-method (UPI/netbanking) coverage. Consequences: `lib/payments/` structured to add providers additively (§23.2's migration-implication note). Revisit when: ICP S6's portfolio gate (§06.3) is met.

**ADR-007 — No public API product**
Status: Accepted. Context: §18.4, §30.1. Decision: The API serves only Forge's own frontend surfaces; no versioning scheme, no public docs. Alternatives: Building a versioned public API preemptively — rejected, no current consumer (§26.10's "no APIs without consumers" rule, §64). Revisit when: A concrete business reason for third-party API access emerges (not currently anticipated).

**ADR-008 — Launch service menu kept narrow (8 services), not the full brief-listed menu**
Status: Accepted. Context: §07.1-07.4. Decision: 8 Launch services; mobile apps, 3D, paid-media management, and others explicitly phased or avoided. Alternatives: Launching the full service list from Day 0 — rejected per §02.2 (quality over quantity) and §03.2 (F2, limited founder bandwidth across disciplines). Consequences: Some inbound demand for non-Launch services will be observed and deliberately not chased early (§04.3, H3). Revisit when: Phase 2/3 triggers (§07.2-07.3) are individually met.

**ADR-009 — Pricing: published, value-based packages with a bounded discount policy**
Status: Accepted. Context: §09.1-09.4. Decision: Fixed package price bands published on the site; discounts limited to stated, logged rules; no ad-hoc deal-by-deal pricing. Alternatives: "Contact for pricing" opacity (common market default) — rejected per §02.5. Consequences: Requires founder discipline to hold the line on §09.4's bounds under sales pressure. Revisit when: Sustained >70% quote-acceptance signals underpricing (§09.3) — OPEN DECISION on the exact threshold.

**ADR-010 — No unlimited revisions; numbered rounds with a paid overage fee**
Status: Accepted. Context: §08.5, §09.5. Decision: Every package states a fixed revision-round limit; extra rounds are a flat paid add-on. Alternatives: Unlimited revisions as a competitive differentiator — rejected as structurally reproducing the scope-creep problem (§03.1, C3) Forge exists to fix. Revisit when: Not anticipated — this is close to a core-principle-level decision (§02.7), not a tactical one.

**ADR-011 — Two roles only (CLIENT, TEAM) in V1**
Status: Accepted. Context: §31.7. Decision: No internal role hierarchy among the three founders; a single TEAM role for all internal access. Alternatives: A granular internal permission system — rejected as speculative complexity with no current distinction to encode (§02.7). Revisit when: §54's first hire creates a genuine access-restriction need.

**ADR-012 — In-app content model instead of a third-party headless CMS**
Status: Accepted. Context: §23.2. Decision: Blog/case-study content lives in Forge's own database, edited via the admin app. Alternatives: Sanity/Contentful/Strapi — rejected as unjustified added vendor cost/complexity at current content volume (§02.7). Revisit when: Editorial complexity or a non-technical content hire's needs outgrow the in-app editor.

**ADR-013 — No global client-state store (Redux, etc.)**
Status: Accepted. Context: §27.6, §26.10. Decision: Server state via Server Components; local/scoped state via React primitives; no global store. Alternatives: Redux/Zustand "for scale" — rejected, no current state complexity that justifies it (§02.7, §64). Revisit when: A genuine, specific cross-cutting client-state need emerges that colocated/Context-based state can't reasonably solve.

**ADR-014 — Contractor-first hiring, before any full-time hire**
Status: Accepted. Context: §54.2-54.3. Decision: Every new role is trialed as a contractor engagement first. Alternatives: Hiring full-time ahead of demonstrated demand — rejected per §02.6 (sustainable growth) and §51.3 (cash discipline). Revisit when: Individually, per §54.2's per-role conversion triggers.

**ADR-015 — Deferred productized/SaaS layer to Year 2+**
Status: Accepted. Context: §05.3, §07.3, §01.11. Decision: The long-term SaaS/product vision is explicitly not built until service-delivery revenue is stable for 2+ consecutive quarters. Alternatives: Building it in parallel from Day 0 — rejected as splitting founder attention across two unproven things at once (§02.3, §02.6). Revisit when: The stated trigger is met (§07.3).

**ADR-016 — No CAPTCHA on the Contact form; honeypot + rate limiting instead**
Status: Accepted. Context: §21.9. Decision: Spam prevention via an invisible honeypot field and IP rate limiting, no visible CAPTCHA challenge. Alternatives: Visible CAPTCHA — rejected as a measurable hit to legitimate form-completion rates for a problem the lighter-weight approach likely solves adequately at V1 traffic. Revisit when (OPEN DECISION): Spam volume becomes a real, measured problem post-launch.

**ADR-017 — Dark mode: token-architected, not required for MVP**
Status: Accepted. Context: §13.6, §15.9. Decision: The token system supports theming structurally from Day 0, but dark-theme UI is not required to ship in V1. Alternatives: Building dark mode fully in V1 — deprioritized as non-blocking polish relative to P0 MVP features (§56). Revisit when: Founder/design bandwidth allows, post-launch (OPEN DECISION on exact timing).

**ADR-018 — QA gate is a structural transition guard, not a policy reminder**
Status: Accepted. Context: §34.2, §46.4. Decision: A milestone cannot become client-visible (`AWAITING_APPROVAL`) without passing the internal QA checklist — enforced in code (§26.6), not left to founder discipline alone. Alternatives: A documented-but-unenforced QA policy — rejected because §00.7 ranks security/integrity-adjacent guarantees above convenience, and an unenforced policy is exactly the kind of gap R-27 (§58) describes. Revisit when: Not anticipated — this is a core delivery-quality guarantee, not a tactical choice.

---

## 60. Implementation Task Tree

Structured as EPIC -> FEATURE -> TASK, mapping directly onto §55's roadmap and §56's MVP table. Task-level acceptance criteria reference the section that already defines "done" for that piece of work, rather than restating it.

```text
EPIC 1: Foundation
├── FEATURE 1.1: Legal & Brand Setup (§55.1)
│   ├── TASK: Initiate company registration — Owner: Founder 1 — AC: PROFESSIONAL REVIEW REQUIRED
│   │         engagement started (§52.1)
│   ├── TASK: Lock logo/palette/type — Owner: Founder 2 — AC: matches §12-14 spec
│   └── TASK: Register domain — Owner: any founder — AC: domain resolves
├── FEATURE 1.2: Repo & Environment Setup (§25)
│   ├── TASK: Scaffold Next.js app with §25.1 folder structure — Owner: Founder 3 — AC: builds clean
│   ├── TASK: Configure Tailwind + design tokens (§13-15) — Owner: Founder 3 — AC: `bg-surface` etc.
│   │         resolve correctly in both a light-theme test render
│   ├── TASK: Configure Prisma + initial schema (§29) — Owner: Founder 3 — AC: migration runs clean
│   ├── TASK: Configure Auth.js (§31) — Owner: Founder 3 — AC: login/logout works against seed data
│   └── TASK: Set up CI (§45.2-45.3) — Owner: Founder 3 — AC: lint/typecheck/test run on PR

EPIC 2: Marketing Website (§20.1-20.11, §56 P0)
├── FEATURE 2.1: Core Pages
│   ├── TASK: Homepage (§20.1) — AC: all 10 listed sections present, passes §43.5 Lighthouse budget
│   ├── TASK: Services overview + 8 service pages (§20.2-20.3) — AC: content sourced from
│   │         config/packages.ts per §21.3, not hand-duplicated
│   ├── TASK: About, Process (§20.6-20.7) — AC: matches copy rules §21.1-21.2
│   ├── TASK: Pricing (§20.8) — AC: matches §08 package data exactly, exclusions present (§16.5)
│   └── TASK: Contact (§20.9, §21.9) — AC: full §21.9 spec (fields/validation/spam/a11y/analytics)
├── FEATURE 2.2: Portfolio & Blog
│   ├── TASK: Portfolio index + case study template (§20.4-20.5) — AC: renders from CaseStudy
│   │         content model (§29.12), not hardcoded
│   └── TASK: Blog index + post template (§20.10-20.11) — AC: renders from ContentPost, includes
│             SEO fields (§22.2) and contextual CTA (§21.7)
├── FEATURE 2.3: SEO Foundation (§22)
│   ├── TASK: Sitemap.xml + robots.txt (§22.5) — AC: auto-generated, excludes portal/admin
│   ├── TASK: Metadata/OG/schema per page type (§22.2, §22.6-22.7) — AC: unique per page, not templated-blank
│   └── TASK: Internal linking pass (§22.8) — AC: every §18.1 page reachable via ≥1 internal link
└── FEATURE 2.4: Legal Pages
    └── TASK: Privacy + Terms (§20.24) — AC: PROFESSIONAL REVIEW REQUIRED content in place

EPIC 3: Client Portal (§20.12-20.19, §56 P0)
├── FEATURE 3.1: Auth & Onboarding
│   ├── TASK: Login (§20.12) — AC: session flow per §31.3
│   └── TASK: Invite-based Signup (§20.13, §31.1) — AC: only reachable via a valid, unexpired invite token
├── FEATURE 3.2: Dashboard & Projects
│   ├── TASK: Dashboard (§20.14) — AC: matches §20.14's 5-element layout
│   ├── TASK: Projects list + detail (§20.15-20.16) — AC: renders live Project/Milestone state (§29.7-29.8)
│   ├── TASK: Milestone approval action (§32.4) — AC: only enabled when `AWAITING_APPROVAL`,
│   │         triggers notification (§37.2)
│   └── TASK: Comments (§32.5) — AC: project-scoped, visible to both CLIENT and TEAM per §29.10
├── FEATURE 3.3: Files (§20.17, §36)
│   └── TASK: Upload + list + version display — AC: matches full §36.1-36.4 spec
├── FEATURE 3.4: Invoices & Payment (§20.18, §35)
│   ├── TASK: Invoice list/detail — AC: matches §20.18
│   └── TASK: Razorpay payment flow — AC: matches §35.4's full webhook-confirmed flow
└── FEATURE 3.5: Settings (§20.19, §37.4)
    └── TASK: Profile + notification preferences — AC: payment/security notifications non-toggleable per §37.4

EPIC 4: Admin Platform (§33, §56 P0)
├── FEATURE 4.1: Leads & Clients (§33.2-33.3)
├── FEATURE 4.2: Projects & Proposals (§33.4, §33.6)
│   └── TASK: State-machine-driven project view (§34) — AC: invalid transitions rejected per §26.6
├── FEATURE 4.3: Invoices (§33.8, §35)
├── FEATURE 4.4: Content CMS (§33.9, §56 P1)
└── FEATURE 4.5: Admin Dashboard (§20.20)
    └── TASK: "Needs attention" panel — AC: surfaces overdue leads/QA/invoices per §19.6

EPIC 5: Notifications (§37, §56 P0)
└── FEATURE 5.1: Event-Triggered Email + In-App
    └── TASK: Implement each event in §37.2's table — AC: correct channel(s)/recipient(s) per row;
              retry logic per §37.3

EPIC 6: Payments & Retainer Billing (§35, §56 P0/P1)
├── FEATURE 6.1: One-time Invoice Flow (P0) — matches §35.3-35.4
└── FEATURE 6.2: Scheduled Retainer Invoicing (P1, §45.6) — matches §29.12's `Retainer` model

EPIC 7: Launch Readiness (§55.5, §67)
├── FEATURE 7.1: QA Pass — AC: §43's full testing checklist, §67's launch checklist
├── FEATURE 7.2: Accessibility Spot-Check (§43.4) — AC: keyboard + screen-reader check on highest-traffic pages
└── FEATURE 7.3: Production Deploy (§44) — AC: live at production domain, monitoring active (§45.8)
```

---

## 61. Developer Onboarding

Welcome. This section is written for the first engineer who joins after the three founders — including a future founding engineer hire (§54).

1. **What the company does:** Read §01 (Executive Summary) first, not the code. Forge is a productized digital studio (§05.3) — the platform you're joining exists to make delivery visible and repeatable (§03.1), not as a product sold on its own.
2. **How the repo works:** §25 is the map. Read §25.2-25.3 specifically — the route-group and `features/`-vs-`components/` split are the two structural decisions that make everything else make sense.
3. **How to run the project:** Clone the repo, copy `.env.example` to `.env` and fill in the values it documents (§27.9), `npm install`, `npm run dev` (assumes local Postgres or a dev-tier managed instance, §44.1). Run `npm run db:seed` (`prisma/seed.ts`, §25.1) for representative dev data.
4. **Where code belongs:** §27.3's placement rule is the one to internalize before writing your first feature: UI -> `components/`, business logic -> `features/`, infrastructure -> `lib/`.
5. **How architecture works:** §24 (System Architecture) — read §24.2 specifically before proposing any change that would split the app into multiple services; that decision was made deliberately (ADR-003, §59), not by default.
6. **How to make changes:** Branch from `main` (§45.1), open a PR early (§45.2), make sure CI passes (§44.2, §45.3) before requesting review. If your change alters a documented decision, update the relevant PLAN.md section in the same PR (§00.4).
7. **How to test:** §43 defines what needs tests and what doesn't (§43.7) — don't write tests for their own sake, and don't skip them where §43.7 requires them (state machines, validation, auth, payments).
8. **How to deploy:** You don't manually deploy — merging to `main` triggers it (§44.2). Understand the migration-safety discipline in §45.5 before touching `prisma/schema.prisma`.
9. **What NOT to do:** Read §64 in full before your first PR. It exists specifically to prevent a new contributor from reasonably-but-incorrectly reintroducing complexity this document deliberately avoided.

---

## 62. Designer Onboarding

1. **Start with the brand, not the components:** §11 (Brand Strategy) explains *why* Forge looks and sounds the way it does — every visual decision downstream should trace back to the personality traits in §11.4.
2. **The token system is not optional styling guidance, it's the contract:** §13-15 define every color/type/spacing value you're allowed to design with. If a design needs a value not in the token set, that's a signal to either reuse an existing token or propose a new one via the Decision Log (§00.5) — not to introduce an ad-hoc one-off value.
3. **Know the component inventory before designing a new one:** §16 documents every existing component's purpose and non-usage. Check here before designing something that might already exist in a different form.
4. **Design responsively from the start, not as an afterthought:** §17 defines actual behavior changes per breakpoint, not just scaling — a new page design should specify mobile behavior explicitly, not leave it implied.
5. **Every page has a job:** §18-20 define each page's specific purpose/audience/CTA. A new design should serve that stated job, not add competing elements (§21.1's "one CTA per page" rule).
6. **Accessibility is part of the design, not a follow-up pass:** §40 — contrast, focus states, and touch targets are design decisions, not just engineering concerns to fix later.
7. **What NOT to do:** §64's design-specific entries (decorative-only illustration, nested cards, nonstandard one-off components) apply to you directly — read them before your first Figma file.

---

## 63. Business Onboarding (Sales & Operations)

1. **Understand the model before pitching it:** §01, §05 — Forge sells fixed-scope packages (§08) with a retainer path (§10), not open-ended custom work. Know the difference before your first call.
2. **Know the ICP:** §06 — who Forge is actively prospecting (S1/S2 primary) and who's opportunistic (S3-S5) vs. not-yet (S6). Don't chase segments outside this without checking with a founder first.
3. **Know the numbers cold:** §08-09's package prices and inclusion/exclusion lists — you should never need to "check and get back to" a prospect on standard package scope or price.
4. **The sales process is documented, follow it:** §47 — qualification (§47.3) before proposal, proposal within 2 business days (§47.5), the retainer pitch happens at delivery (§46.5), not at close.
5. **Discount discipline:** §09.4's bounded discount rules are not suggestions — discounting outside them requires founder sign-off, every time, no exceptions for a deal that "feels" worth it.
6. **The portal is your credibility tool:** §32, §20.7 — when a prospect asks "how will I know what's happening with my project," you have a concrete, demoable answer, not a verbal promise.
7. **What NOT to do:** §64's sales/pricing-specific entries — no guaranteed-outcome promises (§07.4), no unlimited-revision promises (§08.5), no undocumented verbal-agreement scope changes (§09.5, §52.2).

---

## 64. "Do Not Do This"

Consolidated from prohibitions stated throughout this document — gathered here as one authoritative list. Each entry links back to where the full reasoning lives.

### 64.1 Bad Architecture

| Don't | Why | Reference |
|---|---|---|
| Split the app into separate frontend/backend services | Premature-scale complexity for a 3-person team | §02.3, §23.2, ADR-003 |
| Introduce microservices per domain | Same reasoning, more extreme | §02.3 |
| Add a global state store (Redux, etc.) before there's state complexity that needs it | No current requirement; adds maintenance surface | §26.10, §27.6, ADR-013 |
| Build a generic API-client abstraction layer | Solves a problem the Server Component architecture doesn't have | §26.10 |
| Denormalize the database before there's a measured performance problem | Optimizing for load the system doesn't have | §29.14 |

### 64.2 Bad UX

| Don't | Why | Reference |
|---|---|---|
| Put more than one primary-weight CTA on a page | Dilutes the page's one job | §16.5, §21.1 |
| Hide pricing behind a mandatory sales call | Contradicts transparent-pricing principle; wastes founder time on unqualified calls | §02.5 |
| Put essential information only in a tooltip | Excludes touch/keyboard users | §16.2 |
| Use Alert (persistent) for a transient message, or Toast (transient) for a persistent one | Breaks the component's implied meaning | §16.3 |
| Reflow content order beyond the two documented, deliberate cases | Untracked content reordering becomes an ad-hoc habit | §17.4 |
| Ship an error state with no recoverable next action | Dead end for the user | §16.3, §42.1 |

### 64.3 Bad Business Decisions

| Don't | Why | Reference |
|---|---|---|
| Oversell beyond delivery capacity | Root cause of the most common small-agency failure mode | §02.6, R-01 (§58) |
| Launch every listed service on Day 0 | Guarantees mediocre delivery across all of them | §02.2, §07.4 |
| Guarantee specific business outcomes (rankings, sales, follower counts) | Not honestly deliverable; a known market scam pattern | §07.1 (L7), §07.4 |
| Discount a deal outside the bounded discount rules "to win it" | Erodes pricing integrity company-wide, not just on one deal | §09.4 |
| Bundle the retainer pitch into the initial close instead of delivery | Pressures a prospect before they've experienced quality; undermines trust-based selling | §47.6 |
| Take on a project outside the Launch service scope without a documented judgment-call reason | Reproduces the "do everything adequately" failure §07 exists to prevent | §07.4, §47.3 |

### 64.4 Bad Coding Practices

| Don't | Why | Reference |
|---|---|---|
| Use raw hex/px values instead of design tokens | Breaks theming and consistency | §13.1 |
| Leave `console.log` in committed code outside `scripts/` | Unstructured, unsearchable at scale | §28.9 |
| Use `any` without a justifying comment | Removes the type-safety benefit §28.5 is built on | §28.5 |
| Put business logic directly in a page file or Route Handler | Untestable, unreusable | §26.4-26.5, §27.1 |
| Trust client-side validation as authoritative | Server must independently validate every input | §38.4 |
| Write a hand-rolled auth/session system | Security-critical primitive; use the vetted library | §23.2, §38 |

### 64.5 Bad Sales Practices

| Don't | Why | Reference |
|---|---|---|
| Use manufactured urgency ("only 2 spots left") unless literally true | Contradicts the honest brand voice | §11.5, §21.4 |
| Promise a timeline the current WIP can't actually support | Sets up a missed deadline and a damaged relationship | §34.3, §47.4 |
| Make undocumented verbal scope agreements | Reproduces the opacity problem the business model fixes | §09.5, §52.2 |

### 64.6 Bad Pricing Practices

| Don't | Why | Reference |
|---|---|---|
| Offer unlimited revisions | Structurally reproduces scope creep | §08.5, ADR-010 |
| Hide exclusions or bury them where they won't be read | Directly causes the disputes transparent pricing prevents | §08.5, §16.5 |
| Lower a published package price ad-hoc to win one deal | Use the bounded discount system instead | §09.3-09.4 |

### 64.7 Unnecessary Features

| Don't build | Why | Reference |
|---|---|---|
| A generic workflow-builder / custom report-builder | No requester, no current need | §02.7, §57 |
| Real-time chat before comment-thread data shows the need | Solves an unproven problem with real infra cost | §32.1, §57 |
| A native mobile app before a client need genuinely requires it | Responsive web serves V1 needs | §07.3, §57 |
| Client-editable scope/requirements docs | Undermines the fixed-scope model | §32.1, §57 |

### 64.8 Unnecessary Files & Dependencies

See §26.10 in full — `store/`, `utils/index.ts` grab-bags, a duplicate `services/` folder, a bespoke `api-client.ts`, per-component CSS files alongside Tailwind, and undifferentiated `constants.ts` files are all explicitly prohibited, with the reasoning for each stated there.

### 64.9 Content Integrity

| Don't | Why | Reference |
|---|---|---|
| Fabricate or paraphrase a testimonial beyond light, consented editing | Trust-destroying if discovered; also likely a legal/consent issue | §21.6 |
| Invent a metric/outcome for a case study that isn't honestly attributable | Same — and directly contradicts the evidence-based positioning | §21.5 |
| Publish thin, keyword-stuffed blog content | Damages SEO authority and the brand's credibility positioning | §21.7 |
| Show a trust-strip/proof statement with fabricated numbers | Same trust-destroying pattern, applied to the homepage specifically | §20.1 |

---

## 65. Master Architecture

### 65.1 Full System Map

```text
FORGE DIGITAL (company)
│
├── BRAND (§11-17)
│   ├── Identity — name, story, positioning (§11)
│   ├── Visual system — logo, color, type, tokens (§12-15)
│   └── Design system — components, responsive rules (§16-17)
│
├── BUSINESS (§01-10)
│   ├── Model — hybrid productized agency + retainer (§05)
│   ├── Market & customers — segments, ICPs (§04, §06)
│   ├── Services & packages (§07-08)
│   └── Pricing & revenue model (§09-10)
│
├── SALES (§47)
│   ├── Sourcing & outreach (§47.1-47.2)
│   ├── Qualification & calls (§47.3-47.4)
│   └── Proposals, closing, retainer expansion (§47.5-47.7)
│
├── MARKETING (§48-49)
│   ├── Channels (§48.1)
│   ├── Social & content (§48.2, §49)
│   └── SEO (§22, §48.3)
│
├── OPERATIONS (§34, §46)
│   ├── Lead-to-close pipeline (§34.1, §46.2-46.3)
│   ├── Production & QA gate (§46.4)
│   ├── Delivery & retainer pitch (§46.5)
│   └── Support & retention (§46.6-46.7)
│
├── FOUNDER STRUCTURE (§53-54)
│   ├── Domain responsibility & decision rights (§53)
│   └── Team scaling triggers (§54)
│
└── DIGITAL PLATFORM (§23-45)
    │
    ├── WEBSITE (§18-22) — marketing site, public, SEO-optimized
    ├── CLIENT PORTAL (§32) — authenticated, CLIENT-role
    ├── ADMIN (§33) — authenticated, TEAM-role
    ├── API (§30) — Route Handlers + Server Actions, internal-only
    ├── DATABASE (§29) — PostgreSQL via Prisma
    ├── STORAGE (§36) — Cloudflare R2, signed-URL access
    ├── AUTH (§31) — Auth.js, database sessions, CLIENT/TEAM roles
    ├── PAYMENTS (§35) — Razorpay (primary), Stripe (Phase 2+)
    ├── NOTIFICATIONS (§37) — Resend (email) + in-app
    └── ANALYTICS (§41) — Plausible, privacy-respecting
```

### 65.2 How To Read This Map

Every leaf node above is fully specified in its referenced section — this map exists as a navigation aid and a sanity check: if a new piece of work doesn't fit anywhere on this map, that's a signal to ask whether it should exist at all (§02.7, §64) before building it, or whether the map itself needs a deliberate, logged update (§00.5).

### 65.3 Cross-Cutting Concerns (apply across every branch, not owned by one)

| Concern | Where it's enforced |
|---|---|
| Security (§38) | Every layer — auth (§31), API (§30.2-30.6), database (§29), file storage (§36.3) |
| Accessibility (§40) | Design system (§16.0), every page spec (§20), testing (§43.4) |
| Performance (§39) | Rendering strategy (§24.1), images/fonts (§39.3-39.4), testing (§43.5) |
| Brand consistency (§11-16) | Every client-facing surface — website, portal, and admin alike |
| The Source of Truth Hierarchy (§00.7) | Every conflict-resolution decision throughout this document |

---

## 66. Final "Why" Index

A searchable index of major decisions. Format: **Decision → Reason → Section.**

- **Why "Forge Digital"?** → A craft/durability metaphor that gives the whole visual and verbal identity system something coherent to build from, rather than a generic name → §11.1, ADR-001
- **Why a hybrid productized-agency-plus-retainer model, not pure agency or a marketplace?** → Highest score across founder-fit, recurring revenue, and market-demand criteria for a 3-person, capital-limited team → §05.2-05.3, ADR-002
- **Why only 8 Launch services instead of the full brief-listed menu?** → Quality over quantity; a narrow menu is deliverable excellently by three people, a broad one isn't → §02.2, §07.1, ADR-008
- **Why published, transparent pricing instead of "contact us"?** → Repels budget-mismatched leads before they cost founder time; matches the core customer-trust positioning → §02.5, §09.1, ADR-009
- **Why no unlimited revisions?** → Structurally reproduces the exact scope-creep problem the business exists to fix → §08.5, ADR-010
- **Why Next.js as one monolithic app instead of separate frontend/backend services?** → No current scale need justifies the operational cost of separate deployments for a 3-person team → §23.2, §24.2, ADR-003
- **Why PostgreSQL + Prisma?** → Real relational integrity needs (invoices, projects) and type-safe, migration-tooled data access → §23.2, §29.1, ADR-004
- **Why Auth.js with invite-only client signup, not open self-serve?** → Removes an entire unauthenticated-attack-surface category for a feature with no business value at this stage → §18.4, §31.1, ADR-005
- **Why Razorpay before Stripe?** → India-specific payment methods (UPI, netbanking) dominate the primary ICP's actual behavior → §23.2, §35.7, ADR-006
- **Why no public API?** → No current consumer; building one preemptively is unjustified complexity → §18.4, §30.1, ADR-007
- **Why semantic design tokens instead of raw hex/px values?** → Enables theming, prevents drift, and is the mechanism that structurally enforces the §13.3 contrast finding on primary buttons → §13.1, §15.1
- **Why this specific color palette (ember/steel/ink)?** → Directly derived from the "Forge" brand metaphor (fire, metal, craft), not chosen by taste alone → §11.1, §13.2
- **Why Fraunces + Inter for typography?** → A warm, characterful display face paired with a highly legible, variable UI/body face — matches the brand personality without sacrificing functional legibility → §14.1
- **Why this exact folder structure (`app/`, `components/`, `features/`, `lib/`)?** → Each folder answers one specific "where does this belong" question, preventing the grab-bag drift documented in §26.10 → §25, §27
- **Why `features/` separate from `components/`?** → Presentation vs. business logic — keeps logic testable independent of UI and reusable across entry points → §25.3, §27.1-27.2
- **Why no Redux or global client state store?** → No current state complexity justifies it; Server Components + colocated state cover V1 needs → §26.10, §27.6, ADR-013
- **Why Radix UI primitives under custom styling instead of a full pre-styled component library?** → Solves the hard, easy-to-get-wrong accessibility engineering problem without fighting the custom token system → §16.7
- **Why the project pipeline splits across `Lead` and `Project` entities instead of one 11-state model?** → The two are genuinely different entities with different lifecycles; forcing one schema would need awkward nullable fields → §34.1
- **Why is the QA gate enforced in code, not just documented as policy?** → Security/integrity guarantees rank above convenience in the Source of Truth Hierarchy; an unenforced policy is a known failure mode (R-27) → §34.2, §46.4, ADR-018, §00.7
- **Why does the retainer pitch happen at delivery, not at initial close?** → Pitching before the client has experienced quality would be pressure-selling, undermining the evidence-based trust model → §46.5, §47.6
- **Why is the productized/SaaS layer deferred to Year 2+?** → Building it before the service business is proven risks both; §02.3/§02.6 discipline applied to the company's own long-term ambition → §05.3, §07.3, ADR-015
- **Why no CAPTCHA on the Contact form?** → Honeypot + rate limiting is sufficient at V1 traffic and avoids CAPTCHA's measurable hit to legitimate completion rates → §21.9, ADR-016
- **Why 404 (not 403) when a client tries to access another client's project by URL?** → Doesn't confirm the resource's existence to a potential attacker — the more conservative, information-leakage-minimizing choice → §38.12
- **Why is dark mode token-ready but not required for MVP?** → The theming architecture is cheap to build in from Day 0 (§13.1); the actual dark-theme UI work is non-blocking polish relative to P0 features → §13.6, ADR-017
- **Why is there no dedicated internal task-management system built into Forge's own product?** → No client-facing purpose; an off-the-shelf tool solves the founders' own planning need without adding product scope → §32.3, §34.5, §57
- **Why contractor-first hiring instead of hiring full-time ahead of demand?** → Reduces fixed-cost risk while demand durability is still being confirmed → §54.3, ADR-014
- **Why is founder access to the system identical across all three (no internal permission tiers)?** → §53's domain-responsibility split is organizational, not a technical restriction — artificially limiting a co-founder's access would contradict the shared-accountability basis the founder structure is built on → §31.9, §53.1
- **Why is this document itself structured with explicit ASSUMPTION/VALIDATION REQUIRED/OPEN DECISION flags?** → Prevents estimates and unvalidated claims from silently being treated as settled fact by a future reader → §00.8

---

## 67. Final Master Checklist

### 67.1 Business

- [ ] Company structure decided and registration filed (§52.1, PROFESSIONAL REVIEW REQUIRED)
- [ ] Founders' agreement drafted covering equity/exit (§52.1, §53.7, PROFESSIONAL REVIEW REQUIRED)
- [ ] Contract/SOW template finalized (§52.2, PROFESSIONAL REVIEW REQUIRED)
- [ ] Package pricing (§08-09) confirmed against real competitor research (§04.5's VALIDATION REQUIRED)
- [ ] GST registration status resolved (§52.6)

### 67.2 Brand

- [ ] Logo, palette, typography finalized in Figma (§12-14)
- [ ] Brand voice/messaging guide written in full (expanding §11.5)
- [ ] Founder photos/bios ready for About page (§20.6)

### 67.3 Design

- [ ] Full component library built to §16's spec
- [ ] Responsive behavior verified at every breakpoint in §17.1
- [ ] All page designs reviewed against their §20 layout spec

### 67.4 Development

- [ ] Repo scaffolded per §25.1
- [ ] Database schema implemented and migrated (§29)
- [ ] All P0 MVP features from §56 built and passing their acceptance criteria (§60)
- [ ] Coding standards (§28) enforced via lint/CI (§45.3)

### 67.5 Security

- [ ] §38's full checklist reviewed against the actual implementation (not just the plan)
- [ ] No payment instrument data stored anywhere (§35.2, §38.6) — verified by inspection
- [ ] Rate limiting active on all public endpoints (§30.5, §38.8)
- [ ] Environment variables validated at boot (§27.9), no secrets in git history

### 67.6 Testing

- [ ] Unit/integration coverage on all §43.7 "requires tests" items
- [ ] E2E coverage on the critical journeys (§43.3)
- [ ] Accessibility spot-check completed on highest-traffic pages (§43.4)
- [ ] Performance budget (§39.10) verified via Lighthouse CI (§43.5)

### 67.7 Deployment

- [ ] CI/CD pipeline green end-to-end (§44.2)
- [ ] Production environment variables configured (§44.1, §27.9)
- [ ] Backups verified restorable (§45.4)
- [ ] Monitoring/error tracking live (§45.8)

### 67.8 Sales

- [ ] Sales playbook (§47) internalized by all three founders
- [ ] First outreach batch sent (§55.2)
- [ ] Proposal template ready (§33.6)

### 67.9 Marketing

- [ ] Social accounts (Instagram, LinkedIn) set up and posting to Forge's own standard (§48.2)
- [ ] First blog posts published (§55.6)
- [ ] SEO foundation (sitemap, schema, metadata) verified live (§22.5-22.7)

### 67.10 Operations

- [ ] QA checklist (§46.4) documented in concrete, checkable form (not just "check quality")
- [ ] Notification events (§37.2) verified firing correctly end-to-end
- [ ] Lead-response SLA (§46.2) achievable given current founder bandwidth

### 67.11 Launch

- [ ] Every §18.1 marketing URL live and content-complete
- [ ] Contact form tested end-to-end including spam-prevention (§21.9)
- [ ] Domain, SSL, and DNS fully propagated and verified
- [ ] Legal pages (Privacy, Terms) live (§20.24, PROFESSIONAL REVIEW REQUIRED content)

### 67.12 Post-Launch

- [ ] §51.8's key metrics being tracked from Day 1 of real operation
- [ ] First Decision Log entries (§59) being added as real decisions diverge from or confirm this document's assumptions
- [ ] §55.6 onward roadmap milestones reviewed against actual progress monthly
- [ ] This document (PLAN.md) revisited and updated per §00.4-00.5 as reality informs it — **PLAN.md is not finished at launch; it is finished when the company is**

---

**End of PLAN.md — Version 1.0.0.** Every section above traces back to §00's stated purpose: a single source of truth three founders can build a company from. Where this document made an assumption, it said so. Where it deferred a decision, it said when to revisit. Where it chose one path over an obvious alternative, it said why. The next entry in this document should be a Decision Log entry (§59), not a rewrite — that is the whole point of §00.4.
