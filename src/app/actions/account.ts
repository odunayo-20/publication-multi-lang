'use server'

import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'

import { isLocale } from '@/i18n/config'
import { getCurrentUser } from '@/lib/auth'

type ToggleResult = { ok: true; active: boolean } | { ok: false; reason: 'unauthenticated' | 'failed' }

const idOf = (value: unknown): number | null => {
  const n = typeof value === 'object' && value !== null ? (value as { id?: unknown }).id : value
  return typeof n === 'number' ? n : null
}

/** Adds or removes `targetId` in one of the signed-in user's own relationship lists. */
const toggleRelation = async (
  field: 'followedAuthors' | 'savedPublications',
  targetId: number,
): Promise<ToggleResult> => {
  const user = await getCurrentUser()
  if (!user) return { ok: false, reason: 'unauthenticated' }
  if (!Number.isInteger(targetId)) return { ok: false, reason: 'failed' }

  const payload = await getPayload({ config })
  const current = (user[field] ?? []).map(idOf).filter((n): n is number => n !== null)
  const active = !current.includes(targetId)
  const next = active ? [...current, targetId] : current.filter((n) => n !== targetId)

  try {
    // overrideAccess stays false: the user may only ever update their own document.
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { [field]: next },
      user,
      overrideAccess: false,
    })
  } catch {
    return { ok: false, reason: 'failed' }
  }
  return { ok: true, active }
}

export async function toggleFollowAuthor(authorId: number, locale: string): Promise<ToggleResult> {
  const result = await toggleRelation('followedAuthors', authorId)
  if (result.ok && isLocale(locale)) revalidatePath(`/${locale}/account`, 'layout')
  return result
}

export async function toggleSavePublication(publicationId: number, locale: string): Promise<ToggleResult> {
  const result = await toggleRelation('savedPublications', publicationId)
  if (result.ok && isLocale(locale)) revalidatePath(`/${locale}/account`, 'layout')
  return result
}

export type ProfileState = { status: 'idle' | 'saved' | 'error'; message?: string }

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await getCurrentUser()
  if (!user) return { status: 'error', message: 'unauthenticated' }
  const name = String(formData.get('name') ?? '').trim().slice(0, 120)
  const payload = await getPayload({ config })
  try {
    await payload.update({ collection: 'users', id: user.id, data: { name }, user, overrideAccess: false })
  } catch {
    return { status: 'error', message: 'failed' }
  }
  const locale = String(formData.get('locale') ?? 'en')
  if (isLocale(locale)) revalidatePath(`/${locale}/account`, 'layout')
  return { status: 'saved' }
}
