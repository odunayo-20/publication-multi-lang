import type { TextField } from 'payload'

export const toSlug = (input: string): string =>
  input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Cuts at a word boundary so long titles (papers) do not make unreadable URLs. */
export const truncateSlug = (slug: string, max: number): string => {
  if (slug.length <= max) return slug
  const cut = slug.slice(0, max)
  const lastDash = cut.lastIndexOf('-')
  return (lastDash > 0 ? cut.slice(0, lastDash) : cut).replace(/-+$/, '')
}

/** Unique, indexed slug. Generated from `source` when left empty. Not localized in v1. */
export const slugField = (source: string, maxLength = 100): TextField => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: 'Generated from the title if left empty.' },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const raw = typeof value === 'string' && value ? value : data?.[source]
        return typeof raw === 'string' ? truncateSlug(toSlug(raw), maxLength) : value
      },
    ],
  },
})

/** Returns `base`, or `base-hint`, or `base-hint-2`, ... until `isTaken` says the candidate is free. */
export const uniqueSlug = async (
  base: string,
  isTaken: (candidate: string) => Promise<boolean>,
  hint?: string,
): Promise<string> => {
  if (!(await isTaken(base))) return base
  const stem = hint ? `${base}-${hint}` : base
  if (hint && !(await isTaken(stem))) return stem
  for (let n = 2; ; n++) {
    const candidate = `${stem}-${n}`
    if (!(await isTaken(candidate))) return candidate
  }
}
