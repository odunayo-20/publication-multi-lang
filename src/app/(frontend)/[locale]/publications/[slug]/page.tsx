import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import { Authors, doiUrl, pdfUrlOf, typeLabel } from '@/components/Publication'
import { locales, type Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { bibtex, scholarMeta, venueDetail } from '@/lib/citation'
import { siteUrl } from '@/lib/site'
import { jsonLdScript } from '@/lib/structured-data'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale; slug: string }> }

const getPublication = cache(async (locale: Locale, slug: string) => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'publications',
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return docs[0] ?? null
})

const SCHOLARLY = ['journal-article', 'bulletin-article', 'conference-paper', 'proceedings-paper', 'preprint']

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const pub = await getPublication(locale, slug)
  if (!pub) return {}

  const path = `/${locale}/publications/${slug}`
  const description = pub.seo?.metaDescription || pub.abstract?.slice(0, 160) || pub.venue || undefined
  return {
    title: pub.seo?.metaTitle || pub.title,
    description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/publications/${slug}`])),
    },
    other: scholarMeta(pub, { pageUrl: `${siteUrl}${path}`, pdfUrl: pdfUrlOf(pub) }),
  }
}

export default async function PublicationPage({ params }: Args) {
  const { locale, slug } = await params
  const pub = await getPublication(locale, slug)
  if (!pub) notFound()

  const t = messages[locale].publications
  const pdf = pdfUrlOf(pub)
  const detail = venueDetail(pub)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': SCHOLARLY.includes(pub.type)
      ? 'ScholarlyArticle'
      : pub.type === 'book-chapter'
        ? 'Chapter'
        : 'CreativeWork',
    name: pub.title,
    author: pub.authors.map((a) => ({ '@type': 'Person', name: a.name })),
    datePublished: String(pub.year),
    isPartOf: pub.venue ? { '@type': 'Periodical', name: pub.venue } : undefined,
    identifier: pub.doi ? doiUrl(pub.doi) : undefined,
    sameAs: pub.doi ? doiUrl(pub.doi) : pub.url || undefined,
    url: `${siteUrl}/${locale}/publications/${slug}`,
    abstract: pub.abstract || undefined,
  }

  return (
    <article className="pub-detail">
      <Link href={`/${locale}/publications`} className="back-link">
        ← {t.back}
      </Link>
      <h1>{pub.title}</h1>
      <p className="pub-authors">
        <Authors authors={pub.authors} />
      </p>

      <dl>
        <dt>{t.type}</dt>
        <dd>{typeLabel(locale, pub.type)}</dd>
        {pub.venue && (
          <>
            <dt>{t.publishedIn}</dt>
            <dd>
              <em>{pub.venue}</em>
              {detail && `, ${detail}`}
            </dd>
          </>
        )}
        <dt>{t.year}</dt>
        <dd>{pub.year}</dd>
        {pub.doi && (
          <>
            <dt>{t.doi}</dt>
            <dd>
              <a href={doiUrl(pub.doi)} className="doi">
                {pub.doi}
              </a>
            </dd>
          </>
        )}
        {pub.url && pub.url !== (pub.doi && doiUrl(pub.doi)) && (
          <>
            <dt>{t.link}</dt>
            <dd>
              <a href={pub.url}>{pub.url}</a>
            </dd>
          </>
        )}
        {pdf && (
          <>
            <dt>{t.pdf}</dt>
            <dd>
              <a href={pdf}>{t.pdf}</a>
            </dd>
          </>
        )}
      </dl>

      {pub.abstract && (
        <section>
          <h2>{t.abstract}</h2>
          <p>{pub.abstract}</p>
        </section>
      )}

      <details className="cite">
        <summary>{t.cite} (BibTeX)</summary>
        <p className="muted">{t.citeHint}</p>
        <pre>{bibtex(pub)}</pre>
      </details>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
    </article>
  )
}
