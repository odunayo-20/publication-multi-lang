import { BookOpen, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'

type Props = {
  locale: Locale
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

/** Split layout shared by sign in, sign up and the password flows. */
export function AuthShell({ locale, title, subtitle, children, footer }: Props) {
  const t = messages[locale].auth
  return (
    <div className="au-page">
      <aside className="au-brand" aria-hidden="false">
        <Link href={`/${locale}`} className="au-brand-logo">
          <span className="au-brand-mark">
            <BookOpen size={20} aria-hidden="true" />
          </span>
          AcadPress
        </Link>
        <div>
          <p className="au-tagline">{t.brandTagline}</p>
          <ul className="au-points">
            {t.brandPoints.map((point) => (
              <li key={point}>
                <CheckCircle2 size={18} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="au-panel">
        <div className="au-card">
          <h1 className="au-title">{title}</h1>
          <p className="au-subtitle">{subtitle}</p>
          {children}
          {footer && <div className="au-footer">{footer}</div>}
        </div>
      </section>
    </div>
  )
}
