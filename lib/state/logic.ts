import { skillById } from '../curriculum/skills'
import type { DayMode } from '../curriculum/types'
import { lessonsFor, pathwayFor, type Learner } from '../plan/day-plan'
import { TOTAL_LESSON_DAYS, calendarExpectedIndex, indexOf, positionOf, type DayKind, dayKindOn, parseISO } from '../plan/schedule'
import type { Completion, FamilyState, RestartEvent, SkillStatus, StoredChild } from './types'

/**
 * Pure state transitions. Every function returns a new state and never
 * mutates its input, so they are easy to test with a simulated calendar.
 */

export const keyOf = (index: number, childId: string, subject: string) => `${index}|${childId}|${subject}`
export function parseKey(key: string) {
  const [i, childId, subject] = key.split('|')
  return { index: Number(i), childId, subject }
}

export function learnerOf(c: StoredChild): Learner {
  return { id: c.id, name: c.name, grade: pathwayFor(c.gradeBand), color: c.color, adjust: c.adjust }
}

export function todayKind(state: FamilyState, todayIso: string): DayKind {
  return dayKindOn(parseISO(todayIso), state.schedule, state.breaks)
}

export function modeFor(state: FamilyState, todayIso: string): { mode: DayMode; easy: boolean } {
  if (state.todayChoice?.date === todayIso) return { mode: state.todayChoice.mode, easy: state.todayChoice.easy }
  return { mode: state.defaultMode, easy: false }
}

export function chooseMode(state: FamilyState, todayIso: string, mode: DayMode, easy: boolean): FamilyState {
  // Switching modes never touches completions or the pointer.
  const anyway = state.todayChoice?.date === todayIso ? state.todayChoice.anyway : undefined
  return { ...state, todayChoice: { date: todayIso, mode, easy, anyway } }
}

/** Teach on a co-op, weekend, or break day after all. */
export function teachAnyway(state: FamilyState, todayIso: string): FamilyState {
  const { mode, easy } = modeFor(state, todayIso)
  return { ...state, todayChoice: { date: todayIso, mode, easy, anyway: true } }
}

/** Completion keys on a welcome-back review day use a `wb-` subject so they never overwrite the original day. */
export const WELCOME_BACK_PREFIX = 'wb-'

/**
 * Called whenever the app opens on a (possibly new) date. If the lesson day at
 * the pointer was started on an EARLIER date, the family taught it — move on.
 * If nothing was done (a missed day), stay put: no lessons are skipped and no
 * backlog is created.
 */
export function rollover(state: FamilyState, todayIso: string): FamilyState {
  const log = state.dayLog[state.pointer]
  if (log && log.date < todayIso && state.pointer < TOTAL_LESSON_DAYS - 1) {
    return { ...state, pointer: state.pointer + 1 }
  }
  return state
}

export function toggleCompletion(state: FamilyState, key: string, todayIso: string): FamilyState {
  const { mode, easy } = modeFor(state, todayIso)
  const completions = { ...state.completions }
  const { index, childId, subject } = parseKey(key)
  let skillStatus = state.skillStatus
  if (completions[key]) {
    delete completions[key]
  } else {
    const c: Completion = { at: new Date().toISOString(), date: todayIso, mode, easy }
    completions[key] = c
    // Gentle nudge: finishing an Introduce lesson marks its skills "introduced"
    // (never higher — mastery is only ever set by the parent).
    const child = state.children.find((ch) => ch.id === childId)
    if (child && (subject === 'literacy' || subject === 'math') && !state.welcomeBackPending) {
      const pos = positionOf(index)
      const lesson = lessonsFor(learnerOf(child), pos.week, pos.day).find((l) => l.subject === subject)
      if (lesson?.introduces.length) {
        const mine = { ...(skillStatus[childId] ?? {}) }
        for (const id of lesson.introduces) {
          if (!mine[id] || mine[id].status === 'not-introduced') mine[id] = { status: 'introduced', updatedAt: c.at, by: 'auto' }
        }
        skillStatus = { ...skillStatus, [childId]: mine }
      }
    }
  }
  if (subject.startsWith(WELCOME_BACK_PREFIX)) return { ...state, completions }
  const dayLog = { ...state.dayLog }
  const anyForIndex = Object.keys(completions).some((k) => {
    const p = parseKey(k)
    return p.index === index && !p.subject.startsWith(WELCOME_BACK_PREFIX)
  })
  if (anyForIndex && !dayLog[index]) dayLog[index] = { date: todayIso, mode, easy }
  if (!anyForIndex && dayLog[index] && !dayLog[index].finished) delete dayLog[index]
  return { ...state, completions, dayLog, skillStatus }
}

/** "We're done for today" — record the day and move to the next lesson now. */
export function finishDay(state: FamilyState, todayIso: string): FamilyState {
  const { mode, easy } = modeFor(state, todayIso)
  if (state.welcomeBackPending) {
    return { ...state, welcomeBackPending: false }
  }
  const dayLog = { ...state.dayLog, [state.pointer]: { ...(state.dayLog[state.pointer] ?? { date: todayIso, mode, easy }), finished: true } }
  return { ...state, dayLog, pointer: Math.min(state.pointer + 1, TOTAL_LESSON_DAYS - 1) }
}

export function setPointer(state: FamilyState, index: number): FamilyState {
  return { ...state, pointer: Math.min(Math.max(Math.round(index), 0), TOTAL_LESSON_DAYS - 1), welcomeBackPending: false }
}

export function setSkill(state: FamilyState, childId: string, skillId: string, status: SkillStatus): FamilyState {
  const mine = { ...(state.skillStatus[childId] ?? {}) }
  mine[skillId] = { status, updatedAt: new Date().toISOString(), by: 'parent' }
  return { ...state, skillStatus: { ...state.skillStatus, [childId]: mine } }
}

export function skillStatusOf(state: FamilyState, childId: string, skillId: string): SkillStatus {
  return state.skillStatus[childId]?.[skillId]?.status ?? 'not-introduced'
}

/** Most recent date anything was completed, or undefined. */
export function lastSchoolDate(state: FamilyState): string | undefined {
  let last: string | undefined
  for (const c of Object.values(state.completions)) if (!last || c.date > last) last = c.date
  for (const d of Object.values(state.dayLog)) if (!last || d.date > last) last = d.date
  return last
}

export function daysSince(fromIso: string | undefined, todayIso: string): number {
  if (!fromIso) return 0
  return Math.round((parseISO(todayIso).getTime() - parseISO(fromIso).getTime()) / 86_400_000)
}

export interface RestartOptions {
  daysAway: number
  missedSchoolDays: number
  calendarIndex: number
  /** Lesson days between the pointer and the calendar. */
  behindBy: number
}

export function restartOptions(state: FamilyState, todayIso: string): RestartOptions {
  const last = lastSchoolDate(state)
  const calendarIndex = calendarExpectedIndex(state.schoolYearStartDate, todayIso, state.schedule, state.breaks)
  let missed = 0
  if (last) {
    let d = parseISO(last)
    const end = parseISO(todayIso)
    for (let i = 0; i < 400; i++) {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
      if (d >= end) break
      if (dayKindOn(d, state.schedule, state.breaks) === 'school') missed++
    }
  }
  return { daysAway: daysSince(last, todayIso), missedSchoolDays: missed, calendarIndex, behindBy: Math.max(0, calendarIndex - state.pointer) }
}

/**
 * "We're starting again." Three gentle choices — none of them marks anything
 * complete or creates a backlog:
 *  - continue: pick up exactly where we left off.
 *  - review-first: one welcome-back review day (last week's Review lesson), then continue.
 *  - catch-up: jump to where the calendar is; skipped skills stay "Not introduced"
 *    and show up in the review list instead of as overdue work.
 */
export function restart(state: FamilyState, choice: RestartEvent['choice'], todayIso: string): FamilyState {
  const opts = restartOptions(state, todayIso)
  const from = state.pointer
  let next: FamilyState = { ...state }
  if (choice === 'review-first') next = { ...next, welcomeBackPending: true }
  if (choice === 'catch-up') next = setPointer(next, Math.max(state.pointer, opts.calendarIndex))
  // A gentle first day back.
  next = { ...next, todayChoice: { date: todayIso, mode: 'minimum', easy: false } }
  return { ...next, restarts: [...state.restarts, { date: todayIso, choice, fromIndex: from, toIndex: next.pointer }] }
}

/** Index taught on a welcome-back day: the Review day of the previous week. */
export function welcomeBackIndex(pointer: number): number {
  const { week } = positionOf(pointer)
  return indexOf(Math.max(1, week - 1), 3)
}

// ───────────────────────── Summaries ─────────────────────────

export interface WeeklySummary {
  introduced: string[]
  practiced: string[]
  demonstrated: string[]
  needsReview: string[]
  lightlyCovered: string[]
  notYetTaught: string[]
  nextSteps: string[]
  daysTaught: number
}

export function weeklySummary(state: FamilyState, childId: string, week: number): WeeklySummary {
  const child = state.children.find((c) => c.id === childId)
  const empty: WeeklySummary = { introduced: [], practiced: [], demonstrated: [], needsReview: [], lightlyCovered: [], notYetTaught: [], nextSteps: [], daysTaught: 0 }
  if (!child) return empty
  const learner = learnerOf(child)
  const skillIds = new Set<string>()
  const light = new Set<string>()
  let daysTaught = 0
  for (let day = 0; day < 4; day++) {
    const index = indexOf(week, day as 0 | 1 | 2 | 3)
    const lessons = lessonsFor(learner, week, day as 0 | 1 | 2 | 3)
    let taught = false
    for (const l of lessons) {
      l.skillIds.forEach((s) => skillIds.add(s))
      const c = state.completions[keyOf(index, childId, l.subject)]
      if (c) {
        taught = true
        if ((c.mode === 'minimum' || c.easy) && day < 2) l.skillIds.forEach((s) => light.add(s))
      }
    }
    if (taught) daysTaught++
  }
  const name = (id: string) => skillById.get(id)?.name ?? id
  const by = (st: SkillStatus) => [...skillIds].filter((id) => skillStatusOf(state, childId, id) === st).map(name)
  const needsReview = by('needs-review')
  const lightlyCovered = [...light].filter((id) => !['independent', 'needs-review'].includes(skillStatusOf(state, childId, id))).map(name)
  const notYetTaught = by('not-introduced')
  const nextSteps: string[] = []
  if (needsReview.length) nextSteps.push(`Bring back on the next review day: ${needsReview.join(', ')}.`)
  if (lightlyCovered.length) nextSteps.push(`Taught on a short day — add 5 minutes of practice: ${lightlyCovered.join(', ')}.`)
  if (!needsReview.length && !lightlyCovered.length && daysTaught > 0) nextSteps.push('Keep going — this week’s skills are on track.')
  if (daysTaught === 0) nextSteps.push('No lessons recorded this week. That’s okay — pick up where you left off.')
  return {
    introduced: by('introduced'),
    practiced: by('practicing'),
    demonstrated: by('independent'),
    needsReview,
    lightlyCovered,
    notYetTaught,
    nextSteps,
    daysTaught,
  }
}

/** Skills to revisit for a child: marked "needs review" anywhere in the year. */
export function needsReviewList(state: FamilyState, childId: string): string[] {
  return Object.entries(state.skillStatus[childId] ?? {})
    .filter(([, r]) => r.status === 'needs-review')
    .map(([id]) => skillById.get(id)?.name ?? id)
}
