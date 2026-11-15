import { describe, expect, it } from 'vitest'

import type { Publication } from '@/payload-types'

import { PAGE_SIZE, parseSearchParams, searchHref, searchPublications, tokenize } from './search'

const pub = (id: number, extra: Partial<Publication> = {}): Publication =>
  ({
    id,
    title: `Paper ${id}`,
    slug: `paper-${id}`,
    type: 'journal-article',
    year: 2024,
    authors: [{ name: 'Someone A.' }],
    venue: 'Journal A',
    citationCount: 0,
    updatedAt: '',
    createdAt: '',
    ...extra,
  }) as Publication

const data = [
  pub(1, { title: 'Hydrograph analysis', authors: [{ name: 'Trošelj J.' }], year: 2022, citationCount: 3 }),
  pub(2, { title: 'Other work', abstract: 'A study of hydrograph shapes', year: 2023, type: 'preprint', venue: 'Journal B' }),
  pub(3, { title: 'Unrelated', year: 2021, citationCount: 9 }),
]

describe('search', () => {
  it('ignores case and diacritics and requires every term', () => {
    expect(tokenize('  Trošelj  HYDRO ')).toEqual(['troselj', 'hydro'])
    expect(searchPublications(data, { q: 'troselj hydrograph' }, 'relevance', 1).items.map((p) => p.id)).toEqual([1])
  })

  it('ranks title hits above abstract hits', () => {
    const ids = searchPublications(data, { q: 'hydrograph' }, 'relevance', 1).items.map((p) => p.id)
    expect(ids).toEqual([1, 2])
  })

  it('returns everything for an empty query and sorts by citations', () => {
    const r = searchPublications(data, { q: '' }, 'cited', 1)
    expect(r.items.map((p) => p.id)).toEqual([3, 1, 2])
  })

  it('counts each facet with the other filters applied', () => {
    const r = searchPublications(data, { q: '', type: 'preprint' }, 'newest', 1)
    expect(r.total).toBe(1)
    // The type facet still lists journal articles; the year facet only lists the preprint's year.
    expect(r.facets.types.map((f) => f.value).sort()).toEqual(['journal-article', 'preprint'])
    expect(r.facets.years).toEqual([{ value: 2023, count: 1 }])
  })

  it('paginates and clamps the page', () => {
    const many = Array.from({ length: PAGE_SIZE + 3 }, (_, i) => pub(i + 1))
    const r = searchPublications(many, { q: '' }, 'title', 99)
    expect(r.pages).toBe(2)
    expect(r.page).toBe(2)
    expect(r.items).toHaveLength(3)
  })

  it('parses hostile params safely', () => {
    expect(parseSearchParams({ year: 'abc', page: '-3', sort: 'drop table', q: ['a', 'b'] })).toMatchObject({
      year: undefined,
      page: 1,
      sort: 'relevance',
      q: 'a',
    })
  })

  it('builds hrefs without empty params', () => {
    expect(searchHref('en', { q: 'a b', page: 1, sort: 'relevance', year: undefined })).toBe('/en/search?q=a+b')
    expect(searchHref('en', {})).toBe('/en/search')
  })
})
