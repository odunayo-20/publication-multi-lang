import type { GroupField } from 'payload'

/** Optional overrides for search and social previews. Empty values fall back to the content itself. */
export const seoField: GroupField = {
  name: 'seo',
  type: 'group',
  admin: { description: 'Optional. Leave empty to use the title and excerpt.' },
  fields: [
    { name: 'metaTitle', type: 'text', localized: true, maxLength: 70 },
    { name: 'metaDescription', type: 'textarea', localized: true, maxLength: 160 },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
