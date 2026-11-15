import config from '@payload-config'
import { ArrowRight, BookOpenCheck, Library, Scale, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'

import { policies } from '@/content/policies'
import { siteUi } from '@/content/site-ui'
import { locales, type Locale } from '@/i18n/config'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = siteUi[locale].about
  return {
    title: t.metaTitle,
    description: t.lead,
    alternates: {
      canonical: `/${locale}/about`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/about`])),
    },
  }
}

const principleIcons = [BookOpenCheck, Scale, ShieldCheck, Library]

/** Live totals; a database hiccup hides the strip instead of showing zeros. */
const getTotals = async () => {
  try {
    const payload = await getPayload({ config })
    const [publications, journals, authors] = await Promise.all([
      payload.count({ collection: 'publications', overrideAccess: false }),
      payload.count({ collection: 'journals', overrideAccess: false }),
      payload.count({ collection: 'authors', overrideAccess: false }),
    ])
    return { publications: publications.totalDocs, journals: journals.totalDocs, authors: authors.totalDocs }
  } catch {
    return null
  }
}

export default async function AboutPage({ params }: Args) {
  const { locale } = await params
  const t = siteUi[locale].about
  const totals = await getTotals()
  const pol = policies[locale]

  return (
    <div className="sp-page">
      <header className="sp-hero">
        <div className="acad-container">
          <p className="sp-eyebrow">{t.eyebrow}</p>
          <h1 className="sp-title">{t.title}</h1>
          <p className="sp-lead">{t.lead}</p>
          {totals && (
            <dl className="sp-stats" aria-label={t.statsLabel}>
              <div>
                <dt>{t.statPublications}</dt>
                <dd>{totals.publications}</dd>
              </div>
              <div>
                <dt>{t.statJournals}</dt>
                <dd>{totals.journals}</dd>
              </div>
              <div>
                <dt>{t.statAuthors}</dt>
                <dd>{totals.authors}</dd>
              </div>
            </dl>
          )}
        </div>
      </header>

      <div className="acad-container sp-stack">
        <section className="sp-block sp-mission">
          <h2>{t.missionTitle}</h2>
          <p>{t.mission}</p>
        </section>

        <section className="sp-block" aria-labelledby="principles">
          <h2 id="principles">{t.principlesTitle}</h2>
          <ul className="sp-grid sp-grid-4">
            {t.principles.map((p, i) => {
              const Icon = principleIcons[i] ?? Library
              return (
                <li key={p.title} className="sp-card">
                  <span className="sp-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="sp-block" aria-labelledby="how">
          <h2 id="how">{t.howTitle}</h2>
          <ol className="sp-steps">
            {t.steps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="sp-block" aria-labelledby="explore">
          <h2 id="explore">{t.exploreTitle}</h2>
          <ul className="sp-links">
            <li>
              <Link href={`/${locale}/journals`}>
                {t.explore.journals} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/publications`}>
                {t.explore.articles} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/authors`}>
                {t.explore.authors} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </section>

        <section className="sp-block" aria-labelledby="policies">
          <h2 id="policies">{t.policiesTitle}</h2>
          <ul className="sp-links">
            {(['peer-review', 'open-access', 'publication-ethics', 'editorial-board'] as const).map((slug) => (
              <li key={slug}>
                <Link href={`/${locale}/policies/${slug}`}>
                  {pol[slug].title} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="sp-banner">
          <div>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
          </div>
          <div className="sp-banner-actions">
            <Link href={`/${locale}/submit`} className="sp-btn sp-btn-primary">
              {t.cta}
            </Link>
            <Link href={`/${locale}/policies/contact`} className="sp-btn sp-btn-ghost">
              {t.ctaSecondary}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
