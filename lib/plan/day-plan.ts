import { getBibleWeek, seasonFor, type SeasonalLesson } from '../curriculum/bible'
import { getEnrichment } from '../curriculum/enrichment'
import { adaptLesson } from '../curriculum/adapt'
import { applyFluencyGate, bibleLesson, handwritingLesson, languageLesson, literacyLesson, mathLesson, type DailyLesson } from '../curriculum/lessons'
import { DAY_RHYTHM, type ActivityType, type DayMode, EnrichmentActivity, EnrichmentKind, Grade, LessonDay, LessonSubject } from '../curriculum/types'
import { ENRICHMENT_LABELS, positionOf, type Position } from './schedule'

export interface Learner {
  id: string
  name: string
  grade: Grade
  color: string
  /** Individual adjustments: a different pathway or pace per subject. */
  adjust?: LearnerAdjustments
  /** What the engine adds or adapts for this child. */
  profile?: LearningProfile
  /** Skill ids this child has demonstrated independently (unlocks timed fluency practice). */
  demonstrated?: string[]
}

/**
 * Per-child learning profile. Profiles change what is ADDED (handwriting,
 * language building) and HOW lessons are accessed (supports) — never the
 * grade-level objective. Lowering the level is a separate, explicit choice
 * (LearnerAdjustments).
 */
export interface LearningProfile {
  /** Daily letter and number formation (default on for Pre-K and K). */
  handwriting?: boolean
  /** Daily 10-minute language-building block (receptive and expressive language). */
  languageBuilding?: boolean
  /** Predictable structure, one instruction at a time, visuals, response options, movement breaks, reduced copying. */
  accessSupports?: boolean
}

export interface LearnerAdjustments {
  literacyGrade?: Grade
  mathGrade?: Grade
  /** Weeks behind (negative) or ahead (positive) of the family position. */
  literacyOffset?: number
  mathOffset?: number
}

const clampWeek = (w: number) => Math.min(Math.max(w, 1), 36)

export function lessonsFor(learner: Learner, week: number, day: LessonDay): DailyLesson[] {
  const a = learner.adjust ?? {}
  const p = learner.profile ?? {}
  const done = new Set(learner.demonstrated ?? [])
  const literacyGrade = a.literacyGrade ?? learner.grade
  const lessons: DailyLesson[] = [
    bibleLesson(week, day, learner.grade),
    literacyLesson(clampWeek(week + (a.literacyOffset ?? 0)), day, literacyGrade),
    applyFluencyGate(mathLesson(clampWeek(week + (a.mathOffset ?? 0)), day, a.mathGrade ?? learner.grade), (id) => done.has(id)),
  ]
  const wantsHandwriting = p.handwriting ?? (learner.grade === 'pre-k' || learner.grade === 'k')
  const hw = wantsHandwriting ? handwritingLesson(clampWeek(week + (a.literacyOffset ?? 0)), day, literacyGrade) : null
  if (hw) lessons.push(hw)
  if (p.languageBuilding) lessons.push(languageLesson(week, day, learner.grade, learner.name, literacyGrade))
  return p.accessSupports ? lessons.map((l) => adaptLesson(l, learner.name)) : lessons
}

export type PlanSubject = LessonSubject | 'enrichment' | 'read-aloud'

export interface PlanItem {
  /** Completion key: `${lessonIndex}|${childId}|${subject}` */
  key: string
  subject: PlanSubject
  title: string
  childTask: string
  minutes: number
  required: boolean
  lesson?: DailyLesson
  /** True when a worksheet is part of today's plan in this mode. */
  printToday: boolean
  /** Teaching lines to show for this mode. */
  script: string[]
  /** What kind of learning this is. */
  activity: ActivityType
}

export interface ChildPlan {
  learner: Learner
  items: PlanItem[]
}

export interface DayPlan {
  position: Position
  mode: DayMode
  easy: boolean
  bibleTitle: string
  bibleVerse: { ref: string; text: string; short: string }
  season: SeasonalLesson | null
  /** The day's first enrichment (kept for older screens). */
  enrichment: { kind: EnrichmentKind; label: string; activity: EnrichmentActivity | null } | null
  /** Every enrichment today (e.g. Friday: science and library). */
  enrichments: { kind: EnrichmentKind; label: string; activity: EnrichmentActivity | null }[]
  children: ChildPlan[]
  materials: string[]
  skippable: string[]
  estimate: { teachingMinutes: number; totalMinutes: number }
  rotation: string[]
}

export const MODE_INFO: Record<DayMode, { label: string; target: string; blurb: string }> = {
  full: { label: 'Full Day', target: '60–90 min', blurb: 'Bible, literacy, math, enrichment, read-aloud, and hands-on extras.' },
  standard: { label: 'Standard Day', target: '40–55 min', blurb: 'Bible 10 · Literacy 15 · Math 15 · 5 min handwriting or language where a child’s profile adds it · optional enrichment 10.' },
  minimum: { label: 'Minimum Day', target: '~20 min', blurb: 'Bible 5 · Literacy 7 · Math 8. Short, shared, and still real learning.' },
}

/**
 * Parent-led minutes per subject per grade group. The rest of each lesson is
 * independent practice or play while the parent teaches another group. On a
 * Minimum day literacy and math are taught to everyone together instead.
 */
const LED_MINUTES: Record<Exclude<DayMode, 'minimum'>, number> = { standard: 5, full: 7 }

function enrichmentActivity(kind: EnrichmentKind, week: number, day: LessonDay): EnrichmentActivity | null {
  const e = getEnrichment(week)
  switch (kind) {
    case 'science':
      // Later in the week, science is the follow-up: observe, explain, record.
      if (day >= 2) {
        return {
          title: `Science follow-up: ${e.science.title}`,
          objective: `Explain what we discovered in "${e.science.title}."`,
          materials: ['Nature/science journal or paper', 'Crayons'],
          steps: [
            'Look again at what you made or observed earlier this week (or repeat the quickest part).',
            `Talk: ${e.science.talk}`,
            'Each child explains one discovery: "I noticed… I think it happened because…"',
            'Draw it in the science journal; a grown-up writes the child’s words underneath.',
          ],
          talk: e.science.talk,
        }
      }
      return e.science
    case 'art':
      if (day >= 2) {
        return {
          title: `Art: finish and share — ${e.art.title}`,
          objective: 'Finish the week’s art and explain it to the family.',
          materials: e.art.materials,
          steps: ['Finish or add to the art from earlier this week (or start it if it was skipped).', 'Show-and-tell: each child tells what they made, how, and why they chose it.'],
          talk: e.art.talk,
        }
      }
      return e.art
    case 'social-studies':
      return e.socialStudies
    case 'life-skills':
      return e.lifeSkill
    case 'library':
      return {
        title: 'Library Day',
        objective: 'Choose books and build a love of reading.',
        materials: ['Library card', 'Book bag'],
        steps: [e.library.mission, `Read-aloud tie-in: ${e.socialStudies.title}.`],
        talk: e.socialStudies.talk,
      }
    case 'review':
      return {
        title: `Review + Life Skill: ${e.lifeSkill.title}`,
        objective: e.lifeSkill.objective,
        materials: e.lifeSkill.materials,
        steps: ['Friday review is built into each subject today.', ...e.lifeSkill.steps],
        talk: e.lifeSkill.talk,
      }
  }
}

export interface PlanOptions {
  index: number
  mode: DayMode
  easy: boolean
  learners: Learner[]
  /** Today's enrichment(s) from the weekly schedule. */
  enrichment: EnrichmentKind | EnrichmentKind[] | null
  date: Date
  /** Use the seasonal Bible lesson instead of the unit lesson. */
  useSeasonal?: boolean
  /** Prefix for completion-key subjects (welcome-back review days use 'wb-'). */
  keyPrefix?: string
}

export function buildDayPlan(opts: PlanOptions): DayPlan {
  const position = positionOf(opts.index)
  const { week, day } = position
  const mode: DayMode = opts.easy ? 'minimum' : opts.mode
  const bible = getBibleWeek(week)
  const season = seasonFor(opts.date)

  const kinds: EnrichmentKind[] = mode === 'minimum' || !opts.enrichment ? [] : Array.isArray(opts.enrichment) ? opts.enrichment : [opts.enrichment]
  const enrichments = kinds.map((kind) => ({ kind, label: ENRICHMENT_LABELS[kind], activity: enrichmentActivity(kind, week, day) }))
  const enrichment = enrichments[0] ?? null
  const activity = enrichment?.activity ?? null

  const children: ChildPlan[] = opts.learners.map((learner) => {
    const lessons = lessonsFor(learner, week, day)
    const items: PlanItem[] = lessons.map((lesson) => {
      const useSeason = lesson.subject === 'bible' && opts.useSeasonal && season
      return {
        key: `${position.index}|${learner.id}|${opts.keyPrefix ?? ''}${lesson.subject}`,
        subject: lesson.subject,
        title: useSeason ? season!.title : lesson.title,
        childTask: lesson.childTask,
        minutes: lesson.minutes[mode],
        required: true,
        lesson,
        printToday: !opts.easy && mode !== 'minimum' && lesson.worksheet !== null,
        script:
          mode === 'minimum'
            ? [useSeason ? `Read ${season!.shortReading}. Ask: "${season!.questions[0]}"` : lesson.guide.minimum]
            : lesson.guide.teach,
        activity: lesson.activity,
      }
    })
    // Profile extras with no time in this mode (Minimum) are left out.
    for (let i = items.length - 1; i >= 0; i--) if (items[i].minutes === 0) items.splice(i, 1)
    enrichments.forEach((en, i) => {
      if (!en.activity) return
      items.push({
        key: `${position.index}|${learner.id}|${opts.keyPrefix ?? ''}${i === 0 ? 'enrichment' : `enrichment-${en.kind}`}`,
        subject: 'enrichment',
        title: `${en.label}: ${en.activity.title}`,
        childTask: en.label,
        minutes: mode === 'full' ? 15 : 10,
        required: false,
        printToday: false,
        script: en.activity.steps,
        activity: en.kind === 'science' ? (day >= 2 ? 'discussion' : 'hands-on') : en.kind === 'library' ? 'discussion' : 'hands-on',
      })
    })
    if (mode === 'full') {
      items.push({
        key: `${position.index}|${learner.id}|${opts.keyPrefix ?? ''}read-aloud`,
        subject: 'read-aloud',
        title: 'Read-aloud',
        childTask: 'Story time',
        minutes: 10,
        required: false,
        printToday: false,
        script: ['Read aloud from your current family book for 10–15 minutes.'],
        activity: 'discussion',
      })
    }
    return { learner, items }
  })

  // ---- Materials (deduplicated) ----
  const mats = new Set<string>()
  mats.add('Bible')
  for (const c of children) {
    for (const it of c.items) {
      if (!it.lesson) continue
      if (opts.easy) continue
      for (const m of it.lesson.guide.materials) {
        if (mode === 'minimum' && m === 'Worksheet') continue
        mats.add(m)
      }
    }
  }
  if (!opts.easy) enrichments.forEach((en) => en.activity?.materials.forEach((m) => mats.add(m)))
  if (opts.easy) {
    mats.add('Household objects for counting (spoons, socks, snacks)')
    mats.add('Paper and a pencil or a whiteboard')
  }

  // ---- What can be skipped ----
  const skippable: string[] = []
  for (const en of enrichments) skippable.push(`${en.label} — enrichment is always optional.`)
  if (mode === 'full') skippable.push('Read-aloud can move to bedtime.')
  if (mode !== 'minimum') skippable.push('Worksheets can be done orally on a busy day; the lesson still counts.')
  skippable.push('Optional extensions and challenge activities.')

  // ---- Time estimate: teaching happens in parallel, not added up ----
  const bibleMin = mode === 'minimum' ? 5 : mode === 'standard' ? 10 : 15
  const byGrade = new Map<Grade, ChildPlan>()
  for (const c of children) if (!byGrade.has(c.learner.grade)) byGrade.set(c.learner.grade, c)
  const coreMinutes = (c: ChildPlan, subject: PlanSubject) => c.items.find((i) => i.subject === subject)?.minutes ?? 0
  let teaching: number
  let longestChild = 0
  for (const c of children)
    longestChild = Math.max(longestChild, coreMinutes(c, 'literacy') + coreMinutes(c, 'math') + coreMinutes(c, 'handwriting') + coreMinutes(c, 'language'))
  if (mode === 'minimum') {
    // Shared, leveled activities: everyone does literacy together, then math together.
    teaching = Math.max(...children.map((c) => coreMinutes(c, 'literacy')), 0) + Math.max(...children.map((c) => coreMinutes(c, 'math')), 0)
  } else {
    teaching = byGrade.size * 2 * LED_MINUTES[mode]
  }
  const enrichMin = enrichments.length * (mode === 'full' ? 15 : 10)
  const readMin = mode === 'full' ? 10 : 0
  const total = bibleMin + Math.max(teaching, longestChild) + enrichMin + readMin

  // ---- Rotation: youngest first; others work independently ----
  const groups = [...byGrade.keys()].sort((a, b) => gradeOrder(a) - gradeOrder(b))
  const rotation: string[] = [`Everyone together: Bible — ${bible.title} (${bibleMin} min).`]
  if (mode === 'minimum') {
    rotation.push(`Everyone together: literacy (7 min) — one shared activity, each child at their level.`)
    rotation.push(`Everyone together: math (8 min) — one shared activity with household objects, each child at their level.`)
  } else {
    groups.forEach((g) => {
      const names = children.filter((c) => c.learner.grade === g).map((c) => c.learner.name).join(' & ')
      const others = children
        .filter((c) => c.learner.grade !== g)
        .map((c) => `${c.learner.name}: ${independentTask(c.learner.grade, g, DAY_RHYTHM[day].paper)}`)
      rotation.push(`Teach ${names} (about ${LED_MINUTES[mode as 'standard' | 'full'] * 2} min)${others.length ? ` — meanwhile ${others.join('; ')}` : ''}.`)
    })
  }
  for (const en of enrichments) rotation.push(`Everyone together: ${en.label} (${mode === 'full' ? 15 : 10} min).`)
  if (readMin) rotation.push('Read-aloud to end the day.')

  return {
    position,
    mode,
    easy: opts.easy,
    bibleTitle: opts.useSeasonal && season ? season.title : bible.title,
    bibleVerse: opts.useSeasonal && season ? season.verse : bible.verse,
    season,
    enrichment,
    enrichments,
    children,
    materials: [...mats],
    skippable,
    estimate: { teachingMinutes: bibleMin + teaching, totalMinutes: total },
    rotation,
  }
}

export function gradeOrder(g: Grade) {
  return g === 'pre-k' ? 0 : g === 'k' ? 1 : 2
}

function independentTask(grade: Grade, teaching: Grade, paperDay: boolean): string {
  if (grade === 'pre-k') return paperDay ? 'coloring or a page already modeled' : 'play-dough letters, puzzles, or block building'
  if (!paperDay) return grade === 'k' ? 'letter tiles, pattern blocks, or a quiet book basket' : 'build words with letter tiles or read a familiar book aloud'
  if (grade === 'k') return gradeOrder(teaching) < gradeOrder(grade) ? 'handwriting or a worksheet already taught' : 'quiet book basket or tracing'
  return gradeOrder(teaching) < gradeOrder(grade) ? 'independent worksheet or reading practice' : 'read a familiar book aloud'
}

/** Map any stored grade band onto the three supported pathways. */
export function pathwayFor(gradeBand: string): Grade {
  if (gradeBand === 'pre-k') return 'pre-k'
  if (gradeBand === 'k') return 'k'
  return '1st'
}
