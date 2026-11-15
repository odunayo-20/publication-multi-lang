import config from '@payload-config'
import { getPayload } from 'payload'

import { PageHeader } from '@/components/account/parts'
import { SubmitForm } from '@/components/account/SubmitForm'
import { publicationTypes } from '@/collections/Publications'
import type { Locale } from '@/i18n/config'
import { messages, type PublicationTypeKey } from '@/i18n/messages'
import { requireUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }> }

export default async function NewSubmissionPage({ params }: Args) {
  const { locale } = await params
  await requireUser(locale, `/${locale}/account/submissions/new`)
  const t = messages[locale]
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'journals',
    pagination: false,
    depth: 0,
    sort: 'name',
    select: { name: true },
    overrideAccess: false,
  })

  return (
    <>
      <PageHeader title={t.account.submit.title} subtitle={t.account.submit.subtitle} />
      <div className="ac-card">
        <SubmitForm
          locale={locale}
          t={t.account.submit}
          journals={docs.map((j) => ({ id: j.id, name: j.name }))}
          typeOptions={publicationTypes.map((o) => ({
            value: o.value,
            label: t.types[o.value as PublicationTypeKey] ?? o.label,
          }))}
        />
      </div>
    </>
  )
}
