'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Printer } from 'lucide-react'
import { FAMILY_LESSONS } from '@/lib/curriculum/family'
import { pathwayFor } from '@/lib/plan/day-plan'
import { useStore } from '@/lib/store'
import type { WorksheetSpec } from '@/lib/worksheets/types'
import { WorksheetPage } from '@/components/worksheets/worksheet-page'

export default function FamilyPrintPage() {
  return (
    <Suspense>
      <FamilyPrint />
    </Suspense>
  )
}

function FamilyPrint() {
  const store = useStore()
  const q = useSearchParams()
  const lesson = FAMILY_LESSONS.find((l) => l.id === q.get('lesson')) ?? FAMILY_LESSONS[0]
  const ids = (q.get('children') ?? '').split(',').filter(Boolean)
  const kids = ids.length ? store.children.filter((c) => ids.includes(c.id)) : store.childrenInView
  if (!store.hydrated) return null
  return (
    <div className="bg-neutral-200 py-6 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-4 flex max-w-[8.5in] items-center gap-3 rounded-2xl bg-white p-4 shadow">
        <Link href="/library/family" className="inline-flex items-center gap-1 text-sm font-semibold">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <p className="flex-1 text-sm">{lesson.title} · one page per child</p>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-bold text-white">
          <Printer className="size-4" /> Print / Save as PDF
        </button>
      </div>
      {kids.map((c) => {
        const spec: WorksheetSpec = {
          id: `${lesson.id}-feelings`,
          week: 0,
          day: 0,
          grade: pathwayFor(c.gradeBand),
          subject: 'family',
          title: lesson.title,
          skill: 'Feelings & empathy',
          objective: lesson.bigIdea,
          instructions: 'Circle the face that shows how you feel. Then draw or write (a grown-up can write for you).',
          blocks: [
            { type: 'feelings', prompts: lesson.feelings },
            { type: 'draw', label: 'Draw a picture of you and your family helping each other.', height: 'md' },
            { type: 'talk', questions: lesson.discuss },
          ],
          answerKey: ['There are no wrong answers.'],
          activity: 'Feelings page',
        }
        return <WorksheetPage key={c.id} spec={spec} studentName={c.name} />
      })}
    </div>
  )
}
