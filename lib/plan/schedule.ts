import type { EnrichmentKind, LessonDay } from '../curriculum/types'

/**
 * Flexible calendar.
 *
 * The old app derived "today's lesson" from the date, so every missed day
 * silently skipped a lesson. Now the family has a lesson POINTER: an index
 * into the 144 lesson days (36 weeks × 4 home days). The pointer only moves
 * forward when school actually happens. Dates decide what *kind* of day it
 * is (school / co-op / off) and which enrichment fits; the pointer decides
 * *what* is taught.
 */

export const WEEKS = 36
export const LESSON_DAYS_PER_WEEK = 4
export const TOTAL_LESSON_DAYS = WEEKS * LESSON_DAYS_PER_WEEK

export type DayKind = 'school' | 'coop' | 'off'

export interface DaySchedule {
  kind: DayKind
  /** Enrichment that rides along with core learning on this weekday. */
  enrichment: EnrichmentKind | null
}

/** Index 0 = Sunday … 6 = Saturday (Date#getDay). */
export type WeeklySchedule = [DaySchedule, DaySchedule, DaySchedule, DaySchedule, DaySchedule, DaySchedule, DaySchedule]

/** Monday science · Tuesday library · Wednesday co-op · Thursday art · Friday review. */
export const DEFAULT_SCHEDULE: WeeklySchedule = [
  { kind: 'off', enrichment: null },
  { kind: 'school', enrichment: 'science' },
  { kind: 'school', enrichment: 'library' },
  { kind: 'coop', enrichment: null },
  { kind: 'school', enrichment: 'art' },
  { kind: 'school', enrichment: 'review' },
  { kind: 'off', enrichment: null },
]

export const WEEKDAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const ENRICHMENT_LABELS: Record<EnrichmentKind, string> = {
  science: 'Science',
  art: 'Art',
  'social-studies': 'Social Studies',
  'life-skills': 'Life Skills',
  library: 'Library',
  review: 'Review',
}

export interface Position {
  index: number
  week: number
  day: LessonDay
}

export function positionOf(index: number): Position {
  const i = Math.min(Math.max(Math.floor(index), 0), TOTAL_LESSON_DAYS - 1)
  return { index: i, week: Math.floor(i / LESSON_DAYS_PER_WEEK) + 1, day: (i % LESSON_DAYS_PER_WEEK) as LessonDay }
}

export function indexOf(week: number, day: LessonDay): number {
  return (week - 1) * LESSON_DAYS_PER_WEEK + day
}

export function isoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  x.setDate(x.getDate() + n)
  return x
}

export interface Break {
  startDate: string
  endDate: string
  label?: string
}

export function breakOn(iso: string, breaks: Break[]): Break | undefined {
  return breaks.find((b) => iso >= b.startDate && iso <= b.endDate)
}

export function dayKindOn(date: Date, schedule: WeeklySchedule, breaks: Break[]): DayKind {
  if (breakOn(isoDate(date), breaks)) return 'off'
  return schedule[date.getDay()].kind
}

/** Number of school days between two dates (exclusive of `from`, inclusive of `to`). */
export function schoolDaysBetween(fromIso: string, toIso: string, schedule: WeeklySchedule, breaks: Break[]): number {
  let n = 0
  let d = addDays(parseISO(fromIso), 1)
  const end = parseISO(toIso)
  let guard = 0
  while (d <= end && guard++ < 800) {
    if (dayKindOn(d, schedule, breaks) === 'school') n++
    d = addDays(d, 1)
  }
  return n
}

/**
 * Where the calendar says the family "would" be if every scheduled school day
 * since the start date had happened. Used only for a gentle pace indicator —
 * never to move the pointer on its own.
 */
export function calendarExpectedIndex(startIso: string, todayIso: string, schedule: WeeklySchedule, breaks: Break[]): number {
  if (todayIso < startIso) return 0
  const dayBefore = isoDate(addDays(parseISO(startIso), -1))
  const n = schoolDaysBetween(dayBefore, todayIso, schedule, breaks)
  const todayIsSchool = dayKindOn(parseISO(todayIso), schedule, breaks) === 'school'
  // `n` counts today when it is a school day; today's lesson index is n-1.
  return Math.min(Math.max(todayIsSchool ? n - 1 : n, 0), TOTAL_LESSON_DAYS - 1)
}

/** Projected finish date if one lesson day happens on each scheduled school day from today. */
export function projectedFinish(fromIndex: number, todayIso: string, schedule: WeeklySchedule, breaks: Break[]): string {
  let remaining = TOTAL_LESSON_DAYS - fromIndex
  let d = parseISO(todayIso)
  let guard = 0
  while (remaining > 0 && guard++ < 1200) {
    if (dayKindOn(d, schedule, breaks) === 'school') remaining--
    if (remaining > 0) d = addDays(d, 1)
  }
  return isoDate(d)
}
