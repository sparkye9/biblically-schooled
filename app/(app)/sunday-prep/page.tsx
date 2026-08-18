'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { accent, accentBg } from '@/lib/ui'
import { PageHeader } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, BookOpen, Printer, Package, CalendarCheck, Coffee, ArrowRight } from 'lucide-react'

interface Step {
  id: string
  title: string
  minutes: number
  Icon: typeof BookOpen
  body: string
  href?: string
  hrefLabel?: string
}

const STEPS: Step[] = [
  {
    id: 'theme',
    title: 'Read this week\u2019s Bible theme',
    minutes: 3,
    Icon: BookOpen,
    body: 'Skim the theme, big idea, and memory verse so it\u2019s in your heart before you teach it.',
    href: '/bible',
    hrefLabel: 'Open Bible & Theme',
  },
  {
    id: 'print',
    title: 'Print the week\u2019s packets',
    minutes: 5,
    Icon: Printer,
    body: 'Send the printables to your printer now and clip them by child so mornings are grab-and-go.',
    href: '/print-center',
    hrefLabel: 'Open Print Center',
  },
  {
    id: 'supplies',
    title: 'Gather supplies',
    minutes: 4,
    Icon: Package,
    body: 'Check the supply list. Most items are already in your kitchen — set aside the few that aren\u2019t.',
    href: '/supplies',
    hrefLabel: 'Open Supply List',
  },
  {
    id: 'plan',
    title: 'Glance at the week\u2019s rhythm',
    minutes: 2,
    Icon: CalendarCheck,
    body: 'See the Monday-introduce, Friday-review flow and note your co-op day so nothing sneaks up.',
    href: '/planner',
    hrefLabel: 'Open Weekly Planner',
  },
  {
    id: 'rest',
    title: 'Take a breath',
    minutes: 1,
    Icon: Coffee,
    body: 'You\u2019re ready. A calm, prepared Sunday makes a peaceful Monday. You\u2019re doing a good thing.',
  },
]

export default function SundayPrepPage() {
  const store = useStore()
  const [done, setDone] = useState<Record<string, boolean>>({})
  const doneCount = Object.values(done).filter(Boolean).length
  const totalMinutes = STEPS.reduce((s, x) => s + x.minutes, 0)
  const week = store.weeks.find((w) => w.number === store.currentWeek)

  return (
    <div>
      <PageHeader
        eyebrow="15 Minutes to a Calm Week"
        title="Sunday Prep"
        description={`Set up Week ${store.currentWeek}: ${week?.theme}. Five small steps, about ${totalMinutes} minutes total.`}
      >
        <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-foreground">
          {doneCount}/{STEPS.length} done
        </span>
      </PageHeader>

      <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(doneCount / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="space-y-4">
        {STEPS.map((step, i) => {
          const isDone = done[step.id]
          return (
            <Card
              key={step.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
            >
              <button
                onClick={() => setDone((d) => ({ ...d, [step.id]: !d[step.id] }))}
                className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                style={
                  isDone
                    ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }
                    : { borderColor: 'var(--border)' }
                }
                aria-label={isDone ? 'Mark not done' : 'Mark done'}
              >
                {isDone ? (
                  <Check className="size-5 text-primary-foreground" strokeWidth={3} />
                ) : (
                  <step.Icon className="size-5 text-muted-foreground" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-primary">
                    Step {i + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ~{step.minutes} min
                  </span>
                </div>
                <h2
                  className={
                    isDone
                      ? 'font-serif text-lg font-semibold text-muted-foreground line-through'
                      : 'font-serif text-lg font-semibold text-foreground'
                  }
                >
                  {step.title}
                </h2>
                <p className="mt-0.5 text-pretty text-sm text-muted-foreground">
                  {step.body}
                </p>
              </div>

              {step.href && (
                <Button
                  asChild
                  variant="outline"
                  className="shrink-0 gap-1.5 bg-transparent"
                >
                  <Link href={step.href}>
                    {step.hrefLabel} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </Card>
          )
        })}
      </div>

      {doneCount === STEPS.length && (
        <Card
          className="mt-6 p-6 text-center"
          style={accentBg('primary', 0.08)}
        >
          <Check className="mx-auto mb-2 size-10" style={accent('primary')} />
          <h2 className="font-serif text-xl font-semibold text-foreground">
            You&apos;re all set for the week
          </h2>
          <p className="mt-1 text-muted-foreground">
            Everything&apos;s printed, gathered, and planned. Go enjoy your Sunday.
          </p>
        </Card>
      )}
    </div>
  )
}
