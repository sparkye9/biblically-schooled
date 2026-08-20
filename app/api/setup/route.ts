import { randomBytes, scryptSync } from 'crypto'
import { NextResponse } from 'next/server'
import { sql, ensureSchema } from '@/lib/db'
import { households } from '@/lib/seed'

export async function GET() {
  if (!sql) {
    return NextResponse.json({
      connected: false,
      households: households.map((h) => ({ id: h.id, name: h.name, momName: h.momName, configured: false })),
    })
  }

  await ensureSchema()
  const rows = await sql`SELECT household_id FROM households_auth`
  const configured = new Set(rows.map((r) => r.household_id as string))

  return NextResponse.json({
    connected: true,
    households: households.map((h) => ({
      id: h.id,
      name: h.name,
      momName: h.momName,
      configured: configured.has(h.id),
    })),
  })
}

export async function POST(request: Request) {
  if (!sql) {
    return NextResponse.json(
      {
        error:
          'No database connected yet. Attach a Postgres database in the Vercel dashboard (Storage tab), then redeploy.',
      },
      { status: 503 },
    )
  }

  const body = await request.json().catch(() => null)
  const householdId = String(body?.householdId ?? '')
  const email = String(body?.email ?? '')
    .trim()
    .toLowerCase()
  const password = String(body?.password ?? '')

  if (!households.some((h) => h.id === householdId)) {
    return NextResponse.json({ error: 'Unknown household.' }, { status: 400 })
  }
  if (!email.includes('@') || password.length < 8) {
    return NextResponse.json(
      { error: 'Enter a valid email and a password of at least 8 characters.' },
      { status: 400 },
    )
  }

  await ensureSchema()

  const existing = await sql`SELECT household_id FROM households_auth WHERE household_id = ${householdId}`
  if (existing.length > 0) {
    return NextResponse.json({ error: 'This profile already has a login.' }, { status: 409 })
  }
  const existingEmail = await sql`SELECT household_id FROM households_auth WHERE email = ${email}`
  if (existingEmail.length > 0) {
    return NextResponse.json({ error: 'That email is already used by another profile.' }, { status: 409 })
  }

  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')

  await sql`
    INSERT INTO households_auth (household_id, email, password_hash, password_salt)
    VALUES (${householdId}, ${email}, ${hash}, ${salt})
  `

  return NextResponse.json({ ok: true })
}
