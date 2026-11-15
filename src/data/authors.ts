import type { Locale } from '@/i18n/config'

import { benchmarkPublications, type ExtendedBenchmarkPublication } from './benchmark-publications'

export type AuthorLinks = {
  orcid?: string
  scholar?: string
  researchgate?: string
  linkedin?: string
  website?: string
}

export type AuthorRecord = {
  slug: string
  name: string
  /** Names this author appears under in publication author lists. */
  aliases: string[]
  title: Record<Locale, string>
  institution: string
  location: string
  bio: Record<Locale, string>
  interests: string[]
  gradient: string
  isVerified: boolean
  memberSince: number
  links: AuthorLinks
}

export const authorRecords: AuthorRecord[] = [
  {
    slug: 'samuel-adeyemi',
    name: 'Dr. Samuel Adeyemi',
    aliases: ['Dr. Samuel Adeyemi'],
    title: { en: 'Senior Lecturer, Computer Science', hr: 'Viši predavač, računarstvo' },
    institution: 'University of Lagos',
    location: 'Lagos, Nigeria',
    bio: {
      en: 'Samuel studies how machine learning and edge sensing can make cities more efficient and more livable. His work connects spatial-temporal deep learning with municipal infrastructure, from traffic signal control to energy balancing, and is validated on real metropolitan testbeds.',
      hr: 'Samuel istražuje kako strojno učenje i rubno senzoriranje mogu gradove učiniti učinkovitijima i ugodnijima za život. Njegov rad povezuje prostorno-vremensko duboko učenje s gradskom infrastrukturom, od upravljanja semaforima do uravnoteženja energije, a provjeren je na stvarnim metropolitanskim testnim područjima.',
    },
    interests: ['Machine Learning', 'Smart Cities', 'Edge Computing', 'Urban Analytics'],
    gradient: 'gradient-cs',
    isVerified: true,
    memberSince: 2021,
    links: {
      orcid: 'https://orcid.org/0000-0002-1825-0097',
      scholar: 'https://scholar.google.com/',
      linkedin: 'https://www.linkedin.com/',
    },
  },
  {
    slug: 'josko-troselj',
    name: 'Dr. Joško Trošelj',
    aliases: ['Dr. Joško Trošelj'],
    title: { en: 'Research Scientist, Hydrology', hr: 'Znanstveni istraživač, hidrologija' },
    institution: 'Ruđer Bošković Institute',
    location: 'Zagreb, Croatia',
    bio: {
      en: 'Joško works on flood forecasting, coastal hazards and the impact of climate change on water resources, combining numerical modelling with operational early-warning systems.',
      hr: 'Joško se bavi prognoziranjem poplava, obalnim opasnostima i utjecajem klimatskih promjena na vodne resurse, spajajući numeričko modeliranje s operativnim sustavima ranog upozoravanja.',
    },
    interests: ['Hydrology', 'Flood Forecasting', 'Climate Impacts', 'Early Warning'],
    gradient: 'gradient-hydro',
    isVerified: true,
    memberSince: 2020,
    links: { scholar: 'https://scholar.google.com/' },
  },
  {
    slug: 'funke-adebayo',
    name: 'Dr. Funke Adebayo',
    aliases: ['Dr. Funke Adebayo'],
    title: { en: 'Associate Professor, Energy Systems', hr: 'Izvanredna profesorica, energetski sustavi' },
    institution: 'Obafemi Awolowo University',
    location: 'Ile-Ife, Nigeria',
    bio: {
      en: 'Funke designs decentralised renewable energy systems for rural electrification, with a focus on techno-economic modelling and community-managed governance.',
      hr: 'Funke projektira decentralizirane sustave obnovljive energije za elektrifikaciju ruralnih područja, s naglaskom na tehno-ekonomsko modeliranje i upravljanje u zajednici.',
    },
    interests: ['Renewable Energy', 'Microgrids', 'Rural Electrification'],
    gradient: 'gradient-energy',
    isVerified: true,
    memberSince: 2022,
    links: {},
  },
  {
    slug: 'blessing-okonfor',
    name: 'Prof. Blessing Okonfor',
    aliases: ['Prof. Blessing Okonfor', 'Prof. Blessing Okafor'],
    title: { en: 'Professor, Education & Policy', hr: 'Profesorica, obrazovanje i politike' },
    institution: 'University of Ibadan',
    location: 'Ibadan, Nigeria',
    bio: {
      en: 'Blessing researches how digital tools change learning outcomes and how energy and infrastructure policy shape access to education.',
      hr: 'Blessing istražuje kako digitalni alati mijenjaju ishode učenja i kako politike energije i infrastrukture oblikuju pristup obrazovanju.',
    },
    interests: ['Digital Learning', 'Education Policy', 'Energy Access'],
    gradient: 'gradient-edu',
    isVerified: false,
    memberSince: 2023,
    links: {},
  },
]

export const getAuthorRecord = (slug: string): AuthorRecord | null =>
  authorRecords.find((a) => a.slug === slug) ?? null

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

/** Slug of a known author for a given name on a publication, if any. */
export const findAuthorSlugByName = (name: string): string | null => {
  const n = normalize(name)
  return authorRecords.find((a) => a.aliases.some((alias) => normalize(alias) === n))?.slug ?? null
}

export type AuthorWork = {
  slug: string
  title: string
  venue: string
  year: number
  type: string
  doi: string | null
  views: string
  viewsValue: number
  citations: number
  gradient: string
  coAuthors: string[]
  keywords: string[]
}

export type CoAuthor = { name: string; slug: string | null; shared: number }

export type AuthorProfile = {
  record: AuthorRecord
  works: AuthorWork[]
  stats: {
    publications: number
    citations: number
    hIndex: number
    views: number
    venues: number
    coAuthors: number
  }
  byYear: Array<{ year: number; count: number }>
  topVenues: Array<{ venue: string; count: number }>
  coAuthors: CoAuthor[]
}

/** "1.2k" -> 1200, "842" -> 842. */
export const parseCompactNumber = (value: string): number => {
  const v = value.trim().toLowerCase()
  const n = Number.parseFloat(v)
  if (Number.isNaN(n)) return 0
  return Math.round(v.endsWith('k') ? n * 1000 : n)
}

/** Largest h such that h works have at least h citations each. */
export const computeHIndex = (citations: number[]): number => {
  const sorted = [...citations].sort((a, b) => b - a)
  let h = 0
  while (h < sorted.length && sorted[h]! >= h + 1) h += 1
  return h
}

const countBy = <T>(items: T[], key: (item: T) => string) => {
  const map = new Map<string, number>()
  for (const item of items) map.set(key(item), (map.get(key(item)) ?? 0) + 1)
  return map
}

const toWork = (p: ExtendedBenchmarkPublication, authorAliases: string[]): AuthorWork => ({
  slug: p.slug ?? '',
  title: p.title,
  venue: p.venue ?? '',
  year: p.year ?? 0,
  type: p.type,
  doi: p.doi ?? null,
  views: p.views,
  viewsValue: parseCompactNumber(p.views),
  citations: parseCompactNumber(p.citationsCount),
  gradient: p.coverGradient,
  coAuthors: p.authors
    .map((a) => a.name)
    .filter((n) => !authorAliases.some((alias) => normalize(alias) === normalize(n))),
  keywords: p.keywordsList,
})

export const buildAuthorProfile = (
  record: AuthorRecord,
  publications: ExtendedBenchmarkPublication[] = Object.values(benchmarkPublications),
): AuthorProfile => {
  const aliases = new Set(record.aliases.map(normalize))
  const works = publications
    .filter((p) => p.authors.some((a) => aliases.has(normalize(a.name))))
    .map((p) => toWork(p, record.aliases))
    .sort((a, b) => b.year - a.year || b.citations - a.citations)

  const coAuthorCounts = countBy(works.flatMap((w) => w.coAuthors), (n) => n)
  const coAuthors: CoAuthor[] = [...coAuthorCounts.entries()]
    .map(([name, shared]) => ({ name, shared, slug: findAuthorSlugByName(name) }))
    .sort((a, b) => b.shared - a.shared || a.name.localeCompare(b.name))

  const yearCounts = countBy(works, (w) => String(w.year))
  const byYear = [...yearCounts.entries()]
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => a.year - b.year)

  const topVenues = [...countBy(works, (w) => w.venue).entries()]
    .map(([venue, count]) => ({ venue, count }))
    .sort((a, b) => b.count - a.count || a.venue.localeCompare(b.venue))

  return {
    record,
    works,
    stats: {
      publications: works.length,
      citations: works.reduce((sum, w) => sum + w.citations, 0),
      hIndex: computeHIndex(works.map((w) => w.citations)),
      views: works.reduce((sum, w) => sum + w.viewsValue, 0),
      venues: topVenues.length,
      coAuthors: coAuthors.length,
    },
    byYear,
    topVenues,
    coAuthors,
  }
}

export const getAuthorProfile = (slug: string): AuthorProfile | null => {
  const record = getAuthorRecord(slug)
  return record ? buildAuthorProfile(record) : null
}

export const initialsOf = (name: string): string =>
  name
    .replace(/\b(dr|prof)\.?\s/gi, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
