'use client'

import { Check, Link2, UserPlus } from 'lucide-react'
import { useState } from 'react'

type Props = {
  labels: { follow: string; following: string; share: string; copied: string }
}

export function AuthorActions({ labels }: Props) {
  const [following, setFollowing] = useState(false)
  const [copied, setCopied] = useState(false)

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
      <button
        type="button"
        className="ap-btn ap-btn-primary"
        aria-pressed={following}
        onClick={() => setFollowing((v) => !v)}
      >
        {following ? <Check size={16} aria-hidden="true" /> : <UserPlus size={16} aria-hidden="true" />}
        {following ? labels.following : labels.follow}
      </button>
      <button type="button" className="ap-btn ap-btn-ghost" onClick={copyLink}>
        {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
        {labels.share}
      </button>
      <span className="ap-sr-only" role="status" aria-live="polite">
        {copied ? labels.copied : ''}
      </span>
    </div>
  )
}
