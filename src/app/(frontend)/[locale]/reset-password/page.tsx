import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthForm } from '@/components/auth/AuthForm'
import { AuthShell } from '@/components/auth/AuthShell'
import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ token?: string }> }

export async function generateMetadata({ params }: Pick<Args, 'params'>): Promise<Metadata> {
  const { locale } = await params
  // The reset token is in the URL, so keep this page out of search engines and referrers.
  return { title: messages[locale].auth.reset.title, robots: { index: false }, referrer: 'no-referrer' }
}

export default async function ResetPasswordPage({ params, searchParams }: Args) {
  const { locale } = await params
  const { token } = await searchParams
  const t = messages[locale].auth

  return (
    <AuthShell locale={locale} title={t.reset.title} subtitle={t.reset.subtitle}>
      {token ? (
        <AuthForm mode="reset" locale={locale} next={`/${locale}/sign-in`} token={token} t={t} />
      ) : (
        <div className="au-error" role="alert">
          <span>{t.reset.missingToken}</span>{' '}
          <Link href={`/${locale}/forgot-password`} className="au-link">
            {t.reset.requestNew}
          </Link>
        </div>
      )}
    </AuthShell>
  )
}
