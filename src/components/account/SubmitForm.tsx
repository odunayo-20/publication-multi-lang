'use client'

import { AlertCircle } from 'lucide-react'
import { useActionState } from 'react'

import { submitManuscript, type SubmissionState } from '@/app/actions/submissions'
import type { Messages } from '@/i18n/messages'

type Props = {
  locale: string
  journals: Array<{ id: number; name: string }>
  typeOptions: Array<{ value: string; label: string }>
  t: Messages['account']['submit']
}

const initial: SubmissionState = { status: 'idle' }

export function SubmitForm({ locale, journals, typeOptions, t }: Props) {
  const [state, action, pending] = useActionState(submitManuscript, initial)
  const bad = (field: string) => state.status === 'error' && state.field === field

  if (journals.length === 0) return <p className="ac-muted">{t.noJournals}</p>

  return (
    <form action={action} className="ac-form" aria-busy={pending}>
      <input type="hidden" name="locale" value={locale} />

      {state.status === 'error' && state.code && (
        <div className="ac-error" role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          {t.errors[state.code]}
        </div>
      )}

      <div className="ac-field">
        <label htmlFor="sf-title">{t.fieldTitle}</label>
        <input id="sf-title" name="title" required minLength={5} maxLength={300} aria-invalid={bad('title')} />
      </div>

      <div className="ac-field-row">
        <div className="ac-field">
          <label htmlFor="sf-type">{t.fieldType}</label>
          <select id="sf-type" name="type" defaultValue="journal-article" aria-invalid={bad('type')}>
            {typeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="ac-field">
          <label htmlFor="sf-journal">{t.fieldJournal}</label>
          <select id="sf-journal" name="journal" required defaultValue="" aria-invalid={bad('journal')}>
            <option value="" disabled>
              {t.selectJournal}
            </option>
            {journals.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ac-field">
        <label htmlFor="sf-abstract">{t.fieldAbstract}</label>
        <textarea
          id="sf-abstract"
          name="abstract"
          rows={7}
          required
          minLength={50}
          maxLength={5000}
          aria-invalid={bad('abstract')}
          aria-describedby="sf-abstract-hint"
        />
        <p id="sf-abstract-hint" className="ac-hint">
          {t.abstractHint}
        </p>
      </div>

      <div className="ac-field-row">
        <div className="ac-field">
          <label htmlFor="sf-keywords">{t.fieldKeywords}</label>
          <input id="sf-keywords" name="keywords" aria-describedby="sf-keywords-hint" />
          <p id="sf-keywords-hint" className="ac-hint">
            {t.keywordsHint}
          </p>
        </div>
        <div className="ac-field">
          <label htmlFor="sf-coauthors">{t.fieldCoAuthors}</label>
          <textarea id="sf-coauthors" name="coAuthors" rows={2} aria-describedby="sf-coauthors-hint" />
          <p id="sf-coauthors-hint" className="ac-hint">
            {t.coAuthorsHint}
          </p>
        </div>
      </div>

      <div className="ac-field">
        <label htmlFor="sf-file">{t.fieldFile}</label>
        <input
          id="sf-file"
          name="manuscript"
          type="file"
          required
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          aria-describedby="sf-file-hint"
        />
        <p id="sf-file-hint" className="ac-hint">
          {t.fileHint}
        </p>
      </div>

      <button type="submit" className="ac-btn" disabled={pending}>
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  )
}
