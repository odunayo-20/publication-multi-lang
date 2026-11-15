import config from '@payload-config'
import { ArrowRight, Search, X } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'

import { PublicationItem, typeLabel } from '@/components/Publication'
import { fill, siteUi } from '@/content/site-ui'
import { locales, type Locale } from '@/i18n/config'
import { getAllAuthors } from '@/lib/authors'
import { getJournals } from '@/lib/journals'
import {
  fold,
  PAGE_SIZE,
  parseSearchParams,
  searchHref,
  searchPublications,
  searchSorts,
  tokenize,
} from '@/lib/search'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  const { locale } = await params
  const { q } = parseSearchParams(await searchParams)
  const t = siteUi[locale].search
  return {
    title: q ? fill(t.resultsFor, { q }) : t.metaTitle,
    // Result pages are endless combinations; keep them out of the index.
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/${locale}/search`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/search`])),
    },
  }
}

export default async function SearchPage({ params, searchParams }: Args) {
  const { locale } = await params
  const state = parseSearchParams(await searchParams)
  const t = siteUi[locale].search

  const payload = await getPayload({ config })
  const { docs: all } = await payload.find({
    collection: 'publications',
    locale,
    pagination: false,
    depth: 1,
    overrideAccess: false,
  })

  const filters = { q: state.q, type: state.type, year: state.year, venue: state.venue }
  const result = searchPublications(all, filters, state.sort, state.page)

  // Journals and authors only matter for a real query and only on the first page.
  const terms = tokenize(state.q)
  const showEntities = terms.length > 0 && result.page === 1
  const [journals, authors] = showEntities
    ? await Promise.all([
        getJournals(payload, locale).catch(() => []),
        getAllAuthors(payload, locale).catch(() => []),
      ])
    : [[], []]
  const hit = (text: string) => terms.every((term) => fold(text).includes(term))
  const matchedJournals = journals.filter((j) => hit(j.name)).slice(0, 3)
  const matchedAuthors = authors.filter((a) => hit(a.name)).slice(0, 3)

  const href = (over: Record<string, string | number | undefined>) =>
    searchHref(locale, { ...filters, sort: state.sort, page: 1, ...over })

  const activeChips = [
    state.type && { key: 'type', label: typeLabel(locale, state.type), clear: href({ type: undefined }) },
    state.year !== undefined && { key: 'year', label: String(state.year), clear: href({ year: undefined }) },
    state.venue && { key: 'venue', label: state.venue, clear: href({ venue: undefined }) },
  ].filter((chip): chip is { key: string; label: string; clear: string } => Boolean(chip))

  const from = (result.page - 1) * PAGE_SIZE + 1
  const to = from + result.items.length - 1
  const summary = result.total === 1 ? t.showingOne : fill(t.showing, { total: result.total })

  const facetGroup = (
    title: string,
    param: 'type' | 'year' | 'venue',
    active: string | number | undefined,
    rows: { value: string | number; count: number; label: string }[],
  ) =>
    rows.length > 0 && (
      <section className="se-facet" aria-labelledby={`facet-${param}`}>
        <h3 id={`facet-${param}`}>{title}</h3>
        <ul>
          {rows.map((row) => {
            const on = active === row.value
            return (
              <li key={row.value}>
                <Link
                  href={href({ [param]: on ? undefined : row.value })}
                  aria-current={on ? 'true' : undefined}
                  className="se-facet-link"
                >
                  <span>{row.label}</span>
                  <span className="se-count">{row.count}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    )

  return (
    <div className="se-page">
      <section className="se-hero">
        <div className="acad-container">
          <h1 className="se-title">{state.q ? fill(t.resultsFor, { q: state.q }) : t.title}</h1>
          <form action={`/${locale}/search`} method="GET" className="se-form" role="search">
            <Search size={18} aria-hidden="true" className="se-form-icon" />
            <input
              type="search"
              name="q"
              defaultValue={state.q}
              placeholder={t.placeholder}
              aria-label={t.label}
              autoComplete="off"
            />
            {state.type && <input type="hidden" name="type" value={state.type} />}
            {state.year !== undefined && <input type="hidden" name="year" value={state.year} />}
            {state.venue && <input type="hidden" name="venue" value={state.venue} />}
            {state.sort !== 'relevance' && <input type="hidden" name="sort" value={state.sort} />}
            <button type="submit">{t.button}</button>
          </form>
        </div>
      </section>

      <div className="acad-container se-layout">
        <aside className="se-filters" aria-label={t.filters}>
          {facetGroup(
            t.type,
            'type',
            state.type,
            result.facets.types.map((f) => ({ ...f, label: typeLabel(locale, f.value) })),
          )}
          {facetGroup(
            t.year,
            'year',
            state.year,
            result.facets.years.map((f) => ({ ...f, label: String(f.value) })),
          )}
          {facetGroup(
            t.journal,
            'venue',
            state.venue,
            result.facets.venues.map((f) => ({ ...f, label: f.value })),
          )}
        </aside>

        <main className="se-results">
          <div className="se-bar">
            <p className="se-summary" aria-live="polite">
              <strong>{summary}</strong>
              {result.total > 0 && result.pages > 1 && (
                <span className="se-range"> · {fill(t.range, { from, to, total: result.total })}</span>
              )}
            </p>
            <nav className="se-sort" aria-label={t.sortBy}>
              <span>{t.sortBy}</span>
              {searchSorts.map((s) => (
                <Link key={s} href={href({ sort: s })} aria-current={state.sort === s ? 'true' : undefined}>
                  {t.sorts[s]}
                </Link>
              ))}
            </nav>
          </div>

          {activeChips.length > 0 && (
            <ul className="se-chips" aria-label={t.active}>
              {activeChips.map((chip) => (
                <li key={chip.key}>
                  <Link href={chip.clear} aria-label={`${t.remove}: ${chip.label}`}>
                    {chip.label}
                    <X size={13} aria-hidden="true" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href={href({ type: undefined, year: undefined, venue: undefined })} className="se-clear">
                  {t.clear}
                </Link>
              </li>
            </ul>
          )}

          {(matchedJournals.length > 0 || matchedAuthors.length > 0) && (
            <div className="se-entities">
              {matchedJournals.length > 0 && (
                <section aria-label={t.matchingJournals}>
                  <h2>{t.matchingJournals}</h2>
                  <ul>
                    {matchedJournals.map((j) => (
                      <li key={j.slug}>
                        <Link href={`/${locale}/journals/${j.slug}`}>
                          <strong>{j.name}</strong>
                          <span>{fill(t.articles, { n: j.articlesCount })}</span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {matchedAuthors.length > 0 && (
                <section aria-label={t.matchingAuthors}>
                  <h2>{t.matchingAuthors}</h2>
                  <ul>
                    {matchedAuthors.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/${locale}/authors/${a.slug}`}>
                          <strong>{a.name}</strong>
                          <span>{a.institution}</span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {result.total === 0 ? (
            <div className="se-empty">
              <h2>{t.noResults}</h2>
              <p>{t.noResultsHint}</p>
              <Link href={`/${locale}/publications`} className="se-empty-link">
                {t.browse} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <ul className="pub-list se-list">
              {result.items.map((pub) => (
                <PublicationItem key={pub.id} pub={pub} locale={locale} />
              ))}
            </ul>
          )}

          {result.pages > 1 && (
            <nav className="se-pager" aria-label={t.pagination}>
              {result.page > 1 ? (
                <Link href={href({ page: result.page - 1 })} rel="prev">
                  {t.previous}
                </Link>
              ) : (
                <span aria-disabled="true">{t.previous}</span>
              )}
              <span className="se-pager-info">{fill(t.page, { page: result.page, pages: result.pages })}</span>
              {result.page < result.pages ? (
                <Link href={href({ page: result.page + 1 })} rel="next">
                  {t.next}
                </Link>
              ) : (
                <span aria-disabled="true">{t.next}</span>
              )}
            </nav>
          )}
        </main>
      </div>
    </div>
  )
}
