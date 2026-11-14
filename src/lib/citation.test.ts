import { describe, expect, it } from 'vitest'
import {
  bibtex,
  citationKey,
  scholarMeta,
  splitPages,
  toSurnameFirst,
  venueDetail,
  type CitationSource,
} from './citation'

const article: CitationSource = {
  title: 'Simulating the Tone River eastward diversion project',
  type: 'journal-article',
  year: 2025,
  authors: [{ name: 'Trošelj J.' }, { name: 'Hanasaki N.' }],
  venue: 'Hydrology and Earth System Sciences',
  volume: '29',
  issue: '3',
  pages: '753-766',
  doi: '10.5194/hess-29-753-2025',
}

describe('splitPages', () => {
  it.each([
    ['753-766', { first: '753', last: '766' }],
    ['753 – 766', { first: '753', last: '766' }],
    ['2269295', { first: '2269295' }],
    ['H52I-0570', { first: 'H52I-0570' }],
    ['', {}],
    [null, {}],
  ])('splits %j', (input, expected) => {
    expect(splitPages(input)).toEqual(expected)
  })
})

describe('toSurnameFirst', () => {
  it('puts the surname first with a comma', () => {
    expect(toSurnameFirst('Trošelj J.')).toBe('Trošelj, J.')
    expect(toSurnameFirst('Racault M-F.')).toBe('Racault, M-F.')
  })

  it('keeps names that already have a comma, and single names', () => {
    expect(toSurnameFirst('Trošelj, J.')).toBe('Trošelj, J.')
    expect(toSurnameFirst('Plato')).toBe('Plato')
  })
})

describe('citationKey', () => {
  it('uses the surname without diacritics, the year and the first meaningful title word', () => {
    expect(citationKey(article)).toBe('troselj2025simulating')
    expect(citationKey({ ...article, title: 'The Role of Rivers' })).toBe('troselj2025role')
  })

  it('survives a missing author or an empty title', () => {
    expect(citationKey({ ...article, authors: [], title: '' })).toBe('2025')
  })
})

describe('bibtex', () => {
  it('writes an @article with journal, number and an en-dash page range', () => {
    const out = bibtex(article)
    expect(out).toContain('@article{troselj2025simulating,')
    expect(out).toContain('author = {Trošelj, J. and Hanasaki, N.},')
    expect(out).toContain('title = {{Simulating the Tone River eastward diversion project}},')
    expect(out).toContain('journal = {Hydrology and Earth System Sciences},')
    expect(out).toContain('number = {3},')
    expect(out).toContain('pages = {753--766},')
    expect(out).toContain('doi = {10.5194/hess-29-753-2025},')
    expect(out.endsWith('\n}')).toBe(true)
  })

  it('omits fields that are empty', () => {
    const out = bibtex({ ...article, volume: null, issue: '', pages: undefined, doi: null })
    expect(out).not.toMatch(/volume|number|pages|doi/)
  })

  it('maps types to entry kinds and venue fields', () => {
    expect(bibtex({ ...article, type: 'conference-paper' })).toMatch(/^@inproceedings.*booktitle =/s)
    expect(bibtex({ ...article, type: 'book-chapter' })).toMatch(/^@incollection.*booktitle =/s)
    expect(bibtex({ ...article, type: 'invited-talk' })).toMatch(/^@misc.*howpublished =/s)
  })

  it('escapes TeX special characters but leaves URLs alone', () => {
    const out = bibtex({ ...article, title: 'Rain & 50% flood_risk', url: 'https://x.org/a_b?c=1&d=2' })
    expect(out).toContain('title = {{Rain \\& 50\\% flood\\_risk}},')
    expect(out).toContain('url = {https://x.org/a_b?c=1&d=2},')
  })
})

describe('scholarMeta', () => {
  it('describes a journal article for Google Scholar', () => {
    const meta = scholarMeta(article, { pageUrl: 'https://example.org/p', pdfUrl: null })
    expect(meta).toMatchObject({
      citation_title: article.title,
      citation_author: ['Trošelj, J.', 'Hanasaki, N.'],
      citation_publication_date: '2025',
      citation_journal_title: 'Hydrology and Earth System Sciences',
      citation_volume: '29',
      citation_issue: '3',
      citation_firstpage: '753',
      citation_lastpage: '766',
      citation_doi: '10.5194/hess-29-753-2025',
      citation_abstract_html_url: 'https://example.org/p',
    })
    expect(meta).not.toHaveProperty('citation_pdf_url')
  })

  it('uses the conference tag for conference papers and includes a PDF when given', () => {
    const meta = scholarMeta({ ...article, type: 'conference-paper' }, { pdfUrl: '/media/p.pdf' })
    expect(meta.citation_conference_title).toBe('Hydrology and Earth System Sciences')
    expect(meta.citation_pdf_url).toBe('/media/p.pdf')
  })

  it('emits nothing for talks and other non-article types', () => {
    expect(scholarMeta({ ...article, type: 'invited-talk' })).toEqual({})
    expect(scholarMeta({ ...article, type: 'other' })).toEqual({})
  })
})

describe('venueDetail', () => {
  it('joins volume, issue and pages', () => {
    expect(venueDetail(article)).toBe('29 (3), 753–766')
  })

  it('handles partial data', () => {
    expect(venueDetail({ ...article, issue: null })).toBe('29, 753–766')
    expect(venueDetail({ ...article, volume: null, issue: null, pages: '2269295' })).toBe('2269295')
    expect(venueDetail({ ...article, volume: '56 B', issue: null, pages: null })).toBe('56 B')
  })

  it('is empty when nothing is known', () => {
    expect(venueDetail({ ...article, volume: null, issue: null, pages: null })).toBe('')
  })
})
