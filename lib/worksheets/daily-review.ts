import { textWidth } from '../curriculum/handwriting-glyphs'
import { getHandwritingWeek } from '../curriculum/handwriting'
import { LITERACY, getLiteracyWeek, graphemesTaughtThrough } from '../curriculum/literacy'
import type { ShapeName } from '../curriculum/math'
import { PICTURES, picturesStartingWith, type PictureWord } from '../curriculum/pictures'
import type { Grade } from '../curriculum/types'
import { COUNT_ICONS } from './math-gen'
import { hashString, rng, type Rng } from './rng'
import { COIN_VALUE, type Coin, type MixSection, type WorksheetSpec } from './types'

/**
 * Daily Review: one page of mixed skills per child per day — reading,
 * writing, math, money, time, and handwriting in short numbered sections.
 *
 * 50 sheets per grade, in two levels:
 *   regular   — review of what has been taught so far
 *   challenge — the same kinds of tasks, slightly harder, plus one stretch
 *
 * Sheet n reviews the curriculum up to week ⌈n × 36 / 50⌉, so sheets grow
 * through the year with the child and only use letters, sight words, and
 * math that the curriculum has already introduced.
 */

export const REVIEW_SHEETS = 50
export type ReviewLevel = 'regular' | 'challenge'

/** Curriculum week a sheet reviews. */
export const weekForSheet = (n: number) => Math.min(36, Math.max(1, Math.ceil((n * 36) / REVIEW_SHEETS)))

/** The sheet that matches a place in the curriculum (lesson index 0–143). */
export const sheetForIndex = (index: number) => Math.min(REVIEW_SHEETS, Math.max(1, Math.floor((index * REVIEW_SHEETS) / 144) + 1))

// Pictures that are clear for young children (no magic items).
const PICS = PICTURES.filter((p) => p.word !== 'wand')
const usable = (p: PictureWord) => PICS.includes(p)
const SHAPES: ShapeName[] = ['circle', 'square', 'triangle', 'rectangle', 'hexagon', 'oval']

function hfwThrough(grade: Grade, week: number): string[] {
  const out: string[] = []
  for (const l of LITERACY[grade].slice(0, week)) for (const w of l.hfw) if (w !== 'review' && !out.includes(w) && /^[a-zA-Z]+$/.test(w)) out.push(w)
  return out
}

function lettersThrough(grade: Grade, week: number): string[] {
  const t = graphemesTaughtThrough(grade, week).filter((g) => g.length === 1)
  return t.length >= 3 ? t : ['m', 's', 'a', 't']
}

const sec = (title: string, directions: string, span: 1 | 2, body: MixSection['body']): MixSection => ({ title, directions, span, body })

// ───────────────────────────── building blocks ─────────────────────────────

const sizeFor = (grade: Grade) => (grade === 'pre-k' ? 'lg' : 'md') as 'lg' | 'md'

function traceLetters(grade: Grade, week: number, challenge: boolean): MixSection {
  const hw = getHandwritingWeek(grade === '1st' ? 'k' : grade, week)
  const letters = hw.letters.length ? hw.letters : hw.review.length ? hw.review : ['a', 'b']
  if (challenge) {
    const word = PICS.filter((p) => p.cvc && [...p.word].every((c) => lettersThrough(grade, week).includes(c)))[week % 3]?.word ?? 'cat'
    const lower = letters.find((l) => l === l.toLowerCase()) ?? 'a'
    return sec('Write It', 'Look at each one. Write it yourself in the space.', 2, { kind: 'trace', text: `${lower} ${word}`, mode: 'copy', size: sizeFor(grade) })
  }
  const text = letters.slice(0, 2).map((l) => `${l} ${l}`).join('  ')
  return sec('Trace', 'Start at the green dot.', 2, { kind: 'trace', text, mode: 'guided', size: sizeFor(grade) })
}

function traceNumbers(grade: Grade, week: number, challenge: boolean): MixSection {
  const nums = getHandwritingWeek(grade === '1st' ? 'k' : grade, week).numbers
  const text = challenge || nums.length > 1 || nums[0].length > 1 ? nums.join('  ') : `${nums[0]} ${nums[0]}`
  return sec(challenge ? 'Write the Numbers' : 'Trace the Numbers', challenge ? 'Copy each number.' : 'Start at the green dot.', 1, { kind: 'trace', text, mode: challenge ? 'copy' : 'trace', size: sizeFor(grade) })
}

function letterFind(r: Rng, grade: Grade, week: number, challenge: boolean): MixSection {
  const pool = lettersThrough(grade, week)
  const target = getLiteracyWeek(grade, week).graphemes.find((g) => g.length === 1) ?? r.pick(pool)
  const others = 'abcdefghijklmnopqrstuvwxyz'.split('').filter((c) => c !== target)
  const near: Record<string, string> = { b: 'd', d: 'b', p: 'q', q: 'p', m: 'n', n: 'm', u: 'n', w: 'v', i: 'l', l: 'i' }
  const k = challenge ? 4 : 3
  const letters = r.shuffle([
    ...Array.from({ length: k }, (_, i) => (i % 2 ? target : target.toUpperCase())),
    ...Array.from({ length: (challenge ? 12 : 10) - k }, (_, i) => {
      const o = challenge && near[target] && i % 2 === 0 ? near[target] : r.pick(others)
      return challenge && r.next() < 0.5 ? o.toUpperCase() : o
    }),
  ])
  return sec('Find the Letter', `Circle every ${target.toUpperCase()} and ${target}.`, 1, { kind: 'letter-find', target, letters })
}

function firstSound(r: Rng, grade: Grade, week: number, challenge: boolean): MixSection {
  const pool = lettersThrough(grade, week).filter((l) => picturesStartingWith(l).some(usable))
  const n = challenge ? 3 : 2
  const targets = r.sample(pool, Math.min(n, pool.length))
  const items = targets.map((t) => {
    const pic = r.pick(picturesStartingWith(t).filter(usable))
    const wrong = r.sample(pool.filter((x) => x !== t && !(['c', 'k'].includes(x) && ['c', 'k'].includes(t))), challenge ? 2 : 1)
    return { picture: pic.icon, choices: r.shuffle([t, ...wrong]), answer: t }
  })
  return sec('First Sound', 'Say the picture. Circle the letter it starts with.', 1, { kind: 'first-sound', items })
}

function count(r: Rng, max: number, n: number): MixSection {
  const counts: number[] = []
  while (counts.length < n) {
    const c = r.int(Math.max(1, Math.floor(max / 3)), max)
    if (!counts.includes(c) || counts.length >= max) counts.push(c)
  }
  const icons = r.sample(COUNT_ICONS, n)
  return sec('Count and Write', 'Count. Write how many.', n > 3 ? 2 : 1, { kind: 'count', items: counts.map((c, i) => ({ icon: icons[i], count: c })) })
}

function next(r: Rng, max: number, step: number, rows: number, backward = false): MixSection {
  const out: { seq: number[]; answer: number }[] = []
  let guard = 0
  while (out.length < rows && guard++ < 50) {
    const lenSeq = 3
    const startMax = Math.max(backward ? step * lenSeq + 1 : 1, Math.floor((max - step * lenSeq) / step))
    const start = backward ? step * r.int(lenSeq, Math.max(lenSeq, Math.floor(max / step))) : step === 1 ? r.int(0, Math.max(0, max - lenSeq - 1)) : step * r.int(0, Math.max(0, startMax))
    const seq = Array.from({ length: lenSeq }, (_, i) => (backward ? start - i * step : start + i * step))
    const answer = backward ? start - lenSeq * step : start + lenSeq * step
    if (answer < 0 || answer > max || out.some((o) => o.seq[0] === seq[0])) continue
    out.push({ seq, answer })
  }
  const how = step === 1 ? (backward ? 'Count back.' : 'Count on.') : `Count ${backward ? 'back ' : ''}by ${step}s.`
  return sec('What Comes Next?', `${how} Write the next number.`, 1, { kind: 'next', rows: out })
}

function equations(r: Rng, n: number, opts: { max: number; ops: ('+' | '-')[]; missing?: boolean; twoDigit?: boolean }): MixSection {
  const items: { a: number; b: number; op: '+' | '-'; answer: number; blank: 'answer' | 'b' }[] = []
  let guard = 0
  while (items.length < n && guard++ < 300) {
    const op = opts.ops[items.length % opts.ops.length]
    let a: number, b: number
    if (opts.twoDigit && items.length % 2 === 1) {
      a = r.int(11, 79)
      b = r.int(1, 9)
      if (op === '-' && a % 10 < b) continue
    } else if (op === '+') {
      // no "+ 0" and no tiny sums: aim for the upper half of the range
      const sum = r.int(Math.max(3, Math.ceil(opts.max / 2)), opts.max)
      a = r.int(1, sum - 1)
      b = sum - a
    } else {
      a = r.int(Math.max(3, Math.ceil(opts.max / 2)), opts.max)
      b = r.int(1, a - 1)
    }
    const answer = op === '+' ? a + b : a - b
    const blank = opts.missing && op === '+' && items.length % 3 === 2 ? 'b' : 'answer'
    if (items.some((x) => x.a === a && x.b === b && x.op === op)) continue
    items.push({ a, b, op, answer, blank })
  }
  const what = opts.ops.length > 1 ? 'Add or subtract.' : opts.ops[0] === '+' ? 'Add.' : 'Subtract.'
  return sec(opts.ops.length > 1 ? 'Add or Subtract' : opts.ops[0] === '+' ? 'Add' : 'Subtract', opts.missing ? `${what} Find the missing number.` : what, n > 4 ? 2 : 1, { kind: 'equations', items })
}

function pictureAdd(r: Rng, max: number): MixSection {
  const items = Array.from({ length: 2 }, (_, i) => {
    const a = r.int(1, max - 1)
    const b = r.int(1, max - a)
    return { icon: COUNT_ICONS[(i * 4 + max + a) % COUNT_ICONS.length], a, b }
  })
  return sec('Put Together', 'Count both groups. How many in all?', 1, { kind: 'picture-add', items })
}

function moreFewer(r: Rng, max: number): MixSection {
  const items = Array.from({ length: 2 }, (_, i) => {
    const left = r.int(1, max)
    let right = r.int(1, max)
    if (right === left) right = left === max ? left - 1 : left + 1
    return { icon: COUNT_ICONS[(i * 3 + left) % COUNT_ICONS.length], left, right }
  })
  return sec('Which Has More?', 'Circle the group that has more.', 1, { kind: 'more-fewer', items })
}

function coins(r: Rng, kinds: Coin[], n: number, maxTotal: number, span: 1 | 2 = 2): MixSection {
  const items: { coins: Coin[] }[] = []
  let guard = 0
  while (items.length < n && guard++ < 200) {
    const k = r.int(2, 4)
    const set = Array.from({ length: k }, () => r.pick(kinds)).sort((a, b) => COIN_VALUE[b] - COIN_VALUE[a])
    const total = set.reduce((s, c) => s + COIN_VALUE[c], 0)
    if (total > maxTotal || items.some((x) => x.coins.join() === set.join())) continue
    items.push({ coins: set })
  }
  return sec('Money', 'Count the coins. Write how many cents.', span, { kind: 'coins', items })
}

function clocks(r: Rng, half: boolean, n: number, span: 1 | 2 = 2): MixSection {
  const items: { h: number; m: 0 | 30 }[] = []
  while (items.length < n) {
    const h = r.int(1, 12)
    const m: 0 | 30 = half && items.length % 2 === 1 ? 30 : 0
    if (!items.some((x) => x.h === h)) items.push({ h, m })
  }
  return sec('Tell Time', 'Write the time on each clock.', span, { kind: 'clocks', items })
}

function match(r: Rng, words: PictureWord[], n: number): MixSection {
  const picked = r.sample(words, Math.min(n, words.length))
  const order = r.shuffle(picked.map((_, i) => i))
  return sec('Read and Match', 'Read the word. Draw a line to its picture.', 1, {
    kind: 'match',
    words: picked.map((p) => p.word),
    pictures: order.map((i) => picked[i].icon),
    pairs: picked.map((_, i) => [i, order.indexOf(i)] as [number, number]),
  })
}

function sightWords(r: Rng, grade: Grade, week: number, n: number, challenge: boolean): MixSection {
  const all = hfwThrough(grade, Math.min(36, week + (challenge ? 2 : 0)))
  const recent = all.slice(-8)
  const words = r.sample(recent.length >= n ? recent : all, Math.min(n, all.length))
  return sec('Sight Words', challenge ? 'Read each word. Write it, then use one in a sentence out loud.' : 'Read each word. Write it on the line.', 1, { kind: 'sight-words', words })
}

function spell(r: Rng, grade: Grade, week: number, n: number, challenge: boolean): MixSection {
  const allowed = new Set(lettersThrough(grade, week))
  let pool = PICS.filter((p) => p.cvc && [...p.word].every((c) => allowed.has(c)))
  if (challenge || pool.length < n) pool = PICS.filter((p) => (challenge ? p.word.length >= 4 && p.word.length <= 5 && /^[a-z]+$/.test(p.word) : p.cvc))
  const items = r.sample(pool, n).map((p) => ({ picture: p.icon, word: p.word }))
  return sec('Spell It', 'Say the picture. Write one letter in each box.', 1, { kind: 'spell', items })
}

function fillBlank(r: Rng, week: number, n: number, challenge: boolean): MixSection | null {
  const items: { before: string; after: string; choices: string[]; answer: string }[] = []
  const weeks = LITERACY['1st'].slice(0, Math.min(36, week + (challenge ? 3 : 0))).slice(-4)
  for (const lw of r.shuffle(weeks)) {
    for (const s of lw.sentences) {
      if (items.length >= n || s.length > 48) continue
      const tokens = s.split(' ')
      const idx = tokens.findIndex((t) => lw.words.includes(t.replace(/[.!?,]/g, '').toLowerCase()))
      if (idx < 0) continue
      const answer = tokens[idx].replace(/[.!?,]/g, '')
      const punct = tokens[idx].slice(answer.length)
      const wrong = r.sample(lw.words.filter((w) => w !== answer.toLowerCase() && !tokens.some((t) => t.toLowerCase().startsWith(w))), 2)
      if (wrong.length < 2) continue
      items.push({ before: tokens.slice(0, idx).join(' '), after: `${punct}${tokens.slice(idx + 1).length ? ' ' : ''}${tokens.slice(idx + 1).join(' ')}`, choices: r.shuffle([answer.toLowerCase(), ...wrong]), answer: answer.toLowerCase() })
    }
  }
  return items.length ? sec('Finish the Sentence', 'Circle the word that fits. Write it on the line.', 2, { kind: 'fill-blank', items }) : null
}

function compare(r: Rng, max: number, n: number): MixSection {
  const items = Array.from({ length: n }, () => {
    const left = r.int(1, max)
    let right = r.int(1, max)
    if (r.next() < 0.15) right = left
    return { left, right }
  })
  return sec('Compare', 'Write >, <, or = in each circle.', 1, { kind: 'compare', items })
}

function shapes(r: Rng): MixSection {
  const target = r.pick(SHAPES.slice(0, 4))
  const list = r.shuffle([target, target, ...r.sample(SHAPES.filter((s) => s !== target), 4)])
  return sec('Shapes', `Circle each ${target}.`, 1, { kind: 'shapes', target, shapes: list })
}

function tensOnes(r: Rng, n: number): MixSection {
  const items = Array.from({ length: n }, () => ({ tens: r.int(1, 9), ones: r.int(0, 9) }))
  return sec('Tens and Ones', 'Count the tens and ones. Write the number.', 1, { kind: 'tens-ones', items })
}

// ───────────────────────────── sheets by grade ─────────────────────────────

function prekSheet(r: Rng, w: number, c: boolean): MixSection[] {
  const countMax = Math.min(c ? 15 : 10, (c ? 6 : 3) + Math.floor(w / 4))
  return [
    traceLetters('pre-k', w, c),
    letterFind(r, 'pre-k', w, c),
    firstSound(r, 'pre-k', w, c),
    count(r, countMax, 3),
    traceNumbers('pre-k', w, c),
    c ? (w >= 10 ? pictureAdd(r, w >= 19 ? 5 : 4) : moreFewer(r, 6)) : w % 2 ? shapes(r) : moreFewer(r, Math.min(10, 4 + Math.floor(w / 6))),
    c ? next(r, Math.min(20, 8 + w), 1, 2) : next(r, Math.min(10, 4 + Math.floor(w / 4)), 1, 2),
  ]
}

function kSheet(r: Rng, w: number, c: boolean): MixSection[] {
  const out: MixSection[] = []
  out.push(w >= 10 || c ? match(r, PICS.filter((p) => (c ? p.word.length <= 5 : p.cvc) && /^[a-z]+$/.test(p.word)), c ? 4 : 3) : firstSound(r, 'k', w, c))
  out.push(sightWords(r, 'k', w, 3, c))
  out.push(spell(r, 'k', w, 2, c))
  out.push(count(r, Math.min(c ? 20 : 12, (c ? 10 : 5) + Math.floor(w / 3)), 2))
  out.push(c ? next(r, w >= 22 ? 100 : 30, w >= 22 ? 10 : 1, 3) : next(r, Math.min(20, 8 + w), 1, 3))
  if (c) out.push(equations(r, 4, { max: w >= 19 ? 10 : 5, ops: w >= 14 ? ['+', '-'] : ['+'] }))
  else out.push(w >= 13 ? equations(r, 4, { max: w >= 19 ? 10 : 5, ops: w >= 14 ? ['+', '-'] : ['+'] }) : compare(r, 10, 3))
  out.push(c ? (w >= 20 ? coins(r, ['penny', 'nickel'], 3, 20) : clocks(r, false, 3)) : traceLetters('k', w, false))
  return out
}

function firstSheet(r: Rng, w: number, c: boolean): MixSection[] {
  const pics = PICS.filter((p) => /^[a-z]+$/.test(p.word) && (c ? p.word.length >= 4 : p.word.length <= 5))
  const out: MixSection[] = [match(r, pics, 3), sightWords(r, '1st', w, 3, c)]
  const fb = fillBlank(r, w, 2, c)
  if (fb) out.push(fb)
  out.push(
    c
      ? equations(r, 6, { max: 20, ops: ['+', '-'], missing: true, twoDigit: w >= 14 })
      : equations(r, 6, { max: w >= 10 ? 20 : 10, ops: ['+', '-'] }),
  )
  out.push(c ? next(r, 120, w >= 24 ? 5 : 2, 3, w >= 12) : next(r, 120, w >= 18 ? 10 : 1, 3))
  out.push(c ? (w >= 14 ? tensOnes(r, 2) : compare(r, 50, 3)) : w >= 14 ? compare(r, 99, 3) : compare(r, 20, 3))
  // money and time side by side so the page holds 8 boxes
  out.push(c ? coins(r, w >= 28 ? ['quarter', 'dime', 'nickel', 'penny'] : ['dime', 'nickel', 'penny'], 2, w >= 28 ? 75 : 40, 1) : coins(r, w >= 28 ? ['dime', 'nickel', 'penny'] : ['dime', 'penny'], 2, 40, 1))
  out.push(clocks(r, c || w >= 26, 2, 1))
  return out
}

function answersFor(sections: MixSection[]): string[] {
  return sections.map((s, i) => {
    const b = s.body
    const n = `${i + 1}. ${s.title}:`
    switch (b.kind) {
      case 'trace':
        return `${n} formed from the starting dot`
      case 'letter-find':
        return `${n} ${b.letters.filter((l) => l.toLowerCase() === b.target).length} letters circled`
      case 'first-sound':
        return `${n} ${b.items.map((x) => x.answer).join(', ')}`
      case 'count':
        return `${n} ${b.items.map((x) => x.count).join(', ')}`
      case 'next':
        return `${n} ${b.rows.map((x) => x.answer).join(', ')}`
      case 'equations':
        return `${n} ${b.items.map((x) => (x.blank === 'b' ? x.b : x.answer)).join(', ')}`
      case 'picture-add':
        return `${n} ${b.items.map((x) => x.a + x.b).join(', ')}`
      case 'more-fewer':
        return `${n} ${b.items.map((x) => (x.left > x.right ? 'left' : 'right')).join(', ')}`
      case 'coins':
        return `${n} ${b.items.map((x) => `${x.coins.reduce((t, c) => t + COIN_VALUE[c], 0)}¢`).join(', ')}`
      case 'clocks':
        return `${n} ${b.items.map((x) => `${x.h}:${x.m ? '30' : '00'}`).join(', ')}`
      case 'match':
        return `${n} ${b.words.join(', ')}`
      case 'sight-words':
        return `${n} ${b.words.join(', ')}`
      case 'spell':
        return `${n} ${b.items.map((x) => x.word).join(', ')}`
      case 'fill-blank':
        return `${n} ${b.items.map((x) => x.answer).join(', ')}`
      case 'compare':
        return `${n} ${b.items.map((x) => (x.left > x.right ? '>' : x.left < x.right ? '<' : '=')).join(' ')}`
      case 'shapes':
        return `${n} ${b.shapes.filter((x) => x === b.target).length} ${b.target}s`
      case 'tens-ones':
        return `${n} ${b.items.map((x) => x.tens * 10 + x.ones).join(', ')}`
    }
  })
}

function build(grade: Grade, n: number, level: ReviewLevel, attempt: number): WorksheetSpec {
  const w = weekForSheet(n)
  const challenge = level === 'challenge'
  const r = rng(`review-${grade}-${level}-${n}#${attempt}`)
  const sections = grade === 'pre-k' ? prekSheet(r, w, challenge) : grade === 'k' ? kSheet(r, w, challenge) : firstSheet(r, w, challenge)
  return {
    id: `review-${grade}-${level === 'challenge' ? 'c' : 'r'}${n}`,
    week: 0,
    day: 0,
    grade,
    subject: 'review',
    title: `${challenge ? 'Challenge' : 'Daily Review'} #${n}`,
    skill: 'Mixed review',
    objective: `Mixed review of skills taught through week ${w}${challenge ? ' — a little harder' : ''}.`,
    instructions: challenge ? 'Try your best! Read each box, then do the work. Ask for help if you need it.' : 'Do one box at a time. Read the directions in each box first.',
    blocks: [{ type: 'mixed', sections }],
    answerKey: answersFor(sections),
    activity: challenge ? 'Challenge sheet' : 'Daily review',
  }
}

const cache = new Map<string, WorksheetSpec>()

/** A daily review sheet (1–50) for a grade and level; generated deterministically, no two alike. */
export function reviewSheet(grade: Grade, n: number, level: ReviewLevel): WorksheetSpec {
  const key = `${grade}|${level}`
  if (!cache.has(`${key}|1`)) {
    const seen = new Set<number>()
    for (let i = 1; i <= REVIEW_SHEETS; i++) {
      let spec = build(grade, i, level, 0)
      for (let a = 1; a < 6 && seen.has(hashString(JSON.stringify(spec.blocks))); a++) spec = build(grade, i, level, a)
      seen.add(hashString(JSON.stringify(spec.blocks)))
      cache.set(`${key}|${i}`, spec)
    }
  }
  return cache.get(`${key}|${Math.min(REVIEW_SHEETS, Math.max(1, n))}`)!
}

export function allReviewSheets(): WorksheetSpec[] {
  const out: WorksheetSpec[] = []
  for (const g of ['pre-k', 'k', '1st'] as Grade[]) for (const level of ['regular', 'challenge'] as ReviewLevel[]) for (let n = 1; n <= REVIEW_SHEETS; n++) out.push(reviewSheet(g, n, level))
  return out
}

/** Handwriting rows must fit their box (same scale and padding as the renderer). */
export function traceFits(s: MixSection): boolean {
  if (s.body.kind !== 'trace') return true
  const k = s.body.size === 'lg' ? 0.78 : 0.52
  return textWidth(s.body.text) * k + 30 <= (s.span === 2 ? 720 : 360)
}

