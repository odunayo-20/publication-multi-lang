import { Binary, GraduationCap, HeartPulse, Cpu, Globe2, Briefcase, Leaf, Palette, Sigma } from 'lucide-react'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'

type SubjectTaxonomyProps = {
  locale: Locale
}

export const disciplinesData = [
  { id: 'cs', name: 'Computer Science', count: 48, icon: Binary, q: 'computer science' },
  { id: 'edu', name: 'Education', count: 42, icon: GraduationCap, q: 'education' },
  { id: 'health', name: 'Health Sciences', count: 37, icon: HeartPulse, q: 'health' },
  { id: 'eng', name: 'Engineering', count: 36, icon: Cpu, q: 'engineering' },
  { id: 'social', name: 'Social Sciences', count: 28, icon: Globe2, q: 'social' },
  { id: 'biz', name: 'Business & Management', count: 24, icon: Briefcase, q: 'management' },
  { id: 'env', name: 'Environmental Science', count: 22, icon: Leaf, q: 'environmental' },
  { id: 'arts', name: 'Arts & Humanities', count: 19, icon: Palette, q: 'humanities' },
  { id: 'math', name: 'Mathematics', count: 10, icon: Sigma, q: 'mathematics' },
]

export function SubjectTaxonomy({ locale }: SubjectTaxonomyProps) {
  return (
    <section className="acad-taxonomy-section" aria-label="Academic Disciplines">
      <div className="acad-container">
        <div className="acad-taxonomy-header">
          <span className="acad-section-eyebrow">Explore by Subject</span>
          <h2 className="acad-taxonomy-title">Browse Scholarly Disciplines</h2>
        </div>

        <div className="acad-taxonomy-grid">
          {disciplinesData.map((d) => {
            const Icon = d.icon
            return (
              <Link
                key={d.id}
                href={`/${locale}/publications?q=${encodeURIComponent(d.q)}`}
                className="acad-taxonomy-chip"
              >
                <div className="acad-taxonomy-icon">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="acad-taxonomy-details">
                  <span className="acad-taxonomy-name">{d.name}</span>
                  <span className="acad-taxonomy-count">{d.count} papers</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
