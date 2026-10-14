'use client'

import { useRouter } from 'next/navigation'
import { CalendarCheck, FastForward, HeartHandshake, RotateCcw } from 'lucide-react'
import { getBibleWeek } from '@/lib/curriculum/bible'
import { getLiteracyWeek } from '@/lib/curriculum/literacy'
import { pathwayFor } from '@/lib/plan/day-plan'
import { positionOf } from '@/lib/plan/schedule'
import * as logic from '@/lib/state/logic'
import { useStore } from '@/lib/store'
import { Card, PageHeader } from '@/components/primitives'

export default function RestartPage() {
  const store = useStore()
  const router = useRouter()
  const opts = logic.restartOptions(store, store.todayIso)
  const here = positionOf(store.pointer)
  const there = positionOf(opts.calendarIndex)
  const choose = (choice: 'continue' | 'review-first' | 'catch-up') => {
    store.restart(choice)
    router.push('/')
  }
  const skippedTitles = (() => {
    const list: string[] = []
    const child = store.children.find((c) => c.gradeBand === '1st') ?? store.children[0]
    if (!child) return list
    for (let w = here.week; w < there.week && list.length < 4; w++) list.push(getLiteracyWeek(pathwayFor(child.gradeBand), w).title)
    return list
  })()

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        eyebrow="We’re starting again"
        title="Welcome back. Let’s ease in."
        description="Life happens. Nothing was marked done while you were away, and nothing piled up. Pick the restart that fits today."
      />
      <Card className="bg-sage-soft/40 text-sm">
        <p>
          {opts.daysAway > 0 ? (
            <>
              It’s been <b>{opts.daysAway} days</b> since your last lesson ({opts.missedSchoolDays} school days).
            </>
          ) : (
            'Ready when you are.'
          )}{' '}
          You’re on <b>Week {here.week}, Day {here.day + 1}</b> — {getBibleWeek(here.week).title}.
        </p>
        <p className="mt-1 text-muted-foreground">Your first day back will be set to a Minimum day (about 20 minutes). You can change it on Today.</p>
      </Card>

      <div className="grid gap-3">
        <Option
          Icon={RotateCcw}
          title="Start with a welcome-back review day"
          body={`One gentle review lesson from Week ${Math.max(1, here.week - 1)} to warm up, then pick up at Week ${here.week}, Day ${here.day + 1}. Recommended after a week or more away.`}
          recommended={opts.daysAway >= 7}
          onClick={() => choose('review-first')}
        />
        <Option
          Icon={CalendarCheck}
          title="Pick up right where we left off"
          body={`Continue with Week ${here.week}, Day ${here.day + 1}. Your projected finish date simply moves later.`}
          recommended={opts.daysAway < 7}
          onClick={() => choose('continue')}
        />
        {opts.behindBy > 0 && (
          <Option
            Icon={FastForward}
            title="Catch up with the calendar"
            body={`Jump ahead to Week ${there.week}, Day ${there.day + 1}. Skipped lessons are NOT marked done — their skills stay “Not introduced” and come back on review days${skippedTitles.length ? ` (e.g. ${skippedTitles.join(', ')})` : ''}.`}
            onClick={() => choose('catch-up')}
          />
        )}
      </div>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <HeartHandshake className="size-4 text-primary" /> Optional enrichment can wait. Bible, reading, and math are enough for a fresh start.
      </p>
    </div>
  )
}

function Option({ Icon, title, body, onClick, recommended }: { Icon: typeof RotateCcw; title: string; body: string; onClick: () => void; recommended?: boolean }) {
  return (
    <button type="button" onClick={onClick} className="flex items-start gap-3 rounded-2xl border-2 border-border bg-card p-4 text-left transition-colors hover:border-primary">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sage-soft text-primary">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="flex flex-wrap items-center gap-2 font-bold">
          {title}
          {recommended && <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[11px] font-bold">Suggested</span>}
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">{body}</span>
      </span>
    </button>
  )
}
