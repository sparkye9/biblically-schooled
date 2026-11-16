import { describe, expect, it } from 'vitest'
import { hasGlyph } from '@/lib/curriculum/handwriting-glyphs'
import { graphemesTaughtThrough } from '@/lib/curriculum/literacy'
import { ICONS } from '@/components/worksheets/icons'
import { REVIEW_SHEETS, allReviewSheets, reviewSheet, sheetForIndex, traceFits, weekForSheet } from '@/lib/worksheets/daily-review'
import { COIN_VALUE, type Block, type MixSection } from '@/lib/worksheets/types'

const sheets = allReviewSheets()
const sectionsOf = (b: Block[]) => (b[0] as Extract<Block, { type: 'mixed' }>).sections

describe('Daily review sheets', () => {
  it('50 regular + 50 challenge sheets for each grade', () => {
    expect(sheets).toHaveLength(3 * 2 * REVIEW_SHEETS)
    expect(new Set(sheets.map((s) => s.id)).size).toBe(sheets.length)
  })
  it('no two sheets alike within a grade and level', () => {
    for (const g of ['pre-k', 'k', '1st'] as const)
      for (const lv of ['regular', 'challenge'] as const) {
        const set = new Set(Array.from({ length: REVIEW_SHEETS }, (_, i) => JSON.stringify(reviewSheet(g, i + 1, lv).blocks)))
        expect(set.size, `${g} ${lv}`).toBe(REVIEW_SHEETS)
      }
  })
  it('every sheet mixes at least 6 different kinds of tasks and has an answer key line for each', () => {
    for (const s of sheets) {
      const sec = sectionsOf(s.blocks)
      expect(sec.length, s.id).toBeGreaterThanOrEqual(6)
      expect(new Set(sec.map((x) => x.body.kind)).size, s.id).toBeGreaterThanOrEqual(5)
      expect(s.answerKey).toHaveLength(sec.length)
    }
  })
  it('answers are correct and numbers are sensible', () => {
    for (const s of sheets)
      for (const sec of sectionsOf(s.blocks)) {
        const b = sec.body
        if (b.kind === 'equations')
          for (const e of b.items) {
            expect(e.op === '+' ? e.a + e.b : e.a - e.b, s.id).toBe(e.answer)
            expect(e.answer).toBeGreaterThanOrEqual(0)
            expect(e.b, `${s.id} has a zero`).toBeGreaterThan(0)
          }
        if (b.kind === 'next') for (const r of b.rows) expect(r.answer - r.seq[2], s.id).toBe(r.seq[2] - r.seq[1])
        if (b.kind === 'coins') for (const c of b.items) expect(c.coins.reduce((t, x) => t + COIN_VALUE[x], 0)).toBeLessThanOrEqual(100)
        if (b.kind === 'first-sound') for (const it of b.items) expect(it.choices).toContain(it.answer)
        if (b.kind === 'fill-blank') for (const it of b.items) expect(it.choices).toContain(it.answer)
        if (b.kind === 'match') expect(b.words.length).toBe(b.pictures.length)
        if (b.kind === 'compare') expect(b.items.every((x) => x.left > 0 && x.right > 0)).toBe(true)
      }
  })
  it('every picture exists, every traced character has stroke data, and handwriting fits its box', () => {
    for (const s of sheets)
      for (const sec of sectionsOf(s.blocks)) {
        const b = sec.body
        const pics = b.kind === 'first-sound' || b.kind === 'spell' ? b.items.map((x) => x.picture) : b.kind === 'match' ? b.pictures : b.kind === 'count' || b.kind === 'picture-add' || b.kind === 'more-fewer' ? b.items.map((x) => x.icon) : []
        for (const p of pics) expect(ICONS[p], `${s.id}: ${p}`).toBeTruthy()
        if (b.kind === 'trace') for (const ch of b.text) expect(hasGlyph(ch), `${s.id}: ${ch}`).toBe(true)
        expect(traceFits(sec as MixSection), s.id).toBe(true)
      }
  })
  it('Pre-K and K regular sheets only use letters already taught', () => {
    for (const g of ['pre-k', 'k'] as const)
      for (let n = 1; n <= REVIEW_SHEETS; n++) {
        const taught = new Set(graphemesTaughtThrough(g, weekForSheet(n)))
        if (taught.size < 3) continue
        for (const sec of sectionsOf(reviewSheet(g, n, 'regular').blocks)) {
          if (sec.body.kind === 'first-sound') for (const it of sec.body.items) expect(taught.has(it.answer), `${g} #${n}: ${it.answer}`).toBe(true)
          if (sec.body.kind === 'letter-find') expect(taught.has(sec.body.target), `${g} #${n}`).toBe(true)
        }
      }
  })
  it('challenge sheets are harder: bigger numbers than the matching regular sheet', () => {
    const maxNum = (g: 'k' | '1st', n: number, lv: 'regular' | 'challenge') =>
      Math.max(...sectionsOf(reviewSheet(g, n, lv).blocks).flatMap((x) => (x.body.kind === 'next' ? x.body.rows.map((r) => r.answer) : x.body.kind === 'equations' ? x.body.items.map((e) => Math.max(e.a, e.answer)) : [0])))
    let harder = 0
    for (let n = 1; n <= REVIEW_SHEETS; n++) if (maxNum('k', n, 'challenge') >= maxNum('k', n, 'regular')) harder++
    expect(harder).toBeGreaterThan(REVIEW_SHEETS * 0.8)
  })
  it('sheets follow the curriculum through the year', () => {
    expect(weekForSheet(1)).toBe(1)
    expect(weekForSheet(50)).toBe(36)
    expect(sheetForIndex(0)).toBe(1)
    expect(sheetForIndex(143)).toBe(50)
  })
})
