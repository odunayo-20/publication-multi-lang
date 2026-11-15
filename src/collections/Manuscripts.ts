import type { CollectionConfig } from 'payload'
import { isLoggedIn, isStaff, staffOrOwner } from '@/access'

/** Private upload bucket for submitted manuscripts. Never publicly readable. */
export const Manuscripts: CollectionConfig = {
  slug: 'manuscripts',
  access: {
    read: staffOrOwner('owner'),
    create: isLoggedIn,
    update: isStaff,
    delete: isStaff,
  },
  upload: {
    staticDir: 'manuscripts',
    mimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) =>
        operation === 'create' && req.user ? { ...data, owner: req.user.id } : data,
    ],
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],
}
