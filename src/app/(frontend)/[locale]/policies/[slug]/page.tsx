import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowRight, Mail } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { isPolicySlug, policies, policySlugs, type PolicySlug } from '@/content/policies'
import { siteUi } from '@/content/site-ui'
import { locales, type Locale } from '@/i18n/config'
import { getSiteSettings } from '@/lib/site'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isPolicySlug(slug)) return {}
  const policy = policies[locale][slug]
  return {
    title: policy.title,
    description: policy.summary,
    alternates: {
      canonical: `/${locale}/policies/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/policies/${slug}`])),
    },
  }
}

/** An editor-published page with the same slug replaces the built-in text. */
const getOverride = async (slug: PolicySlug, locale: Locale) => {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'pages',
      locale,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: false,
    })
    const doc = docs[0]
    return doc?.content ? doc : null
  } catch {
    return null
  }
}

const profileLabel: Record<string, string> = {
  scholar: 'Google Scholar',
  orcid: 'ORCID',
  researchgate: 'ResearchGate',
  institute: 'Institute',
  linkedin: 'LinkedIn',
  other: 'Website',
}

export default async function PolicyPage({ params }: Args) {
  const { locale, slug } = await params
  if (!isPolicySlug(slug)) notFound()

  const ui = siteUi[locale].policy
  const policy = policies[locale][slug]
  const [override, settings] = await Promise.all([
    getOverride(slug, locale),
    slug === 'contact' ? getSiteSettings(locale) : Promise.resolve(null),
  ])

  const email = settings?.contactEmail
  const profiles = (settings?.profiles ?? []).filter((p) => /^https?:\/\//i.test(p.url))

  return (
    <div className="sp-page">
      <header className="sp-hero">
        <div className="acad-container">
          <p className="sp-eyebrow">{ui.eyebrow}</p>
          <h1 className="sp-title">{override?.title ?? policy.title}</h1>
          <p className="sp-lead">{policy.summary}</p>
        </div>
      </header>

      <div className="acad-container sp-layout">
        <nav className="sp-nav" aria-label={ui.onThisPage}>
          <h2>{ui.onThisPage}</h2>
          <ul>
            {policySlugs.map((s) => (
              <li key={s}>
                <Link
                  href={`/${locale}/policies/${s}`}
                  aria-current={s === slug ? 'page' : undefined}
                >
                  {policies[locale][s].title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="sp-article">
          {override?.content ? (
            <div className="sp-richtext">
              <RichText data={override.content} />
            </div>
          ) : (
            policy.sections.map((section) => (
              <section key={section.heading} className="sp-section">
                <h2>{section.heading}</h2>
                {section.body?.map((p) => <p key={p}>{p}</p>)}
                {section.list && (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))
          )}

          {slug === 'contact' && (
            <section className="sp-contact" aria-label={policy.title}>
              <div>
                <h2>{ui.emailLabel}</h2>
                {email ? (
                  <a href={`mailto:${email}`} className="sp-mail">
                    <Mail size={16} aria-hidden="true" /> {email}
                  </a>
                ) : (
                  <p>{ui.emailUnavailable}</p>
                )}
              </div>
              {profiles.length > 0 && (
                <div>
                  <h2>{ui.profilesLabel}</h2>
                  <ul>
                    {profiles.map((p) => (
                      <li key={p.url}>
                        <a href={p.url} rel="noopener noreferrer">
                          {profileLabel[p.platform] ?? p.platform}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {(slug === 'author-guidelines' || slug === 'peer-review') && (
            <Link href={`/${locale}/submit`} className="sp-cta">
              {ui.submitCta} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}

          {!override && slug === 'terms-privacy' && <p className="sp-note">{ui.reviewNote}</p>}
        </article>
      </div>
    </div>
  )
}
