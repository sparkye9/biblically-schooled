'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Plus, Smile, Trash2 } from 'lucide-react'
import type { Grade } from '@/lib/curriculum/types'
import { pathwayFor, type LearningProfile } from '@/lib/plan/day-plan'
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
      <PageHeader eyebrow={`${store.childrenInView.length} learner${store.childrenInView.length === 1 ? "" : "s"}, each on their own pathway`} title="Students" description="Each child follows their own pathway. Adjust the level or pace per subject — nothing assumes children at the same grade are identical." />
      <div className="grid gap-4">
        {store.childrenInView.map((c) => (
          <StudentCard key={c.id} child={c} />
        ))}
      </div>
      <Deactivated />
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

      <ProfileToggles child={child} />

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
        <button type="button" onClick={() => store.updateChild(child.id, { active: false })} className="rounded-full border border-border px-3 py-1 text-xs font-bold">
          Deactivate
        </button>
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

const PROFILE_OPTIONS: { key: keyof LearningProfile; label: string; help: string; grades?: Grade[] }[] = [
  { key: 'handwriting', label: 'Handwriting & number formation', help: 'A short daily block: sky-writing, a tracing/copying page twice a week, fine-motor play.', grades: ['pre-k', 'k'] },
  { key: 'languageBuilding', label: 'Language building', help: '5 minutes a day of picture talk, following directions, sentence building, retelling, and “why” questions — mostly games and conversation.' },
  { key: 'accessSupports', label: 'Access supports in every lesson', help: 'Beginning–middle–end structure, one instruction at a time, a finished example first, movement breaks, picture choices, less copying. Same grade-level lessons.' },
]

function ProfileToggles({ child }: { child: StoredChild }) {
  const store = useStore()
  const base = pathwayFor(child.gradeBand)
  const profile = child.profile ?? {}
  const value = (k: keyof LearningProfile) => profile[k] ?? (k === 'handwriting' ? base === 'pre-k' || base === 'k' : false)
  return (
    <div className="mt-4">
      <p className="text-sm font-bold">What the curriculum adds for {child.name}</p>
      <p className="text-xs text-muted-foreground">These change how lessons are delivered and what is added — never the grade level. (Use the pathway settings above to change level or pace.)</p>
      <div className="mt-2 grid gap-2 md:grid-cols-3">
        {PROFILE_OPTIONS.filter((o) => !o.grades || o.grades.includes(base)).map((o) => (
          <label key={o.key} className="flex gap-2 rounded-xl border border-border p-3 text-sm">
            <input
              type="checkbox"
              checked={value(o.key)}
              onChange={(e) => store.updateChild(child.id, { profile: { ...profile, [o.key]: e.target.checked } })}
              className="mt-0.5 size-5 shrink-0 accent-[var(--primary)]"
            />
            <span>
              <span className="font-semibold">{o.label}</span>
              <span className="block text-xs text-muted-foreground">{o.help}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

/** Deactivated learners and households: hidden everywhere else, records kept, one tap to bring back. */
function Deactivated() {
  const store = useStore()
  const kids = store.children.filter((c) => c.active === false || !store.households.some((h) => h.id === c.householdId))
  const homes = store.allHouseholds.filter((h) => h.active === false)
  if (!kids.length && !homes.length) return null
  return (
    <Card className="bg-muted/40">
      <h2 className="font-serif text-lg font-semibold">Deactivated</h2>
      <p className="text-sm text-muted-foreground">Hidden from Today, This Week, printing, and progress pickers. Their lessons, progress, and notes are kept.</p>
      <ul className="mt-2 divide-y divide-border text-sm">
        {homes.map((h) => (
          <li key={h.id} className="flex items-center gap-3 py-2">
            <span className="flex-1">
              <b>{h.momName}’s homeschool</b>
            </span>
            <button type="button" onClick={() => store.setHouseholdActive(h.id, true)} className="rounded-full border border-border px-3 py-1 text-xs font-bold">
              Reactivate
            </button>
          </li>
        ))}
        {kids.map((c) => {
          const homeOff = !store.households.some((h) => h.id === c.householdId)
          return (
            <li key={c.id} className="flex items-center gap-3 py-2">
              <ChildAvatar child={c} size="sm" />
              <span className="flex-1">
                <b>{c.name}</b> · {c.grade}
                {homeOff && c.active !== false && <span className="text-muted-foreground"> · hidden with {store.allHouseholds.find((h) => h.id === c.householdId)?.momName}’s homeschool</span>}
              </span>
              {c.active === false && (
                <button type="button" onClick={() => store.updateChild(c.id, { active: true })} className="rounded-full border border-border px-3 py-1 text-xs font-bold">
                  Reactivate
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
