import { describe, expect, it } from 'vitest'

import { buildAuthorProfile, computeHIndex, getAuthorProfile, initialsOf, parseCompactNumber } from './authors'

describe('author helpers', () => {
  it('parses compact numbers', () => {
    expect(parseCompactNumber('1.2k')).toBe(1200)
    expect(parseCompactNumber('842')).toBe(842)
    expect(parseCompactNumber('n/a')).toBe(0)
  })

  it('computes the h-index', () => {
    expect(computeHIndex([])).toBe(0)
    expect(computeHIndex([10, 8, 5, 4, 3])).toBe(4)
    expect(computeHIndex([1, 1, 1])).toBe(1)
  })

  it('builds initials without honorifics', () => {
    expect(initialsOf('Dr. Samuel Adeyemi')).toBe('SA')
    expect(initialsOf('Prof. Blessing Okonfor')).toBe('BO')
  })

  it('derives a consistent profile from publications', () => {
    const profile = getAuthorProfile('samuel-adeyemi')!
    expect(profile.stats.publications).toBe(profile.works.length)
    expect(profile.stats.publications).toBeGreaterThan(0)
    expect(profile.byYear.reduce((n, y) => n + y.count, 0)).toBe(profile.works.length)
    expect(profile.coAuthors.some((c) => c.name === profile.record.name)).toBe(false)
  })

  it('returns null for unknown authors', () => {
    expect(getAuthorProfile('nobody')).toBeNull()
    expect(buildAuthorProfile(getAuthorProfile('samuel-adeyemi')!.record, []).stats.publications).toBe(0)
  })
})
