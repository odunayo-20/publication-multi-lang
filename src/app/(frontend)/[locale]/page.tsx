import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/config'

// Rendered on demand until the DB is provisioned; switched to ISR in the content phase.
export const dynamic = 'force-dynamic'

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    limit: 10,
    sort: '-publishedAt',
    depth: 0,
    overrideAccess: false,
  })

  return (
    <>
      <h1 className="muted">{locale === 'hr' ? 'Najnovije' : 'Latest'}</h1>
      {docs.length === 0 ? (
        <p>{locale === 'hr' ? 'Još nema članaka.' : 'No articles yet.'}</p>
      ) : (
        <ul className="article-list">
          {docs.map((a) => (
            <li key={a.id}>
              <h2>
                <Link href={`/${locale}/articles/${a.slug}`}>{a.title}</Link>
              </h2>
              {a.excerpt && <p>{a.excerpt}</p>}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
