# Product Brief: Personal Research Website

Status: draft for the owner. This brief starts from goals and users, not from the existing WordPress site. Items marked **(assumption)** are my guesses and are listed in section 9 to confirm. Anything not stated by the owner is an assumption, however plausible.

## 1. What we know (facts given)

- Built for a researcher (Joško Trošelj, PhD-level, Ruđer Bošković Institute). Operated by the owner of this project on his behalf.
- Bilingual: English and Croatian. Slugs shared across languages.
- Personal domain.
- A newsletter for subscribers is wanted.
- Publications will be added both by hand and by import.
- Guest writers are wanted "for now".
- Stack already chosen: Next.js, Payload CMS, Neon Postgres, Vercel.
- His current site exists; it is context, not a template.

Everything else below is design reasoning.

## 2. Problem and purpose

A researcher's online presence is how peers, journalists, students, funders and employers verify who they are and what they have done. A WordPress.com free site limits ownership, design, languages, and growth. The new site should be **the canonical home of his work and name**, owned by him, outliving any employer.

**Product statement (assumption):** a fast, bilingual, easy-to-maintain site where a visitor can, within seconds, know who he is, read what he has published, and follow his work.

## 3. Users and jobs to be done

| User                         | Job when they arrive                                         | What "success" looks like                          |
| ---------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| Peer / reviewer / collaborator | "Is this the right person? Show me his papers."            | Finds a paper, DOI, PDF, and citation in <30 s     |
| Journalist / public          | "What does he actually study, in plain words?"               | Understands the topic without reading a paper      |
| Prospective student / funder / employer | "Is he credible and reachable?"                   | Sees affiliation, track record, a way to get in touch |
| Subscriber                   | "Tell me when there is something new."                       | Gets rare, relevant emails, can leave in one click |
| The owner / professor        | "Add a paper or post in minutes, without a developer."       | Publishes alone, no fear of breaking things        |

Priority order **(assumption)**: peers and the public readers first, owner's maintenance effort a close second. A site he cannot easily update will go stale, which is the most common failure of academic sites.

## 4. Product principles

1. **Publications are the spine.** Everything else supports finding and understanding the work.
2. **Credibility in five seconds.** Name, role, institution, and profile links visible without scrolling.
3. **Maintenance is a feature.** Adding a paper must take minutes; stale pages are worse than no pages.
4. **Bilingual by design, not by obligation.** Every UI string exists in both languages; content may exist in one, with an honest notice.
5. **No page without content.** Do not ship empty sections to look complete.
6. **Quiet and fast.** No trackers, no pop-ups, excellent reading experience, accessible.
7. **Own the data.** Exportable, portable, backed up.

## 5. Scope: MoSCoW

| Priority | Feature                                                                                         | Reason                                         |
| -------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Must     | Home with name, role, affiliation, one-paragraph summary, selected publications, latest posts   | The five-second test                           |
| Must     | **Publications**: list, filter by year/type, detail page with abstract, DOI, PDF if allowed, BibTeX | The spine                                    |
| Must     | **About**: short bio, photo, profile links (Scholar, ORCID), CV download                        | Credibility                                    |
| Must     | **Writing** (blog/news): posts with tags, EN and HR                                             | Public-facing explanation; fuels the newsletter |
| Must     | **Contact**: email, institution, spam-safe                                                      | Currently the site has none **(assumption: wanted)** |
| Must     | **Newsletter**: signup, double opt-in, confirm, unsubscribe pages, both languages              | Owner requirement                              |
| Must     | Language switcher, `hreflang`, sitemap, SEO, Google Scholar meta tags                           | Findability by name and by paper               |
| Must     | Admin for the owner: 2FA, simple screens, drafts, preview, image alt text                       | Maintenance principle                          |
| Must     | Privacy page, legal notice, 404, accessibility AA, backups                                      | Compliance and trust                           |
| Should   | **Research** page: 3 to 5 topics in plain language, linked to publications                      | Serves the public/journalist job               |
| Should   | Search (Postgres full text)                                                                     | Useful once content grows                      |
| Should   | RSS per language                                                                                | Cheap, valued by academics                     |
| Should   | Publication import (ORCID/DOI) with manual override                                             | Owner requirement; reduces typing              |
| Could    | Personal page (quotes, interests) *(only if he wants it)*                                       | Personality, but his call, not ours            |
| Could    | Guest writer accounts with review (see 7)                                                       | Wanted "for now", not urgent                   |
| Could    | Talks, Teaching, Projects, People as dedicated sections                                         | Only when real content exists                  |
| Won't (v1) | Comments, reader accounts, paid content, e-commerce, analytics with cookies                   | Complexity without value                       |

## 6. Experience design (information architecture)

```
Home
├─ Publications ─ detail
├─ Research            (should)
├─ Writing ─ post ─ tag
├─ About (with CV)
├─ Contact
├─ Newsletter (signup block everywhere, confirm / unsubscribed pages)
└─ Footer: Privacy, Legal notice, RSS, language switch
```

Top nav: five or six items maximum. Search sits in the header once it exists. Language switch in header, stays on equivalent page.

**Key flows to design first (highest value):**
1. *Arrive from Google on a paper page* → abstract, cite, PDF/DOI, "more by the author", subscribe.
2. *Arrive on the home page by his name* → understand who, see best work, follow.
3. *Subscribe* → one field, clear promise ("rare emails, X per month"), confirm, welcome.
4. *Owner adds a publication* → paste DOI → check prefilled fields → publish. Under 3 minutes.
5. *Owner writes a post in both languages* → write EN → switch locale → write HR or skip → publish → newsletter optional.

**Design stance:** typography-led, generous white space, one accent color, light and dark, strong hierarchy for publication lists (year, title, venue, links). Final look waits on his portrait, preferred colors, and the institute's rules.

## 7. Data model, MVP only

| Table / collection | Purpose                                        | Notes                                                               |
| ------------------ | ---------------------------------------------- | ------------------------------------------------------------------- |
| `publications`     | The spine                                      | title, type, authors (ordered, plain text with optional link), venue, year, DOI, abstract (localized), PDF, keywords, status |
| `posts` (articles) | Writing                                        | already exists as `articles`; add SEO group, reading time           |
| `tags`             | Topic filtering                                | exists                                                              |
| `pages`            | About, Contact, Research, Privacy, Legal       | localized rich text, editable without a deploy                      |
| `media`            | Images and PDFs                                | alt text required; PDFs allowed; SVG excluded                       |
| `users`            | Staff logins                                   | owner = admin                                                       |
| `site-settings`    | Name, role, institution, profile links, photo, nav | one global                                                      |
| `redirects`        | Old URLs, renamed slugs                        | small; important at migration from WordPress                        |

Deliberately **not** in MVP: separate `talks`, `courses`, `projects`, `people`, `research-areas`, `categories`, `comments`, `subscribers` (emails stay with the newsletter provider), `audit-log` (add if more than one admin).
Publication `type` covers journal article, book chapter, conference paper, proceedings, invited talk, preprint, so "Talks" is a filter, not a collection.
`authors` for posts: keep the existing collection, but co-author names on publications are plain text.

## 8. Roles and guest writers

Simplest model that meets "guest writers for now":

- **Admin**: the owner, full control, 2FA.
- **Editor**: trusted helper; publish anything content-related.
- **Guest author** (late slice): own drafts only, submit for review; invited by admin.

A one-person site does not need a review workflow on day one. Build it only when the first real guest exists. Until then, a guest sends text and the owner enters it under their name.

## 9. Assumptions to confirm (and the default if no answer)

| # | Assumption                                                         | Default if not confirmed                            |
| - | ------------------------------------------------------------------ | --------------------------------------------------- |
| 1 | Audience priority is peers and the interested public               | Go with it                                          |
| 2 | He wants a Contact page with a public email                        | Email shown spam-protected on Contact               |
| 3 | A Research page in plain language is wanted                        | Include as "Should"                                 |
| 4 | Personal/quotes page is **not** assumed                            | Not built; add only if he asks                      |
| 5 | Old blog posts migrate selectively                                 | Migrate only posts he picks; start with ~5          |
| 6 | He is comfortable writing Croatian and English                     | English first, Croatian per post as a notice-backed option |
| 7 | Role/title as stated on his current site                           | Confirm before publishing                           |
| 8 | PDFs of papers can be hosted (copyright)                           | Link to DOI by default; host PDF only if cleared    |
| 9 | Institute allows a personal site without approval                  | Add a short "views are my own" line if requested    |
| 10 | Old WordPress subscribers can be contacted again                  | Send a re-permission email, no silent import        |

## 10. Success measures

- Searching his name returns the new site above the old one within ~3 months of launch (SEO).
- Each publication page is indexable by Google Scholar (valid citation meta tags).
- Owner can add a publication and a post unaided, timed at launch.
- Newsletter: double opt-in confirmation rate and unsubscribe rate tracked in the provider.
- Lighthouse: Performance 90+, Accessibility 100 on key pages.
- Zero draft or private data exposed through the public API.

## 11. Delivery plan (milestones)

| Milestone | Outcome                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------- |
| M0        | Brief signed off; Neon provisioned; first migration; seed with real publications                  |
| M1        | Design: portrait, colors, home + publication page designs reviewed with the owner before code      |
| M2        | Publications, About, Contact, Home, Writing; bilingual shell                                       |
| M3        | Admin hardening for the owner: 2FA, preview, backups, import helper                                |
| M4        | SEO and Scholar meta, sitemap, RSS, search                                                         |
| M5        | Newsletter end to end, privacy and legal pages                                                     |
| M6        | Migration and redirects from WordPress, accessibility and performance pass, launch                 |
| Later     | Guest authors with review, Teaching/Talks/People if content appears                                |

Critical path: M0 → M1 (design sign-off) → M2 → M5 → M6. M4 and M3 can overlap M2.

## 12. Risks

| Risk                                          | Mitigation                                                       |
| --------------------------------------------- | ---------------------------------------------------------------- |
| Site goes stale after launch                  | Maintenance principle; DOI import; owner handover session        |
| Over-building for one person                  | MoSCoW above; no section without content                         |
| Brand decisions delayed (portrait, colors)    | Neutral default tokens; swap later                               |
| Copyright on hosted PDFs                      | DOI link default; host only cleared PDFs                         |
| Subscriber consent on migration               | Re-permission email                                              |
| Croatian content never written                | Honest fallback notice; EN-first launch is acceptable            |
| Domain / institute policy surprise            | Ask early (assumption 9)                                         |
