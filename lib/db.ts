import { neon } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

export const sql = connectionString ? neon(connectionString) : null

let schemaReady: Promise<void> | null = null

/**
 * Lazily creates the tables real-accounts persistence needs. Safe to call on
 * every request — CREATE TABLE IF NOT EXISTS is a no-op once they exist.
 */
export function ensureSchema(): Promise<void> {
  if (!sql) return Promise.resolve()
  if (!schemaReady) {
    const db = sql
    schemaReady = (async () => {
      await db`
        CREATE TABLE IF NOT EXISTS households_auth (
          household_id text PRIMARY KEY,
          email text UNIQUE NOT NULL,
          password_hash text NOT NULL,
          password_salt text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `
      await db`
        CREATE TABLE IF NOT EXISTS app_state (
          id text PRIMARY KEY,
          data jsonb NOT NULL,
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `
    })()
  }
  return schemaReady
}
