'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Printer } from 'lucide-react'
import { getBibleWeek, unitForWeek } from '@/lib/curriculum/bible'
import { getEnrichment } from '@/lib/curriculum/enrichment'
import { LESSON_DAY_NAMES, type CoreSubject, type LessonDay } from '@/lib/curriculum/types'
import { lessonsFor } from '@/lib/plan/day-plan'
import * as logic from '@/lib/state/logic'
import { gradeLabel, useStore } from '@/lib/store'
import { getWorksheet } from '@/lib/worksheets'
import type { WorksheetSpec } from '@/lib/worksheets/types'
import { validateWorksheet } from '@/lib/worksheets/validate'
import { AnswerKeyPage, WorksheetPage } from '@/components/worksheets/worksheet-page'

export default function PacketPage() {
  return (
    <Suspense fallback={<p className="p-8">Preparing your packet…</p>}>
      <Packet />
    </Suspense>
  )
}

function Packet() {
  const store = useStore()
  const q = useSearchParams()
  const week = Math.min(36, Math.max(1, Number(q.get('week')) || 1))
  const ids = (q.get('children') ?? '').split(',').filter(Boolean)
  const subjects = ((q.get('subjects') ?? 'bible,literacy,math').split(',').filter(Boolean)) as CoreSubject[]
  const days = (q.get('days') ?? '0,1,2,3').split(',').filter(Boolean).map(Number) as LessonDay[]
  const showOverview = q.get('overview') === '1'
  const showChecklists = q.get('checklists') === '1'
  const showKey = q.get('key') !== '0'
  const color = q.get('color') === '1'

  if (!store.hydrated) return <p className="p-8">Preparing your packet…</p>
  const kids = (ids.length ? store.children.filter((c) => ids.includes(c.id)) : store.childrenInView).map((c) => ({ child: c, learner: logic.learnerOf(c) }))
  const bible = getBibleWeek(week)

  // Pages per day, per child, per subject. The two Pre-K girls each get their own named copy.
  const pages: { spec: WorksheetSpec; name: string; color: string }[] = []
  for (const d of days) {
    for (const { child, learner } of kids) {
      for (const lesson of lessonsFor(learner, week, d)) {
        if (!subjects.includes(lesson.subject) || !lesson.worksheet) continue
        const spec = getWorksheet(lesson.worksheet.id)
        if (!spec) continue
        if (validateWorksheet(spec).some((i) => i.level === 'error')) continue
        pages.push({ spec, name: child.name, color: child.color })
      }
    }
  }
  const keySpecs = [...new Map(pages.map((p) => [p.spec.id, p.spec])).values()]

  return (
    <div className="bg-neutral-200 py-6 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-4 flex max-w-[8.5in] flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow">
        <Link href="/print" className="inline-flex items-center gap-1 text-sm font-semibold">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <p className="flex-1 text-sm">
          Week {week} · {kids.map((k) => k.child.name).join(', ')} · {pages.length} worksheets
          {showKey ? ` + answer key` : ''}
        </p>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-bold text-white">
          <Printer className="size-4" /> Print / Save as PDF
        </button>
        <p className="w-full text-xs text-neutral-500">To make a PDF, choose “Save as PDF” as the printer. Set paper to Letter and margins to “None” or “Default”.</p>
      </div>

      {showOverview && <Overview week={week} kids={kids} days={days} />}

      {showChecklists && kids.map(({ child, learner }) => (
        <section key={child.id} className="ws-page mx-auto bg-white text-black" style={{ width: '8.5in', minHeight: '11in', padding: '0.5in' }}>
          <h1 className="border-b-2 border-black pb-1 text-[20px] font-extrabold">
            {child.name}’s checklist · Week {week}
          </h1>
          <p className="mt-1 text-[12px]">{gradeLabel(learner.grade)} · Check each box when it’s done.</p>
          {days.map((d) => (
            <div key={d} className="mt-4">
              <p className="text-[15px] font-bold">
                Day {d + 1} — {LESSON_DAY_NAMES[d]}
              </p>
              {lessonsFor(learner, week, d).map((l) => (
                <p key={l.id} className="mt-1 flex items-center gap-3 text-[14px]">
                  <span className="inline-block size-5 border-2 border-black" />
                  <span className="w-20 font-semibold capitalize">{l.subject}</span>
                  {l.childTask}: {l.subject === 'bible' ? bible.title : l.title}
                </p>
              ))}
            </div>
          ))}
        </section>
      ))}

      {pages.map((p, i) => (
        <WorksheetPage key={`${p.spec.id}-${p.name}-${i}`} spec={p.spec} studentName={p.name} accent={color ? `var(--${p.color})` : undefined} />
      ))}

      {showKey && keySpecs.length > 0 && <AnswerKeyPage title={`Week ${week}`} specs={keySpecs} />}
    </div>
  )
}

function Overview({ week, kids, days }: { week: number; kids: { child: { id: string; name: string }; learner: ReturnType<typeof logic.learnerOf> }[]; days: LessonDay[] }) {
  const b = getBibleWeek(week)
  const u = unitForWeek(week)
  const e = getEnrichment(week)
  const mats = new Set<string>()
  kids.forEach(({ learner }) => days.forEach((d) => lessonsFor(learner, week, d).forEach((l) => l.guide.materials.forEach((m) => m !== 'Worksheet' && mats.add(m)))))
  return (
    <section className="ws-page mx-auto bg-white text-black" style={{ width: '8.5in', minHeight: '11in', padding: '0.5in' }}>
      <p className="text-[11px] font-bold uppercase tracking-wider">Unit {u.number}: {u.title}</p>
      <h1 className="text-[26px] font-extrabold" style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}>
        Week {week}: {b.title}
      </h1>
      <p className="text-[13px]">{b.passage}</p>
      <p className="mt-2 rounded border border-black p-2 text-[13px] italic">
        Memory verse — {b.verse.ref} (KJV): “{b.verse.text}”
      </p>
      <table className="mt-3 w-full border-collapse text-[11px]">
        <thead>
          <tr>
            <th className="border border-black p-1 text-left">Learner</th>
            {days.map((d) => (
              <th key={d} className="border border-black p-1 text-left">
                Day {d + 1}: {LESSON_DAY_NAMES[d]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kids.map(({ child, learner }) => (
            <tr key={child.id} className="align-top">
              <td className="border border-black p-1 font-bold">{child.name}</td>
              {days.map((d) => {
                const [, lit, math] = lessonsFor(learner, week, d)
                return (
                  <td key={d} className="border border-black p-1">
                    <p>Lit: {lit.childTask}</p>
                    <p>Math: {math.childTask}</p>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 grid grid-cols-2 gap-4 text-[11px]">
        <div>
          <p className="text-[13px] font-bold">Materials for the week</p>
          <ul className="list-disc pl-4">{[...mats].map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
        <div>
          <p className="text-[13px] font-bold">Enrichment</p>
          <p>Science: {e.science.title}</p>
          <p>Art: {e.art.title}</p>
          <p>Social studies: {e.socialStudies.title}</p>
          <p>Life skill: {e.lifeSkill.title}</p>
          <p>Library: {e.library.mission}</p>
          <p className="mt-2 text-[13px] font-bold">Bible activity</p>
          <p>{b.activity}</p>
        </div>
      </div>
    </section>
  )
}
