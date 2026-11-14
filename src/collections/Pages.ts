import type { CollectionConfig } from 'payload'
import { isStaff, publishedOrStaff } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'

/** Fixed, editable pages: About, Contact, Research, Quotes, Privacy, Legal notice. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'] },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    slugField('title'),
    { name: 'content', type: 'richText', localized: true },
    seoField,
  ],
}
