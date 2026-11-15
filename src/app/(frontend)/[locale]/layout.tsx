import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { getCurrentUser } from '@/lib/auth'
import { fallbackSiteName, getSiteSettings, siteUrl } from '@/lib/site'
import './styles.css'

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
  const user = await getCurrentUser().catch(() => null)

  return (
    <html lang={locale}>
      <body>
        <a href="#content" className="skip-link">
          {t.skipToContent}
        </a>
        <Navbar
          locale={locale as Locale}
          siteName={settings?.name}
          userName={user ? user.name?.trim() || user.email : null}
        />
        <main id="content" className="acad-main-content">
          {children}
        </main>
        <Footer locale={locale as Locale} siteName={settings?.name} />
      </body>
    </html>
  )
}
