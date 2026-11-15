import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/config'
import type { User } from '@/payload-types'

/** The signed-in user from the Payload auth cookie, or null. Never throws for a missing session. */
export const getCurrentUser = async (): Promise<User | null> => {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  return (user as User | null) ?? null
}

/**
 * Only same-site paths are allowed as a post-login destination. Anything else
 * (absolute URLs, protocol-relative `//evil.com`, backslash tricks) falls back to `fallback`.
 */
export const safeNextPath = (next: string | null | undefined, fallback: string): string => {
  if (!next) return fallback
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return fallback
  return next
}

/** For pages and layouts that need an account: sends visitors to sign in and back again. */
export const requireUser = async (locale: Locale, returnTo: string): Promise<User> => {
  const user = await getCurrentUser()
  if (!user) redirect(`/${locale}/sign-in?next=${encodeURIComponent(returnTo)}`)
  return user
}

/** Ids from a relationship field that may hold ids or populated documents. */
export const relationIds = (value: unknown): number[] =>
  (Array.isArray(value) ? value : [])
    .map((v) => (typeof v === 'object' && v !== null ? (v as { id?: unknown }).id : v))
    .filter((n): n is number => typeof n === 'number')
