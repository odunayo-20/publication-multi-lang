import type { CollectionConfig } from 'payload'
import { isStaff } from '@/access'
import { slugField } from '@/fields/slug'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [{ name: 'name', type: 'text', required: true, localized: true }, slugField('name')],
}
