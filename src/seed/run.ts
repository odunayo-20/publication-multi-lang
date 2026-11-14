import { getPayload, type Payload } from 'payload'
import type { SiteSetting } from '@/payload-types'
import config from '../payload.config'
import { homeSummary, researchFocus, roleHr } from './home-content'
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

  await seedSiteSettings(payload)
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
