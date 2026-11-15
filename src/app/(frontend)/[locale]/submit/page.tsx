import { ArrowRight, Check } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { policies } from '@/content/policies'
import { fill, siteUi } from '@/content/site-ui'
import { locales, type Locale } from '@/i18n/config'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = siteUi[locale].submit
  return {
    title: t.metaTitle,
    description: t.lead,
    alternates: {
      canonical: `/${locale}/submit`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/submit`])),
    },
  }
}

export default async function SubmitPage({ params }: Args) {
  const { locale } = await params
  const t = siteUi[locale].submit
  const user = await getCurrentUser().catch(() => null)
  const formPath = `/${locale}/account/submissions/new`
  const pol = policies[locale]

  return (
    <div className="sp-page">
      <header className="sp-hero">
        <div className="acad-container">
          <p className="sp-eyebrow">{t.eyebrow}</p>
          <h1 className="sp-title">{t.title}</h1>
          <p className="sp-lead">{t.lead}</p>

          <div className="sp-hero-actions">
            {user ? (
              <>
                <Link href={formPath} className="sp-btn sp-btn-primary">
                  {t.startSignedIn} <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <span className="sp-hint">{fill(t.signedInAs, { name: user.name?.trim() || user.email })}</span>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/sign-in?next=${encodeURIComponent(formPath)}`}
                  className="sp-btn sp-btn-primary"
                >
                  {t.signIn} <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href={`/${locale}/sign-up?next=${encodeURIComponent(formPath)}`}
                  className="sp-btn sp-btn-ghost"
                >
                  {t.createAccount}
                </Link>
                <span className="sp-hint">{t.needAccount}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="acad-container sp-stack">
        <section className="sp-block" aria-labelledby="steps">
          <h2 id="steps">{t.stepsTitle}</h2>
          <ol className="sp-steps sp-steps-4">
            {t.steps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="sp-two">
          <section className="sp-card sp-card-lg" aria-labelledby="checklist">
            <h2 id="checklist">{t.checklistTitle}</h2>
            <ul className="sp-check">
              {t.checklist.map((item) => (
                <li key={item}>
                  <Check size={16} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="sp-card sp-card-lg" aria-labelledby="facts">
            <h2 id="facts">{t.factsTitle}</h2>
            <dl className="sp-facts">
              {t.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section className="sp-block" aria-labelledby="read">
          <h2 id="read">{t.readMore}</h2>
          <ul className="sp-links">
            {(['author-guidelines', 'peer-review', 'open-access', 'publication-ethics'] as const).map((slug) => (
              <li key={slug}>
                <Link href={`/${locale}/policies/${slug}`}>
                  {pol[slug].title} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
