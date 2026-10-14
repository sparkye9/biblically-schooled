import { getBibleWeek } from '../curriculum/bible'
import { literacyLesson, mathLesson, bibleLesson, type WorksheetSlot } from '../curriculum/lessons'
import { getLiteracyWeek } from '../curriculum/literacy'
import { getMathWeek, type MathGen } from '../curriculum/math'
import type { CoreSubject, Grade, LessonDay } from '../curriculum/types'
import { bibleBlocks, literacyBlocks } from './literacy-gen'
import { mathBlocks, type GenOut } from './math-gen'
import { hashString, rng } from './rng'
import type { WorksheetSpec } from './types'

/**
 * Worksheet registry. All worksheets for the year are generated together in a
 * fixed order so the result is deterministic AND duplicate-free: if a page's
 * content matches one already generated for the same grade, it is regenerated
 * with the next seed. (The old PDFs had 288 duplicate pages.)
 */

const GRADES: Grade[] = ['pre-k', 'k', '1st']
const SUBJECTS: CoreSubject[] = ['bible', 'literacy', 'math']
const DAYS: LessonDay[] = [0, 1, 2, 3]

function lessonFor(week: number, day: LessonDay, grade: Grade, subject: CoreSubject) {
  return subject === 'bible' ? bibleLesson(week, day, grade) : subject === 'literacy' ? literacyLesson(week, day, grade) : mathLesson(week, day, grade)
}

/** Content fingerprint used for duplicate detection (ignores titles/headers). */
export function contentHash(spec: Pick<WorksheetSpec, 'blocks'>): string {
  return hashString(JSON.stringify(spec.blocks)).toString(36)
}

function generate(slot: WorksheetSlot, attempt: number): WorksheetSpec {
  const { week, day, grade, subject } = slot
  const r = rng(`${slot.id}#${attempt}`)
  const variant = day + attempt
  let out: GenOut
  let title: string
  let skill: string
  let objective: string
  if (subject === 'math') {
    const t = getMathWeek(grade, week)
    let gen: MathGen = t.gen
    if (day === 3 && week > 1 && (attempt + week) % 2 === 1) {
      // Review day alternates in last week's topic (spiral review).
      gen = getMathWeek(grade, week - 1).gen
    } else if (day === 2 && t.gen.kind === 'facts' && grade !== 'pre-k') {
      // Apply day turns fact practice into story problems.
      gen = { kind: 'word-problems', op: t.gen.op, max: Math.min(t.gen.max, grade === 'k' ? 10 : 20) }
    }
    out = mathBlocks(gen, r, variant, grade)
    title = day === 3 ? `Review: ${t.title}` : t.title
    skill = t.strand
    objective = t.objective
  } else if (subject === 'literacy') {
    const lw = getLiteracyWeek(grade, week)
    out = literacyBlocks(grade, week, day, r)
    title = lw.title
    skill = lw.pattern
    objective = literacyLesson(week, day, grade).guide.objective
  } else {
    const b = getBibleWeek(week)
    out = bibleBlocks(grade, week)
    title = b.title
    skill = 'Bible & memory verse'
    objective = b.objective
  }
  return {
    id: slot.id,
    week,
    day,
    grade,
    subject,
    title,
    skill,
    objective,
    instructions: out.instructions,
    blocks: out.blocks,
    answerKey: out.answers,
    activity: out.activity,
    cutAndPaste: out.cutAndPaste,
    personalized: JSON.stringify(out.blocks).includes('{{NAME}}'),
  }
}

let registry: Map<string, WorksheetSpec> | null = null

export function allWorksheets(): Map<string, WorksheetSpec> {
  if (registry) return registry
  const map = new Map<string, WorksheetSpec>()
  const seen = new Map<string, string>() // hash → id, per grade+subject
  for (const grade of GRADES) {
    for (let week = 1; week <= 36; week++) {
      for (const day of DAYS) {
        for (const subject of SUBJECTS) {
          const slot = lessonFor(week, day, grade, subject).worksheet
          if (!slot) continue
          let spec = generate(slot, 0)
          // Bible pages are intentionally the same layout each week with new content.
          if (subject !== 'bible' && !spec.personalized) {
            for (let attempt = 1; attempt < 8 && seen.has(`${grade}|${contentHash(spec)}`); attempt++) {
              spec = generate(slot, attempt)
            }
          }
          seen.set(`${grade}|${contentHash(spec)}`, spec.id)
          map.set(spec.id, spec)
        }
      }
    }
  }
  registry = map
  return map
}

export function getWorksheet(id: string): WorksheetSpec | undefined {
  return allWorksheets().get(id)
}

export function worksheetsForWeek(week: number, grade: Grade, subjects: CoreSubject[] = SUBJECTS): WorksheetSpec[] {
  const out: WorksheetSpec[] = []
  for (const day of DAYS) {
    for (const subject of subjects) {
      const slot = lessonFor(week, day, grade, subject).worksheet
      const ws = slot && getWorksheet(slot.id)
      if (ws) out.push(ws)
    }
  }
  return out
}
