'use client'

import { Download, Quote, Share2, Check, Copy, X, Mail } from 'lucide-react'
import { useState } from 'react'

import type { Locale } from '@/i18n/config'
import { messages } from '@/i18n/messages'

type ArticleActionsProps = {
  locale: Locale
  title: string
  url: string
  pdfUrl?: string | null
  doi?: string | null
  bibtexString: string
  apaString: string
}

export function ArticleActions({
  locale,
  title,
  url,
  pdfUrl,
  doi,
  bibtexString,
  apaString,
}: ArticleActionsProps) {
  const t = messages[locale].articleDetail
  const [citeOpen, setCiteOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'bibtex' | 'apa'>('bibtex')
  const [copiedType, setCopiedType] = useState<string | null>(null)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedType(type)
      setTimeout(() => setCopiedType(null), 2500)
    } catch {
      // fallback
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // fallback
    }
  }

  return (
    <>
      {/* Top Header Buttons (Matching Screen 3) */}
      <div className="acad-article-header-actions">
        {/* Download PDF button */}
        {pdfUrl ? (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="acad-btn-download-pdf">
            <Download className="w-4 h-4 mr-1.5" aria-hidden="true" />
            <span>{t.downloadPdf}</span>
          </a>
        ) : doi ? (
          <a
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="acad-btn-download-pdf"
          >
            <Download className="w-4 h-4 mr-1.5" aria-hidden="true" />
            <span>{t.downloadPdf}</span>
          </a>
        ) : (
          <button type="button" onClick={handleCopyLink} className="acad-btn-download-pdf">
            <Download className="w-4 h-4 mr-1.5" aria-hidden="true" />
            <span>{t.downloadPdf}</span>
          </button>
        )}

        {/* Cite button */}
        <button
          type="button"
          onClick={() => setCiteOpen(true)}
          className="acad-btn-cite-trigger"
          aria-label={t.cite}
        >
          <Quote className="w-4 h-4 mr-1.5" aria-hidden="true" />
          <span>{t.cite}</span>
        </button>
      </div>

      {/* Citation Modal / Popover */}
      {citeOpen && (
        <div className="acad-modal-backdrop" onClick={() => setCiteOpen(false)}>
          <div
            className="acad-cite-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cite-modal-title"
          >
            <div className="acad-cite-modal-header">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-blue-600" aria-hidden="true" />
                <h3 id="cite-modal-title" className="acad-cite-modal-title">
                  {t.citeModalTitle}
                </h3>
                <span className="sr-only">{title}</span>
              </div>
              <button
                type="button"
                onClick={() => setCiteOpen(false)}
                className="acad-modal-close-btn"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab switchers */}
            <div className="acad-cite-tabs">
              <button
                type="button"
                onClick={() => setActiveTab('bibtex')}
                className={`acad-cite-tab ${activeTab === 'bibtex' ? 'is-active' : ''}`}
              >
                BibTeX
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('apa')}
                className={`acad-cite-tab ${activeTab === 'apa' ? 'is-active' : ''}`}
              >
                APA Style
              </button>
            </div>

            {/* Citation Content Box */}
            <div className="acad-cite-content-box">
              <pre className="acad-cite-pre">{activeTab === 'bibtex' ? bibtexString : apaString}</pre>
            </div>

            {/* Modal Footer Actions */}
            <div className="acad-cite-modal-footer">
              <button
                type="button"
                onClick={() => copyToClipboard(activeTab === 'bibtex' ? bibtexString : apaString, activeTab)}
                className="acad-btn-copy-citation"
              >
                {copiedType === activeTab ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 mr-1.5" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" />
                    <span>{activeTab === 'bibtex' ? t.copyBibtex : t.copyApa}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Standalone Sidebar Share Card */
export function ArticleShareCard({ locale, title, url }: { locale: Locale; title: string; url: string }) {
  const t = messages[locale].articleDetail
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Read "${title}":`,
  )}&url=${encodeURIComponent(url)}`

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
    `Check out this academic paper:\n\n${title}\n\n${url}`,
  )}`

  return (
    <div className="acad-sidebar-share-card">
      <h4 className="acad-share-heading">
        <Share2 className="w-4 h-4 mr-1.5 text-blue-600" aria-hidden="true" />
        <span>{t.shareArticle}</span>
      </h4>

      <div className="acad-share-icons-row">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="acad-share-circle-btn share-twitter"
          title="Share on Twitter / X"
          aria-label="Share on X"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="acad-share-circle-btn share-linkedin"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.4 9.74v-8.37H5.06v8.37z" />
          </svg>
        </a>

        <a href={emailUrl} className="acad-share-circle-btn share-email" title="Share via Email">
          <Mail className="w-4 h-4" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="acad-share-circle-btn share-copy"
          title="Copy Link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {copied && <span className="acad-copied-toast-inline">{t.linkCopied}</span>}
    </div>
  )
}
