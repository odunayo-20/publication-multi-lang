import config from '@payload-config'
import { Bookmark, FileText, Library, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'

import { PageHeader, StatusBadge } from '@/components/account/parts'
import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { relationIds, requireUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }> }

export default async function AccountOverviewPage({ params }: Args) {
  const { locale } = await params
  const user = await requireUser(locale, `/${locale}/account`)
  const t = messages[locale].account
  const payload = await getPayload({ config })

  const { docs: recent, totalDocs } = await payload.find({
    collection: 'submissions',
    where: { submitter: { equals: user.id } },
    sort: '-createdAt',
    limit: 3,
    depth: 1,
    user,
    overrideAccess: false,
  })

  const stats = [
    { label: t.overview.stats.submissions, value: totalDocs, icon: FileText, href: `/${locale}/account/submissions` },
    {
      label: t.overview.stats.saved,
      value: relationIds(user.savedPublications).length,
      icon: Bookmark,
      href: `/${locale}/account/saved`,
    },
    {
      label: t.overview.stats.following,
      value: relationIds(user.followedAuthors).length,
      icon: Users,
      href: `/${locale}/account/following`,
    },
  ]

  return (
    <>
      <PageHeader title={t.welcome(user.name?.trim() || user.email)} />

      <ul className="ac-stats">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <li key={label}>
            <Link href={href} className="ac-stat">
              <Icon size={20} aria-hidden="true" />
              <span className="ac-stat-value">{value}</span>
              <span className="ac-stat-label">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="ac-two-col">
        <section className="ac-card" aria-labelledby="ac-recent">
          <div className="ac-card-head">
            <h2 id="ac-recent" className="ac-h2">
              {t.overview.recent}
            </h2>
            {totalDocs > 0 && (
              <Link href={`/${locale}/account/submissions`} className="ac-link">
                {t.overview.viewAll}
              </Link>
            )}
          </div>
          {recent.length === 0 ? (
            <p className="ac-muted">{t.submissions.empty}</p>
          ) : (
            <ul className="ac-rows">
              {recent.map((s) => (
                <li key={s.id} className="ac-row">
                  <div>
                    <p className="ac-row-title">{s.title}</p>
                    <p className="ac-row-meta">
                      {typeof s.journal === 'object' ? s.journal.name : ''} ·{' '}
                      {new Date(s.createdAt).toLocaleDateString(locale, { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <StatusBadge status={s.status} label={t.submissions.status[s.status]} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="ac-card" aria-labelledby="ac-quick">
          <h2 id="ac-quick" className="ac-h2">
            {t.overview.quickActions}
          </h2>
          <div className="ac-actions">
            <Link href={`/${locale}/account/submissions/new`} className="ac-btn">
              <Plus size={16} aria-hidden="true" />
              {t.overview.submitNew}
            </Link>
            <Link href={`/${locale}/journals`} className="ac-btn ac-btn-ghost">
              <Library size={16} aria-hidden="true" />
              {t.overview.browseJournals}
            </Link>
            <Link href={`/${locale}/authors`} className="ac-btn ac-btn-ghost">
              <Users size={16} aria-hidden="true" />
              {t.overview.browseAuthors}
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
