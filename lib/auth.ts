import { scryptSync, timingSafeEqual } from 'crypto'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { sql, ensureSchema } from './db'

function verifyPassword(password: string, salt: string, storedHash: string) {
  const derived = scryptSync(password, salt, 64)
  const stored = Buffer.from(storedHash, 'hex')
  return derived.length === stored.length && timingSafeEqual(derived, stored)
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!sql) return null
        const email = String(credentials?.email ?? '')
          .trim()
          .toLowerCase()
        const password = String(credentials?.password ?? '')
        if (!email || !password) return null

        await ensureSchema()
        const rows = await sql`
          SELECT household_id, email, password_hash, password_salt
          FROM households_auth WHERE email = ${email}
        `
        const row = rows[0]
        if (!row) return null
        if (!verifyPassword(password, row.password_salt, row.password_hash)) return null

        return { id: row.household_id, email: row.email }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.householdId = user.id
      return token
    },
    session({ session, token }) {
      if (session.user) session.user.householdId = token.householdId as string
      return session
    },
  },
})
