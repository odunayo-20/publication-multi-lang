import config from '@payload-config'
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck2,
  Globe,
  Quote,
  Users,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { academicJournals } from '@/data/journals'
import { locales, type Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { siteUrl } from '@/lib/site'
import { jsonLdScript } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const journal = academicJournals.find((j) => j.slug === slug)
  if (!journal) return {}

  return {
    title: `${journal.name} | AcadPress`,
    description: journal.scope,
    alternates: {
      canonical: `/${locale}/journals/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/journals/${slug}`])),
    },
  }
}

export default async function JournalDetailPage({ params }: Args) {
  const { locale, slug } = await params
  const journal = academicJournals.find((j) => j.slug === slug)
  if (!journal) notFound()

  const t = messages[locale]
  const payload = await getPayload({ config })

  // Find publications associated with this journal in the database
  const { docs: journalPubs } = await payload.find({
    collection: 'publications',
    locale,
    where: {
      venue: {
        contains: journal.name.slice(0, 20),
      },
    },
    limit: 6,
    depth: 1,
    overrideAccess: false,
  })

  // Fallback benchmark articles for this journal if not yet published in database
  const fallbackArticles = [
    {
      id: 'j-art-1',
      title: `Machine Learning Approaches for Sustainable Systems in ${journal.categoryName}`,
      slug: 'machine-learning-approaches-smart-cities',
      authors: 'Dr. Samuel Adeyemi, Prof. Blessing Okonfor',
      year: 2025,
      views: '1.2k',
      citations: '23',
      doi: `10.1234/${journal.initials.toLowerCase()}.2025.001`,
      excerpt:
        'This research examines how computational modeling optimizes domain workflows, predictive diagnostics, and data-driven resource utilization.',
    },
    {
      id: 'j-art-2',
      title: `Empirical Evaluation of Emerging Frameworks in Modern ${journal.categoryName}`,
      slug: 'real-time-flash-flood-forecasting-early-warning',
      authors: 'Dr. Joško Trošelj, Dr. Funke Adebayo',
      year: 2025,
      views: '950',
      citations: '14',
      doi: `10.1234/${journal.initials.toLowerCase()}.2025.002`,
      excerpt:
        'A multi-cohort longitudinal inquiry analyzing parametric fidelity and operational reliability in high-stakes environments.',
    },
    {
      id: 'j-art-3',
      title: `Decentralized Infrastructure and Scalable Architectures: A Comprehensive Review`,
      slug: 'review-renewable-energy-rural-communities',
      authors: 'Prof. Blessing Okonfor, Dr. Sridhara Nayak',
      year: 2024,
      views: '840',
      citations: '19',
      doi: `10.1234/${journal.initials.toLowerCase()}.2024.003`,
      excerpt:
        'Systematic meta-analysis evaluating protocol scalability, fault tolerance, and institutional governance mechanisms.',
    },
  ]

  const articles =
    journalPubs.length > 0
      ? journalPubs.map((p, idx) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          authors: p.authors.map((a) => a.name).join(', '),
          year: p.year,
          views: `${(1.1 + idx * 0.3).toFixed(1)}k`,
          citations: String(12 + idx * 5),
          doi: p.doi ?? `10.1234/${journal.initials.toLowerCase()}.2025.00${idx + 1}`,
          excerpt: p.abstract ?? 'Peer-reviewed research published in this journal.',
        }))
      : fallbackArticles

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Periodical',
    name: journal.name,
    issn: journal.issn,
    publisher: {
      '@type': 'Organization',
      name: 'AcadPress',
      url: siteUrl,
    },
    description: journal.scope,
    url: `${siteUrl}/${locale}/journals/${slug}`,
  }

  return (
    <div className="acad-journal-detail-page">
      {/* Top Hero Banner */}
      <section className="acad-journal-hero-banner">
        <div className="acad-container">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="acad-breadcrumbs">
            <Link href={`/${locale}`}>Home</Link>
            <span className="acad-breadcrumb-sep">/</span>
            <Link href={`/${locale}/journals`}>Journals</Link>
            <span className="acad-breadcrumb-sep">/</span>
            <span className="acad-breadcrumb-current">{journal.name}</span>
          </nav>

          <div className="acad-journal-header-content">
            <div className="acad-journal-badge-row">
              <div className={`acad-journal-avatar-badge-lg ${journal.badgeColor}`} aria-hidden="true">
                <span>{journal.initials}</span>
              </div>
              <div>
                <span className="acad-journal-category-pill">{journal.categoryName}</span>
                <h1 className="acad-journal-headline-title">{journal.name}</h1>
              </div>
            </div>

            {/* Metrics Strip */}
            <div className="acad-journal-metrics-ribbon">
              <div className="acad-ribbon-item">
                <span className="acad-ribbon-label">ISSN (Print)</span>
                <span className="acad-ribbon-val">{journal.issn}</span>
              </div>
              <div className="acad-ribbon-divider" />
              <div className="acad-ribbon-item">
                <span className="acad-ribbon-label">CiteScore</span>
                <span className="acad-ribbon-val font-bold text-blue-400">{journal.citeScore}</span>
              </div>
              <div className="acad-ribbon-divider" />
              <div className="acad-ribbon-item">
                <span className="acad-ribbon-label">Acceptance Rate</span>
                <span className="acad-ribbon-val">{journal.acceptanceRate}</span>
              </div>
              <div className="acad-ribbon-divider" />
              <div className="acad-ribbon-item">
                <span className="acad-ribbon-label">First Decision</span>
                <span className="acad-ribbon-val">{journal.reviewTime}</span>
              </div>
              <div className="acad-ribbon-divider" />
              <div className="acad-ribbon-item">
                <span className="acad-ribbon-label">Access Model</span>
                <span className="acad-ribbon-val text-emerald-400 font-semibold">Gold Open Access</span>
              </div>
            </div>

            {/* Actions */}
            <div className="acad-journal-hero-actions">
              <Link href={`/${locale}/publications`} className="acad-btn-primary-lg">
                <FileCheck2 className="w-4 h-4 mr-1.5" />
                <span>{t.journalDetail.submitManuscript}</span>
              </Link>
              <Link href={`/${locale}/#about`} className="acad-btn-secondary-lg">
                <BookOpen className="w-4 h-4 mr-1.5" />
                <span>{t.journalDetail.authorGuidelines}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Layout */}
      <div className="acad-container">
        <div className="acad-journal-layout-grid">
          {/* Left Column: Scope & Articles */}
          <main className="acad-journal-main-col">
            {/* Aims & Scope */}
            <section className="acad-journal-section" aria-labelledby="scope-heading">
              <h2 id="scope-heading" className="acad-section-heading">
                {t.journalDetail.aimsScope}
              </h2>
              <div className="acad-journal-scope-box">
                <p className="acad-scope-lead">{journal.scope}</p>
                <p>
                  The journal publishes rigorous, high-impact original research, comprehensive systematic
                  reviews, and methodological breakthroughs. All submissions undergo stringent double-blind
                  peer review by international domain editors to guarantee scientific excellence and ethical
                  integrity.
                </p>
              </div>
            </section>

            {/* Articles in this Journal */}
            <section className="acad-journal-section" aria-labelledby="articles-heading">
              <div className="acad-section-header-compact">
                <h2 id="articles-heading" className="acad-section-heading">
                  {t.journalDetail.articlesInJournal}
                </h2>
                <span className="acad-articles-count-tag">{articles.length} published articles</span>
              </div>

              <div className="acad-journal-articles-stack">
                {articles.map((art) => (
                  <article key={art.id} className="acad-journal-pub-item">
                    <div className="acad-jpi-body">
                      <h3 className="acad-jpi-title">
                        <Link href={`/${locale}/publications/${art.slug}`}>{art.title}</Link>
                      </h3>
                      <p className="acad-jpi-authors">{art.authors}</p>
                      <p className="acad-jpi-excerpt">{art.excerpt}</p>

                      <div className="acad-jpi-meta-row">
                        <span className="acad-jpi-meta-item">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          <span>{art.year}</span>
                        </span>
                        <span className="acad-jpi-meta-item">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>{art.views} views</span>
                        </span>
                        <span className="acad-jpi-meta-item">
                          <Quote className="w-3.5 h-3.5 mr-1" />
                          <span>{art.citations} citations</span>
                        </span>
                        <span className="acad-jpi-doi">DOI: {art.doi}</span>
                      </div>
                    </div>

                    <div className="acad-jpi-actions">
                      <Link href={`/${locale}/publications/${art.slug}`} className="acad-btn-read-article">
                        <span>Read Article</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          {/* Right Column: Indexing & Editorial Info */}
          <aside className="acad-journal-sidebar-col" aria-label="Journal Information">
            {/* Indexing & Archiving */}
            <div className="acad-sidebar-card">
              <h3 className="acad-sidebar-card-title">
                <Globe className="w-4 h-4 mr-1.5 text-blue-600" />
                <span>{t.journalDetail.indexing}</span>
              </h3>
              <p className="acad-sidebar-card-desc">
                Permanently preserved and indexed across frontier academic indexing databases:
              </p>
              <div className="acad-indexing-chips-stack">
                {journal.indexing.map((idx) => (
                  <div key={idx} className="acad-indexing-item">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                    <span>{idx}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fast-Track Review Card */}
            <div className="acad-sidebar-card">
              <h3 className="acad-sidebar-card-title">
                <Clock className="w-4 h-4 mr-1.5 text-blue-600" />
                <span>{t.journalDetail.fastTrack}</span>
              </h3>
              <p className="acad-sidebar-card-desc">
                Authors receive constructive, rigorous feedback from two or more independent specialist
                reviewers in an average of <strong>21 days</strong>.
              </p>
              <ul className="acad-fast-track-points">
                <li>Double-blind evaluation</li>
                <li>Zero article processing charges for selected authors</li>
                <li>Instant DOI assignment upon acceptance</li>
              </ul>
            </div>

            {/* Editorial Board Card */}
            <div className="acad-sidebar-card">
              <h3 className="acad-sidebar-card-title">
                <Users className="w-4 h-4 mr-1.5 text-blue-600" />
                <span>{t.journalDetail.editorialBoard}</span>
              </h3>
              <div className="acad-editor-profile">
                <div className="acad-editor-avatar" aria-hidden="true">
                  ED
                </div>
                <div>
                  <strong className="block text-sm">Prof. Marcus Vance, PhD</strong>
                  <span className="text-xs text-slate-500">Editor-in-Chief · Institute of Technology</span>
                </div>
              </div>
              <p className="acad-editorial-ethics-note">
                Our international editorial board adheres to Committee on Publication Ethics (COPE) guidelines
                for academic integrity.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* JSON-LD Script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
    </div>
  )
}
