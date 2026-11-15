'use client'

import { Check, Link2, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'

import { toggleFollowAuthor } from '@/app/actions/account'

type Props = {
  authorId: number
  locale: string
  signedIn: boolean
  initialFollowing: boolean
  signInHref: string
  labels: { follow: string; following: string; share: string; copied: string; error: string }
}

export function AuthorActions({ authorId, locale, signedIn, initialFollowing, signInHref, labels }: Props) {
  const [following, setFollowing] = useState(initialFollowing)
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  const [pending, startTransition] = useTransition()

  const toggle = () => {
    setFailed(false)
    const previous = following
    setFollowing(!previous) // optimistic
    startTransition(async () => {
      const result = await toggleFollowAuthor(authorId, locale)
      if (!result.ok) {
        setFollowing(previous)
        setFailed(true)
      } else {
        setFollowing(result.active)
      }
    })
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be unavailable (insecure context); fail quietly.
    }
  }

  return (
    <div className="ap-actions">
      {signedIn ? (
        <button
          type="button"
          className="ap-btn ap-btn-primary"
          aria-pressed={following}
          disabled={pending}
          onClick={toggle}
        >
          {following ? <Check size={16} aria-hidden="true" /> : <UserPlus size={16} aria-hidden="true" />}
          {following ? labels.following : labels.follow}
        </button>
      ) : (
        <Link href={signInHref} className="ap-btn ap-btn-primary">
          <UserPlus size={16} aria-hidden="true" />
          {labels.follow}
        </Link>
      )}
      <button type="button" className="ap-btn ap-btn-ghost" onClick={copyLink}>
        {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
        {labels.share}
      </button>
      <span className="ap-sr-only" role="status" aria-live="polite">
        {copied ? labels.copied : failed ? labels.error : ''}
      </span>
    </div>
  )
}
