'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Sun,
  BookOpen,
  GraduationCap,
  Zap,
  Printer,
  CheckCircle2,
  Clock,
  Star,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import {
  assignedLessonsFor,
  childrenInView,
  countDone,
  filterByDayLength,
  sortByActivity,
  type AssignedLesson,
} from '@/lib/selectors'
import { PageHeader, ChildAvatar, ActivityBadge } from '@/components/primitives'
import { Button } from '@/components/ui/button'
import { LessonEditor } from '@/components/lesson-editor'
import { cn } from '@/lib/utils'
import { dayLabels } from '@/lib/ui'
import { packetUrlFor } from '@/lib/worksheet-packets'
import { capitalize, formatISODate, isNoSchoolToday } from '@/lib/school-calendar'
import type { DayName } from '@/lib/types'

type DayMode = 'essential' | '30' | '60' | 'full'

const modes: { id: DayMode; label: string }[] = [
  { id: 'essential', label: 'Essential' },
  { id: '30', label: '30 min' },
  { id: '60', label: '60 min' },
  { id: 'full', label: 'Full' },
]

export default function TodayPage() {
  const {
    children,
    assignments,
    lessons,
    currentView,
    currentWeek,
    currentDay,
    schoolStatus,
    schoolYearStartDate,
    weeks,
  } = useStore()
  const [mode, setMode] = useState<DayMode>('full')

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('mode')
    if (modes.some((m) => m.id === requested)) setMode(requested as DayMode)
  }, [])

  const inView = childrenInView(children, currentView)
  const weekData = weeks.find((w) => w.number === currentWeek)

  if (isNoSchoolToday(schoolStatus)) {
    const title = schoolStatus.isWeekend
      ? `${capitalize(schoolStatus.actualDayName)} · Rest Day`
      : schoolStatus.onBreak
        ? schoolStatus.pause?.label
          ? `On Break — ${schoolStatus.pause.label}`
          : 'On Break'
        : `School starts ${formatISODate(schoolYearStartDate)}`
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sun className="size-7" />
        </span>
        <p className="mt-4 font-serif text-2xl font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-muted-foreground">No lessons today. Enjoy the margin.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Week Context Header with Day Navigation */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              {dayLabels[currentDay]} · Week {currentWeek}
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-foreground">
              Today's Learning
            </h1>
          </div>
        </div>
        {weekData && (
          <div className="mt-4 space-y-2 border-t border-border/30 pt-4">
            <p className="text-sm font-medium text-foreground">
              <span className="font-bold">Theme:</span> {weekData.theme}
            </p>
            {weekData.memoryVerse && (
              <div className="rounded-lg bg-primary/5 p-3">
                <p className="text-sm italic text-foreground">
                  <span className="font-bold">Memory Verse:</span> "{weekData.memoryVerse}"
                </p>
                <p className="text-xs text-muted-foreground">{weekData.memoryVerseRef}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Day Mode Selector */}
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-all',
              mode === m.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-primary/20',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode !== 'full' && (
        <div className="flex items-center gap-2 rounded-lg border-l-4 border-secondary bg-secondary/8 px-4 py-3">
          <Zap className="size-4 text-secondary" />
          <p className="text-sm font-medium text-foreground">
            Focusing on Bible, Math & Literacy. Enrichment in "If time allows."
          </p>
        </div>
      )}

      {/* Children's Daily Plans */}
      <div className="space-y-8">
        {inView.map((child) => {
          const all = assignedLessonsFor(child.id, assignments, lessons, {
            week: currentWeek,
            day: currentDay,
          })
          const { keep, laterOn } = filterByDayLength(all, mode)
          const { done, total } = countDone(all)
          const momTimeLessons = keep.filter((i) => i.lesson.activityType === 'mom-time')
          const independentLessons = keep.filter(
            (i) => i.lesson.activityType === 'independent' || i.lesson.activityType === 'hands-on',
          )

          return (
            <section
              key={child.id}
              className="rounded-2xl border-2 border-border bg-white p-6"
              style={{
                borderColor: `color-mix(in oklch, var(--${child.color}) 40%, transparent)`,
                backgroundColor: `color-mix(in oklch, var(--${child.color}) 3%, white)`,
              }}
            >
              {/* Child Header */}
              <div className="mb-6 flex items-center justify-between pb-4 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <ChildAvatar child={child} />
                  <div>
                    <h2 className="font-bold text-lg text-foreground">{child.name}</h2>
                    <p className="text-sm text-muted-foreground">{child.grade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {total > 0 && (
                    <span className="text-sm font-semibold text-muted-foreground">
                      {done}/{total}
                    </span>
                  )}
                  {done === total && total > 0 && (
                    <CheckCircle2 className="size-5 text-secondary" />
                  )}
                </div>
              </div>

              {/* No Lessons Message */}
              {all.length === 0 && (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
                  <p className="text-sm text-muted-foreground">No lessons scheduled today.</p>
                </div>
              )}

              {/* Mom Time Lessons (Priority) */}
              {momTimeLessons.length > 0 && (
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-lg bg-momtime text-momtime-foreground text-xs font-bold">
                      👩
                    </div>
                    <h3 className="font-bold text-foreground">Mom Time (5-10 min)</h3>
                  </div>
                  <div className="space-y-3">
                    {momTimeLessons.map((item) => (
                      <LessonCard key={item.assignment.id} item={item} childColor={child.color} />
                    ))}
                  </div>
                </div>
              )}

              {/* Independent & Hands-On */}
              {independentLessons.length > 0 && (
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-lg bg-independent text-independent-foreground text-xs font-bold">
                      ✓
                    </div>
                    <h3 className="font-bold text-foreground">Independent Work</h3>
                  </div>
                  <div className="space-y-3">
                    {independentLessons.map((item) => (
                      <LessonCard key={item.assignment.id} item={item} childColor={child.color} />
                    ))}
                  </div>
                </div>
              )}

              {/* If Time Allows */}
              {laterOn.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    If time allows
                  </p>
                  <div className="space-y-3 opacity-75">
                    {laterOn.map((item) => (
                      <LessonCard
                        key={item.assignment.id}
                        item={item}
                        childColor={child.color}
                        optional
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Add Lesson Button */}
              {all.length > 0 && (
                <div className="mt-6 border-t border-border/30 pt-4">
                  <LessonEditor
                    weekNumber={currentWeek}
                    defaultDay={currentDay as DayName}
                    defaultChildId={child.id}
                    onSaved={() => {}}
                    trigger={
                      <Button size="sm" variant="outline" className="w-full">
                        <span>+ Add lesson</span>
                      </Button>
                    }
                  />
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* Print Today Button */}
      <div className="sticky bottom-0 left-0 right-0 flex gap-3 rounded-t-2xl border-t border-border bg-gradient-to-t from-primary/10 to-transparent p-4 shadow-lg">
        <Button className="flex-1" size="lg" render={<Link href="/printables" />}>
          <Printer className="size-4" />
          Print Today
        </Button>
      </div>
    </div>
  )
}

/** Individual lesson card with action buttons */
function LessonCard({
  item,
  childColor,
  optional = false,
}: {
  item: AssignedLesson
  childColor: string
  optional?: boolean
}) {
  const { assignments } = useStore()
  const [isComplete, setIsComplete] = useState(item.assignment.status === 'done')

  const packetUrl = packetUrlFor(
    item.assignment.childId,
    item.lesson.weekNumber,
    item.lesson.day,
  )

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 rounded-lg border border-border p-4 transition-all',
        isComplete
          ? 'bg-secondary/10 opacity-60'
          : 'bg-card hover:bg-muted/40',
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <ActivityBadge type={item.lesson.activityType} />
          {isComplete && (
            <CheckCircle2 className="size-4 text-secondary flex-shrink-0" />
          )}
        </div>
        <h4 className={cn(
          'font-semibold text-foreground break-words',
          isComplete && 'line-through text-muted-foreground',
        )}>
          {item.lesson.title}
        </h4>
        {item.lesson.minutes && (
          <p className="text-xs text-muted-foreground mt-1">
            <Clock className="size-3 inline mr-1" />
            {item.lesson.minutes} min
          </p>
        )}
        {/* Teaching Guide Preview */}
        {item.lesson.momTime?.script && (
          <details className="mt-2 cursor-pointer">
            <summary className="text-xs font-semibold text-primary hover:text-primary/80">
              📖 How to teach
            </summary>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {item.lesson.momTime.script.substring(0, 200)}{item.lesson.momTime.script.length > 200 ? '...' : ''}
            </p>
          </details>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-shrink-0">
        {/* Teach Button (for Mom Time) */}
        {item.lesson.activityType === 'mom-time' && (
          <button
            title="Start Mom Time lesson"
            className="flex size-10 items-center justify-center rounded-lg bg-momtime text-momtime-foreground hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <BookOpen className="size-4" />
          </button>
        )}

        {/* Open Activity Button */}
        {item.lesson.activityType !== 'mom-time' && (
          <button
            title="Open activity"
            className="flex size-10 items-center justify-center rounded-lg bg-independent text-independent-foreground hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <GraduationCap className="size-4" />
          </button>
        )}

        {/* Print Button */}
        {packetUrl && (
          <a
            href={packetUrl}
            target="_blank"
            rel="noreferrer"
            title="Print worksheet"
            className="flex size-10 items-center justify-center rounded-lg bg-handson text-handson-foreground hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Printer className="size-4" />
          </a>
        )}

        {/* Challenge Button */}
        <button
          title="Optional challenge worksheet"
          className="flex size-10 items-center justify-center rounded-lg bg-optional text-optional-foreground hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <Star className="size-4" />
        </button>

        {/* Mark Complete Button */}
        <button
          onClick={() => setIsComplete(!isComplete)}
          title={isComplete ? 'Mark incomplete' : 'Mark complete'}
          className={cn(
            'flex size-10 items-center justify-center rounded-lg transition-all flex-shrink-0',
            isComplete
              ? 'bg-secondary/20 text-secondary'
              : 'bg-muted text-muted-foreground hover:bg-secondary/20',
          )}
        >
          <CheckCircle2 className="size-5" />
        </button>
      </div>
    </div>
  )
}
