import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'

import { JournalsExplorer } from '@/components/journals/JournalsExplorer'
import { locales, type Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { siteUrl } from '@/lib/site'
import { jsonLdScript } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ category?: string; q?: string }>
}

export async function generateMetadata({ params }: Pick<Args, 'params'>): Promise<Metadata> {
  const { locale } = await params
  const t = messages[locale].journalsPage

  return {
    title: `${t.title} | AcadPress`,
    description: t.subtitle,
    alternates: {
      canonical: `/${locale}/journals`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/journals`])),
    },
  }
}

export default async function JournalsPage({ params, searchParams }: Args) {
  const { locale } = await params
  const { category, q } = await searchParams
  const t = messages[locale].journalsPage

  const payload = await getPayload({ config })
  const { docs: pubs } = await payload.find({
    collection: 'publications',
    locale,
    pagination: false,
    depth: 0,
    overrideAccess: false,
  })

  // Extract distinct venues from actual database publications
  const dbVenues = Array.from(new Set(pubs.map((p) => p.venue).filter(Boolean))) as string[]

  return (
    <div className="acad-journals-page-root">
      {/* Top Banner / Header */}
      <section className="acad-journals-hero-banner">
        <div className="acad-container">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="acad-breadcrumbs">
            <Link href={`/${locale}`}>Home</Link>
            <span className="acad-breadcrumb-sep">/</span>
            <span className="acad-breadcrumb-current">Journals</span>
          </nav>

          <div className="acad-journals-hero-content">
            <span className="acad-section-eyebrow">Scholarly Publication Catalog</span>
            <h1 className="acad-journals-hero-title">{t.title}</h1>
            <p className="acad-journals-hero-subtitle">{t.subtitle}</p>

            {/* Quick Metrics Bar */}
            <div className="acad-journals-metrics-bar">
              <div className="acad-jm-item">
                <span className="acad-jm-val">12</span>
                <span className="acad-jm-label">Flagship Journals</span>
              </div>
              <div className="acad-jm-divider" aria-hidden="true" />
              <div className="acad-jm-item">
                <span className="acad-jm-val">320</span>
                <span className="acad-jm-label">Volume Issues</span>
              </div>
              <div className="acad-jm-divider" aria-hidden="true" />
              <div className="acad-jm-item">
                <span className="acad-jm-val">100%</span>
                <span className="acad-jm-label">Open Access</span>
              </div>
              <div className="acad-jm-divider" aria-hidden="true" />
              <div className="acad-jm-item">
                <span className="acad-jm-val">21 Days</span>
                <span className="acad-jm-label">Avg. Peer Review</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Explorer (Sidebar + Journal Listing) */}
      <div className="acad-container">
        <JournalsExplorer
          locale={locale}
          initialCategory={category || 'all'}
          initialQuery={q || ''}
          dbVenues={dbVenues}
        />
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: t.title,
            description: t.subtitle,
            url: `${siteUrl}/${locale}/journals`,
            publisher: {
              '@type': 'Organization',
              name: 'AcadPress',
              url: siteUrl,
            },
          }),
        }}
      />
    </div>
  )
}
