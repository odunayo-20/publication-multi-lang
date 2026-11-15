import type { CollectionConfig } from 'payload'
import { isStaff } from '@/access'
import { slugField } from '@/fields/slug'

export const journalCategoryOptions = [
  { label: 'Computer Science', value: 'cs' },
  { label: 'Education', value: 'edu' },
  { label: 'Health Sciences', value: 'health' },
  { label: 'Engineering', value: 'eng' },
  { label: 'Social Sciences', value: 'social' },
  { label: 'Business & Management', value: 'biz' },
  { label: 'Natural Sciences', value: 'natural' },
  { label: 'Arts & Humanities', value: 'arts' },
  { label: 'Law', value: 'law' },
  { label: 'Mathematics', value: 'math' },
  { label: 'Other', value: 'other' },
]

export const journalBadgeOptions = ['blue', 'navy', 'teal', 'cyan', 'indigo', 'amber', 'emerald'].map((c) => ({
  label: c[0]!.toUpperCase() + c.slice(1),
  value: `badge-${c}`,
}))

/** Journal titles are cited as published, so only the scope text is translated. */
export const Journals: CollectionConfig = {
  slug: 'journals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'citeScore', 'featured'],
    listSearchableFields: ['name', 'initials', 'issn'],
  },
  access: {
    read: () => true,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    slugField('name', 90),
    { name: 'initials', type: 'text', required: true, maxLength: 4 },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'other',
      options: journalCategoryOptions,
      index: true,
    },
    { name: 'scope', type: 'textarea', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'issn', type: 'text', admin: { description: 'e.g. 2582-4120' } },
        { name: 'eIssn', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'citeScore', type: 'number', min: 0, admin: { step: 0.1 } },
        { name: 'acceptanceRate', type: 'text', admin: { description: 'e.g. 21%' } },
        { name: 'reviewTime', type: 'text', admin: { description: 'e.g. 21 days' } },
      ],
    },
    { name: 'indexing', type: 'array', fields: [{ name: 'service', type: 'text', required: true }] },
    {
      name: 'badgeColor',
      type: 'select',
      defaultValue: 'badge-blue',
      options: journalBadgeOptions,
      admin: { position: 'sidebar' },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
