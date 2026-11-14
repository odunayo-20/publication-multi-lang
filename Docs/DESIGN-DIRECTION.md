# Design Direction: Portrait, Colour, Type, and Brand Assets

Status: recommendation for owner and professor sign-off. Supersedes the palette in `BRAND.md`. I have not seen his current portrait or any colours from his current site, and I cannot produce photographs; section 1 is an art-direction brief for a photographer. Colours and type below are proposals to be shown on real pages before they are final.

## 0. Design idea

**"Water level."** He studies floods, rivers and coasts. The brand borrows the calm, exact language of hydrology: a still deep-water accent, sand-and-paper neutrals, and one thin line, a **hydrograph curve**, as the only decorative device. The site should feel like a good instrument: precise, quiet, trustworthy, with a small signal of alertness where it matters.

Words to design against: **clear, precise, calm, grounded, curious.** Not: flashy, corporate-blue, stock-science (beakers, DNA helices, glowing networks).

---

## 1. The portrait (art direction)

The portrait is the single most important image on the site. It is what a journalist or reviewer remembers.

**Concept:** an _environmental portrait_, him in his world, not a passport photo and not a lab-coat cliché. Outdoors near water (river, coast, a bridge or weir), or at a window with a landscape behind. This quietly says "hydrology" without a caption.

| Aspect         | Direction                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Framing        | Head and shoulders, eye level, slightly off-centre; space on one side for the home-page text                               |
| Expression     | Relaxed, direct, a real half-smile (approachable but serious). Not stiff, not goofy                                        |
| Light          | Soft natural light: overcast day or the hour after sunrise / before sunset. Avoid harsh midday sun and flash               |
| Background     | Blurred water, sky or greenery in muted blues, greys, greens. No busy signage                                              |
| Clothing       | Solid, muted, mid-tone (navy, charcoal, deep green, off-white). No small patterns, no logos                                |
| Camera         | Any recent phone with portrait mode works if light is good; a photographer is better                                       |
| Files          | 3000 px on the long edge minimum, original not screenshot. Deliver 4:5 (home), 1:1 (cards), 16:9 and 1.91:1 (social) crops |
| Set to request | 1 hero portrait, 1 alternate, 2 candid "working" shots (fieldwork, at a desk, presenting)                                  |
| Extras         | Optionally a tight 1:1 crop for the favicon-sized avatar; a version against a plain wall for press use                     |

**Treatment on the site:** natural colour, light grade to match the palette (slightly cool shadows, warm skin), no heavy filters or duotone. Subtle rounded corners (see tokens). Always with alt text and a photographer credit if required.

**Do not use:** a cropped group photo, a conference selfie, a LinkedIn screenshot, AI-generated or retouched-beyond-recognition images. A researcher's face is a trust signal.

**Practical:** ask the institute whether an official portrait exists (often free to use), and whether anyone on his team or at the institute can take photos. A one-hour session at a river or the coast gives all crops.

---

## 2. Colour

One accent, a warm neutral base, one rare signal colour. All text pairs below measured against WCAG 2.2.

### Light theme

| Role           | Name        | Hex       | Contrast / use                                              |
| -------------- | ----------- | --------- | ----------------------------------------------------------- |
| Background     | Paper       | `#FAF8F4` | Page background                                             |
| Surface        | Silt        | `#F1EEE7` | Cards, code, quote blocks                                   |
| Text           | Ink         | `#15181C` | 16.8:1 on paper                                             |
| Muted text     | Stone       | `#555C63` | 6.4:1 on paper, 5.9:1 on silt. Metadata, captions           |
| Accent         | Deep water  | `#0B5D75` | 7.0:1 on paper. Links, buttons, focus ring, hydrograph line |
| Accent (hover) | Deeper      | `#084A5E` | Hover and pressed                                           |
| Signal         | Flood amber | `#9A5A12` | 5.2:1 on paper. Rare: "new", notices, highlights            |
| Hairline       | Sand        | `#E3DED4` | Dividers only (decorative, 1.3:1). Input borders use Stone  |
| Text on accent | White       | `#FFFFFF` | 7.4:1 on deep water (buttons)                               |

### Dark theme

| Role       | Hex       | Notes                                                |
| ---------- | --------- | ---------------------------------------------------- |
| Background | `#0E1317` | Deep blue-black, not pure black                      |
| Surface    | `#161D22` |                                                      |
| Text       | `#ECEAE4` | 15.5:1                                               |
| Muted      | `#9AA3AA` | 7.3:1                                                |
| Accent     | `#6CC4D9` | 9.4:1 on background; text on accent is the bg colour |
| Signal     | `#E0A04A` | 8.3:1                                                |

**Why this palette:** deep teal-blue reads as water and authority without the generic "corporate blue"; warm paper is easier on the eye for long reading than pure white; amber is a controlled warning colour that ties to flood forecasting but is used sparingly (a new-publication badge, a notice), never as a second brand colour.

**Rules:** accent used for interactive elements only (links, buttons, focus, hydrograph line). Never colour alone to convey meaning (pair with text/icon). Respect `prefers-color-scheme` and offer a manual toggle.

**Alternatives if the institute or he prefers:** (a) deep green `#1E5B4B` for an ecological feel; (b) institute colour if there is a brand guide. I recommend the water teal.

---

## 3. Typography

| Use                              | Font (all free, Google Fonts or self-hosted)             | Why                                                                                 |
| -------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Headlines, article body          | **Source Serif 4** (variable)                            | Excellent for long reading, scholarly feel, full Croatian diacritics (č ć đ š ž)    |
| UI, metadata, navigation, tables | **Inter** (variable)                                     | Clean, highly legible at small sizes, tabular figures for years and citation counts |
| Code, data, DOIs                 | **JetBrains Mono** or system monospace                   | DOIs and BibTeX                                                                     |
| Japanese (rare)                  | system fallback (Noto Serif JP / Noto Sans JP) on demand | He has some Japanese content; do not load by default                                |

**Scale (rem, 1.25 ratio):** 0.8 / 0.9 / 1 / 1.25 / 1.56 / 1.95 / 2.44 / 3.05. Body 18 to 20 px on desktop, 17 px on mobile, line height 1.65, measure about 65 characters. Headings tight (1.2). Use `font-display: swap`, self-host, subset to Latin Extended to keep it fast.

**Publication list typography:** year in tabular figures and Stone; title in Ink semibold; author list with his name in bold; venue in italic; action links (DOI, PDF, BibTeX) as small Inter in accent. This list is the most-viewed element on the site; design it first.

---

## 4. Identity assets

| Asset                        | Recommendation                                                                                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wordmark**                 | "Joško Trošelj" set in Source Serif 4, semibold, with correct diacritics. No logo icon needed; the name is the brand                                                                                                |
| **Monogram**                 | "JT" in the same serif, for favicon, avatar, newsletter header. The hydrograph line can pass under it                                                                                                               |
| **Hydrograph motif**         | A single thin line (1.5 px, accent) tracing a river-rise-and-recede curve. Uses: section divider, home hero underline, loading state, 404 illustration, newsletter header. Draw it as an SVG once, reuse everywhere |
| **Favicon / app icons**      | Monogram on Deep water background; sizes 32, 180 (Apple), 192 and 512 (PWA); SVG favicon for modern browsers                                                                                                        |
| **Social card (Open Graph)** | 1200 x 630 template: paper background, large title in serif, small portrait or monogram, hydrograph line, domain. Generated automatically per post and per publication                                              |
| **Email header**             | Same wordmark and line, plain, single column, dark-mode safe                                                                                                                                                        |
| **Tagline**                  | Do not invent one. Use a one-line research descriptor once he approves it; his existing tagline can live on About as a quote                                                                                        |
| **Photography set**          | Portrait (section 1) plus field or landscape shots from his work; his own figures from papers are better than stock                                                                                                 |
| **Icons**                    | One outline set (e.g. Lucide), 1.5 px stroke, used sparingly: language, download, external link, DOI, cite, search, RSS                                                                                             |

**Imagery rules:** prefer his real figures, maps and photographs. If stock is used, water, rivers and landscapes only; no laboratories, no beakers, no generic networks. Every image has alt text. Figures from papers need permission or open licences.

---

## 5. Layout and component principles

- **Reading width:** 65 characters; wider only for figures and tables.
- **Grid:** 12 columns, content in the middle 8; 16 px gutter on phones, 24 to 32 px desktop.
- **Spacing:** 4 px base unit; generous vertical rhythm between sections (64 to 96 px).
- **Radius:** 6 px on cards and images; 999 px only for pills (tags, language switch).
- **Elevation:** almost none; use hairlines and surface colour rather than shadows.
- **Motion:** minimal. 150 to 200 ms ease on hover and focus; hydrograph line may draw once on the home page; respect `prefers-reduced-motion`.
- **Focus:** 2 px accent outline with 2 px offset on every interactive element; skip link first.
- **Home hero:** left, name (large serif), role and institute (Inter, Stone), a 2-line plain-language summary, profile buttons (Scholar, ORCID, email); right, the portrait. Hydrograph line below. Then "Selected publications", "Latest writing", newsletter.
- **Newsletter block:** one field, one sentence of promise, one button. Calm, not a pop-up.
- **Tags and chips:** Silt background, Ink text, no colour-coding.
- **Tables and math:** horizontally scrollable on phones, KaTeX in Ink, captions in Stone.

---

## 6. Voice samples (to set the tone, to be rewritten by him)

- Home summary: "I study how floods happen and how we can see them coming. My work links river and coastal models with early-warning systems." _(placeholder, needs his words)_
- Newsletter promise: "Occasional notes on new papers and ideas. A few emails a year, unsubscribe in one click."
- Empty search: "Nothing found. Try fewer words, or browse the publications."
- 404: "This page has dropped below the gauge. Try the home page or search."

Croatian versions are written natively by a Croatian speaker, not translated.

---

## 7. What I need from the owner and the professor

| Need                                                      | Why                                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------------------ |
| Portrait files (or a photo session)                       | Section 1. Even a good existing photo helps me tune the crop and palette |
| Approval of palette or an alternative                     | Section 2; institute brand rules if any                                  |
| Exact name form, role, institute name and logo permission | Header and footer, legal notice                                          |
| ORCID, Scholar, institute profile URLs                    | Profile buttons and structured data                                      |
| 3 to 5 of his own figures or photos                       | For Research and article headers                                         |
| Short bio (100 and 300 words)                             | About and meta descriptions                                              |
| Preferred contact email                                   | Contact page                                                             |

## 8. Next design deliverables (before any code)

1. Moodboard and type specimen on a single page, light and dark.
2. Wireframes: Home, Publications list, Publication detail, Post, About, Contact, Newsletter (mobile first).
3. High-fidelity designs of Home and Publications in both themes and both languages, reviewed with him.
4. Design tokens (colour, type, spacing, radius) written down as a spec, then implemented.
5. Accessibility check of the final palette on real components (contrast above is for text pairs only).
