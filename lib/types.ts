export type ActivityType = 'mom-time' | 'independent' | 'hands-on' | 'optional'

export type Subject =
  | 'bible'
  | 'math'
  | 'literacy'
  | 'science'
  | 'art'
  | 'library'
  | 'review'

export type GradeBand = 'pre-k' | 'k' | '1st'

export type DayName =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'

export type SkillStatus =
  | 'not-introduced'
  | 'learning'
  | 'practicing'
  | 'almost'
  | 'mastered'

export type ChildColor =
  | 'child-alijah'
  | 'child-olori'
  | 'child-seraiah'
  | 'child-amelia'

export interface Household {
  id: string
  name: string
  momName: string
  momInitial: string
}

export interface Child {
  id: string
  name: string
  grade: string
  gradeBand: GradeBand
  householdId: string
  color: string // token name e.g. child-alijah
  childMode: boolean
  lowDistraction: boolean
}

export interface CurriculumWeek {
  id: string
  number: number
  theme: string
  bibleRef: string
  bigIdea: string
  memoryVerse: string
  memoryVerseRef: string
  art: string[]
  science: string[]
}

/** A lesson is authored once (optionally shared) and assigned to children. */
export interface Lesson {
  id: string
  title: string
  subject: Subject
  activityType: ActivityType
  weekNumber: number
  day: DayName
  gradeBand: GradeBand
  minutes: number
  essential: boolean
  /** parent-facing teaching card */
  youNeed?: string[]
  teach?: string[]
  ask?: string[]
  watchFor?: string
  /** who authored / owns it — householdId or 'shared' */
  owner: string
  interactive?: 'phonics' | 'math-manipulatives' | 'word-building' | 'memory-verse'
  printable?: boolean
}

export interface Assignment {
  id: string
  lessonId: string
  childId: string
  status: 'todo' | 'done'
  completedAt?: string
}

export interface Skill {
  id: string
  childId: string
  track: 'literacy' | 'math'
  name: string
  status: SkillStatus
}

export type ResourceType =
  | 'Worksheet'
  | 'Tracing'
  | 'Mini Book'
  | 'Flash Cards'
  | 'Cut & Paste'
  | 'Reading Passage'
  | 'Math Practice'
  | 'Coloring'
  | 'Science'
  | 'Art'
  | 'Bible'
  | 'Daily Packet'
  | 'Parent Checklist'

export interface Resource {
  id: string
  title: string
  type: ResourceType
  subject: Subject
  skill: string
  gradeBand: GradeBand
  weekNumber: number
  minutes: number
  /** householdId that contributed it, or 'shared' */
  owner: string
  contributor: string
  saved?: boolean
  /** which child this packet was printed for, if it's personalized */
  childId?: string
  /** optional local file upload backing */
  fileKey?: string
  fileName?: string
  fileType?: string
  fileSize?: number
  /** optional static file shipped with the app, e.g. /worksheets/week-01/Amelia/Mon.pdf */
  fileUrl?: string
}

export interface ReadAloudBook {
  id: string
  title: string
  status: 'currently-reading' | 'finished' | 'library' | 'favorite'
  householdId: string
}

export interface SupplyItem {
  id: string
  label: string
  section: 'print' | 'household' | 'craft' | 'science' | 'optional'
  have: boolean
  substitute?: string
}

export interface ParentNote {
  id: string
  childId: string
  weekNumber: number
  worked: string
  needsPractice: string
  enjoyed: string
}
