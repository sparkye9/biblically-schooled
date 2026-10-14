import type { DayMode } from '../curriculum/types'
import type { LearnerAdjustments } from '../plan/day-plan'
import type { Break, WeeklySchedule } from '../plan/schedule'
import type { Child, Household, ParentNote, ReadAloudBook, Resource, SupplyItem } from '../types'

export type SkillStatus = 'not-introduced' | 'introduced' | 'practicing' | 'independent' | 'needs-review'

export const SKILL_STATUSES: { id: SkillStatus; label: string; hint: string }[] = [
  { id: 'not-introduced', label: 'Not introduced', hint: 'Haven’t taught it yet.' },
  { id: 'introduced', label: 'Introduced', hint: 'We’ve met it together.' },
  { id: 'practicing', label: 'Practicing', hint: 'Can do it with help.' },
  { id: 'independent', label: 'Demonstrated independently', hint: 'Did it alone, more than once.' },
  { id: 'needs-review', label: 'Needs review', hint: 'Bring it back on a review day.' },
]

export interface SkillRecord {
  status: SkillStatus
  updatedAt: string
  /** Who set it: the parent, or the app's "introduced" nudge after an Introduce lesson. */
  by: 'parent' | 'auto'
}

export interface Completion {
  at: string
  /** ISO date the item was done (local). */
  date: string
  mode: DayMode
  easy?: boolean
}

export interface DayLogEntry {
  date: string
  mode: DayMode
  easy: boolean
  /** Set when the parent tapped "We're done for today". */
  finished?: boolean
  /** A welcome-back review day taught before this lesson index. */
  welcomeBack?: boolean
}

/** A child as stored, with optional individual adjustments. */
export interface StoredChild extends Child {
  adjust?: LearnerAdjustments
  /** Learning supports the parent wants reminders for on Today. */
  supports?: string[]
}

export const SUPPORT_OPTIONS = [
  'One task at a time',
  'Movement break between subjects',
  'Read instructions aloud',
  'Show a visual example first',
  'Use a visual timer',
  'Quiet, low-clutter space',
  'Offer the challenge when ready',
]

/** Custom activities the family adds themselves (includes lessons migrated from the old planner). */
export interface CustomActivity {
  id: string
  title: string
  subject: string
  notes?: string
  week: number
  day: number
  childIds: string[]
  done: Record<string, string | undefined>
}

/** A legacy skill from the old tracker, preserved with its status. */
export interface LegacySkill {
  id: string
  childId: string
  track: 'literacy' | 'math'
  name: string
  status: SkillStatus
}

export interface RestartEvent {
  date: string
  choice: 'continue' | 'review-first' | 'catch-up'
  fromIndex: number
  toIndex: number
}

export interface FamilyState {
  version: 6
  households: Household[]
  children: StoredChild[]
  currentView: string
  activeMomHouseholdId: string
  schoolYearStartDate: string
  breaks: (Break & { id: string })[]
  schedule: WeeklySchedule
  /** Index (0–143) of the next lesson day to teach. */
  pointer: number
  dayLog: Record<number, DayLogEntry>
  completions: Record<string, Completion>
  defaultMode: DayMode
  /** Today's chosen mode, remembered only for that date. */
  todayChoice?: { date: string; mode: DayMode; easy: boolean; anyway?: boolean }
  /** When set, Today shows a welcome-back review before continuing at `pointer`. */
  welcomeBackPending?: boolean
  skillStatus: Record<string, Record<string, SkillRecord>>
  legacySkills: LegacySkill[]
  parentNotes: ParentNote[]
  readAloud: ReadAloudBook[]
  supplies: SupplyItem[]
  /** Files the family uploaded themselves (shipped PDFs are listed from code). */
  resources: Resource[]
  customActivities: CustomActivity[]
  restarts: RestartEvent[]
  /** Family Learning module progress: lessonId → ISO date done. */
  familyModule: Record<string, string>
  /** Use the seasonal Bible lesson when one is in season. */
  preferSeasonal: boolean
  printColor: boolean
  viewPin?: string
  /** Optional PIN to leave child mode; without it, a grown-up question is used. */
  parentPin?: string
  migratedFrom?: string
  /** Ids the parent dismissed (welcome cards, tips). */
  dismissed: string[]
}
