# Publication: Project Plan

## Decisions

- Type: blog / magazine, multi-language
- Authoring: owner plus a few editors via the Payload admin
- Stack: Next.js (App Router) + TypeScript + Payload 3 (single app, one deploy)
- Database: Neon Postgres. Media: Vercel Blob. Hosting: Vercel first
- v1 features: search, tags, newsletter signup (double opt-in, via provider)
- Brand: to be proposed in phase 1

## Architecture

- One Next.js app contains the public site (`src/app/(frontend)/[locale]`) and the Payload admin/API (`src/app/(payload)`).
- Localization: Payload field-level localization; `[locale]` route segment; `hreflang` + localized sitemap; locale-aware RSS.
- Collections: Articles, Authors, Tags, Media, Users. Roles: admin, editor.
- Search: Postgres full-text (or Pagefind) to start.
- Vercel constraints: read-only filesystem, so uploads go to Blob storage and the DB is serverless Postgres.

## Phases

1. Foundations: tooling, CI, design tokens, base layout, i18n routing
2. Content: collections, article and tag pages
3. Discovery: search, RSS, SEO, sitemap
4. Growth: newsletter
5. Hardening: security headers, a11y audit, E2E, performance
6. Launch: deploy, backups, monitoring, domain

## Quality (tester)

Vitest (unit), Playwright (E2E: read, search, tag filter, subscribe, editor publish), axe + Lighthouse CI budgets, link checks. Acceptance criteria written per feature before building.

## Security (threat model)

| Risk              | Mitigation                                                |
| ----------------- | --------------------------------------------------------- |
| Admin takeover    | 2FA, least-privilege roles, rate-limited login            |
| XSS via content   | Sanitized rich text, strict CSP                           |
| Newsletter abuse  | Double opt-in, Turnstile CAPTCHA, rate limits             |
| Secret leakage    | Env vars only, secret scanning in CI                      |
| Vulnerable deps   | Dependabot, npm audit in CI                               |
| Transport/headers | HTTPS, HSTS, CSP, Referrer-Policy, X-Frame-Options        |
| Privacy           | Cookie-free analytics, privacy policy, unsubscribe (GDPR) |
| Data loss         | Automated backups plus tested restore                     |
