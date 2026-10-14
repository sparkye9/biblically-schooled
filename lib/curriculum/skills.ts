import { LITERACY } from './literacy'
import { MATH } from './math'
import type { Grade, SkillDef } from './types'

/**
 * Skill catalog derived from the scope & sequence. Progress is tracked per
 * child per skill (see store), never inferred from worksheets alone.
 */

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export function literacySkillId(grade: Grade, week: number) {
  return `${grade}-lit-w${week}`
}
export function mathSkillId(grade: Grade, week: number) {
  return `${grade}-math-w${week}`
}
export function hfwSkillId(grade: Grade, word: string) {
  return `${grade}-hfw-${slug(word)}`
}

function build(): SkillDef[] {
  const out: SkillDef[] = []
  for (const grade of ['pre-k', 'k', '1st'] as Grade[]) {
    for (const l of LITERACY[grade]) {
      if (l.review) continue
      out.push({
        id: literacySkillId(grade, l.week),
        grade,
        track: 'literacy',
        name: l.title,
        week: l.week,
        strand: grade === 'pre-k' ? 'Alphabet & phonological awareness' : 'Phonics & decoding',
      })
      for (const w of l.hfw) {
        // a word reviewed in a later week keeps the week it was first taught
        if (w === 'review' || out.some((s) => s.id === hfwSkillId(grade, w))) continue
        out.push({
          id: hfwSkillId(grade, w),
          grade,
          track: 'literacy',
          name: `Sight word: ${w}`,
          week: l.week,
          strand: 'High-frequency words',
        })
      }
    }
    for (const m of MATH[grade]) {
      if (m.review) continue
      out.push({
        id: mathSkillId(grade, m.week),
        grade,
        track: 'math',
        name: m.title,
        week: m.week,
        strand: m.strand,
      })
    }
  }
  return out
}

export const SKILLS: SkillDef[] = build()
export const skillById = new Map(SKILLS.map((s) => [s.id, s]))

export function skillsForGrade(grade: Grade): SkillDef[] {
  return SKILLS.filter((s) => s.grade === grade)
}

/** Skills a week introduces (new) for a grade. */
export function skillsIntroducedIn(grade: Grade, week: number): SkillDef[] {
  return SKILLS.filter((s) => s.grade === grade && s.week === week)
}
