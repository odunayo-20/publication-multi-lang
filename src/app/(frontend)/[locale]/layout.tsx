import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { LanguageSwitch } from '@/components/LanguageSwitch'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { fallbackSiteName, getSiteSettings, siteUrl } from '@/lib/site'
import './styles.css'

const serif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-serif-loaded',
  display: 'swap',
})
const sans = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans-loaded',
  display: 'swap',
})
const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono-loaded',
  display: 'swap',
})

// Settings and content come from the database on every request for now.
export const dynamic = 'force-dynamic'

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

type Args = { children: React.ReactNode; params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const settings = isLocale(locale) ? await getSiteSettings(locale) : null
  const name = settings?.name || fallbackSiteName
  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: { default: name, template: `%s | ${name}` },
    description: settings?.summary ?? undefined,
  }
}

export default async function LocaleLayout({ children, params }: Args) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = messages[locale as Locale]
  const settings = await getSiteSettings(locale)

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#content" className="skip-link">
          {t.skipToContent}
        </a>
        <header className="site-header">
          <Link href={`/${locale}`} className="brand">
            {settings?.name || fallbackSiteName}
          </Link>
          <nav aria-label="Main" className="main-nav">
            <Link href={`/${locale}/publications`}>{t.nav.publications}</Link>
          </nav>
          <LanguageSwitch locale={locale} label={t.language} />
        </header>
        <main id="content" className="container">
          {children}
        </main>
      </body>
    </html>
  )
}
