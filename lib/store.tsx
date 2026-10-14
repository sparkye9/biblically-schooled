'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { DayMode, Grade } from './curriculum/types'
import type { LearnerAdjustments } from './plan/day-plan'
import { isoDate, type WeeklySchedule } from './plan/schedule'
import { initialState } from './state/defaults'
import * as logic from './state/logic'
import { STORAGE_KEY, loadState, migrateLegacy, normalize } from './state/migrate'
import type { CustomActivity, FamilyState, RestartEvent, SkillStatus, StoredChild } from './state/types'
import type { ChildColor, GradeBand, ParentNote, ReadAloudBook, Resource } from './types'

/**
 * App store: React glue around the pure functions in lib/state. State lives in
 * localStorage under `biblically-schooled-v6`; the previous `-v5` copy is read
 * once, migrated, and left in place untouched as a safety net.
 */

export interface BackupFile {
  app: 'biblically-schooled'
  version: 6
  exportedAt: string
  state: FamilyState
}

interface Actions {
  setView: (view: string) => void
  setActiveMom: (householdId: string) => void
  toggle: (key: string) => void
  finishDay: () => void
  chooseMode: (mode: DayMode, easy?: boolean) => void
  teachAnyway: () => void
  setDefaultMode: (mode: DayMode) => void
  restart: (choice: RestartEvent['choice']) => void
  setPointer: (index: number) => void
  setSkill: (childId: string, skillId: string, status: SkillStatus) => void
  setSchedule: (schedule: WeeklySchedule) => void
  setStartDate: (iso: string) => void
  addBreak: (b: { startDate: string; endDate: string; label?: string }) => void
  removeBreak: (id: string) => void
  updateChild: (id: string, patch: Partial<StoredChild>) => void
  setAdjust: (childId: string, adjust: LearnerAdjustments) => void
  addHousehold: (name: string, momName: string) => string
  addChild: (input: { name: string; grade: string; gradeBand: GradeBand; householdId: string; color: ChildColor }) => string
  removeChild: (id: string) => void
  addCustomActivity: (a: Omit<CustomActivity, 'id' | 'done'>) => void
  toggleCustomActivity: (id: string, childId: string) => void
  removeCustomActivity: (id: string) => void
  addReadAloud: (title: string) => void
  setReadAloudStatus: (id: string, status: ReadAloudBook['status']) => void
  removeReadAloud: (id: string) => void
  saveNote: (note: Omit<ParentNote, 'id'>) => void
  addResource: (r: Omit<Resource, 'id'>) => void
  removeResource: (id: string) => void
  toggleFamilyLesson: (id: string) => void
  setPrefs: (p: Partial<Pick<FamilyState, 'preferSeasonal' | 'printColor' | 'viewPin' | 'parentPin'>>) => void
  dismiss: (id: string) => void
  exportBackup: () => BackupFile
  importBackup: (json: unknown) => void
  reset: () => void
}

export interface StoreValue extends FamilyState, Actions {
  hydrated: boolean
  /** Today's local date, kept fresh while the tab is open. */
  todayIso: string
  now: Date
  childrenInView: StoredChild[]
}

const Ctx = createContext<StoreValue | null>(null)

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FamilyState>(() => initialState())
  const [hydrated, setHydrated] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const todayIso = isoDate(now)

  useEffect(() => {
    setState(loadState(window.localStorage, new Date()))
    setHydrated(true)
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  // Move past a lesson day that was taught on an earlier date (never past a missed one).
  useEffect(() => {
    if (hydrated) setState((s) => logic.rollover(s, todayIso))
  }, [hydrated, todayIso])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage full or unavailable — the app keeps working in memory */
    }
  }, [state, hydrated])

  const update = useCallback((fn: (s: FamilyState) => FamilyState) => setState(fn), [])

  const value = useMemo<StoreValue>(() => {
    const childrenInView =
      state.currentView === 'shared' ? state.children : state.children.filter((c) => c.householdId === state.currentView)
    return {
      ...state,
      hydrated,
      todayIso,
      now,
      childrenInView,
      setView: (view) => update((s) => ({ ...s, currentView: view })),
      setActiveMom: (id) => update((s) => ({ ...s, activeMomHouseholdId: id, currentView: id })),
      toggle: (key) => update((s) => logic.toggleCompletion(s, key, todayIso)),
      finishDay: () => update((s) => logic.finishDay(s, todayIso)),
      chooseMode: (mode, easy = false) => update((s) => logic.chooseMode(s, todayIso, mode, easy)),
      teachAnyway: () => update((s) => logic.teachAnyway(s, todayIso)),
      setDefaultMode: (mode) => update((s) => ({ ...s, defaultMode: mode })),
      restart: (choice) => update((s) => logic.restart(s, choice, todayIso)),
      setPointer: (index) => update((s) => logic.setPointer(s, index)),
      setSkill: (childId, skillId, status) => update((s) => logic.setSkill(s, childId, skillId, status)),
      setSchedule: (schedule) => update((s) => ({ ...s, schedule })),
      setStartDate: (iso) => update((s) => ({ ...s, schoolYearStartDate: iso })),
      addBreak: (b) => update((s) => ({ ...s, breaks: [...s.breaks, { ...b, id: uid('br') }] })),
      removeBreak: (id) => update((s) => ({ ...s, breaks: s.breaks.filter((b) => b.id !== id) })),
      updateChild: (id, patch) => update((s) => ({ ...s, children: s.children.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      setAdjust: (childId, adjust) =>
        update((s) => ({ ...s, children: s.children.map((c) => (c.id === childId ? { ...c, adjust } : c)) })),
      addHousehold: (name, momName) => {
        const id = uid('h')
        update((s) => ({
          ...s,
          households: [...s.households, { id, name: name || `${momName}'s Homeschool`, momName, momInitial: momName.charAt(0).toUpperCase() || 'M' }],
        }))
        return id
      },
      addChild: (input) => {
        const id = uid('c')
        update((s) => ({ ...s, children: [...s.children, { ...input, id, childMode: false, lowDistraction: false }] }))
        return id
      },
      removeChild: (id) => update((s) => ({ ...s, children: s.children.filter((c) => c.id !== id) })),
      addCustomActivity: (a) => update((s) => ({ ...s, customActivities: [...s.customActivities, { ...a, id: uid('ca'), done: {} }] })),
      toggleCustomActivity: (id, childId) =>
        update((s) => ({
          ...s,
          customActivities: s.customActivities.map((a) =>
            a.id === id ? { ...a, done: { ...a.done, [childId]: a.done[childId] ? undefined : todayIso } } : a,
          ),
        })),
      removeCustomActivity: (id) => update((s) => ({ ...s, customActivities: s.customActivities.filter((a) => a.id !== id) })),
      addReadAloud: (title) =>
        update((s) => ({ ...s, readAloud: [{ id: uid('b'), title, status: 'currently-reading', householdId: s.activeMomHouseholdId }, ...s.readAloud] })),
      setReadAloudStatus: (id, status) => update((s) => ({ ...s, readAloud: s.readAloud.map((b) => (b.id === id ? { ...b, status } : b)) })),
      removeReadAloud: (id) => update((s) => ({ ...s, readAloud: s.readAloud.filter((b) => b.id !== id) })),
      saveNote: (note) => update((s) => ({ ...s, parentNotes: [{ ...note, id: uid('n') }, ...s.parentNotes] })),
      addResource: (r) => update((s) => ({ ...s, resources: [{ ...r, id: uid('r') }, ...s.resources] })),
      removeResource: (id) => update((s) => ({ ...s, resources: s.resources.filter((r) => r.id !== id) })),
      toggleFamilyLesson: (id) =>
        update((s) => {
          const familyModule = { ...s.familyModule }
          if (familyModule[id]) delete familyModule[id]
          else familyModule[id] = todayIso
          return { ...s, familyModule }
        }),
      setPrefs: (p) => update((s) => ({ ...s, ...p })),
      dismiss: (id) => update((s) => ({ ...s, dismissed: [...new Set([...s.dismissed, id])] })),
      exportBackup: () => ({ app: 'biblically-schooled', version: 6, exportedAt: new Date().toISOString(), state }),
      importBackup: (json) => {
        const data = json as Record<string, unknown>
        if (data && data.app === 'biblically-schooled' && data.state) {
          update(() => normalize(data.state as Partial<FamilyState>))
        } else if (data && Array.isArray(data.children)) {
          // A backup file from the previous version of the app.
          update(() => migrateLegacy(data as Parameters<typeof migrateLegacy>[0]))
        } else {
          throw new Error('This file is not a Biblically Schooled backup.')
        }
      },
      reset: () => update(() => initialState()),
    }
  }, [state, hydrated, todayIso, now, update])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function gradeLabel(g: Grade) {
  return g === 'pre-k' ? 'Pre-K' : g === 'k' ? 'Kindergarten' : '1st Grade'
}
