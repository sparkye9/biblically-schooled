'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight,
  BatteryLow,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coffee,
  HeartHandshake,
  ListChecks,
  Printer,
  RotateCcw,
  Scissors,
  Smile,
  Sparkles,
} from 'lucide-react'
import { getBibleWeek, unitForWeek } from '@/lib/curriculum/bible'
import { LESSON_DAY_NAMES, type DayMode } from '@/lib/curriculum/types'
import { MODE_INFO, type ChildPlan, type PlanItem } from '@/lib/plan/day-plan'
import { useStore } from '@/lib/store'
import { useTodayPlan } from '@/lib/use-today'
import * as logic from '@/lib/state/logic'
import { cn } from '@/lib/utils'
import { Card, ChildAvatar, DoneBox, Pill, ProgressBar, Section } from '@/components/primitives'
import { SUBJECT_META, SubjectIcon, TeachingGuideView } from '@/components/teaching-guide'

export default function TodayPage() {
  const store = useStore()
  const today = useTodayPlan()
  const { plan } = today
  const { mode, easy } = logic.modeFor(store, store.todayIso)
  const bible = getBibleWeek(plan.position.week)
  const unit = unitForWeek(plan.position.week)
  const restart = logic.restartOptions(store, store.todayIso)
  const dateLabel = store.now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  const allItems = plan.children.flatMap((c) => c.items)
  const required = allItems.filter((i) => i.required)
  const doneRequired = required.filter((i) => store.completions[i.key]).length
  const allDone = required.length > 0 && doneRequired === required.length

  if (!store.hydrated) return <p className="py-20 text-center text-muted-foreground">Loading your school day…</p>

  return (
    <div className="space-y-6">
      {/* ── Header: What are we doing today? ── */}
      <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Today’s School</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">{dateLabel}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {today.welcomeBack ? 'Welcome-back review day' : `Week ${plan.position.week} · Day ${plan.position.day + 1} of 4 (${LESSON_DAY_NAMES[plan.position.day]})`} · Unit {unit.number}: {unit.title}
        </p>
        {today.teaching && (
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">
                {doneRequired} of {required.length} lessons done
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="size-4" /> about {plan.estimate.totalMinutes} min
              </span>
            </div>
            <ProgressBar value={doneRequired} total={required.length} />
          </div>
        )}
      </section>

      {/* ── Gentle banners ── */}
      {store.migratedFrom && !store.dismissed.includes('welcome-v6') && (
        <Card className="border-primary/30 bg-sage-soft/40">
          <p className="font-semibold">Welcome to the new Biblically Schooled.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your children, notes, books, and finished lessons came with you. You’re at Week {plan.position.week}, Day {plan.position.day + 1}. Lessons now move forward only when you actually do school — missed days never skip anything.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/week#our-place" className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold">
              Change our place
            </Link>
            <button type="button" onClick={() => store.dismiss('welcome-v6')} className="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
              Got it
            </button>
          </div>
        </Card>
      )}

      {restart.missedSchoolDays >= 3 && !today.welcomeBack && store.restarts.at(-1)?.date !== store.todayIso && (
        <Card className="border-accent/40 bg-terracotta-soft/50">
          <p className="font-semibold">Welcome back! It’s been {restart.daysAway} days.</p>
          <p className="mt-1 text-sm text-muted-foreground">Nothing was skipped and there’s no backlog. Let’s ease back in.</p>
          <Link href="/restart" className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground">
            <RotateCcw className="size-4" /> We’re starting again
          </Link>
        </Card>
      )}

      {!today.teaching ? (
        <NotSchoolToday reason={today.reason!} />
      ) : (
        <>
          <ModePicker mode={mode} easy={easy} />

          {easy && <EasyDaySummary />}

          {plan.season && store.preferSeasonal && (
            <Card className="bg-gold/15">
              <p className="text-sm">
                <Sparkles className="mr-1 inline size-4 text-primary" />
                <span className="font-semibold">{plan.season.title}</span> is in season, so today’s Bible time uses the seasonal lesson. Your unit lesson will be waiting.
              </p>
              <button type="button" onClick={() => store.setPrefs({ preferSeasonal: false })} className="mt-2 text-sm font-semibold text-primary underline">
                Use the unit lesson instead
              </button>
            </Card>
          )}

          {/* ── Bible: shared family lesson ── */}
          <BibleCard />

          {/* ── Literacy & math ── */}
          {plan.mode === 'minimum' ? (
            <>
              <TogetherCard subject="literacy" minutes={7} />
              <TogetherCard subject="math" minutes={8} />
            </>
          ) : (
            <Section title="Each child’s work">
              <div className="grid gap-4">
                {groupChildren(plan.children).map((g) => (
                  <ChildGroupCard key={g.map((c) => c.learner.id).join('-')} group={g} />
                ))}
              </div>
            </Section>
          )}

          {plan.enrichment?.activity && <EnrichmentCard />}

          <div className="grid gap-4 md:grid-cols-2">
            <MaterialsCard />
            <RotationCard />
          </div>

          <NeedsPracticeCard />

          {/* ── Finish ── */}
          <Card className={cn('text-center', allDone && 'border-primary/40 bg-sage-soft/50')}>
            {allDone ? (
              <p className="flex items-center justify-center gap-2 font-serif text-lg font-semibold">
                <CheckCircle2 className="size-5 text-primary" /> Everything is done. Well done!
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Done for today? Anything unchecked simply stays unchecked — nothing piles up.</p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => store.finishDay()} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
                We’re done for today
              </button>
              <Link
                href={`/print/packet?week=${plan.position.week}&days=${plan.position.day}&children=${store.childrenInView.map((c) => c.id).join(',')}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold"
              >
                <Printer className="size-4" /> Print today’s pages
              </Link>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Tomorrow will open on the next lesson automatically once anything today is checked.</p>
          </Card>
        </>
      )}
    </div>
  )
}

// ───────────────────────── Mode picker ─────────────────────────

function ModePicker({ mode, easy }: { mode: DayMode; easy: boolean }) {
  const store = useStore()
  return (
    <section aria-label="Type of school day" className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {(['full', 'standard', 'minimum'] as DayMode[]).map((m) => {
          const active = !easy && mode === m
          return (
            <button
              key={m}
              type="button"
              aria-pressed={active}
              onClick={() => store.chooseMode(m, false)}
              className={cn('rounded-2xl border-2 p-3 text-left transition-colors', active ? 'border-primary bg-sage-soft/50' : 'border-border bg-card hover:border-primary/40')}
            >
              <p className="text-sm font-bold">{MODE_INFO[m].label}</p>
              <p className="text-xs text-muted-foreground">{MODE_INFO[m].target}</p>
            </button>
          )
        })}
      </div>
      <button
        type="button"
        aria-pressed={easy}
        onClick={() => store.chooseMode('minimum', !easy)}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-bold transition-colors',
          easy ? 'border-accent bg-terracotta-soft' : 'border-dashed border-accent/60 text-foreground hover:bg-terracotta-soft/50',
        )}
      >
        <BatteryLow className="size-5 text-accent" /> {easy ? 'Easy day is on — essentials only' : 'I need an easy day'}
      </button>
      <p className="text-center text-xs text-muted-foreground">Switching anytime keeps everything you’ve already checked.</p>
    </section>
  )
}

function EasyDaySummary() {
  const store = useStore()
  const { plan } = useTodayPlan()
  const bible = getBibleWeek(plan.position.week)
  const first = plan.children[0]
  const lit = first?.items.find((i) => i.subject === 'literacy')?.lesson
  const math = first?.items.find((i) => i.subject === 'math')?.lesson
  return (
    <Card className="border-accent/40 bg-terracotta-soft/40">
      <p className="flex items-center gap-2 font-serif text-xl font-semibold">
        <Coffee className="size-5 text-accent" /> Today’s 20-Minute Plan
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        <li>
          <b>Bible (5 min):</b> Read {plan.season && store.preferSeasonal ? plan.season.shortReading : bible.shortReading} together and talk about one question: “{bible.questions[0]}”
        </li>
        <li>
          <b>Literacy (7 min):</b> one short activity each — {lit?.guide.minimum ?? 'read a favorite book together.'}
        </li>
        <li>
          <b>Math (8 min):</b> practice with household objects — {math?.guide.minimum ?? 'count spoons and socks.'}
        </li>
      </ul>
      <p className="mt-3 font-semibold">Done. No printing, no crafts. Real learning still happened today. 💛</p>
    </Card>
  )
}

// ───────────────────────── Bible ─────────────────────────

function BibleCard() {
  const store = useStore()
  const { plan } = useTodayPlan()
  const bible = getBibleWeek(plan.position.week)
  const items = plan.children.map((c) => ({ child: c.learner, item: c.items.find((i) => i.subject === 'bible')! }))
  const lesson = items[0]?.item.lesson
  const [open, setOpen] = useState(false)
  const allDone = items.every((x) => store.completions[x.item.key])
  const season = store.preferSeasonal ? plan.season : null
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <SubjectIcon subject="bible" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Bible · everyone together · {items[0]?.item.minutes} min</p>
          <h2 className="font-serif text-xl font-semibold">{plan.bibleTitle}</h2>
          <p className="text-sm text-muted-foreground">{season ? season.passage : bible.passage}</p>
        </div>
      </div>
      <blockquote className="mt-3 rounded-xl bg-muted/60 p-3 text-sm italic">
        “{plan.bibleVerse.text}” <span className="not-italic font-semibold">— {plan.bibleVerse.ref} (KJV)</span>
        {plan.bibleVerse.short !== plan.bibleVerse.text && (
          <span className="mt-1 block not-italic text-xs text-muted-foreground">Little ones: “{plan.bibleVerse.short}”</span>
        )}
      </blockquote>
      {plan.mode === 'minimum' ? (
        <p className="mt-3 text-sm">{season ? `Read ${season.shortReading}. Ask: “${season.questions[0]}”` : lesson?.guide.minimum}</p>
      ) : season ? (
        <div className="mt-3 space-y-1 text-sm">
          <p>{season.childExplanation}</p>
          <p className="text-muted-foreground">Ask: {season.questions.join(' · ')}</p>
          <p className="text-muted-foreground">Activity: {season.activity}</p>
          <p className="text-xs text-muted-foreground">{season.traditionNote}</p>
        </div>
      ) : (
        lesson && (
          <>
            <button type="button" onClick={() => setOpen((o) => !o)} className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary" aria-expanded={open}>
              How to teach it <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
            </button>
            {open && (
              <div className="mt-2 space-y-3">
                <p className="rounded-xl bg-sage-soft/40 p-3 text-sm">
                  <b>Parent note:</b> {bible.parentExplanation}
                </p>
                <TeachingGuideView guide={lesson.guide} />
                {bible.traditionNote && <p className="text-xs text-muted-foreground">Scripture vs. tradition: {bible.traditionNote}</p>}
              </div>
            )}
          </>
        )
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
        {items.map(({ child, item }) => (
          <label key={child.id} className="flex items-center gap-2 text-sm font-semibold">
            <DoneBox done={!!store.completions[item.key]} onToggle={() => store.toggle(item.key)} label={`Bible done for ${child.name}`} color={child.color} />
            {child.name}
          </label>
        ))}
        {!allDone && (
          <button
            type="button"
            onClick={() => items.forEach((x) => !store.completions[x.item.key] && store.toggle(x.item.key))}
            className="ml-auto rounded-full border border-border px-3 py-1.5 text-xs font-bold"
          >
            Mark everyone
          </button>
        )}
      </div>
    </Card>
  )
}

// ───────────────────────── Minimum: shared literacy / math ─────────────────────────

function TogetherCard({ subject, minutes }: { subject: 'literacy' | 'math'; minutes: number }) {
  const store = useStore()
  const { plan } = useTodayPlan()
  const rows = plan.children.map((c) => ({ child: c.learner, item: c.items.find((i) => i.subject === subject)! }))
  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-wide text-primary">
        {SUBJECT_META[subject].label} · together · {minutes} min
      </p>
      <h2 className="font-serif text-lg font-semibold">One shared activity — each child at their own level</h2>
      <ul className="mt-3 space-y-3">
        {rows.map(({ child, item }) => (
          <li key={child.id} className="flex items-start gap-3">
            <DoneBox done={!!store.completions[item.key]} onToggle={() => store.toggle(item.key)} label={`${SUBJECT_META[subject].label} done for ${child.name}`} color={child.color} />
            <div className="min-w-0">
              <p className="text-sm font-bold">
                {child.name} <span className="font-normal text-muted-foreground">· {item.title}</span>
              </p>
              <p className="text-sm">{item.lesson?.guide.minimum}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

// ───────────────────────── Per-child (Standard / Full) ─────────────────────────

/** Children on exactly the same lessons (e.g. Seraiah & Amelia) share one card with separate checkboxes. */
function groupChildren(children: ChildPlan[]): ChildPlan[][] {
  const groups = new Map<string, ChildPlan[]>()
  for (const c of children) {
    const sig = c.items
      .filter((i) => i.subject === 'literacy' || i.subject === 'math')
      .map((i) => i.lesson?.id)
      .join('|')
    groups.set(sig, [...(groups.get(sig) ?? []), c])
  }
  return [...groups.values()]
}

function ChildGroupCard({ group }: { group: ChildPlan[] }) {
  const store = useStore()
  const first = group[0]
  const items = first.items.filter((i) => i.subject === 'literacy' || i.subject === 'math')
  const custom = store.customActivities.filter(
    (a) => a.week === first.items[0].lesson?.week && a.day === first.items[0].lesson?.day && a.childIds.some((id) => group.some((g) => g.learner.id === id)),
  )
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex -space-x-2">
          {group.map((c) => (
            <ChildAvatar key={c.learner.id} child={c.learner} />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold">{group.map((c) => c.learner.name).join(' & ')}</h3>
          <p className="text-xs text-muted-foreground">
            {first.learner.grade === 'pre-k' ? 'Pre-K' : first.learner.grade === 'k' ? 'Kindergarten' : '1st Grade'}
            {group.length > 1 && ' · taught together, tracked separately'}
          </p>
        </div>
        {group.map((c) => (
          <Link key={c.learner.id} href={`/kid/${c.learner.id}`} className="rounded-full border border-border px-3 py-1 text-xs font-bold">
            <Smile className="mr-1 inline size-3.5" />
            {group.length > 1 ? `${c.learner.name}’s view` : 'Kid view'}
          </Link>
        ))}
      </div>
      {group.some((c) => store.children.find((x) => x.id === c.learner.id)?.supports?.length) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[...new Set(group.flatMap((c) => store.children.find((x) => x.id === c.learner.id)?.supports ?? []))].map((s) => (
            <Pill key={s} tone="sage">{s}</Pill>
          ))}
        </div>
      )}
      <ul className="mt-3 divide-y divide-border">
        {items.map((item) => (
          <LessonRow key={item.key} item={item} group={group} />
        ))}
        {custom.map((a) => (
          <li key={a.id} className="flex items-center gap-3 py-3">
            {group
              .filter((g) => a.childIds.includes(g.learner.id))
              .map((g) => (
                <DoneBox key={g.learner.id} done={!!a.done[g.learner.id]} onToggle={() => store.toggleCustomActivity(a.id, g.learner.id)} label={`${a.title} done for ${g.learner.name}`} color={g.learner.color} />
              ))}
            <div>
              <p className="text-sm font-semibold">{a.title}</p>
              <p className="text-xs text-muted-foreground">Our own activity{a.notes ? ` · ${a.notes}` : ''}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function LessonRow({ item, group }: { item: PlanItem; group: ChildPlan[] }) {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const keyFor = (c: ChildPlan) => c.items.find((i) => i.subject === item.subject)!.key
  const lesson = item.lesson!
  return (
    <li className="py-3">
      <div className="flex items-start gap-3">
        <div className="flex gap-1.5">
          {group.map((c) => (
            <DoneBox
              key={c.learner.id}
              done={!!store.completions[keyFor(c)]}
              onToggle={() => store.toggle(keyFor(c))}
              label={`${SUBJECT_META[item.subject].label} done for ${c.learner.name}`}
              color={c.learner.color}
            />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <SubjectIcon subject={item.subject} className="size-3.5" />
            {SUBJECT_META[item.subject].label} · {lesson.phase} · {item.minutes} min
          </p>
          <p className="font-semibold">{item.title}</p>
          <p className="text-sm text-muted-foreground">{lesson.guide.objective}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-1 rounded-full bg-sage-soft px-3 py-1 text-xs font-bold text-primary">
              <ListChecks className="size-3.5" /> {open ? 'Hide guide' : 'How to teach'}
            </button>
            {item.printToday && lesson.worksheet && (
              <Link
                href={`/print/packet?week=${lesson.week}&days=${lesson.day}&subjects=${item.subject}&children=${group.map((g) => g.learner.id).join(',')}`}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-bold"
              >
                <Printer className="size-3.5" /> Worksheet{group.length > 1 ? ` ×${group.length}` : ''}
              </Link>
            )}
            {!lesson.worksheet && <Pill tone="gold">Hands-on — no printing</Pill>}
          </div>
        </div>
      </div>
      {open && (
        <div className="mt-3 rounded-xl border border-border p-3">
          <TeachingGuideView guide={lesson.guide} />
        </div>
      )}
    </li>
  )
}

// ───────────────────────── Enrichment, materials, rotation ─────────────────────────

function EnrichmentCard() {
  const store = useStore()
  const { plan } = useTodayPlan()
  const e = plan.enrichment!
  const a = e.activity!
  const keys = plan.children.map((c) => ({ child: c.learner, key: c.items.find((i) => i.subject === 'enrichment')?.key })).filter((x) => x.key)
  return (
    <Card className="bg-gold/10">
      <p className="text-xs font-bold uppercase tracking-wide text-primary">{e.label} · together · optional</p>
      <h2 className="font-serif text-lg font-semibold">{a.title}</h2>
      <p className="text-sm text-muted-foreground">{a.objective}</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
        {a.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      <p className="mt-2 text-sm">
        <b>Talk about it:</b> {a.talk}
      </p>
      {a.gradeNotes?.['1st'] && <p className="mt-1 text-xs text-muted-foreground">Stretch for 1st grade: {a.gradeNotes['1st']}</p>}
      {a.prepHeavy && <Pill tone="terracotta">Needs some setup — fine to skip</Pill>}
      <div className="mt-3 flex flex-wrap gap-3 border-t border-border pt-3">
        {keys.map(({ child, key }) => (
          <label key={child.id} className="flex items-center gap-2 text-sm font-semibold">
            <DoneBox done={!!store.completions[key!]} onToggle={() => store.toggle(key!)} label={`${e.label} done for ${child.name}`} color={child.color} />
            {child.name}
          </label>
        ))}
      </div>
    </Card>
  )
}

function MaterialsCard() {
  const { plan } = useTodayPlan()
  return (
    <Card>
      <h2 className="flex items-center gap-2 font-serif text-lg font-semibold">
        <Scissors className="size-4 text-primary" /> What you need
      </h2>
      <ul className="mt-2 space-y-1 text-sm">
        {plan.materials.map((m) => (
          <li key={m} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            {m}
          </li>
        ))}
      </ul>
      <h3 className="mt-4 text-sm font-bold">Okay to skip or shorten</h3>
      <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
        {plan.skippable.map((m) => (
          <li key={m}>• {m}</li>
        ))}
      </ul>
    </Card>
  )
}

function RotationCard() {
  const { plan } = useTodayPlan()
  return (
    <Card>
      <h2 className="flex items-center gap-2 font-serif text-lg font-semibold">
        <HeartHandshake className="size-4 text-primary" /> How to run it
      </h2>
      <p className="text-xs text-muted-foreground">
        About {plan.estimate.totalMinutes} min in all — you teach one group while the others work on their own.
      </p>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm">
        {plan.rotation.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ol>
    </Card>
  )
}

function NeedsPracticeCard() {
  const store = useStore()
  const rows = store.childrenInView.map((c) => ({ child: c, items: logic.needsReviewList(store, c.id) })).filter((r) => r.items.length)
  if (!rows.length) return null
  return (
    <Card>
      <h2 className="font-serif text-lg font-semibold">Needs a little more practice</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {rows.map((r) => (
          <li key={r.child.id}>
            <b>{r.child.name}:</b> {r.items.slice(0, 4).join(', ')}
            {r.items.length > 4 && ` +${r.items.length - 4} more`}
          </li>
        ))}
      </ul>
      <Link href="/progress" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Open progress <ArrowRight className="size-4" />
      </Link>
    </Card>
  )
}

function NotSchoolToday({ reason }: { reason: string }) {
  const store = useStore()
  const next = getBibleWeek(Math.floor(store.pointer / 4) + 1)
  return (
    <Card className="text-center">
      <p className="font-serif text-2xl font-semibold">{reason}</p>
      <p className="mt-1 text-muted-foreground">No lessons today. Enjoy the margin.</p>
      <p className="mt-4 text-sm">
        Next lesson waiting for you: <b>Week {Math.floor(store.pointer / 4) + 1}, Day {(store.pointer % 4) + 1}</b> — {next.title}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={() => store.teachAnyway()} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          Do a lesson anyway
        </button>
        <Link href="/week" className="rounded-full border border-border px-4 py-2 text-sm font-bold">
          Look at this week
        </Link>
      </div>
    </Card>
  )
}
