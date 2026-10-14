/**
 * Curriculum types. The curriculum is static, versioned code — it is NOT stored
 * in localStorage. Only the family's own data (children, completions, skill
 * statuses, notes, settings) is stored. That separation is what keeps old
 * copies of lessons from going stale or duplicating on devices.
 */

export type Grade = 'pre-k' | 'k' | '1st'
export type CoreSubject = 'bible' | 'literacy' | 'math'
export type EnrichmentKind =
  | 'science'
  | 'art'
  | 'social-studies'
  | 'life-skills'
  | 'library'
  | 'review'

/** The four home lesson days in every curriculum week. */
export type LessonDay = 0 | 1 | 2 | 3
export const LESSON_DAYS: LessonDay[] = [0, 1, 2, 3]
export const LESSON_DAY_NAMES: Record<LessonDay, string> = {
  0: 'Introduce',
  1: 'Practice',
  2: 'Apply',
  3: 'Review',
}

/** Full 60–90 min · Standard 40–50 min · Minimum ~20 min */
export type DayMode = 'full' | 'standard' | 'minimum'

export interface TeachingGuide {
  /** What the child should learn. */
  objective: string
  /** What is needed (household substitutes in brackets). */
  materials: string[]
  /** Exactly what the parent says or demonstrates. */
  teach: string[]
  /** What the child does. */
  practice: string[]
  /** How to tell whether they've got it. */
  check: string
  /** If the child struggles. */
  ifStruggling: string
  /** If the child shows mastery. */
  ifMastered: string
  /** Optional extensions — fine to skip. */
  optional?: string[]
  /** The 5–8 minute version used on Minimum / Easy days. */
  minimum: string
}

export interface MemoryVerse {
  ref: string
  /** Exact King James Version text (public domain). */
  text: string
  /** An exact, contiguous portion of `text` for Pre-K/K learners. */
  short: string
}

export interface BibleWeek {
  week: number
  title: string
  passage: string
  /** A five-verse (or so) reading for Minimum days. */
  shortReading: string
  objective: string
  parentExplanation: string
  childExplanation: string
  questions: string[]
  verse: MemoryVerse
  activity: string
  prayer: string
  /** Distinguishes what Scripture says from later tradition or interpretation. */
  traditionNote?: string
  /** Hebrew / biblical cultural learning connected to the passage. */
  culturalNote?: string
  /** Day-by-day focus (Introduce / Practice / Apply / Review). */
  days: [string, string, string, string]
  character: string
}

export interface Unit {
  number: 1 | 2 | 3 | 4
  title: string
  weeks: [number, number]
  bigIdea: string
}

export type SkillTrack = 'literacy' | 'math'

export interface SkillDef {
  id: string
  grade: Grade
  track: SkillTrack
  name: string
  /** First curriculum week the skill is taught. */
  week: number
  strand: string
}

export interface EnrichmentWeek {
  week: number
  science: EnrichmentActivity
  art: EnrichmentActivity
  socialStudies: EnrichmentActivity
  lifeSkill: EnrichmentActivity
  library: { mission: string; readAloudIdeas: string[] }
}

export interface EnrichmentActivity {
  title: string
  objective: string
  materials: string[]
  steps: string[]
  talk: string
  /** Grade-specific stretch, keyed by grade. */
  gradeNotes?: Partial<Record<Grade, string>>
  /** True when it needs real setup or mess — skipped on Easy days. */
  prepHeavy?: boolean
}
