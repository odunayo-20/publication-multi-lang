# 04: Public Site and Design System

**Goal:** A fast, beautiful, accessible reading experience in both languages.
**Depends on:** 01, 02
**Status:** minimal home and article pages exist; design not started

## Scope

Brand proposal, design tokens, layout, page templates, components, performance and accessibility baselines.

## Out of scope

Search, newsletter (own modules).

## Tasks

- [ ] Brand proposal (3 directions: name ideas, palette, type pairing, tone); owner picks one
- [ ] Design tokens: color (light and dark), type scale, spacing, radius, measure (about 65ch)
- [ ] Layout shell: header, nav, language switcher, footer (about, privacy, RSS)
- [ ] Home: featured article, latest list, tag chips
- [ ] Article page: hero image, title, byline, date, reading time, rich text, author box, related articles, share links
- [ ] Tag index and tag page, author page
- [ ] Static pages: About, Privacy, 404, error pages (both languages)
- [ ] Images through `next/image` with `card` and `hero` sizes, blur placeholder, required alt
- [ ] Switch pages from `force-dynamic` to ISR with on-demand revalidation when content is published
- [ ] Print stylesheet for articles
- [ ] Responsive: 320px to 1440px, no horizontal scroll

## Acceptance criteria

- Lighthouse on article page: Performance 90+, Accessibility 100, SEO 100 (mobile).
- Fully keyboard navigable; visible focus; skip-to-content link.
- Text contrast meets WCAG 2.2 AA in light and dark mode.
- Layout does not shift as images load (CLS under 0.1).
- Publishing an article updates the live page within seconds without a redeploy.

## Security

- Rich text rendered through the Lexical renderer only; never `dangerouslySetInnerHTML` with content.
- External links get `rel="noopener noreferrer"`.
- No third-party scripts without owner approval (privacy and CSP).

## Tests

- Playwright visual and functional checks on key pages, both locales and both themes.
- axe accessibility scan on every page template.
- Lighthouse CI budgets enforced in PR checks.

## Decisions

- Brand: pending proposal.
