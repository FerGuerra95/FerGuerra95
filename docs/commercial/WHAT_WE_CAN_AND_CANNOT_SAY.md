# What We Can And Cannot Say

Use this document to keep demo, pilot and sales language aligned with DSS truthfulness gates.

| Topic | Can say | Cannot say | Notes |
|---|---|---|---|
| DSS | Private Executive DSS; operational decision-support; human-reviewed corporate intelligence. | Autonomous decision engine; certified enterprise decision system. | DSS outputs support judgment, not replace it. |
| AI | AI-ready architecture is planned; first AI features must be draft-only and human-reviewed. | Autonomous AI agents; AI makes legal, investment, compliance or board decisions. | No AI implementation is sold in C.15.0. |
| Compliance | Compliance workspace for suppliers, evidence, reviews, reports and DSS risk support. | Certified compliance audit; guaranteed compliance; legal advice. | Legal review remains customer responsibility. |
| M&A | M&A DSS for valuation prep, waterfall, pipeline, CIM and data-room support. | Fairness opinion; certified valuation; guaranteed buyer matching. | Outputs are indicative preparation material. |
| Funding | Funding DSS for runway, dilution, scenarios and readiness drafts. | Investment advice; funding guaranteed; investor commitments verified. | Funding dashboard is decision-support only. |
| Reporting | Reporting workspace; Board Review Draft; persisted snapshots; premium HTML preview; human-review workflow. | Complete **certified** PDF reporting; filed or **board-approved** materials. | HTML renderer + snapshots implemented (C.17.1–C.17.7); **binary certified PDF** not claimed. |
| Reporting / PDF Renderer | HTML Board Review Draft preview; persisted snapshot preview from backend `rendererInput`; export architecture planned. | Certified PDF reports; board-approved report; autonomous AI-generated final board pack. | Distinguish HTML draft preview vs certified PDF binary. |
| Board Pack | Board Review Draft for human review. | Board-approved output. | Directors and governance process remain authoritative. |
| Marketplace | Bridge marketplace is internal, unlisted, future/private-network concept. | Public marketplace is live; verified buyer network is active. | Do not use marketplace as production pilot narrative. |
| Success fee | Not part of the controlled pilot. | Success-fee transaction platform is operational. | No transaction layer is sold. |
| Security | Security/privacy pilot procedures are documented; auth, audit, backup and secure-share controls exist for pilot scope. | SOC2/ISO certified; production certified; breach-proof. | Procurement security program remains future work. |
| RGPD | RGPD/GDPR pilot readiness drafts exist; legal review required. | Fully GDPR compliant; legal-reviewed DPA final. | Treat as draft and subject to counsel. |
| SOC2/ISO | Roadmap item for enterprise procurement. | SOC2 ready; SOC2 Type II; ISO 27001 certified. | Do not imply certification. |
| Procurement | Procurement roadmap can be planned after pilot. | Procurement-ready today; SLA-backed enterprise SaaS. | Requires legal, security, support and retention work. |
| Legal/investment advice | Decision-support material for human experts. | Legal advice; investment advice; tax advice; fairness opinion. | Escalate to qualified advisors. |
| Human review | Human review required for material outputs. | Human review optional for board/legal/investment/compliance use. | This is a core product truthfulness rule. |
| Board Intelligence | Board Intelligence Workspace; persisted Board Review Snapshots; premium HTML Board Review Draft preview; workflow draft/reviewed/internal_final; audit metadata on snapshots. | Board-approved pack; certified board materials; autonomous workflow approval. | C.15.2 / C.17.7 |
| Reporting snapshots | Persisted reporting snapshots; tenant-scoped list/create/preview; renderer uses stored `rendererInput` without recalculating scores. | Cross-tenant snapshots; silent score invention in preview. | C.17.6–C.17.7 |

---

## C.15.2 Demo Wording Rules

**Can say (Board Intelligence demo):**

- Private Executive DSS · Board Intelligence Workspace  
- Board Review Draft · Human Review Required · Not Board Approved  
- Persisted reporting snapshots · audit metadata on workflow  
- Premium **HTML** Board Review Draft preview (branded header)  
- Workflow: draft → reviewed → internal_final with human gates  
- AI-ready **Board Review Draft Assistant foundation** (draft-only, human-reviewed)  
- Controlled pilot ready · no known P0/P1 for controlled pilot (per current inventory)  
- M&A / Compliance / Funding as strategic branches (DSS, not certification)  
- Security/privacy pilot procedures documented (not SOC2/ISO certified)

**Cannot say (Board Intelligence demo):**

- Enterprise certified · procurement-ready · SOC2/ISO certified  
- Board-approved output · certified PDF · filed report  
- Autonomous AI · AI approves or certifies packs  
- Legal advice · investment advice · fairness opinion · certified compliance  
- Public marketplace live · success-fee platform operational  
- “Complete PDF reporting is production-ready” (binary certified PDF — not claimed; HTML preview ≠ certified PDF)  
- Hide human review or present AI draft as final

**P2 limit (mention if asked about production hardening):** Authenticated production smoke may remain **blocked by env** until `CEOS_E2E_*` loaded from secret store — perimeter unauth checks PASS; run operator smoke before high-stakes external demo.
