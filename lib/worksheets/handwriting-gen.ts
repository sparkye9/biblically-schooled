import { getHandwritingWeek, type HandwritingGrade } from '../curriculum/handwriting'
import { COUNT_ICONS, type GenOut } from './math-gen'
import type { Rng } from './rng'
import { NAME_PLACEHOLDER, type HandwritingRow } from './types'

/**
 * Handwriting pages. Each page mixes short sections — guided tracing with
 * starting dots and arrows, copying from a model, independent writing, and
 * numbers — so no page is a whole sheet of one exercise.
 *
 *   Tuesday (day 1): learn the formation — guided rows, then copy.
 *   Friday  (day 3): show what you know — less tracing, more copying and
 *                    independent writing, name practice, count-and-write.
 */

const rep = (s: string, n: number) => Array(n).fill(s).join('  ')

export function handwritingBlocks(grade: HandwritingGrade, week: number, day: number, r: Rng): GenOut {
  const hw = getHandwritingWeek(grade, week)
  const size: HandwritingRow['size'] = grade === 'pre-k' ? 'lg' : 'md'
  // Weeks with no new letters (later K weeks) practice recent letters instead.
  const letters = hw.letters.length ? hw.letters : hw.review
  const upper = letters.filter((l) => l === l.toUpperCase())
  const lower = letters.filter((l) => l !== l.toUpperCase())
  const rows: HandwritingRow[] = []
  const many = grade === 'pre-k' ? 3 : 4

  if (day === 1) {
    if (hw.nameFocus) {
      rows.push({ mode: 'guided', text: NAME_PLACEHOLDER, size, label: 'Start at the green dot. Follow the arrows.' })
      rows.push({ mode: 'trace', text: NAME_PLACEHOLDER, size, label: 'Trace your name again.' })
    } else {
      const firstUpper = upper.slice(0, 2)
      const firstLower = lower.slice(0, 2)
      if (firstUpper.length) rows.push({ mode: 'guided', text: firstUpper.map((l) => rep(l, firstUpper.length > 1 ? 2 : many)).join('  '), size, label: 'Start at the green dot. Follow the arrows.' })
      if (firstLower.length) rows.push({ mode: hw.stage === 'independent' ? 'trace' : 'guided', text: firstLower.map((l) => rep(l, firstLower.length > 1 ? 2 : many + 1)).join('  '), size, label: hw.stage === 'independent' ? 'Trace.' : 'Now the little letter.' })
      if (grade === 'k' && hw.words.length) {
        rows.push({ mode: 'copy', text: hw.words.slice(0, 2).join('   '), size, label: 'Copy the words. Leave a finger space between words.' })
      } else {
        const pairs = letters.slice(0, grade === 'pre-k' ? 2 : 4)
        if (pairs.length) rows.push({ mode: 'copy', text: pairs.join('  '), size, label: 'Look at the letter. Write it yourself in the space.' })
      }
    }
    const nums = hw.numbers.slice(0, 2)
    rows.push({ mode: 'guided', text: nums.map((n) => rep(n, nums.length > 1 ? 2 : 3)).join('   '), size, label: 'Numbers: start at the green dot.' })
    const n = Math.min(Number(hw.numbers[0]) || 1, grade === 'pre-k' ? 10 : 20)
    const items = [{ icon: r.pick(COUNT_ICONS), count: Math.max(1, n) }]
    if (grade === 'k' && hw.numbers[1]) items.push({ icon: r.pick(COUNT_ICONS.filter((i) => i !== items[0].icon)), count: Math.min(Number(hw.numbers[1]) || 2, 20) })
    return {
      blocks: [{ type: 'handwriting', rows }, ...(Number(hw.numbers[0]) > 0 ? [{ type: 'count' as const, write: true, items }] : [])],
      answers: [
        hw.nameFocus ? 'Name traced from the starting dots.' : `Formed ${letters.join(' ')} from the starting dot.`,
        `Numbers: ${hw.numbers.join(', ')}.`,
        ...items.map((it) => `Count and write: ${it.count}`),
      ],
      instructions: 'Put your finger on the green dot first. Trace slowly, following the arrows. Then try it yourself.',
      activity: 'Handwriting: learn it',
    }
  }

  // Friday: show what you know.
  const focus = hw.letters.length ? hw.letters : hw.review
  if (focus.length) rows.push({ mode: 'trace', text: focus.slice(0, 4).join('  '), size, label: 'Warm up: trace.' })
  if (grade === 'k' && hw.sentence) {
    rows.push({ mode: 'copy', text: hw.sentence, size, label: 'Copy the sentence. Leave a finger space between words.' })
  } else if (grade === 'k' && hw.words.length) {
    rows.push({ mode: 'copy', text: hw.words.slice(0, 2).join('   '), size, label: 'Copy the words. Leave a finger space between words.' })
  } else if (grade === 'k' && hw.review.length) {
    rows.push({ mode: 'copy', text: r.sample(hw.review, Math.min(3, hw.review.length)).join('  '), size, label: 'Letters we learned before: copy them.' })
  }
  rows.push({ mode: 'write', text: '', size, label: grade === 'pre-k' ? 'Write the letter your grown-up says.' : 'Write the letters or words your grown-up says.' })
  rows.push({ mode: hw.stage === 'guided' || hw.nameFocus ? 'trace' : 'copy', text: NAME_PLACEHOLDER, size, label: 'My name.' })
  rows.push({ mode: 'copy', text: hw.numbers.join('   '), size, label: 'Write the numbers.' })
  const cap = grade === 'pre-k' ? 10 : 20
  const biggest = Math.min(cap, Math.max(3, ...hw.numbers.map(Number).filter((x) => x > 0 && x <= cap)))
  const counts = r.sample(Array.from({ length: biggest }, (_, i) => i + 1), 2)
  // Once Pre-K children copy their name (a long model plus its own line), the page has room for writing rows only.
  // Copying words or a sentence needs its own line, so it replaces the count-and-write box (numbers are still written above).
  const withCount = !(grade === 'pre-k' && !(hw.stage === 'guided' || hw.nameFocus)) && !(grade === 'k' && (hw.sentence || hw.words.length))
  const items = withCount ? counts.map((count, i) => ({ icon: COUNT_ICONS[(i * 5 + week) % COUNT_ICONS.length], count })) : []
  return {
    blocks: withCount ? [{ type: 'handwriting', rows }, { type: 'count', write: true, items }] : [{ type: 'handwriting', rows }],
    answers: [
      `Letters formed from the top: ${focus.join(' ')}.`,
      'Dictation: say 2–3 letters (or words) from this week; check starting points.',
      ...items.map((it, i) => `Count and write ${i + 1}: ${it.count}`),
    ],
    instructions: withCount ? 'Trace, copy, then write on your own. Count the pictures and write the number.' : 'Trace, copy, then write on your own.',
    activity: 'Handwriting: show what you know',
  }
}
