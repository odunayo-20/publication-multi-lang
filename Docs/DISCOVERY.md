# Discovery: Data, Admin Portal, Pages

Status: draft for owner review. No code yet. Built from `PLAN.md` and `modules/00-09`, plus what already exists in `src/collections`.

Legend: ✅ exists in code · 🟡 planned in docs, not built · 🆕 proposed here (not in current docs, needs a decision)

---

## 1. Product in one paragraph

A bilingual (EN default, HR) blog/magazine. The owner plus a few editors write in the Payload admin. Anonymous readers browse, search, filter by tag, and subscribe to a newsletter. No reader accounts in v1. One Next.js app, Neon Postgres, Vercel Blob.

**Users**

| Persona          | Goal                                                      | Surface                      |
| ---------------- | --------------------------------------------------------- | ---------------------------- |
| Reader           | Find and read articles in their language, subscribe       | Public site                  |
| Editor           | Write, translate, publish without help                    | Admin portal                 |
| Owner / admin    | All of the above, plus users, settings, safety            | Admin portal                 |
| Search engine    | Crawl correct language pairs, only published content      | sitemap, robots, hreflang    |

---

## 2. Database tables

Payload creates one main table per collection, plus `_locales`, `_rels`, `_versions` side tables for localized fields, relationships and drafts. The list below is the **logical** model; the physical tables are generated.

### 2.1 Core content (v1)

| Collection  | Status | Purpose                          | Fields (`L` = localized)                                                                                           | Relations                              |
| ----------- | ------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `articles`  | ✅     | The product                      | title L, slug, excerpt L (≤300), heroImage, content L (rich text), publishedAt, `_status`                          | → media, → authors[], → tags[]         |
| `authors`   | ✅     | Public byline (not a login)      | name, slug, bio L, avatar                                                                                          | → media                                |
| `tags`      | ✅     | Topic browsing                   | name L, slug                                                                                                       |                                        |
| `media`     | ✅     | Images                           | file, alt L (required), plus generated sizes `card`, `hero`                                                        |                                        |
| `users`     | ✅     | Staff logins only                | email, name, roles[] (admin, editor), lockout fields                                                               |                                        |

### 2.2 Gaps found in the docs (proposed)

| Item                        | Status | Why it is needed                                                                                       | Suggested shape                                                                  |
| --------------------------- | ------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| SEO group on articles       | 🟡     | Module 01/05: meta title, description, social image                                                    | Group field on `articles`, localized                                             |
| Reading time, word count    | 🟡     | Article page shows reading time                                                                        | Computed on save, stored on `articles`                                           |
| Scheduling                  | 🟡     | Module 03: scheduled publishing                                                                        | Payload `schedulePublish`, driven by Vercel Cron                                 |
| `pages` (static pages)      | 🆕     | About and Privacy are listed as pages but there is no place to edit them. Privacy text must be legally accurate and editable without a deploy | Localized title, slug, rich text, SEO group, draft status |
| `site-settings` (global)    | 🆕     | Site name, tagline, logo, default social image, footer links, social profiles, featured article, analytics ID | Single localized global                                                          |
| `navigation` (global)       | 🆕     | Header and footer menus editable by the owner                                                          | Could be merged into `site-settings`                                             |
| `redirects`                 | 🆕     | Slugs change; old links should 301, not 404. Matters for SEO once content exists                       | from, to, type. Small collection, admin-only                                     |
| `audit-log`                 | 🟡     | Module 03: who published, changed roles, deleted                                                       | actor, action, collection, docId, timestamp. Append-only, admin read             |
| `categories`                | 🆕     | Only if "tags" are not enough for a magazine's sections (e.g. Culture, Travel). Probably skip in v1    | Decide, see Q4                                                                   |
| `comments`                  | ❌     | Not in scope; needs moderation and spam work. Recommend **no** for v1                                  | n/a                                                                              |
| `subscribers`               | ❌     | Deliberately **not stored**: the provider holds emails (module 06)                                     | n/a                                                                              |

### 2.3 Entity relationships

```
users (staff)  ── edits ──▶ articles ◀── many-to-many ──▶ tags
                               │ ▲
                               │ └── many-to-many ──▶ authors ──▶ media (avatar)
                               └── heroImage ──▶ media
pages, site-settings, redirects: standalone
audit-log: references any document by (collection, id), no foreign key
```

Note: `authors` are separate from `users`. An editor who writes does not need an `authors` row, and a guest contributor can have a byline without a login. Optional link `authors.user → users` can come later.

### 2.4 Data rules worth settling now

- **Slugs:** shared across languages in v1 (decision recorded). Revisit before launch because Croatian URLs in Croatian rank better. Changing later requires the `redirects` table.
- **Deletion:** deleting a tag or author must not break published articles (module 01 acceptance). Either block delete while in use, or relationships tolerate missing targets.
- **Drafts never leak:** public reads always use access rules, never `overrideAccess`.
- **Translation completeness** is derived, not stored: a locale counts as "done" if title and content are non-empty in that locale.

---

## 3. Admin portal (Payload `/admin`)

Payload provides CRUD screens, versions, drafts, and live preview. The work is configuration plus a few custom pieces.

### 3.1 Screens

| Area                         | Who            | Notes                                                                                   |
| ---------------------------- | -------------- | --------------------------------------------------------------------------------------- |
| Login, forgot password       | all staff      | Lockout after 5 tries ✅; 2FA mandatory 🟡                                              |
| Dashboard                    | all staff      | 🆕 Custom: drafts awaiting review, scheduled posts, recently published, translation gaps |
| Articles list                | editor, admin  | Filters: status, locale completeness, tag, author. Columns include locale badges (EN ✔ HR ✖) |
| Article editor               | editor, admin  | Locale switcher, autosave ✅, versions/restore, preview, schedule, SEO, publish/unpublish |
| Authors, Tags                | editor, admin  | Simple CRUD; tag delete warns if in use                                                 |
| Media library                | editor, admin  | Alt text required ✅; images only; size limit                                           |
| Pages (About, Privacy)       | admin          | 🆕                                                                                      |
| Site settings, navigation    | admin          | 🆕                                                                                      |
| Redirects                    | admin          | 🆕                                                                                      |
| Users and invites            | admin          | Invite flow, no open sign-up 🟡; role change admin-only ✅                              |
| Audit log                    | admin          | Read-only 🟡                                                                            |
| Account / 2FA enrollment     | all staff      | 🟡                                                                                      |

### 3.2 Permission matrix

| Action                              | Anonymous | Editor | Admin |
| ----------------------------------- | :-------: | :----: | :---: |
| Read published content              | ✔         | ✔      | ✔     |
| Read drafts, versions               |           | ✔      | ✔     |
| Create / edit / publish articles    |           | ✔      | ✔     |
| Manage authors, tags, media         |           | ✔      | ✔     |
| Edit pages, settings, redirects     |           |        | ✔     |
| Manage users and roles              |           |        | ✔     |
| Read audit log                      |           |        | ✔     |

Optional third staff role, `author`: edits only their own drafts and submits for review (module 03). Only worth it if guest writers are expected, see Q3.

### 3.3 Editorial workflow

```
draft ──▶ (in review) ──▶ published ──▶ unpublished
  ▲            │               │
  └─ changes ──┘               └─ scheduled (publishAt)
```

Docs list "in review" as optional. Simplest v1 is draft → published with versions, and add review only when there is more than one writer.

### 3.4 Editor experience details that decide whether people enjoy it

- Autosave and "unsaved changes" warning.
- Preview of drafts via secret-token route, staff only, in the correct locale and theme.
- Rich text limited to: headings, lists, links, quotes, images, code. No raw HTML.
- Friendly error on duplicate slug.
- Admin UI available in EN and HR ✅.

---

## 4. Public site pages

All under `/{locale}/…` with `locale ∈ {en, hr}`. Each needs EN and HR versions, `hreflang`, canonical, and OG metadata.

### 4.1 Pages

| # | Page             | Route (suggested)             | Status | Contents                                                                                         |
| - | ---------------- | ----------------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| 1 | Root redirect    | `/`                           | 🟡     | Detect language (cookie → Accept-Language → default), redirect, no loops                         |
| 2 | Home             | `/{l}`                        | ✅ min | Featured article, latest list, tag chips, newsletter box                                         |
| 3 | Article          | `/{l}/articles/{slug}`        | ✅ min | Hero, title, byline, date, reading time, body, author box, related, share, newsletter CTA, JSON-LD |
| 4 | Article archive  | `/{l}/articles`               | 🆕     | Paginated full list. Home alone does not scale past ~20 posts                                    |
| 5 | Tags index       | `/{l}/tags`                   | 🟡     | All tags with counts                                                                             |
| 6 | Tag page         | `/{l}/tags/{slug}`            | 🟡     | Paginated articles, per-tag RSS link                                                             |
| 7 | Author page      | `/{l}/authors/{slug}`         | 🟡     | Bio, avatar, their articles                                                                      |
| 8 | Search           | `/{l}/search?q=`              | 🟡     | Input, results with snippets, empty and error states, pagination                                 |
| 9 | About            | `/{l}/about`                  | 🟡     | From `pages` collection                                                                          |
| 10 | Privacy         | `/{l}/privacy`                | 🟡     | From `pages`; names the newsletter provider, explains withdrawal (GDPR)                          |
| 11 | Newsletter confirmed | `/{l}/newsletter/confirmed` | 🟡   | Post-opt-in success                                                                              |
| 12 | Newsletter error / already subscribed | `/{l}/newsletter/error` | 🟡 | Generic, no email enumeration                                                          |
| 13 | Unsubscribed    | `/{l}/newsletter/unsubscribed`| 🟡     | One-click, no login                                                                              |
| 14 | 404, 500        | (global)                      | 🟡     | Both languages; 404 offers search                                                                |
| 15 | Missing translation notice | (inline on article) | 🟡   | "Not available in Croatian", fallback shown, `noindex`                                          |
| 16 | Contact         | `/{l}/contact`                | 🆕     | Optional. Needs spam protection and somewhere for mail to go. Could be just a mailto on About    |
| 17 | Draft preview   | `/{l}/preview/...`            | 🟡     | Staff only, anonymous gets 404                                                                   |

### 4.2 Non-page endpoints

| Endpoint                                | Purpose                                                      |
| --------------------------------------- | ------------------------------------------------------------ |
| `/sitemap.xml`                          | All locales, one entry per article per language, alternates  |
| `/robots.txt`                           | Disallow `/admin` and `/api`                                 |
| `/{l}/rss.xml`, `/{l}/tags/{slug}/rss.xml` | RSS/Atom per locale and per tag                           |
| `/api/search`                           | Validated, length-capped, rate-limited, locale-filtered      |
| `/api/newsletter/subscribe`             | Validation, Turnstile, rate limit, provider call             |
| `/api/revalidate` (internal)            | On-demand ISR when an article is published                   |
| Dynamic OG image per article            | Social previews                                              |

### 4.3 Shared components

Header with nav and language switcher (keeps you on the equivalent page), footer (about, privacy, RSS, newsletter), article card (card-size image), tag chip, pagination, author box, newsletter form, search box, theme (light/dark), cookie-free analytics.

### 4.4 Page-level rules

- Language switcher on an article goes to the same article in the other language, or shows the fallback notice.
- Pagination on every list (articles, tags, authors, search).
- Images via `next/image`, required alt, no layout shift.
- Keyboard navigable, skip link, WCAG 2.2 AA in both themes.
- ISR with on-demand revalidation (currently `force-dynamic`).

---

## 5. Suggested build order (PM view)

| Slice | Delivers                                                                                  | Why this order                                         |
| ----- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 0     | Provision Neon, first migration, seed EN+HR sample content                                | Nothing is verified until a real DB exists             |
| 1     | Brand + design tokens + layout shell + i18n dictionary and detection                      | Every page depends on it; brand needs owner sign-off   |
| 2     | Article, home, archive, tag, author pages; SEO group; reading time                        | Core reading loop; could ship an unlisted preview here |
| 3     | Admin hardening: 2FA, invites, password policy, preview, audit log, dashboard             | Must exist **before** real editors log in              |
| 4     | Static pages, site settings, redirects                                                    | Needed before launch, not for dev                      |
| 5     | Search, sitemap, robots, RSS, JSON-LD, OG images                                          | Discovery                                              |
| 6     | Newsletter                                                                                | Needs provider decision and privacy text first         |
| 7     | Security headers, a11y, E2E, Lighthouse budgets                                           | Hardening                                              |
| 8     | Deploy, domain, backups with a tested restore, monitoring                                 | Launch                                                 |

Critical path: DB → brand → content pages → admin hardening → launch. Newsletter and search can slip without blocking a launch.

---

## 6. Decisions made

| Topic       | Decision                                                                                          | Consequence                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Brand       | Personal scholarly brand: the professor's own name is the identity ([BRAND.md](BRAND.md)). "Margina" dropped | Tokens and layout shell wait for name form, field, domain                    |
| Scope       | Professor's academic site with fixed professional sections (section 10)                           | New data model: publications, research, teaching, talks                                           |
| Croatian address | Any; recommend formal "Vi"                                                                   | Recorded in BRAND.md                                                                              |
| Slugs       | One slug shared across languages                                                                  | Simpler routing and `hreflang`. Keep `redirects` collection for later renames                     |
| Writers     | Guest writers are in v1                                                                           | Add `author` staff role; draft → in review → published workflow; see below                        |
| Newsletter  | Buttondown (recommended)                                                                          | See below                                                                                         |

### Guest writer implications (promotes two "optional" items to required)

- Third staff role `author`: can create and edit **only their own** drafts, upload media, and submit for review. Cannot publish, delete, or see others' drafts.
- Editorial states: `draft → in review → published`. Editors and admins approve; reviewer comments on the article.
- Link `users` to `authors` (`authors.user`, optional) so a guest's login owns their byline and the access rule "own drafts only" is enforceable.
- Invite flow becomes essential (admin-only invites, 2FA still required for every staff role, guests included).
- Add to dashboard: "awaiting review" queue for editors.
- Add tests: an `author` cannot publish, edit another author's article, or change roles by any API surface.
- Open sub-question: do guests need a public bio/credit only (an `authors` row, no login) or a real login? Recommendation: start with editors entering guest articles on their behalf, and give logins only to regular guests, to keep the attack surface small.

### Newsletter: Buttondown

Why: built for independent publications, double opt-in and one-click unsubscribe are native, simple API for the signup route, tags per subscriber (use `en` / `hr`), Markdown composition, small and cheap at low volume, no heavy marketing-automation baggage.
Trade-offs to verify before committing (pricing and features change; check current plans): it is a US company, so the privacy text must name it and describe transfer safeguards. If EU data residency matters to the owner, **Brevo** (France-based) is the fallback; it is heavier and less editorial. Resend Audiences is developer-oriented with weaker newsletter authoring; Mailchimp is overbuilt for this need.
Impact: module 06 keeps "no emails in our DB". Language is stored as a provider tag. Confirmation email language needs checking in Buttondown's templates; if it cannot be localized per subscriber, that is the deciding risk.

## 7. Open questions for the owner

1. ~~Publication topic~~ Answered: professor's academic site. Still needed: field, exact name form (section 10.7).
2. ~~Sections~~ Answered: fixed sections (section 10).
3. ~~Tone of address~~ Answered: any; "Vi" recommended.
4. **Guest writers:** real logins or editor-entered? (see above)
5. **Translation policy:** must every article exist in both languages, or is single-language fine? Drives fallback UX and sitemap rules.
6. **Contact page:** needed, or just an email address on About?
7. **Comments, reader accounts, paid content:** confirm all stay out of v1.
8. **Analytics:** which cookie-free tool (Plausible, Umami, Vercel Analytics)?
9. **Launch date and content volume:** how many articles at launch? (Sizes pagination and search decisions.)
10. **Domain and email:** which domain, and which sender address for invites and the newsletter?

## 8. Risks

| Risk                                                         | Impact | Mitigation                                                     |
| ------------------------------------------------------------ | ------ | -------------------------------------------------------------- |
| Schema push in dev, no migrations committed                  | High   | Slice 0: create and commit migrations before any real data     |
| Admin takeover (small team, no 2FA yet)                      | High   | Slice 3 before launch; invite-only                             |
| Croatian search quality (Postgres has no Croatian dictionary)| Medium | `simple` config plus unaccent; test with real words; revisit   |
| Privacy text written late                                    | Medium | Draft with provider named once Q5 is answered                  |
| Slug strategy changed after launch                           | Medium | Decide Q2 now; add redirects                                   |
| Scope creep (comments, categories, contact)                  | Medium | Hold the v1 line in section 2.2                                |

## 9. Proposed next step

Answer the open questions in section 6 (questions 1, 2, 3, 5 block the most work), then update the module docs with the new items from section 2.2 and section 4.1 so the plan and this document agree.

---

## 10. Revision: academic scope (supersedes parts of sections 2 to 5)
> **Exploratory.** Superseded by [PRODUCT-BRIEF.md](PRODUCT-BRIEF.md), which starts from users and goals instead of the old site. Kept for reference.

New fact: the site is a **professor's academic site** (PhD-related research, teaching, writing). Fixed sections are wanted and should look professional. (Interpretation: your answer to the sections question was read as "yes, fixed sections, kept professional". Tell me if you meant the opposite.)

### 10.1 Site sections (public navigation)

| Section       | What it holds                                                          |
| ------------- | ---------------------------------------------------------------------- |
| Home          | Short intro, current focus, selected publications, latest posts, news  |
| About         | Bio, photo, affiliation, ORCID/Scholar links, downloadable CV          |
| Research      | Research areas and projects, each with description, team, funding      |
| Publications  | Full list: papers, books, chapters, theses, preprints; filter by year, type, area; citation export |
| Teaching      | Courses, syllabi, student resources, supervision, open PhD/thesis topics |
| Talks         | Conference talks, invited lectures, slides, recordings                 |
| Blog / Notes  | Explanatory articles for a wider audience (the existing `articles`)    |
| News          | Short dated items: grants, awards, new papers, events                  |
| People        | Group members, alumni, collaborators (optional, if there is a group)   |
| Contact       | Office, email, office hours, "prospective students" guidance           |
| Newsletter    | Optional, kept (Buttondown), but secondary to the above                |

### 10.2 New and changed data

| Collection / global | Status | Key fields (`L` = localized)                                                                                           | Notes                                                            |
| ------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `publications`      | 🆕     | title, type, authors (ordered, may include external names), venue, year, volume/issue/pages, DOI, abstract L, keywords, PDF (file), preprint URL, code/data links, status (published, in press, under review) | Core of the site. BibTeX and RIS generated on request            |
| `research-areas`    | 🆕     | title L, summary L, body L, image, order, → publications[], → projects[]                                               | Groups publications by theme                                     |
| `projects`          | 🆕     | title L, summary L, body L, funder, grant ID, start/end, status, team, links                                           | Funding acknowledgements matter to academics                     |
| `courses`           | 🆕     | code, title L, level, semester, description L, syllabus (file), materials[], active                                    | Teaching                                                         |
| `talks`             | 🆕     | title, event, location, date, type (invited, keynote, conference), slides (file), video URL, abstract L                | Reverse-chronological                                            |
| `news`              | 🆕     | title L, date, body L (short), link                                                                                    | Or fold into `articles` with a type; separate is simpler         |
| `people`            | 🆕     | name, role, photo, bio L, links, years, current/alumni                                                                 | Group members                                                    |
| `articles` (blog)   | ✅     | as before                                                                                                              | Blog posts; add references list and math support                 |
| `authors`           | ✅     | as before                                                                                                              | Reuse for co-authors; `publications.authors` may reference these or hold plain-text external names |
| `cv` (global)       | 🆕     | structured entries (education, positions, grants, awards, service), or an uploaded PDF                                 | Start with an uploaded PDF; structure later                      |
| `site-settings`     | 🆕     | name, title, affiliation, ORCID, Scholar, ResearchGate, LinkedIn, email, photo, default OG image                       | One global                                                       |
| `pages`, `redirects`, `audit-log` | 🆕/🟡 | as in section 2.2                                                                                      | Unchanged                                                        |
| Dropped from v1     | n/a    | `comments`, reader accounts, `categories` (replaced by the fixed sections above)                                       |                                                                  |

Rule: publications are **data, not articles**. This allows filtering, per-year grouping, BibTeX export and Google Scholar metadata, none of which free-form rich text supports.

### 10.3 Academic features (added requirements)

- Citation export per publication: BibTeX, RIS, plain-text "cite as".
- Google Scholar-friendly meta tags (`citation_title`, `citation_author`, `citation_publication_date`, `citation_pdf_url`) and JSON-LD `ScholarlyArticle`; `Person` JSON-LD with ORCID `sameAs`.
- Math rendering (LaTeX via KaTeX), footnotes, references block, figures with captions, tables, code blocks.
- PDF uploads (extend the Media allowlist: PDFs allowed, size limit; SVG still excluded).
- Open-access note and licence per publication (e.g. CC BY).
- Print stylesheet for CV, publication list and articles.
- Stable permalinks; "cite this page" on blog posts.
- WCAG 2.2 AA, with particular attention to math and tables.
- Multilingual policy: publications keep the original-language title and abstract; a translated abstract is optional. The fallback notice is already planned.

### 10.4 Revised public page list (replaces section 4.1 where they differ)

Home · About · CV · Research (index, area page, project page) · Publications (list with filters; single publication page with abstract, citation, PDF, BibTeX) · Teaching (index, course page) · Talks · Blog (list, article) · News (list) · People (optional) · Contact (incl. prospective students) · Search · Newsletter confirm/error/unsubscribed · Privacy · Legal notice (imprint, often required for EU sites) · 404/500. All in EN and HR.

### 10.5 Admin changes

- Admin groups: **Research** (publications, areas, projects), **Teaching** (courses), **Dissemination** (talks, news, blog), **People**, **Site** (settings, pages, redirects).
- Nice to have: paste a DOI or BibTeX and prefill the publication form (Crossref's public API), saving the professor typing.
- Dashboard: publications missing a PDF or abstract, items awaiting review, translation gaps.
- Roles unchanged: admin (the professor or a delegate), editor, author (guest or student, own drafts only).

### 10.6 Revised build order

1. Provision Neon, migrations, seed (a handful of real publications).
2. Brand tokens, layout shell, i18n (needs name form, field, domain).
3. Publications and Research (the heart of the site), About, CV, Contact.
4. Teaching, Talks, News, People.
5. Blog (largely built), math and references support.
6. Admin hardening (2FA, invites, roles, preview, audit log).
7. Discovery: search, sitemap, RSS, Scholar meta tags, JSON-LD.
8. Newsletter, security headers, a11y, E2E, deploy.

### 10.7 New open questions

1. Research field, exact name and title form, ORCID, university affiliation.
2. Does the university restrict branding, or require a university domain?
3. Will the professor maintain publications by hand, or should we import from ORCID/Crossref?
4. Is there a research group (People) and teaching content to publish at launch? A thin Teaching page is worse than none.
5. Is the newsletter still wanted? For an academic site it is optional; dropping it removes a module and a GDPR surface.
6. Legal notice / imprint requirements: owner to confirm with the university.

---

## 11. Findings from the existing site (joskotroselj.wordpress.com) and answers received
> **Evidence, not requirements.** These are observations of the current WordPress site. They inform the product brief but do not define it. See [PRODUCT-BRIEF.md](PRODUCT-BRIEF.md).

Source: a text-only read of four pages (home, About me, Skillset & Quotes, Publications). Images, older posts, and individual posts were not read, and I did not see colors or the header photo. Everything below should be confirmed with the professor.

### 11.1 Answers received

| Topic        | Answer                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------- |
| Domain       | Personal domain (e.g. `joskotroselj.com` / `.hr`; availability not checked)                    |
| Publications | Both: manual entry and import                                                                  |
| Newsletter   | Wanted, for subscribers. Stays in v1 (Buttondown, see section 6)                               |
| Existing site | `joskotroselj.wordpress.com` is his formal site today                                         |

### 11.2 Who he is (from the site)

- **Name:** Joško Trošelj (written "Josko Troselj" on the site title and in the URL). Publications use "Trošelj J.".
- **Role (to verify):** Research Associate since March 2024.
- **Affiliation:** Ruđer Bošković Institute, Laboratory for Informatics and Environmental Modelling, Division for Marine and Environmental Research (Croatia). Earlier career in Japan.
- **Field:** flash-flood forecasting and early warning, hydrological and hydrometeorological modelling, river discharge and typhoon-driven extremes, coastal/ocean modelling, historical and engineering hydrology.
- **Profiles:** Google Scholar (linked). No ORCID or ResearchGate found.
- **Languages:** mostly English, some Croatian (press coverage, a quote), a little Japanese.

### 11.3 What this changes

1. **Scope is smaller than section 10 assumed.** The current site has four menu items: Home, About me, Skillset & Quotes, Publications. There is no teaching, projects, talks, CV or contact page. Do **not** build Teaching, People, or Projects for launch; a thin page is worse than none. They stay as later additions.
2. **Talks come from publications.** The existing list already contains an invited talk and an invited lecture. Make `type` on `publications` cover: journal article, book chapter, proceedings paper, conference paper, bulletin article, invited talk, invited lecture, preprint. A "Talks" view is then just a filter. Drop the separate `talks` collection until there is slide/video content.
3. **Publication volume is small:** 23 entries on the current page (11 journal articles and 1 book chapter, 8 conference articles, 3 other). Conference papers live on Google Scholar. Manual entry plus import is realistic; no need for heavy tooling.
4. **No ORCID.** Recommend creating one now (free, takes minutes). It becomes the import source (ORCID lists works and DOIs, Crossref fills metadata) and a canonical identity link. Google Scholar has no official API, so it stays a link, not an import source.
5. **No contact method is shown.** Add a Contact page with an email (spam-protected) and a short "prospective students/collaborators" note. Needs his decision.
6. **Personal content exists and is part of his voice:** "Skillset & Quotes" (self-rated skills, original quotes) and an About page with hobbies and goals. Keep this as a section, e.g. **Quotes & Notes**. It is distinctive; do not sand it off. Ask him whether he wants to keep the self-rated skills chart.
7. **Blog is real:** about 9 posts on the home page, with more behind pagination: publication announcements, Croatian press coverage, a talk report, a job-start announcement. All are in a category called "Trash", which should not migrate. Map them to the new `articles` (with tags such as Publication, Press, Talk) or to `news`.
8. **Newsletter is already a feature of the old site** (the WordPress.com subscribe bar). Existing subscribers consented to WordPress.com, not to our provider. Plan a one-time migration: export if available (verify what WordPress.com allows), and send a re-permission email rather than silently importing, because of GDPR. Count of current subscribers is unknown; ask.
9. **Keep the old site alive until the new one is ready.** WordPress.com free sites cannot redirect to another domain; plan a final post and tagline pointing to the new domain, or check the paid redirect option. Verify before relying on either.
10. **Tone is warmer and more personal than BRAND.md assumed.** Tagline: "A scientist knows what others have done. An innovator is discovering it by himself." Playful, reflective, a little self-deprecating. Recommended voice: **precise about science, personal about everything else.** Research pages and abstracts formal; blog and Quotes & Notes can keep personality. Blog copy needs a proofreading pass (the current posts have some typos).

### 11.4 Revised launch scope

| Section             | Source                                                          | Launch? |
| ------------------- | --------------------------------------------------------------- | ------- |
| Home                | Intro, selected publications, latest posts, newsletter box      | Yes     |
| About               | From About me; photo; affiliation; profile links; CV (PDF)      | Yes     |
| Research            | Short area descriptions grouped from the publication themes     | Yes     |
| Publications        | 23 entries, filters by year/type, DOI, BibTeX, Scholar link     | Yes     |
| Blog / News         | Migrated posts, tagged; Croatian posts where they exist         | Yes     |
| Quotes & Notes      | From Skillset & Quotes                                          | Yes     |
| Contact             | New                                                             | Yes     |
| Newsletter          | Signup, confirmation, unsubscribe pages                         | Yes     |
| Privacy, Legal notice, 404/500 | New                                                  | Yes     |
| Teaching, People, Projects, Talks (separate) | None yet                           | Later   |

Data model for launch: `publications`, `articles` (blog/news), `pages` (About, Contact, Quotes, Privacy, Legal notice), `authors` (co-authors), `media`, `users`, plus `site-settings` and `redirects`. The rest of section 10.2 is deferred (`research-areas` could be a plain page first).

### 11.5 Guest writers, revisited

For a small personal site, guest writers likely means co-authors or colleagues contributing posts. Keep the `author` role and review step from section 6, but treat it as a **late** slice. It is the biggest security surface and adds no launch content.

### 11.6 Revised open questions

1. Confirm role/title and exact name form: "Joško Trošelj" with diacritics, "Research Associate"? Create an ORCID?
2. Which domain name? (`joskotroselj.com`, `.hr`, or both with one redirecting.)
3. Contact: which public email, and is a form wanted instead?
4. How many current WordPress subscribers, and can they be exported?
5. Keep the "skillset" chart, hobbies and goals on About / Quotes & Notes?
6. Which blog posts migrate, and in which language(s)? Should Croatian versions be written for the key posts?
7. Does the Ruđer Bošković Institute require approval, branding, or a disclaimer on a personal site?
8. Header photo and colors on the current site: send the portrait and any preferred colors.
9. Who proofreads Croatian copy?
