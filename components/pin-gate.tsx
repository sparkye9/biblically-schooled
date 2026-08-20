'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock } from 'lucide-react'

const SESSION_KEY = 'biblically-schooled-unlocked'

export function PinGate({ children }: { children: React.ReactNode }) {
  const { viewPin } = useStore()
  const [checked, setChecked] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [entry, setEntry] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!viewPin) {
      setUnlocked(true)
    } else {
      setUnlocked(sessionStorage.getItem(SESSION_KEY) === viewPin)
    }
    setChecked(true)
  }, [viewPin])

  // Avoid flashing protected content before we've checked the PIN.
  if (!checked) return null
  if (!viewPin || unlocked) return <>{children}</>

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (entry === viewPin) {
            sessionStorage.setItem(SESSION_KEY, viewPin)
            setUnlocked(true)
          } else {
            setError(true)
            setEntry('')
          }
        }}
        className="w-full max-w-xs space-y-4 rounded-3xl border border-border bg-card p-6 text-center shadow-sm"
      >
        <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Lock className="size-5" />
        </span>
        <h1 className="font-serif text-xl font-semibold">Enter PIN</h1>
        <p className="text-sm text-muted-foreground">This homeschool is locked.</p>
        <Input
          type="password"
          inputMode="numeric"
          autoFocus
          value={entry}
          onChange={(event) => {
            setEntry(event.target.value)
            setError(false)
          }}
          className="text-center text-lg tracking-widest"
          maxLength={12}
        />
        {error && (
          <p role="alert" className="text-sm font-semibold text-destructive">
            Incorrect PIN.
          </p>
        )}
        <Button type="submit" className="w-full" disabled={!entry}>
          Unlock
        </Button>
      </form>
    </div>
  )
}
