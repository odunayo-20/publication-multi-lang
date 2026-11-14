# 05: Discovery (Search, Tags, SEO, RSS)

**Goal:** Readers and search engines can find content easily.
**Depends on:** 04
**Status:** not started

## Scope

Site search, tag browsing, metadata, sitemap, RSS, structured data.

## Tasks

- [ ] Search backend: Postgres full-text search with proper language configs (`english`, and the closest for Croatian, e.g. `simple` plus unaccent). Decision recorded below
- [ ] Search endpoint with query validation, length cap, pagination, locale filter
- [ ] Search UI: input, results with highlighted snippets, empty and error states, keyboard accessible
- [ ] Diacritic-insensitive matching ("covjek" finds "čovjek")
- [ ] Tag pages with pagination
- [ ] Per-page metadata: title, description, canonical, Open Graph, Twitter card
- [ ] Dynamic Open Graph images per article
- [ ] `sitemap.xml` with all locales and `hreflang`
- [ ] `robots.txt` (admin and API disallowed)
- [ ] RSS and Atom feed per locale, plus per tag
- [ ] JSON-LD (`Article`, `BreadcrumbList`, `Organization`)

## Acceptance criteria

- Searching a word in an article's title or body returns it in under 300ms at 1,000 articles.
- Drafts and unpublished articles never appear in search, sitemap or feeds.
- Feeds validate in a public feed validator; structured data passes Google's Rich Results test.
- Sitemap lists each article once per available language, with correct alternates.

## Security

- Search input is parameterized (no string-built SQL); max length and rate limit applied.
- Output in snippets is escaped; only the highlight marker is allowed through.
- Feeds contain only published, public fields.

## Tests

- Integration: search relevance, diacritics, locale filtering, draft exclusion.
- Unit: sitemap and feed generators.
- E2E: search to result to article.

## Decisions

- Start with Postgres FTS; revisit Meilisearch or Algolia only if needed.
