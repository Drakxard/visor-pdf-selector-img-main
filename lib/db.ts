import { Pool } from 'pg'

// Reuse a single Pool across hot-reloads in Next.js dev
let pool: Pool | undefined

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: Pool | undefined
}

export function getPool(): Pool {
  if (!global.__dbPool) {
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new Error('DATABASE_URL no está definido')
    }
    // Ensure SSL for Neon if not already provided via query params
    const connStr = url.includes('sslmode=')
      ? url
      : (url.includes('?') ? `${url}&sslmode=require` : `${url}?sslmode=require`)

    global.__dbPool = new Pool({ connectionString: connStr })
  }
  return global.__dbPool!
}

// Returns a pool if DATABASE_URL is configured; otherwise null.
export function getPoolIfConfigured(): Pool | null {
  try {
    const url = process.env.DATABASE_URL
    if (!url) return null
    return getPool()
  } catch (e) {
    try { console.warn('[db] Pool not configured or failed to init', e) } catch {}
    return null
  }
}
