import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sql, ensureSchema } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!sql) return NextResponse.json({ data: null })

  await ensureSchema()
  const rows = await sql`SELECT data FROM app_state WHERE id = 'singleton'`
  return NextResponse.json({ data: rows[0]?.data ?? null })
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!sql) return NextResponse.json({ error: 'No database connected' }, { status: 503 })

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  await ensureSchema()
  await sql`
    INSERT INTO app_state (id, data, updated_at)
    VALUES ('singleton', ${JSON.stringify(body)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
  `
  return NextResponse.json({ ok: true })
}
