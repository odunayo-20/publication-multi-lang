import {
  BadgeCheck,
  BookOpen,
  Building2,
  ChevronRight,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Library,
  MapPin,
  Quote,
  Sigma,
  Users,
} from 'lucide-react'
import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { AuthorActions } from '@/components/authors/AuthorActions'
import { AuthorWorks } from '@/components/authors/AuthorWorks'
import { locales, type Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { getCurrentUser } from '@/lib/auth'
import { getAuthorProfile, initialsOf } from '@/lib/authors'
import { siteUrl } from '@/lib/site'
import { jsonLdScript, personJsonLd } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config })
  const profile = await getAuthorProfile(payload, slug, locale)
  if (!profile) return {}
  const { record } = profile
  return {
    title: `${record.name} | AcadPress`,
    description: [record.title, record.institution, record.bio.slice(0, 140)].filter(Boolean).join(' · '),
    alternates: {
      canonical: `/${locale}/authors/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/authors/${slug}`])),
    },
  }
}

const formatNumber = (locale: string, n: number) => new Intl.NumberFormat(locale).format(n)

export default async function AuthorProfilePage({ params }: Args) {
  const { locale, slug } = await params
  const payload = await getPayload({ config })
  const profile = await getAuthorProfile(payload, slug, locale)
  if (!profile) notFound()
  const user = await getCurrentUser()
  const initialFollowing = Boolean(
    user?.followedAuthors?.some((a) => (typeof a === 'object' ? a.id : a) === profile.record.id),
  )

  const t = messages[locale].authorProfile
  const { record, works, stats, byYear, topVenues, coAuthors } = profile
  const maxYear = Math.max(1, ...byYear.map((y) => y.count))

  const metrics = [
    { key: 'publications', icon: FileText, value: stats.publications },
    { key: 'citations', icon: Quote, value: stats.citations },
    { key: 'hIndex', icon: Sigma, value: stats.hIndex },
    { key: 'views', icon: Eye, value: stats.views },
    { key: 'venues', icon: Library, value: stats.venues },
    { key: 'coAuthors', icon: Users, value: stats.coAuthors },
  ] as const

  const identifiers = [
    { label: 'ORCID', href: record.links.orcid },
    { label: 'Google Scholar', href: record.links.scholar },
    { label: 'ResearchGate', href: record.links.researchgate },
    { label: 'LinkedIn', href: record.links.linkedin },
    { label: messages[locale].profiles.other, href: record.links.website },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href))

  const jsonLd = personJsonLd({
    name: record.name,
    url: `${siteUrl}/${locale}/authors/${slug}`,
    jobTitle: record.title,
    institution: record.institution,
    profileUrls: identifiers.map((i) => i.href),
    description: record.bio,
  })

  return (
    <div className="ap-page">
      <header className="ap-hero">
        <div className="ap-hero-glow" aria-hidden="true" />
        <div className="acad-container">
          <nav className="ap-breadcrumb" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>{t.breadcrumbHome}</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href={`/${locale}/#authors`}>{t.breadcrumbAuthors}</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{record.name}</span>
          </nav>

          <div className="ap-identity">
            <div className={`ap-avatar ${record.gradient}`} aria-hidden="true">
              {record.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={record.avatarUrl} alt="" className="ap-avatar-img" />
              ) : (
                initialsOf(record.name)
              )}
            </div>
            <div className="ap-identity-text">
              <h1 className="ap-name">
                {record.name}
                {record.isVerified && (
                  <span className="ap-verified" title={t.verified}>
                    <BadgeCheck size={22} aria-hidden="true" />
                    <span className="ap-sr-only">{t.verified}</span>
                  </span>
                )}
              </h1>
              <p className="ap-role">{record.title}</p>
              <ul className="ap-facts">
                {record.institution && (
                  <li>
                    <Building2 size={15} aria-hidden="true" /> {record.institution}
                  </li>
                )}
                {record.location && (
                  <li>
                    <MapPin size={15} aria-hidden="true" /> {record.location}
                  </li>
                )}
                {record.memberSince && (
                  <li>
                    <BookOpen size={15} aria-hidden="true" /> {t.memberSince(record.memberSince)}
                  </li>
                )}
              </ul>
              <ul className="ap-interest-pills" aria-label={t.researchInterests}>
                {record.interests.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <AuthorActions
              authorId={record.id}
              locale={locale}
              signedIn={Boolean(user)}
              initialFollowing={initialFollowing}
              signInHref={`/${locale}/sign-in?next=${encodeURIComponent(`/${locale}/authors/${slug}`)}`}
              labels={{
                follow: t.follow,
                following: t.following,
                share: t.shareProfile,
                copied: t.linkCopied,
                error: t.actionFailed,
              }}
            />
          </div>
        </div>
      </header>

      <div className="acad-container">
        <dl className="ap-metrics">
          {metrics.map(({ key, icon: Icon, value }) => (
            <div className="ap-metric" key={key}>
              <Icon size={18} aria-hidden="true" />
              <div className="ap-metric-text">
                <dt>{t.metrics[key]}</dt>
                <dd>{formatNumber(locale, value)}</dd>
              </div>
            </div>
          ))}
        </dl>
        <p className="ap-metrics-note">{t.metricsNote}</p>

        <nav className="ap-subnav" aria-label={t.sectionNav}>
          <a href="#publications">
            {t.publications} <span>{works.length}</span>
          </a>
          <a href="#about">{t.about}</a>
          {coAuthors.length > 0 && (
            <a href="#co-authors">
              {t.coAuthors} <span>{coAuthors.length}</span>
            </a>
          )}
        </nav>

        <div className="ap-grid">
          <section id="publications" className="ap-main" aria-labelledby="ap-pubs-h">
            <h2 id="ap-pubs-h" className="ap-h2">
              {t.publications}
            </h2>
            {works.length === 0 ? (
              <p className="ap-empty">{t.noPublications}</p>
            ) : (
              <AuthorWorks
                locale={locale}
                works={works}
                typeLabels={messages[locale].types}
                labels={{
                  search: t.searchWorks,
                  sortBy: t.sortBy,
                  sortNewest: t.sortNewest,
                  sortCited: t.sortCited,
                  sortTitle: t.sortTitle,
                  allYears: t.allYears,
                  year: t.year,
                  showing: t.showing,
                  noMatches: t.noMatches,
                  reset: t.resetFilters,
                  views: t.views,
                  citations: t.citations,
                  with: t.with,
                }}
              />
            )}
          </section>

          <aside className="ap-side">
            <section id="about" className="ap-card" aria-labelledby="ap-about-h" hidden={!record.bio}>
              <h2 id="ap-about-h" className="ap-h3">
                {t.about}
              </h2>
              <p className="ap-bio">{record.bio}</p>
            </section>

            {byYear.length > 0 && (
              <section className="ap-card" aria-labelledby="ap-output-h">
                <h2 id="ap-output-h" className="ap-h3">
                  {t.output}
                </h2>
                <ol className="ap-bars">
                  {byYear.map((y) => (
                    <li key={y.year}>
                      <span className="ap-bar-count">{y.count}</span>
                      <span
                        className="ap-bar"
                        style={{ height: `${Math.max(12, (y.count / maxYear) * 100)}%` }}
                        aria-hidden="true"
                      />
                      <span className="ap-bar-year">{y.year}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {topVenues.length > 0 && (
              <section className="ap-card" aria-labelledby="ap-venues-h">
                <h2 id="ap-venues-h" className="ap-h3">
                  {t.topVenues}
                </h2>
                <ul className="ap-list">
                  {topVenues.slice(0, 4).map((v) => (
                    <li key={v.venue}>
                      <span>{v.venue}</span>
                      <b>{v.count}</b>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {coAuthors.length > 0 && (
              <section id="co-authors" className="ap-card" aria-labelledby="ap-co-h">
                <h2 id="ap-co-h" className="ap-h3">
                  {t.coAuthors}
                </h2>
                <ul className="ap-coauthors">
                  {coAuthors.slice(0, 6).map((c) => {
                    const inner = (
                      <>
                        <span className="ap-mini-avatar" aria-hidden="true">
                          {initialsOf(c.name)}
                        </span>
                        <span>
                          <span className="ap-co-name">{c.name}</span>
                          <span className="ap-co-shared">{t.sharedPapers(c.shared)}</span>
                        </span>
                      </>
                    )
                    return (
                      <li key={c.name}>
                        {c.slug ? <Link href={`/${locale}/authors/${c.slug}`}>{inner}</Link> : <div>{inner}</div>}
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}

            {identifiers.length > 0 && (
              <section className="ap-card" aria-labelledby="ap-ids-h">
                <h2 id="ap-ids-h" className="ap-h3">
                  {t.identifiers}
                </h2>
                <ul className="ap-links">
                  {identifiers.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer me">
                        <Globe size={15} aria-hidden="true" />
                        {l.label}
                        <ExternalLink size={13} aria-hidden="true" className="ap-ext" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
    </div>
  )
}
