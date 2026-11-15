import { ValidationError, type CollectionConfig } from 'payload'
import { adminOrSelf, canAccessAdmin, isAdmin, isAdminField } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'roles'] },
  auth: {
    tokenExpiration: 60 * 60 * 2,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
    forgotPassword: {
      // Send readers to the public reset page instead of the admin panel's.
      generateEmailSubject: () => 'Reset your AcadPress password',
      generateEmailHTML: (args) => {
        const base = (process.env.NEXT_PUBLIC_SERVER_URL ?? '').replace(/\/$/, '')
        const link = `${base}/en/reset-password?token=${encodeURIComponent(args?.token ?? '')}`
        return `<p>We received a request to reset your password.</p><p><a href="${link}">Choose a new password</a></p><p>If you did not ask for this, you can ignore this email.</p>`
      },
    },
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        const password = (data as { password?: unknown } | undefined)?.password
        if (typeof password === 'string' && password.length < 8) {
          throw new ValidationError({
            errors: [{ message: 'Password must be at least 8 characters.', path: 'password' }],
            req,
          })
        }
        return data
      },
    ],
  },
  access: {
    // Only staff may open the /admin panel; readers and authors use the public account area.
    admin: canAccessAdmin,
    // Anyone may register. The `roles` hook below forces the new account to be a plain author,
    // so a public sign-up can never grant itself staff rights.
    create: () => true,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', maxLength: 120 },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['author'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
      ],
      // No create-access rule here on purpose: the hook below decides roles on create, and a
      // field-access denial could strip the value before that required field is validated.
      access: { update: isAdminField },
      hooks: {
        beforeChange: [
          async ({ operation, req, value }) => {
            if (operation !== 'create') return value
            // Admins may create staff accounts from the panel.
            if (req.user?.roles?.includes('admin')) return value
            // The first account ever created (Payload's first-register flow) becomes the admin.
            if (!req.user) {
              const { totalDocs } = await req.payload.count({ collection: 'users', req })
              if (totalDocs === 0) return ['admin']
            }
            return ['author']
          },
        ],
      },
    },
    {
      name: 'authorProfile',
      type: 'relationship',
      relationTo: 'authors',
      admin: { description: 'The public author profile this account owns.' },
      // Only staff may link a profile; otherwise anyone could claim someone else's page.
      access: { create: isAdminField, update: isAdminField },
    },
    {
      name: 'followedAuthors',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
      admin: { description: 'Authors this reader follows.' },
    },
    {
      name: 'savedPublications',
      type: 'relationship',
      relationTo: 'publications',
      hasMany: true,
      admin: { description: 'Publications this reader saved.' },
    },
  ],
}
