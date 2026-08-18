'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Play,
  Printer,
  Zap,
  CalendarRange,
  Library,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { assignedLessonsFor, childrenInView, countDone } from '@/lib/selectors'
import { ChildAvatar, ProgressRing } from '@/components/primitives'
import { buttonVariants } from '@/components/ui/button'
import { dayLabels, dayRhythm } from '@/lib/ui'

export default function HomePage() {
  const store = useStore()
  const {
    households,
    children,
    assignments,
    lessons,
    weeks,
    currentView,
    currentWeek,
    currentDay,
  } = store

  const week = weeks.find((w) => w.number === currentWeek)!
  const inView = childrenInView(children, currentView)
  const momName =
    currentView === 'shared'
      ? 'friends'
      : households.find((h) => h.id === currentView)?.momName ?? 'there'

  const [greeting, setGreeting] = useState('Good morning')

  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening')
  }, [])

  return (
    <div className="space-y-8">
      {/* Greeting + today band */}
      <section>
        <p className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          {greeting}, <span className="text-primary">{momName}</span>
        </p>
        <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Today
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {dayLabels[currentDay]} &middot; Week {currentWeek}
              </p>
              <p className="font-serif text-2xl font-semibold text-balance text-foreground">
                {week.theme}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {dayRhythm[currentDay]} &middot; {week.bibleRef}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Link
                href="/start-school"
                className={buttonVariants({ size: 'lg', className: 'h-12 rounded-2xl px-8 text-base' })}
              >
                <Play className="size-5" /> Start School
              </Link>
              <p className="text-xs text-muted-foreground">
                Guided, one step at a time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Today at a glance */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">Today at a glance</h2>
          <Link
            href="/today"
            className="flex items-center gap-1 text-sm font-semibold text-primary"
          >
            View plan <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {inView.map((child) => {
            const items = assignedLessonsFor(child.id, assignments, lessons, {
              week: currentWeek,
              day: currentDay,
            })
            const { done, total } = countDone(items)
            const coreDone = items
              .filter((i) => ['math', 'literacy', 'bible'].includes(i.lesson.subject))
              .every((i) => i.assignment.status === 'done')
            return (
              <Link
                key={child.id}
                href={`/kid/${child.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <ProgressRing value={done} total={total} color={child.color} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground">{child.name}</p>
                  <p className="text-sm text-muted-foreground">{child.grade}</p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    {done} of {total} core activities
                  </p>
                </div>
                {total > 0 && coreDone && (
                  <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold uppercase text-secondary-foreground">
                    <CheckCircle2 className="size-3" /> Core
                  </span>
                )}
              </Link>
            )
          })}
          {inView.length === 0 && (
            <p className="text-muted-foreground">
              No children in this view. Switch households or add a child in Settings.
            </p>
          )}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 font-serif text-xl font-semibold">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <QuickAction href="/print-center" Icon={Printer} label="Print Today's Pages" />
          <QuickAction href="/today?mode=30" Icon={Zap} label="Quick School Day" />
          <QuickAction href="/week" Icon={CalendarRange} label="View Week" />
          <QuickAction href="/library" Icon={Library} label="Library Mission" />
          <QuickAction href="/prep" Icon={BookOpen} label="Prep My Week" />
        </div>
      </section>

      {/* Big idea */}
      <section className="rounded-3xl border border-border bg-secondary/50 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">
          This week&apos;s big idea
        </p>
        <p className="mt-2 font-serif text-2xl font-semibold text-balance text-foreground">
          {week.bigIdea}
        </p>
        <p className="mt-3 text-pretty text-muted-foreground">
          Memory verse: &ldquo;{week.memoryVerse}&rdquo; &mdash; {week.memoryVerseRef}
        </p>
      </section>
    </div>
  )
}

function QuickAction({
  href,
  Icon,
  label,
}: {
  href: string
  Icon: typeof Printer
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent/50"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
        <Icon className="size-5" />
      </span>
      <span className="text-sm font-bold leading-tight text-foreground text-balance">
        {label}
      </span>
    </Link>
  )
}
