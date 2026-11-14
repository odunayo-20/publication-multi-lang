import { withPayload } from '@payloadcms/next/withPayload'

// CSP is intentionally deferred to the hardening phase (needs nonce work with Next).
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  async redirects() {
    // Temporary: Accept-Language detection comes with the i18n phase.
    return [{ source: '/', destination: '/en', permanent: false }]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
