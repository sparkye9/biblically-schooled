import { getLiteracyWeek } from './literacy'
import type { Grade } from './types'
import { GLYPHS, textWidth } from './handwriting-glyphs'

/**
 * Handwriting and number-formation scope for Pre-K and Kindergarten.
 *
 * Letters follow each grade's literacy sequence, so the letter a child writes
 * is the letter they are learning to read that week. Numbers follow their own
 * gentle sequence. Each week moves through the same stages —
 *   guided (dots + arrows) → trace → copy from a model → write independently
 * — and later weeks lean more on copying and independent writing.
 * Kindergarten moves on to words and then short sentences once all letters
 * have been taught.
 */

export type HandwritingGrade = Extract<Grade, 'pre-k' | 'k'>

export interface HandwritingWeek {
  grade: HandwritingGrade
  week: number
  /** New letters this week, uppercase and lowercase, e.g. ['M', 'm']. */
  letters: string[]
  /** Earlier letters to keep practicing. */
  review: string[]
  /** Numerals to form this week, e.g. ['3'] or ['1', '2']. */
  numbers: string[]
  /** K only: words to copy, from the week's reading words. */
  words: string[]
  /** K only: a short sentence to copy (later weeks). */
  sentence?: string
  /** True on name-writing focus weeks. */
  nameFocus: boolean
  fineMotor: string
  /** The handwriting habit to coach this week (from the literacy plan). */
  tip: string
  /** Where the child is in the trace → copy → independent progression. */
  stage: 'guided' | 'copy' | 'independent'
}

const FINE_MOTOR = [
  'Play-dough snakes: roll snakes and shape them into this week’s letters.',
  'Tweezers or tongs: move 10 pom-poms or cereal pieces from one bowl to another.',
  'Tear paper into small pieces and glue them inside a big outline of the letter.',
  'Clothespins: squeeze and clip 10 pins around the rim of a paper plate.',
  'Lacing: thread pasta or beads onto yarn (tape the end to make a needle).',
  'Scissor snips: snip the fringe of a paper strip (cut short lines, not shapes yet).',
  'Sticker lines: peel small stickers and place them on a drawn line, start to finish.',
  'Pencil grip warm-up: "pinch the crumb" — pick up small items with thumb and pointer only.',
  'Water painting: paint letters on a fence or sidewalk with water and a brush.',
  'Shaving cream or salt tray: write this week’s letters and numbers with one finger.',
  'Coin slot: push coins into a slot cut in a box lid.',
  'Rainbow writing: trace one large letter three times in three colors.',
]

const PREK_NUMBERS = (week: number): string[] => {
  if (week <= 20) {
    const n = Math.ceil(week / 2)
    return n === 10 ? ['10'] : [String(n)]
  }
  if (week === 21) return ['0']
  const pairs = [['1', '2'], ['3', '4'], ['5', '6'], ['7', '8'], ['9', '10'], ['2', '5'], ['3', '8'], ['6', '9']]
  return pairs[(week - 22) % pairs.length]
}

const K_NUMBERS = (week: number): string[] => {
  const early: string[][] = [['0', '1'], ['2', '3'], ['4', '5'], ['6', '7'], ['8', '9'], ['10'], ['11', '12'], ['13', '14'], ['15', '16'], ['17', '18'], ['19', '20']]
  if (week <= early.length) return early[week - 1]
  // Afterward: numbers that are often reversed, then two-digit numbers in growing ranges.
  const later: string[][] = [['2', '5'], ['3', '7'], ['9', '6'], ['21', '22'], ['30', '35'], ['40', '45'], ['50', '55'], ['60', '70'], ['80', '90'], ['100']]
  return later[(week - early.length - 1) % later.length]
}

const supported = (s: string) => [...s].every((ch) => ch === ' ' || ch in GLYPHS)

function lettersFromGraphemes(gs: string[]): string[] {
  const single = gs.filter((g) => g.length === 1)
  return single.flatMap((g) => [g.toUpperCase(), g])
}

/** Letters taught in a grade's literacy weeks 1..week, single letters only. */
function lettersTaughtThrough(grade: HandwritingGrade, week: number): string[] {
  const out: string[] = []
  for (let w = 1; w <= week; w++) {
    const lw = getLiteracyWeek(grade, w)
    if (lw.review) continue
    for (const g of lw.graphemes) if (g.length === 1 && !out.includes(g)) out.push(g)
    if (g2(lw.graphemes)) for (const ch of g2(lw.graphemes)!) if (!out.includes(ch)) out.push(ch)
  }
  return out
}
/** 'qu' is two letters to write. */
const g2 = (gs: string[]) => (gs.includes('qu') ? ['q', 'u'] : null)

/** Stroke families for whole-alphabet review weeks: similar movements together. */
const FAMILIES = [['l', 't', 'i', 'L', 'T', 'I'], ['c', 'o', 'a', 'C', 'O'], ['n', 'm', 'h', 'r'], ['v', 'w', 'x', 'V', 'W', 'X'], ['b', 'd', 'p', 'q'], ['f', 'j', 'g', 'y']]

export function getHandwritingWeek(grade: HandwritingGrade, week: number): HandwritingWeek {
  const w = Math.min(Math.max(week, 1), 36)
  const lw = getLiteracyWeek(grade, w)
  const fineMotor = FINE_MOTOR[(w - 1) % FINE_MOTOR.length]
  const taughtBefore = lettersTaughtThrough(grade, w - 1)

  if (grade === 'pre-k') {
    const nameFocus = lw.pattern === 'name'
    let letters: string[] = []
    if (lw.pattern === 'letter') letters = lettersFromGraphemes(lw.graphemes.length === 1 ? lw.graphemes : lw.graphemes.slice(0, 2))
    else if (lw.graphemes.length) letters = lettersFromGraphemes(lw.graphemes.slice(0, 2))
    else if (!nameFocus) letters = FAMILIES[w % FAMILIES.length].slice(0, 4)
    const review = taughtBefore.filter((l) => !letters.includes(l)).slice(-3)
    return {
      grade,
      week: w,
      letters,
      review,
      numbers: PREK_NUMBERS(w),
      words: [],
      nameFocus,
      fineMotor,
      tip: lw.handwriting || 'Start at the top. Hold the pencil with a pinch.',
      stage: w <= 12 ? 'guided' : w <= 26 ? 'copy' : 'independent',
    }
  }

  // Kindergarten
  let letters = lettersFromGraphemes(lw.graphemes.filter((g) => g.length === 1))
  if (lw.graphemes.includes('qu')) letters = [...letters, 'Q', 'q']
  if (!letters.length && w <= 15) letters = FAMILIES[w % FAMILIES.length].slice(0, 4)
  const words = w >= 15 ? lw.words.filter((x) => supported(x) && x.length <= 6).slice(0, 3) : []
  const sentence = w >= 22 ? lw.sentences.find((s) => supported(s) && textWidth(s) <= 1250) : undefined
  return {
    grade,
    week: w,
    letters: letters.slice(0, 8),
    review: taughtBefore.filter((l) => !letters.includes(l)).slice(-4),
    numbers: K_NUMBERS(w),
    words,
    sentence,
    nameFocus: w === 1 || w === 18 || w === 35,
    fineMotor,
    tip: lw.handwriting || 'Tall letters touch the top line; small letters touch the middle line.',
    stage: w <= 8 ? 'guided' : w <= 20 ? 'copy' : 'independent',
  }
}

/** Short words to say while forming each glyph. */
export const FORMATION_TALK: Record<string, string> = {
  a: 'Around like a c, up, and down.',
  b: 'Down from the top, back up, and around.',
  c: 'Start near the top and curve around like a c.',
  d: 'Around like a c, up to the top, and back down.',
  e: 'Across the middle, then around like a c.',
  f: 'Curve over and down. Cross it.',
  g: 'Around like a c, up, down below the line, and hook.',
  h: 'Down from the top, back up, over the hump, and down.',
  i: 'Down from the middle. Dot on top.',
  j: 'Down below the line and hook. Dot on top.',
  k: 'Down from the top. Slant in, slant out.',
  l: 'Down from the top.',
  m: 'Down, up and over, up and over.',
  n: 'Down, up and over the hump.',
  o: 'Start at the top and go around like a c, all the way.',
  p: 'Down below the line, back up, and around.',
  q: 'Around like a c, up, and down below the line.',
  r: 'Down, back up, and over a little.',
  s: 'Curve back, curve forward — a little snake.',
  t: 'Down from near the top. Cross it.',
  u: 'Down, around, up, and down.',
  v: 'Slant down, slant up.',
  w: 'Slant down, up, down, up.',
  x: 'Slant down one way. Slant down the other way.',
  y: 'Slant in. Slant down below the line.',
  z: 'Across, slant down, across.',
  A: 'Slant down, slant down, across the middle.',
  B: 'Down. Back to the top: around, around.',
  C: 'Start near the top and curve around.',
  D: 'Down. Back to the top and around to the bottom.',
  E: 'Down. Across the top, the middle, the bottom.',
  F: 'Down. Across the top, across the middle.',
  G: 'Curve around like a C, then in.',
  H: 'Down. Down. Across the middle.',
  I: 'Down. Across the top. Across the bottom.',
  J: 'Down and hook.',
  K: 'Down. Slant in to the middle, slant out.',
  L: 'Down and across.',
  M: 'Down. Back to the top: slant down, slant up, down.',
  N: 'Down. Back to the top: slant down, up.',
  O: 'Start at the top and circle all the way around.',
  P: 'Down. Back to the top and around to the middle.',
  Q: 'Circle all the way around. Little slant.',
  R: 'Down. Back to the top, around to the middle, slant out.',
  S: 'Curve back, curve forward.',
  T: 'Down. Across the top.',
  U: 'Down, around, and up.',
  V: 'Slant down, slant up.',
  W: 'Slant down, up, down, up.',
  X: 'Slant down. Slant down the other way.',
  Y: 'Slant in to the middle. Slant in and down.',
  Z: 'Across, slant down, across.',
  '0': 'Start at the top and curve around to close.',
  '1': 'Straight down from the top.',
  '2': 'Curve around, slant down, across.',
  '3': 'Around and in, around and in.',
  '4': 'Down and across. Then a long line down.',
  '5': 'Down, around the belly. Hat on top.',
  '6': 'Curve down and around into a loop.',
  '7': 'Across and slant down.',
  '8': 'Make an S, then go back up to close it.',
  '9': 'Circle around, then straight down.',
}

export function formationTalk(text: string): string[] {
  return [...new Set([...text.replace(/\s/g, '')])].filter((ch) => FORMATION_TALK[ch]).map((ch) => `${ch}: ${FORMATION_TALK[ch]}`)
}
