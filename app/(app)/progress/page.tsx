'use client'

import { useState } from 'react'
import { skillsForGrade } from '@/lib/curriculum/skills'
import type { SkillTrack } from '@/lib/curriculum/types'
import { positionOf } from '@/lib/plan/schedule'
import * as logic from '@/lib/state/logic'
import { SKILL_STATUSES, type SkillStatus } from '@/lib/state/types'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Card, ChildAvatar, PageHeader, Pill, ProgressBar } from '@/components/primitives'

const TONE: Record<SkillStatus, string> = {
  'not-introduced': 'bg-muted text-muted-foreground',
  introduced: 'bg-gold/25',
  practicing: 'bg-sage-soft text-primary',
  independent: 'bg-primary text-primary-foreground',
  'needs-review': 'bg-terracotta-soft',
}

export default function ProgressPage() {
  const store = useStore()
  const [childId, setChildId] = useState(store.childrenInView[0]?.id ?? '')
  const child = store.children.find((c) => c.id === childId) ?? store.childrenInView[0]
  const [week, setWeek] = useState(positionOf(store.pointer).week)
  const [track, setTrack] = useState<SkillTrack>('literacy')
  if (!child) return <PageHeader title="Progress" description="Add a learner on the Students page." />
  const learner = logic.learnerOf(child)
  const gradeFor = track === 'literacy' ? (child.adjust?.literacyGrade ?? learner.grade) : (child.adjust?.mathGrade ?? learner.grade)
  const skills = skillsForGrade(gradeFor).filter((s) => s.track === track && s.week <= Math.max(week, positionOf(store.pointer).week) + 1)
  const summary = logic.weeklySummary(store, child.id, week)
  const counts = SKILL_STATUSES.map((st) => ({ ...st, n: skills.filter((s) => logic.skillStatusOf(store, child.id, s.id) === st.id).length }))
  const legacy = store.legacySkills.filter((s) => s.childId === child.id)

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="By skill, not by worksheet"
        title="Progress"
        description="You decide each skill’s status. Finishing a lesson only ever marks a skill “Introduced” — never mastered."
      />
      <div className="flex flex-wrap gap-2">
        {store.childrenInView.map((c) => (
          <button key={c.id} type="button" aria-pressed={c.id === child.id} onClick={() => setChildId(c.id)} className={cn('flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold', c.id === child.id ? 'border-primary bg-sage-soft' : 'border-border')}>
            <ChildAvatar child={c} size="sm" /> {c.name}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-lg font-semibold">Weekly summary</h2>
          <select value={week} onChange={(e) => setWeek(Number(e.target.value))} aria-label="Week" className="rounded-lg border border-border bg-card px-2 py-1 text-sm">
            {Array.from({ length: 36 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Week {i + 1}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-muted-foreground">{summary.daysTaught} of 4 lesson days taught.</p>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <Line label="Skills introduced" items={summary.introduced} />
          <Line label="Skills practiced" items={summary.practiced} />
          <Line label="Demonstrated independently" items={summary.demonstrated} />
          <Line label="Needing review" items={summary.needsReview} />
          {summary.lightlyCovered.length > 0 && <Line label="Covered on a short day" items={summary.lightlyCovered} />}
        </div>
        <div className="mt-3 rounded-xl bg-sage-soft/50 p-3 text-sm">
          <p className="font-bold">Suggested next steps</p>
          <ul className="mt-1 list-disc pl-5">
            {summary.nextSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-lg font-semibold">Skills</h2>
          <div className="flex gap-1">
            {(['literacy', 'math'] as SkillTrack[]).map((t) => (
              <button key={t} type="button" aria-pressed={track === t} onClick={() => setTrack(t)} className={cn('rounded-full border px-3 py-1 text-xs font-bold capitalize', track === t ? 'border-primary bg-sage-soft text-primary' : 'border-border')}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {counts.map((c) => (
            <span key={c.id} className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', TONE[c.id])}>
              {c.label}: {c.n}
            </span>
          ))}
        </div>
        <div className="mt-2">
          <ProgressBar value={counts.find((c) => c.id === 'independent')!.n} total={skills.length} color={child.color} />
        </div>
        <ul className="mt-3 divide-y divide-border">
          {skills.map((s) => {
            const status = logic.skillStatusOf(store, child.id, s.id)
            const rec = store.skillStatus[child.id]?.[s.id]
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-2 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Week {s.week} · {s.strand}
                    {rec?.by === 'auto' && ' · set to Introduced after the lesson'}
                  </p>
                </div>
                <select
                  aria-label={`Status for ${s.name}`}
                  value={status}
                  onChange={(e) => store.setSkill(child.id, s.id, e.target.value as SkillStatus)}
                  className={cn('rounded-full border-0 px-3 py-1.5 text-xs font-bold', TONE[status])}
                >
                  {SKILL_STATUSES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </li>
            )
          })}
        </ul>
      </Card>

      {legacy.length > 0 && (
        <Card>
          <h2 className="font-serif text-lg font-semibold">From your earlier tracker</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {legacy.map((s) => (
              <Pill key={s.id}>
                {s.name}: {SKILL_STATUSES.find((x) => x.id === s.status)?.label}
              </Pill>
            ))}
          </ul>
        </Card>
      )}

      <Notes childId={child.id} week={week} />
    </div>
  )
}

function Line({ label, items }: { label: string; items: string[] }) {
  return (
    <p>
      <b>{label}:</b> {items.length ? items.join(', ') : <span className="text-muted-foreground">none</span>}
    </p>
  )
}

function Notes({ childId, week }: { childId: string; week: number }) {
  const store = useStore()
  const [worked, setWorked] = useState('')
  const [needs, setNeeds] = useState('')
  const [enjoyed, setEnjoyed] = useState('')
  const notes = store.parentNotes.filter((n) => n.childId === childId)
  return (
    <Card>
      <h2 className="font-serif text-lg font-semibold">Parent notes</h2>
      <form
        className="mt-2 grid gap-2 text-sm sm:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (!worked && !needs && !enjoyed) return
          store.saveNote({ childId, weekNumber: week, worked, needsPractice: needs, enjoyed })
          setWorked('')
          setNeeds('')
          setEnjoyed('')
        }}
      >
        <input value={worked} onChange={(e) => setWorked(e.target.value)} placeholder="What worked" className="rounded-lg border border-border bg-card px-3 py-2" />
        <input value={needs} onChange={(e) => setNeeds(e.target.value)} placeholder="Needs practice" className="rounded-lg border border-border bg-card px-3 py-2" />
        <input value={enjoyed} onChange={(e) => setEnjoyed(e.target.value)} placeholder="Enjoyed" className="rounded-lg border border-border bg-card px-3 py-2" />
        <button type="submit" className="rounded-full bg-primary px-4 py-2 font-bold text-primary-foreground sm:col-span-3 sm:justify-self-start">
          Save note for week {week}
        </button>
      </form>
      <ul className="mt-3 space-y-2 text-sm">
        {notes.map((n) => (
          <li key={n.id} className="rounded-xl bg-muted/50 p-2">
            <b>Week {n.weekNumber}:</b> {n.worked && `Worked: ${n.worked}. `}
            {n.needsPractice && `Practice: ${n.needsPractice}. `}
            {n.enjoyed && `Enjoyed: ${n.enjoyed}.`}
          </li>
        ))}
      </ul>
    </Card>
  )
}
