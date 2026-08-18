'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { X, Calculator, BookOpen, Home } from 'lucide-react'
import { useStore } from '@/lib/store'
import { childrenInView } from '@/lib/selectors'
import { accent, accentBg } from '@/lib/ui'
import { ChildAvatar } from '@/components/primitives'
import { PhonicsBoard } from '@/components/interactive/phonics'
import { WordBuilder } from '@/components/interactive/word-building'
import { NumberBondBoard } from '@/components/interactive/math-manipulatives'

const LESSONS: Record<
  string,
  { title: string; sub: string; Icon: typeof Home }
> = {
  phonics: {
    title: 'Phonics Practice',
    sub: 'Tap a letter, hear its sound, and build the sound.',
    Icon: BookOpen,
  },
  math: {
    title: 'Number Bonds',
    sub: 'Tap counters to split a whole into two parts.',
    Icon: Calculator,
  },
  'word-building': {
    title: 'Word Building',
    sub: 'Build a word letter by letter, then hear it.',
    Icon: BookOpen,
  },
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>
}) {
  const { lesson } = use(params)
  const { children, currentView } = useStore()
  const inView = childrenInView(children, currentView)
  const meta = LESSONS[lesson] ?? LESSONS['word-building']

  const [childId, setChildId] = useState(inView[0]?.id ?? children[0]?.id ?? '')
  const child = inView.find((c) => c.id === childId) ?? inView[0] ?? children[0]

  if (!child) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-6 text-center">
        <div>
          <p className="font-serif text-2xl font-semibold">No children yet</p>
          <p className="mt-1 text-muted-foreground">
            Add a child in Settings, then come back to play.
          </p>
          <Link
            href="/settings"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Open Settings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main
      className="min-h-dvh px-5 py-6"
      style={{
        background: `linear-gradient(180deg, color-mix(in oklch, var(--${child.color}) 12%, var(--background)), var(--background))`,
      }}
    >
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex size-12 items-center justify-center rounded-2xl text-2xl text-white"
              style={{ backgroundColor: `var(--${child.color})` }}
            >
              <meta.Icon className="size-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Online activity
              </p>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                {meta.title}
              </h1>
            </div>
          </div>
          <Link
            href="/"
            aria-label="Back home"
            className="flex size-11 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm"
          >
            <Home className="size-5" />
          </Link>
        </div>

        {/* Child picker */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">
            For
          </span>
          {inView.map((c) => {
            const active = c.id === child.id
            return (
              <button
                key={c.id}
                onClick={() => setChildId(c.id)}
                className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm font-semibold transition-colors"
                style={
                  active
                    ? { ...accentBg(c.color, 0.18), borderColor: `var(--${c.color})` }
                    : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }
                }
              >
                <ChildAvatar child={c} size="sm" />
                {c.name}
              </button>
            )
          })}
        </div>

        <p className="mb-4 text-pretty text-muted-foreground">{meta.sub}</p>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          {lesson === 'phonics' && <PhonicsBoard color={child.color} />}
          {lesson === 'math' && <NumberBondBoard color={child.color} />}
          {lesson === 'word-building' && <WordBuilder color={child.color} />}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
          >
            <X className="size-4" /> Done for now
          </Link>
        </div>
      </div>
    </main>
  )
}