'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { localeLabels, locales, type Locale } from '@/i18n/config'

/** Swaps the leading locale segment so the visitor stays on the equivalent page. */
export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || `/${locale}`
  const rest = pathname.replace(/^\/[^/]+/, '')

  return (
    <nav aria-label={label} className="lang-switch">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
        >
          {localeLabels[l]}
        </Link>
      ))}
    </nav>
  )
}
