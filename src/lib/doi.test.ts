import { describe, expect, it } from 'vitest'
import { isDoi, normalizeDoi } from './doi'

describe('normalizeDoi', () => {
  it.each([
    ['10.1000/ABC123', '10.1000/abc123'],
    ['https://doi.org/10.1000/abc123', '10.1000/abc123'],
    ['http://dx.doi.org/10.1000/abc123', '10.1000/abc123'],
    ['doi:10.1000/abc123', '10.1000/abc123'],
    ['DOI: 10.1000/abc123', '10.1000/abc123'],
    ['  10.1000/abc123  ', '10.1000/abc123'],
  ])('cleans %s', (input, expected) => {
    expect(normalizeDoi(input)).toBe(expected)
  })

  it('returns an empty string for blank input', () => {
    expect(normalizeDoi('   ')).toBe('')
  })
})

describe('isDoi', () => {
  it('accepts well-formed DOIs', () => {
    expect(isDoi('10.1000/xyz123')).toBe(true)
    expect(isDoi('10.1016/j.jhydrol.2020.125432')).toBe(true)
  })

  it.each(['', 'abc', '10.1/short', '10.1000/', '10.1000/has space', 'https://doi.org/10.1000/x'])(
    'rejects %j',
    (value) => {
      expect(isDoi(value)).toBe(false)
    },
  )
})
