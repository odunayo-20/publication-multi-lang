import type { Payload } from 'payload'

import { journalCategoryOptions } from '@/collections/Journals'
import type { Locale } from '@/i18n/config'
import type { Journal } from '@/payload-types'

/** Presentation shape of a journal, mapped from the Payload `journals` collection. */
export type AcademicJournal = {
  id: string
  initials: string
  name: string
  slug: string
  categoryId: string
  categoryName: string
  scope: string
  issn: string
  eIssn: string
  citeScore: number
  acceptanceRate: string
  reviewTime: string
  articlesCount: number
  badgeColor: string
  isFeatured: boolean
  indexing: string[]
}

export type JournalCategory = { id: string; name: string; count: number }

const categoryName = (id: string) => journalCategoryOptions.find((c) => c.value === id)?.label ?? 'Other'

export const mapJournal = (doc: Journal, articlesCount: number): AcademicJournal => ({
  id: String(doc.id),
  initials: doc.initials,
  name: doc.name,
  slug: doc.slug ?? String(doc.id),
  categoryId: doc.category,
  categoryName: categoryName(doc.category),
  scope: doc.scope,
  issn: doc.issn ?? '',
  eIssn: doc.eIssn ?? '',
  citeScore: doc.citeScore ?? 0,
  acceptanceRate: doc.acceptanceRate ?? '',
  reviewTime: doc.reviewTime ?? '',
  articlesCount,
  badgeColor: doc.badgeColor ?? 'badge-blue',
  isFeatured: Boolean(doc.featured),
  indexing: doc.indexing?.map((i) => i.service) ?? [],
})

/** Journals with the real number of published publications that name them as their venue. */
export const getJournals = async (payload: Payload, locale: Locale): Promise<AcademicJournal[]> => {
  const [{ docs: journals }, { docs: pubs }] = await Promise.all([
    payload.find({ collection: 'journals', locale, pagination: false, depth: 0, sort: 'name', overrideAccess: false }),
    payload.find({
      collection: 'publications',
      pagination: false,
      depth: 0,
      select: { venue: true },
      overrideAccess: false,
    }),
  ])
  const counts = new Map<string, number>()
  for (const p of pubs) if (p.venue) counts.set(p.venue, (counts.get(p.venue) ?? 0) + 1)
  return journals.map((j) => mapJournal(j, counts.get(j.name) ?? 0))
}

export const getJournalBySlug = async (
  payload: Payload,
  slug: string,
  locale: Locale,
): Promise<AcademicJournal | null> => {
  const { docs } = await payload.find({
    collection: 'journals',
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
  })
  const doc = docs[0]
  if (!doc) return null
  const { totalDocs } = await payload.count({
    collection: 'publications',
    where: { venue: { equals: doc.name } },
    overrideAccess: false,
  })
  return mapJournal(doc, totalDocs)
}

/** Sidebar categories with live counts; categories with no journals are hidden. */
export const buildCategories = (journals: AcademicJournal[], allLabel: string): JournalCategory[] => {
  const counts = new Map<string, number>()
  for (const j of journals) counts.set(j.categoryId, (counts.get(j.categoryId) ?? 0) + 1)
  return [
    { id: 'all', name: allLabel, count: journals.length },
    ...journalCategoryOptions
      .filter((c) => counts.has(c.value))
      .map((c) => ({ id: c.value, name: c.label, count: counts.get(c.value) ?? 0 })),
  ]
}
