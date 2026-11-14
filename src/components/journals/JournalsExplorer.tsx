'use client'

import {
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Award,
  Clock,
  ExternalLink,
  X,
  FileCheck2,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { academicJournals, journalCategories, type AcademicJournal } from '@/data/journals'
import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'

type JournalsExplorerProps = {
  locale: Locale
  initialCategory?: string
  initialQuery?: string
  dbVenues?: string[]
}

export function JournalsExplorer({
  locale,
  initialCategory = 'all',
  initialQuery = '',
}: JournalsExplorerProps) {
  const t = messages[locale]
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery)
  const [sortBy, setSortBy] = useState<'articles' | 'alpha' | 'impact'>('articles')

  // Filtered & sorted journals
  const filteredJournals = useMemo(() => {
    let result = academicJournals.filter((j) => {
      // Category filter
      if (selectedCategory !== 'all' && j.categoryId !== selectedCategory) {
        return false
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = j.name.toLowerCase().includes(q)
        const matchesScope = j.scope.toLowerCase().includes(q)
        const matchesCategory = j.categoryName.toLowerCase().includes(q)
        const matchesInitials = j.initials.toLowerCase().includes(q)
        const matchesIssn = j.issn.includes(q) || j.eIssn.includes(q)
        return matchesName || matchesScope || matchesCategory || matchesInitials || matchesIssn
      }
      return true
    })

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'articles') return b.articlesCount - a.articlesCount
      if (sortBy === 'alpha') return a.name.localeCompare(b.name)
      if (sortBy === 'impact') return b.citeScore - a.citeScore
      return 0
    })

    return result
  }, [selectedCategory, searchQuery, sortBy])

  const activeCategoryObj = journalCategories.find((c) => c.id === selectedCategory)

  const clearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
  }

  return (
    <div className="acad-journals-page-layout">
      {/* Search Input Bar (Matching Screen 2 of the reference) */}
      <div className="acad-journals-search-container">
        <div className="acad-journals-search-box">
          <Search className="acad-journals-search-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.journalsPage.searchPlaceholder}
            className="acad-journals-search-input"
            aria-label="Search journals"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="acad-journals-search-clear"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Discovery Grid (Matching Screen 2) */}
      <div className="acad-journals-main-grid">
        {/* Left Sidebar: Categories */}
        <aside className="acad-categories-sidebar" aria-label="Journal Categories">
          <div className="acad-sidebar-sticky">
            <div className="acad-sidebar-header">
              <Filter className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <h3 className="acad-sidebar-title">{t.journalsPage.categories}</h3>
            </div>

            <nav className="acad-categories-nav">
              {journalCategories.map((cat) => {
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`acad-category-item ${isActive ? 'is-active' : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span className="acad-category-name">{cat.name}</span>
                    <span className={`acad-category-badge ${isActive ? 'is-active' : ''}`}>{cat.count}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Right Content Area: Journal Listings */}
        <section className="acad-journals-content-area" aria-label="Journal Listings">
          {/* Section Toolbar */}
          <div className="acad-journals-toolbar">
            <div className="acad-toolbar-left">
              <h2 className="acad-toolbar-title">
                {selectedCategory === 'all' ? t.journalsPage.featuredJournals : activeCategoryObj?.name}
              </h2>
              <span className="acad-toolbar-count">
                {t.journalsPage.showingCount(filteredJournals.length, academicJournals.length)}
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="acad-toolbar-sort">
              <label htmlFor="journal-sort-select" className="acad-sort-label">
                <ArrowUpDown className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                {t.journalsPage.sortBy}
              </label>
              <select
                id="journal-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'articles' | 'alpha' | 'impact')}
                className="acad-sort-select"
              >
                <option value="articles">{t.journalsPage.sortArticles}</option>
                <option value="impact">{t.journalsPage.sortImpact}</option>
                <option value="alpha">{t.journalsPage.sortAlpha}</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory !== 'all' || searchQuery.trim()) && (
            <div className="acad-active-filters-bar">
              <span className="acad-active-filters-label">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="acad-filter-chip">
                  <span>Category: {activeCategoryObj?.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    aria-label="Remove category filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery.trim() && (
                <span className="acad-filter-chip">
                  <span>Query: &ldquo;{searchQuery}&rdquo;</span>
                  <button type="button" onClick={() => setSearchQuery('')} aria-label="Remove query filter">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button type="button" onClick={clearFilters} className="acad-clear-filters-btn">
                {t.journalsPage.clearFilters}
              </button>
            </div>
          )}

          {/* Journal Cards Stack (Matching Screen 2) */}
          {filteredJournals.length === 0 ? (
            <div className="acad-no-results-card">
              <BookOpen className="w-12 h-12 text-slate-400 mb-3" aria-hidden="true" />
              <h3>{t.journalsPage.noResults}</h3>
              <p>Try refining your search keyword or selecting a different category.</p>
              <button type="button" onClick={clearFilters} className="acad-btn-secondary mt-4">
                {t.journalsPage.clearFilters}
              </button>
            </div>
          ) : (
            <div className="acad-journals-listing-stack">
              {filteredJournals.map((journal: AcademicJournal) => (
                <article key={journal.id} className="acad-journal-row-card">
                  {/* Circular Initials Badge */}
                  <div className={`acad-journal-avatar-badge ${journal.badgeColor}`} aria-hidden="true">
                    <span>{journal.initials}</span>
                  </div>

                  {/* Main Journal Info */}
                  <div className="acad-journal-main-info">
                    <div className="acad-journal-headline">
                      <h3 className="acad-journal-title">
                        <Link href={`/${locale}/journals/${journal.slug}`}>{journal.name}</Link>
                      </h3>
                      {journal.isFeatured && <span className="acad-featured-tag">Flagship</span>}
                    </div>

                    <p className="acad-journal-description">{journal.scope}</p>

                    {/* Metadata Pill Strip */}
                    <div className="acad-journal-tags-strip">
                      <span className="acad-pill-meta">
                        <strong>ISSN:</strong> {journal.issn}
                      </span>
                      <span className="acad-pill-meta cite-score-pill">
                        <Award className="w-3.5 h-3.5 text-blue-500 mr-1" aria-hidden="true" />
                        <strong>CiteScore:</strong> {journal.citeScore}
                      </span>
                      <span className="acad-pill-meta">
                        <Clock className="w-3.5 h-3.5 text-slate-400 mr-1" aria-hidden="true" />
                        Review: {journal.reviewTime}
                      </span>
                      <span className="acad-pill-meta open-access-tag">{t.journalsPage.openAccess}</span>
                    </div>

                    {/* Indexing Badges */}
                    <div className="acad-journal-indexers">
                      <span className="acad-index-label">Indexed in:</span>
                      {journal.indexing.map((idx) => (
                        <span key={idx} className="acad-index-chip">
                          {idx}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Actions & Metrics */}
                  <div className="acad-journal-side-action">
                    <div className="acad-journal-articles-badge">
                      <span className="acad-articles-number">{journal.articlesCount}</span>
                      <span className="acad-articles-label">
                        {t.journalsPage.articlesCount(journal.articlesCount)}
                      </span>
                    </div>

                    <div className="acad-journal-btn-group">
                      <Link href={`/${locale}/journals/${journal.slug}`} className="acad-btn-view-journal">
                        <span>{t.journalsPage.viewJournal}</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                      </Link>
                      <Link href={`/${locale}/publications`} className="acad-btn-submit-journal">
                        <FileCheck2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                        <span>{t.journalsPage.submitToJournal}</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
