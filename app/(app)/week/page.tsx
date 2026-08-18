'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { dayLabels, dayRhythm } from '@/lib/ui'
import { PageHeader } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Palette, FlaskConical, BookOpen, Quote, CalendarCheck } from 'lucide-react'

export default function WeekPage() {
  const store = useStore()
  const [weekNum, setWeekNum] = useState(store.currentWeek)
  const week = store.weeks.find((w) => w.number === weekNum) ?? store.weeks[0]

  if (!week) return <p className="text-muted-foreground">No week data yet.</p>

  const dayLessons = (Object.keys(dayRhythm) as string[]).map((day) => ({
    day,
    count: store.lessons.filter((l) => l.weekNumber === week.number && l.day === day).length,
  }))

  const fromLessons = (day: string) => {
    const n = store.lessons.filter(
      (l) => l.weekNumber === week.number && l.day === day,
    ).length
    return n === 0 ? 'No lessons' : `${n} lesson${n === 1 ? '' : 's'}`
  }

  return (
    <div>
      <PageHeader
        eyebrow="Week at a glance"
        title={`Week ${week.number}: ${week.theme}`}
        description="See the whole week's theme, memory verse, and what each day holds before you dive in."
      >
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5">
          <button
            onClick={() => setWeekNum((n) => Math.max(1, n - 1))}
            disabled={weekNum === 1}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:opacity-40"
            aria-label="Previous week"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-24 text-center text-sm font-bold">Week {week.number}</span>
          <button
            onClick={() => setWeekNum((n) => Math.min(store.weeks.length, n + 1))}
            disabled={weekNum === store.weeks.length}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:opacity-40"
            aria-label="Next week"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </PageHeader>

      <div className="space-y-5">
        {/* Theme + big idea */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <BookOpen className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{week.bibleRef}</p>
              <h2 className="mt-1 font-serif text-2xl font-semibold">{week.bigIdea}</h2>
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-sm text-foreground">
                <Quote className="size-4 shrink-0 text-primary" />
                <span>
                  <span className="font-semibold">Memory verse:</span> “{week.memoryVerse}” —{' '}
                  {week.memoryVerseRef}
                </span>
              </p>
            </div>
          </div>
        </Card>

        {/* Art + Science ideas */}
        <div className="grid gap-4 md:grid-cols-2">
          <ThemeChip Icon={Palette} label="Art ideas" items={week.art} token="child-seraiah" />
          <ThemeChip Icon={FlaskConical} label="Science ideas" items={week.science} token="child-alijah" />
        </div>

        {/* Weekly rhythm */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <CalendarCheck className="size-4" />
            </span>
            <h3 className="font-serif text-lg font-semibold">Weekly rhythm</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-5">
            {(Object.keys(dayLabels) as string[]).map((day) => (
              <div key={day} className="rounded-2xl border border-border p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{dayLabels[day]}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{dayRhythm[day]}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {fromLessons(day)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function ThemeChip({
  Icon,
  label,
  items,
  token,
}: {
  Icon: typeof Palette
  label: string
  items: string[]
  token: string
}) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex size-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `color-mix(in oklch, var(--${token}) 18%, transparent)`, color: `var(--${token})` }}
        >
          <Icon className="size-4" />
        </span>
        <h3 className="font-serif text-lg font-semibold text-foreground">{label}</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">None listed.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2.5 text-sm text-foreground">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: `var(--${token})` }} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}