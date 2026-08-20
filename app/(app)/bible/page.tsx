'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { accent, accentBg } from '@/lib/ui'
import { childrenInView } from '@/lib/selectors'
import { packetUrlFor } from '@/lib/worksheet-packets'
import type { Child, Lesson } from '@/lib/types'
import { PageHeader, ChildAvatar } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import {
  BookOpen,
  Palette,
  FlaskConical,
  Quote,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react'

export default function BiblePage() {
  const store = useStore()
  const [weekNum, setWeekNum] = useState(store.currentWeek)
  const week = store.weeks.find((w) => w.number === weekNum) ?? store.weeks[0]
  const kids = childrenInView(store.children, store.currentView)
  const artLesson = store.lessons.find(
    (l) => l.weekNumber === week.number && l.subject === 'art',
  )
  const scienceLesson = store.lessons.find(
    (l) => l.weekNumber === week.number && l.subject === 'science',
  )

  return (
    <div>
      <PageHeader
        eyebrow="Faith at the Center"
        title="Bible & Weekly Theme"
        description="Every subject flows out of one Bible theme each week, so the whole family learns together — Pre-K through the upper grades."
      />

      {/* Week switcher */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-card p-2">
        <button
          onClick={() => setWeekNum((n) => Math.max(1, n - 1))}
          disabled={weekNum === 1}
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
          aria-label="Previous week"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Week {week.number}
          </p>
          <p className="font-serif text-lg font-semibold text-foreground">
            {week.bibleRef}
          </p>
        </div>
        <button
          onClick={() => setWeekNum((n) => Math.min(store.weeks.length, n + 1))}
          disabled={weekNum === store.weeks.length}
          className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
          aria-label="Next week"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <Card className="mb-5 overflow-hidden p-0">
        <div className="p-6" style={accentBg('primary', 0.08)}>
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="size-5" />
            <span className="text-xs font-bold uppercase tracking-widest">
              This Week&apos;s Theme
            </span>
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-balance text-foreground">
            {week.theme}
          </h2>
          <p className="mt-2 max-w-2xl text-pretty text-lg text-muted-foreground">
            {week.bigIdea}
          </p>
        </div>

        <div className="border-t border-border p-6">
          <div className="flex items-start gap-3">
            <Quote className="mt-1 size-6 shrink-0 text-primary" />
            <div>
              <p className="font-serif text-xl italic text-foreground text-pretty">
                &ldquo;{week.memoryVerse}&rdquo;
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {week.memoryVerseRef}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <ThemeList
          Icon={Palette}
          title="Art connects to the theme"
          items={week.art}
          token="child-seraiah"
          lesson={artLesson}
          weekNumber={week.number}
          kids={kids}
        />
        <ThemeList
          Icon={FlaskConical}
          title="Science connects to the theme"
          items={week.science}
          token="child-olori"
          lesson={scienceLesson}
          weekNumber={week.number}
          kids={kids}
        />
      </div>

      <Card className="mt-5 p-5">
        <h3 className="mb-1 font-serif text-lg font-semibold text-foreground">
          How to teach the memory verse (all ages)
        </h3>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          {[
            'Say the whole verse once, warmly and slowly.',
            'Say it again and have everyone echo you, one phrase at a time.',
            'Add simple hand motions for the key words.',
            'Say it together three times, getting a little softer each time.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={accentBg('primary', 0.16)}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}

function ThemeList({
  Icon,
  title,
  items,
  token,
  lesson,
  weekNumber,
  kids,
}: {
  Icon: typeof Palette
  title: string
  items: string[]
  token: string
  lesson?: Lesson
  weekNumber: number
  kids: Child[]
}) {
  const downloads = kids
    .map((child) => ({
      child,
      url: lesson ? packetUrlFor(child.id, weekNumber, lesson.day) : null,
    }))
    .filter((d): d is { child: Child; url: string } => !!d.url)

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex size-9 items-center justify-center rounded-xl"
          style={accentBg(token, 0.18)}
        >
          <Icon className="size-5" style={accent(token)} />
        </span>
        <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2.5 text-sm text-foreground"
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: `var(--${token})` }}
            />
            {item}
          </li>
        ))}
      </ul>
      {downloads.length > 0 && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Worksheet
          </p>
          <div className="flex flex-wrap gap-2">
            {downloads.map(({ child, url }) => (
              <a
                key={child.id}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <ChildAvatar child={child} size="sm" />
                {child.name}
                <Download className="size-3.5 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
