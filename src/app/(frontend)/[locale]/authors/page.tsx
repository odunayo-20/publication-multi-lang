import config from '@payload-config'
import { BadgeCheck, Building2, Search } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'

import { locales, type Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { getAuthorDirectory, initialsOf, normalizeName } from '@/lib/authors'

export const dynamic = 'force-dynamic'

type Sort = 'name' | 'publications' | 'citations'
type Args = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ q?: string; sort?: string }>
}

export async function generateMetadata({ params }: Pick<Args, 'params'>): Promise<Metadata> {
  const { locale } = await params
  const t = messages[locale].authorsDirectory
  return {
    title: `${t.title} | AcadPress`,
    description: t.subtitle,
    alternates: {
      canonical: `/${locale}/authors`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/authors`])),
    },
  }
}

export default async function AuthorsDirectoryPage({ params, searchParams }: Args) {
  const { locale } = await params
  const { q = '', sort: rawSort } = await searchParams
  const sort: Sort = rawSort === 'publications' || rawSort === 'citations' ? rawSort : 'name'
  const t = messages[locale].authorsDirectory

  const payload = await getPayload({ config })
  const directory = await getAuthorDirectory(payload, locale)

  const needle = normalizeName(q)
  const rows = directory
    .filter(({ record }) =>
      !needle
        ? true
        : [record.name, record.institution, record.title, ...record.interests].some((s) =>
            normalizeName(s).includes(needle),
          ),
    )
    .sort((a, b) => {
      if (sort === 'publications') return b.stats.publications - a.stats.publications
      if (sort === 'citations') return b.stats.citations - a.stats.citations
      return a.record.name.localeCompare(b.record.name, locale)
    })

  return (
    <div className="dr-page">
      <section className="dr-hero">
        <div className="acad-container">
          <h1 className="dr-title">{t.title}</h1>
          <p className="dr-subtitle">{t.subtitle}</p>

          <form method="GET" className="dr-toolbar" role="search">
            <div className="dr-search">
              <Search size={18} aria-hidden="true" />
              <label htmlFor="dr-q" className="ap-sr-only">
                {t.searchPlaceholder}
              </label>
              <input id="dr-q" type="search" name="q" defaultValue={q} placeholder={t.searchPlaceholder} />
            </div>
            <div className="dr-sort">
              <label htmlFor="dr-sort">{t.sortLabel}</label>
              <select id="dr-sort" name="sort" defaultValue={sort}>
                <option value="name">{t.sortName}</option>
                <option value="publications">{t.sortPublications}</option>
                <option value="citations">{t.sortCitations}</option>
              </select>
            </div>
            <button type="submit" className="dr-submit">
              {messages[locale].portal.searchButton}
            </button>
          </form>
        </div>
      </section>

      <div className="acad-container dr-body">
        <p className="dr-count" role="status">
          {t.results(rows.length)}
        </p>

        {rows.length === 0 ? (
          <p className="dr-empty">{t.empty}</p>
        ) : (
          <ul className="dr-grid">
            {rows.map(({ record, stats }) => (
              <li key={record.id}>
                <Link href={`/${locale}/authors/${record.slug}`} className="dr-card">
                  <div className="dr-card-top">
                    <span className={`dr-avatar ${record.gradient}`} aria-hidden="true">
                      {record.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={record.avatarUrl} alt="" />
                      ) : (
                        initialsOf(record.name)
                      )}
                    </span>
                    <div>
                      <h2 className="dr-name">
                        {record.name}
                        {record.isVerified && <BadgeCheck size={16} aria-label="Verified" />}
                      </h2>
                      {record.title && <p className="dr-role">{record.title}</p>}
                    </div>
                  </div>
                  {record.institution && (
                    <p className="dr-inst">
                      <Building2 size={14} aria-hidden="true" /> {record.institution}
                    </p>
                  )}
                  {record.interests.length > 0 && (
                    <ul className="dr-tags">
                      {record.interests.slice(0, 3).map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  )}
                  <dl className="dr-stats">
                    <div>
                      <dd>{stats.publications}</dd>
                      <dt>{t.publications}</dt>
                    </div>
                    <div>
                      <dd>{stats.citations}</dd>
                      <dt>{t.citations}</dt>
                    </div>
                  </dl>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
