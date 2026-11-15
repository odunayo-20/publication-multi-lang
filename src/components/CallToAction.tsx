import { ArrowRight, CheckCircle2, FileCheck2 } from 'lucide-react'
import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'

type CallToActionProps = {
  locale: Locale
}

export function CallToAction({ locale }: CallToActionProps) {
  const t = messages[locale]

  return (
    <section className="acad-cta-section" aria-label="Author Submission CTA">
      <div className="acad-container">
        <div className="acad-cta-card">
          <div className="acad-cta-glow" aria-hidden="true" />
          <div className="acad-cta-content">
            <span className="acad-cta-tag">For Scholars & Research Groups</span>
            <h2 className="acad-cta-title">{t.portal.cta.title}</h2>
            <p className="acad-cta-subtitle">{t.portal.cta.subtitle}</p>

            {/* Checklist */}
            <div className="acad-cta-checks">
              <div className="acad-cta-check-item">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Double-blind rigorous peer review</span>
              </div>
              <div className="acad-cta-check-item">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Permanent Crossref DOI & indexing</span>
              </div>
              <div className="acad-cta-check-item">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Zero hidden dissemination fees</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="acad-cta-buttons">
              <Link href={`/${locale}/submit`} className="acad-btn-cta-primary">
                <span>{t.portal.cta.submit}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href={`/${locale}/policies/author-guidelines`} className="acad-btn-cta-secondary">
                <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                <span>{t.portal.cta.guidelines}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
