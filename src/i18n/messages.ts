import type { Locale } from './config'

const en = {
  skipToContent: 'Skip to content',
  language: 'Language',
  nav: { publications: 'Publications' },
  home: { latest: 'Latest', noArticles: 'No articles yet.' },
  publications: {
    title: 'Publications',
    intro: 'Peer-reviewed articles, conference contributions and talks.',
    filterByType: 'Filter by type',
    all: 'All',
    jumpToYear: 'Jump to year',
    empty: 'No publications match this filter.',
    count: (n: number) => (n === 1 ? '1 publication' : `${n} publications`),
    type: 'Type',
    year: 'Year',
    publishedIn: 'Published in',
    doi: 'DOI',
    link: 'Link',
    pdf: 'PDF',
    abstract: 'Abstract',
    cite: 'Cite',
    citeHint: 'BibTeX, for LaTeX and reference managers.',
    back: 'All publications',
  },
  types: {
    'journal-article': 'Journal article',
    'book-chapter': 'Book chapter',
    'conference-paper': 'Conference paper',
    'proceedings-paper': 'Proceedings paper',
    'bulletin-article': 'Bulletin article',
    'invited-talk': 'Invited talk',
    'invited-lecture': 'Invited lecture',
    preprint: 'Preprint',
    other: 'Other',
  },
}

type Messages = typeof en

// Croatian is a first draft and needs a native proofread before launch.
const hr: Messages = {
  skipToContent: 'Preskoči na sadržaj',
  language: 'Jezik',
  nav: { publications: 'Publikacije' },
  home: { latest: 'Najnovije', noArticles: 'Još nema članaka.' },
  publications: {
    title: 'Publikacije',
    intro: 'Recenzirani radovi, konferencijska izlaganja i predavanja.',
    filterByType: 'Filtriraj po vrsti',
    all: 'Sve',
    jumpToYear: 'Idi na godinu',
    empty: 'Nema publikacija za odabrani filtar.',
    count: (n: number) => {
      const mod10 = n % 10
      const mod100 = n % 100
      const few = mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
      return `${n} ${few ? 'publikacije' : 'publikacija'}`
    },
    type: 'Vrsta',
    year: 'Godina',
    publishedIn: 'Objavljeno u',
    doi: 'DOI',
    link: 'Poveznica',
    pdf: 'PDF',
    abstract: 'Sažetak',
    cite: 'Citiraj',
    citeHint: 'BibTeX, za LaTeX i programe za upravljanje literaturom.',
    back: 'Sve publikacije',
  },
  types: {
    'journal-article': 'Znanstveni članak',
    'book-chapter': 'Poglavlje u knjizi',
    'conference-paper': 'Konferencijski rad',
    'proceedings-paper': 'Rad u zborniku',
    'bulletin-article': 'Članak u biltenu',
    'invited-talk': 'Pozvano izlaganje',
    'invited-lecture': 'Pozvano predavanje',
    preprint: 'Preprint',
    other: 'Ostalo',
  },
}

export const messages: Record<Locale, Messages> = { en, hr }

export type PublicationTypeKey = keyof Messages['types']
export const publicationTypeKeys = Object.keys(en.types) as PublicationTypeKey[]
