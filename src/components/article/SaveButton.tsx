'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'

import { toggleSavePublication } from '@/app/actions/account'

type Props = {
  publicationId: number
  locale: string
  signedIn: boolean
  initialSaved: boolean
  signInHref: string
  labels: { save: string; saved: string; error: string }
}

/** Bookmark toggle. Visitors who are not signed in are sent to sign in and back. */
export function SaveButton({ publicationId, locale, signedIn, initialSaved, signInHref, labels }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [failed, setFailed] = useState(false)
  const [pending, startTransition] = useTransition()

  if (!signedIn) {
    return (
      <Link href={signInHref} className="acad-btn-cite-trigger">
        <Bookmark className="w-4 h-4 mr-1.5" aria-hidden="true" />
        <span>{labels.save}</span>
      </Link>
    )
  }

  const toggle = () => {
    setFailed(false)
    const previous = saved
    setSaved(!previous) // optimistic
    startTransition(async () => {
      const result = await toggleSavePublication(publicationId, locale)
      if (result.ok) setSaved(result.active)
      else {
        setSaved(previous)
        setFailed(true)
      }
    })
  }

  return (
    <>
      <button
        type="button"
        className="acad-btn-cite-trigger"
        aria-pressed={saved}
        disabled={pending}
        onClick={toggle}
      >
        {saved ? (
          <BookmarkCheck className="w-4 h-4 mr-1.5" aria-hidden="true" />
        ) : (
          <Bookmark className="w-4 h-4 mr-1.5" aria-hidden="true" />
        )}
        <span>{saved ? labels.saved : labels.save}</span>
      </button>
      <span className="ap-sr-only" role="status" aria-live="polite">
        {failed ? labels.error : ''}
      </span>
    </>
  )
}
