const DOI_PATTERN = /^10\.\d{4,9}\/\S+$/

/** Strips URL or "doi:" prefixes and lowercases (DOIs are case-insensitive). Empty input gives ''. */
export const normalizeDoi = (input: string): string =>
  input
    .trim()
    .replace(/^(https?:\/\/)?(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
    .toLowerCase()

export const isDoi = (value: string): boolean => DOI_PATTERN.test(value)
