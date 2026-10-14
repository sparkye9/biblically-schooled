import { describe, expect, it } from 'vitest'
import { indexOf } from '@/lib/plan/schedule'
import { keyOf } from '@/lib/state/logic'
import { LEGACY_KEY, STORAGE_KEY, loadState, migrateLegacy } from '@/lib/state/migrate'

const legacy = {
  households: [
    { id: 'h-venessa', name: "Venessa's Homeschool", momName: 'Venessa', momInitial: 'V' },
    { id: 'h-lola', name: "Damilola's Homeschool", momName: 'Damilola', momInitial: 'D' },
  ],
  children: [
    { id: 'c-alijah', name: 'Alijah', grade: '1st Grade', gradeBand: '1st', householdId: 'h-venessa', color: 'child-alijah', childMode: true, lowDistraction: false },
    { id: 'c-olori', name: 'Olori-Joy', grade: 'Kindergarten', gradeBand: 'k', householdId: 'h-venessa', color: 'child-olori', childMode: false, lowDistraction: true },
    { id: 'c-seraiah', name: 'Seraiah', grade: 'Pre-K', gradeBand: 'pre-k', householdId: 'h-venessa', color: 'child-seraiah', childMode: false, lowDistraction: false },
    { id: 'c-amelia', name: 'Amelia', grade: 'Pre-K', gradeBand: 'pre-k', householdId: 'h-lola', color: 'child-amelia', childMode: false, lowDistraction: false },
  ],
  lessons: [
    { id: 'l-seed-10', title: 'Number Bonds to 10', subject: 'math', weekNumber: 1, day: 'tuesday', gradeBand: '1st' },
    { id: 'l-seed-11', title: 'Family Bible', subject: 'bible', weekNumber: 2, day: 'monday', gradeBand: 'pre-k' },
    { id: 'l-seed-12', title: 'Living vs Nonliving', subject: 'science', weekNumber: 2, day: 'tuesday', gradeBand: 'k' },
    { id: 'l-abc', title: 'Grandma’s garden visit', subject: 'science', weekNumber: 3, day: 'thursday', gradeBand: 'k' },
  ],
  assignments: [
    { id: 'a1', lessonId: 'l-seed-10', childId: 'c-alijah', status: 'done', completedAt: '2026-08-25T15:00:00.000Z' },
    { id: 'a2', lessonId: 'l-seed-11', childId: 'c-seraiah', status: 'done', completedAt: '2026-08-31T15:00:00.000Z' },
    { id: 'a3', lessonId: 'l-seed-12', childId: 'c-olori', status: 'todo' },
    { id: 'a4', lessonId: 'l-abc', childId: 'c-olori', status: 'done', completedAt: '2026-09-10T15:00:00.000Z' },
  ],
  skills: [{ id: 's1', childId: 'c-alijah', track: 'literacy', name: 'CVC Blending', status: 'almost' }],
  readAloud: [{ id: 'b1', title: 'Little House in the Big Woods', status: 'currently-reading', householdId: 'h-venessa' }],
  supplies: [],
  parentNotes: [{ id: 'n1', childId: 'c-alijah', weekNumber: 2, worked: 'Blending', needsPractice: 'b/d', enjoyed: 'Math games' }],
  resources: [
    { id: 'r-packet-1', title: 'Week 1 packet', type: 'Daily Packet', subject: 'review', skill: '', gradeBand: '1st', weekNumber: 1, minutes: 20, owner: 'h-venessa', contributor: 'x', fileUrl: '/worksheets/week-01/Alijah/Mon.pdf' },
    { id: 'r-mine', title: 'My upload', type: 'Worksheet', subject: 'math', skill: '', gradeBand: '1st', weekNumber: 3, minutes: 10, owner: 'h-venessa', contributor: 'Venessa', fileKey: 'k1' },
  ],
  currentView: 'h-venessa',
  activeMomHouseholdId: 'h-venessa',
  schoolYearStartDate: '2026-08-24',
  pausedWeeks: [{ id: 'pw1', startDate: '2026-09-07', endDate: '2026-09-07', label: 'Labor Day' }],
  viewPin: '1234',
}

describe('Migration from the previous app (v5)', () => {
  const s = migrateLegacy(legacy as never, new Date(2026, 9, 14))

  it('preserves every child and household exactly', () => {
    expect(s.children.map((c) => c.name)).toEqual(['Alijah', 'Olori-Joy', 'Seraiah', 'Amelia'])
    expect(s.children.find((c) => c.id === 'c-olori')?.lowDistraction).toBe(true)
    expect(s.households).toHaveLength(2)
  })
  it('carries completed lessons onto the matching new lesson day', () => {
    expect(s.completions[keyOf(indexOf(1, 1), 'c-alijah', 'math')]).toBeTruthy()
    expect(s.completions[keyOf(indexOf(2, 0), 'c-seraiah', 'bible')]).toBeTruthy()
    // not-done assignments are not invented as done
    expect(s.completions[keyOf(indexOf(2, 1), 'c-olori', 'enrichment')]).toBeUndefined()
  })
  it('keeps custom lessons the family wrote', () => {
    expect(s.customActivities).toHaveLength(1)
    expect(s.customActivities[0].title).toBe('Grandma’s garden visit')
    expect(s.customActivities[0].done['c-olori']).toBeTruthy()
  })
  it('keeps old skills with mapped statuses, notes, books, breaks, PIN, uploads', () => {
    expect(s.legacySkills[0]).toMatchObject({ name: 'CVC Blending', status: 'practicing' })
    expect(s.parentNotes).toHaveLength(1)
    expect(s.readAloud[0].title).toMatch(/Little House/)
    expect(s.breaks[0].label).toBe('Labor Day')
    expect(s.viewPin).toBe('1234')
    expect(s.resources.map((r) => r.id)).toEqual(['r-mine'])
  })
  it('places the family at their current calendar position, not back at week 1', () => {
    expect(s.pointer).toBeGreaterThan(20)
    expect(s.currentView).toBe('shared')
  })
  it('loadState prefers v6, falls back to migrating v5, and never deletes v5', () => {
    const store = new Map<string, string>([[LEGACY_KEY, JSON.stringify(legacy)]])
    const storage = { getItem: (k: string) => store.get(k) ?? null }
    const loaded = loadState(storage, new Date(2026, 9, 14))
    expect(loaded.migratedFrom).toBe(LEGACY_KEY)
    expect(store.has(LEGACY_KEY)).toBe(true)
    store.set(STORAGE_KEY, JSON.stringify({ ...loaded, pointer: 77 }))
    expect(loadState(storage).pointer).toBe(77)
  })
  it('survives corrupt storage', () => {
    const storage = { getItem: () => '{not json' }
    expect(loadState(storage).version).toBe(6)
  })
})
