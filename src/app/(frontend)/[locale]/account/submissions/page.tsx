import config from '@payload-config'
import { CheckCircle2, Plus } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'

import { EmptyState, PageHeader, StatusBadge } from '@/components/account/parts'
import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { requireUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ submitted?: string }> }

export default async function SubmissionsPage({ params, searchParams }: Args) {
  const { locale } = await params
  const { submitted } = await searchParams
  const user = await requireUser(locale, `/${locale}/account/submissions`)
  const t = messages[locale].account.submissions
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'submissions',
    where: { submitter: { equals: user.id } },
    sort: '-createdAt',
    pagination: false,
    depth: 1,
    user,
    overrideAccess: false,
  })

  return (
    <>
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        action={
          <Link href={`/${locale}/account/submissions/new`} className="ac-btn">
            <Plus size={16} aria-hidden="true" />
            {t.new}
          </Link>
        }
      />

      {submitted === '1' && (
        <div className="ac-flash" role="status">
          <CheckCircle2 size={18} aria-hidden="true" />
          {t.flash}
        </div>
      )}

      {docs.length === 0 ? (
        <EmptyState message={t.empty} href={`/${locale}/account/submissions/new`} cta={t.emptyCta} />
      ) : (
        <ul className="ac-list">
          {docs.map((s) => (
            <li key={s.id} className="ac-card ac-submission">
              <div className="ac-submission-head">
                <h2 className="ac-row-title">{s.title}</h2>
                <StatusBadge status={s.status} label={t.status[s.status]} />
              </div>
              <dl className="ac-meta">
                <div>
                  <dt>{t.journal}</dt>
                  <dd>{typeof s.journal === 'object' ? s.journal.name : '—'}</dd>
                </div>
                <div>
                  <dt>{t.submitted}</dt>
                  <dd>{new Date(s.createdAt).toLocaleDateString(locale, { dateStyle: 'medium' })}</dd>
                </div>
              </dl>
              {s.editorNotes && (
                <div className="ac-note">
                  <strong>{t.editorNotes}</strong>
                  <p>{s.editorNotes}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
