import type { CollectionConfig } from 'payload'
import { isStaff, publishedOrStaff } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'authors', 'publishedAt', '_status'],
  },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  versions: { drafts: { autosave: true } },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    { name: 'excerpt', type: 'textarea', localized: true, maxLength: 300 },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', localized: true },
    { name: 'authors', type: 'relationship', relationTo: 'authors', hasMany: true },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) =>
            siblingData._status === 'published' && !value ? new Date().toISOString() : value,
        ],
      },
    },
    seoField,
  ],
}
