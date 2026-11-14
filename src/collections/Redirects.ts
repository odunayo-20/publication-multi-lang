import type { CollectionConfig } from 'payload'
import { isStaff } from '@/access'

/** Old WordPress URLs and renamed slugs. Read server-side only, so public read stays closed. */
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { useAsTitle: 'from', defaultColumns: ['from', 'to', 'permanent'] },
  access: {
    read: isStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Path on this site, e.g. /2022/05/12/flood-paper' },
      validate: (value: string | null | undefined) =>
        (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) ||
        'Must start with a single /',
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: { description: 'A path (/en/publications) or a full https:// URL.' },
      validate: (value: string | null | undefined) =>
        (typeof value === 'string' && (/^\/(?!\/)/.test(value) || /^https:\/\//.test(value))) ||
        'Use a path starting with / or a full https:// URL',
    },
    {
      name: 'permanent',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Permanent (308) tells search engines to move the old address.' },
    },
  ],
}
