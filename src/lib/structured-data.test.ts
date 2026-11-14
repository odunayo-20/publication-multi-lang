import { describe, expect, it } from 'vitest'
import { jsonLdScript, personJsonLd } from './structured-data'

describe('jsonLdScript', () => {
  it('escapes "<" so a value cannot close the script tag', () => {
    const out = jsonLdScript({ name: '</script><script>alert(1)</script>' })
    expect(out).not.toContain('<')
    expect(JSON.parse(out).name).toBe('</script><script>alert(1)</script>')
  })
})

describe('personJsonLd', () => {
  const base = { name: 'Joško Trošelj', url: 'https://example.org/en' }

  it('describes the person with affiliation and profiles', () => {
    const data = personJsonLd({
      ...base,
      jobTitle: 'Research Associate',
      institution: 'Ruđer Bošković Institute',
      profileUrls: ['https://orcid.org/0000-0000-0000-0000'],
    })
    expect(data).toMatchObject({
      '@type': 'Person',
      name: 'Joško Trošelj',
      jobTitle: 'Research Associate',
      affiliation: { '@type': 'Organization', name: 'Ruđer Bošković Institute' },
      sameAs: ['https://orcid.org/0000-0000-0000-0000'],
    })
  })

  it('leaves out anything that is empty', () => {
    const json = JSON.parse(
      jsonLdScript(personJsonLd({ ...base, jobTitle: '', institution: null, profileUrls: [] })),
    )
    expect(Object.keys(json).sort()).toEqual(['@context', '@type', 'name', 'url'])
  })
})
