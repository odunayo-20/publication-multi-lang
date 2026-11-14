import { Globe, ShieldCheck, Unlock } from 'lucide-react'

import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'

type TrustPillarsProps = {
  locale: Locale
}

export function TrustPillars({ locale }: TrustPillarsProps) {
  const t = messages[locale]

  return (
    <section className="acad-trust-section" aria-label="Open Access and Trust">
      <div className="acad-container">
        <div className="acad-trust-grid">
          {/* Card 1: Open Access */}
          <div className="acad-trust-card">
            <div className="acad-trust-icon-box trust-icon-blue">
              <Unlock className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="acad-trust-content">
              <h3 className="acad-trust-title">{t.portal.trust.openAccess.title}</h3>
              <p className="acad-trust-desc">{t.portal.trust.openAccess.desc}</p>
            </div>
          </div>

          {/* Card 2: Trusted Sources */}
          <div className="acad-trust-card">
            <div className="acad-trust-icon-box trust-icon-navy">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="acad-trust-content">
              <h3 className="acad-trust-title">{t.portal.trust.trustedSources.title}</h3>
              <p className="acad-trust-desc">{t.portal.trust.trustedSources.desc}</p>
            </div>
          </div>

          {/* Card 3: Global Reach */}
          <div className="acad-trust-card">
            <div className="acad-trust-icon-box trust-icon-teal">
              <Globe className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="acad-trust-content">
              <h3 className="acad-trust-title">{t.portal.trust.globalReach.title}</h3>
              <p className="acad-trust-desc">{t.portal.trust.globalReach.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
