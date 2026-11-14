import { getPayload } from 'payload'
import config from '../payload.config'
import { seedPublications } from './publications'

const isSelf = (name: string) => /^tro[sš]elj\s+j\.?$/i.test(name.trim())

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
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
