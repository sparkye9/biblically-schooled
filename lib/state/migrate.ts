import { DEFAULT_SCHEDULE, TOTAL_LESSON_DAYS, calendarExpectedIndex, indexOf, isoDate } from '../plan/schedule'
import type { LessonDay } from '../curriculum/types'
import { DEFAULT_CHILDREN, DEFAULT_HOUSEHOLDS, initialState } from './defaults'
import { keyOf } from './logic'
import type { Completion, CustomActivity, FamilyState, LegacySkill, SkillStatus, StoredChild } from './types'

/**
 * Migrates the previous app's saved data (localStorage `biblically-schooled-v5`)
 * into the new model. Nothing the family entered is dropped:
 *   - households, children (names, grades, colors, child-mode flags)
 *   - completed checkmarks on the old built-in lessons → completions on the
 *     matching new lesson day (same week, same weekday slot, same subject)
 *   - custom lessons the family added → "Our own activities"
 *   - old skill tracker → preserved as legacy skills with mapped statuses
 *   - notes, read-aloud books, supplies, uploaded files, breaks, PIN, start date
 * The old key is left untouched as a fallback copy.
 */

export const LEGACY_KEY = 'biblically-schooled-v5'
export const STORAGE_KEY = 'biblically-schooled-v6'

interface LegacyLesson {
  id: string
  title: string
  subject: string
  weekNumber: number
  day: string
  gradeBand?: string
  activityType?: string
}
interface LegacyAssignment {
  id: string
  lessonId: string
  childId: string
  status: 'todo' | 'done'
  completedAt?: string
}
interface LegacyState {
  households?: FamilyState['households']
  children?: StoredChild[]
  lessons?: LegacyLesson[]
  assignments?: LegacyAssignment[]
  skills?: { id: string; childId: string; track: 'literacy' | 'math'; name: string; status: string }[]
  resources?: FamilyState['resources']
  readAloud?: FamilyState['readAloud']
  supplies?: FamilyState['supplies']
  parentNotes?: FamilyState['parentNotes']
  currentView?: string
  activeMomHouseholdId?: string
  schoolYearStartDate?: string
  pausedWeeks?: { id: string; startDate: string; endDate: string; label?: string }[]
  viewPin?: string
}

const DAY_SLOT: Record<string, LessonDay> = { monday: 0, tuesday: 1, wednesday: 2, thursday: 2, friday: 3 }

export function mapLegacySkillStatus(s: string): SkillStatus {
  switch (s) {
    case 'learning':
      return 'introduced'
    case 'practicing':
    case 'almost':
      return 'practicing'
    case 'mastered':
      return 'independent'
    default:
      return 'not-introduced'
  }
}

const isSeedLesson = (id: string) => id.startsWith('l-seed-')

export function migrateLegacy(saved: LegacyState, today: Date = new Date()): FamilyState {
  const base = initialState(today)
  const todayIso = isoDate(today)
  const children = (saved.children?.length ? saved.children : DEFAULT_CHILDREN).map((c) => ({ ...c }))
  const households = saved.households?.length ? saved.households : DEFAULT_HOUSEHOLDS
  const breaks = (saved.pausedWeeks ?? []).map((p) => ({ id: p.id, startDate: p.startDate, endDate: p.endDate, label: p.label }))
  const start = saved.schoolYearStartDate ?? base.schoolYearStartDate

  const lessonById = new Map((saved.lessons ?? []).map((l) => [l.id, l]))
  const completions: Record<string, Completion> = {}
  const customByLesson = new Map<string, CustomActivity>()
  let maxDoneIndex = -1

  for (const a of saved.assignments ?? []) {
    const l = lessonById.get(a.lessonId)
    if (!l) continue
    const slot = DAY_SLOT[l.day] ?? 0
    const week = Math.min(Math.max(l.weekNumber, 1), 36)
    if (isSeedLesson(l.id)) {
      if (a.status !== 'done') continue
      const subject = ['bible', 'literacy', 'math'].includes(l.subject) ? l.subject : 'enrichment'
      const index = indexOf(week, slot)
      const at = a.completedAt ?? new Date(today).toISOString()
      completions[keyOf(index, a.childId, subject)] = { at, date: at.slice(0, 10), mode: 'standard' }
      maxDoneIndex = Math.max(maxDoneIndex, index)
    } else {
      // A lesson the family wrote themselves — keep it as a custom activity.
      const existing = customByLesson.get(l.id) ?? {
        id: l.id,
        title: l.title,
        subject: l.subject,
        week,
        day: slot,
        childIds: [],
        done: {},
      }
      if (!existing.childIds.includes(a.childId)) existing.childIds.push(a.childId)
      if (a.status === 'done') existing.done[a.childId] = a.completedAt ?? todayIso
      customByLesson.set(l.id, existing)
    }
  }

  const legacySkills: LegacySkill[] = (saved.skills ?? []).map((s) => ({
    id: s.id,
    childId: s.childId,
    track: s.track,
    name: s.name,
    status: mapLegacySkillStatus(s.status),
  }))

  const calendarIndex = calendarExpectedIndex(start, todayIso, DEFAULT_SCHEDULE, breaks)
  const pointer = Math.min(Math.max(calendarIndex, maxDoneIndex + 1), TOTAL_LESSON_DAYS - 1)

  return {
    ...base,
    households,
    children,
    // Show every learner on Today by default; the household switcher still works.
    currentView: 'shared',
    activeMomHouseholdId: saved.activeMomHouseholdId ?? base.activeMomHouseholdId,
    schoolYearStartDate: start,
    breaks,
    pointer,
    completions,
    legacySkills,
    parentNotes: saved.parentNotes ?? [],
    readAloud: saved.readAloud ?? [],
    supplies: (saved.supplies ?? []).filter((s) => !/^sp[1-6]$/.test(s.id) || s.have),
    resources: (saved.resources ?? []).filter((r) => !r.id.startsWith('r-packet-')),
    customActivities: [...customByLesson.values()],
    viewPin: saved.viewPin,
    migratedFrom: LEGACY_KEY,
  }
}

/** Fill in fields added after a state was saved (forward-compatible loads). */
export function normalize(saved: Partial<FamilyState>, today: Date = new Date()): FamilyState {
  const base = initialState(today)
  return { ...base, ...saved, version: 6 } as FamilyState
}

export function loadState(storage: Pick<Storage, 'getItem'>, today: Date = new Date()): FamilyState {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (raw) return normalize(JSON.parse(raw), today)
  } catch {
    /* fall through */
  }
  try {
    const legacy = storage.getItem(LEGACY_KEY)
    if (legacy) return migrateLegacy(JSON.parse(legacy), today)
  } catch {
    /* fall through */
  }
  return initialState(today)
}
