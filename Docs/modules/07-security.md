# 07: Security Hardening

**Goal:** A verified security baseline before launch. Earlier modules build safely; this one audits and closes gaps.
**Depends on:** 03, 05, 06
**Status:** baseline headers added in `next.config.mjs`; the rest pending

## Scope

Headers and CSP, rate limiting, dependency and secret hygiene, API surface review, privacy, incident readiness.

## Tasks

- [x] HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`
- [ ] Content-Security-Policy with nonces (report-only first, then enforce)
- [ ] Rate limiting at the edge for login, search, newsletter, API (Vercel Firewall or Upstash)
- [ ] Review every public route and API endpoint; list in a table with auth and risk
- [ ] Disable or protect GraphQL playground/introspection in production
- [ ] CORS and CSRF allowlists set to the real domains only
- [ ] `PAYLOAD_SECRET` and DB credentials rotation procedure documented
- [ ] Least-privilege database user; Neon IP/branch protections
- [ ] Upload hardening: size limits, MIME sniffing, image re-encoding through `sharp`
- [ ] Error handling: no stack traces or internals in responses
- [ ] Logging without secrets or personal data; alerting on repeated auth failures
- [ ] Dependency policy: Dependabot PRs reviewed weekly; `npm audit` blocks on high severity
- [ ] Privacy: cookie-free analytics, privacy policy, data-processing list
- [ ] `security.txt` and a documented vulnerability-report path
- [ ] Final review: OWASP Top 10 checklist and a manual attempt to break auth, uploads and search

## Acceptance criteria

- securityheaders.com grade A or better.
- CSP enforced with no `unsafe-inline` for scripts.
- Penetration checklist completed with zero open high or critical items.
- Documented answer to "what do we do if the admin account is compromised?"

## Threat model (summary)

| Asset            | Threat                | Control                              |
| ---------------- | --------------------- | ------------------------------------ |
| Admin accounts   | takeover, brute force | 2FA, lockout, rate limit             |
| Content          | XSS, tampering        | sanitized rich text, CSP, roles      |
| Subscriber trust | spam abuse, leaks     | double opt-in, provider-only storage |
| Availability     | scraping, flooding    | CDN caching, rate limits             |
| Secrets          | leakage               | env vars, scanning, rotation         |

## Tests

- Automated: header check in CI; `npm audit`; secret scan.
- Manual: documented attack attempts and results in `Docs/security-review.md`.
