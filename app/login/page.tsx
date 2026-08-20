'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { BookHeart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-5 flex flex-col items-center text-center">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <BookHeart className="size-5" />
          </span>
          <h1 className="mt-3 font-serif text-2xl font-semibold">Biblically Schooled</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your family&apos;s homeschool
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault()
            setError('')
            setLoading(true)
            const result = await signIn('credentials', {
              email,
              password,
              redirect: false,
            })
            setLoading(false)
            if (!result || result.error) {
              setError('That email and password don’t match.')
              return
            }
            router.push(searchParams.get('from') || '/')
            router.refresh()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive"
            >
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          First time here?{' '}
          <a href="/setup" className="font-semibold underline">
            Set up your family logins
          </a>
        </p>
      </Card>
    </div>
  )
}
