# 01: Content Model

**Goal:** The data structures that every other module relies on, with correct access rules from day one.
**Depends on:** 00
**Status:** drafted in code (Articles, Authors, Tags, Media, Users); needs a database to verify

## Scope

Payload collections, fields, relationships, drafts/versions, access control, slugs, media handling.

## Out of scope

Page rendering, search, translations workflow (see 02).

## Data model

| Collection | Key fields                                                                                         | Public read    |
| ---------- | -------------------------------------------------------------------------------------------------- | -------------- |
| Articles   | title*, slug, excerpt*, heroImage, content* (rich text), authors[], tags[], publishedAt, `_status` | published only |
| Authors    | name, slug, bio*, avatar                                                                           | yes            |
| Tags       | name*, slug                                                                                        | yes            |
| Media      | file, alt* (required)                                                                              | yes            |
| Users      | email, name, roles[]                                                                               | no             |

`*` = localized field.

## Tasks

- [x] Collections defined with access functions
- [x] Slug helper (diacritics-safe, handles Croatian characters)
- [x] Drafts + autosave on Articles
- [ ] Provision Neon database; run first migration (`payload migrate:create`), commit migrations
- [ ] Switch from dev schema push to migrations for production
- [ ] Reading time + word count computed field on Articles
- [ ] SEO group on Articles: meta title, meta description, social image (localized)
- [ ] Slug uniqueness conflict produces a friendly error
- [ ] Rich text: restrict allowed features (headings, lists, links, quotes, images, code); no raw HTML
- [ ] Seed script with sample EN + HR content for dev/tests
- [ ] Decide: localized slugs (better Croatian SEO) vs shared slug. Record the decision here.

## Acceptance criteria

- An editor can create a draft, save, publish, unpublish and the public API reflects it immediately.
- The public (unauthenticated) API never returns drafts, users, or unpublished versions.
- Deleting a tag or author does not break published articles.
- Images cannot be saved without alt text.
- Slug "Čovjek i đak" becomes `covjek-i-dak`.

## Security

- Collection access is explicit on every operation; no collection relies on defaults.
- Public queries use `overrideAccess: false` so access rules apply.
- Upload MIME allowlist (images only); size limit set; SVG excluded because of script risk.

## Tests

- Unit: `toSlug` with ASCII, Croatian diacritics, empty, symbols.
- Integration: access matrix, one test per role (anonymous, editor, admin) per collection operation.
- Integration: draft never leaks through REST or Local API without privileges.

## Decisions

- Slug is not localized in v1 (open to revisit; see task above).
