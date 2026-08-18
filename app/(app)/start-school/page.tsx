'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  X,
  Play,
  Pause,
  Check,
  ArrowRight,
  Volume2,
  PartyPopper,
  Lightbulb,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import {
  assignedLessonsFor,
  childrenInView,
  sortByActivity,
  type AssignedLesson,
} from '@/lib/selectors'
import { ActivityBadge, SubjectPill } from '@/components/primitives'
import { Button } from '@/components/ui/button'
import { subjectMeta } from '@/lib/ui'
import { cn } from '@/lib/utils'

export default function StartSchoolPage() {
  const { children, assignments, lessons, currentView, currentWeek, currentDay } =
    useStore()
  const inView = childrenInView(children, currentView)

  const steps = useMemo<{ item: AssignedLesson; childName: string }[]>(() => {
    // family bible first, then per-child sorted by activity
    const bible: { item: AssignedLesson; childName: string }[] = []
    const rest: { item: AssignedLesson; childName: string }[] = []
    inView.forEach((child) => {
      const items = sortByActivity(
        assignedLessonsFor(child.id, assignments, lessons, {
          week: currentWeek,
          day: currentDay,
        }),
      )
      items.forEach((item) => {
        if (item.lesson.subject === 'bible') {
          if (!bible.some((b) => b.item.lesson.id === item.lesson.id))
            bible.push({ item, childName: 'Everyone' })
        } else {
          rest.push({ item, childName: child.name })
        }
      })
    })
    return [...bible, ...rest]
  }, [inView, assignments, lessons, currentWeek, currentDay])

  const [index, setIndex] = useState(0)
  const { toggleAssignment } = useStore()

  if (steps.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="font-serif text-2xl font-semibold">Nothing scheduled today</p>
        <p className="mt-1 text-muted-foreground">Enjoy the margin.</p>
        <Button asChild className="mt-4">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    )
  }

  const finished = index >= steps.length
  const current = steps[Math.min(index, steps.length - 1)]
  const next = steps[index + 1]

  return (
    <div className="mx-auto max-w-2xl">
      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(Math.min(index, steps.length) / steps.length) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
            {finished ? 'Complete' : `Step ${index + 1} of ${steps.length}`}
          </p>
        </div>
        <Button variant="ghost" size="icon" asChild className="ml-4">
          <Link href="/" aria-label="Exit guided mode">
            <X className="size-5" />
          </Link>
        </Button>
      </div>

      {finished ? (
        <FinishCard />
      ) : (
        <StepCard
          key={current.item.assignment.id}
          step={current}
          next={next}
          onDone={() => {
            if (current.item.assignment.status !== 'done')
              toggleAssignment(current.item.assignment.id)
            setIndex((i) => i + 1)
          }}
          onSkip={() => setIndex((i) => i + 1)}
        />
      )}
    </div>
  )
}

function StepCard({
  step,
  next,
  onDone,
  onSkip,
}: {
  step: { item: AssignedLesson; childName: string }
  next?: { item: AssignedLesson; childName: string }
  onDone: () => void
  onSkip: () => void
}) {
  const { lesson } = step.item
  const { Icon } = subjectMeta[lesson.subject]

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <SubjectPill subject={lesson.subject} />
        <ActivityBadge type={lesson.activityType} />
      </div>

      <div className="mt-4 flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Icon className="size-7" />
        </span>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            {step.childName}
          </p>
          <h2 className="font-serif text-2xl font-semibold text-balance">
            {lesson.title}
          </h2>
        </div>
      </div>

      <Timer minutes={lesson.minutes} />

      <div className="mt-5 space-y-4">
        {lesson.youNeed && (
          <Block label="You need">
            <div className="flex flex-wrap gap-2">
              {lesson.youNeed.map((n) => (
                <span
                  key={n}
                  className="rounded-full bg-muted px-3 py-1 text-sm font-medium"
                >
                  {n}
                </span>
              ))}
            </div>
          </Block>
        )}
        {lesson.teach && (
          <Block label="Teach">
            <ol className="list-decimal space-y-1.5 pl-5 text-sm">
              {lesson.teach.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </Block>
        )}
        {lesson.ask && (
          <Block label="Ask">
            <ul className="space-y-1 text-sm">
              {lesson.ask.map((a) => (
                <li key={a} className="italic">
                  &ldquo;{a}&rdquo;
                </li>
              ))}
            </ul>
          </Block>
        )}
        {lesson.watchFor && (
          <Block label="Watch for">
            <p className="text-sm">{lesson.watchFor}</p>
          </Block>
        )}
        {!lesson.teach && (
          <p className="rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
            {lesson.activityType === 'independent'
              ? `${step.childName} can work on this independently. Check in when finished.`
              : 'Set this up once, then let them explore hands-on.'}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {lesson.interactive && (
          <Button variant="outline" asChild>
            <Link href="/lessons/phonics">
              <Play className="size-4" /> Open activity
            </Link>
          </Button>
        )}
        <Button variant="ghost">
          <Volume2 className="size-4" /> Play audio
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" onClick={onSkip}>
          Skip
        </Button>
        <Button onClick={onDone}>
          <Check className="size-4" /> Done
        </Button>
      </div>

      {next && (
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-secondary/50 p-3 text-sm text-secondary-foreground">
          <ArrowRight className="size-4 shrink-0" />
          <span>
            <span className="font-bold">Next:</span> {next.childName} &mdash;{' '}
            {next.item.lesson.title}
            {step.item.lesson.activityType === 'mom-time' &&
              next.item.lesson.activityType !== 'mom-time' &&
              ` (while ${step.childName} works independently)`}
          </span>
        </div>
      )}
    </div>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted/50 p-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label === 'Watch for' && <Lightbulb className="size-3.5" />}
        {label}
      </p>
      {children}
    </div>
  )
}

function Timer({ minutes }: { minutes: number }) {
  const [seconds, setSeconds] = useState(minutes * 60)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [running])

  const mm = Math.floor(seconds / 60)
  const ss = seconds % 60
  const pct = 1 - seconds / (minutes * 60)

  return (
    <div className="mt-5 flex items-center gap-4 rounded-2xl border border-border bg-background p-3">
      <div className="relative flex size-14 items-center justify-center">
        <svg width={56} height={56} className="-rotate-90">
          <circle cx={28} cy={28} r={24} fill="none" stroke="var(--muted)" strokeWidth={5} />
          <circle
            cx={28}
            cy={28}
            r={24}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 24}
            strokeDashoffset={2 * Math.PI * 24 * (1 - pct)}
          />
        </svg>
        <span className="absolute text-xs font-bold tabular-nums">
          {mm}:{ss.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold">Suggested {minutes} min</p>
        <p className="text-xs text-muted-foreground">Keep it short and warm.</p>
      </div>
      <Button
        variant={running ? 'secondary' : 'default'}
        size="sm"
        onClick={() => setRunning((r) => !r)}
      >
        {running ? <Pause className="size-4" /> : <Play className="size-4" />}
        {running ? 'Pause' : 'Start timer'}
      </Button>
    </div>
  )
}

function FinishCard() {
  return (
    <div className="rounded-3xl border border-secondary bg-secondary/30 p-8 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <PartyPopper className="size-8" />
      </span>
      <h2 className="mt-4 font-serif text-3xl font-semibold">Core day complete</h2>
      <p className="mt-2 text-pretty text-muted-foreground">
        You showed up and did the work that matters. Optional enrichment can wait
        for another day &mdash; no guilt.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/progress">Log progress</Link>
        </Button>
      </div>
    </div>
  )
}
