import type { DayName, PausedWeek } from './types'

export interface SchoolCalendarStatus {
  weekNumber: number
  day: DayName
  /** today isn't a school day (weekend or on break) — this is the next upcoming one */
  isUpcoming: boolean
  /** today falls inside a paused range */
  onBreak: boolean
  pause?: PausedWeek
  /** today is before the school year start date */
  notStarted: boolean
}

const DAY_NAMES: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function isWeekend(date: Date): boolean {
  const dow = date.getDay()
  return dow === 0 || dow === 6
}

function findPause(date: Date, pausedWeeks: PausedWeek[]): PausedWeek | undefined {
  return pausedWeeks.find((p) => {
    const start = startOfDay(parseISODate(p.startDate))
    const end = startOfDay(parseISODate(p.endDate))
    return date >= start && date <= end
  })
}

/**
 * Derives which week/day of school "today" is, given the school year's start
 * date and any paused date ranges (breaks). Weekends and paused days never
 * consume a week/day slot — they just push the count forward, so resuming
 * after a break picks back up exactly where the schedule left off.
 */
export function getSchoolCalendarStatus(
  schoolYearStartDate: string,
  pausedWeeks: PausedWeek[],
  today: Date = new Date(),
): SchoolCalendarStatus {
  const start = startOfDay(parseISODate(schoolYearStartDate))
  const todayStart = startOfDay(today)

  if (todayStart < start) {
    return { weekNumber: 1, day: 'monday', isUpcoming: true, onBreak: false, notStarted: true }
  }

  const activePause = findPause(todayStart, pausedWeeks)

  // roll forward to the next actual school day if today isn't one
  const searchLimit = addDays(todayStart, 366)
  let cursor = todayStart
  let rolled = false
  while ((isWeekend(cursor) || findPause(cursor, pausedWeeks)) && cursor <= searchLimit) {
    cursor = addDays(cursor, 1)
    rolled = true
  }

  // count effective school days from start up to cursor (inclusive), 0-based
  let index = 0
  for (let d = new Date(start); d < cursor; d = addDays(d, 1)) {
    if (!isWeekend(d) && !findPause(d, pausedWeeks)) index++
  }

  const weekNumber = Math.floor(index / 5) + 1
  const day = DAY_NAMES[index % 5]

  return {
    weekNumber,
    day,
    isUpcoming: rolled,
    onBreak: !!activePause,
    pause: activePause,
    notStarted: false,
  }
}
