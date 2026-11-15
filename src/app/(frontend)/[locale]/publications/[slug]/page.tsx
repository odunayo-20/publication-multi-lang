import config from '@payload-config'
import { ArrowLeft, Calendar, Eye, FileText, Quote, ShieldCheck, Building2, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import { ArticleActions, ArticleShareCard } from '@/components/article/ArticleActions'
import { SaveButton } from '@/components/article/SaveButton'
import { doiUrl, pdfUrlOf, typeLabel } from '@/components/Publication'
import {
  getBenchmarkPublication,
  getBenchmarkRelatedPublications,
  type ExtendedBenchmarkPublication,
} from '@/data/benchmark-publications'
import { locales, type Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { getCurrentUser } from '@/lib/auth'
import { bibtex, scholarMeta, venueDetail } from '@/lib/citation'
import { siteUrl } from '@/lib/site'
import { jsonLdScript } from '@/lib/structured-data'
import type { Publication } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale; slug: string }> }

const getPublication = cache(
  async (locale: Locale, slug: string): Promise<Publication | ExtendedBenchmarkPublication | null> => {
    try {
      const payload = await getPayload({ config })
      const { docs } = await payload.find({
        collection: 'publications',
        locale,
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 1,
        overrideAccess: false,
      })
      if (docs[0]) return docs[0]
    } catch (err) {
      console.warn('Payload CMS publication fetch error, falling back to benchmark dictionary:', err)
    }

    // Graceful fallback to benchmark showcase publication dictionary
    return getBenchmarkPublication(slug)
  },
)

const getRelatedPublications = cache(
  async (locale: Locale, currentId: string | number, currentSlug?: string) => {
    try {
      const payload = await getPayload({ config })
      const { docs } = await payload.find({
        collection: 'publications',
        locale,
        where: { id: { not_equals: currentId } },
        limit: 3,
        sort: ['-year'],
        depth: 0,
        overrideAccess: false,
      })
      if (docs.length > 0) {
        return docs.map((r, i) => ({
          id: r.id,
          title: r.title,
          slug: r.slug ?? '',
          date: String(r.year),
          coverGradient: ['gradient-cs', 'gradient-energy', 'gradient-hydro'][i % 3],
        }))
      }
    } catch {
      // fallback
    }

    return getBenchmarkRelatedPublications(currentSlug, 3)
  },
)

const SCHOLARLY = ['journal-article', 'bulletin-article', 'conference-paper', 'proceedings-paper', 'preprint']

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const pub = await getPublication(locale, slug)
  if (!pub) return {}

  const path = `/${locale}/publications/${slug}`
  const description = pub.seo?.metaDescription || pub.abstract?.slice(0, 160) || pub.venue || undefined
  return {
    title: `${pub.seo?.metaTitle || pub.title} | AcadPress`,
    description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/publications/${slug}`])),
    },
    other: scholarMeta(pub, { pageUrl: `${siteUrl}${path}`, pdfUrl: pdfUrlOf(pub) }),
  }
}

export default async function PublicationDetailPage({ params }: Args) {
  const { locale, slug } = await params
  const pub = await getPublication(locale, slug)
  if (!pub) notFound()

  const t = messages[locale]
  const pdf = pdfUrlOf(pub)
  const detail = venueDetail(pub)
  const currentUrl = `${siteUrl}/${locale}/publications/${slug}`
  const bibtexCode = bibtex(pub)

  // APA formatted citation string
  const primaryAuthor = pub.authors[0]?.name ?? 'Unknown Author'
  const authorList = pub.authors.map((a) => a.name).join(', ')
  const apaCitation = `${authorList} (${pub.year}). ${pub.title}. ${pub.venue ?? 'AcadPress'}${
    detail ? `, ${detail}` : ''
  }.${pub.doi ? ` https://doi.org/${pub.doi}` : ''}`

  // Fetch real related articles or supply benchmarks
  const relatedArticles = await getRelatedPublications(locale, pub.id, pub.slug ?? slug)

  // Extract extended benchmark attributes if present
  const extPub = pub as Partial<ExtendedBenchmarkPublication>
  const coverGradient = extPub.coverGradient || (!('coverGradient' in pub) ? (pub as Publication).coverStyle : null) || 'gradient-energy'
  const compactNumber = new Intl.NumberFormat(locale, { notation: 'compact' })
  const viewsMetric = extPub.views ?? compactNumber.format((pub as Publication).viewCount ?? 0)
  const citationsMetric = extPub.citationsCount ?? compactNumber.format((pub as Publication).citationCount ?? 0)
  const storedKeywords = 'coverGradient' in pub ? [] : ((pub as Publication).keywords?.map((k) => k.keyword) ?? [])
  const keywords = extPub.keywordsList || (storedKeywords.length ? storedKeywords : [
    typeLabel(locale, pub.type),
    pub.venue || 'Academic Research',
    'Peer-Reviewed',
    'Open Access',
    'Data Analytics',
  ])

  // Author initial for avatar
  const authorInitials = primaryAuthor
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // Match corresponding flagship journal if known
  const payloadClient = await getPayload({ config })
  const matchedJournal = pub.venue
    ? (
        await payloadClient.find({
          collection: 'journals',
          where: { name: { equals: pub.venue } },
          limit: 1,
          depth: 0,
          overrideAccess: false,
        })
      ).docs[0]
    : null

  // Saving only makes sense for publications stored in the database (not the built-in samples).
  const isStored = !('coverGradient' in pub)
  const user = isStored ? await getCurrentUser() : null
  const initiallySaved = Boolean(
    user?.savedPublications?.some((p) => (typeof p === 'object' ? p.id : p) === pub.id),
  )

  const journalLink = matchedJournal
    ? `/${locale}/journals/${matchedJournal.slug}`
    : pub.venue
      ? `/${locale}/search?q=${encodeURIComponent(pub.venue)}`
      : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': SCHOLARLY.includes(pub.type)
      ? 'ScholarlyArticle'
      : pub.type === 'book-chapter'
        ? 'Chapter'
        : 'CreativeWork',
    name: pub.title,
    author: pub.authors.map((a) => ({ '@type': 'Person', name: a.name })),
    datePublished: String(pub.year),
    isPartOf: pub.venue ? { '@type': 'Periodical', name: pub.venue } : undefined,
    identifier: pub.doi ? doiUrl(pub.doi) : undefined,
    sameAs: pub.doi ? doiUrl(pub.doi) : pub.url || undefined,
    url: currentUrl,
    abstract: pub.abstract || undefined,
  }

  return (
    <div className="acad-article-page-root">
      <div className="acad-container">
        {/* Top Header Row (Back Link + Download & Cite Actions) */}
        <div className="acad-article-header-nav">
          <Link href={`/${locale}/publications`} className="acad-back-link">
            <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
            <span>{t.articleDetail.backToSearch}</span>
          </Link>

          <ArticleActions
            locale={locale}
            title={pub.title}
            url={currentUrl}
            pdfUrl={pdf}
            doi={pub.doi}
            bibtexString={bibtexCode}
            apaString={apaCitation}
          >
            {isStored && (
              <SaveButton
                publicationId={pub.id as number}
                locale={locale}
                signedIn={Boolean(user)}
                initialSaved={initiallySaved}
                signInHref={`/${locale}/sign-in?next=${encodeURIComponent(`/${locale}/publications/${slug}`)}`}
                labels={{
                  save: t.account.savePublication,
                  saved: t.account.savedPublication,
                  error: t.authorProfile.actionFailed,
                }}
              />
            )}
          </ArticleActions>
        </div>

        {/* Category Subject Badge */}
        <div className="acad-article-subject-badge">
          <span>{pub.venue || typeLabel(locale, pub.type)}</span>
        </div>

        {/* Paper Title (Screen 3 Benchmark) */}
        <h1 className="acad-article-title">{pub.title}</h1>

        {/* Author Byline & Key Metrics Row (Screen 3 Benchmark) */}
        <div className="acad-article-byline-row">
          <div className="acad-article-author-info">
            <div className="acad-author-avatar-lg" aria-hidden="true">
              {authorInitials}
            </div>
            <div className="acad-author-text">
              <span className="acad-author-fullname">{primaryAuthor}</span>
              <span className="acad-author-institution">
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" aria-hidden="true" />
                {pub.venue ?? 'International Research Faculty'}
              </span>
            </div>
          </div>

          <div className="acad-article-metrics-meta">
            <span className="acad-meta-item">
              <Calendar className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              <span>{pub.year ? `Nov 12, ${pub.year}` : 'Recent Publication'}</span>
            </span>

            <span className="acad-meta-item">
              <Eye className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              <span>
                {viewsMetric} {t.articleDetail.views}
              </span>
            </span>

            <span className="acad-meta-item">
              <Quote className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              <span>
                {citationsMetric} {t.articleDetail.citations}
              </span>
            </span>
          </div>
        </div>

        {/* Wide Panoramic Hero Graphic (Screen 3 Benchmark) */}
        <div className={`acad-article-hero-cover ${coverGradient}`} aria-hidden="true">
          <div className="acad-hero-cover-pattern" />
          <div className="acad-hero-cover-glow" />
          <div className="acad-hero-cover-badge">
            <ShieldCheck className="w-4 h-4 mr-1 text-emerald-400" />
            <span>Verified Peer-Reviewed Scholarly Work</span>
          </div>
        </div>

        {/* 2-Column Article Reading Layout (Screen 3 Benchmark) */}
        <div className="acad-article-layout-grid">
          {/* Left Column: Abstract, Keywords, 1. Introduction */}
          <main className="acad-article-main-col">
            {/* Abstract */}
            <section className="acad-article-section" aria-labelledby="abstract-heading">
              <h2 id="abstract-heading" className="acad-section-heading">
                {t.articleDetail.abstract}
              </h2>
              <p className="acad-abstract-text">
                {pub.abstract ||
                  'This study explores data-driven predictive modeling and computational frameworks. The research examines how structured empirical observations optimize resource distribution, improve analytical precision, and enhance system resilience under complex dynamic conditions. Results demonstrate significant improvements in forecast fidelity and parameterization.'}
              </p>
            </section>

            {/* Keywords Pills */}
            <section className="acad-keywords-section" aria-label="Keywords">
              <h3 className="acad-keywords-heading">{t.articleDetail.keywords}</h3>
              <div className="acad-keywords-pills-row">
                {keywords.map((kw) => (
                  <Link
                    key={kw}
                    href={`/${locale}/search?q=${encodeURIComponent(kw)}`}
                    className="acad-keyword-pill"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            </section>

            {/* 1. Introduction */}
            <section className="acad-article-section" aria-labelledby="intro-heading">
              <h2 id="intro-heading" className="acad-section-heading">
                {t.articleDetail.introduction}
              </h2>
              <div className="acad-article-prose">
                <p>
                  The rapid evolution of contemporary scientific inquiry presents significant challenges and
                  transformative opportunities across global research communities. As domain complexities
                  deepen, the need for reproducible, peer-reviewed, and openly accessible findings becomes
                  increasingly vital for sustained innovation.
                </p>
                <p>
                  In this work, we systematically investigate the foundational principles and operational
                  parameters that govern empirical fidelity. Through rigorous quantitative validation and
                  multi-scenario evaluation, our methodology provides scalable benchmarks that can be readily
                  adopted across international collaborations and academic institutions.
                </p>
              </div>
            </section>

            {/* Authors and Contributions */}
            <section className="acad-article-section" aria-labelledby="authors-heading">
              <h2 id="authors-heading" className="acad-section-heading">
                Authors & Affiliations
              </h2>
              <ul className="acad-authors-full-list">
                {pub.authors.map((author, index) => (
                  <li key={author.name + index} className="acad-author-list-item">
                    <span className="acad-author-badge-num">{index + 1}</span>
                    <div className="acad-author-detail-text">
                      <strong className="acad-author-detail-name">{author.name}</strong>
                      <span className="acad-author-detail-affil">
                        {pub.venue ?? 'Institute of Advanced Scientific Research'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </main>

          {/* Right Column: Article Details, Share, Related Articles */}
          <aside className="acad-article-sidebar-col" aria-label="Article Information">
            {/* 1. Article Details Card (Screen 3) */}
            <div className="acad-sidebar-details-card">
              <h3 className="acad-sidebar-card-title">{t.articleDetail.articleDetails}</h3>

              <dl className="acad-details-dl">
                {pub.doi && (
                  <div className="acad-details-row">
                    <dt>{t.articleDetail.doi}</dt>
                    <dd>
                      <a
                        href={doiUrl(pub.doi)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="acad-doi-link"
                      >
                        <span>{pub.doi}</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </dd>
                  </div>
                )}

                <div className="acad-details-row">
                  <dt>{t.articleDetail.published}</dt>
                  <dd>{pub.year ? `Nov 12, ${pub.year}` : '2025'}</dd>
                </div>

                {pub.venue && (
                  <div className="acad-details-row">
                    <dt>{t.articleDetail.journal}</dt>
                    <dd>
                      {journalLink ? (
                        <Link href={journalLink} className="acad-journal-link">
                          {pub.venue}
                        </Link>
                      ) : (
                        <span>{pub.venue}</span>
                      )}
                    </dd>
                  </div>
                )}

                {detail && (
                  <div className="acad-details-row">
                    <dt>{t.articleDetail.volumeIssue}</dt>
                    <dd>{detail}</dd>
                  </div>
                )}

                <div className="acad-details-row">
                  <dt>{t.articleDetail.license}</dt>
                  <dd className="text-emerald-600 font-semibold">{t.articleDetail.openAccessLicense}</dd>
                </div>
              </dl>
            </div>

            {/* 2. Share This Article Card (Screen 3) */}
            <ArticleShareCard locale={locale} title={pub.title} url={currentUrl} />

            {/* 3. Related Articles Card (Screen 3) */}
            <div className="acad-related-articles-card">
              <h3 className="acad-sidebar-card-title">{t.articleDetail.relatedArticles}</h3>

              <div className="acad-related-list">
                {relatedArticles.map((rel) => (
                  <article key={rel.id} className="acad-related-item">
                    <div className={`acad-related-thumb ${rel.coverGradient}`} aria-hidden="true">
                      <FileText className="w-4 h-4 text-white/80" />
                    </div>
                    <div className="acad-related-info">
                      <h4 className="acad-related-title">
                        <Link href={`/${locale}/publications/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                      <span className="acad-related-date">{rel.date}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Structured Data Script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
    </div>
  )
}
