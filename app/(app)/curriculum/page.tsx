'use client'

import { useState } from 'react'
import { BIBLE_WEEKS, SEASONAL_LESSONS, UNITS, getBibleWeek } from '@/lib/curriculum/bible'
import { getEnrichment } from '@/lib/curriculum/enrichment'
import { coreLessons } from '@/lib/curriculum/lessons'
import { LITERACY, getLiteracyWeek } from '@/lib/curriculum/literacy'
import { MATH, getMathWeek } from '@/lib/curriculum/math'
import { LESSON_DAY_NAMES, type Grade, type LessonDay } from '@/lib/curriculum/types'
import { positionOf } from '@/lib/plan/schedule'
import { gradeLabel, useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Card, PageHeader, Pill } from '@/components/primitives'
import { TeachingGuideView } from '@/components/teaching-guide'

type Tab = 'map' | 'sequence' | 'week'
const GRADES: Grade[] = ['pre-k', 'k', '1st']

export default function CurriculumPage() {
  const store = useStore()
  const [tab, setTab] = useState<Tab>('week')
  const [week, setWeek] = useState(positionOf(store.pointer).week)
  const [grade, setGrade] = useState<Grade>('1st')
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="36 weeks · 4 units"
        title="Curriculum"
        description="The full year: Bible, literacy, math, and enrichment, with a teaching guide for every lesson."
      />
      <div role="tablist" className="flex gap-1 rounded-full bg-muted p-1 text-sm font-semibold">
        {(
          [
            ['week', 'Week by week'],
            ['map', 'Year map'],
            ['sequence', 'Scope & sequence'],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} type="button" onClick={() => setTab(id)} className={cn('flex-1 rounded-full px-3 py-2', tab === id ? 'bg-card shadow-sm' : 'text-muted-foreground')}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'map' && <YearMap onPick={(w) => { setWeek(w); setTab('week') }} />}
      {tab === 'sequence' && <Sequence grade={grade} setGrade={setGrade} />}
      {tab === 'week' && <WeekDetail week={week} setWeek={setWeek} grade={grade} setGrade={setGrade} />}
    </div>
  )
}

function YearMap({ onPick }: { onPick: (w: number) => void }) {
  return (
    <div className="space-y-5">
      {UNITS.map((u) => (
        <Card key={u.number}>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Unit {u.number} · Weeks {u.weeks[0]}–{u.weeks[1]}
          </p>
          <h2 className="font-serif text-xl font-semibold">{u.title}</h2>
          <p className="text-sm text-muted-foreground">{u.bigIdea}</p>
          <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {BIBLE_WEEKS.filter((b) => b.week >= u.weeks[0] && b.week <= u.weeks[1]).map((b) => (
              <li key={b.week}>
                <button type="button" onClick={() => onPick(b.week)} className="w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted">
                  <b>Week {b.week}:</b> {b.title} <span className="text-muted-foreground">· {b.passage}</span>
                </button>
              </li>
            ))}
          </ol>
        </Card>
      ))}
      <Card>
        <h2 className="font-serif text-lg font-semibold">Seasonal lessons</h2>
        <p className="text-sm text-muted-foreground">Offered automatically in season on the Today page; your unit lesson waits.</p>
        <ul className="mt-2 space-y-1 text-sm">
          {SEASONAL_LESSONS.map((s) => (
            <li key={s.id}>
              <b>{s.title}</b> — {s.passage} · {s.verse.ref}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function GradePicker({ grade, setGrade }: { grade: Grade; setGrade: (g: Grade) => void }) {
  return (
    <div className="flex gap-1">
      {GRADES.map((g) => (
        <button key={g} type="button" aria-pressed={grade === g} onClick={() => setGrade(g)} className={cn('rounded-full border px-3 py-1.5 text-xs font-bold', grade === g ? 'border-primary bg-sage-soft text-primary' : 'border-border')}>
          {gradeLabel(g)}
        </button>
      ))}
    </div>
  )
}

function Sequence({ grade, setGrade }: { grade: Grade; setGrade: (g: Grade) => void }) {
  return (
    <div className="space-y-3">
      <GradePicker grade={grade} setGrade={setGrade} />
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-2">Wk</th>
              <th className="p-2">Bible</th>
              <th className="p-2">Literacy</th>
              <th className="p-2">Math</th>
            </tr>
          </thead>
          <tbody>
            {LITERACY[grade].map((l, i) => {
              const m = MATH[grade][i]
              return (
                <tr key={l.week} className="border-t border-border align-top">
                  <td className="p-2 font-bold">{l.week}</td>
                  <td className="p-2">{BIBLE_WEEKS[i].title}</td>
                  <td className="p-2">
                    {l.title}
                    {l.hfw.filter((w) => w !== 'review').length > 0 && <span className="block text-xs text-muted-foreground">Sight words: {l.hfw.filter((w) => w !== 'review').join(', ')}</span>}
                  </td>
                  <td className="p-2">
                    {m.title}
                    {m.standard && <span className="block text-xs text-muted-foreground">{m.standard}</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function WeekDetail({ week, setWeek, grade, setGrade }: { week: number; setWeek: (w: number) => void; grade: Grade; setGrade: (g: Grade) => void }) {
  const b = getBibleWeek(week)
  const lw = getLiteracyWeek(grade, week)
  const mt = getMathWeek(grade, week)
  const e = getEnrichment(week)
  const [day, setDay] = useState<LessonDay>(0)
  const lessons = coreLessons(week, day, grade)
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select value={week} onChange={(ev) => setWeek(Number(ev.target.value))} aria-label="Week" className="rounded-lg border border-border bg-card px-2 py-1.5 text-sm">
          {BIBLE_WEEKS.map((x) => (
            <option key={x.week} value={x.week}>
              Week {x.week}: {x.title}
            </option>
          ))}
        </select>
        <GradePicker grade={grade} setGrade={setGrade} />
      </div>

      <Card>
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Bible · {b.passage}</p>
        <h2 className="font-serif text-xl font-semibold">{b.title}</h2>
        <p className="mt-2 text-sm">
          <b>Objective:</b> {b.objective}
        </p>
        <p className="mt-2 text-sm">
          <b>For the parent:</b> {b.parentExplanation}
        </p>
        <p className="mt-2 text-sm">
          <b>For the children:</b> {b.childExplanation}
        </p>
        <p className="mt-2 text-sm">
          <b>Discuss:</b> {b.questions.join(' · ')}
        </p>
        <blockquote className="mt-2 rounded-xl bg-muted/60 p-3 text-sm italic">
          “{b.verse.text}” — {b.verse.ref} (KJV)
        </blockquote>
        <p className="mt-2 text-sm">
          <b>Activity:</b> {b.activity}
        </p>
        <p className="mt-1 text-sm">
          <b>Prayer:</b> {b.prayer}
        </p>
        {b.traditionNote && <p className="mt-2 text-xs text-muted-foreground">Scripture vs. tradition: {b.traditionNote}</p>}
        {b.culturalNote && <p className="mt-1 text-xs text-muted-foreground">Biblical &amp; Hebrew culture: {b.culturalNote}</p>}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Literacy · {gradeLabel(grade)}</p>
          <h3 className="font-semibold">{lw.title}</h3>
          <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
            <li>Phonological awareness: {lw.phono}</li>
            {lw.words.length > 0 && <li>Words: {lw.words.join(', ')}</li>}
            {lw.hfw.filter((w) => w !== 'review').length > 0 && <li>Sight words: {lw.hfw.filter((w) => w !== 'review').join(', ')}</li>}
            {lw.spelling && <li>Spelling: {lw.spelling.join(', ')}</li>}
            <li>Comprehension: {lw.comprehension}</li>
            {lw.grammar && <li>Grammar: {lw.grammar}</li>}
            <li>Handwriting: {lw.handwriting}</li>
          </ul>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Math · {gradeLabel(grade)}</p>
          <h3 className="font-semibold">{mt.title}</h3>
          <p className="text-sm text-muted-foreground">
            {mt.strand}
            {mt.standard ? ` · ${mt.standard}` : ''}
          </p>
          <p className="mt-1 text-sm">{mt.objective}</p>
          <p className="mt-1 text-sm text-muted-foreground">Manipulatives: {mt.materials.join(' · ')}</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-1">
        {([0, 1, 2, 3] as LessonDay[]).map((d) => (
          <button key={d} type="button" aria-pressed={day === d} onClick={() => setDay(d)} className={cn('rounded-full border px-3 py-1.5 text-xs font-bold', day === d ? 'border-primary bg-sage-soft text-primary' : 'border-border')}>
            Day {d + 1}: {LESSON_DAY_NAMES[d]}
          </button>
        ))}
      </div>
      {lessons.map((l) => (
        <Card key={l.id}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="font-semibold capitalize">{l.subject}</h3>
            <Pill>{l.minutes.minimum}/{l.minutes.standard}/{l.minutes.full} min (min/std/full)</Pill>
            {l.worksheet ? <Pill tone="sage">Worksheet</Pill> : <Pill tone="gold">Hands-on</Pill>}
          </div>
          <TeachingGuideView guide={l.guide} />
          <div className="mt-3">
            <TeachingGuideView guide={l.guide} minimum />
          </div>
        </Card>
      ))}

      <Card>
        <h3 className="font-semibold">Enrichment this week</h3>
        <ul className="mt-1 space-y-1 text-sm">
          {[
            ['Science', e.science],
            ['Art', e.art],
            ['Social studies', e.socialStudies],
            ['Life skills', e.lifeSkill],
          ].map(([label, a]) => {
            const act = a as typeof e.science
            return (
              <li key={label as string}>
                <b>{label as string}:</b> {act.title} — {act.objective}
              </li>
            )
          })}
          <li>
            <b>Library:</b> {e.library.mission}
          </li>
        </ul>
      </Card>
    </div>
  )
}
