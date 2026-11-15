import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

import { EmptyState, PageHeader } from '@/components/account/parts'
import type { Locale } from '@/i18n/config'
import { messages, type PublicationTypeKey } from '@/i18n/messages'
import { relationIds, requireUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }> }

export default async function SavedPage({ params }: Args) {
  const { locale } = await params
  const user = await requireUser(locale, `/${locale}/account/saved`)
  const t = messages[locale]
  const ids = relationIds(user.savedPublications)
  const payload = await getPayload({ config })

  // Only published publications resolve; an unpublished one is silently skipped.
  const { docs } = ids.length
    ? await payload.find({
        collection: 'publications',
        locale,
        where: { id: { in: ids } },
        pagination: false,
        depth: 0,
        overrideAccess: false,
      })
    : { docs: [] }

  return (
    <>
      <PageHeader title={t.account.saved.title} subtitle={t.account.saved.subtitle} />
      {docs.length === 0 ? (
        <EmptyState message={t.account.saved.empty} href={`/${locale}/publications`} cta={t.account.saved.emptyCta} />
      ) : (
        <ul className="ac-list">
          {docs.map((p) => (
            <li key={p.id} className="ac-card">
              <p className="ac-row-meta">
                {t.types[p.type as PublicationTypeKey] ?? p.type} · {p.year}
              </p>
              <h2 className="ac-row-title">
                <Link href={`/${locale}/publications/${p.slug}`}>{p.title}</Link>
              </h2>
              <p className="ac-row-meta">
                {p.authors.map((a) => a.name).join(', ')}
                {p.venue ? ` · ${p.venue}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
