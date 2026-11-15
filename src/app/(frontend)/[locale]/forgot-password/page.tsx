import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthForm } from '@/components/auth/AuthForm'
import { AuthShell } from '@/components/auth/AuthShell'
import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  return { title: messages[locale].auth.forgot.title, robots: { index: false } }
}

export default async function ForgotPasswordPage({ params }: Args) {
  const { locale } = await params
  const t = messages[locale].auth
  return (
    <AuthShell
      locale={locale}
      title={t.forgot.title}
      subtitle={t.forgot.subtitle}
      footer={
        <Link href={`/${locale}/sign-in`} className="au-link">
          {t.forgot.back}
        </Link>
      }
    >
      <AuthForm mode="forgot" locale={locale} next={`/${locale}/account`} t={t} />
    </AuthShell>
  )
}
