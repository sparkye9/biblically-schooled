'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { assignedLessonsFor, childrenInView } from '@/lib/selectors'
import { dayLabels, dayRhythm, subjectMeta } from '@/lib/ui'
import { accentBg } from '@/lib/ui'
import { PageHeader, ChildAvatar } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { CalendarCheck, Star } from 'lucide-react'
import type { DayName } from '@/lib/types'

const DAYS: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

export default function PlannerPage() {
  const store = useStore()
  const kids = childrenInView(store.children, store.currentView)
  const week = store.weeks.find((w) => w.number === store.currentWeek)

  return (
    <div>
      <PageHeader
        eyebrow={`Week ${store.currentWeek}`}
        title="Weekly Planner"
        description="The whole week at a glance — each day's rhythm and what every child is working on. Plan ahead and see where the light and heavy days fall."
      />

      {week && (
        <Card className="mb-6 flex flex-col gap-3 border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <Star className="size-3.5" /> This week&apos;s theme
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground">
              {week.theme}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{week.bigIdea}</p>
          </div>
          <div className="shrink-0 rounded-xl bg-card px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Memory Verse
            </p>
            <p className="mt-0.5 max-w-xs text-pretty text-sm font-medium text-foreground">
              &ldquo;{week.memoryVerse}&rdquo;
            </p>
            <p className="mt-1 text-xs font-bold text-primary">
              {week.memoryVerseRef}
            </p>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {DAYS.map((day) => {
          const isToday = day === store.currentDay
          return (
            <Card
              key={day}
              className={
                isToday
                  ? 'flex flex-col border-primary/40 bg-primary/[0.04] p-0'
                  : 'flex flex-col p-0'
              }
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <p className="font-serif text-lg font-semibold text-foreground">
                    {dayLabels[day]}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {dayRhythm[day]}
                  </p>
                </div>
                {isToday && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                    <CalendarCheck className="size-3" /> Today
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-4 p-4">
                {kids.map((child) => {
                  const items = assignedLessonsFor(
                    child.id,
                    store.assignments,
                    store.lessons,
                    { week: store.currentWeek, day },
                  )
                  return (
                    <div key={child.id}>
                      <div className="mb-2 flex items-center gap-2">
                        <ChildAvatar child={child} size="sm" />
                        <span className="text-sm font-bold text-foreground">
                          {child.name}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {items.length
                            ? `${items.length} ${items.length === 1 ? 'lesson' : 'lessons'}`
                            : 'Rest day'}
                        </span>
                      </div>
                      {items.length === 0 ? (
                        <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                          No lessons scheduled.
                        </p>
                      ) : (
                        <ul className="space-y-1.5">
                          {items.map(({ assignment, lesson }) => {
                            const { Icon } = subjectMeta[lesson.subject]
                            const done = assignment.status === 'done'
                            return (
                              <li key={assignment.id}>
                                <Link
                                  href={`/lessons/${lesson.id}`}
                                  className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-2 transition-colors hover:bg-muted/50"
                                >
                                  <span
                                    className="flex size-6 shrink-0 items-center justify-center rounded-md"
                                    style={accentBg(
                                      subjectMeta[lesson.subject].label.toLowerCase() ===
                                        'bible'
                                        ? 'momtime'
                                        : 'independent',
                                      0.16,
                                    )}
                                  >
                                    <Icon className="size-3.5" />
                                  </span>
                                  <span
                                    className={
                                      done
                                        ? 'min-w-0 flex-1 truncate text-xs font-medium text-muted-foreground line-through'
                                        : 'min-w-0 flex-1 truncate text-xs font-medium text-foreground'
                                    }
                                  >
                                    {lesson.title}
                                  </span>
                                  <span className="shrink-0 text-[11px] text-muted-foreground">
                                    {lesson.minutes}m
                                  </span>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  )
                })}
                {kids.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No children in this view.
                  </p>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
