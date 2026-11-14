// A backslash followed by "u003c": the JSON escape for "<". Built from its char code so no
// tool or formatter can collapse it back into a literal "<".
const ESCAPED_LT = `${String.fromCharCode(92)}u003c`

/** Serializes JSON-LD for a script tag; "<" is escaped so content can never close the tag. */
export const jsonLdScript = (data: unknown): string => JSON.stringify(data).replace(/</g, ESCAPED_LT)

type PersonInput = {
  name: string
  url: string
  jobTitle?: string | null
  institution?: string | null
  profileUrls?: string[]
  description?: string | null
}

/** schema.org Person for the home page. Empty values are dropped by JSON.stringify. */
export const personJsonLd = ({
  name,
  url,
  jobTitle,
  institution,
  profileUrls,
  description,
}: PersonInput) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name,
  url,
  jobTitle: jobTitle || undefined,
  description: description || undefined,
  affiliation: institution ? { '@type': 'Organization', name: institution } : undefined,
  sameAs: profileUrls?.length ? profileUrls : undefined,
})
