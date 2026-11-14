# 08: Testing and Quality Gates

**Goal:** Confidence to change anything. Quality is enforced by CI, not memory.
**Depends on:** runs alongside every module
**Status:** not started

## Test pyramid

| Layer         | Tool                   | What                                                                        |
| ------------- | ---------------------- | --------------------------------------------------------------------------- |
| Unit          | Vitest                 | pure helpers (slug, locale, plural, feed builders)                          |
| Integration   | Vitest + test Postgres | access control matrix, search, drafts, newsletter handler (provider mocked) |
| E2E           | Playwright             | reader journeys, editor journey, both locales                               |
| Accessibility | axe via Playwright     | every page template                                                         |
| Performance   | Lighthouse CI          | budgets on home and article                                                 |
| Visual        | Playwright screenshots | key pages, light/dark, mobile/desktop                                       |

## Tasks

- [ ] Vitest setup and first unit tests (`toSlug`, `isLocale`)
- [ ] Integration harness: throwaway Postgres (Neon branch or Docker), seeded fixtures
- [ ] Playwright setup with EN and HR projects, mobile and desktop viewports
- [ ] axe scan helper reused by all page tests
- [ ] Lighthouse CI config with budgets
- [ ] CI jobs: lint, typecheck, unit, integration, e2e, build; required for merge
- [ ] Test data seed (EN and HR articles, including one article with no Croatian translation)
- [ ] Bug template: steps, expected, actual, locale, browser

## Core E2E journeys

1. Reader opens home, reads an article, switches language.
2. Reader searches with a diacritic-free query and finds a Croatian article.
3. Reader filters by tag.
4. Reader subscribes; confirmation shown; double opt-in required.
5. Editor logs in (2FA), drafts, publishes; article appears publicly; unpublishes; disappears.
6. Anonymous user cannot access admin, drafts or user data.

## Exploratory checklist (tester hat, per module)

- Empty, very long, and unicode input (č ć š ž đ, emoji, RTL text)
- Back/forward, refresh mid-flow, double-submit
- Slow network and offline behavior
- Keyboard only, screen reader spot check, 200% zoom
- Safari, Firefox, Chrome, and a real phone

## Acceptance criteria

- Merging is blocked unless all CI jobs pass.
- Every acceptance criterion in modules 01 to 07 maps to at least one automated test, or is explicitly marked manual with a reason.
- Flaky tests are fixed or quarantined within a week.
