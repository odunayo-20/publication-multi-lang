import { describe, expect, it } from 'vitest'
import { messages, publicationTypeKeys } from './messages'

describe('messages', () => {
  it('has a Croatian label for every publication type', () => {
    for (const key of publicationTypeKeys) {
      expect(messages.hr.types[key]).toBeTruthy()
      expect(messages.en.types[key]).toBeTruthy()
    }
  })

  it('uses the right Croatian plural form', () => {
    const { count } = messages.hr.publications
    expect(count(1)).toBe('1 publikacija')
    expect(count(2)).toBe('2 publikacije')
    expect(count(4)).toBe('4 publikacije')
    expect(count(5)).toBe('5 publikacija')
    expect(count(11)).toBe('11 publikacija')
    expect(count(12)).toBe('12 publikacija')
    expect(count(14)).toBe('14 publikacija')
    expect(count(22)).toBe('22 publikacije')
    expect(count(23)).toBe('23 publikacije')
    expect(count(25)).toBe('25 publikacija')
  })

  it('uses the English singular for one', () => {
    expect(messages.en.publications.count(1)).toBe('1 publication')
    expect(messages.en.publications.count(23)).toBe('23 publications')
  })
})
