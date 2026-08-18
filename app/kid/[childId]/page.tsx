'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { assignedLessonsFor, sortByActivity } from '@/lib/selectors'
import { subjectMeta, accent } from '@/lib/ui'
import { Check, Star, X, PartyPopper } from 'lucide-react'

export default function KidPage({
  params,
}: {
  params: Promise<{ childId: string }>
}) {
  const { childId } = use(params)
  const store = useStore()
  const child = store.children.find((c) => c.id === childId)
  const [celebrate, setCelebrate] = useState(false)

  if (!child) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-6 text-center">
        <p className="text-muted-foreground">That learner could not be found.</p>
      </div>
    )
  }

  const items = sortByActivity(
    assignedLessonsFor(child.id, store.assignments, store.lessons, {
      week: store.currentWeek,
      day: store.currentDay,
    }),
  )
  const done = items.filter((i) => i.assignment.status === 'done').length
  const allDone = items.length > 0 && done === items.length
  const color = child.color

  function complete(assignmentId: string, wasDone: boolean) {
    store.toggleAssignment(assignmentId)
    if (!wasDone) {
      setCelebrate(true)
      setTimeout(() => setCelebrate(false), 1400)
    }
  }

  return (
    <main
      className="min-h-dvh px-5 py-6"
      style={{
        background: `linear-gradient(180deg, color-mix(in oklch, var(--${color}) 16%, var(--background)), var(--background))`,
      }}
    >
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex size-14 items-center justify-center rounded-2xl text-2xl font-black text-white"
              style={{ backgroundColor: `var(--${color})` }}
            >
              {child.name.charAt(0)}
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Hi {child.name}!
              </p>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Today&apos;s Learning
              </h1>
            </div>
          </div>
          <Link
            href="/children"
            aria-label="Exit kid mode"
            className="flex size-11 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm"
          >
            <X className="size-5" />
          </Link>
        </div>

        {/* Star tracker */}
        <div className="mb-6 flex items-center justify-center gap-2 rounded-3xl bg-card p-4 shadow-sm">
          {items.map((i) => (
            <Star
              key={i.assignment.id}
              className="size-8 transition-all"
              style={{
                color: `var(--${color})`,
                fill:
                  i.assignment.status === 'done'
                    ? `var(--${color})`
                    : 'transparent',
                opacity: i.assignment.status === 'done' ? 1 : 0.35,
              }}
            />
          ))}
        </div>

        {allDone ? (
          <div className="rounded-3xl bg-card p-8 text-center shadow-sm">
            <PartyPopper className="mx-auto mb-3 size-14" style={accent(color)} />
            <h2 className="font-serif text-2xl font-bold text-foreground">
              You did it!
            </h2>
            <p className="mt-1 text-muted-foreground">
              All your stars are filled in. Great work today!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((i) => {
              const { Icon, label } = subjectMeta[i.lesson.subject]
              const isDone = i.assignment.status === 'done'
              return (
                <button
                  key={i.assignment.id}
                  onClick={() => complete(i.assignment.id, isDone)}
                  className="flex w-full items-center gap-4 rounded-3xl bg-card p-5 text-left shadow-sm transition-transform active:scale-[0.98]"
                  style={
                    isDone
                      ? { boxShadow: `inset 0 0 0 3px var(--${color})` }
                      : undefined
                  }
                >
                  <span
                    className="flex size-16 shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: `color-mix(in oklch, var(--${color}) 18%, transparent)`,
                    }}
                  >
                    <Icon className="size-8" style={accent(color)} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="truncate font-serif text-xl font-bold text-foreground">
                      {i.lesson.title}
                    </p>
                  </div>
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-full border-4"
                    style={{
                      borderColor: `var(--${color})`,
                      backgroundColor: isDone ? `var(--${color})` : 'transparent',
                    }}
                  >
                    {isDone && <Check className="size-6 text-white" strokeWidth={3} />}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {celebrate && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="animate-bounce rounded-full p-8 text-white shadow-2xl"
            style={{ backgroundColor: `var(--${color})` }}
          >
            <Star className="size-16" fill="currentColor" />
          </div>
        </div>
      )}
    </main>
  )
}
