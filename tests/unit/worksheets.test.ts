import { describe, expect, it } from 'vitest'
import { ICONS } from '@/components/worksheets/icons'
import { allWorksheets, worksheetsForWeek } from '@/lib/worksheets'
import { findDuplicates, validateWorksheet, WORKSHEET_ICONS } from '@/lib/worksheets/validate'

const all = [...allWorksheets().values()]

describe('Worksheet quality control (whole year)', () => {
  it('generates every planned worksheet', () => {
    // Pre-K 5/week, K 8/week, 1st 8/week × 36 weeks
    expect(all.length).toBe(36 * (5 + 8 + 8))
  })
  it('every worksheet passes validation (answers, choices, pictures, page fit, grade range)', () => {
    const problems = all.flatMap((w) => validateWorksheet(w).filter((i) => i.level === 'error').map((i) => `${w.id}: ${i.message}`))
    expect(problems).toEqual([])
  })
  it('has no duplicate worksheets within a grade', () => {
    expect(findDuplicates(all)).toEqual([])
  })
  it('every picture a worksheet can use exists in the bundled icon set', () => {
    const missing = [...WORKSHEET_ICONS].filter((n) => !ICONS[n])
    expect(missing).toEqual([])
  })
  it('every worksheet has name, objective, instructions, and an answer key', () => {
    for (const w of all) {
      expect(w.objective, w.id).toBeTruthy()
      expect(w.instructions, w.id).toBeTruthy()
      expect(w.answerKey.length, w.id).toBeGreaterThan(0)
    }
  })
  it('rotates activity types — each grade uses at least 15 different formats', () => {
    for (const g of ['pre-k', 'k', '1st']) {
      const kinds = new Set(all.filter((w) => w.grade === g).map((w) => w.activity))
      expect(kinds.size, g).toBeGreaterThanOrEqual(15)
    }
  })
  it('no single format dominates a grade’s non-Bible pages (≤ 20%)', () => {
    for (const g of ['pre-k', 'k', '1st']) {
      const pages = all.filter((w) => w.grade === g && w.subject !== 'bible')
      const counts = new Map<string, number>()
      pages.forEach((p) => counts.set(p.activity, (counts.get(p.activity) ?? 0) + 1))
      const max = Math.max(...counts.values())
      expect(max / pages.length, g).toBeLessThanOrEqual(0.2)
    }
  })
  it('is deterministic — the same week prints the same pages', () => {
    const a = worksheetsForWeek(5, 'k').map((w) => JSON.stringify(w.blocks))
    const b = worksheetsForWeek(5, 'k').map((w) => JSON.stringify(w.blocks))
    expect(a).toEqual(b)
  })
})
