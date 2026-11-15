'use server'

import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { publicationTypes } from '@/collections/Publications'
import { isLocale } from '@/i18n/config'
import { getCurrentUser } from '@/lib/auth'
import type { Submission } from '@/payload-types'

export type SubmissionState = {
  status: 'idle' | 'error'
  code?: 'unauthenticated' | 'invalid' | 'file' | 'failed'
  field?: string
}

const MAX_FILE_BYTES = 15 * 1024 * 1024
const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])
const TYPES = new Set(publicationTypes.map((t) => t.value))

const list = (raw: FormDataEntryValue | null, max: number) =>
  String(raw ?? '')
    .split(/[\n,;]+/)
    .map((s) => s.trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, max)

export async function submitManuscript(_prev: SubmissionState, formData: FormData): Promise<SubmissionState> {
  const user = await getCurrentUser()
  if (!user) return { status: 'error', code: 'unauthenticated' }

  const locale = String(formData.get('locale') ?? 'en')
  const title = String(formData.get('title') ?? '').trim()
  const abstract = String(formData.get('abstract') ?? '').trim()
  const type = String(formData.get('type') ?? '')
  const journalId = Number(formData.get('journal'))
  const file = formData.get('manuscript')

  if (title.length < 5 || title.length > 300) return { status: 'error', code: 'invalid', field: 'title' }
  if (!TYPES.has(type)) return { status: 'error', code: 'invalid', field: 'type' }
  if (!Number.isInteger(journalId)) return { status: 'error', code: 'invalid', field: 'journal' }
  if (abstract.length < 50 || abstract.length > 5000) return { status: 'error', code: 'invalid', field: 'abstract' }
  if (!(file instanceof File) || file.size === 0) return { status: 'error', code: 'file' }
  if (file.size > MAX_FILE_BYTES || !ALLOWED_MIME.has(file.type)) return { status: 'error', code: 'file' }

  const payload = await getPayload({ config })
  try {
    const manuscript = await payload.create({
      collection: 'manuscripts',
      data: {},
      file: {
        data: Buffer.from(await file.arrayBuffer()),
        mimetype: file.type,
        name: file.name.replace(/[^\w.\- ]+/g, '_').slice(0, 120),
        size: file.size,
      },
      user,
      overrideAccess: false,
    })

    await payload.create({
      collection: 'submissions',
      data: {
        title,
        type: type as Submission['type'],
        journal: journalId,
        abstract,
        keywords: list(formData.get('keywords'), 10).map((keyword) => ({ keyword })),
        coAuthors: list(formData.get('coAuthors'), 30).map((name) => ({ name })),
        manuscript: manuscript.id,
        status: 'submitted', // the collection hook enforces this for non-staff regardless
      },
      user,
      overrideAccess: false,
    })
  } catch {
    return { status: 'error', code: 'failed' }
  }

  const safeLocale = isLocale(locale) ? locale : 'en'
  revalidatePath(`/${safeLocale}/account`, 'layout')
  redirect(`/${safeLocale}/account/submissions?submitted=1`)
}
