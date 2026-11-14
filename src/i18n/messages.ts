import type { Locale } from './config'

const en = {
  skipToContent: 'Skip to content',
  language: 'Language',
  nav: {
    home: 'Home',
    journals: 'Journals',
    articles: 'Articles',
    authors: 'Authors',
    about: 'About',
    publications: 'Publications',
    signIn: 'Sign In',
    submitPaper: 'Submit Paper',
  },
  portal: {
    badge: 'International Scholarly Publishing Platform',
    titlePrefix: 'Academic Knowledge',
    titleHighlight: 'for a Brighter Future',
    subtitle:
      'Discover, read, and publish high-impact, peer-reviewed research and academic works from trusted scholars worldwide.',
    searchPlaceholder: 'Search for articles, journals, authors, or keywords...',
    searchButton: 'Search',
    trending: 'Trending topics:',
    stats: {
      articles: 'Total Articles',
      journals: 'Journals',
      authors: 'Registered Authors',
      institutions: 'Institutions',
    },
    featured: {
      title: 'Featured Publications',
      subtitle: 'Explore recent peer-reviewed articles and breakthrough research',
      viewAll: 'View all →',
      readAbstract: 'Abstract',
      downloadPdf: 'Download PDF',
      cite: 'Cite',
    },
    journals: {
      title: 'Featured Journals',
      subtitle: 'Explore our collection of academic journals across various disciplines',
      viewAll: 'View all →',
      articlesCount: 'articles',
      viewJournal: 'View Journal',
    },
    trust: {
      openAccess: {
        title: 'Open Access',
        desc: 'Free, unrestricted access to quality research and scholarly works worldwide.',
      },
      trustedSources: {
        title: 'Trusted Sources',
        desc: 'Rigorous peer-reviewed publications from reputable institutions and verified experts.',
      },
      globalReach: {
        title: 'Global Reach',
        desc: 'Connecting researchers across the world with permanent Crossref DOIs.',
      },
    },
    cta: {
      title: 'Publish Your Research With AcadPress',
      subtitle:
        'Join thousands of scholars worldwide. Rapid double-blind peer review with global dissemination.',
      submit: 'Submit Manuscript',
      guidelines: 'Author Guidelines',
    },
  },
  home: {
    focus: 'What I work on',
    selected: 'Selected publications',
    recent: 'Recent publications',
    allPublications: 'All publications',
    latestWriting: 'Latest writing',
  },
  profiles: {
    scholar: 'Google Scholar',
    orcid: 'ORCID',
    researchgate: 'ResearchGate',
    institute: 'Institute page',
    linkedin: 'LinkedIn',
    other: 'Website',
  },
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
  nav: {
    home: 'Naslovnica',
    journals: 'Časopisi',
    articles: 'Članci',
    authors: 'Autori',
    about: 'O nama',
    publications: 'Publikacije',
    signIn: 'Prijava',
    submitPaper: 'Predaj rad',
  },
  portal: {
    badge: 'Međunarodna platforma za znanstveno izdavaštvo',
    titlePrefix: 'Znanstveno znanje',
    titleHighlight: 'za svjetliju budućnost',
    subtitle:
      'Istražite, čitajte i objavljujte recenzirane znanstvene radove i članke priznatih znanstvenika iz cijeloga svijeta.',
    searchPlaceholder: 'Pretražite članke, časopise, autore ili ključne riječi...',
    searchButton: 'Traži',
    trending: 'Popularne teme:',
    stats: {
      articles: 'Ukupno članaka',
      journals: 'Časopisa',
      authors: 'Registriranih autora',
      institutions: 'Institucija',
    },
    featured: {
      title: 'Odabrane publikacije',
      subtitle: 'Istražite recentne recenzirane radove i znanstvena otkrića',
      viewAll: 'Prikaži sve →',
      readAbstract: 'Sažetak',
      downloadPdf: 'Preuzmi PDF',
      cite: 'Citiraj',
    },
    journals: {
      title: 'Istaknuti časopisi',
      subtitle: 'Pregledajte našu zbirku znanstvenih časopisa iz različitih disciplina',
      viewAll: 'Prikaži sve →',
      articlesCount: 'članaka',
      viewJournal: 'Otvori časopis',
    },
    trust: {
      openAccess: {
        title: 'Otvoreni pristup',
        desc: 'Slobodan i neograničen pristup kvalitetnim znanstvenim radovima diljem svijeta.',
      },
      trustedSources: {
        title: 'Provjereni izvori',
        desc: 'Recenzirane publikacije renomiranih institucija i stručnjaka.',
      },
      globalReach: {
        title: 'Globalni doseg',
        desc: 'Povezivanje znanstvenika širom svijeta uz trajne Crossref DOI identifikatore.',
      },
    },
    cta: {
      title: 'Objavite svoj rad u AcadPressu',
      subtitle:
        'Pridružite se tisućama znanstvenika. Brza dvostruko slijepa recenzija uz globalnu vidljivost.',
      submit: 'Predaj rukopis',
      guidelines: 'Upute za autore',
    },
  },
  home: {
    focus: 'Čime se bavim',
    selected: 'Odabrane publikacije',
    recent: 'Nedavne publikacije',
    allPublications: 'Sve publikacije',
    latestWriting: 'Najnoviji tekstovi',
  },
  profiles: {
    scholar: 'Google Scholar',
    orcid: 'ORCID',
    researchgate: 'ResearchGate',
    institute: 'Stranica instituta',
    linkedin: 'LinkedIn',
    other: 'Web-stranica',
  },
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
