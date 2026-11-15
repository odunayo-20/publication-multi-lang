import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

import { PageHeader } from '@/components/account/parts'
import { ProfileForm } from '@/components/account/ProfileForm'
import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { requireUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }> }

export default async function ProfilePage({ params }: Args) {
  const { locale } = await params
  const user = await requireUser(locale, `/${locale}/account/profile`)
  const t = messages[locale]
  const p = t.account.profile
  const payload = await getPayload({ config })

  const isStaff = Boolean(user.roles?.includes('admin') || user.roles?.includes('editor'))
  const roleLabel = user.roles?.includes('admin')
    ? p.roleAdmin
    : user.roles?.includes('editor')
      ? p.roleEditor
      : p.roleAuthor

  const profileId = typeof user.authorProfile === 'object' ? user.authorProfile?.id : user.authorProfile
  const linked = profileId
    ? await payload
        .findByID({ collection: 'authors', id: profileId, locale, depth: 0, overrideAccess: false })
        .catch(() => null)
    : null

  return (
    <>
      <PageHeader title={p.title} subtitle={p.subtitle} />
      <div className="ac-two-col">
        <section className="ac-card">
          <ProfileForm
            locale={locale}
            name={user.name ?? ''}
            email={user.email}
            t={p}
            genericError={t.auth.errors.generic}
          />
        </section>
        <section className="ac-card">
          <dl className="ac-meta ac-meta-stack">
            <div>
              <dt>{p.accountType}</dt>
              <dd>{roleLabel}</dd>
            </div>
            <div>
              <dt>{p.linkedProfile}</dt>
              <dd>
                {linked ? (
                  <Link href={`/${locale}/authors/${linked.slug}`} className="ac-link">
                    {linked.name}
                  </Link>
                ) : (
                  <span className="ac-muted">{p.notLinked}</span>
                )}
              </dd>
            </div>
          </dl>
          {isStaff && (
            <Link href="/admin" className="ac-btn ac-btn-ghost">
              {p.openAdmin}
            </Link>
          )}
        </section>
      </div>
    </>
  )
}
