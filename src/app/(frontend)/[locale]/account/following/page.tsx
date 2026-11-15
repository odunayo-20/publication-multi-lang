import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

import { EmptyState, PageHeader } from '@/components/account/parts'
import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { relationIds, requireUser } from '@/lib/auth'
import { initialsOf, mapAuthor } from '@/lib/authors'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }> }

export default async function FollowingPage({ params }: Args) {
  const { locale } = await params
  const user = await requireUser(locale, `/${locale}/account/following`)
  const t = messages[locale].account.following
  const ids = relationIds(user.followedAuthors)
  const payload = await getPayload({ config })

  const { docs } = ids.length
    ? await payload.find({
        collection: 'authors',
        locale,
        where: { id: { in: ids } },
        pagination: false,
        depth: 1,
        sort: 'name',
        overrideAccess: false,
      })
    : { docs: [] }
  const authors = docs.map(mapAuthor)

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      {authors.length === 0 ? (
        <EmptyState message={t.empty} href={`/${locale}/authors`} cta={t.emptyCta} />
      ) : (
        <ul className="ac-grid">
          {authors.map((a) => (
            <li key={a.id}>
              <Link href={`/${locale}/authors/${a.slug}`} className="ac-card ac-author">
                <span className={`ac-author-avatar ${a.gradient}`} aria-hidden="true">
                  {initialsOf(a.name)}
                </span>
                <span>
                  <strong>{a.name}</strong>
                  <span className="ac-row-meta">{[a.title, a.institution].filter(Boolean).join(' · ')}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
