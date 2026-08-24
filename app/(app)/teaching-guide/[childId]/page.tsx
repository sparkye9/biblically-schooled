'use client'

import { useParams, useRouter } from 'next/navigation'
import { Printer, Quote, ArrowLeft } from 'lucide-react'
import { useStore } from '@/lib/store'
import { assignedLessonsFor, sortByActivity } from '@/lib/selectors'
import { dayLabels, subjectMeta } from '@/lib/ui'
import { PageHeader, SubjectPill, ActivityBadge } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { AssignedLesson } from '@/lib/selectors'

export default function ChildTeachingGuidePage() {
  const router = useRouter()
  const params = useParams()
  const childId = params.childId as string

  const store = useStore()
  const { children, assignments, lessons, currentWeek, currentDay } = store

  const child = children.find((c) => c.id === childId)
  const week = store.weeks.find((w) => w.number === currentWeek) ?? store.weeks[0]

  if (!child) {
    return (
      <div className="space-y-6">
        <PageHeader title="Teaching Guide" description="Child not found." />
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">This child doesn't exist.</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="size-4" /> Go Back
          </Button>
        </Card>
      </div>
    )
  }

  const items = sortByActivity(
    assignedLessonsFor(child.id, assignments, lessons, {
      week: currentWeek,
      day: currentDay,
    }),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${dayLabels[currentDay]} · Week ${currentWeek}`}
        title={`Teaching Guide: ${child.name}`}
        description={`${child.grade} · Lessons for today`}
      >
        <div className="flex gap-2">
          <Button onClick={() => router.back()} variant="outline" className="gap-1.5">
            <ArrowLeft className="size-4" /> Back
          </Button>
          <Button onClick={() => window.print()} className="gap-1.5 print:hidden">
            <Printer className="size-4" /> Print
          </Button>
        </div>
      </PageHeader>

      {week && (
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {week.bibleRef} · {week.theme}
          </p>
          <p className="mt-2 flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-sm text-foreground">
            <Quote className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              <span className="font-semibold">Memory verse:</span> "{week.memoryVerse}" —{' '}
              {week.memoryVerseRef}
            </span>
          </p>
        </Card>
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No home lessons today — enjoy the margin.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <TeachEntry key={item.assignment.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function TeachEntry({ item }: { item: AssignedLesson }) {
  const { lesson } = item
  const { Icon } = subjectMeta[lesson.subject]

  return (
    <Card className="break-inside-avoid p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <SubjectPill subject={lesson.subject} />
          <ActivityBadge type={lesson.activityType} />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {lesson.minutes} min
        </span>
      </div>
      <h3 className="mt-2.5 flex items-center gap-2 font-bold text-foreground">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        {lesson.title}
      </h3>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {lesson.youNeed && lesson.youNeed.length > 0 && (
          <TeachBlock label="You need">
            <ul className="list-disc space-y-0.5 pl-4">
              {lesson.youNeed.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </TeachBlock>
        )}
        {lesson.teach && lesson.teach.length > 0 && (
          <TeachBlock label="Teach">
            <ol className="list-decimal space-y-0.5 pl-4">
              {lesson.teach.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </TeachBlock>
        )}
        {lesson.ask && lesson.ask.length > 0 && (
          <TeachBlock label="Ask">
            <ul className="space-y-0.5">
              {lesson.ask.map((a) => (
                <li key={a} className="italic">
                  &ldquo;{a}&rdquo;
                </li>
              ))}
            </ul>
          </TeachBlock>
        )}
        {lesson.watchFor && <TeachBlock label="Watch for">{lesson.watchFor}</TeachBlock>}
      </div>
    </Card>
  )
}

function TeachBlock({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl bg-muted/50 p-3">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}
