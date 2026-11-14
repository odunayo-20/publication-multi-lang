import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Joško Trošelj',
      admin: { description: 'Exactly as it appears on publications, with diacritics.' },
    },
    { name: 'role', type: 'text', localized: true, admin: { description: 'e.g. Research Associate' } },
    { name: 'institution', type: 'text', localized: true },
    { name: 'department', type: 'text', localized: true },
    { name: 'summary', type: 'textarea', localized: true, maxLength: 300 },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    {
      name: 'contactEmail',
      type: 'email',
      admin: { description: 'Shown on the Contact page, obfuscated against spam.' },
    },
    {
      name: 'profiles',
      type: 'array',
      admin: { description: 'Scholar, ORCID and other profile links.' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Google Scholar', value: 'scholar' },
            { label: 'ORCID', value: 'orcid' },
            { label: 'ResearchGate', value: 'researchgate' },
            { label: 'Institute page', value: 'institute' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'defaultShareImage', type: 'upload', relationTo: 'media' },
  ],
}
