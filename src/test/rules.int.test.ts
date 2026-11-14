import { getPayload, type CollectionSlug, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '@/payload.config'

/**
 * Integration checks against a real database (see vitest.int.config.ts). Every record is created
 * with a "[TEST]" title or path and deleted afterwards. Run on a test branch, not on live content.
 */
let payload: Payload
const created: { collection: CollectionSlug; id: number | string }[] = []
const run = Date.now()

const track = <T extends { id: number | string }>(collection: CollectionSlug, doc: T): T => {
  created.push({ collection, id: doc.id })
  return doc
}

const publication = (overrides: Record<string, unknown> = {}) => ({
  title: `[TEST] ${run} paper`,
  type: 'journal-article' as const,
  year: 2024,
  authors: [{ name: 'Tester A.' }],
  _status: 'published' as const,
  ...overrides,
})

const createPublication = async (overrides: Record<string, unknown> = {}) =>
  track(
    'publications',
    await payload.create({ collection: 'publications', data: publication(overrides) as never }),
  )

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
)
// Smallest well-formed PDF: catalog, page tree, one blank page, xref table and trailer.
const pdf = Buffer.from(
  [
    '%PDF-1.4',
    '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj',
    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj',
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj',
    'xref',
    '0 4',
    '0000000000 65535 f ',
    '0000000009 00000 n ',
    '0000000052 00000 n ',
    '0000000101 00000 n ',
    'trailer<</Size 4/Root 1 0 R>>',
    'startxref',
    '178',
    '%%EOF',
    '',
  ].join('\n'),
)

beforeAll(async () => {
  payload = await getPayload({ config })
})

afterAll(async () => {
  for (const { collection, id } of created.reverse()) {
    await payload.delete({ collection, id }).catch(() => undefined)
  }
})

describe('publications', () => {
  it('cleans a pasted doi.org link and lowercases it', async () => {
    const doc = await createPublication({
      title: `[TEST] ${run} doi clean`,
      doi: `https://doi.org/10.9999/TEST.${run}`,
    })
    expect(doc.doi).toBe(`10.9999/test.${run}`)
  })

  it('rejects a malformed DOI', async () => {
    await expect(createPublication({ title: `[TEST] ${run} bad doi`, doi: 'not-a-doi' })).rejects.toThrow()
  })

  it('rejects a duplicate DOI', async () => {
    await createPublication({ title: `[TEST] ${run} dup a`, doi: `10.9999/dup.${run}` })
    await expect(
      createPublication({ title: `[TEST] ${run} dup b`, doi: `10.9999/dup.${run}` }),
    ).rejects.toThrow()
  })

  it('allows many publications without a DOI', async () => {
    await createPublication({ title: `[TEST] ${run} nodoi 1` })
    await expect(createPublication({ title: `[TEST] ${run} nodoi 2` })).resolves.toBeDefined()
  })

  it('adds the year to a slug that is already taken, and keeps it on update', async () => {
    const first = await createPublication({ title: `[TEST] ${run} same title` })
    const second = await createPublication({ title: `[TEST] ${run} same title` })
    expect(second.slug).toBe(`${first.slug}-2024`)

    const updated = await payload.update({
      collection: 'publications',
      id: second.id,
      data: { venue: 'Changed' },
    })
    expect(updated.slug).toBe(second.slug)
  })

  it('requires at least one author', async () => {
    await expect(createPublication({ title: `[TEST] ${run} no authors`, authors: [] })).rejects.toThrow()
  })

  it('hides drafts from the public and shows published entries', async () => {
    await createPublication({ title: `[TEST] ${run} vis draft`, _status: 'draft' })
    await createPublication({ title: `[TEST] ${run} vis live` })
    const visible = await payload.find({
      collection: 'publications',
      overrideAccess: false,
      where: { title: { like: `[TEST] ${run} vis` } },
    })
    expect(visible.docs.map((d) => d.title)).toEqual([`[TEST] ${run} vis live`])
  })

  it('does not let anonymous visitors write', async () => {
    await expect(
      payload.create({
        collection: 'publications',
        overrideAccess: false,
        data: publication({ title: `[TEST] ${run} anon` }) as never,
      }),
    ).rejects.toThrow()
  })
})

describe('redirects', () => {
  it('accepts a path to a path, and a path to an https URL', async () => {
    track(
      'redirects',
      await payload.create({
        collection: 'redirects',
        data: { from: `/test-${run}-a`, to: '/en/publications' },
      }),
    )
    track(
      'redirects',
      await payload.create({
        collection: 'redirects',
        data: { from: `/test-${run}-b`, to: 'https://example.org/x' },
      }),
    )
  })

  it.each([
    ['protocol-relative source', '//evil.example', '/ok'],
    ['source without a slash', 'no-slash', '/ok'],
    ['protocol-relative target', '/test-x', '//evil.example'],
    ['plain http target', '/test-y', 'http://example.org'],
    ['javascript target', '/test-z', 'javascript:alert(1)'],
  ])('rejects a %s', async (_label, from, to) => {
    await expect(payload.create({ collection: 'redirects', data: { from, to } })).rejects.toThrow()
  })

  it('is not readable by the public', async () => {
    await expect(payload.find({ collection: 'redirects', overrideAccess: false })).rejects.toThrow()
  })
})

describe('site settings', () => {
  it('is readable by the public but not writable', async () => {
    await expect(payload.findGlobal({ slug: 'site-settings', overrideAccess: false })).resolves.toBeDefined()
    await expect(
      payload.updateGlobal({ slug: 'site-settings', overrideAccess: false, data: { role: 'x' } }),
    ).rejects.toThrow()
  })
})

describe('media', () => {
  const upload = (name: string, mimetype: string, data: Buffer, alt?: string) =>
    payload.create({
      collection: 'media',
      data: alt ? { alt } : {},
      file: { name, mimetype, data, size: data.length },
    })

  it('requires alt text for images', async () => {
    await expect(upload(`test-${run}.png`, 'image/png', png)).rejects.toThrow()
  })

  it('accepts an image with alt text', async () => {
    track('media', await upload(`test-${run}-alt.png`, 'image/png', png, 'A single pixel'))
  })

  it('accepts a PDF without alt text', async () => {
    track('media', await upload(`test-${run}.pdf`, 'application/pdf', pdf))
  })

  it('rejects SVG uploads', async () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')
    await expect(upload(`test-${run}.svg`, 'image/svg+xml', svg, 'x')).rejects.toThrow()
  })
})
