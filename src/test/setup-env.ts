// Integration checks talk to a real Postgres. Load .env.local, then prefer Neon's direct
// (unpooled) URL: schema sync stalls on the pooled one.
try {
  process.loadEnvFile('.env.local')
} catch {
  // Variables may already be set in the environment (CI).
}
if (process.env.DATABASE_URL_UNPOOLED) process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED
