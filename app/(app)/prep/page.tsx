'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Printer, Calendar, Check, Coffee, ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PageHeader } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
    title: "Read this week's Bible theme",
    minutes: 3,
    Icon: BookOpen,
    body: 'Skim the theme, big idea, and memory verse so it is in your heart before you teach it.',
    href: '/bible',
    hrefLabel: 'Open Bible & Theme',
  },
  {
    id: 'print',
    title: "Print the week's packets",
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
    Icon: Printer,
    body: 'Check the supply list. Most items are already in your kitchen — set aside the few that are not.',
    href: '/supplies',
    hrefLabel: 'Open Supply List',
  },
  {
    id: 'plan',
    title: "Glance at the week's rhythm",
    minutes: 2,
    Icon: Calendar,
    body: 'See the Monday-introduce, Friday-review flow and note your co-op day so nothing sneaks up.',
    href: '/week',
    hrefLabel: 'View Week',
  },
  {
    id: 'rest',
    title: 'Take a breath',
    minutes: 1,
    Icon: Coffee,
    body: "You're ready. A calm, prepared start makes a peaceful morning. You're doing a good thing.",
  },
]

export default function PrepPage() {
  const store = useStore()
  const week = store.weeks.find((w) => w.number === store.currentWeek) ?? store.weeks[0]
  const [done, setDone] = useState<Record<string, boolean>>({})
  const total = STEPS.length
  const completed = STEPS.filter((s) => done[s.id]).length
  const allDone = completed === total

  return (
    <div>
      <PageHeader
        eyebrow="Prep My Week"
        title="Week prep checklist"
        description="Five small things before the week begins. None of them take long, and they make mornings run themselves."
      >
        <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-foreground">
          {completed}/{total} done
        </span>
      </PageHeader>

      {allDone && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3 text-secondary-foreground">
          <Check className="size-5" />
          <span className="font-semibold">
            You're prepped for Week {week?.number} ({week?.theme}). Enjoy the calm start!
          </span>
        </div>
      )}

      <div className="space-y-3">
        {STEPS.map((step) => {
          const isDone = !!done[step.id]
          return (
            <Card
              key={step.id}
              className={cn('p-4 transition-colors', isDone && 'border-secondary bg-secondary/30')}
            >
              <div className="flex items-start gap-3">
                <button
                  aria-label={`Mark ${step.title} complete`}
                  onClick={() => setDone((d) => ({ ...d, [step.id]: !d[step.id] }))}
                  className={cn(
                    'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    isDone
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-transparent hover:border-primary',
                  )}
                >
                  <Check className="size-4" strokeWidth={3} />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
                      <step.Icon className="size-4" />
                    </span>
                    <h3
                      className={cn(
                        'font-bold text-foreground',
                        isDone && 'text-muted-foreground line-through',
                      )}
                    >
                      {step.title}
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {step.minutes} min
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{step.body}</p>
                  {step.href && (
                    <Link
                      href={step.href}
                      className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                    >
                      {step.hrefLabel} <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}