import type { TextField } from 'payload'

export const toSlug = (input: string): string =>
  input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Unique, indexed slug. Generated from `source` when left empty. Not localized in v1. */
export const slugField = (source: string): TextField => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: 'Generated from the title if left empty.' },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const raw = typeof value === 'string' && value ? value : data?.[source]
        return typeof raw === 'string' ? toSlug(raw) : value
      },
    ],
  },
})
