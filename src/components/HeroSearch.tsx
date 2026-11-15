'use client'

import { BookCheck, Building2, FileText, Search, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'

type HeroSearchProps = {
  locale: Locale
  stats?: {
    articles?: number
    journals?: number
    authors?: number
    institutions?: number
  }
}

export function HeroSearch({ locale, stats }: HeroSearchProps) {
  const t = messages[locale]
  const [scope, setScope] = useState('all')

  const totalArticles = stats?.articles && stats.articles > 0 ? stats.articles.toLocaleString() : '12,480+'
  const totalJournals = stats?.journals && stats.journals > 0 ? stats.journals.toLocaleString() : '320'
  const totalAuthors = stats?.authors && stats.authors > 0 ? stats.authors.toLocaleString() : '8,660'
  const totalInstitutions =
    stats?.institutions && stats.institutions > 0 ? stats.institutions.toLocaleString() : '150+'

  const trendingTags = [
    { label: '#MachineLearning', q: 'machine learning' },
    { label: '#SmartCities', q: 'smart cities' },
    { label: '#FlashFloods', q: 'flood' },
    { label: '#RenewableEnergy', q: 'energy' },
    { label: '#DigitalEducation', q: 'education' },
  ]

  return (
    <section className="acad-hero-section">
      {/* Ambient background decoration */}
      <div className="acad-hero-ambient" aria-hidden="true">
        <div className="acad-ambient-glow-1" />
        <div className="acad-ambient-glow-2" />
        <div className="acad-hero-grid-pattern" />
      </div>

      <div className="acad-hero-container">
        {/* Top scholarly badge */}
        <div className="acad-hero-badge">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.portal.badge}</span>
        </div>

        {/* Main Title */}
        <h1 className="acad-hero-title">
          <span>{t.portal.titlePrefix} </span>
          <span className="acad-hero-title-highlight">{t.portal.titleHighlight}</span>
        </h1>

        {/* Subtitle */}
        <p className="acad-hero-subtitle">{t.portal.subtitle}</p>

        {/* Central Search Form */}
        <div className="acad-search-box-wrapper">
          <form action={`/${locale}/search`} method="GET" className="acad-search-box">
            {/* Scope select */}
            <div className="acad-search-scope">
              <select
                name="scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                aria-label="Search scope"
                className="acad-search-select"
              >
                <option value="all">All Disciplines</option>
                <option value="articles">Articles</option>
                <option value="journals">Journals</option>
                <option value="authors">Authors</option>
              </select>
            </div>

            <div className="acad-search-divider" aria-hidden="true" />

            {/* Input field */}
            <div className="acad-search-input-field">
              <Search className="acad-search-field-icon" aria-hidden="true" />
              <input
                type="search"
                name="q"
                placeholder={t.portal.searchPlaceholder}
                className="acad-search-input"
                autoComplete="off"
              />
            </div>

            {/* Action button */}
            <button type="submit" className="acad-search-submit-btn">
              <Search className="w-4 h-4 mr-1.5" aria-hidden="true" />
              <span>{t.portal.searchButton}</span>
            </button>
          </form>

          {/* Trending tags */}
          <div className="acad-trending-row">
            <span className="acad-trending-label">{t.portal.trending}</span>
            <div className="acad-trending-tags">
              {trendingTags.map((tag) => (
                <Link
                  key={tag.label}
                  href={`/${locale}/search?q=${encodeURIComponent(tag.q)}`}
                  className="acad-trending-pill"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Strip */}
        <div className="acad-stats-strip" aria-label="Platform Statistics">
          <div className="acad-stat-card">
            <div className="acad-stat-icon-wrapper">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="acad-stat-info">
              <span className="acad-stat-number">{totalArticles}</span>
              <span className="acad-stat-label">{t.portal.stats.articles}</span>
            </div>
          </div>

          <div className="acad-stat-divider" aria-hidden="true" />

          <div className="acad-stat-card">
            <div className="acad-stat-icon-wrapper">
              <BookCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="acad-stat-info">
              <span className="acad-stat-number">{totalJournals}</span>
              <span className="acad-stat-label">{t.portal.stats.journals}</span>
            </div>
          </div>

          <div className="acad-stat-divider" aria-hidden="true" />

          <div className="acad-stat-card">
            <div className="acad-stat-icon-wrapper">
              <Users className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="acad-stat-info">
              <span className="acad-stat-number">{totalAuthors}</span>
              <span className="acad-stat-label">{t.portal.stats.authors}</span>
            </div>
          </div>

          <div className="acad-stat-divider" aria-hidden="true" />

          <div className="acad-stat-card">
            <div className="acad-stat-icon-wrapper">
              <Building2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="acad-stat-info">
              <span className="acad-stat-number">{totalInstitutions}</span>
              <span className="acad-stat-label">{t.portal.stats.institutions}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
