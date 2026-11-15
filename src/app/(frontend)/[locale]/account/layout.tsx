import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AccountNav } from '@/components/account/AccountNav'
import { SignOutButton } from '@/components/account/SignOutButton'
import { initialsOf } from '@/lib/authors'
import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { robots: { index: false, follow: false } }

type Args = { children: ReactNode; params: Promise<{ locale: string }> }

/**
 * Chrome for the signed-in area. Each page enforces the sign-in itself (so it can return the
 * visitor to the exact page they asked for); the layout simply shows nothing extra without a user.
 */
export default async function AccountLayout({ children, params }: Args) {
  // The root layout has already rejected unknown locales.
  const locale = (await params).locale as Locale
  const t = messages[locale]
  const user = await getCurrentUser()
  if (!user) return <>{children}</>

  const display = user.name?.trim() || user.email

  return (
    <div className="acad-container ac-shell">
      <aside className="ac-sidebar">
        <div className="ac-identity">
          <span className="ac-avatar" aria-hidden="true">
            {initialsOf(display) || '?'}
          </span>
          <div className="ac-identity-text">
            <strong>{display}</strong>
            <span>{user.email}</span>
          </div>
        </div>
        <AccountNav locale={locale} t={t.account.nav} />
        <SignOutButton locale={locale} label={t.auth.signOut} className="ac-signout" />
      </aside>
      <div className="ac-content">{children}</div>
    </div>
  )
}
