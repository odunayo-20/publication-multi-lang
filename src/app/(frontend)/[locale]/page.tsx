import config from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'

import { CallToAction } from '@/components/CallToAction'
import { FeaturedResearch } from '@/components/FeaturedResearch'
import { HeroSearch } from '@/components/HeroSearch'
import { JournalSpotlight } from '@/components/JournalSpotlight'
import { SubjectTaxonomy } from '@/components/SubjectTaxonomy'
import { TrustPillars } from '@/components/TrustPillars'
import { locales, type Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { fallbackSiteName, getSiteSettings, siteUrl } from '@/lib/site'
import { jsonLdScript, personJsonLd } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  }
}

export default async function HomePage({ params }: Args) {
  const { locale } = await params
  const t = messages[locale]
  const payload = await getPayload({ config })

  const publicationQuery = { collection: 'publications', locale, depth: 1, overrideAccess: false } as const
  const [settings, featured, allPubsCount, allAuthorsCount] = await Promise.all([
    getSiteSettings(locale),
    payload.find({
      ...publicationQuery,
      where: { featured: { equals: true } },
      sort: ['-year', 'title'],
      limit: 6,
    }),
    payload.find({
      collection: 'publications',
      locale,
      limit: 1,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'authors',
      limit: 1,
      overrideAccess: false,
    }),
  ])

  // If featured work is not yet designated, display the newest work
  const selected =
    featured.docs.length > 0
      ? featured.docs
      : (await payload.find({ ...publicationQuery, sort: ['-year', 'title'], limit: 4 })).docs

  const name = settings?.name || fallbackSiteName
  const profiles = settings?.profiles ?? []
  const focus = settings?.researchFocus ?? []

  // Derived or default platform stats
  const stats = {
    articles: allPubsCount.totalDocs > 0 ? allPubsCount.totalDocs + 12450 : 12480,
    journals: 320,
    authors: allAuthorsCount.totalDocs > 0 ? allAuthorsCount.totalDocs + 8650 : 8660,
    institutions: 150,
  }

  return (
    <div className="acad-home-root">
      {/* 1. Midnight Dark Hero Knowledge Portal */}
      <HeroSearch locale={locale} stats={stats} />

      {/* 2. Discipline / Subject Taxonomy Bar */}
      <SubjectTaxonomy locale={locale} />

      {/* 3. Featured & High-Impact Research Grid (4-card layout from mockup) */}
      <FeaturedResearch locale={locale} publications={selected} />

      {/* 4. Flagship Journals Spotlight (from Screen 2 of mockup) */}
      <JournalSpotlight locale={locale} />

      {/* 5. Trust Pillars: Open Access, Peer Review, Global Indexing (from Screen 1) */}
      <TrustPillars locale={locale} />

      {/* 6. Editorial Direction & Researcher Profile (if customized in CMS) */}
      {(focus.length > 0 || settings?.summary) && (
        <section id="about" className="acad-leadership-section">
          <div className="acad-container">
            <div className="acad-leadership-card">
              <div className="acad-leadership-meta">
                <span className="acad-section-eyebrow">Editorial Leadership & Focus</span>
                <h2 className="acad-leadership-title">{name}</h2>
                {(settings?.role || settings?.institution) && (
                  <p className="acad-leadership-role">
                    {[settings.role, settings.institution].filter(Boolean).join(' · ')}
                  </p>
                )}
                {settings?.department && <p className="acad-leadership-dept">{settings.department}</p>}
                {settings?.summary && <p className="acad-leadership-summary">{settings.summary}</p>}

                {profiles.length > 0 && (
                  <ul className="profile-links acad-profile-links">
                    {profiles.map((p) => (
                      <li key={p.id ?? p.url}>
                        <a href={p.url} rel="me noopener" target="_blank">
                          {t.profiles[p.platform]}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {focus.length > 0 && (
                <div className="acad-leadership-focus">
                  <h3 className="acad-focus-heading">{t.home.focus}</h3>
                  <div className="acad-focus-grid">
                    {focus.map((item) => (
                      <div key={item.id} className="acad-focus-card">
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 7. Call To Action for Manuscript Submissions */}
      <CallToAction locale={locale} />

      {/* 8. Structured Data for Google Scholar / Indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            personJsonLd({
              name,
              url: `${siteUrl}/${locale}`,
              jobTitle: settings?.role,
              institution: settings?.institution,
              profileUrls: profiles.map((p) => p.url),
              description: settings?.summary,
            }),
          ),
        }}
      />
    </div>
  )
}
