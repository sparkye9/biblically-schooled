'use client'

import { use, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Lock, PartyPopper, Star, Sun, Volume2 } from 'lucide-react'
import { getBibleWeek, seasonFor } from '@/lib/curriculum/bible'
import { getLiteracyWeek, graphemesTaughtThrough } from '@/lib/curriculum/literacy'
import { buildDayPlan, type PlanItem } from '@/lib/plan/day-plan'
import * as logic from '@/lib/state/logic'
import { speak } from '@/lib/speech'
import { useStore } from '@/lib/store'
import { getWorksheet } from '@/lib/worksheets'
import { SUBJECT_META, SubjectIcon } from '@/components/teaching-guide'
import { PhonicsBoard } from '@/components/interactive/phonics'
import { WordBuilder } from '@/components/interactive/word-building'
import { MemoryVerseBoard } from '@/components/interactive/memory-verse'
import { NumberBondBoard } from '@/components/interactive/math-manipulatives'

type Game = 'letters' | 'words' | 'verse' | 'numbers' | null

export default function KidPage({ params }: { params: Promise<{ childId: string }> }) {
  const { childId } = use(params)
  const store = useStore()
  const router = useRouter()
  const child = store.children.find((c) => c.id === childId)
  const [game, setGame] = useState<Game>(null)
  const [gate, setGate] = useState(false)
  const [cheer, setCheer] = useState(false)

  const info = useMemo(() => {
    if (!child) return null
    const learner = logic.learnerOf(child)
    const kind = logic.todayKind(store, store.todayIso)
    const anyway = store.todayChoice?.date === store.todayIso && !!store.todayChoice.anyway
    const { mode, easy } = logic.modeFor(store, store.todayIso)
    const welcomeBack = !!store.welcomeBackPending
    const plan = buildDayPlan({
      index: welcomeBack ? logic.welcomeBackIndex(store.pointer) : store.pointer,
      mode,
      easy,
      learners: [learner],
      enrichment: kind === 'school' ? store.schedule[store.now.getDay()].enrichment : null,
      date: store.now,
      useSeasonal: store.preferSeasonal && !!seasonFor(store.now),
      keyPrefix: welcomeBack ? logic.WELCOME_BACK_PREFIX : '',
    })
    return { learner, plan, teaching: kind === 'school' || anyway }
  }, [child, store])

  if (!store.hydrated) return null
  if (!child || !info) return <main className="flex min-h-dvh items-center justify-center p-6 text-center text-muted-foreground">That learner could not be found.</main>

  const color = child.color
  const items = info.teaching ? info.plan.children[0].items : []
  const done = items.filter((i) => store.completions[i.key]).length
  const visible = child.lowDistraction ? items.filter((i) => !store.completions[i.key]).slice(0, 1) : items
  const week = info.plan.position.week
  const lw = getLiteracyWeek(child.adjust?.literacyGrade ?? info.learner.grade, week)
  const letters = lw.graphemes.length ? lw.graphemes : graphemesTaughtThrough(info.learner.grade, week).slice(-8)
  const bible = getBibleWeek(week)

  const instructionFor = (item: PlanItem) => {
    const ws = item.lesson?.worksheet ? getWorksheet(item.lesson.worksheet.id) : undefined
    return item.printToday && ws ? ws.instructions : item.lesson?.guide.practice[0] ?? item.script[0] ?? ''
  }

  const complete = (key: string, wasDone: boolean) => {
    store.toggle(key)
    if (!wasDone) {
      setCheer(true)
      setTimeout(() => setCheer(false), 1200)
    }
  }

  return (
    <main className="min-h-dvh px-4 pb-10 pt-5" style={{ background: `linear-gradient(180deg, color-mix(in oklch, var(--${color}) 14%, var(--background)), var(--background))` }}>
      <div className="mx-auto max-w-xl">
        <header className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-14 items-center justify-center rounded-2xl text-2xl font-black text-white" style={{ backgroundColor: `var(--${color})` }}>
              {child.name.charAt(0)}
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Hi {child.name}!</p>
              <h1 className="font-serif text-2xl font-bold">My learning today</h1>
            </div>
          </div>
          <button type="button" onClick={() => setGate(true)} aria-label="Grown-ups only: leave kid view" className="flex size-11 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm">
            <Lock className="size-5" />
          </button>
        </header>

        {game ? (
          <div>
            <button type="button" onClick={() => setGame(null)} className="mb-4 inline-flex items-center gap-2 rounded-full bg-card px-5 py-3 text-lg font-bold shadow-sm">
              <ArrowLeft className="size-5" /> Back
            </button>
            {game === 'letters' && <PhonicsBoard color={color} letters={letters} />}
            {game === 'words' && <WordBuilder color={color} words={lw.words} />}
            {game === 'verse' && <MemoryVerseBoard verse={info.learner.grade === '1st' ? bible.verse.text : bible.verse.short} reference={bible.verse.ref} color={color} />}
            {game === 'numbers' && <NumberBondBoard color={color} />}
          </div>
        ) : !info.teaching ? (
          <div className="rounded-3xl bg-card p-8 text-center shadow-sm">
            <Sun className="mx-auto mb-3 size-14" style={{ color: `var(--${color})` }} />
            <h2 className="font-serif text-2xl font-bold">No school today!</h2>
            <p className="mt-1 text-muted-foreground">Go play and enjoy your day.</p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-center gap-2 rounded-3xl bg-card p-4 shadow-sm" aria-label={`${done} of ${items.length} done`}>
              {items.map((i) => (
                <Star key={i.key} className="size-9" style={{ color: `var(--${color})`, fill: store.completions[i.key] ? `var(--${color})` : 'transparent', opacity: store.completions[i.key] ? 1 : 0.35 }} />
              ))}
            </div>
            {items.length > 0 && done === items.length ? (
              <div className="rounded-3xl bg-card p-8 text-center shadow-sm">
                <PartyPopper className="mx-auto mb-3 size-14" style={{ color: `var(--${color})` }} />
                <h2 className="font-serif text-2xl font-bold">You did it!</h2>
                <p className="mt-1 text-muted-foreground">All your stars are filled in.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {visible.map((item) => {
                  const isDone = !!store.completions[item.key]
                  const say = `${item.childTask}. ${instructionFor(item)}`
                  return (
                    <li key={item.key} className="rounded-3xl bg-card p-5 shadow-sm" style={isDone ? { boxShadow: `inset 0 0 0 3px var(--${color})` } : undefined}>
                      <div className="flex items-center gap-4">
                        <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `color-mix(in oklch, var(--${color}) 18%, transparent)`, color: `var(--${color})` }}>
                          <SubjectIcon subject={item.subject} className="size-8" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{SUBJECT_META[item.subject].label}</p>
                          <p className="font-serif text-2xl font-bold">{item.childTask}</p>
                        </div>
                        <button type="button" onClick={() => speak(say)} aria-label="Read it to me" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted">
                          <Volume2 className="size-7" />
                        </button>
                      </div>
                      <p className="mt-3 text-lg leading-snug">{instructionFor(item)}</p>
                      <button
                        type="button"
                        onClick={() => complete(item.key, isDone)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xl font-bold text-white active:scale-[0.98]"
                        style={{ backgroundColor: `var(--${color})`, opacity: isDone ? 0.7 : 1 }}
                      >
                        <Check className="size-7" strokeWidth={3} /> {isDone ? 'Done!' : 'I did it!'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
            {child.lowDistraction && items.length > 1 && done < items.length && <p className="mt-3 text-center text-sm text-muted-foreground">One thing at a time. {items.length - done} to go!</p>}
          </>
        )}

        {!game && (
          <section className="mt-8">
            <h2 className="mb-3 text-center font-serif text-xl font-bold">Play & practice</h2>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ['letters', 'Letter sounds'],
                  ['words', 'Build words'],
                  ['verse', 'Memory verse'],
                  ['numbers', 'Number bonds'],
                ] as [Exclude<Game, null>, string][]
              ).map(([g, label]) => (
                <button key={g} type="button" onClick={() => setGame(g)} className="rounded-3xl bg-card p-5 text-lg font-bold shadow-sm active:scale-95">
                  {label}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {cheer && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <div className="animate-bounce rounded-full p-8 text-white shadow-2xl" style={{ backgroundColor: `var(--${color})` }}>
            <Star className="size-16" fill="currentColor" />
          </div>
        </div>
      )}
      {gate && <GrownUpGate onCancel={() => setGate(false)} onPass={() => router.push('/')} />}
    </main>
  )
}

/** Leaving kid view needs a grown-up: the parent PIN, or a math question young children can't answer. */
function GrownUpGate({ onCancel, onPass }: { onCancel: () => void; onPass: () => void }) {
  const { parentPin } = useStore()
  const [q] = useState(() => {
    const a = 6 + Math.floor(Math.random() * 7)
    const b = 6 + Math.floor(Math.random() * 7)
    return { a, b }
  })
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Grown-ups only">
      <form
        className="w-full max-w-xs space-y-3 rounded-3xl bg-card p-6 text-center"
        onSubmit={(e) => {
          e.preventDefault()
          const ok = parentPin ? value === parentPin : Number(value) === q.a * q.b
          if (ok) onPass()
          else {
            setWrong(true)
            setValue('')
          }
        }}
      >
        <Lock className="mx-auto size-7 text-primary" />
        <p className="font-bold">Grown-ups only</p>
        <p className="text-sm text-muted-foreground">{parentPin ? 'Enter the grown-up PIN.' : `What is ${q.a} × ${q.b}?`}</p>
        <input autoFocus inputMode="numeric" type={parentPin ? 'password' : 'text'} value={value} onChange={(e) => { setValue(e.target.value); setWrong(false) }} className="w-full rounded-lg border border-border px-3 py-2 text-center text-lg" aria-label="Answer" />
        {wrong && <p role="alert" className="text-sm font-semibold text-destructive">Not quite.</p>}
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-border py-2 font-bold">
            Stay
          </button>
          <button type="submit" className="flex-1 rounded-full bg-primary py-2 font-bold text-primary-foreground">
            Leave
          </button>
        </div>
      </form>
    </div>
  )
}
