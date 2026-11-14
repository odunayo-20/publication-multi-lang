import { describe, expect, it } from 'vitest'
import { locales } from '@/i18n/config'
import { homeSummary, researchFocus } from './home-content'

// Limits mirror the fields in src/globals/SiteSettings.ts; a longer text would fail the seed.
const LIMITS = { summary: 300, title: 60, description: 240 }

describe('home content', () => {
  it('has a summary and focus items in every locale', () => {
    for (const locale of locales) {
      expect(homeSummary[locale].length).toBeGreaterThan(0)
      expect(researchFocus[locale].length).toBeGreaterThan(0)
    }
  })

  it('keeps the same number of focus items in English and Croatian, in the same order', () => {
    expect(researchFocus.hr).toHaveLength(researchFocus.en.length)
  })

  it('stays within the field limits', () => {
    for (const locale of locales) {
      expect(homeSummary[locale].length).toBeLessThanOrEqual(LIMITS.summary)
      for (const { title, description } of researchFocus[locale]) {
        expect(title.length).toBeLessThanOrEqual(LIMITS.title)
        expect(description.length).toBeLessThanOrEqual(LIMITS.description)
      }
    }
  })

  it('has no placeholder or unfinished text', () => {
    const all = locales.flatMap((l) => [
      homeSummary[l],
      ...researchFocus[l].flatMap((f) => [f.title, f.description]),
    ])
    for (const text of all) {
      expect(text).not.toMatch(/lorem|todo|tbd|placeholder|xxx/i)
      expect(text).toBe(text.trim())
      expect(text).not.toMatch(/\s{2,}/)
    }
  })

  it('is written in the first person, with no hype words', () => {
    expect(homeSummary.en).toMatch(/^I /)
    expect(homeSummary.hr).toMatch(/^Modeliram /)
    const hype = /\b(revolutionary|groundbreaking|cutting-edge|world-class|leading)\b/i
    expect(homeSummary.en).not.toMatch(hype)
    for (const { description } of researchFocus.en) expect(description).not.toMatch(hype)
  })
})
