'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Plus, UserPlus, Users } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { ChildColor, GradeBand } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const gradeOptions: { value: GradeBand; label: string }[] = [
  { value: 'pre-k', label: 'Pre-K' },
  { value: 'k', label: 'Kindergarten' },
  { value: '1st', label: '1st Grade' },
]

const colors: { value: ChildColor; label: string }[] = [
  { value: 'child-alijah', label: 'Blue' },
  { value: 'child-olori', label: 'Pink' },
  { value: 'child-seraiah', label: 'Purple' },
  { value: 'child-amelia', label: 'Purple' },
]

export function AddProfileDialog({
  trigger,
  onAdded,
}: {
  trigger?: ReactNode
  onAdded?: (profileId: string) => void
}) {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const [momName, setMomName] = useState('')
  const [profileName, setProfileName] = useState('')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4" /> Add profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const cleanMomName = momName.trim()
            if (!cleanMomName) return
            const id = store.addHousehold(profileName.trim(), cleanMomName)
            store.setActiveMom(id)
            setMomName('')
            setProfileName('')
            setOpen(false)
            onAdded?.(id)
          }}
          className="contents"
        >
          <DialogHeader>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-primary">
              Family profile
            </DialogDescription>
            <DialogTitle className="font-serif text-2xl">Add a homeschool profile</DialogTitle>
            <DialogDescription>
              Profiles keep each family&apos;s children, lessons, and resources organized.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-mom-name">Parent or caregiver name</Label>
              <Input
                id="profile-mom-name"
                value={momName}
                onChange={(event) => setMomName(event.target.value)}
                placeholder="e.g. Damilola"
                autoFocus
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-name">Profile name (optional)</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(event) => setProfileName(event.target.value)}
                placeholder={momName.trim() ? `${momName.trim()}'s Homeschool` : "Family's Homeschool"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!momName.trim()}>
              <Users className="size-4" /> Create profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function AddChildDialog({
  trigger,
  defaultHouseholdId,
  onAdded,
}: {
  trigger?: ReactNode
  defaultHouseholdId?: string
  onAdded?: (childId: string) => void
}) {
  const store = useStore()
  const selectedHousehold =
    store.currentView === 'shared' ? store.activeMomHouseholdId : store.currentView
  const fallbackHousehold =
    defaultHouseholdId || selectedHousehold || store.households[0]?.id || ''
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [gradeBand, setGradeBand] = useState<GradeBand>('pre-k')
  const [householdId, setHouseholdId] = useState(fallbackHousehold)
  const [color, setColor] = useState<ChildColor>('child-alijah')

  useEffect(() => {
    if (open) setHouseholdId(fallbackHousehold)
  }, [fallbackHousehold, open])

  const grade = gradeOptions.find((option) => option.value === gradeBand)?.label ?? 'Pre-K'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <UserPlus className="size-4" /> Add child
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!name.trim() || !householdId) return
            const id = store.addChild({
              name: name.trim(),
              grade,
              gradeBand,
              householdId,
              color,
            })
            setName('')
            setGradeBand('pre-k')
            setOpen(false)
            onAdded?.(id)
          }}
          className="contents"
        >
          <DialogHeader>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-primary">
              Learner profile
            </DialogDescription>
            <DialogTitle className="font-serif text-2xl">Add a child</DialogTitle>
            <DialogDescription>
              Choose the family profile and grade so lessons can be assigned correctly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="child-name">Child&apos;s name</Label>
              <Input
                id="child-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="First name"
                autoFocus
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-household">Family profile</Label>
              <select
                id="child-household"
                value={householdId}
                onChange={(event) => setHouseholdId(event.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
                required
              >
                {store.households.map((household) => (
                  <option key={household.id} value={household.id}>
                    {household.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-grade">Grade</Label>
              <select
                id="child-grade"
                value={gradeBand}
                onChange={(event) => setGradeBand(event.target.value as GradeBand)}
                className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
              >
                {gradeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Color</legend>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={color === option.value}
                    onClick={() => setColor(option.value)}
                    className="flex flex-col items-center gap-1.5 rounded-xl border p-2 text-xs font-semibold"
                    style={{
                      borderColor: color === option.value ? `var(--${option.value})` : 'var(--border)',
                      backgroundColor:
                        color === option.value
                          ? `color-mix(in oklch, var(--${option.value}) 14%, transparent)`
                          : 'transparent',
                    }}
                  >
                    <span
                      className="size-6 rounded-full"
                      style={{ backgroundColor: `var(--${option.value})` }}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !householdId}>
              <UserPlus className="size-4" /> Add child
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
