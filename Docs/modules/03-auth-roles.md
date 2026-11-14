# 03: Auth, Roles, Editor Workflow

**Goal:** A small, safe editorial team can write and publish; nobody else can get in.
**Depends on:** 01
**Status:** partial (Users collection with lockout and roles drafted)

## Scope

Admin authentication, roles and permissions, first-admin bootstrap, editorial workflow, audit trail.

## Out of scope

Public reader accounts (not in v1).

## Roles

| Role      | Can                                                |
| --------- | -------------------------------------------------- |
| admin     | everything, including users and settings           |
| editor    | create/edit/publish articles, authors, tags, media |
| anonymous | read published content only                        |

## Tasks

- [x] Roles field, admin-only role changes, lockout after 5 failed logins
- [x] First registered user becomes admin; later creation is admin-only
- [ ] Two-factor authentication for all staff (TOTP). Required, not optional
- [ ] Password policy: min length 12, breached-password check
- [ ] Admin-only invite flow (no open sign-up); invite emails via the email provider
- [ ] Optional: "author" role that can only edit their own drafts and submit for review
- [ ] Editorial workflow: draft, in review, published; reviewer comments
- [ ] Scheduled publishing (publishAt) via Vercel Cron
- [ ] Audit log: who published, changed roles, deleted
- [ ] Preview of drafts for staff only (secret-token preview route)

## Acceptance criteria

- An editor cannot promote themselves to admin by any route (UI, REST, GraphQL).
- 6th wrong password within the lock window is refused even with the right password.
- Staff without 2FA cannot reach the admin.
- Anonymous requests to draft preview return 404.

## Security

- Highest-risk module. Admin takeover means total compromise.
- Sessions: short-lived tokens, `HttpOnly`, `Secure`, `SameSite`.
- Rate-limit login and password reset at the edge.
- Disable GraphQL playground and introspection in production unless needed.
- CSRF: only trusted origins configured (`csrf` allowlist).

## Tests

- Integration: role-escalation attempts through every API surface.
- Integration: lockout behavior and unlock after window.
- E2E: invite, 2FA enrollment, login, logout.

## Decisions

- 2FA mandatory for staff (to confirm implementation: plugin vs custom).
