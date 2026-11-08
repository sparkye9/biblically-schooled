import { DEFAULT_SCHEDULE, calendarExpectedIndex, isoDate } from '../plan/schedule'
import type { LearningProfile } from '../plan/day-plan'
import type { Household } from '../types'
import type { FamilyState, StoredChild } from './types'

export const SCHOOL_YEAR_START_DATE = '2026-08-24'

/** Nov 2026: Amelia and Damilola's homeschool were deactivated at the family's request (records kept). */
export const DEACTIVATE_LOLA = 'deactivate-h-lola-2026-11'

export const DEFAULT_HOUSEHOLDS: Household[] = [
  { id: 'h-venessa', name: "Venessa's Homeschool", momName: 'Venessa', lastName: 'Olanrewaju', momInitial: 'V' },
  { id: 'h-lola', name: "Damilola's Homeschool", momName: 'Damilola', lastName: 'Gallion', momInitial: 'D', active: false },
]

/** Handwriting is on by default for Pre-K and K; everything else is the parent's choice per child. */
export function defaultProfile(gradeBand: string): LearningProfile {
  return { handwriting: gradeBand === 'pre-k' || gradeBand === 'k', languageBuilding: false, accessSupports: false }
}

export const DEFAULT_CHILDREN: StoredChild[] = [
  { id: 'c-alijah', name: 'Alijah', grade: '1st Grade', gradeBand: '1st', householdId: 'h-venessa', color: 'child-alijah', childMode: true, lowDistraction: true, profile: { handwriting: false, languageBuilding: true, accessSupports: true } },
  { id: 'c-olori', name: 'Olori-Joy', grade: 'Kindergarten', gradeBand: 'k', householdId: 'h-venessa', color: 'child-olori', childMode: false, lowDistraction: false, profile: defaultProfile('k') },
  { id: 'c-seraiah', name: 'Seraiah', grade: 'Pre-K', gradeBand: 'pre-k', householdId: 'h-venessa', color: 'child-seraiah', childMode: false, lowDistraction: false, profile: defaultProfile('pre-k') },
  { id: 'c-amelia', name: 'Amelia', grade: 'Pre-K', gradeBand: 'pre-k', householdId: 'h-lola', color: 'child-amelia', childMode: false, lowDistraction: false, profile: defaultProfile('pre-k'), active: false },
]

export function initialState(today: Date = new Date()): FamilyState {
  return {
    version: 6,
    households: DEFAULT_HOUSEHOLDS,
    children: DEFAULT_CHILDREN,
    currentView: 'shared',
    activeMomHouseholdId: 'h-venessa',
    schoolYearStartDate: SCHOOL_YEAR_START_DATE,
    breaks: [],
    schedule: DEFAULT_SCHEDULE,
    pointer: calendarExpectedIndex(SCHOOL_YEAR_START_DATE, isoDate(today), DEFAULT_SCHEDULE, []),
    dayLog: {},
    completions: {},
    defaultMode: 'standard',
    skillStatus: {},
    legacySkills: [],
    parentNotes: [],
    readAloud: [],
    supplies: [],
    resources: [],
    customActivities: [],
    restarts: [],
    familyModule: {},
    preferSeasonal: true,
    printColor: false,
    dismissed: [],
    applied: [DEACTIVATE_LOLA],
  }
}
