'use client'

import { Bookmark, FileText, LayoutDashboard, UserRound, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Messages } from '@/i18n/messages'

type Props = { locale: string; t: Messages['account']['nav'] }

export function AccountNav({ locale, t }: Props) {
  const pathname = usePathname()
  const base = `/${locale}/account`
  const items = [
    { href: base, label: t.overview, icon: LayoutDashboard, exact: true },
    { href: `${base}/submissions`, label: t.submissions, icon: FileText },
    { href: `${base}/saved`, label: t.saved, icon: Bookmark },
    { href: `${base}/following`, label: t.following, icon: Users },
    { href: `${base}/profile`, label: t.profile, icon: UserRound },
  ]

  return (
    <nav className="ac-nav" aria-label={t.label}>
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link key={href} href={href} className="ac-nav-link" aria-current={active ? 'page' : undefined}>
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
