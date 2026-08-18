'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { accentBg } from '@/lib/ui'
import { PageHeader, ChildAvatar } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Child, ChildColor } from '@/lib/types'
import {
  Check,
  Eye,
  HeartHandshake,
  Home,
  Plus,
  RotateCcw,
  UserPlus,
  Users2,
} from 'lucide-react'

const CHILD_COLORS: { value: ChildColor; label: string }[] = [
  { value: 'child-alijah', label: 'Blue' },
  { value: 'child-olori', label: 'Rose' },
  { value: 'child-seraiah', label: 'Sage' },
  { value: 'child-amelia', label: 'Gold' },
]

const GRADE_BANDS: { value: Child['gradeBand']; grade: string; label: string }[] = [
  { value: 'pre-k', grade: 'Pre-K', label: 'Pre-K' },
  { value: 'k', grade: 'Kindergarten', label: 'Kindergarten' },
  { value: '1st', grade: '1st Grade', label: '1st Grade' },
]

export default function SettingsPage() {
  const store = useStore()

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Settings & Profiles"
        description="Manage the moms and children across your homeschools, switch who you're planning for, and keep everyone's rhythm running smoothly."
      />

      <div className="space-y-8">
        <HouseholdProfiles />
        <div className="grid gap-5 lg:grid-cols-2">
          <AddHousehold />
          <AddChild />
        </div>
        <DataCard reset={store.reset} />
      </div>
    </div>
  )
}

function HouseholdProfiles() {
  const store = useStore()

  return (
    <section>
      <h2 className="mb-3 font-serif text-xl font-semibold text-foreground">
        Households
      </h2>
      <div className="grid gap-5 md:grid-cols-2">
        {store.households.map((h) => {
          const kids = store.children.filter((c) => c.householdId === h.id)
          const isActive = store.currentView === h.id
          return (
            <Card key={h.id} className="overflow-hidden p-0">
              <div className="flex items-center gap-4 border-b border-border bg-primary/5 p-5">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-xl font-bold text-primary">
                  {h.momInitial}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-xl font-semibold text-foreground">
                      {h.momName}
                    </h3>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
                        <Check className="size-3" /> Viewing
                      </span>
                    )}
                    {h.away && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
                        Away
                      </span>
                    )}
                  </div>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Home className="size-3.5" /> {h.name}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {kids.length} {kids.length === 1 ? 'child' : 'children'}
                  </p>
                  {kids.length === 0 ? (
                    <p className="rounded-xl bg-muted/50 px-3 py-3 text-center text-sm text-muted-foreground">
                      No children yet.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {kids.map((child) => (
                        <li
                          key={child.id}
                          className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5"
                        >
                          <ChildAvatar child={child} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-foreground">
                              {child.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {child.grade}
                            </p>
                          </div>
                          {child.childMode && (
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                              style={accentBg(child.color, 0.2)}
                            >
                              Child Mode
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    <HeartHandshake className="size-4 text-primary" />
                    <span className="font-medium text-foreground">Away today</span>
                    <span className="text-muted-foreground">— pause this week&apos;s plan</span>
                  </div>
                  <Switch
                    checked={!!h.away}
                    onCheckedChange={() => store.toggleAway(h.id)}
                  />
                </div>

                <Button
                  variant={isActive ? 'secondary' : 'outline'}
                  className="w-full gap-1.5"
                  onClick={() => store.setActiveMom(h.id)}
                  disabled={isActive}
                >
                  <Eye className="size-4" />
                  {isActive ? 'Currently viewing' : `Plan as ${h.momName}`}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function AddHousehold() {
  const store = useStore()
  const [momName, setMomName] = useState('')
  const [name, setName] = useState('')

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Users2 className="size-4" />
        </span>
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Add a household
        </h2>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!momName.trim()) return
          store.addHousehold(name.trim(), momName.trim())
          setMomName('')
          setName('')
        }}
        className="space-y-3"
      >
        <div className="space-y-1.5">
          <Label htmlFor="mom-name">Mom&apos;s name</Label>
          <Input
            id="mom-name"
            value={momName}
            onChange={(e) => setMomName(e.target.value)}
            placeholder="e.g. Grace"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="home-name">Homeschool name (optional)</Label>
          <Input
            id="home-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Defaults to “Grace’s Homeschool”"
          />
        </div>
        <Button type="submit" className="w-full gap-1.5" disabled={!momName.trim()}>
          <Plus className="size-4" /> Add household
        </Button>
      </form>
    </Card>
  )
}

function AddChild() {
  const store = useStore()
  const [name, setName] = useState('')
  const [householdId, setHouseholdId] = useState(
    store.currentView === 'shared' ? store.households[0]?.id : store.currentView,
  )
  const [gradeBand, setGradeBand] = useState<Child['gradeBand']>('pre-k')
  const [color, setColor] = useState<ChildColor>('child-amelia')

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <UserPlus className="size-4" />
        </span>
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Add a child
        </h2>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim() || !householdId) return
          const grade =
            GRADE_BANDS.find((g) => g.value === gradeBand)?.grade ?? 'Pre-K'
          store.addChild({ name: name.trim(), grade, gradeBand, householdId, color })
          setName('')
        }}
        className="space-y-3"
      >
        <div className="space-y-1.5">
          <Label htmlFor="child-name">Child&apos;s name</Label>
          <Input
            id="child-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Amelia"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Household</Label>
            <Select
              value={householdId}
              onValueChange={(v) => v && setHouseholdId(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {store.households.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.momName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Grade</Label>
            <Select
              value={gradeBand}
              onValueChange={(v) => setGradeBand(v as Child['gradeBand'])}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GRADE_BANDS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Color</Label>
          <div className="flex gap-2">
            {CHILD_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-label={c.label}
                aria-pressed={color === c.value}
                onClick={() => setColor(c.value)}
                className="flex size-9 items-center justify-center rounded-full transition-transform hover:scale-105"
                style={{
                  backgroundColor: `var(--${c.value})`,
                  boxShadow:
                    color === c.value ? '0 0 0 3px var(--background), 0 0 0 5px var(--foreground)' : 'none',
                }}
              >
                {color === c.value && <Check className="size-4 text-white" />}
              </button>
            ))}
          </div>
        </div>
        <Button
          type="submit"
          className="w-full gap-1.5"
          disabled={!name.trim() || !householdId}
        >
          <Plus className="size-4" /> Add child
        </Button>
      </form>
    </Card>
  )
}

function DataCard({ reset }: { reset: () => void }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Reset demo data
          </h2>
          <p className="text-sm text-muted-foreground">
            Restore the original households, children, and lessons. This clears any
            changes you&apos;ve made.
          </p>
        </div>
        {confirming ? (
          <div className="flex shrink-0 gap-2">
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="gap-1.5"
              onClick={() => {
                reset()
                setConfirming(false)
              }}
            >
              <RotateCcw className="size-4" /> Confirm reset
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="shrink-0 gap-1.5"
            onClick={() => setConfirming(true)}
          >
            <RotateCcw className="size-4" /> Reset
          </Button>
        )}
      </div>
    </Card>
  )
}
