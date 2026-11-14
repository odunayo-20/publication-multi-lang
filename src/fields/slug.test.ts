import { describe, expect, it } from 'vitest'
import { toSlug, truncateSlug } from './slug'

describe('toSlug', () => {
  it('removes Croatian diacritics', () => {
    expect(toSlug('Joško Trošelj: Poplave i čađa, đir')).toBe('josko-troselj-poplave-i-cada-dir')
  })

  it('collapses punctuation and trims dashes', () => {
    expect(toSlug('  --Hello,   World!--  ')).toBe('hello-world')
  })

  it('returns an empty string when nothing usable remains', () => {
    expect(toSlug('???')).toBe('')
  })
})

describe('truncateSlug', () => {
  it('leaves short slugs alone', () => {
    expect(truncateSlug('short-slug', 80)).toBe('short-slug')
  })

  it('cuts at a word boundary, never mid-word', () => {
    expect(truncateSlug('flash-flood-forecasting-in-small-catchments', 25)).toBe('flash-flood-forecasting')
  })

  it('hard-cuts a single very long word', () => {
    expect(truncateSlug('a'.repeat(120), 80)).toHaveLength(80)
  })

  it('never ends with a dash', () => {
    expect(truncateSlug('abcde-fghij-klmno', 12)).toBe('abcde-fghij')
  })
})
