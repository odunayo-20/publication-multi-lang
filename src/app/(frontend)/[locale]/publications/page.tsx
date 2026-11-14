import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'

import { Hydrograph } from '@/components/Hydrograph'
import { PublicationItem, typeLabel } from '@/components/Publication'
import { locales, type Locale } from '@/i18n/config'
import { messages, publicationTypeKeys } from '@/i18n/messages'
import type { Publication } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ type?: string }>
}

export async function generateMetadata({ params }: Pick<Args, 'params'>): Promise<Metadata> {
  const { locale } = await params
  return {
    title: messages[locale].publications.title,
    alternates: {
      canonical: `/${locale}/publications`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/publications`])),
    },
  }
}

const groupByYear = (docs: Publication[]) => {
  const groups = new Map<number, Publication[]>()
  for (const doc of docs) groups.set(doc.year, [...(groups.get(doc.year) ?? []), doc])
  return [...groups]
}

export default async function PublicationsPage({ params, searchParams }: Args) {
  const { locale } = await params
  const { type } = await searchParams
  const t = messages[locale].publications

  const payload = await getPayload({ config })
  const { docs: all } = await payload.find({
    collection: 'publications',
    locale,
    pagination: false,
    sort: ['-year', 'title'],
    depth: 1,
    overrideAccess: false,
  })

  const counts = new Map<string, number>()
  for (const doc of all) counts.set(doc.type, (counts.get(doc.type) ?? 0) + 1)

  // Ignore unknown values rather than showing an empty page for a mistyped link.
  const activeType = publicationTypeKeys.find((key) => key === type)
  const shown = activeType ? all.filter((doc) => doc.type === activeType) : all
  const groups = groupByYear(shown)
  const presentTypes = publicationTypeKeys.filter((key) => counts.has(key))

  return (
    <>
      <h1 className="page-title">{t.title}</h1>
      <p className="muted">
        {t.intro} {t.count(shown.length)}
      </p>
      <Hydrograph />

      {presentTypes.length > 1 && (
        <nav aria-label={t.filterByType}>
          <ul className="filters">
            <li>
              <Link href={`/${locale}/publications`} aria-current={!activeType ? 'true' : undefined}>
                {t.all} ({all.length})
              </Link>
            </li>
            {presentTypes.map((key) => (
              <li key={key}>
                <Link
                  href={`/${locale}/publications?type=${key}`}
                  aria-current={activeType === key ? 'true' : undefined}
                >
                  {typeLabel(locale, key)} ({counts.get(key)})
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {groups.length > 1 && (
        <nav aria-label={t.jumpToYear} className="year-jump">
          {groups.map(([year]) => (
            <a key={year} href={`#y${year}`}>
              {year}
            </a>
          ))}
        </nav>
      )}

      {groups.length === 0 ? (
        <p>{t.empty}</p>
      ) : (
        groups.map(([year, items]) => (
          <section key={year} aria-labelledby={`y${year}`}>
            <h2 className="pub-year" id={`y${year}`}>
              {year}
            </h2>
            <ul className="pub-list">
              {items.map((pub) => (
                <PublicationItem key={pub.id} pub={pub} locale={locale} />
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  )
}
