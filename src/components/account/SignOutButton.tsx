'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = { label: string; locale: string; className?: string }

export function SignOutButton({ label, locale, className }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const signOut = async () => {
    setBusy(true)
    try {
      await fetch('/api/users/logout', { method: 'POST', credentials: 'same-origin' })
    } finally {
      router.push(`/${locale}`)
      router.refresh()
    }
  }

  return (
    <button type="button" className={className} onClick={signOut} disabled={busy}>
      <LogOut size={16} aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
