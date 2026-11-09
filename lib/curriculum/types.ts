/**
 * Curriculum types. The curriculum is static, versioned code — it is NOT stored
 * in localStorage. Only the family's own data (children, completions, skill
 * statuses, notes, settings) is stored. That separation is what keeps old
 * copies of lessons from going stale or duplicating on devices.
 */

export type Grade = 'pre-k' | 'k' | '1st'
export type CoreSubject = 'bible' | 'literacy' | 'math'
/** Subjects a daily lesson can be. Handwriting (Pre-K/K) and language building are switched on per child profile. */
export type LessonSubject = CoreSubject | 'handwriting' | 'language'
/** Subjects that can have a printable page. */
export type PrintSubject = CoreSubject | 'handwriting'

/**
 * What kind of learning an activity is. The weekly rhythm alternates these on
 * purpose so school is never a whole day of worksheets.
 */
export type ActivityType = 'academic' | 'hands-on' | 'movement' | 'discussion' | 'review'
export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  academic: 'Traditional academic work',
  'hands-on': 'Hands-on learning',
  movement: 'Movement-based learning',
  discussion: 'Discussion & exploration',
  review: 'Review & assessment',
}
export const ACTIVITY_SHORT: Record<ActivityType, string> = {
  academic: 'Academic',
  'hands-on': 'Hands-on',
  movement: 'Movement',
  discussion: 'Discussion',
  review: 'Review',
}
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

/**
 * The weekly rhythm every generated week follows (lesson days, not weekdays —
 * with the default calendar they fall on Mon, Tue, Thu, Fri).
 */
export const DAY_RHYTHM: Record<LessonDay, { name: string; paper: boolean; summary: string }> = {
  0: { name: 'Hands-on day', paper: false, summary: 'New ideas with real objects, talk, and building. Nothing to print — a light day.' },
  1: { name: 'Paper day', paper: true, summary: 'Pictures, then written practice: worksheets for math, phonics, handwriting, and Bible.' },
  2: { name: 'Hands-on & movement day', paper: false, summary: 'Use it in real life: games, movement, experiments, and reading together. Only a story page for readers.' },
  3: { name: 'Review & check day', paper: true, summary: 'Independent practice, spiral review, and a short mastery check for each skill.' },
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
  /** WHAT we are doing (math and handwriting). */
  what?: string
  /** WHY it works. */
  why?: string
  /** HOW to solve it, step by step. */
  how?: string[]
  /** A worked example said aloud. */
  example?: string
  /** The learning stage(s) for today, e.g. Concrete → Pictorial → Abstract. */
  stages?: { label: string; text: string }[]
  /** 1–2 minute out-loud warm-up that reviews earlier learning. */
  warmUp?: string
  /** For children who are ready: the next step. */
  whenReady?: string[]
  /** Predictable beginning / middle / end (added by learner access supports). */
  structure?: { begin: string; middle: string; end: string }
  /** How this child accesses the lesson (added by the learner's profile). Same objective, different access. */
  supports?: string[]
  /** Sentence starters for talking and writing. */
  starters?: string[]
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

export type SkillTrack = 'literacy' | 'math' | 'handwriting' | 'language'

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
