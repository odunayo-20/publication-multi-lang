import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'

type JournalSpotlightProps = {
  locale: Locale
}

export const flagshipJournals = [
  {
    initials: 'ICT',
    name: 'International Journal of Computer Science and Applications',
    scope:
      'Publishes high-quality research in computer science, software engineering, and artificial intelligence.',
    articles: 42,
    badgeColor: 'badge-blue',
    slug: 'computer-science',
  },
  {
    initials: 'JE',
    name: 'Journal of Education and Practice',
    scope: 'Focuses on innovative teaching methods, educational policy, and digital learning technologies.',
    articles: 36,
    badgeColor: 'badge-navy',
    slug: 'education',
  },
  {
    initials: 'JH',
    name: 'Journal of Health and Medical Sciences',
    scope: 'Covers advances in clinical medicine, epidemiology, public health, and biotechnology.',
    articles: 28,
    badgeColor: 'badge-teal',
    slug: 'health-sciences',
  },
  {
    initials: 'IE',
    name: 'International Journal of Engineering Research',
    scope: 'Peer-reviewed research in mechanical, electrical, civil, and hydrological engineering systems.',
    articles: 31,
    badgeColor: 'badge-cyan',
    slug: 'engineering',
  },
  {
    initials: 'JS',
    name: 'Journal of Social Sciences and Humanities',
    scope: 'Explores human behaviour, culture, policy, society, and international development.',
    articles: 25,
    badgeColor: 'badge-indigo',
    slug: 'social-sciences',
  },
]

export function JournalSpotlight({ locale }: JournalSpotlightProps) {
  const t = messages[locale]

  return (
    <section className="acad-journals-section" aria-labelledby="flagship-journals-heading">
      <div className="acad-container">
        <div className="acad-section-header">
          <div>
            <span className="acad-section-eyebrow">Academic Press Collections</span>
            <h2 id="flagship-journals-heading" className="acad-section-title">
              {t.portal.journals.title}
            </h2>
            <p className="acad-section-subtitle">{t.portal.journals.subtitle}</p>
          </div>
          <Link href={`/${locale}/journals`} className="acad-view-all-link">
            <span>{t.portal.journals.viewAll}</span>
          </Link>
        </div>

        <div className="acad-journals-list">
          {flagshipJournals.map((j) => (
            <div key={j.initials} className="acad-journal-card">
              {/* Journal Initials Icon Badge */}
              <div className={`acad-journal-badge ${j.badgeColor}`} aria-hidden="true">
                <span>{j.initials}</span>
              </div>

              {/* Journal Information */}
              <div className="acad-journal-info">
                <h3 className="acad-journal-name">
                  <Link href={`/${locale}/search?q=${encodeURIComponent(j.name)}`}>{j.name}</Link>
                </h3>
                <p className="acad-journal-scope">{j.scope}</p>
              </div>

              {/* Action and stats */}
              <div className="acad-journal-meta">
                <span className="acad-journal-count">
                  <strong>{j.articles}</strong> {t.portal.journals.articlesCount}
                </span>
                <Link
                  href={`/${locale}/search?q=${encodeURIComponent(j.name)}`}
                  className="acad-btn-outline-sm"
                >
                  <span>{t.portal.journals.viewJournal}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
