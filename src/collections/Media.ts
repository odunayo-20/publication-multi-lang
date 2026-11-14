import type { CollectionConfig } from 'payload'
import { isStaff } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  upload: {
    // Local fallback for dev only; production uses Vercel Blob (see payload.config.ts).
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'application/pdf'],
    imageSizes: [
      { name: 'card', width: 640, height: 360, position: 'centre' },
      { name: 'hero', width: 1600, height: undefined },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      admin: { description: 'Describe the image for screen readers. Not needed for PDFs.' },
      validate: (value: string | null | undefined, { data }: { data: { mimeType?: string } }) =>
        data?.mimeType === 'application/pdf' || Boolean(value) || 'Alt text is required for images',
    },
  ],
}
