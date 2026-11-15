import config from '@payload-config'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'

import { siteUi } from '@/content/site-ui'
import { locales, type Locale } from '@/i18n/config'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = siteUi[locale].articles
  return {
    title: t.metaTitle,
    description: t.lead,
    alternates: {
      canonical: `/${locale}/articles`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/articles`])),
    },
  }
}

const formatDate = (iso: string | null | undefined, locale: Locale) =>
  iso ? new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(iso)) : null

export default async function ArticlesPage({ params }: Args) {
  const { locale } = await params
  const t = siteUi[locale].articles

  const docs = await getPayload({ config })
    .then((payload) =>
      payload.find({
        collection: 'articles',
        locale,
        depth: 0,
        limit: 50,
        sort: '-publishedAt',
        overrideAccess: false,
      }),
    )
    .then((r) => r.docs)
    .catch(() => [])

  return (
    <div className="sp-page">
      <header className="sp-hero">
        <div className="acad-container">
          <p className="sp-eyebrow">{t.eyebrow}</p>
          <h1 className="sp-title">{t.title}</h1>
          <p className="sp-lead">{t.lead}</p>
        </div>
      </header>

      <div className="acad-container sp-stack">
        {docs.length === 0 ? (
          <p className="sp-note">{t.empty}</p>
        ) : (
          <ul className="ar-list">
            {docs.map((a) => {
              const date = formatDate(a.publishedAt, locale)
              return (
                <li key={a.id} className="sp-card ar-item">
                  {date && <time dateTime={a.publishedAt ?? undefined}>{date}</time>}
                  <h2>
                    <Link href={`/${locale}/articles/${a.slug}`}>{a.title}</Link>
                  </h2>
                  {a.excerpt && <p>{a.excerpt}</p>}
                  <Link href={`/${locale}/articles/${a.slug}`} className="ar-more">
                    {t.readMore} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
