import { describe, expect, it } from 'vitest'

import type { Publication } from '@/payload-types'

import { buildAuthorProfile, computeHIndex, initialsOf, mapAuthor, normalizeName } from './authors'

const pub = (id: number, names: string[], extra: Partial<Publication> = {}): Publication =>
  ({
    id,
    title: `Paper ${id}`,
    slug: `paper-${id}`,
    type: 'journal-article',
    year: 2024,
    authors: names.map((name) => ({ name })),
    venue: 'Journal A',
    viewCount: 100,
    citationCount: 5,
    updatedAt: '',
    createdAt: '',
    ...extra,
  }) as Publication

const record = mapAuthor({
  id: 1,
  name: 'Dr. Samuel Adeyemi',
  slug: 'samuel-adeyemi',
  aliases: [{ name: 'Adeyemi S.' }],
  links: { orcid: 'javascript:alert(1)', scholar: 'https://scholar.google.com/x' },
  updatedAt: '',
  createdAt: '',
})

describe('author helpers', () => {
  it('computes the h-index', () => {
    expect(computeHIndex([])).toBe(0)
    expect(computeHIndex([10, 8, 5, 4, 3])).toBe(4)
    expect(computeHIndex([1, 1, 1])).toBe(1)
  })

  it('builds initials without honorifics', () => {
    expect(initialsOf('Dr. Samuel Adeyemi')).toBe('SA')
    expect(initialsOf('Prof. Blessing Okonfor')).toBe('BO')
  })

  it('matches names ignoring case and diacritics', () => {
    expect(normalizeName('Trošelj J.')).toBe(normalizeName('troselj j.'))
  })

  it('only keeps http(s) profile links', () => {
    expect(record.links.orcid).toBeUndefined()
    expect(record.links.scholar).toBe('https://scholar.google.com/x')
  })

  it('matches publications through aliases and excludes the author from co-authors', () => {
    const profile = buildAuthorProfile(record, [
      pub(1, ['Dr. Samuel Adeyemi', 'Other P.']),
      pub(2, ['Adeyemi S.', 'Other P.'], { year: 2023, citationCount: 9 }),
      pub(3, ['Someone Else']),
    ])
    expect(profile.stats.publications).toBe(2)
    expect(profile.stats.citations).toBe(14)
    expect(profile.stats.hIndex).toBe(2)
    expect(profile.coAuthors).toEqual([{ name: 'Other P.', slug: null, shared: 2 }])
    expect(profile.byYear.reduce((n, y) => n + y.count, 0)).toBe(2)
  })

  it('links co-authors to known profiles', () => {
    const other = mapAuthor({ id: 2, name: 'Other P.', slug: 'other-p', updatedAt: '', createdAt: '' })
    const profile = buildAuthorProfile(record, [pub(1, ['Dr. Samuel Adeyemi', 'Other P.'])], [record, other])
    expect(profile.coAuthors[0]?.slug).toBe('other-p')
  })
})
