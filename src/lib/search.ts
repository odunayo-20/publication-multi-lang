import type { Publication } from '@/payload-types'

export type SearchSort = 'relevance' | 'newest' | 'cited' | 'title'
export const searchSorts: SearchSort[] = ['relevance', 'newest', 'cited', 'title']

export const PAGE_SIZE = 10

/** Lower-case, strip diacritics and collapse whitespace so "Trošelj" matches "troselj". */
export const fold = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

export const tokenize = (query: string) => fold(query).split(' ').filter(Boolean)

const fieldsOf = (pub: Publication) => ({
  title: fold(pub.title),
  authors: fold(pub.authors.map((a) => a.name).join(' ')),
  venue: fold(pub.venue ?? ''),
  keywords: fold((pub.keywords ?? []).map((k) => k.keyword).join(' ')),
  abstract: fold(pub.abstract ?? ''),
  doi: fold(pub.doi ?? ''),
})

/**
 * Relevance of a publication for the query terms, or 0 when any term is missing from every field
 * (all terms must match somewhere, like a normal search box). Title hits weigh most.
 */
export const scorePublication = (pub: Publication, terms: string[]): number => {
  if (terms.length === 0) return 1
  const f = fieldsOf(pub)
  let score = 0
  for (const term of terms) {
    let hit = 0
    if (f.title.includes(term)) hit += 10
    if (f.authors.includes(term)) hit += 6
    if (f.keywords.includes(term)) hit += 5
    if (f.venue.includes(term)) hit += 4
    if (f.doi.includes(term)) hit += 4
    if (f.abstract.includes(term)) hit += 2
    if (hit === 0) return 0
    score += hit
  }
  return score
}

export type SearchFilters = { q: string; type?: string; year?: number; venue?: string }

export type Facet<T extends string | number> = { value: T; count: number }

export type SearchResult = {
  total: number
  items: Publication[]
  page: number
  pages: number
  facets: { types: Facet<string>[]; years: Facet<number>[]; venues: Facet<string>[] }
}

const countBy = <T extends string | number>(values: (T | null | undefined)[]): Facet<T>[] => {
  const map = new Map<T, number>()
  for (const v of values) if (v !== null && v !== undefined && v !== '') map.set(v, (map.get(v) ?? 0) + 1)
  return [...map].map(([value, count]) => ({ value, count }))
}

const compare = (sort: SearchSort) => (a: { pub: Publication; score: number }, b: { pub: Publication; score: number }) => {
  const byTitle = a.pub.title.localeCompare(b.pub.title)
  switch (sort) {
    case 'title':
      return byTitle
    case 'cited':
      return (b.pub.citationCount ?? 0) - (a.pub.citationCount ?? 0) || b.pub.year - a.pub.year || byTitle
    case 'newest':
      return b.pub.year - a.pub.year || b.score - a.score || byTitle
    default:
      return b.score - a.score || b.pub.year - a.pub.year || byTitle
  }
}

/**
 * Filters, ranks and paginates in memory. Facet counts follow the usual convention: each facet is
 * counted with every *other* filter applied, so picking a year does not collapse the year list.
 */
export const searchPublications = (
  all: Publication[],
  filters: SearchFilters,
  sort: SearchSort,
  page: number,
): SearchResult => {
  const terms = tokenize(filters.q)
  const scored = all
    .map((pub) => ({ pub, score: scorePublication(pub, terms) }))
    .filter((row) => row.score > 0)

  const matches = (row: { pub: Publication }, skip?: 'type' | 'year' | 'venue') =>
    (skip === 'type' || !filters.type || row.pub.type === filters.type) &&
    (skip === 'year' || filters.year === undefined || row.pub.year === filters.year) &&
    (skip === 'venue' || !filters.venue || row.pub.venue === filters.venue)

  const rows = scored.filter((row) => matches(row)).sort(compare(sort))
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(Math.max(1, page), pages)

  return {
    total: rows.length,
    items: rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map((r) => r.pub),
    page: current,
    pages,
    facets: {
      types: countBy(scored.filter((r) => matches(r, 'type')).map((r) => r.pub.type)).sort((a, b) => b.count - a.count),
      years: countBy(scored.filter((r) => matches(r, 'year')).map((r) => r.pub.year)).sort((a, b) => b.value - a.value),
      venues: countBy(scored.filter((r) => matches(r, 'venue')).map((r) => r.pub.venue))
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
        .slice(0, 12),
    },
  }
}

/** Parses the loose strings from the URL into safe filter values. */
export const parseSearchParams = (raw: Record<string, string | string[] | undefined>) => {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''
  const year = Number.parseInt(one(raw.year), 10)
  const sort = searchSorts.find((s) => s === one(raw.sort)) ?? 'relevance'
  const page = Number.parseInt(one(raw.page), 10)
  return {
    q: one(raw.q).trim().slice(0, 200),
    type: one(raw.type) || undefined,
    year: Number.isInteger(year) && year > 1000 && year < 3000 ? year : undefined,
    venue: one(raw.venue).slice(0, 200) || undefined,
    sort,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

/** Builds a /search href keeping the given params and dropping empty ones. */
export const searchHref = (
  locale: string,
  params: Record<string, string | number | undefined>,
): string => {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === '' || (k === 'page' && v === 1) || (k === 'sort' && v === 'relevance')) continue
    sp.set(k, String(v))
  }
  const qs = sp.toString()
  return `/${locale}/search${qs ? `?${qs}` : ''}`
}
