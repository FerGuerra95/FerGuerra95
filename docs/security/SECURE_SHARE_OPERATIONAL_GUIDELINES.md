# CEO's OS — Secure Share Operational Guidelines (M&A)

**Status:** Draft · Internal / pilot  
**C14-P1-SECURE-SHARE-01:** **RESOLVED** / TECHNICAL ACCESS CONTROLS + OPERATIONAL GUIDELINES (C.14.6)

Technical controls (C.14.6): token **hashed** at rest; expiry + revocation; rate limit on public route; `ma.secure_share.public_accessed` audit with **tokenPrefix only** (no raw bearer); public API returns uniform **404** for invalid/expired/revoked token (no oracle). Operational discipline still required (see below).

---

## 1. Bearer secret model

M&A secure share links embed a **bearer token** in the SPA URL fragment (`#sid=...&t=...`). Anyone with the link can access the shared report within expiry unless revoked.

**Treat each link like a password.**

---

## 2. Do not send in open channels

- Avoid email body, public Slack channels, unsecured SMS, or social media.
- Prefer encrypted channels or password managers with one-time delivery.
- Never commit tokens or full URLs to git.

---

## 3. API access pattern

- Public API: `GET /api/ma/public/secure-shares/:id` with header `X-MA-Share-Token`
- Prefer header — not `?token=` query (legacy deprecated; may leak via Referer/logs)
- Authenticated org route remains for logged-in users in the correct tenant

---

## 4. Expiration and revocation

| Control | Status |
|---|---|
| Default expiry (~72h, configurable) | **Implemented** (`secureShare.service.js`) |
| Max expiry cap (30 days) | **Implemented** |
| Revocation (`revoked` status) | **Implemented** |
| Audit `ma.secure_share.public_accessed` | **Implemented** |

**Operator actions:**

- Set shortest practical `expiresInHours` for external reviewers.
- Revoke link immediately after review completes.
- Re-create link if extension needed — do not forward old links indefinitely.

---

## 5. Rotate / revoke after external review

1. Confirm recipient no longer needs access.
2. Revoke share in product (or delete link record per procedure).
3. Verify audit log shows no further public access (optional review).

---

## 6. Logging and monitoring

- Share **creation** and **revocation** should appear in `audit_logs` where wired.
- Public **access** events recorded as `ma.secure_share.public_accessed` (metadata without raw token).
- Operations should periodically review unusual access volume (manual cadence in pilot).

---

## 7. No public marketplace implication

`/bridge/marketplace` and secure share are **internal / unlisted demo** flows. Links must not be indexed or marketed as a public deal room.

---

## 8. Not for regulated disclosure without review

Board packs and M&A reports may contain sensitive business information. External sharing requires:

- Human review of content  
- NDA or pilot agreement  
- Legal/comms approval where applicable  

CEO's OS does not certify regulatory filing readiness.

---

## 9. Do not index

- Do not publish share URLs on public websites.
- `robots.txt` / SEO are outside this doc — operators must not expose viewer URLs publicly.

---

## 10. Customer / user instructions (pilot script)

> "This link grants access to a specific report without a login. It expires automatically. Do not forward. Notify us when review is complete so we can revoke access. CEO's OS provides decision-support drafts only — not legal or investment advice."

---

## Open technical gaps (honest)

| Gap | Priority |
|---|---|
| OIDC unrelated — N/A here | — |
| Optional: shorter default expiry in production config | P2 |
| Optional: email notification on each public access | P3 |
| Centralized operator dashboard for active shares | P3 |
| Pen-test validation of token compare / timing | P2 |

---

## Related

- `.env.example` — secure share comments  
- `docs/security/SECURITY_PRIVACY_PILOT_PACK.md`  
- `docs/operations/PILOT_SECURITY_RUNBOOK.md`
