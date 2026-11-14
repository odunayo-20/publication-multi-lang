import { BookOpen } from 'lucide-react'
import Link from 'next/link'

import { LanguageSwitch } from '@/components/LanguageSwitch'
import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'

type FooterProps = {
  locale: Locale
  siteName?: string
}

export function Footer({ locale, siteName }: FooterProps) {
  const t = messages[locale]
  const brand = siteName || 'AcadPress'

  return (
    <footer className="acad-footer">
      <div className="acad-container">
        {/* Top 4-Column Directory */}
        <div className="acad-footer-top">
          {/* Col 1: Brand & mission */}
          <div className="acad-footer-col brand-col">
            <Link href={`/${locale}`} className="acad-brand" aria-label={brand}>
              <span className="acad-brand-icon">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </span>
              <span className="acad-brand-text">
                {brand}
                <span className="acad-brand-dot">.</span>
              </span>
            </Link>
            <p className="acad-footer-mission">
              Dedicated to open-access scholarly publishing, advancing international scientific discovery
              through transparent peer review and permanent digital archiving.
            </p>
            <div className="acad-footer-indexer-badges">
              <span className="acad-indexer-badge">Crossref DOI</span>
              <span className="acad-indexer-badge">DOAJ</span>
              <span className="acad-indexer-badge">COPE Member</span>
              <span className="acad-indexer-badge">ORCID</span>
            </div>
          </div>

          {/* Col 2: Discovery */}
          <div className="acad-footer-col">
            <h4 className="acad-footer-heading">Discover Research</h4>
            <ul className="acad-footer-links">
              <li>
                <Link href={`/${locale}/journals`}>Academic Journals</Link>
              </li>
              <li>
                <Link href={`/${locale}/publications`}>All Articles & Papers</Link>
              </li>
              <li>
                <Link href={`/${locale}/publications?type=conference-paper`}>Conference Proceedings</Link>
              </li>
              <li>
                <Link href={`/${locale}/publications?type=preprint`}>Preprint Archives</Link>
              </li>
              <li>
                <Link href={`/${locale}/#about`}>Featured Research Topics</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Authors & Editors */}
          <div className="acad-footer-col">
            <h4 className="acad-footer-heading">For Authors & Editors</h4>
            <ul className="acad-footer-links">
              <li>
                <Link href={`/${locale}/publications`}>Submit Manuscript</Link>
              </li>
              <li>
                <Link href={`/${locale}/#about`}>Author Guidelines & Formatting</Link>
              </li>
              <li>
                <Link href={`/${locale}/#about`}>Peer Review Process</Link>
              </li>
              <li>
                <Link href={`/${locale}/#about`}>Open Access Policy (CC-BY 4.0)</Link>
              </li>
              <li>
                <Link href="/admin">Editorial Management Portal</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional & Ethics */}
          <div className="acad-footer-col">
            <h4 className="acad-footer-heading">Governance & Ethics</h4>
            <ul className="acad-footer-links">
              <li>
                <Link href={`/${locale}/#about`}>Publication Ethics & Integrity</Link>
              </li>
              <li>
                <Link href={`/${locale}/#about`}>Editorial Board</Link>
              </li>
              <li>
                <Link href={`/${locale}/#about`}>Repository Preservation Policy</Link>
              </li>
              <li>
                <Link href={`/${locale}/#about`}>Contact Editorial Office</Link>
              </li>
              <li>
                <Link href={`/${locale}/#about`}>Terms & Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="acad-footer-bottom">
          <div className="acad-footer-copyright">
            © {new Date().getFullYear()} {brand}. All peer-reviewed content is published under{' '}
            <span className="acad-inline-cc">Creative Commons Attribution 4.0 (CC BY 4.0)</span>.
          </div>
          <div className="acad-footer-bottom-actions">
            <LanguageSwitch locale={locale} label={t.language} />
          </div>
        </div>
      </div>
    </footer>
  )
}
