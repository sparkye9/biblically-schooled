'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Plus, Smile, Trash2 } from 'lucide-react'
import type { Grade } from '@/lib/curriculum/types'
import { pathwayFor } from '@/lib/plan/day-plan'
import { positionOf } from '@/lib/plan/schedule'
import { SUPPORT_OPTIONS, type StoredChild } from '@/lib/state/types'
import { gradeLabel, useStore } from '@/lib/store'
import type { ChildColor, GradeBand } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Card, ChildAvatar, PageHeader } from '@/components/primitives'

const GRADES: Grade[] = ['pre-k', 'k', '1st']
const COLORS: ChildColor[] = ['child-alijah', 'child-olori', 'child-seraiah', 'child-amelia']

export default function StudentsPage() {
  const store = useStore()
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Four learners, four pathways" title="Students" description="Each child follows their own pathway. Adjust the level or pace per subject — nothing assumes children at the same grade are identical." />
      <div className="grid gap-4">
        {store.childrenInView.map((c) => (
          <StudentCard key={c.id} child={c} />
        ))}
      </div>
      <AddStudent />
    </div>
  )
}

function StudentCard({ child }: { child: StoredChild }) {
  const store = useStore()
  const base = pathwayFor(child.gradeBand)
  const adj = child.adjust ?? {}
  const week = positionOf(store.pointer).week
  const [confirm, setConfirm] = useState(false)
  const household = store.households.find((h) => h.id === child.householdId)
  const supports = child.supports ?? []
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <ChildAvatar child={child} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-xl font-semibold">{child.name}</h2>
          <p className="text-sm text-muted-foreground">
            {child.grade} · {household?.momName}’s homeschool
          </p>
        </div>
        <Link href={`/kid/${child.id}`} className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          <Smile className="size-4" /> Open kid view
        </Link>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {(['literacy', 'math'] as const).map((subject) => {
          const gKey = subject === 'literacy' ? 'literacyGrade' : 'mathGrade'
          const oKey = subject === 'literacy' ? 'literacyOffset' : 'mathOffset'
          const g = (adj[gKey] as Grade | undefined) ?? base
          const off = (adj[oKey] as number | undefined) ?? 0
          return (
            <div key={subject} className="rounded-xl border border-border p-3">
              <p className="text-sm font-bold capitalize">{subject} pathway</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <select
                  aria-label={`${child.name} ${subject} level`}
                  value={g}
                  onChange={(e) => store.setAdjust(child.id, { ...adj, [gKey]: e.target.value === base ? undefined : (e.target.value as Grade) })}
                  className="rounded-lg border border-border bg-card px-2 py-1.5"
                >
                  {GRADES.map((x) => (
                    <option key={x} value={x}>
                      {gradeLabel(x)} level
                    </option>
                  ))}
                </select>
                <select
                  aria-label={`${child.name} ${subject} pace`}
                  value={off}
                  onChange={(e) => store.setAdjust(child.id, { ...adj, [oKey]: Number(e.target.value) || undefined })}
                  className="rounded-lg border border-border bg-card px-2 py-1.5"
                >
                  {[-6, -4, -2, -1, 0, 1, 2, 4].map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? 'Same week as family' : n < 0 ? `${-n} week${n === -1 ? '' : 's'} behind (more review)` : `${n} week${n === 1 ? '' : 's'} ahead`}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">This week: Week {Math.min(36, Math.max(1, week + off))} of the {gradeLabel(g)} {subject} plan.</p>
            </div>
          )
        })}
      </div>

      <div className="mt-4">
        <p className="text-sm font-bold">Learning supports (reminders on Today and in kid view)</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SUPPORT_OPTIONS.map((opt) => {
            const on = supports.includes(opt)
            return (
              <button
                key={opt}
                type="button"
                aria-pressed={on}
                onClick={() => store.updateChild(child.id, { supports: on ? supports.filter((s) => s !== opt) : [...supports, opt] })}
                className={cn('rounded-full border px-3 py-1.5 text-xs font-semibold', on ? 'border-primary bg-sage-soft text-primary' : 'border-border')}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={child.lowDistraction} onChange={(e) => store.updateChild(child.id, { lowDistraction: e.target.checked })} className="size-5 accent-[var(--primary)]" />
          Kid view shows one task at a time
        </label>
        {confirm ? (
          <span className="ml-auto flex items-center gap-2">
            Remove {child.name}? Their records stay in your backup.
            <button type="button" onClick={() => store.removeChild(child.id)} className="rounded-full bg-destructive/10 px-3 py-1 font-bold text-destructive">
              Remove
            </button>
            <button type="button" onClick={() => setConfirm(false)} className="rounded-full border border-border px-3 py-1">
              Cancel
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirm(true)} className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
            <Trash2 className="size-3.5" /> Remove
          </button>
        )}
      </div>
    </Card>
  )
}

function AddStudent() {
  const store = useStore()
  const [name, setName] = useState('')
  const [band, setBand] = useState<GradeBand>('pre-k')
  const [household, setHousehold] = useState(store.activeMomHouseholdId)
  return (
    <Card>
      <h2 className="font-serif text-lg font-semibold">Add a learner</h2>
      <form
        className="mt-2 flex flex-wrap items-end gap-2 text-sm"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          store.addChild({
            name: name.trim(),
            gradeBand: band,
            grade: gradeLabel(pathwayFor(band)),
            householdId: household,
            color: COLORS[store.children.length % COLORS.length],
          })
          setName('')
        }}
      >
        <label className="grid flex-1 gap-1">
          <span className="text-xs font-bold text-muted-foreground">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-bold text-muted-foreground">Level</span>
          <select value={band} onChange={(e) => setBand(e.target.value as GradeBand)} className="rounded-lg border border-border bg-card px-2 py-2">
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {gradeLabel(g)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-bold text-muted-foreground">Household</span>
          <select value={household} onChange={(e) => setHousehold(e.target.value)} className="rounded-lg border border-border bg-card px-2 py-2">
            {store.households.map((h) => (
              <option key={h.id} value={h.id}>
                {h.momName}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 font-bold text-primary-foreground">
          <Plus className="size-4" /> Add
        </button>
      </form>
    </Card>
  )
}
