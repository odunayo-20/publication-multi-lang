'use client'

import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useId, useState, type FormEvent } from 'react'

import type { Messages } from '@/i18n/messages'

type Mode = 'sign-in' | 'sign-up' | 'forgot' | 'reset'

type Props = {
  mode: Mode
  locale: string
  /** Same-site path to open after a successful sign in or sign up. Already sanitised on the server. */
  next: string
  token?: string
  t: Messages['auth']
}

const MIN_PASSWORD = 8
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Result = { ok: boolean; status: number; message: string }

const post = async (path: string, body: Record<string, unknown>): Promise<Result> => {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body),
    })
    const json = (await res.json().catch(() => ({}))) as {
      errors?: Array<{ message?: string; data?: { errors?: Array<{ message?: string }> } }>
      message?: string
    }
    const message = [json.message, ...(json.errors ?? []).flatMap((e) => [e.message, ...(e.data?.errors?.map((x) => x.message) ?? [])])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return { ok: res.ok, status: res.status, message }
  } catch {
    return { ok: false, status: 0, message: '' }
  }
}

export function AuthForm({ mode, locale, next, token, t }: Props) {
  const router = useRouter()
  const formId = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  const needsEmail = mode !== 'reset'
  const needsPassword = mode !== 'forgot'
  const isNewPassword = mode === 'sign-up' || mode === 'reset'

  const copy = {
    'sign-in': { submit: t.signIn.submit, busy: t.signIn.submitting },
    'sign-up': { submit: t.signUp.submit, busy: t.signUp.submitting },
    forgot: { submit: t.forgot.submit, busy: t.forgot.submitting },
    reset: { submit: t.reset.submit, busy: t.reset.submitting },
  }[mode]

  const validate = (): string | null => {
    if (needsEmail && !EMAIL_PATTERN.test(email.trim())) return t.errors.invalidEmail
    if (isNewPassword && password.length < MIN_PASSWORD) return t.errors.passwordShort
    if (mode === 'reset' && password !== confirm) return t.errors.passwordMismatch
    return null
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    const invalid = validate()
    if (invalid) return setError(invalid)

    setBusy(true)
    const cleanEmail = email.trim().toLowerCase()
    try {
      if (mode === 'forgot') {
        // The API answers the same way whether or not the account exists.
        await post('/api/users/forgot-password', { email: cleanEmail })
        return setDone(t.forgot.sent)
      }

      if (mode === 'reset') {
        const res = await post('/api/users/reset-password', { token, password })
        if (!res.ok) return setError(t.reset.missingToken)
        return setDone(t.reset.success)
      }

      if (mode === 'sign-up') {
        const created = await post('/api/users', { email: cleanEmail, password, name: name.trim() })
        if (!created.ok) {
          const taken = created.message.includes('unique') || created.message.includes('already')
          return setError(taken ? t.errors.emailTaken : t.errors.generic)
        }
      }

      const login = await post('/api/users/login', { email: cleanEmail, password })
      if (!login.ok) {
        return setError(login.message.includes('locked') ? t.errors.locked : t.errors.invalidCredentials)
      }
      router.push(next)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="au-success" role="status">
        <CheckCircle2 size={22} aria-hidden="true" />
        <p>{done}</p>
        {mode === 'reset' ? (
          <Link href={`/${locale}/sign-in`} className="au-btn">
            {t.signIn.submit}
          </Link>
        ) : (
          <Link href={`/${locale}/sign-in`} className="au-link">
            {t.forgot.back}
          </Link>
        )}
      </div>
    )
  }

  const passwordType = show ? 'text' : 'password'

  return (
    <form className="au-form" onSubmit={onSubmit} noValidate aria-describedby={error ? `${formId}-error` : undefined}>
      {error && (
        <div className="au-error" role="alert" id={`${formId}-error`}>
          <AlertCircle size={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {mode === 'sign-up' && (
        <div className="au-field">
          <label htmlFor={`${formId}-name`}>{t.fields.name}</label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      {needsEmail && (
        <div className="au-field">
          <label htmlFor={`${formId}-email`}>{t.fields.email}</label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      {needsPassword && (
        <div className="au-field">
          <div className="au-label-row">
            <label htmlFor={`${formId}-password`}>{mode === 'reset' ? t.fields.newPassword : t.fields.password}</label>
            {mode === 'sign-in' && (
              <Link href={`/${locale}/forgot-password`} className="au-link">
                {t.signIn.forgot}
              </Link>
            )}
          </div>
          <div className="au-password">
            <input
              id={`${formId}-password`}
              name="password"
              type={passwordType}
              autoComplete={isNewPassword ? 'new-password' : 'current-password'}
              required
              minLength={isNewPassword ? MIN_PASSWORD : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="au-eye"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? t.fields.hide : t.fields.show}
              aria-pressed={show}
            >
              {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          {isNewPassword && <p className="au-hint">{t.passwordRule}</p>}
        </div>
      )}

      {mode === 'reset' && (
        <div className="au-field">
          <label htmlFor={`${formId}-confirm`}>{t.fields.confirmPassword}</label>
          <input
            id={`${formId}-confirm`}
            name="confirm"
            type={passwordType}
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
      )}

      <button type="submit" className="au-btn" disabled={busy}>
        {busy ? copy.busy : copy.submit}
      </button>
    </form>
  )
}
