import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { locales, type Locale } from '@/i18n/config'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale; slug: string }> }

const getArticle = async (locale: Locale, slug: string) => {
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
  const article = await getArticle(locale, slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/articles/${slug}`])),
    },
  }
}

export default async function ArticlePage({ params }: Args) {
  const { locale, slug } = await params
  const article = await getArticle(locale, slug)
  if (!article) notFound()

  return (
    <article>
      <h1>{article.title}</h1>
      {article.publishedAt && (
        <p className="muted">
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString(locale, { dateStyle: 'long' })}
          </time>
        </p>
      )}
      {article.content && <RichText data={article.content} />}
    </article>
  )
}
