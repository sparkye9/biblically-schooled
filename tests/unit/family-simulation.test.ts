import { describe, expect, it } from 'vitest'
import { buildDayPlan } from '@/lib/plan/day-plan'
import { DEFAULT_SCHEDULE, calendarExpectedIndex, isoDate, positionOf } from '@/lib/plan/schedule'
import { initialState } from '@/lib/state/defaults'
import * as L from '@/lib/state/logic'
import type { FamilyState } from '@/lib/state/types'
import { worksheetsForWeek } from '@/lib/worksheets'

/**
 * A simulated family schedule, as requested:
 * a normal week → a minimum-energy day → a missed week → two missed weeks →
 * "We're starting again" → back to normal lessons → printing for four learners.
 */

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day)

function teachDay(s: FamilyState, date: Date, subjects = ['bible', 'literacy', 'math']): FamilyState {
  const today = isoDate(date)
  s = L.rollover(s, today)
  if (L.todayKind(s, today) !== 'school') return s
  for (const c of s.children) for (const sub of subjects) s = L.toggleCompletion(s, L.keyOf(s.pointer, c.id, sub), today)
  return s
}

function weekOf(start: Date) {
  return Array.from({ length: 5 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
}

describe('Simulated family schedule', () => {
  let s = initialState(d(2026, 10, 12))
  const startPointer = s.pointer

  it('starts at the calendar position for a new install', () => {
    expect(startPointer).toBe(calendarExpectedIndex('2026-08-24', '2026-10-12', DEFAULT_SCHEDULE, []))
    expect(positionOf(startPointer).week).toBe(8)
  })

  it('a normal week (Mon, Tue, co-op Wed, Thu, Fri) moves forward exactly four lesson days', () => {
    for (const day of weekOf(d(2026, 10, 12))) s = teachDay(s, day)
    s = L.rollover(s, '2026-10-19')
    expect(s.pointer).toBe(startPointer + 4)
    // Wednesday is co-op: nothing was recorded on it.
    expect(Object.values(s.completions).some((c) => c.date === '2026-10-14')).toBe(false)
  })

  it('a minimum-energy day still counts and preserves progress', () => {
    const today = '2026-10-19'
    s = L.chooseMode(s, today, 'minimum', true)
    const before = s.pointer
    s = teachDay(s, d(2026, 10, 19))
    const plan = buildDayPlan({ index: before, mode: 'minimum', easy: true, learners: s.children.map(L.learnerOf), enrichment: 'science', date: d(2026, 10, 19) })
    expect(plan.estimate.totalMinutes).toBeLessThanOrEqual(25)
    expect(plan.children.every((c) => c.items.every((i) => !i.printToday))).toBe(true)
    // Switching modes later the same day does not erase what was done.
    const done = Object.keys(s.completions).length
    s = L.chooseMode(s, today, 'full', false)
    expect(Object.keys(s.completions).length).toBe(done)
    // Next day moves on.
    s = L.rollover(s, '2026-10-20')
    expect(s.pointer).toBe(before + 1)
  })

  it('a missed week does not skip lessons or mark anything complete', () => {
    const before = s.pointer
    const doneBefore = Object.keys(s.completions).length
    for (const day of weekOf(d(2026, 10, 26))) s = L.rollover(s, isoDate(day))
    expect(s.pointer).toBe(before)
    expect(Object.keys(s.completions).length).toBe(doneBefore)
    const opts = L.restartOptions(s, '2026-11-02')
    expect(opts.missedSchoolDays).toBeGreaterThanOrEqual(4)
  })

  it('two missed weeks → "We\'re starting again" with a welcome-back review, no backlog', () => {
    const before = s.pointer
    for (const day of [...weekOf(d(2026, 11, 2)), ...weekOf(d(2026, 11, 9))]) s = L.rollover(s, isoDate(day))
    expect(s.pointer).toBe(before)
    const opts = L.restartOptions(s, '2026-11-16')
    expect(opts.daysAway).toBeGreaterThanOrEqual(21)
    s = L.restart(s, 'review-first', '2026-11-16')
    expect(s.welcomeBackPending).toBe(true)
    expect(s.pointer).toBe(before)
    expect(L.modeFor(s, '2026-11-16').mode).toBe('minimum')
    const reviewIndex = L.welcomeBackIndex(s.pointer)
    expect(positionOf(reviewIndex).day).toBe(3)
    s = L.finishDay(s, '2026-11-16')
    expect(s.welcomeBackPending).toBe(false)
    expect(s.pointer).toBe(before) // the review day doesn't consume a new lesson
  })

  it('"catch up with the calendar" jumps ahead without marking skipped lessons complete', () => {
    const copy = L.restart(s, 'catch-up', '2026-11-16')
    expect(copy.pointer).toBeGreaterThan(s.pointer)
    expect(Object.keys(copy.completions).length).toBe(Object.keys(s.completions).length)
  })

  it('returns to normal lessons the next week', () => {
    const before = s.pointer
    for (const day of weekOf(d(2026, 11, 17))) s = teachDay(s, day)
    s = L.rollover(s, '2026-11-23')
    expect(s.pointer).toBeGreaterThan(before)
  })

  it('weekly summary reports skills and flags lightly-covered ones from the minimum day', () => {
    const week = positionOf(startPointer + 4).week
    const sum = L.weeklySummary(s, 'c-olori', week)
    expect(sum.daysTaught).toBeGreaterThan(0)
    expect(sum.nextSteps.length).toBeGreaterThan(0)
  })

  it('completing a lesson never marks mastery; only the parent can', () => {
    const statuses = Object.values(s.skillStatus).flatMap((m) => Object.values(m))
    expect(statuses.every((r) => r.status === 'introduced' && r.by === 'auto')).toBe(true)
    const s2 = L.setSkill(s, 'c-alijah', '1st-math-w1', 'independent')
    expect(L.skillStatusOf(s2, 'c-alijah', '1st-math-w1')).toBe('independent')
  })

  it('printing for four learners: Seraiah and Amelia each get their own Pre-K copy', () => {
    const week = positionOf(s.pointer).week
    const perChild = s.children.map((c) => ({ c, pages: worksheetsForWeek(week, L.learnerOf(c).grade) }))
    expect(perChild).toHaveLength(4)
    const prek = perChild.filter((p) => p.c.gradeBand === 'pre-k')
    expect(prek.map((p) => p.c.name).sort()).toEqual(['Amelia', 'Seraiah'])
    expect(prek[0].pages.length).toBe(prek[1].pages.length)
    // Separate progress tracking: completing Seraiah's item does not complete Amelia's.
    const k = L.keyOf(s.pointer, 'c-seraiah', 'math')
    const s2 = L.toggleCompletion(s, k, '2026-11-24')
    expect(s2.completions[k]).toBeTruthy()
    expect(s2.completions[L.keyOf(s.pointer, 'c-amelia', 'math')]).toBeUndefined()
  })
})

describe('Day modes', () => {
  const s = initialState(d(2026, 10, 12))
  const learners = s.children.map(L.learnerOf)
  const plan = (mode: 'full' | 'standard' | 'minimum') => buildDayPlan({ index: 40, mode, easy: false, learners, enrichment: 'science', date: d(2026, 10, 12) })

  it('minimum ≈ 20 minutes: Bible 5, literacy 7, math 8 per learner', () => {
    const p = plan('minimum')
    const olori = p.children.find((c) => c.learner.id === 'c-olori')!
    expect(olori.items.map((i) => i.minutes)).toEqual([5, 7, 8])
    expect(p.enrichment).toBeNull()
  })
  it('standard: Bible 10, literacy 15, math 15, optional enrichment 10', () => {
    const olori = plan('standard').children.find((c) => c.learner.id === 'c-olori')!
    expect(olori.items.map((i) => i.minutes)).toEqual([10, 15, 15, 10])
    expect(olori.items[3].required).toBe(false)
    expect(plan('standard').estimate.totalMinutes).toBeGreaterThanOrEqual(40)
    expect(plan('standard').estimate.totalMinutes).toBeLessThanOrEqual(50)
  })
  it('minimum day for all four learners totals about 20 minutes (shared teaching)', () => {
    expect(plan('minimum').estimate.totalMinutes).toBe(20)
  })
  it('full day lands in 60–90 minutes for all four learners, taught in parallel (not added up)', () => {
    const p = plan('full')
    const naive = p.children.flatMap((c) => c.items).reduce((s2, i) => s2 + i.minutes, 0)
    expect(p.estimate.totalMinutes).toBeGreaterThanOrEqual(60)
    expect(p.estimate.totalMinutes).toBeLessThanOrEqual(90)
    expect(p.estimate.totalMinutes).toBeLessThan(naive / 2)
  })
  it('easy day: essentials only, no printing, household materials', () => {
    const p = buildDayPlan({ index: 40, mode: 'full', easy: true, learners, enrichment: 'art', date: d(2026, 10, 12) })
    expect(p.mode).toBe('minimum')
    expect(p.enrichment).toBeNull()
    expect(p.materials.join(' ')).toMatch(/Household objects/)
    expect(p.children.flatMap((c) => c.items).some((i) => i.printToday)).toBe(false)
  })
})
