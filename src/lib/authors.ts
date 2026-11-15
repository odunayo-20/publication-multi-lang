import type { Payload } from 'payload'

import type { Locale } from '@/i18n/config'
import type { Author, Media, Publication } from '@/payload-types'

export type AuthorLinks = {
  orcid?: string
  scholar?: string
  researchgate?: string
  linkedin?: string
  website?: string
}

/** Presentation shape of an author, mapped from the Payload `authors` collection. */
export type AuthorRecord = {
  id: number
  slug: string
  name: string
  /** Names this author appears under in publication author lists. */
  aliases: string[]
  title: string
  institution: string
  location: string
  bio: string
  interests: string[]
  gradient: string
  avatarUrl: string | null
  isVerified: boolean
  memberSince: number | null
  links: AuthorLinks
}

const clean = (value: string | null | undefined) => value?.trim() ?? ''

const optionalUrl = (value: string | null | undefined): string | undefined => {
  const v = clean(value)
  // Only ever render http(s) links; anything else (javascript:, data:) is dropped.
  return /^https?:\/\//i.test(v) ? v : undefined
}

export const mapAuthor = (doc: Author): AuthorRecord => ({
  id: doc.id,
  slug: doc.slug ?? String(doc.id),
  name: doc.name,
  aliases: [doc.name, ...(doc.aliases?.map((a) => a.name) ?? [])],
  title: clean(doc.title),
  institution: clean(doc.institution),
  location: clean(doc.location),
  bio: clean(doc.bio),
  interests: doc.interests?.map((i) => i.interest) ?? [],
  gradient: doc.gradient ?? 'gradient-cs',
  avatarUrl: typeof doc.avatar === 'object' && doc.avatar ? ((doc.avatar as Media).url ?? null) : null,
  isVerified: Boolean(doc.isVerified),
  memberSince: doc.memberSince ?? null,
  links: {
    orcid: optionalUrl(doc.links?.orcid),
    scholar: optionalUrl(doc.links?.scholar),
    researchgate: optionalUrl(doc.links?.researchgate),
    linkedin: optionalUrl(doc.links?.linkedin),
    website: optionalUrl(doc.links?.website),
  },
})

export const normalizeName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

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

export type AuthorStats = {
  publications: number
  citations: number
  hIndex: number
  views: number
  venues: number
  coAuthors: number
}

export type AuthorProfile = {
  record: AuthorRecord
  works: AuthorWork[]
  stats: AuthorStats
  byYear: Array<{ year: number; count: number }>
  topVenues: Array<{ venue: string; count: number }>
  coAuthors: CoAuthor[]
}

/** Largest h such that h works have at least h citations each. */
export const computeHIndex = (citations: number[]): number => {
  const sorted = [...citations].sort((a, b) => b - a)
  let h = 0
  while (h < sorted.length && sorted[h]! >= h + 1) h += 1
  return h
}

export const initialsOf = (name: string): string =>
  name
    .replace(/\b(dr|prof)\.?\s/gi, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')

const countBy = <T>(items: T[], key: (item: T) => string) => {
  const map = new Map<string, number>()
  for (const item of items) map.set(key(item), (map.get(key(item)) ?? 0) + 1)
  return map
}

export const toWork = (p: Publication, aliases: string[], locale: string): AuthorWork => ({
  slug: p.slug ?? String(p.id),
  title: p.title,
  venue: p.venue ?? '',
  year: p.year,
  type: p.type,
  doi: p.doi ?? null,
  views: new Intl.NumberFormat(locale, { notation: 'compact' }).format(p.viewCount ?? 0),
  viewsValue: p.viewCount ?? 0,
  citations: p.citationCount ?? 0,
  gradient: p.coverStyle ?? 'gradient-cs',
  coAuthors: p.authors
    .map((a) => a.name)
    .filter((n) => !aliases.some((alias) => normalizeName(alias) === normalizeName(n))),
  keywords: p.keywords?.map((k) => k.keyword) ?? [],
})

/**
 * Pure: derives every number on the profile from the author's publications, so the header
 * metrics can never disagree with the list below them.
 */
export const buildAuthorProfile = (
  record: AuthorRecord,
  publications: Publication[],
  allAuthors: AuthorRecord[] = [],
  locale = 'en',
): AuthorProfile => {
  const aliasSet = new Set(record.aliases.map(normalizeName))
  const works = publications
    .filter((p) => p.authors.some((a) => aliasSet.has(normalizeName(a.name))))
    .map((p) => toWork(p, record.aliases, locale))
    .sort((a, b) => b.year - a.year || b.citations - a.citations)

  const slugByName = new Map<string, string>()
  for (const a of allAuthors) for (const alias of a.aliases) slugByName.set(normalizeName(alias), a.slug)

  const coAuthors: CoAuthor[] = [...countBy(works.flatMap((w) => w.coAuthors), (n) => n).entries()]
    .map(([name, shared]) => ({ name, shared, slug: slugByName.get(normalizeName(name)) ?? null }))
    .sort((a, b) => b.shared - a.shared || a.name.localeCompare(b.name))

  const byYear = [...countBy(works, (w) => String(w.year)).entries()]
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => a.year - b.year)

  const topVenues = [...countBy(works.filter((w) => w.venue), (w) => w.venue).entries()]
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

export const getAllAuthors = async (payload: Payload, locale: Locale): Promise<AuthorRecord[]> => {
  const { docs } = await payload.find({
    collection: 'authors',
    locale,
    pagination: false,
    depth: 1,
    sort: 'name',
    overrideAccess: false,
  })
  return docs.map(mapAuthor)
}

/** Published publications whose author list contains any of the given names. */
export const getPublicationsByNames = async (payload: Payload, names: string[], locale: Locale) => {
  if (names.length === 0) return []
  const { docs } = await payload.find({
    collection: 'publications',
    locale,
    where: { 'authors.name': { in: names } },
    pagination: false,
    depth: 0,
    sort: '-year',
    overrideAccess: false,
  })
  return docs
}

export const getAuthorProfile = async (
  payload: Payload,
  slug: string,
  locale: Locale,
): Promise<AuthorProfile | null> => {
  const { docs } = await payload.find({
    collection: 'authors',
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  const doc = docs[0]
  if (!doc) return null
  const record = mapAuthor(doc)
  const [publications, all] = await Promise.all([
    getPublicationsByNames(payload, record.aliases, locale),
    getAllAuthors(payload, locale),
  ])
  return buildAuthorProfile(record, publications, all, locale)
}

/** Directory rows: every author with the numbers shown on their card. */
export const getAuthorDirectory = async (payload: Payload, locale: Locale) => {
  const [authors, { docs: publications }] = await Promise.all([
    getAllAuthors(payload, locale),
    payload.find({ collection: 'publications', locale, pagination: false, depth: 0, overrideAccess: false }),
  ])
  return authors.map((record) => {
    const { stats } = buildAuthorProfile(record, publications, [], locale)
    return { record, stats }
  })
}
