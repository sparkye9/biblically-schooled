'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Coffee,
  Users,
  Zap,
  ListChecks,
  Play,
  Printer,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
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
import { ActivityCard, interactiveHref } from '@/components/activity-card'
import { RotationAssistant } from '@/components/rotation-assistant'
import { Button } from '@/components/ui/button'
import { LessonEditor } from '@/components/lesson-editor'
import { cn } from '@/lib/utils'
import { dayLabels } from '@/lib/ui'
import { packetUrlFor } from '@/lib/worksheet-packets'
import type { DayName } from '@/lib/types'

type DayMode = 'essential' | '30' | '60' | 'full'

const modes: { id: DayMode; label: string }[] = [
  { id: 'essential', label: 'Essential only' },
  { id: '30', label: '30-min day' },
  { id: '60', label: '60-min day' },
  { id: 'full', label: 'Full day' },
]

export default function TodayPage() {
  const { children, assignments, lessons, currentView, currentWeek, currentDay } =
    useStore()
  const [mode, setMode] = useState<DayMode>('full')
  const [workMode, setWorkMode] = useState(false)
  const [pulled, setPulled] = useState(false)

  const inView = childrenInView(children, currentView)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${dayLabels[currentDay]} \u00b7 Week ${currentWeek}`}
        title="Today's plan"
        description="Everything on deck today, grouped by child. Tighten the day when you're short on time."
      />

      {/* Day length + work mode controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
                mode === m.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent',
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <Button
          variant={workMode ? 'default' : 'outline'}
          onClick={() => setWorkMode((w) => !w)}
        >
          <Briefcase className="size-4" />
          {workMode ? "I'm working — on" : "I'm working right now"}
        </Button>
      </div>

      {mode !== 'full' && (
        <p className="flex items-center gap-2 rounded-xl bg-secondary/50 px-4 py-2.5 text-sm font-medium text-secondary-foreground">
          <Zap className="size-4" />
          Prioritizing Math, Literacy and Bible. Enrichment moved to
          &ldquo;If we have time.&rdquo;
        </p>
      )}

      {workMode ? (
        <WorkModeView
          inView={inView}
          pulled={pulled}
          setPulled={setPulled}
        />
      ) : (
        <>
          <RotationAssistant />
          <div className="space-y-6">
            {inView.map((child) => {
              const all = assignedLessonsFor(child.id, assignments, lessons, {
                week: currentWeek,
                day: currentDay,
              })
              const { keep, laterOn } = filterByDayLength(all, mode)
              const { done, total } = countDone(all)
              const coreDone = all
                .filter((i) =>
                  ['math', 'literacy', 'bible'].includes(i.lesson.subject),
                )
                .every((i) => i.assignment.status === 'done')
              return (
                <section key={child.id}>
                  <div className="mb-3 flex items-center gap-3">
                    <ChildAvatar child={child} />
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{child.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {child.grade} &middot; {done}/{total} complete
                      </p>
                    </div>
                    {total > 0 && coreDone && (
                      <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase text-secondary-foreground">
                        <CheckCircle2 className="size-3.5" /> Core day complete
                      </span>
                    )}
                    <LessonEditor
                      weekNumber={currentWeek}
                      defaultDay={currentDay as DayName}
                      defaultChildId={child.id}
                      onSaved={() => {}}
                      trigger={
                        <Button size="sm" variant="outline">
                          <Plus className="size-4" /> Add lesson
                        </Button>
                      }
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {sortByActivity(keep).map((item) => (
                      <ActivityCard key={item.assignment.id} item={item} />
                    ))}
                  </div>
                  {laterOn.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        If we have time
                      </p>
                      <div className="grid gap-3 md:grid-cols-2">
                        {sortByActivity(laterOn).map((item) => (
                          <ActivityCard key={item.assignment.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}
                  {all.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                      Nothing scheduled today. Enjoy the margin.
                    </p>
                  )}
                </section>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function WorkModeView({
  inView,
  pulled,
  setPulled,
}: {
  inView: ReturnType<typeof childrenInView>
  pulled: boolean
  setPulled: (v: boolean) => void
}) {
  const { assignments, lessons, currentWeek, currentDay } = useStore()
  const [breakTime, setBreakTime] = useState('10:30 AM')

  const all: AssignedLesson[] = inView.flatMap((c) =>
    assignedLessonsFor(c.id, assignments, lessons, {
      week: currentWeek,
      day: currentDay,
    }).map((i) => ({ ...i })),
  )
  const nameFor = (childId: string) =>
    inView.find((c) => c.id === childId)?.name ?? ''

  const kidsCanDo = all.filter(
    (i) => i.lesson.activityType === 'independent' || i.lesson.activityType === 'hands-on',
  )
  const forBreak = all.filter((i) => i.lesson.activityType === 'mom-time')
  const together = all.filter((i) => i.lesson.activityType === 'optional')

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/8 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="size-4 text-primary" />
          <span className="font-semibold">My next break is</span>
          <input
            value={breakTime}
            onChange={(e) => setBreakTime(e.target.value)}
            className="w-28 rounded-lg border border-border bg-card px-2 py-1 font-semibold"
          />
        </div>
        <Button
          variant={pulled ? 'default' : 'outline'}
          onClick={() => setPulled(!pulled)}
        >
          <AlertCircle className="size-4" />
          {pulled ? 'Resume school' : 'I got pulled into work'}
        </Button>
      </div>

      {pulled && (
        <div className="rounded-2xl border border-accent bg-accent/40 p-4">
          <p className="font-bold text-foreground">
            Quick independent picks while you step away
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {kidsCanDo.slice(0, 5).map((i) => (
              <li key={i.assignment.id} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="font-semibold">{nameFor(i.assignment.childId)}:</span>{' '}
                {i.lesson.title}
              </li>
            ))}
            {kidsCanDo.length === 0 && (
              <li className="text-muted-foreground">
                Try an Activity Bin: playdough letters, counting bin, or fine-motor tray.
              </li>
            )}
          </ul>
        </div>
      )}

      <WorkColumn
        Icon={ListChecks}
        title="Kids can do now"
        subtitle="Little or no help needed"
        items={kidsCanDo}
        nameFor={nameFor}
        tone="independent"
      />
      <WorkColumn
        Icon={Coffee}
        title={`Save for my break (${breakTime})`}
        subtitle="5\u201310 minute parent-led lessons"
        items={forBreak}
        nameFor={nameFor}
        tone="momtime"
      />
      <WorkColumn
        Icon={Users}
        title="Do together later"
        subtitle="Bible, science, art, read-alouds"
        items={together}
        nameFor={nameFor}
        tone="optional"
      />
    </div>
  )
}

function WorkColumn({
  Icon,
  title,
  subtitle,
  items,
  nameFor,
  tone,
}: {
  Icon: typeof Coffee
  title: string
  subtitle: string
  items: AssignedLesson[]
  nameFor: (id: string) => string
  tone: string
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex size-8 items-center justify-center rounded-lg"
          style={{
            backgroundColor: `color-mix(in oklch, var(--${tone}) 16%, transparent)`,
            color: `var(--${tone})`,
          }}
        >
          <Icon className="size-4" />
        </span>
        <div>
          <p className="font-bold leading-tight text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here right now.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((i) => (
            <li
              key={i.assignment.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3 py-2.5"
            >
              <span className="text-sm">
                <span className="font-semibold">{nameFor(i.assignment.childId)}:</span>{' '}
                {i.lesson.title}
              </span>
              <div className="flex items-center gap-2">
                <ActivityBadge type={i.lesson.activityType} />
                {i.lesson.interactive && (
                  <Button
                    size="sm"
                    variant="ghost"
                    nativeButton={false}
                    render={<Link href={interactiveHref[i.lesson.interactive]} />}
                  >
                    <Play className="size-3.5" />
                  </Button>
                )}
                {i.lesson.printable &&
                  (() => {
                    const packetUrl = packetUrlFor(
                      i.assignment.childId,
                      i.lesson.weekNumber,
                      i.lesson.day,
                    )
                    return packetUrl ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        nativeButton={false}
                        render={<a href={packetUrl} target="_blank" rel="noreferrer" />}
                      >
                        <Printer className="size-3.5" />
                      </Button>
                    ) : null
                  })()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
