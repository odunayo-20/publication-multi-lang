'use client'

import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useActionState } from 'react'

import { updateProfile, type ProfileState } from '@/app/actions/account'
import type { Messages } from '@/i18n/messages'

type Props = {
  locale: string
  name: string
  email: string
  t: Messages['account']['profile']
  genericError: string
}

const initial: ProfileState = { status: 'idle' }

export function ProfileForm({ locale, name, email, t, genericError }: Props) {
  const [state, action, pending] = useActionState(updateProfile, initial)

  return (
    <form action={action} className="ac-form">
      <input type="hidden" name="locale" value={locale} />
      {state.status === 'saved' && (
        <div className="ac-flash" role="status">
          <CheckCircle2 size={18} aria-hidden="true" />
          {t.saved}
        </div>
      )}
      {state.status === 'error' && (
        <div className="ac-error" role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          {genericError}
        </div>
      )}
      <div className="ac-field">
        <label htmlFor="pf-name">{t.name}</label>
        <input id="pf-name" name="name" defaultValue={name} maxLength={120} autoComplete="name" />
      </div>
      <div className="ac-field">
        <label htmlFor="pf-email">{t.email}</label>
        <input id="pf-email" value={email} readOnly aria-describedby="pf-email-note" />
        <p id="pf-email-note" className="ac-hint">
          {t.emailNote}
        </p>
      </div>
      <button type="submit" className="ac-btn" disabled={pending}>
        {pending ? t.saving : t.save}
      </button>
    </form>
  )
}
