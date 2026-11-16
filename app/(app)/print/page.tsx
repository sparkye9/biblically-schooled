'use client'

import Link from 'next/link'
import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Archive, CheckCircle2, ClipboardList, FileText, Printer, ShieldCheck } from 'lucide-react'
import { getBibleWeek } from '@/lib/curriculum/bible'
import type { LessonDay, PrintSubject } from '@/lib/curriculum/types'
import { lessonsFor } from '@/lib/plan/day-plan'
import { positionOf } from '@/lib/plan/schedule'
import * as logic from '@/lib/state/logic'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { getWorksheet } from '@/lib/worksheets'
import { REVIEW_SHEETS, sheetForIndex, type ReviewLevel } from '@/lib/worksheets/daily-review'
import { validateWorksheet } from '@/lib/worksheets/validate'
import { MAX_PACKET_WEEK, PACKET_CHILD_FOLDER, packetUrlFor, parentChecklistUrlFor } from '@/lib/worksheet-packets'
import { Card, PageHeader, Pill } from '@/components/primitives'

const SUBJECTS: { id: PrintSubject; label: string }[] = [
  { id: 'bible', label: 'Bible' },
  { id: 'literacy', label: 'Literacy' },
  { id: 'math', label: 'Math' },
  { id: 'handwriting', label: 'Handwriting' },
]

export default function PrintPage() {
  return (
    <Suspense>
      <PrintCenter />
    </Suspense>
  )
}

function PrintCenter() {
  const store = useStore()
  const params = useSearchParams()
  const [week, setWeek] = useState(() => Number(params.get('week')) || positionOf(store.pointer).week)
  const [kids, setKids] = useState<string[] | null>(null)
  const chosenKids = kids ?? store.childrenInView.map((c) => c.id)
  const [subjects, setSubjects] = useState<PrintSubject[]>(['bible', 'literacy', 'math', 'handwriting'])
  const [days, setDays] = useState<LessonDay[]>([0, 1, 2, 3])
  const [overview, setOverview] = useState(true)
  const [checklists, setChecklists] = useState(true)
  const [answerKey, setAnswerKey] = useState(true)

  const selected = store.children.filter((c) => chosenKids.includes(c.id))
  const pages = useMemo(
    () =>
      selected.flatMap((c) =>
        days.flatMap((d) =>
          lessonsFor(logic.learnerOf(c, store), week, d)
            .map((l) => (l.worksheet && subjects.includes(l.worksheet.subject) ? getWorksheet(l.worksheet.id) : undefined))
            .filter((w): w is NonNullable<typeof w> => !!w),
        ),
      ),
    [selected, week, subjects, days, store],
  )
  const issues = pages.flatMap((p) => validateWorksheet(p).filter((i) => i.level === 'error'))
  const prekNames = selected.filter((c) => c.gradeBand === 'pre-k').map((c) => c.name)

  const href = (o: { children?: string[] } = {}) =>
    `/print/packet?week=${week}&children=${(o.children ?? chosenKids).join(',')}&subjects=${subjects.join(',')}&days=${days.join(',')}&overview=${overview ? 1 : 0}&checklists=${checklists ? 1 : 0}&key=${answerKey ? 1 : 0}&color=${store.printColor ? 1 : 0}`

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Print Center" title="Print My Week" description="Pick the week, the children, and the subjects. You get one packet: overview, checklists, worksheets, and a separate answer key." />

      <Card className="border-primary/40 bg-sage-soft/40">
        <div className="flex flex-wrap items-center gap-3">
          <Printer className="size-6 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="font-bold">One click: everything for Week {week}, all {store.childrenInView.length} learners</p>
            <p className="text-sm text-muted-foreground">Pre-K pages print once for each Pre-K child, with their own name.</p>
          </div>
          <Link
            href={`/print/packet?week=${week}&children=${store.childrenInView.map((c) => c.id).join(',')}&subjects=bible,literacy,math,handwriting&days=0,1,2,3&overview=1&checklists=1&key=1&color=${store.printColor ? 1 : 0}`}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Print my week
          </Link>
        </div>
      </Card>

      <DailyReviewCard />

      <Card className="space-y-5">
        <Step n={1} title="Choose the week">
          <select value={week} onChange={(e) => setWeek(Number(e.target.value))} aria-label="Week" className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {Array.from({ length: 36 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Week {i + 1}: {getBibleWeek(i + 1).title}
              </option>
            ))}
          </select>
        </Step>
        <Step n={2} title="Choose students">
          <div className="flex flex-wrap gap-2">
            {store.activeChildren.map((c) => (
              <Chip key={c.id} on={chosenKids.includes(c.id)} onClick={() => setKids(toggle(chosenKids, c.id))}>
                {c.name}
              </Chip>
            ))}
          </div>
          {prekNames.length > 1 && <p className="mt-1 text-xs text-muted-foreground">Separate Pre-K copies for {prekNames.join(' and ')}.</p>}
        </Step>
        <Step n={3} title="Choose subjects and days">
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <Chip key={s.id} on={subjects.includes(s.id)} onClick={() => setSubjects(toggle(subjects, s.id))}>
                {s.label}
              </Chip>
            ))}
            <span className="mx-1 w-px self-stretch bg-border" />
            {([0, 1, 2, 3] as LessonDay[]).map((d) => (
              <Chip key={d} on={days.includes(d)} onClick={() => setDays(toggle(days, d).sort())}>
                Day {d + 1}
              </Chip>
            ))}
          </div>
        </Step>
        <Step n={4} title="Include">
          <div className="flex flex-wrap gap-2">
            <Chip on={overview} onClick={() => setOverview((v) => !v)}>
              Weekly overview + materials
            </Chip>
            <Chip on={checklists} onClick={() => setChecklists((v) => !v)}>
              Daily checklists
            </Chip>
            <Chip on={answerKey} onClick={() => setAnswerKey((v) => !v)}>
              Answer key (parent section)
            </Chip>
            <Chip on={store.printColor} onClick={() => store.setPrefs({ printColor: !store.printColor })}>
              {store.printColor ? 'Color accents' : 'Black & white'}
            </Chip>
          </div>
        </Step>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="flex items-center gap-2 text-sm">
            {issues.length === 0 ? (
              <>
                <ShieldCheck className="size-4 text-primary" /> {pages.length} worksheet pages checked: answers, pictures, layout — all passed.
              </>
            ) : (
              <span className="text-destructive">{issues.length} problem(s) found; those pages will be left out.</span>
            )}
          </p>
          <Link
            href={href()}
            aria-disabled={!selected.length || !subjects.length || !days.length}
            className={cn('rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground', (!selected.length || !subjects.length || !days.length) && 'pointer-events-none opacity-40')}
          >
            Generate packet ({pages.length} pages)
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="flex items-center gap-2 font-serif text-lg font-semibold">
          <FileText className="size-4 text-primary" /> Family Learning printables
        </h2>
        <p className="text-sm text-muted-foreground">Feelings and understanding-each-other pages live with the Family Learning module.</p>
        <Link href="/library/family" className="mt-2 inline-block text-sm font-semibold text-primary underline">
          Open Family Learning
        </Link>
      </Card>

      <LegacyArchive week={week} />
    </div>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-bold">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{n}</span>
        {title}
      </p>
      {children}
    </div>
  )
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={cn('inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold', on ? 'border-primary bg-sage-soft text-primary' : 'border-border')}>
      {on && <CheckCircle2 className="size-3.5" />}
      {children}
    </button>
  )
}

/** The original PDF packets are kept, clearly labelled, so nothing the family relied on disappears. */
function LegacyArchive({ week }: { week: number }) {
  const store = useStore()
  const [open, setOpen] = useState(false)
  if (week > MAX_PACKET_WEEK) return null
  const days = ['monday', 'tuesday', 'thursday', 'friday'] as const
  return (
    <Card>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-2 text-left">
        <Archive className="size-4 text-muted-foreground" />
        <span className="font-semibold">Original PDF packets (archive)</span>
        <Pill>older format</Pill>
      </button>
      {open && (
        <div className="mt-3 space-y-2 text-sm">
          <p className="text-muted-foreground">These are the previous packets, kept for reference. The audit found repeated pages in many of them, so the new packets above are recommended.</p>
          {store.children
            .filter((c) => PACKET_CHILD_FOLDER[c.id])
            .map((c) => (
              <p key={c.id}>
                <b>{c.name}:</b>{' '}
                {days.map((d) => {
                  const url = packetUrlFor(c.id, week, d)
                  return url ? (
                    <a key={d} href={url} target="_blank" rel="noreferrer" className="mr-2 text-primary underline">
                      {d.slice(0, 3)}
                    </a>
                  ) : null
                })}
              </p>
            ))}
          {parentChecklistUrlFor(week) && (
            <a href={parentChecklistUrlFor(week)!} target="_blank" rel="noreferrer" className="text-primary underline">
              Parent checklist (PDF)
            </a>
          )}
        </div>
      )}
    </Card>
  )
}

/** One-page mixed review sheets: 50 per child, regular and challenge. */
function DailyReviewCard() {
  const store = useStore()
  const suggested = sheetForIndex(store.pointer)
  const [kids, setKids] = useState<string[] | null>(null)
  const chosen = kids ?? store.childrenInView.map((c) => c.id)
  const [from, setFrom] = useState(suggested)
  const [to, setTo] = useState(suggested)
  const [levels, setLevels] = useState<ReviewLevel[]>(['regular', 'challenge'])
  const [key, setKey] = useState(true)
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const href = (a: number, b: number) =>
    `/print/review?children=${chosen.join(',')}&from=${a}&to=${b}&level=${levels.join(',')}&key=${key ? 1 : 0}&color=${store.printColor ? 1 : 0}`
  const num = (v: string) => Math.min(REVIEW_SHEETS, Math.max(1, Number(v) || 1))
  const count = chosen.length * (Math.max(from, to) - from + 1) * levels.length
  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <ClipboardList className="mt-0.5 size-6 text-primary" />
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-lg font-semibold">Daily review sheets</h2>
          <p className="text-sm text-muted-foreground">
            One page of mixed skills — reading, writing, math, money, time — for each child. {REVIEW_SHEETS} per child, each with a regular and a challenge version. They follow the
            curriculum: sheet #{suggested} matches where you are now.
          </p>
        </div>
        <Link href={href(suggested, suggested)} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          Print today’s (#{suggested})
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {store.activeChildren.map((c) => (
          <Chip key={c.id} on={chosen.includes(c.id)} onClick={() => setKids(toggle(chosen, c.id))}>
            {c.name}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold">Sheets</span>
        <input type="number" min={1} max={REVIEW_SHEETS} value={from} onChange={(e) => setFrom(num(e.target.value))} aria-label="First sheet" className="w-20 rounded-lg border border-border bg-card px-2 py-1.5" />
        <span>to</span>
        <input type="number" min={1} max={REVIEW_SHEETS} value={Math.max(from, to)} onChange={(e) => setTo(num(e.target.value))} aria-label="Last sheet" className="w-20 rounded-lg border border-border bg-card px-2 py-1.5" />
        <Chip on={levels.includes('regular')} onClick={() => setLevels(toggle(levels, 'regular'))}>
          Regular
        </Chip>
        <Chip on={levels.includes('challenge')} onClick={() => setLevels(toggle(levels, 'challenge'))}>
          Challenge
        </Chip>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={key} onChange={(e) => setKey(e.target.checked)} className="size-4 accent-[var(--primary)]" /> Answer key
        </label>
      </div>
      <Link
        href={href(from, Math.max(from, to))}
        aria-disabled={!count}
        className={cn('inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold', !count && 'pointer-events-none opacity-50')}
      >
        <Printer className="size-4" /> Print {count} sheet{count === 1 ? '' : 's'}
      </Link>
    </Card>
  )
}
