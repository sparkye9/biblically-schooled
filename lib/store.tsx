'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as seed from './seed'
import type {
  Assignment,
  Child,
  ChildColor,
  CoverageRequest,
  CurriculumWeek,
  Household,
  Lesson,
  ParentNote,
  ReadAloudBook,
  Resource,
  Skill,
  SkillStatus,
  SupplyItem,
} from './types'

const STORAGE_KEY = 'biblically-schooled-v1'

interface State {
  households: Household[]
  children: Child[]
  weeks: CurriculumWeek[]
  lessons: Lesson[]
  assignments: Assignment[]
  skills: Skill[]
  resources: Resource[]
  readAloud: ReadAloudBook[]
  supplies: SupplyItem[]
  coverageRequests: CoverageRequest[]
  parentNotes: ParentNote[]
  currentView: string // 'shared' | householdId
  activeMomHouseholdId: string
  currentWeek: number
  currentDay: string
}

const initialState: State = {
  households: seed.households,
  children: seed.children,
  weeks: seed.weeks,
  lessons: seed.lessons,
  assignments: seed.assignments,
  skills: seed.skills,
  resources: seed.resources,
  readAloud: seed.readAloud,
  supplies: seed.supplies,
  coverageRequests: seed.coverageRequests,
  parentNotes: seed.parentNotes,
  currentView: 'h-venessa',
  activeMomHouseholdId: 'h-venessa',
  currentWeek: seed.DEMO_WEEK,
  currentDay: seed.DEMO_DAY,
}

interface StoreContext extends State {
  setView: (view: string) => void
  setActiveMom: (householdId: string) => void
  setCurrentWeek: (week: number) => void
  setCurrentDay: (day: string) => void
  toggleAssignment: (assignmentId: string) => void
  setChildMode: (childId: string, on: boolean) => void
  setLowDistraction: (childId: string, on: boolean) => void
  setSkillStatus: (skillId: string, status: SkillStatus) => void
  addHousehold: (name: string, momName: string) => string
  addChild: (input: {
    name: string
    grade: string
    gradeBand: Child['gradeBand']
    householdId: string
    color: ChildColor
  }) => string
  addWeek: (week: Omit<CurriculumWeek, 'id' | 'number'>) => number
  updateWeek: (id: string, patch: Partial<CurriculumWeek>) => void
  addLesson: (lesson: Omit<Lesson, 'id'>) => string
  updateLesson: (id: string, patch: Partial<Lesson>) => void
  setLessonAssignments: (lessonId: string, childIds: string[]) => void
  addResource: (input: Omit<Resource, 'id'>) => void
  toggleResourceSaved: (resourceId: string) => void
  toggleSupply: (supplyId: string) => void
  addReadAloud: (title: string, householdId: string) => void
  saveNote: (note: Omit<ParentNote, 'id'>) => void
  toggleAway: (householdId: string) => void
  requestCoverage: (householdId: string, reason: string) => void
  offerHelp: (requestId: string, helperHouseholdId: string) => void
  resolveCoverage: (requestId: string) => void
  assignLesson: (lessonId: string, childId: string) => void
  reset: () => void
}

const Ctx = createContext<StoreContext | null>(null)

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setState((s) => ({ ...s, ...parsed }))
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state, hydrated])

  const api = useMemo<StoreContext>(() => {
    const patch = (p: Partial<State>) => setState((s) => ({ ...s, ...p }))

    return {
      ...state,
      setView: (view) => patch({ currentView: view }),
      setActiveMom: (householdId) =>
        setState((s) => ({
          ...s,
          activeMomHouseholdId: householdId,
          currentView: householdId,
        })),
      setCurrentWeek: (week) => patch({ currentWeek: week }),
      setCurrentDay: (day) => patch({ currentDay: day }),
      toggleAssignment: (assignmentId) =>
        setState((s) => ({
          ...s,
          assignments: s.assignments.map((a) =>
            a.id === assignmentId
              ? {
                  ...a,
                  status: a.status === 'done' ? 'todo' : 'done',
                  completedAt:
                    a.status === 'done' ? undefined : new Date().toISOString(),
                }
              : a,
          ),
        })),
      setChildMode: (childId, on) =>
        setState((s) => ({
          ...s,
          children: s.children.map((c) =>
            c.id === childId ? { ...c, childMode: on } : c,
          ),
        })),
      setLowDistraction: (childId, on) =>
        setState((s) => ({
          ...s,
          children: s.children.map((c) =>
            c.id === childId ? { ...c, lowDistraction: on } : c,
          ),
        })),
      setSkillStatus: (skillId, status) =>
        setState((s) => ({
          ...s,
          skills: s.skills.map((sk) =>
            sk.id === skillId ? { ...sk, status } : sk,
          ),
        })),
      addHousehold: (name, momName) => {
        const id = uid('h')
        setState((s) => ({
          ...s,
          households: [
            ...s.households,
            {
              id,
              name: name || `${momName}'s Homeschool`,
              momName,
              momInitial: momName.charAt(0).toUpperCase() || 'M',
            },
          ],
        }))
        return id
      },
      addChild: (input) => {
        const id = uid('c')
        setState((s) => ({
          ...s,
          children: [
            ...s.children,
            {
              id,
              name: input.name,
              grade: input.grade,
              gradeBand: input.gradeBand,
              householdId: input.householdId,
              color: input.color,
              childMode: false,
              lowDistraction: false,
            },
          ],
        }))
        return id
      },
      addWeek: (week) => {
        const nextNumber = Math.max(0, ...state.weeks.map((w) => w.number)) + 1
        const id = uid('w')
        setState((s) => ({
          ...s,
          weeks: [...s.weeks, { ...week, id, number: nextNumber }],
        }))
        return nextNumber
      },
      updateWeek: (id, patch) =>
        setState((s) => ({
          ...s,
          weeks: s.weeks.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        })),
      addLesson: (lesson) => {
        const id = uid('l')
        setState((s) => ({
          ...s,
          lessons: [...s.lessons, { ...lesson, id }],
        }))
        return id
      },
      updateLesson: (id, patch) =>
        setState((s) => ({
          ...s,
          lessons: s.lessons.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),
      setLessonAssignments: (lessonId, childIds) =>
        setState((s) => ({
          ...s,
          assignments: [
            ...s.assignments.filter((a) => a.lessonId !== lessonId),
            ...childIds.map((childId) => ({
              id: uid('a'),
              lessonId,
              childId,
              status: 'todo' as const,
            })),
          ],
        })),
      addResource: (input) =>
        setState((s) => ({
          ...s,
          resources: [{ ...input, id: uid('r') }, ...s.resources],
        })),
      toggleResourceSaved: (resourceId) =>
        setState((s) => ({
          ...s,
          resources: s.resources.map((r) =>
            r.id === resourceId ? { ...r, saved: !r.saved } : r,
          ),
        })),
      toggleSupply: (supplyId) =>
        setState((s) => ({
          ...s,
          supplies: s.supplies.map((sp) =>
            sp.id === supplyId ? { ...sp, have: !sp.have } : sp,
          ),
        })),
      addReadAloud: (title, householdId) =>
        setState((s) => ({
          ...s,
          readAloud: [
            {
              id: uid('b'),
              title,
              status: 'currently-reading',
              householdId,
            },
            ...s.readAloud,
          ],
        })),
      saveNote: (note) =>
        setState((s) => ({
          ...s,
          parentNotes: [{ ...note, id: uid('n') }, ...s.parentNotes],
        })),
      toggleAway: (householdId) =>
        setState((s) => ({
          ...s,
          households: s.households.map((h) =>
            h.id === householdId ? { ...h, away: !h.away } : h,
          ),
        })),
      requestCoverage: (householdId, reason) =>
        setState((s) => ({
          ...s,
          coverageRequests: [
            {
              id: uid('cov'),
              fromHouseholdId: householdId,
              reason,
              createdAt: new Date().toISOString(),
              helpers: [],
              resolved: false,
            },
            ...s.coverageRequests,
          ],
          households: s.households.map((h) =>
            h.id === householdId ? { ...h, away: true } : h,
          ),
        })),
      offerHelp: (requestId, helperHouseholdId) =>
        setState((s) => ({
          ...s,
          coverageRequests: s.coverageRequests.map((c) =>
            c.id === requestId && !c.helpers.includes(helperHouseholdId)
              ? { ...c, helpers: [...c.helpers, helperHouseholdId] }
              : c,
          ),
        })),
      resolveCoverage: (requestId) =>
        setState((s) => {
          const req = s.coverageRequests.find((c) => c.id === requestId)
          return {
            ...s,
            coverageRequests: s.coverageRequests.map((c) =>
              c.id === requestId ? { ...c, resolved: true } : c,
            ),
            households: s.households.map((h) =>
              req && h.id === req.fromHouseholdId ? { ...h, away: false } : h,
            ),
          }
        }),
      assignLesson: (lessonId, childId) =>
        setState((s) => {
          const exists = s.assignments.some(
            (a) => a.lessonId === lessonId && a.childId === childId,
          )
          if (exists) return s
          return {
            ...s,
            assignments: [
              ...s.assignments,
              { id: uid('a'), lessonId, childId, status: 'todo' },
            ],
          }
        }),
      reset: () => {
        localStorage.removeItem(STORAGE_KEY)
        setState(initialState)
      },
    }
  }, [state])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

// ---- Selectors / helpers ----------------------------------------------------

export function useChildrenInView() {
  const { children, currentView } = useStore()
  if (currentView === 'shared') return children
  return children.filter((c) => c.householdId === currentView)
}
