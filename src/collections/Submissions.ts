import type { CollectionConfig } from 'payload'
import { isLoggedIn, isStaff, staffOrOwner, userIsStaff } from '@/access'
import { publicationTypes } from '@/collections/Publications'

export const submissionStatuses = [
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under review', value: 'under-review' },
  { label: 'Revisions requested', value: 'revisions' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Published', value: 'published' },
]

/**
 * Manuscripts sent in by signed-in authors. Authors can create and read their own; only staff
 * change anything afterwards, so the review record cannot be edited by the person under review.
 */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'submitter', 'createdAt'],
  },
  access: {
    read: staffOrOwner('submitter'),
    create: isLoggedIn,
    update: isStaff,
    delete: isStaff,
  },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation !== 'create') return data
        // Never trust client-supplied ownership or status on create.
        const next: Record<string, unknown> = { ...data, submitter: req.user?.id }
        if (!userIsStaff(req.user)) next.status = 'submitted'
        return next
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 300 },
    { name: 'type', type: 'select', required: true, defaultValue: 'journal-article', options: publicationTypes },
    { name: 'journal', type: 'relationship', relationTo: 'journals', required: true },
    { name: 'abstract', type: 'textarea', required: true, maxLength: 5000 },
    { name: 'keywords', type: 'array', maxRows: 10, fields: [{ name: 'keyword', type: 'text', required: true }] },
    {
      name: 'coAuthors',
      type: 'array',
      maxRows: 30,
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'manuscript', type: 'upload', relationTo: 'manuscripts', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'submitted',
      options: submissionStatuses,
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'submitter',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      // Set by the beforeChange hook; updates are staff-only at the collection level.
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'editorNotes',
      type: 'textarea',
      admin: { description: 'Visible to the author.' },
      access: {
        create: ({ req }) => userIsStaff(req.user),
        update: ({ req }) => userIsStaff(req.user),
      },
    },
  ],
}
