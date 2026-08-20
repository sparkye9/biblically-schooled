'use client'

import { useEffect, useState } from 'react'
import { ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface HouseholdSetupInfo {
  id: string
  name: string
  momName: string
  configured: boolean
}

export default function SetupPage() {
  const [connected, setConnected] = useState<boolean | null>(null)
  const [households, setHouseholds] = useState<HouseholdSetupInfo[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch('/api/setup')
      .then((res) => res.json())
      .then((data) => {
        setConnected(Boolean(data?.connected))
        setHouseholds(Array.isArray(data?.households) ? data.households : [])
      })
      .catch(() => {
        setConnected(false)
        setHouseholds([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const allConfigured = households.length > 0 && households.every((h) => h.configured)

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 py-10">
      <div className="text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <ShieldCheck className="size-5" />
        </span>
        <h1 className="mt-3 font-serif text-2xl font-semibold">Set up your family logins</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One login per household. Do this once, from any device.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-sm text-muted-foreground">Loading…</p>
      ) : connected === false ? (
        <Card className="p-5 text-sm">
          <p className="font-bold text-foreground">No database connected yet</p>
          <p className="mt-1 text-muted-foreground">
            Attach a Postgres database to this project in the Vercel dashboard (Project &rarr;
            Storage &rarr; Create Database &rarr; Postgres), then redeploy and reload this page.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {households.map((h) => (
            <HouseholdSetupCard key={h.id} household={h} onSaved={load} />
          ))}
        </div>
      )}

      {connected && allConfigured && (
        <Card className="flex items-center gap-3 p-5">
          <CheckCircle2 className="size-5 text-primary" />
          <div>
            <p className="font-bold text-foreground">All set</p>
            <p className="text-sm text-muted-foreground">
              Both family logins are ready.{' '}
              <a href="/login" className="font-semibold underline">
                Go to sign in
              </a>
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

function HouseholdSetupCard({
  household,
  onSaved,
}: {
  household: HouseholdSetupInfo
  onSaved: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  if (household.configured) {
    return (
      <Card className="flex items-center gap-3 p-5">
        <CheckCircle2 className="size-5 text-primary" />
        <div>
          <p className="font-bold text-foreground">{household.name}</p>
          <p className="text-sm text-muted-foreground">Login already set up.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <p className="font-bold text-foreground">{household.name}</p>
      <p className="mb-3 text-sm text-muted-foreground">
        Create {household.momName}&apos;s login.
      </p>
      <form
        className="space-y-3"
        onSubmit={async (event) => {
          event.preventDefault()
          setError('')
          setSaving(true)
          const res = await fetch('/api/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ householdId: household.id, email, password }),
          })
          setSaving(false)
          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            setError(data.error || 'Something went wrong.')
            return
          }
          onSaved()
        }}
      >
        <div className="space-y-2">
          <Label htmlFor={`email-${household.id}`}>Email</Label>
          <Input
            id={`email-${household.id}`}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`password-${household.id}`}>Password</Label>
          <Input
            id={`password-${household.id}`}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
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
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saving ? 'Saving…' : `Save ${household.momName}'s login`}
        </Button>
      </form>
    </Card>
  )
}
