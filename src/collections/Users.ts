import type { CollectionConfig } from 'payload'
import { adminOrSelf, isAdmin, isAdminField } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: {
    tokenExpiration: 60 * 60 * 2,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  access: {
    // Creating users is admin-only. The very first user is created through
    // Payload's first-register flow, which does not go through this check.
    create: isAdmin,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: { update: isAdminField },
      hooks: {
        // Only the first-register flow creates a user without an authenticated user.
        beforeChange: [
          ({ operation, req, value }) => (operation === 'create' && !req.user ? ['admin'] : value),
        ],
      },
    },
  ],
}
