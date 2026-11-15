import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { AuthForm } from '@/components/auth/AuthForm'
import { AuthShell } from '@/components/auth/AuthShell'
import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'
import { getCurrentUser, safeNextPath } from '@/lib/auth'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ next?: string }> }

export async function generateMetadata({ params }: Pick<Args, 'params'>): Promise<Metadata> {
  const { locale } = await params
  return { title: messages[locale].auth.signUp.submit, robots: { index: false } }
}

export default async function SignUpPage({ params, searchParams }: Args) {
  const { locale } = await params
  const { next } = await searchParams
  const destination = safeNextPath(next, `/${locale}/account`)
  if (await getCurrentUser()) redirect(destination)

  const t = messages[locale].auth
  return (
    <AuthShell
      locale={locale}
      title={t.signUp.title}
      subtitle={t.signUp.subtitle}
      footer={
        <>
          {t.signUp.switchPrompt}{' '}
          <Link href={`/${locale}/sign-in${next ? `?next=${encodeURIComponent(destination)}` : ''}`} className="au-link">
            {t.signUp.switchLink}
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-up" locale={locale} next={destination} t={t} />
    </AuthShell>
  )
}
