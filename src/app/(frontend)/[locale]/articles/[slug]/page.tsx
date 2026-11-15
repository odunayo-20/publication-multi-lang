import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { siteUi } from '@/content/site-ui'
import { locales, type Locale } from '@/i18n/config'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale; slug: string }> }

const getArticle = async (slug: string, locale: Locale) => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await getArticle(slug, locale).catch(() => null)
  if (!article) return {}
  return {
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.excerpt || undefined,
    alternates: {
      canonical: `/${locale}/articles/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/articles/${slug}`])),
    },
  }
}

export default async function ArticlePage({ params }: Args) {
  const { locale, slug } = await params
  const t = siteUi[locale].articles
  const article = await getArticle(slug, locale).catch(() => null)
  if (!article) notFound()

  const date = article.publishedAt
    ? new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(article.publishedAt))
    : null
  const authors = (article.authors ?? []).filter((a): a is Exclude<typeof a, number> => typeof a === 'object')
  const tags = (article.tags ?? []).filter((x): x is Exclude<typeof x, number> => typeof x === 'object')

  return (
    <div className="sp-page">
      <header className="sp-hero">
        <div className="acad-container">
          <Link href={`/${locale}/articles`} className="ar-back">
            <ArrowLeft size={14} aria-hidden="true" /> {t.back}
          </Link>
          <h1 className="sp-title">{article.title}</h1>
          {article.excerpt && <p className="sp-lead">{article.excerpt}</p>}
          <p className="ar-meta">
            {authors.length > 0 && (
              <span>
                {t.by}{' '}
                {authors.map((a, i) => (
                  <span key={a.id}>
                    {i > 0 && ', '}
                    <Link href={`/${locale}/authors/${a.slug}`}>{a.name}</Link>
                  </span>
                ))}
              </span>
            )}
            {date && <time dateTime={article.publishedAt ?? undefined}>{date}</time>}
          </p>
        </div>
      </header>

      <div className="acad-container ar-body">
        {article.content && (
          <div className="sp-richtext">
            <RichText data={article.content} />
          </div>
        )}
        {tags.length > 0 && (
          <ul className="ar-tags" aria-label={t.tags}>
            {tags.map((tag) => (
              <li key={tag.id}>{(tag as { name?: string }).name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
