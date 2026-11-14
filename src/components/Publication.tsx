import Link from 'next/link'

import type { Locale } from '@/i18n/config'
import { messages, type PublicationTypeKey } from '@/i18n/messages'
import { venueDetail } from '@/lib/citation'
import type { Publication } from '@/payload-types'

export const doiUrl = (doi: string) => `https://doi.org/${doi}`

export const pdfUrlOf = (pub: Publication): string | null =>
  pub.pdf && typeof pub.pdf === 'object' ? (pub.pdf.url ?? null) : null

export const typeLabel = (locale: Locale, type: string) =>
  messages[locale].types[type as PublicationTypeKey] ?? type

/** Authors as printed on the paper; the site owner is set in bold. */
export function Authors({ authors }: { authors: Publication['authors'] }) {
  return (
    <>
      {authors.map((a, i) => (
        <span key={a.id ?? `${a.name}-${i}`}>
          {i > 0 && ', '}
          {a.isSelf ? <strong>{a.name}</strong> : a.name}
        </span>
      ))}
    </>
  )
}

/** One row of the publication list: title, authors, venue and the links a reader wants. */
export function PublicationItem({ pub, locale }: { pub: Publication; locale: Locale }) {
  const t = messages[locale].publications
  const pdf = pdfUrlOf(pub)
  const detail = venueDetail(pub)

  return (
    <li className="pub">
      <p className="pub-title">
        <Link href={`/${locale}/publications/${pub.slug}`}>{pub.title}</Link>
      </p>
      <p className="pub-authors">
        <Authors authors={pub.authors} />
      </p>
      <p className="pub-venue">
        <span className="pub-type">{typeLabel(locale, pub.type)}</span>
        {pub.venue && <em>{pub.venue}</em>}
        {pub.venue && detail && ', '}
        {detail}
      </p>
      {(pub.doi || pub.url || pdf) && (
        <ul className="pub-links">
          {pub.doi && (
            <li>
              <a href={doiUrl(pub.doi)}>{t.doi}</a>
            </li>
          )}
          {pub.url && pub.url !== (pub.doi && doiUrl(pub.doi)) && (
            <li>
              <a href={pub.url}>{t.link}</a>
            </li>
          )}
          {pdf && (
            <li>
              <a href={pdf}>{t.pdf}</a>
            </li>
          )}
        </ul>
      )}
    </li>
  )
}
