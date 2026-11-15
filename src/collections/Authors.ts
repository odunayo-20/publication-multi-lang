import type { CollectionConfig } from 'payload'
import { isStaff } from '@/access'
import { slugField } from '@/fields/slug'

export const coverStyles = [
  { label: 'Blue (computing)', value: 'gradient-cs' },
  { label: 'Amber (education)', value: 'gradient-edu' },
  { label: 'Green (energy)', value: 'gradient-energy' },
  { label: 'Cyan (water)', value: 'gradient-hydro' },
]

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'institution', 'isVerified'] },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      name: 'aliases',
      type: 'array',
      admin: {
        description:
          'Every way this person is printed in publication author lists (e.g. "Trošelj J."). Publications are matched to the profile by these names.',
      },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'title', type: 'text', localized: true, admin: { description: 'e.g. Senior Lecturer, Computer Science' } },
    { name: 'institution', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'bio', type: 'textarea', localized: true },
    {
      name: 'interests',
      type: 'array',
      maxRows: 8,
      fields: [{ name: 'interest', type: 'text', required: true }],
    },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'gradient',
      type: 'select',
      defaultValue: 'gradient-cs',
      options: coverStyles,
      admin: { position: 'sidebar', description: 'Colour of the initials avatar when there is no photo.' },
    },
    { name: 'isVerified', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'memberSince',
      type: 'number',
      min: 1990,
      max: new Date().getFullYear(),
      admin: { position: 'sidebar', step: 1 },
    },
    {
      name: 'links',
      type: 'group',
      fields: [
        { name: 'orcid', type: 'text', admin: { description: 'Full https://orcid.org/… URL' } },
        { name: 'scholar', type: 'text' },
        { name: 'researchgate', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'website', type: 'text' },
      ],
    },
  ],
}
