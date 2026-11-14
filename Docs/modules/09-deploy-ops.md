# 09: Deployment and Operations

**Goal:** Safe, repeatable releases on Vercel, with backups and visibility.
**Depends on:** 07, 08
**Status:** not started

## Scope

Vercel project, environments, database, media storage, domain, backups, monitoring, release process.

## Environments

| Env        | Purpose                   | Database                           |
| ---------- | ------------------------- | ---------------------------------- |
| local      | development               | Neon dev branch or Docker Postgres |
| preview    | every PR (Vercel preview) | Neon branch per preview            |
| production | live                      | Neon main                          |

## Tasks

- [ ] Create Neon project; main and dev branches; least-privilege roles
- [ ] Create Vercel project linked to the GitHub repo
- [ ] Environment variables per environment (`DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `BLOB_READ_WRITE_TOKEN`, newsletter and Turnstile keys)
- [ ] Vercel Blob store connected for media
- [ ] Migrations run as part of the release (`payload migrate`) and are never auto-pushed in production
- [ ] Custom domain, HTTPS, `www` and apex redirect
- [ ] Backups: Neon point-in-time restore verified; periodic export stored separately; **restore tested once before launch**
- [ ] Monitoring: Vercel Analytics or Plausible (cookie-free), error tracking (Sentry), uptime check
- [ ] Preview deployments protected from indexing (`noindex`)
- [ ] Rollback procedure documented (Vercel instant rollback plus DB migration notes)
- [ ] Launch checklist (below) completed

## Launch checklist

- [ ] Modules 00 to 08 meet their Definition of Done
- [ ] Production admin 2FA enrolled for every staff member
- [ ] Real content in both languages, no placeholder text
- [ ] Sitemap submitted to Google Search Console and Bing
- [ ] Privacy policy and contact published
- [ ] Backup restore tested; rollback rehearsed
- [ ] Security headers and CSP verified on the production domain

## Acceptance criteria

- Merging to `main` deploys to production without manual steps other than approval.
- A bad deploy can be rolled back in under 5 minutes.
- Losing the database is recoverable, and the recovery has actually been done once.
- Costs are known: expected monthly spend written down, with alerts on spikes.
