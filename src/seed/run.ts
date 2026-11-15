import { getPayload, type Payload } from 'payload'
import type { SiteSetting } from '@/payload-types'
import config from '../payload.config'
import { homeSummary, researchFocus, roleHr } from './home-content'
import { benchmarkPublications } from '../data/benchmark-publications'
import { authorSeeds } from './authors'
import { journalSeeds } from './journals'
import { seedPublications } from './publications'

const isSelf = (name: string) => /^tro[sš]elj\s+j\.?$/i.test(name.trim())

/**
 * Facts from his current site (role "to verify") and the draft home copy from ./home-content.ts.
 * Only empty fields are filled, so anything the owner has typed is never overwritten.
 */
const seedSiteSettings = async (payload: Payload) => {
  const slug = 'site-settings'
  const en = await payload.findGlobal({ slug, locale: 'en', depth: 0 })
  const data: Partial<SiteSetting> = {}
  if (!en.role) data.role = 'Research Associate'
  if (!en.institution) data.institution = 'Ruđer Bošković Institute'
  if (!en.department) {
    data.department =
      'Laboratory for Informatics and Environmental Modelling, Division for Marine and Environmental Research'
  }
  if (!en.profiles?.length) {
    data.profiles = [
      { platform: 'scholar', url: 'https://scholar.google.co.jp/citations?user=jHDldckAAAAJ&hl=en' },
    ]
  }
  if (!en.summary) data.summary = homeSummary.en
  if (!en.researchFocus?.length) data.researchFocus = researchFocus.en
  if (Object.keys(data).length) await payload.updateGlobal({ slug, locale: 'en', data })

  const hr = await payload.findGlobal({ slug, locale: 'hr', fallbackLocale: false, depth: 0 })
  const hrData: Partial<SiteSetting> = {}
  if (!hr.institution) hrData.institution = 'Institut Ruđer Bošković'
  // Payload copies the English value into a new locale on first write, so "same as English" means unset.
  if (!hr.role || hr.role === (data.role ?? en.role)) hrData.role = roleHr
  if (!hr.summary) hrData.summary = homeSummary.hr

  // Focus rows are shared between languages, only their text is translated: attach the Croatian
  // text to the same row ids, and only while the English rows are still the seeded ones.
  const rows = (await payload.findGlobal({ slug, locale: 'en', depth: 0 })).researchFocus ?? []
  const seededRows =
    rows.length === researchFocus.en.length && rows.every((row, i) => row.title === researchFocus.en[i].title)
  if (seededRows && !hr.researchFocus?.some((row) => row.title)) {
    hrData.researchFocus = rows.map((row, i) => ({ id: row.id, ...researchFocus.hr[i] }))
  }
  if (Object.keys(hrData).length) await payload.updateGlobal({ slug, locale: 'hr', data: hrData })

  const filled = [...Object.keys(data), ...Object.keys(hrData).map((key) => `${key} (hr)`)]
  payload.logger.info(`Site settings seed: ${filled.join(', ') || 'nothing to fill'}`)
}

const compact = (value: string): number => {
  const v = value.trim().toLowerCase()
  const n = Number.parseFloat(v)
  if (Number.isNaN(n)) return 0
  return Math.round(v.endsWith('k') ? n * 1000 : n)
}

/** Idempotent: a journal is skipped when its name already exists. */
const seedJournals = async (payload: Payload) => {
  let created = 0
  for (const j of journalSeeds) {
    const existing = await payload.count({ collection: 'journals', where: { name: { equals: j.name } } })
    if (existing.totalDocs) continue
    await payload.create({
      collection: 'journals',
      data: {
        name: j.name,
        slug: j.slug,
        initials: j.initials,
        category: j.categoryId as never,
        scope: j.scope,
        issn: j.issn,
        eIssn: j.eIssn,
        citeScore: j.citeScore,
        acceptanceRate: j.acceptanceRate,
        reviewTime: j.reviewTime,
        badgeColor: j.badgeColor as never,
        featured: Boolean(j.isFeatured),
        indexing: j.indexing.map((service) => ({ service })),
      },
    })
    created++
  }
  payload.logger.info(`Journals seed: ${created} created`)
}

/** Idempotent: an author is skipped when the slug already exists. */
const seedAuthors = async (payload: Payload) => {
  let created = 0
  for (const a of authorSeeds) {
    const existing = await payload.count({ collection: 'authors', where: { slug: { equals: a.slug } } })
    if (existing.totalDocs) continue
    const doc = await payload.create({
      collection: 'authors',
      locale: 'en',
      data: {
        name: a.name,
        slug: a.slug,
        aliases: a.aliases.filter((n) => n !== a.name).map((name) => ({ name })),
        title: a.title.en,
        institution: a.institution,
        location: a.location,
        bio: a.bio.en,
        interests: a.interests.map((interest) => ({ interest })),
        gradient: a.gradient as never,
        isVerified: a.isVerified,
        memberSince: a.memberSince,
        links: a.links,
      },
    })
    await payload.update({
      collection: 'authors',
      id: doc.id,
      locale: 'hr',
      data: { title: a.title.hr, bio: a.bio.hr },
    })
    created++
  }
  payload.logger.info(`Authors seed: ${created} created`)
}

/** The sample publications the public pages used to hard-code. Idempotent by DOI or title. */
const seedSamplePublications = async (payload: Payload) => {
  let created = 0
  for (const p of Object.values(benchmarkPublications)) {
    const existing = await payload.find({
      collection: 'publications',
      draft: true,
      limit: 1,
      depth: 0,
      where: { or: [{ doi: { equals: (p.doi ?? '').toLowerCase() } }, { title: { equals: p.title } }] },
    })
    if (existing.docs.length) continue
    await payload.create({
      collection: 'publications',
      data: {
        title: p.title,
        slug: p.slug ?? undefined,
        type: p.type,
        authors: p.authors.map((a) => ({ name: a.name, isSelf: false })),
        venue: p.venue,
        year: p.year,
        volume: p.volume,
        issue: p.issue,
        pages: p.pages,
        doi: p.doi,
        abstract: p.abstract,
        viewCount: compact(p.views),
        citationCount: compact(p.citationsCount),
        coverStyle: p.coverGradient as never,
        keywords: p.keywordsList.map((keyword) => ({ keyword })),
        _status: 'published',
      },
    })
    created++
  }
  payload.logger.info(`Sample publications seed: ${created} created`)
}

/**
 * Idempotent: an entry is skipped when its DOI or exact title already exists.
 * Run with the direct (unpooled) Neon URL, the pooled one stalls while Payload syncs the schema:
 *   DATABASE_URL=<unpooled url> npx tsx --env-file=.env.local src/seed/run.ts
 */
const run = async () => {
  const payload = await getPayload({ config })
  let created = 0
  let skipped = 0

  for (const { authors, doi, ...rest } of seedPublications) {
    const existing = await payload.find({
      collection: 'publications',
      draft: true,
      limit: 1,
      pagination: false,
      where: doi
        ? { or: [{ doi: { equals: doi.toLowerCase() } }, { title: { equals: rest.title } }] }
        : { title: { equals: rest.title } },
    })
    if (existing.docs.length) {
      skipped++
      continue
    }
    await payload.create({
      collection: 'publications',
      data: {
        ...rest,
        doi,
        authors: authors.map((name) => ({ name, isSelf: isSelf(name) })),
        _status: 'published',
      },
    })
    created++
  }

  payload.logger.info(`Publications seed: ${created} created, ${skipped} skipped`)

  await seedJournals(payload)
  await seedAuthors(payload)
  await seedSamplePublications(payload)
  await seedSiteSettings(payload)
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
