'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Plus, Printer, Trash2 } from 'lucide-react'
import { getBibleWeek, unitForWeek } from '@/lib/curriculum/bible'
import { getEnrichment } from '@/lib/curriculum/enrichment'
import { LESSON_DAY_NAMES, type LessonDay } from '@/lib/curriculum/types'
import { lessonsFor } from '@/lib/plan/day-plan'
import {
  ENRICHMENT_LABELS,
  TOTAL_LESSON_DAYS,
  WEEKDAY_LABELS,
  calendarExpectedIndex,
  indexOf,
  parseISO,
  positionOf,
  projectedFinish,
} from '@/lib/plan/schedule'
import * as logic from '@/lib/state/logic'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Card, ChildAvatar, PageHeader, Pill, Section } from '@/components/primitives'

const DAYS: LessonDay[] = [0, 1, 2, 3]

export default function WeekPage() {
  const store = useStore()
  const here = positionOf(store.pointer)
  const [week, setWeek] = useState(here.week)
  const bible = getBibleWeek(week)
  const unit = unitForWeek(week)
  const enrich = getEnrichment(week)
  const schoolDays = store.schedule.map((d, i) => ({ ...d, i })).filter((d) => d.kind === 'school')
  const learners = store.childrenInView.map(logic.learnerOf)
  const groups = new Map<string, typeof learners>()
  learners.forEach((l) => groups.set(l.grade + JSON.stringify(l.adjust ?? {}), [...(groups.get(l.grade + JSON.stringify(l.adjust ?? {})) ?? []), l]))

  const materials = new Set<string>()
  for (const l of learners) for (const d of DAYS) for (const lesson of lessonsFor(l, week, d)) lesson.guide.materials.forEach((m) => m !== 'Worksheet' && materials.add(m))
  schoolDays.forEach((sd) => {
    const kind = sd.enrichment
    const a = kind === 'science' ? enrich.science : kind === 'art' ? enrich.art : kind === 'social-studies' ? enrich.socialStudies : kind === 'life-skills' || kind === 'review' ? enrich.lifeSkill : null
    a?.materials.forEach((m) => materials.add(m))
  })

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={`Unit ${unit.number}: ${unit.title}`} title={`Week ${week}: ${bible.title}`} description={`${bible.passage} · Memory verse ${bible.verse.ref}`}>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Previous week" disabled={week <= 1} onClick={() => setWeek((w) => w - 1)} className="rounded-full border border-border p-2 disabled:opacity-40">
            <ChevronLeft className="size-4" />
          </button>
          {week !== here.week && (
            <button type="button" onClick={() => setWeek(here.week)} className="rounded-full border border-border px-3 py-1.5 text-xs font-bold">
              Back to our week
            </button>
          )}
          <button type="button" aria-label="Next week" disabled={week >= 36} onClick={() => setWeek((w) => w + 1)} className="rounded-full border border-border p-2 disabled:opacity-40">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </PageHeader>

      <OurPlace />

      <Section
        title="The week at a glance"
        action={
          <Link href={`/print?week=${week}`} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
            <Printer className="size-3.5" /> Print this week
          </Link>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          {DAYS.map((d) => {
            const index = indexOf(week, d)
            const log = store.dayLog[index]
            const isNext = index === store.pointer
            const sd = schoolDays[d]
            return (
              <Card key={d} className={cn(isNext && 'border-primary ring-2 ring-primary/20')}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold">
                    Day {d + 1}: {LESSON_DAY_NAMES[d]}
                    {sd && <span className="ml-1 text-xs font-normal text-muted-foreground">· usually {WEEKDAY_LABELS[sd.i]}</span>}
                  </p>
                  {log ? <Pill tone="sage">Taught {parseISO(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Pill> : isNext ? <Pill tone="gold">Up next</Pill> : null}
                </div>
                <p className="mt-2 text-sm">
                  <b>Bible:</b> {bible.days[d]}
                </p>
                {[...groups.values()].map((g) => {
                  const [, lit, math] = lessonsFor(g[0], week, d)
                  return (
                    <div key={g.map((x) => x.id).join()} className="mt-2 rounded-xl bg-muted/50 p-2 text-sm">
                      <p className="text-xs font-bold text-muted-foreground">{g.map((x) => x.name).join(' & ')}</p>
                      <p>
                        <b>Literacy:</b> {lit.title} <span className="text-muted-foreground">({lit.childTask})</span>
                      </p>
                      <p>
                        <b>Math:</b> {math.title} <span className="text-muted-foreground">({math.childTask})</span>
                      </p>
                    </div>
                  )
                })}
                {sd?.enrichment && <p className="mt-2 text-sm text-muted-foreground">+ {ENRICHMENT_LABELS[sd.enrichment]} (optional)</p>}
              </Card>
            )
          })}
        </div>
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-serif text-lg font-semibold">Gather this week</h2>
          <p className="text-xs text-muted-foreground">Everything for the whole week, once. Household substitutes are fine.</p>
          <ul className="mt-2 columns-1 space-y-1 text-sm sm:columns-2">
            {[...materials].map((m) => (
              <li key={m} className="break-inside-avoid">
                • {m}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-serif text-lg font-semibold">Enrichment this week</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>
              <b>Science:</b> {enrich.science.title}
            </li>
            <li>
              <b>Art:</b> {enrich.art.title}
            </li>
            <li>
              <b>Social studies:</b> {enrich.socialStudies.title}
            </li>
            <li>
              <b>Life skill:</b> {enrich.lifeSkill.title}
            </li>
            <li>
              <b>Library mission:</b> {enrich.library.mission}
            </li>
          </ul>
        </Card>
      </div>

      <CustomActivities week={week} />
    </div>
  )
}

function OurPlace() {
  const store = useStore()
  const here = positionOf(store.pointer)
  const cal = positionOf(calendarExpectedIndex(store.schoolYearStartDate, store.todayIso, store.schedule, store.breaks))
  const diff = cal.index - store.pointer
  const finish = projectedFinish(store.pointer, store.todayIso, store.schedule, store.breaks)
  const [w, setW] = useState(here.week)
  const [d, setD] = useState<LessonDay>(here.day)
  return (
    <Card className="scroll-mt-20" >
      <div id="our-place" className="flex items-start gap-3">
        <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-lg font-semibold">Our place</h2>
          <p className="text-sm">
            Next lesson: <b>Week {here.week}, Day {here.day + 1}</b>.{' '}
            {diff > 0
              ? `The calendar is ${diff} lesson day${diff === 1 ? '' : 's'} ahead of you — that’s okay.`
              : diff < 0
                ? `You’re ${-diff} lesson day${diff === -1 ? '' : 's'} ahead of the calendar.`
                : 'Right on the calendar.'}{' '}
            At this pace you’ll finish around <b>{parseISO(finish).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</b>.
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-2 text-sm">
            <label className="grid gap-1">
              <span className="text-xs font-bold text-muted-foreground">Week</span>
              <select value={w} onChange={(e) => setW(Number(e.target.value))} className="rounded-lg border border-border bg-card px-2 py-1.5">
                {Array.from({ length: 36 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Week {i + 1}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-bold text-muted-foreground">Day</span>
              <select value={d} onChange={(e) => setD(Number(e.target.value) as LessonDay)} className="rounded-lg border border-border bg-card px-2 py-1.5">
                {DAYS.map((x) => (
                  <option key={x} value={x}>
                    Day {x + 1} · {LESSON_DAY_NAMES[x]}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={indexOf(w, d) === store.pointer}
              onClick={() => store.setPointer(Math.min(indexOf(w, d), TOTAL_LESSON_DAYS - 1))}
              className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-40"
            >
              Move our place here
            </button>
            <Link href="/restart" className="rounded-full border border-border px-4 py-2 text-xs font-bold">
              We’re starting again…
            </Link>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Moving your place never marks lessons done or deletes anything.</p>
        </div>
      </div>
    </Card>
  )
}

function CustomActivities({ week }: { week: number }) {
  const store = useStore()
  const [title, setTitle] = useState('')
  const [day, setDay] = useState<LessonDay>(0)
  const [kids, setKids] = useState<string[]>(store.childrenInView.map((c) => c.id))
  const list = store.customActivities.filter((a) => a.week === week)
  return (
    <Section title="Our own activities">
      <Card>
        <p className="text-sm text-muted-foreground">Add a field trip, co-op project, or anything else. It shows up on Today for the children you choose.</p>
        <form
          className="mt-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!title.trim() || !kids.length) return
            store.addCustomActivity({ title: title.trim(), subject: 'other', week, day, childIds: kids })
            setTitle('')
          }}
        >
          <label className="grid min-w-[12rem] flex-1 gap-1 text-sm">
            <span className="text-xs font-bold text-muted-foreground">Activity</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Nature walk at the park" className="rounded-lg border border-border bg-card px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-bold text-muted-foreground">Day</span>
            <select value={day} onChange={(e) => setDay(Number(e.target.value) as LessonDay)} className="rounded-lg border border-border bg-card px-2 py-2">
              {DAYS.map((x) => (
                <option key={x} value={x}>
                  Day {x + 1}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-1">
            {store.childrenInView.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={kids.includes(c.id)}
                onClick={() => setKids((k) => (k.includes(c.id) ? k.filter((x) => x !== c.id) : [...k, c.id]))}
                className={cn('rounded-full border px-3 py-1.5 text-xs font-bold', kids.includes(c.id) ? 'border-primary bg-sage-soft text-primary' : 'border-border')}
              >
                {c.name}
              </button>
            ))}
          </div>
          <button type="submit" className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
            <Plus className="size-3.5" /> Add
          </button>
        </form>
        {list.length > 0 && (
          <ul className="mt-4 divide-y divide-border">
            {list.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-2 text-sm">
                <span className="flex -space-x-1.5">
                  {store.children
                    .filter((c) => a.childIds.includes(c.id))
                    .map((c) => (
                      <ChildAvatar key={c.id} child={c} size="sm" />
                    ))}
                </span>
                <span className="flex-1">
                  <b>{a.title}</b> · Day {a.day + 1}
                </span>
                <button type="button" aria-label={`Remove ${a.title}`} onClick={() => store.removeCustomActivity(a.id)} className="rounded-full p-2 text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Section>
  )
}
