import { describe, expect, it } from 'vitest'
import { BIBLE_WEEKS, SEASONAL_LESSONS, UNITS, easterSunday, seasonFor, thanksgivingDay } from '@/lib/curriculum/bible'
import { ENRICHMENT } from '@/lib/curriculum/enrichment'
import { coreLessons } from '@/lib/curriculum/lessons'
import { LITERACY } from '@/lib/curriculum/literacy'
import { MATH } from '@/lib/curriculum/math'
import { GRAPHEMES, speakableKeyword, speakableLetterName } from '@/lib/curriculum/phonics'
import { PICTURES, RHYME_PAIRS, pictureByWord } from '@/lib/curriculum/pictures'
import { SKILLS } from '@/lib/curriculum/skills'
import type { Grade, LessonDay } from '@/lib/curriculum/types'

const GRADES: Grade[] = ['pre-k', 'k', '1st']

describe('36-week structure', () => {
  it('has four 9-week units covering weeks 1–36', () => {
    expect(UNITS.map((u) => u.weeks)).toEqual([
      [1, 9],
      [10, 18],
      [19, 27],
      [28, 36],
    ])
  })
  it('has a Bible lesson, literacy plan, math topic, and enrichment for every week and grade', () => {
    expect(BIBLE_WEEKS.map((b) => b.week)).toEqual(Array.from({ length: 36 }, (_, i) => i + 1))
    expect(ENRICHMENT).toHaveLength(36)
    for (const g of GRADES) {
      expect(LITERACY[g].map((l) => l.week)).toEqual(Array.from({ length: 36 }, (_, i) => i + 1))
      expect(MATH[g]).toHaveLength(36)
    }
  })
})

describe('Bible accuracy rules', () => {
  const verses = [...BIBLE_WEEKS.map((b) => b.verse), ...SEASONAL_LESSONS.map((s) => s.verse)]
  it('every short memory verse is an exact, contiguous part of the full KJV text', () => {
    for (const v of verses) expect(v.text, v.ref).toContain(v.short)
  })
  it('every verse has a well-formed reference', () => {
    for (const v of verses) expect(v.ref).toMatch(/^(\d )?[A-Z][a-z]+( [a-z]+)* \d+:\d+(–\d+)?$/)
  })
  it('each week has 3 discussion questions, an activity, a prayer, and 4 daily focuses', () => {
    for (const b of BIBLE_WEEKS) {
      expect(b.questions.length, `week ${b.week}`).toBe(3)
      expect(b.days).toHaveLength(4)
      expect(b.activity.length).toBeGreaterThan(10)
      expect(b.prayer.length).toBeGreaterThan(10)
      expect(b.parentExplanation.length).toBeGreaterThan(40)
      expect(b.childExplanation.length).toBeGreaterThan(40)
    }
  })
  it('no two weeks share a Bible title or memory verse', () => {
    expect(new Set(BIBLE_WEEKS.map((b) => b.title)).size).toBe(36)
    expect(new Set(BIBLE_WEEKS.map((b) => b.verse.ref)).size).toBe(36)
  })
  it('places Christmas in Unit 3 and the cross/resurrection right after', () => {
    expect(BIBLE_WEEKS[18].title).toMatch(/Jesus Is Born/)
    expect(BIBLE_WEEKS[25].title).toMatch(/Cross/)
    expect(BIBLE_WEEKS[26].title).toMatch(/Risen/)
  })
})

describe('Seasonal dates are computed correctly', () => {
  it('Easter', () => {
    expect(easterSunday(2026).toDateString()).toBe(new Date(2026, 3, 5).toDateString())
    expect(easterSunday(2027).toDateString()).toBe(new Date(2027, 2, 28).toDateString())
    expect(easterSunday(2028).toDateString()).toBe(new Date(2028, 3, 16).toDateString())
  })
  it('Thanksgiving (4th Thursday of November)', () => {
    expect(thanksgivingDay(2026).getDate()).toBe(26)
    expect(thanksgivingDay(2027).getDate()).toBe(25)
  })
  it('season detection', () => {
    expect(seasonFor(new Date(2026, 11, 10))?.id).toBe('advent')
    expect(seasonFor(new Date(2027, 2, 25))?.id).toBe('easter')
    expect(seasonFor(new Date(2026, 10, 25))?.id).toBe('thanksgiving')
    expect(seasonFor(new Date(2026, 9, 14))).toBeNull()
  })
})

describe('Phonics audio data', () => {
  it('letter names and sounds are never the same text (names vs. sounds are distinct)', () => {
    for (const g of GRAPHEMES) {
      expect(speakableLetterName(g.g)).not.toBe(speakableKeyword(g.g))
      expect(g.sound).toMatch(/^\/.+\/$/)
    }
  })
  it('keywords really begin with the grapheme (x is taught at the end of words)', () => {
    for (const g of GRAPHEMES) {
      for (const k of g.keywords) {
        if (g.g === 'x') expect(k.endsWith('x')).toBe(true)
        else if (g.g === 'ck' || g.g === 'ng') expect(k.endsWith(g.g)).toBe(true)
        else expect(k.startsWith(g.g), `${g.g} → ${k}`).toBe(true)
      }
    }
  })
  it('never asks speech to say isolated sounds like "tuh" or "sss"', () => {
    for (const g of GRAPHEMES) expect(speakableKeyword(g.g)).toMatch(/^[a-z-]{2,}$/)
  })
})

describe('Pictures', () => {
  it('each picture word starts with its recorded first sound', () => {
    for (const p of PICTURES) {
      if (p.first === 'e-long') continue
      expect(p.word.startsWith(p.first), p.word).toBe(true)
    }
  })
  it('rhyme pairs really rhyme and exist', () => {
    for (const [a, b] of RHYME_PAIRS) {
      expect(pictureByWord.get(a)).toBeTruthy()
      expect(pictureByWord.get(b)).toBeTruthy()
      expect(a.slice(-2)).toBe(b.slice(-2))
    }
  })
})

describe('Lessons are not repetitive', () => {
  it('the four lesson days of a week each teach something different', () => {
    for (const g of GRADES) {
      for (let w = 1; w <= 36; w++) {
        for (const subject of ['literacy', 'math'] as const) {
          const teach = ([0, 1, 2, 3] as LessonDay[]).map((d) => JSON.stringify(coreLessons(w, d, g).find((l) => l.subject === subject)!.guide.teach))
          expect(new Set(teach).size, `${g} week ${w} ${subject}`).toBe(4)
        }
      }
    }
  })
  it('every lesson has a complete teaching guide', () => {
    for (const g of GRADES) {
      for (let w = 1; w <= 36; w++) {
        for (const d of [0, 1, 2, 3] as LessonDay[]) {
          for (const l of coreLessons(w, d, g)) {
            const gd = l.guide
            expect(gd.objective && gd.teach.length && gd.practice.length && gd.check && gd.ifStruggling && gd.ifMastered && gd.minimum, l.id).toBeTruthy()
            expect(gd.materials.length, l.id).toBeGreaterThan(0)
          }
        }
      }
    }
  })
  it('weekly math topics and literacy titles do not repeat within a grade (except review weeks)', () => {
    for (const g of GRADES) {
      const math = MATH[g].filter((m) => !m.review).map((m) => m.title)
      expect(new Set(math).size, g).toBe(math.length)
      const lit = LITERACY[g].filter((l) => !l.review).map((l) => l.title)
      expect(new Set(lit).size, g).toBe(lit.length)
    }
  })
  it('Pre-K is not worksheet-heavy: at most 2 literacy + 2 math pages a week', () => {
    for (let w = 1; w <= 36; w++) {
      const pages = ([0, 1, 2, 3] as LessonDay[]).flatMap((d) => coreLessons(w, d, 'pre-k')).filter((l) => l.subject !== 'bible' && l.worksheet)
      expect(pages.length).toBeLessThanOrEqual(4)
    }
  })
})

describe('Skill catalog', () => {
  it('has unique ids', () => {
    expect(new Set(SKILLS.map((s) => s.id)).size).toBe(SKILLS.length)
  })
  it('covers every grade and track', () => {
    for (const g of GRADES) {
      expect(SKILLS.filter((s) => s.grade === g && s.track === 'math').length).toBeGreaterThan(25)
      expect(SKILLS.filter((s) => s.grade === g && s.track === 'literacy').length).toBeGreaterThan(20)
    }
  })
})
