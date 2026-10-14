'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, ExternalLink, Printer } from 'lucide-react'
import { FAMILY_LESSONS, FAMILY_RESOURCES } from '@/lib/curriculum/family'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Card, DoneBox, PageHeader, ProgressBar } from '@/components/primitives'

export default function FamilyLearningPage() {
  const store = useStore()
  const done = FAMILY_LESSONS.filter((l) => store.familyModule[l.id]).length
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Optional · about 15 minutes each"
        title="Family Learning: Understanding Each Other"
        description="Affirming, age-appropriate lessons about autism and how brains can work differently. Every child’s feelings, boundaries, and needs matter."
      />
      <Card>
        <p className="text-sm font-semibold">
          {done} of {FAMILY_LESSONS.length} lessons done
        </p>
        <div className="mt-2">
          <ProgressBar value={done} total={FAMILY_LESSONS.length} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Use one lesson a week (a gentle fit for Friday review), or whenever a question comes up. Stories use made-up children so no one in your family is put on the spot.
        </p>
      </Card>
      {FAMILY_LESSONS.map((l, i) => (
        <LessonCard key={l.id} index={i} lesson={l} />
      ))}
      <Card>
        <h2 className="font-serif text-lg font-semibold">Trusted resources for parents</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {FAMILY_RESOURCES.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline">
                {r.name} <ExternalLink className="size-3.5" />
              </a>
              <span className="block text-muted-foreground">{r.who}</span>
              <span className="block text-xs text-muted-foreground">{r.checked ? `Link checked ${r.checked}` : 'Link not yet checked from this app — if it doesn’t open, search the organization’s name.'}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function LessonCard({ lesson: l, index }: { lesson: (typeof FAMILY_LESSONS)[number]; index: number }) {
  const store = useStore()
  const [open, setOpen] = useState(index === 0)
  const done = !!store.familyModule[l.id]
  return (
    <Card className={cn(done && 'bg-sage-soft/30')}>
      <div className="flex items-start gap-3">
        <DoneBox done={done} onToggle={() => store.toggleFamilyLesson(l.id)} label={`Mark "${l.title}" done`} />
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="min-w-0 flex-1 text-left">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Lesson {index + 1}</p>
          <h2 className="flex items-center gap-1 font-serif text-lg font-semibold">
            {l.title} <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
          </h2>
          <p className="text-sm text-muted-foreground">{l.bigIdea}</p>
        </button>
      </div>
      {open && (
        <div className="mt-4 space-y-3 text-sm">
          {l.scripture && (
            <blockquote className="rounded-xl bg-muted/60 p-3 italic">
              “{l.scripture.text}” — {l.scripture.ref} (KJV)
            </blockquote>
          )}
          <div>
            <p className="font-bold">Story (read aloud)</p>
            <p className="mt-1 leading-relaxed">{l.story}</p>
          </div>
          <div>
            <p className="font-bold">Talk about it</p>
            <ul className="mt-1 list-disc pl-5">
              {l.discuss.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <p>
            <b>Family activity:</b> {l.activity}
          </p>
          <p>
            <b>Empathy practice:</b> {l.empathy}
          </p>
          <p className="rounded-xl bg-gold/15 p-3">
            <b>For the parent:</b> {l.parentNote}
          </p>
          <Link
            href={`/print/family?lesson=${l.id}&children=${store.childrenInView.map((c) => c.id).join(',')}`}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-bold"
          >
            <Printer className="size-3.5" /> Print feelings page for each child
          </Link>
        </div>
      )}
    </Card>
  )
}
