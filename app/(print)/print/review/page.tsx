'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Printer } from 'lucide-react'
import * as logic from '@/lib/state/logic'
import { useStore } from '@/lib/store'
import { REVIEW_SHEETS, reviewSheet, type ReviewLevel } from '@/lib/worksheets/daily-review'
import type { WorksheetSpec } from '@/lib/worksheets/types'
import { AnswerKeyPage, WorksheetPage } from '@/components/worksheets/worksheet-page'

/** Daily review sheets: /print/review?children=a,b&from=1&to=5&level=regular,challenge&key=1 */
export default function ReviewPrintPage() {
  return (
    <Suspense fallback={<p className="p-8">Preparing your sheets…</p>}>
      <ReviewSheets />
    </Suspense>
  )
}

function ReviewSheets() {
  const store = useStore()
  const q = useSearchParams()
  const clamp = (n: number) => Math.min(REVIEW_SHEETS, Math.max(1, n || 1))
  const from = clamp(Number(q.get('from')))
  const to = Math.max(from, clamp(Number(q.get('to')) || from))
  const levels = (q.get('level') ?? 'regular,challenge').split(',').filter((l): l is ReviewLevel => l === 'regular' || l === 'challenge')
  const ids = (q.get('children') ?? '').split(',').filter(Boolean)
  const showKey = q.get('key') !== '0'
  const color = q.get('color') === '1'

  if (!store.hydrated) return <p className="p-8">Preparing your sheets…</p>
  const kids = ids.length ? store.children.filter((c) => ids.includes(c.id)) : store.childrenInView

  // Each child's sheets in order: #from regular, #from challenge, #from+1 regular, …
  const pages: { spec: WorksheetSpec; name: string; color: string }[] = []
  for (const c of kids) {
    const grade = logic.learnerOf(c).grade
    for (let n = from; n <= to; n++) for (const level of levels) pages.push({ spec: reviewSheet(grade, n, level), name: c.name, color: c.color })
  }
  const keySpecs = [...new Map(pages.map((p) => [p.spec.id, p.spec])).values()]
  const range = from === to ? `#${from}` : `#${from}–${to}`

  return (
    <div className="bg-neutral-200 py-6 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-4 flex max-w-[8.5in] flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow">
        <Link href="/print" className="inline-flex items-center gap-1 text-sm font-semibold">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <p className="flex-1 text-sm">
          Daily review {range} · {kids.map((k) => k.name).join(', ')} · {pages.length} sheets{showKey ? ' + answer key' : ''}
        </p>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-bold text-white">
          <Printer className="size-4" /> Print / Save as PDF
        </button>
        <p className="w-full text-xs text-neutral-500">To make a PDF, choose “Save as PDF” as the printer. Set paper to Letter and margins to “None” or “Default”.</p>
      </div>
      {pages.map((p, i) => (
        <WorksheetPage key={`${p.spec.id}-${p.name}-${i}`} spec={p.spec} studentName={p.name} accent={color ? `var(--${p.color})` : undefined} />
      ))}
      {showKey && keySpecs.length > 0 && <AnswerKeyPage title={`Daily review ${range}`} specs={keySpecs} />}
    </div>
  )
}
