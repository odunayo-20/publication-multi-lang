import config from '@payload-config'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/config'

export const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL ?? '').replace(/\/$/, '')

export const fallbackSiteName = 'Joško Trošelj'

/** Site-wide settings for the public pages. Falls back to defaults so a DB hiccup never blanks the site. */
export const getSiteSettings = async (locale: Locale) => {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug: 'site-settings', locale, depth: 0, overrideAccess: false })
  } catch {
    return null
  }
}
