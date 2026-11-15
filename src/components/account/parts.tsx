import Link from 'next/link'
import type { ReactNode } from 'react'

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <header className="ac-page-header">
      <div>
        <h1 className="ac-title">{title}</h1>
        {subtitle && <p className="ac-subtitle">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}

export function EmptyState({ message, href, cta }: { message: string; href: string; cta: string }) {
  return (
    <div className="ac-empty">
      <p>{message}</p>
      <Link href={href} className="ac-btn">
        {cta}
      </Link>
    </div>
  )
}

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return <span className={`ac-status ac-status-${status}`}>{label}</span>
}
