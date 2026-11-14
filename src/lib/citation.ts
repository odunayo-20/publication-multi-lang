import { toSlug } from '@/fields/slug'

/** The fields of a publication that citation output needs. Authors are written "Surname Initials". */
export type CitationSource = {
  title: string
  type: string
  year: number
  authors: { name: string }[]
  venue?: string | null
  volume?: string | null
  issue?: string | null
  pages?: string | null
  doi?: string | null
  url?: string | null
}

const STOP_WORDS = new Set(['a', 'an', 'the', 'on', 'of', 'in', 'for', 'and', 'to', 'from', 'with'])

/** "753-766" gives first and last page; a single page or an article id (e.g. "H52I-0570") gives only first. */
export const splitPages = (pages?: string | null): { first?: string; last?: string } => {
  const value = pages?.trim()
  if (!value) return {}
  const range = value.match(/^(\d+)\s*[-–—]\s*(\d+)$/)
  return range ? { first: range[1], last: range[2] } : { first: value }
}

/** "Trošelj J." becomes "Trošelj, J." (BibTeX and Scholar order). Names with a comma are kept. */
export const toSurnameFirst = (name: string): string => {
  const trimmed = name.trim()
  if (trimmed.includes(',')) return trimmed
  const [surname, ...rest] = trimmed.split(/\s+/)
  return rest.length ? `${surname}, ${rest.join(' ')}` : trimmed
}

/** e.g. troselj2025simulating: first surname, year, first meaningful word of the title. */
export const citationKey = ({ authors, year, title }: CitationSource): string => {
  const surname = toSlug(authors[0]?.name.trim().split(/\s+/)[0] ?? '').replace(/-/g, '')
  const word = toSlug(title)
    .split('-')
    .find((w) => w && !STOP_WORDS.has(w))
  return `${surname}${year}${word ?? ''}`
}

const ENTRY_TYPES: Record<string, string> = {
  'journal-article': 'article',
  'bulletin-article': 'article',
  'book-chapter': 'incollection',
  'conference-paper': 'inproceedings',
  'proceedings-paper': 'inproceedings',
}

const VENUE_FIELD: Record<string, string> = {
  article: 'journal',
  incollection: 'booktitle',
  inproceedings: 'booktitle',
  misc: 'howpublished',
}

const escapeBibtex = (value: string): string => value.replace(/([&%$#_])/g, '\\$1')

export const bibtex = (pub: CitationSource): string => {
  const entry = ENTRY_TYPES[pub.type] ?? 'misc'
  const esc = (value?: string | null) => (value ? escapeBibtex(value) : null)
  // The extra braces around the title keep BibTeX styles from lowercasing it.
  // DOIs and URLs are written as-is; everything else has TeX special characters escaped.
  const fields: [string, string | null | undefined][] = [
    ['author', esc(pub.authors.map((a) => toSurnameFirst(a.name)).join(' and '))],
    ['title', `{${escapeBibtex(pub.title)}}`],
    [VENUE_FIELD[entry], esc(pub.venue)],
    ['year', String(pub.year)],
    ['volume', esc(pub.volume)],
    ['number', esc(pub.issue)],
    ['pages', esc(pub.pages)?.replace(/\s*[-–—]\s*/, '--')],
    ['doi', pub.doi],
    ['url', pub.url],
  ]
  const lines = fields.filter(([, value]) => value).map(([key, value]) => `  ${key} = {${value}},`)
  return `@${entry}{${citationKey(pub)},\n${lines.join('\n')}\n}`
}

/** Meta tags Google Scholar reads (name to value). Talks and "other" are not scholarly articles. */
export const scholarMeta = (
  pub: CitationSource,
  extra: { pageUrl?: string; pdfUrl?: string | null } = {},
): Record<string, string | string[]> => {
  const venueTag: Record<string, string> = {
    'journal-article': 'citation_journal_title',
    'bulletin-article': 'citation_journal_title',
    'conference-paper': 'citation_conference_title',
    'proceedings-paper': 'citation_conference_title',
    'book-chapter': 'citation_inbook_title',
  }
  const tag = venueTag[pub.type]
  if (!tag) return {}

  const { first, last } = splitPages(pub.pages)
  const meta: Record<string, string | string[] | undefined | null> = {
    citation_title: pub.title,
    citation_author: pub.authors.map((a) => toSurnameFirst(a.name)),
    citation_publication_date: String(pub.year),
    [tag]: pub.venue,
    citation_volume: pub.volume,
    citation_issue: pub.issue,
    citation_firstpage: first,
    citation_lastpage: last,
    citation_doi: pub.doi,
    citation_abstract_html_url: extra.pageUrl,
    citation_pdf_url: extra.pdfUrl,
  }
  return Object.fromEntries(Object.entries(meta).filter(([, v]) => v)) as Record<string, string | string[]>
}

/** "29 (3), 753–766": the volume, issue and pages part of a reference, empty when none are known. */
export const venueDetail = ({ volume, issue, pages }: CitationSource): string => {
  const volumeIssue = [volume, issue ? `(${issue})` : null].filter(Boolean).join(' ')
  const range = pages?.trim().replace(/\s*[-–—]\s*/, '–')
  return [volumeIssue, range].filter(Boolean).join(', ')
}
