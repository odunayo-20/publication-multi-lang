'use client'

import { Eye, Quote, Search } from 'lucide-react'
import Link from 'next/link'
import { useId, useMemo, useState } from 'react'

import type { AuthorWork } from '@/lib/authors'

type Props = {
  locale: string
  works: AuthorWork[]
  typeLabels: Record<string, string>
  labels: {
    search: string
    sortBy: string
    sortNewest: string
    sortCited: string
    sortTitle: string
    allYears: string
    year: string
    noMatches: string
    reset: string
    views: string
    citations: string
    with: string
    /** Template containing {shown} and {total}. */
    showing: string
  }
}

type Sort = 'newest' | 'cited' | 'title'

export function AuthorWorks({ locale, works, typeLabels, labels }: Props) {
  const [query, setQuery] = useState('')
  const [year, setYear] = useState<number | 'all'>('all')
  const [sort, setSort] = useState<Sort>('newest')
  const searchId = useId()
  const sortId = useId()

  const years = useMemo(() => [...new Set(works.map((w) => w.year))].sort((a, b) => b - a), [works])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = works.filter(
      (w) =>
        (year === 'all' || w.year === year) &&
        (!q || [w.title, w.venue, ...w.keywords, ...w.coAuthors].some((s) => s.toLowerCase().includes(q))),
    )
    return list.sort((a, b) => {
      if (sort === 'cited') return b.citations - a.citations || b.year - a.year
      if (sort === 'title') return a.title.localeCompare(b.title, locale)
      return b.year - a.year || b.citations - a.citations
    })
  }, [works, query, year, sort, locale])

  const filtered = query !== '' || year !== 'all'
  const reset = () => {
    setQuery('')
    setYear('all')
  }

  return (
    <div>
      <div className="ap-toolbar">
        <div className="ap-search">
          <label htmlFor={searchId} className="ap-sr-only">
            {labels.search}
          </label>
          <Search size={16} aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            value={query}
            placeholder={labels.search}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="ap-sort">
          <label htmlFor={sortId}>{labels.sortBy}</label>
          <select id={sortId} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="newest">{labels.sortNewest}</option>
            <option value="cited">{labels.sortCited}</option>
            <option value="title">{labels.sortTitle}</option>
          </select>
        </div>
      </div>

      {years.length > 1 && (
        <div className="ap-chips" role="group" aria-label={labels.year}>
          {(['all', ...years] as Array<number | 'all'>).map((y) => (
            <button
              key={y}
              type="button"
              className="ap-chip"
              aria-pressed={year === y}
              onClick={() => setYear(y)}
            >
              {y === 'all' ? labels.allYears : y}
            </button>
          ))}
        </div>
      )}

      <p className="ap-count" role="status" aria-live="polite">
        {labels.showing.replace('{shown}', String(visible.length)).replace('{total}', String(works.length))}
      </p>

      {visible.length === 0 ? (
        <div className="ap-empty">
          <p>{labels.noMatches}</p>
          {filtered && (
            <button type="button" className="ap-btn ap-btn-ghost" onClick={reset}>
              {labels.reset}
            </button>
          )}
        </div>
      ) : (
        <ul className="ap-works">
          {visible.map((w) => (
            <li key={w.slug} className="ap-work">
              <Link
                href={`/${locale}/publications/${w.slug}`}
                className={`ap-work-cover ${w.gradient}`}
                aria-hidden="true"
                tabIndex={-1}
              />
              <div className="ap-work-body">
                <div className="ap-work-meta">
                  <span className="ap-tag">{typeLabels[w.type] ?? w.type}</span>
                  <span>{w.year}</span>
                </div>
                <h3 className="ap-work-title">
                  <Link href={`/${locale}/publications/${w.slug}`}>{w.title}</Link>
                </h3>
                <p className="ap-work-venue">{w.venue}</p>
                {w.coAuthors.length > 0 && (
                  <p className="ap-work-coauthors">
                    {labels.with} {w.coAuthors.join(', ')}
                  </p>
                )}
                <div className="ap-work-stats">
                  <span>
                    <Eye size={14} aria-hidden="true" /> {w.views} {labels.views}
                  </span>
                  <span>
                    <Quote size={14} aria-hidden="true" /> {w.citations} {labels.citations}
                  </span>
                  {w.doi && <span className="ap-doi">DOI {w.doi}</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
