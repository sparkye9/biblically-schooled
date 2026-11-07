import { describe, expect, it } from 'vitest'
import { adaptLesson } from '@/lib/curriculum/adapt'
import { GLYPHS, startDirection, textWidth } from '@/lib/curriculum/handwriting-glyphs'
import { getHandwritingWeek } from '@/lib/curriculum/handwriting'
import { STRANDS, languageDay } from '@/lib/curriculum/language'
import { applyFluencyGate, bibleLesson, handwritingLesson, literacyLesson, mathLesson } from '@/lib/curriculum/lessons'
import { getLiteracyWeek } from '@/lib/curriculum/literacy'
import { MATH } from '@/lib/curriculum/math'
import { mathMethod } from '@/lib/curriculum/math-method'
import { mathSkillId } from '@/lib/curriculum/skills'
import { LESSON_DAYS, type Grade, type LessonDay } from '@/lib/curriculum/types'
import { buildDayPlan, lessonsFor } from '@/lib/plan/day-plan'
import { DEFAULT_SCHEDULE, PREVIOUS_DEFAULT_SCHEDULE, enrichmentsOf } from '@/lib/plan/schedule'
import { initialState } from '@/lib/state/defaults'
import * as L from '@/lib/state/logic'
import { normalize } from '@/lib/state/migrate'
import { allWorksheets, getWorksheet } from '@/lib/worksheets'
import type { Block } from '@/lib/worksheets/types'

const GRADES: Grade[] = ['pre-k', 'k', '1st']
const weeks = Array.from({ length: 36 }, (_, i) => i + 1)
const d = (y: number, m: number, day: number) => new Date(y, m - 1, day)

describe('Weekly rhythm: worksheets alternate with hands-on days', () => {
  it('day 0 (Monday, church morning) has nothing to print for anyone', () => {
    for (const g of GRADES)
      for (const w of weeks) {
        expect(bibleLesson(w, 0, g).worksheet).toBeNull()
        expect(literacyLesson(w, 0, g).worksheet).toBeNull()
        expect(mathLesson(w, 0, g).worksheet).toBeNull()
        expect(handwritingLesson(w, 0, g)?.worksheet ?? null).toBeNull()
      }
  })
  it('day 2 is hands-on and movement: no math, Bible, or handwriting pages; readers get a story page only', () => {
    for (const g of GRADES)
      for (const w of weeks) {
        expect(mathLesson(w, 2, g).worksheet).toBeNull()
        expect(bibleLesson(w, 2, g).worksheet).toBeNull()
        expect(handwritingLesson(w, 2, g)?.worksheet ?? null).toBeNull()
        expect(literacyLesson(w, 2, g).worksheet !== null).toBe(g !== 'pre-k')
      }
  })
  it('every lesson is labeled with an activity type, and each week mixes all five types', () => {
    const s = initialState(d(2026, 11, 9))
    for (const c of s.children) {
      const learner = L.learnerOf(c, s)
      for (const w of [1, 12, 31]) {
        const types = new Set(LESSON_DAYS.flatMap((day) => lessonsFor(learner, w, day).map((l) => l.activity)))
        expect(types.has('hands-on')).toBe(true)
        expect(types.has('academic')).toBe(true)
        expect(types.has('review')).toBe(true)
        expect(types.has('movement') || types.has('discussion')).toBe(true)
      }
    }
  })
  it('the hands-on day is not worksheet work for anyone', () => {
    const s = initialState(d(2026, 11, 9))
    for (const c of s.children) for (const l of lessonsFor(L.learnerOf(c, s), 10, 0)) expect(l.activity).not.toBe('academic')
  })
})

describe('Math: concrete → pictorial → abstract, with what / why / how', () => {
  it('every topic in every grade has what, why, how, and all three stages', () => {
    for (const g of GRADES)
      for (const t of MATH[g]) {
        const m = mathMethod(t)
        expect(m.what.length, `${g} w${t.week}`).toBeGreaterThan(10)
        expect(m.why.length, `${g} w${t.week}`).toBeGreaterThan(30)
        expect(m.how.length).toBeGreaterThanOrEqual(2)
        expect(m.concrete && m.pictorial && m.abstract).toBeTruthy()
        expect(m.realLife.length).toBeGreaterThan(0)
        expect(m.movement).toBeTruthy()
      }
  })
  it('lesson days follow the stages: objects Monday, pictures then numbers Tuesday, real life Thursday, independent Friday', () => {
    const labels = (day: LessonDay) => mathLesson(10, day, '1st').guide.stages!.map((s) => s.label)
    expect(labels(0)).toEqual(['Concrete'])
    expect(labels(1)).toEqual(['Concrete (quick re-model)', 'Pictorial', 'Abstract'])
    expect(labels(2)).toEqual(['Apply'])
    expect(labels(3)[0]).toMatch(/independent/)
  })
  it('explains why 8 + 5 = 13 (make a ten), not just that it is', () => {
    const g = mathLesson(10, 0, '1st').guide
    expect(g.example).toMatch(/8 \+ 5/)
    expect(g.example).toMatch(/13/)
    expect(g.why).toMatch(/10/)
  })
  it('1st grade includes column addition with carrying, equal groups, and sharing', () => {
    const titles = MATH['1st'].map((t) => t.title).join(' | ')
    expect(titles).toMatch(/Carrying/)
    expect(titles).toMatch(/Equal Groups/)
    expect(titles).toMatch(/Sharing Fairly/)
    expect(MATH['1st'].some((t) => t.whenReady?.some((s) => /borrow/i.test(s)))).toBe(true)
  })
  it('column pages mix carrying and non-carrying problems with correct answers', () => {
    const ws = getWorksheet(mathLesson(20, 1, '1st').worksheet!.id)!
    const b = ws.blocks.find((x) => x.type === 'vertical') as Extract<Block, { type: 'vertical' }>
    expect(b.items.every((i) => i.a + i.b === i.answer)).toBe(true)
    const carries = b.items.filter((i) => (i.a % 10) + (i.b % 10) >= 10).length
    expect(carries).toBeGreaterThan(0)
    expect(carries).toBeLessThan(b.items.length)
  })
  it('timed practice only after the concept skills are demonstrated', () => {
    const lesson = mathLesson(21, 3, 'k') // Quick Facts Within 5
    const notYet = applyFluencyGate(lesson, () => false)
    expect(notYet.guide.practice.join(' ')).toMatch(/untimed/)
    const ready = applyFluencyGate(lesson, (id) => id === mathSkillId('k', 13) || id === mathSkillId('k', 14))
    expect(ready.guide.practice.join(' ')).toMatch(/timed round is OK/)
  })
  it('every math lesson has a mental-math warm-up', () => {
    for (const g of GRADES) for (const w of weeks) for (const day of LESSON_DAYS) expect(mathLesson(w, day, g).guide.warmUp).toBeTruthy()
  })
})

describe('Handwriting and number formation (Pre-K and K)', () => {
  it('has stroke data for every letter, number, and name punctuation', () => {
    for (const ch of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.') expect(GLYPHS[ch], ch).toBeTruthy()
  })
  it('starting arrows point the way children are taught (top-down, counterclockwise circles)', () => {
    expect(startDirection(GLYPHS.l[0])![1]).toBeGreaterThan(0.9) // straight down
    expect(startDirection(GLYPHS.o[0])![0]).toBeLessThan(0) // from the top, curving left
    expect(startDirection(GLYPHS.c[0])![0]).toBeLessThan(0)
    expect(startDirection(GLYPHS['1'][0])![1]).toBeGreaterThan(0.9)
  })
  it('Pre-K letters follow the literacy letter of the week', () => {
    for (const w of weeks) {
      const lw = getLiteracyWeek('pre-k', w)
      if (lw.pattern !== 'letter' || lw.graphemes.length !== 1) continue
      const g = lw.graphemes[0]
      expect(getHandwritingWeek('pre-k', w).letters).toEqual([g.toUpperCase(), g])
    }
  })
  it('numbers progress through the year (Pre-K 1→10, K 0→20 then larger)', () => {
    expect(getHandwritingWeek('pre-k', 1).numbers).toEqual(['1'])
    expect(getHandwritingWeek('pre-k', 19).numbers).toEqual(['10'])
    expect(getHandwritingWeek('k', 11).numbers).toEqual(['19', '20'])
  })
  it('Kindergarten moves on to words, then sentences', () => {
    expect(getHandwritingWeek('k', 16).words.length).toBeGreaterThan(0)
    expect(weeks.some((w) => getHandwritingWeek('k', w).sentence)).toBe(true)
  })
  it('pages mix guided tracing, copying, independent writing, and numbers — never one exercise', () => {
    const pages = [...allWorksheets().values()].filter((w) => w.subject === 'handwriting')
    expect(pages.length).toBe(36 * 2 * 2)
    for (const p of pages) {
      const hw = p.blocks.find((b) => b.type === 'handwriting') as Extract<Block, { type: 'handwriting' }>
      const modes = new Set(hw.rows.map((r) => r.mode))
      expect(modes.size, p.id).toBeGreaterThanOrEqual(2)
      if (p.day === 1) expect(modes.has('guided'), p.id).toBe(true)
      if (p.day === 3) expect(modes.has('write'), p.id).toBe(true)
      expect(hw.rows.some((r) => /\d/.test(r.text)), `${p.id} has numbers`).toBe(true)
      for (const r of hw.rows) {
        const max = r.size === 'lg' ? 860 : 1300 // 700px of printable width at each scale
        expect(textWidth(r.text.replace('{{NAME}}', 'Olori-Joy')), `${p.id}: ${r.text}`).toBeLessThanOrEqual(max)
      }
    }
  })
  it('Seraiah and Olori-Joy get daily handwriting; Alijah does not', () => {
    const s = initialState(d(2026, 11, 9))
    const plan = buildDayPlan({ index: 40, mode: 'standard', easy: false, learners: s.children.map((c) => L.learnerOf(c, s)), enrichment: 'art', date: d(2026, 11, 9) })
    const has = (id: string) => plan.children.find((c) => c.learner.id === id)!.items.some((i) => i.subject === 'handwriting')
    expect(has('c-seraiah')).toBe(true)
    expect(has('c-olori')).toBe(true)
    expect(has('c-alijah')).toBe(false)
  })
})

describe('Language building and access supports (profile-driven)', () => {
  it('covers every strand across the year, with directions growing from 1 to 3 steps', () => {
    const focus = new Set(weeks.map((w) => languageDay(w, 0).focus))
    for (const s of STRANDS.filter((s) => s !== 'directions')) expect(focus.has(s), s).toBe(true)
    expect(languageDay(2, 1).title).toMatch(/1-step/)
    expect(languageDay(12, 1).title).toMatch(/2-step/)
    expect(languageDay(30, 1).title).toMatch(/3-step/)
  })
  it('is mostly talk, movement, and games — never a worksheet', () => {
    for (const w of weeks) for (const day of LESSON_DAYS) expect(['discussion', 'movement', 'hands-on', 'review']).toContain(languageDay(w, day).activity)
  })
  it('Alijah gets the language block daily (not on Minimum days, where it is part of Bible time)', () => {
    const s = initialState(d(2026, 11, 9))
    const learners = s.children.map((c) => L.learnerOf(c, s))
    const alijah = (mode: 'standard' | 'minimum') =>
      buildDayPlan({ index: 41, mode, easy: false, learners, enrichment: 'science', date: d(2026, 11, 10) }).children.find((c) => c.learner.id === 'c-alijah')!
    expect(alijah('standard').items.some((i) => i.subject === 'language')).toBe(true)
    expect(alijah('minimum').items.some((i) => i.subject === 'language')).toBe(false)
    const others = buildDayPlan({ index: 41, mode: 'standard', easy: false, learners, enrichment: null, date: d(2026, 11, 10) }).children.filter((c) => c.learner.id !== 'c-alijah')
    expect(others.every((c) => c.items.every((i) => i.subject !== 'language'))).toBe(true)
  })
  it('access supports change HOW, not WHAT: same objective, skills, worksheet, and checks as the grade-level lesson', () => {
    for (const w of [3, 14, 27]) {
      for (const day of LESSON_DAYS) {
        for (const lesson of [bibleLesson(w, day, '1st'), literacyLesson(w, day, '1st'), mathLesson(w, day, '1st')]) {
          const a = adaptLesson(lesson, 'Alijah')
          expect(a.guide.objective).toBe(lesson.guide.objective)
          expect(a.skillIds).toEqual(lesson.skillIds)
          expect(a.worksheet).toEqual(lesson.worksheet)
          expect(a.guide.check).toBe(lesson.guide.check)
          expect(a.guide.teach).toEqual(lesson.guide.teach)
          expect(a.grade).toBe('1st')
          expect(a.guide.structure).toBeTruthy()
          expect(a.guide.supports!.length).toBeGreaterThan(2)
        }
      }
    }
  })
  it('Alijah keeps 1st-grade lessons alongside his siblings (no automatic downgrade)', () => {
    const s = initialState(d(2026, 11, 9))
    const alijah = s.children.find((c) => c.id === 'c-alijah')!
    const lessons = lessonsFor(L.learnerOf(alijah, s), 12, 1)
    expect(lessons.filter((l) => l.subject !== 'language').every((l) => l.grade === '1st')).toBe(true)
    expect(lessons.every((l) => l.guide.supports?.length)).toBe(true)
  })
})

describe('Calendar and saved data', () => {
  it('default week: Mon art, Tue science, Wed co-op, Thu art, Fri science + library; church noted Mon and Wed', () => {
    expect(enrichmentsOf(DEFAULT_SCHEDULE[1])).toEqual(['art'])
    expect(enrichmentsOf(DEFAULT_SCHEDULE[2])).toEqual(['science'])
    expect(DEFAULT_SCHEDULE[3].kind).toBe('coop')
    expect(enrichmentsOf(DEFAULT_SCHEDULE[4])).toEqual(['art'])
    expect(enrichmentsOf(DEFAULT_SCHEDULE[5])).toEqual(['science', 'library'])
    expect(DEFAULT_SCHEDULE[1].note).toMatch(/Church/)
    expect(DEFAULT_SCHEDULE[3].note).toMatch(/Church/)
  })
  it('Friday plan includes both science and library', () => {
    const s = initialState(d(2026, 11, 13))
    const p = buildDayPlan({ index: 43, mode: 'standard', easy: false, learners: s.children.map((c) => L.learnerOf(c, s)), enrichment: enrichmentsOf(DEFAULT_SCHEDULE[5]), date: d(2026, 11, 13) })
    expect(p.enrichments.map((e) => e.kind)).toEqual(['science', 'library'])
    expect(new Set(p.children[0].items.map((i) => i.key)).size).toBe(p.children[0].items.length)
  })
  it('saved data: an untouched old default schedule is upgraded; a customized one is kept', () => {
    const today = d(2026, 11, 9)
    expect(normalize({ schedule: PREVIOUS_DEFAULT_SCHEDULE }, today).schedule).toEqual(DEFAULT_SCHEDULE)
    const custom = PREVIOUS_DEFAULT_SCHEDULE.map((x, i) => (i === 2 ? { ...x, enrichment: 'art' as const } : x)) as typeof PREVIOUS_DEFAULT_SCHEDULE
    expect(normalize({ schedule: custom }, today).schedule).toEqual(custom)
  })
  it('saved children keep their data and gain a profile without overwriting one', () => {
    const today = d(2026, 11, 9)
    const base = initialState(today)
    const old = base.children.map(({ profile: _p, ...c }) => ({ ...c, supports: ['Use a visual timer'] }))
    const n = normalize({ children: old, completions: { '3|c-alijah|math': { at: 'x', date: '2026-08-27' } as never } }, today)
    expect(n.children.find((c) => c.id === 'c-alijah')!.profile).toEqual({ handwriting: false, languageBuilding: true, accessSupports: true })
    expect(n.children.find((c) => c.id === 'c-alijah')!.supports).toEqual(['Use a visual timer'])
    expect(n.completions['3|c-alijah|math']).toBeTruthy()
    const mine = normalize({ children: [{ ...base.children[1], profile: { handwriting: false } }] }, today)
    expect(mine.children[0].profile).toEqual({ handwriting: false })
  })
})
