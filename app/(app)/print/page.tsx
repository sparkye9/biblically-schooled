'use client'

import Link from 'next/link'
import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Archive, CheckCircle2, FileText, Printer, ShieldCheck } from 'lucide-react'
import { getBibleWeek } from '@/lib/curriculum/bible'
import type { CoreSubject, LessonDay } from '@/lib/curriculum/types'
import { positionOf } from '@/lib/plan/schedule'
import * as logic from '@/lib/state/logic'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { worksheetsForWeek } from '@/lib/worksheets'
import { validateWorksheet } from '@/lib/worksheets/validate'
import { MAX_PACKET_WEEK, PACKET_CHILD_FOLDER, packetUrlFor, parentChecklistUrlFor } from '@/lib/worksheet-packets'
import { Card, PageHeader, Pill } from '@/components/primitives'

const SUBJECTS: { id: CoreSubject; label: string }[] = [
  { id: 'bible', label: 'Bible' },
  { id: 'literacy', label: 'Literacy' },
  { id: 'math', label: 'Math' },
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
  const [subjects, setSubjects] = useState<CoreSubject[]>(['bible', 'literacy', 'math'])
  const [days, setDays] = useState<LessonDay[]>([0, 1, 2, 3])
  const [overview, setOverview] = useState(true)
  const [checklists, setChecklists] = useState(true)
  const [answerKey, setAnswerKey] = useState(true)

  const selected = store.children.filter((c) => chosenKids.includes(c.id))
  const pages = useMemo(
    () =>
      selected.flatMap((c) =>
        worksheetsForWeek(week, logic.learnerOf(c).grade, subjects).filter((w) => days.includes(w.day as LessonDay)),
      ),
    [selected, week, subjects, days],
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
            href={`/print/packet?week=${week}&children=${store.childrenInView.map((c) => c.id).join(',')}&subjects=bible,literacy,math&days=0,1,2,3&overview=1&checklists=1&key=1&color=${store.printColor ? 1 : 0}`}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Print my week
          </Link>
        </div>
      </Card>

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
            {store.children.map((c) => (
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
