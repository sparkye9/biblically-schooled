import { PICTURES } from '../curriculum/pictures'
import { contentHash } from './index'
import { COUNT_ICONS, checkExpr } from './math-gen'
import { COIN_VALUE, type Block, type WorksheetSpec } from './types'

/**
 * Worksheet quality control. Runs in tests (every worksheet of the year) and in
 * the Print Center (each page before it is offered). A worksheet with an
 * `error` issue is never printed.
 */

export interface Issue {
  level: 'error' | 'warning'
  message: string
}

/** Every icon a worksheet may draw. The renderer's icon map must cover all of these (enforced by tests). */
export const WORKSHEET_ICONS = new Set<string>([
  ...PICTURES.map((p) => p.icon),
  ...COUNT_ICONS,
  'Moon', 'Truck', 'House', 'Car', 'Anchor', 'Flower', 'Bus', 'Cookie', 'Mountain', 'Bird', 'Feather', 'Leaf', 'Apple',
  'Pencil', 'Carrot', 'Fish', 'Ruler', 'Banana', 'Cherry', 'Grape', 'Cat', 'Dog', 'Rabbit', 'Turtle', 'Snail',
  'Pizza', 'Sandwich', 'Train', 'Ship', 'Bike', 'Rocket', 'Book',
])

/** Rough height budget in "rows" for one printed page. */
const PAGE_ROWS = 24
const ROWS: Partial<Record<Block['type'], (b: any) => number>> = {
  trace: (b) => b.rows.length * (b.size === 'xl' ? 3 : b.size === 'lg' ? 2.2 : 1.6) + 1,
  lines: (b) => b.count * 1.4 + 1,
  draw: (b) => (b.height === 'lg' ? 9 : b.height === 'md' ? 6 : 4),
  'letter-grid': () => 7,
  match: (b) => b.left.length * 2.2,
  'picture-choice': (b) => b.items.length * 2.6 + 1,
  'picture-write': (b) => Math.ceil(b.items.length / 2) * 4.5 + 1,
  count: (b) => Math.ceil(b.items.length / 2) * 5,
  'shape-find': () => 12,
  'shape-table': (b) => b.rows.length * 2.6 + 1,
  pattern: (b) => b.rows.length * 3.4,
  'compare-groups': (b) => b.items.length * 3.6,
  'compare-numbers': (b) => Math.ceil(b.items.length / 2) * 2.2,
  'size-compare': (b) => b.items.length * 4,
  'ten-frame': (b) => Math.ceil(b.items.length / 2) * 3.4,
  'number-bond': (b) => Math.ceil(b.items.length / 3) * 5,
  'picture-equation': (b) => b.items.length * 4.2,
  equations: (b) => Math.ceil(b.items.length / b.columns) * 2.2,
  'true-false': (b) => b.items.length * 2,
  'fact-family': (b) => b.items.length * 6.5,
  'word-problems': (b) => b.items.length * (b.showPictures ? 6.5 : 5),
  'number-line': (b) => b.items.length * 4,
  'base-ten': (b) => Math.ceil(b.items.length / 2) * 6,
  'ten-more-less': (b) => b.items.length * 1.8 + 1.5,
  'hundred-chart': () => 12,
  'skip-count': (b) => b.rows.length * 2.4,
  clocks: (b) => Math.ceil(b.items.length / 3) * 7,
  coins: (b) => b.items.length * 4,
  measure: (b) => b.items.length * 4,
  graph: (b) => b.categories.length * 2.6 + b.questions.length * 2 + 1,
  fractions: (b) => Math.ceil(b.items.length / 3) * 7,
  sort: (b) => 3 + Math.ceil(b.items.length / 4) * (b.cut ? 7 : 4),
  ordinal: (b) => 5 + b.prompts.length * 1.4,
  'one-more': (b) => Math.ceil(b.items.length / 2) * 4.5,
  'word-list': (b) => Math.ceil(b.words.length / 3) * 2.2 + 1,
  'word-sort': (b) => Math.ceil(b.words.length / 2) * 1.8 + 3,
  sentences: (b) => b.items.length * 2.8 + 1,
  passage: (b) => Math.ceil(b.text.length / 70) * 1.4 + b.questions.length * 3 + 2,
  verse: (b) => Math.ceil(b.text.length / 40) * 2.4 + 1.5,
  talk: (b) => b.questions.length * 1.2 + 1,
  feelings: (b) => b.prompts.length * 4,
  syllables: (b) => b.items.length * 2.8,
}

export function estimateRows(spec: WorksheetSpec): number {
  return spec.blocks.reduce((sum, b) => sum + (ROWS[b.type]?.(b) ?? 3), 0)
}

const MAX_NUMBER: Record<string, number> = { 'pre-k': 10, k: 100, '1st': 120 }

function numbersIn(b: Block): number[] {
  switch (b.type) {
    case 'count':
      return b.items.map((i) => i.count)
    case 'equations':
      return b.items.flatMap((i) => [...(i.terms.filter((t) => t !== null) as number[]), i.answer])
    case 'compare-numbers':
      return b.items.flatMap((i) => [i.left, i.right])
    case 'hundred-chart':
      return [b.start + b.count - 1]
    case 'skip-count':
      return b.rows.flatMap((r) => r.values)
    default:
      return []
  }
}

export function validateWorksheet(spec: WorksheetSpec): Issue[] {
  const issues: Issue[] = []
  const err = (message: string) => issues.push({ level: 'error', message })
  const warn = (message: string) => issues.push({ level: 'warning', message })

  if (!spec.title.trim()) err('Missing title')
  if (!spec.instructions.trim()) err('Missing instructions')
  if (!spec.objective.trim()) err('Missing skill objective')
  if (spec.instructions.length > 180) warn('Instructions are long for young children')
  if (!spec.blocks.length) err('Worksheet has no content')
  if (!spec.answerKey.length) err('Missing answer key')

  const rows = estimateRows(spec)
  if (rows > PAGE_ROWS) err(`Content may not fit on one page (${rows.toFixed(1)} of ${PAGE_ROWS} rows)`)

  const icon = (name: string, where: string) => {
    if (!WORKSHEET_ICONS.has(name)) err(`Missing picture "${name}" in ${where}`)
  }

  for (const b of spec.blocks) {
    for (const n of numbersIn(b)) {
      if (n > MAX_NUMBER[spec.grade] && !(spec.grade === 'k' && b.type === 'hundred-chart')) err(`Number ${n} is above the ${spec.grade} range`)
      if (n < 0) err(`Negative number ${n}`)
    }
    switch (b.type) {
      case 'count':
        b.items.forEach((it, i) => {
          icon(it.icon, `count item ${i + 1}`)
          if (it.count > 20) err('Too many pictures to draw clearly')
          if (it.choices) {
            if (new Set(it.choices).size !== it.choices.length) err(`Duplicate answer choices in item ${i + 1}`)
            if (!it.choices.includes(it.count)) err(`Correct answer missing from choices in item ${i + 1}`)
          }
        })
        break
      case 'picture-choice':
        if (!b.items.length) err('Picture choice has no items')
        b.items.forEach((it, i) => {
          icon(it.picture, `picture-choice ${i + 1}`)
          if (new Set(it.choices).size !== it.choices.length) err(`Duplicate choices in item ${i + 1}`)
          if (!it.choices.includes(it.answer)) err(`Answer missing from choices in item ${i + 1}`)
          const pic = PICTURES.find((p) => p.icon === it.picture)
          if (pic && it.choices.length > 1 && pic.first !== it.answer) err(`Picture ${pic.word} does not start with ${it.answer}`)
        })
        break
      case 'picture-write':
      case 'syllables':
        b.items.forEach((it, i) => icon(it.picture, `${b.type} ${i + 1}`))
        break
      case 'sort':
        b.items.forEach((it, i) => icon(it.picture, `sort ${i + 1}`))
        if (b.columns.some((c) => !b.items.some((i) => b.columns[0] === c ? i.column === 0 : i.column === 1))) warn('A sort column has no pictures')
        break
      case 'match':
        ;[...b.left, ...b.right].forEach((c, i) => c.picture && icon(c.picture, `match ${i + 1}`))
        if (b.left.length !== b.right.length) err('Match columns have different lengths')
        break
      case 'pattern':
        b.rows.forEach((row, i) => {
          row.seq.forEach((s) => icon(s, `pattern ${i + 1}`))
          if (!row.choices.includes(row.answer)) err(`Pattern ${i + 1} answer missing from choices`)
          if (new Set(row.choices).size !== row.choices.length) err(`Pattern ${i + 1} has duplicate choices`)
        })
        break
      case 'compare-groups':
        b.items.forEach((it, i) => {
          if (it.left === it.right) err(`Compare item ${i + 1} has equal groups`)
          icon(it.icon, `compare ${i + 1}`)
        })
        break
      case 'equations':
        b.items.forEach((it, i) => {
          const nums = it.terms
          const blank = nums.indexOf(null)
          const filled = nums.map((n, j) => (j === blank ? it.answer : (n as number)))
          const eq = it.ops.indexOf('=')
          let leftVal = filled[0]
          for (let j = 0; j < eq; j++) leftVal = it.ops[j] === '+' ? leftVal + filled[j + 1] : leftVal - filled[j + 1]
          if (leftVal !== filled[eq + 1]) err(`Equation ${i + 1} answer is wrong`)
          if (blank < 0) err(`Equation ${i + 1} has no blank`)
        })
        if (new Set(b.items.map((i) => JSON.stringify([i.terms, i.ops]))).size !== b.items.length) err('Duplicate equations on one page')
        break
      case 'picture-equation':
        b.items.forEach((it, i) => {
          if (it.op === '-' && it.b > it.a) err(`Subtraction ${i + 1} goes below zero`)
          icon(it.icon, `picture equation ${i + 1}`)
        })
        break
      case 'number-bond':
        b.items.forEach((it, i) => it.a + it.b !== it.whole && err(`Number bond ${i + 1} parts don't make the whole`))
        break
      case 'true-false':
        b.items.forEach((it, i) => {
          const sides = [it.left, it.right].map((e) => (e.op === '-' ? e.a - (e.b ?? 0) : e.a + (e.b ?? 0)))
          if (sides.some((v) => v < 0)) err(`True/false ${i + 1} has a negative side`)
        })
        if (b.items.every((it) => checkExpr(it.left, it.right)) || b.items.every((it) => !checkExpr(it.left, it.right))) {
          warn('True/false page has only one kind of answer')
        }
        break
      case 'word-problems':
        b.items.forEach((it, i) => {
          const expect = it.op === '+' ? it.a + it.b : it.a - it.b
          if (expect !== it.answer) err(`Word problem ${i + 1} answer is wrong`)
          if (expect < 0) err(`Word problem ${i + 1} is negative`)
          icon(it.icon, `word problem ${i + 1}`)
        })
        break
      case 'coins':
        b.items.forEach((it, i) => {
          if (!it.coins.length) err(`Coin set ${i + 1} is empty`)
          const total = it.coins.reduce((s, c) => s + COIN_VALUE[c], 0)
          if (total > 100) err(`Coin total ${total}¢ is too large`)
        })
        break
      case 'clocks':
        b.items.forEach((c, i) => (c.h < 1 || c.h > 12) && err(`Clock ${i + 1} hour out of range`))
        break
      case 'graph':
        b.categories.forEach((c) => icon(c.icon, 'graph'))
        if (new Set(b.categories.map((c) => c.count)).size !== b.categories.length) warn('Graph has a tie, which makes "most" ambiguous')
        break
      case 'passage': {
        const words = b.text.split(/\s+/).length
        const limit = spec.grade === '1st' ? 110 : 70
        if (words > limit) err(`Passage is ${words} words (limit ${limit} for ${spec.grade})`)
        if (!b.questions.length) err('Passage has no questions')
        break
      }
      case 'verse':
        if (!b.text.trim() || !b.ref.trim()) err('Memory verse missing')
        break
      case 'size-compare':
        b.items.forEach((it) => {
          icon(it.a.icon, 'size compare')
          icon(it.b.icon, 'size compare')
        })
        break
      case 'measure':
        b.items.forEach((it) => icon(it.icon, 'measure'))
        break
      case 'one-more':
        b.items.forEach((it) => icon(it.icon, 'one more'))
        break
      case 'ordinal':
        b.icons.forEach((n) => icon(n, 'ordinal'))
        break
    }
  }
  return issues
}

export interface DuplicateGroup {
  hash: string
  ids: string[]
}

/** Exact-content duplicates within the same grade and subject (Bible pages excluded by design). */
export function findDuplicates(specs: WorksheetSpec[]): DuplicateGroup[] {
  const groups = new Map<string, string[]>()
  for (const s of specs) {
    if (s.subject === 'bible' || s.personalized) continue
    const key = `${s.grade}|${contentHash(s)}`
    groups.set(key, [...(groups.get(key) ?? []), s.id])
  }
  return [...groups.entries()].filter(([, ids]) => ids.length > 1).map(([hash, ids]) => ({ hash, ids }))
}
