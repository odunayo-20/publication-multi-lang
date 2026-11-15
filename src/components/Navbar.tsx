'use client'

import { BookOpen, Search, Menu, X, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { SignOutButton } from '@/components/account/SignOutButton'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'

type NavbarProps = {
  locale: Locale
  siteName?: string
  /** Signed-in user's display name, or null when signed out. */
  userName?: string | null
}

export function Navbar({ locale, siteName, userName }: NavbarProps) {
  const t = messages[locale]
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const brand = siteName || 'AcadPress'

  return (
    <header className="acad-header">
      <div className="acad-header-inner">
        {/* Brand */}
        <Link href={`/${locale}`} className="acad-brand" aria-label={brand}>
          <span className="acad-brand-icon">
            <BookOpen className="w-5 h-5" aria-hidden="true" />
          </span>
          <span className="acad-brand-text">
            {brand}
            <span className="acad-brand-dot">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="acad-nav" aria-label="Main Navigation">
          <Link href={`/${locale}`} className="acad-nav-link">
            {t.nav.home}
          </Link>
          <Link href={`/${locale}/journals`} className="acad-nav-link">
            {t.nav.journals}
          </Link>
          <Link href={`/${locale}/publications`} className="acad-nav-link">
            {t.nav.publications}
          </Link>
          <Link href={`/${locale}/articles`} className="acad-nav-link">
            {t.nav.articles}
          </Link>
          <Link href={`/${locale}/authors`} className="acad-nav-link">
            {t.nav.authors}
          </Link>
          <Link href={`/${locale}/about`} className="acad-nav-link">
            {t.nav.about}
          </Link>
        </nav>

        {/* Actions */}
        <div className="acad-header-actions">
          {/* Quick Search Toggle */}
          <button
            type="button"
            className="acad-search-btn"
            aria-label="Toggle search"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Switch */}
          <LanguageSwitch locale={locale} label={t.language} />

          {userName ? (
            <>
              <Link href={`/${locale}/account`} className="acad-login-btn">
                {userName}
              </Link>
              <Link href={`/${locale}/account/submissions/new`} className="acad-primary-btn">
                <span>{t.nav.submitPaper}</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <Link href={`/${locale}/sign-in`} className="acad-login-btn">
                {t.nav.signIn}
              </Link>
              <Link href={`/${locale}/sign-up`} className="acad-primary-btn">
                <span>{t.nav.signUp}</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="acad-mobile-menu-btn"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Search dropdown row if open */}
      {searchOpen && (
        <div className="acad-search-bar-dropdown">
          <form action={`/${locale}/search`} method="GET" className="acad-search-dropdown-form">
            <Search className="w-4 h-4 acad-search-icon" aria-hidden="true" />
            <input
              type="search"
              name="q"
              placeholder={t.portal.searchPlaceholder}
              autoFocus
              className="acad-search-dropdown-input"
            />
            <button type="submit" className="acad-search-dropdown-submit">
              {t.portal.searchButton}
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="acad-mobile-drawer">
          <nav className="acad-mobile-nav" aria-label="Mobile Navigation">
            <Link href={`/${locale}`} onClick={() => setMobileOpen(false)}>
              {t.nav.home}
            </Link>
            <Link href={`/${locale}/journals`} onClick={() => setMobileOpen(false)}>
              {t.nav.journals}
            </Link>
            <Link href={`/${locale}/publications`} onClick={() => setMobileOpen(false)}>
              {t.nav.publications}
            </Link>
            <Link href={`/${locale}/articles`} onClick={() => setMobileOpen(false)}>
              {t.nav.articles}
            </Link>
            <Link href={`/${locale}/authors`} onClick={() => setMobileOpen(false)}>
              {t.nav.authors}
            </Link>
            <Link href={`/${locale}/about`} onClick={() => setMobileOpen(false)}>
              {t.nav.about}
            </Link>
            <div className="acad-mobile-actions">
              {userName ? (
                <>
                  <Link
                    href={`/${locale}/account`}
                    className="acad-login-btn"
                    onClick={() => setMobileOpen(false)}
                  >
                    {userName}
                  </Link>
                  <SignOutButton locale={locale} label={t.auth.signOut} className="acad-primary-btn" />
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/sign-in`}
                    className="acad-login-btn"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t.nav.signIn}
                  </Link>
                  <Link
                    href={`/${locale}/sign-up`}
                    className="acad-primary-btn"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t.nav.signUp}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
