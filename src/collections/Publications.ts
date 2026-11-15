import type { CollectionConfig } from 'payload'
import { isStaff, publishedOrStaff } from '@/access'
import { coverStyles } from '@/collections/Authors'
import { seoField } from '@/fields/seo'
import { slugField, uniqueSlug } from '@/fields/slug'
import { isDoi, normalizeDoi } from '@/lib/doi'

export const publicationTypes = [
  { label: 'Journal article', value: 'journal-article' },
  { label: 'Book chapter', value: 'book-chapter' },
  { label: 'Conference paper', value: 'conference-paper' },
  { label: 'Proceedings paper', value: 'proceedings-paper' },
  { label: 'Bulletin article', value: 'bulletin-article' },
  { label: 'Invited talk', value: 'invited-talk' },
  { label: 'Invited lecture', value: 'invited-lecture' },
  { label: 'Preprint', value: 'preprint' },
  { label: 'Other', value: 'other' },
]

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'year', 'featured', '_status'],
    listSearchableFields: ['title', 'doi', 'venue'],
  },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  defaultSort: '-year',
  versions: { drafts: true },
  hooks: {
    // A talk and a paper can share a title; keep slugs unique by adding the year, then a number.
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        if (!data.slug) return data
        const slug = await uniqueSlug(
          data.slug,
          async (candidate) => {
            const { totalDocs } = await req.payload.find({
              collection: 'publications',
              where: {
                slug: { equals: candidate },
                ...(originalDoc?.id ? { id: { not_equals: originalDoc.id } } : {}),
              },
              limit: 1,
              depth: 0,
              req,
            })
            return totalDocs > 0
          },
          data.year ? String(data.year) : undefined,
        )
        return { ...data, slug }
      },
    ],
  },
  fields: [
    // Titles and venues are cited as published, so they are not translated.
    { name: 'title', type: 'text', required: true },
    slugField('title', 80),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'journal-article',
      options: publicationTypes,
      index: true,
    },
    {
      name: 'authors',
      type: 'array',
      required: true,
      minRows: 1,
      admin: { description: 'In the order printed on the paper.' },
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'e.g. Trošelj J.' } },
        { name: 'isSelf', type: 'checkbox', defaultValue: false, label: 'This is the site owner' },
      ],
    },
    { name: 'venue', type: 'text', admin: { description: 'Journal, book or conference name.' } },
    {
      name: 'year',
      type: 'number',
      required: true,
      index: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
      admin: { step: 1 },
    },
    {
      type: 'row',
      fields: [
        { name: 'volume', type: 'text' },
        { name: 'issue', type: 'text' },
        { name: 'pages', type: 'text' },
      ],
    },
    {
      name: 'doi',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: 'Paste a DOI or a doi.org link; it is cleaned automatically.' },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (typeof value !== 'string') return value
            return normalizeDoi(value) || null
          },
        ],
      },
      validate: (value: string | null | undefined) =>
        !value || isDoi(value) || 'Enter a DOI such as 10.1000/xyz123',
    },
    {
      name: 'url',
      type: 'text',
      admin: { description: 'Link to the publisher or repository when there is no DOI.' },
    },
    { name: 'abstract', type: 'textarea', localized: true },
    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Only upload PDFs the publisher allows you to host. Otherwise use the DOI.' },
    },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show under "Selected publications" on the home page.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'viewCount', type: 'number', defaultValue: 0, min: 0, admin: { step: 1 } },
        { name: 'citationCount', type: 'number', defaultValue: 0, min: 0, admin: { step: 1 } },
      ],
    },
    {
      name: 'coverStyle',
      type: 'select',
      defaultValue: 'gradient-cs',
      options: coverStyles,
      admin: { position: 'sidebar', description: 'Colour of the generated cover on cards.' },
    },
    { name: 'keywords', type: 'array', maxRows: 12, fields: [{ name: 'keyword', type: 'text', required: true }] },
    seoField,
  ],
}
