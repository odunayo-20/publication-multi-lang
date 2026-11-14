import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { isLocale, localeLabels, locales } from '@/i18n/config'
import './styles.css'

export const metadata: Metadata = {
  title: { default: 'Publication', template: '%s | Publication' },
}

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

type Args = { children: React.ReactNode; params: Promise<{ locale: string }> }

export default async function LocaleLayout({ children, params }: Args) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={locale}>
      <body>
        <header className="site-header">
          <Link href={`/${locale}`} className="brand">
            Publication
          </Link>
          <nav aria-label="Language">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                hrefLang={l}
                lang={l}
                aria-current={l === locale ? 'true' : undefined}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  )
}
