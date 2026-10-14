import type { MathGen, ShapeName } from '../curriculum/math'
import type { Grade } from '../curriculum/types'
import { distinctInts, type Rng } from './rng'
import { COIN_VALUE, type Block, type Coin, type Expr } from './types'

export interface GenOut {
  blocks: Block[]
  answers: string[]
  instructions: string
  activity: string
  cutAndPaste?: boolean
}

export const COUNT_ICONS = ['Star', 'Apple', 'Heart', 'Fish', 'Bird', 'Sun', 'Flower', 'Leaf', 'Cookie', 'Bug', 'Cherry', 'Shell']

const THINGS: { one: string; many: string; icon: string; away: string }[] = [
  { one: 'apple', many: 'apples', icon: 'Apple', away: 'were eaten' },
  { one: 'cookie', many: 'cookies', icon: 'Cookie', away: 'were eaten' },
  { one: 'fish', many: 'fish', icon: 'Fish', away: 'swam away' },
  { one: 'bird', many: 'birds', icon: 'Bird', away: 'flew away' },
  { one: 'flower', many: 'flowers', icon: 'Flower', away: 'were picked' },
  { one: 'shell', many: 'shells', icon: 'Shell', away: 'were given away' },
  { one: 'book', many: 'books', icon: 'Book', away: 'went back to the library' },
  { one: 'leaf', many: 'leaves', icon: 'Leaf', away: 'blew away' },
  { one: 'car', many: 'toy cars', icon: 'Car', away: 'rolled away' },
  { one: 'star', many: 'star stickers', icon: 'Star', away: 'were used' },
]
const NAMES = ['Ruth', 'Sam', 'Eli', 'Anna', 'Noah', 'Leah', 'Ben', 'Mia', 'Caleb', 'Hannah', 'Jonah', 'Lydia', 'Grace', 'Isaac']

const sidesOf: Record<ShapeName, number> = { circle: 0, oval: 0, triangle: 3, square: 4, rectangle: 4, rhombus: 4, hexagon: 6 }

/** Three unique answer choices that include the answer, all within [lo, hi]. */
export function choicesFor(r: Rng, answer: number, lo: number, hi: number): number[] {
  const pool = distinctInts(r, Math.max(lo, 0), hi, hi - lo + 1).filter((n) => n !== answer)
  const near = pool.sort((a, b) => Math.abs(a - answer) - Math.abs(b - answer)).slice(0, 4)
  return r.shuffle([answer, ...r.sample(near, 2)])
}

const evalExpr = (e: Expr) => (e.op === '+' ? e.a + (e.b ?? 0) : e.op === '-' ? e.a - (e.b ?? 0) : e.a)
export const exprText = (e: Expr) => (e.op ? `${e.a} ${e.op === '-' ? '−' : '+'} ${e.b}` : `${e.a}`)

export function mathBlocks(gen: MathGen, r: Rng, variant: number, grade: Grade): GenOut {
  switch (gen.kind) {
    case 'count-circle': {
      const n = 4
      const counts = distinctInts(r, gen.min, gen.max, n)
      while (counts.length < n) counts.push(r.int(gen.min, gen.max))
      const icons = r.sample(COUNT_ICONS, n)
      const items = counts.map((count, i) => ({
        icon: icons[i],
        count,
        choices: choicesFor(r, count, Math.max(0, gen.min - 1), gen.max + 1),
      }))
      return {
        blocks: [{ type: 'count', write: false, items }],
        answers: items.map((it, i) => `${i + 1}. ${it.count}`),
        instructions: 'Count the pictures. Circle the number that tells how many.',
        activity: 'Count & circle',
      }
    }
    case 'count-write': {
      const n = 6
      const counts = distinctInts(r, gen.min, gen.max, n)
      while (counts.length < n) counts.push(r.int(gen.min, gen.max))
      const icons = r.sample(COUNT_ICONS, n)
      const items = counts.map((count, i) => ({ icon: icons[i], count }))
      return {
        blocks: [{ type: 'count', write: true, items }],
        answers: items.map((it, i) => `${i + 1}. ${it.count}`),
        instructions: 'Count the pictures. Write how many in the box.',
        activity: 'Count & write',
      }
    }
    case 'trace-numbers': {
      const all: number[] = []
      for (let i = gen.from; i <= gen.to; i++) all.push(i)
      const chunk = all.length > 6 ? (variant % 2 === 0 ? all.slice(0, 5) : all.slice(5)) : all
      const counts = r.sample(chunk, Math.min(3, chunk.length))
      const icons = r.sample(COUNT_ICONS, counts.length)
      return {
        blocks: [
          { type: 'trace', rows: chunk.map((n) => `${n}   ${n}   ${n}`), size: chunk.length > 4 ? 'md' : 'lg', label: 'Trace the numbers. Start at the top.' },
          { type: 'count', write: true, items: counts.map((c, i) => ({ icon: icons[i], count: c })) },
        ],
        answers: counts.map((c, i) => `Count ${i + 1}: ${c}`),
        instructions: 'Trace each number. Then count and write.',
        activity: 'Number tracing',
      }
    }
    case 'shape-find': {
      const target = gen.shapes[variant % gen.shapes.length]
      const others = gen.shapes.filter((s) => s !== target)
      const fillers: ShapeName[] = others.length ? others : ['circle', 'square', 'triangle'].filter((s) => s !== target) as ShapeName[]
      const k = r.int(3, 5)
      const list: ShapeName[] = [...Array(k).fill(target), ...Array.from({ length: 12 - k }, () => r.pick(fillers))]
      const shapes = r.shuffle(list).map((shape) => ({ shape, scale: 0.7 + r.next() * 0.5, rotate: shape === 'circle' ? 0 : r.pick([0, 0, 15, 30, 45, 90]) }))
      return {
        blocks: [{ type: 'shape-find', target, shapes }],
        answers: [`${k} ${target}s`],
        instructions: `Find every ${target}. Color it in. How many did you find?`,
        activity: 'Shape hunt',
      }
    }
    case 'shape-attributes': {
      const rows = r.shuffle(gen.shapes).slice(0, 4).map((shape) => ({ shape, sides: sidesOf[shape], corners: sidesOf[shape] }))
      return {
        blocks: [{ type: 'shape-table', rows }],
        answers: rows.map((row) => `${row.shape}: ${row.sides} sides, ${row.corners} corners`),
        instructions: 'Count the sides and the corners of each shape. Write the numbers.',
        activity: 'Shape table',
      }
    }
    case 'pattern': {
      const syms = r.sample(['Star', 'Heart', 'Apple', 'Moon', 'Sun', 'Fish', 'Leaf', 'Flower'], 3)
      const rows = Array.from({ length: 4 }, (_, i) => {
        const type = gen.types[(i + variant) % gen.types.length]
        const [A, B, C] = r.shuffle(syms)
        const unit = type === 'AB' ? [A, B] : type === 'ABB' ? [A, B, B] : type === 'AAB' ? [A, A, B] : [A, B, C]
        const len = unit.length === 2 ? 5 : unit.length * 2 + 1
        const seq = Array.from({ length: len }, (_, j) => unit[j % unit.length])
        const answer = unit[len % unit.length]
        // A, B, C are drawn from `syms`, so the answer is always one of the three choices.
        return { seq, answer, choices: r.shuffle(syms) }
      })
      return {
        blocks: [{ type: 'pattern', rows }],
        answers: rows.map((row, i) => `${i + 1}. ${row.answer}`),
        instructions: 'Say each pattern out loud. Circle what comes next.',
        activity: 'Patterns',
      }
    }
    case 'compare-groups': {
      const ask = variant % 2 === 0 ? 'more' : 'fewer'
      const items = Array.from({ length: 4 }, () => {
        const [left, right] = distinctInts(r, 1, gen.max, 2)
        return { icon: r.pick(COUNT_ICONS), left, right }
      })
      return {
        blocks: [{ type: 'compare-groups', ask, items }],
        answers: items.map((it, i) => `${i + 1}. ${(ask === 'more') === it.left > it.right ? 'left' : 'right'} (${it.left} vs ${it.right})`),
        instructions: `Count both groups. Circle the group with ${ask.toUpperCase()}.`,
        activity: 'Compare groups',
      }
    }
    case 'compare-numbers': {
      const items = Array.from({ length: gen.symbols ? 8 : 6 }, (_, i) => {
        if (gen.symbols && i === 3) {
          const n = r.int(10, gen.max)
          return { left: n, right: n }
        }
        const [left, right] = distinctInts(r, gen.symbols ? 10 : 1, gen.max, 2)
        return { left, right }
      })
      return {
        blocks: [{ type: 'compare-numbers', symbols: gen.symbols, items }],
        answers: items.map((it, i) =>
          gen.symbols ? `${i + 1}. ${it.left} ${it.left > it.right ? '>' : it.left < it.right ? '<' : '='} ${it.right}` : `${i + 1}. ${Math.max(it.left, it.right)}`,
        ),
        instructions: gen.symbols ? 'Write >, <, or = in each circle. Compare the tens first.' : 'Circle the GREATER number in each pair.',
        activity: 'Compare numbers',
      }
    }
    case 'size-compare': {
      const heavy: [string, string][] = [['Truck', 'Feather'], ['House', 'Leaf'], ['Car', 'Apple'], ['Anchor', 'Flower'], ['Bus', 'Cookie'], ['Mountain', 'Bird']]
      const word = gen.attr === 'heavy' ? 'HEAVIER' : gen.attr === 'tall' ? 'TALLER' : gen.attr === 'long' ? 'LONGER' : 'BIGGER'
      const small = gen.attr === 'big' ? 'SMALLER' : 'SHORTER'
      // Alternate the question by row so children read carefully; heavy/light always asks "heavier".
      const askBigFor = (i: number) => gen.attr === 'heavy' || (i + variant) % 2 === 0
      const items = Array.from({ length: 4 }, (_, i) => {
        const flip = r.next() < 0.5
        if (gen.attr === 'heavy') {
          const [h, l] = heavy[(i + variant) % heavy.length]
          return flip
            ? { a: { icon: l, scale: 1 }, b: { icon: h, scale: 1 }, answer: 'b' as const }
            : { a: { icon: h, scale: 1 }, b: { icon: l, scale: 1 }, answer: 'a' as const }
        }
        const [u1, u2] = distinctInts(r, 2, 8, 2)
        const icon = r.pick(COUNT_ICONS)
        const bar = gen.attr === 'tall' ? ('tall' as const) : gen.attr === 'long' ? ('long' as const) : undefined
        const bigger: 'a' | 'b' = u1 > u2 ? 'a' : 'b'
        const answer: 'a' | 'b' = askBigFor(i) ? bigger : bigger === 'a' ? 'b' : 'a'
        return {
          a: { icon, scale: bar ? 1 : 0.5 + u1 / 10, bar, units: u1 },
          b: { icon, scale: bar ? 1 : 0.5 + u2 / 10, bar, units: u2 },
          answer,
        }
      })
      const ask =
        gen.attr === 'heavy'
          ? `Circle the ${word} one in each pair.`
          : `Rows 1 and 3: circle the ${askBigFor(0) ? word : small} one. Rows 2 and 4: circle the ${askBigFor(1) ? word : small} one.`
      return {
        blocks: [{ type: 'size-compare', ask, items }],
        answers: items.map((it, i) => `${i + 1}. ${it.answer === 'a' ? 'left' : 'right'}`),
        instructions: ask,
        activity: gen.attr === 'heavy' ? 'Heavy & light' : 'Compare sizes',
      }
    }
    case 'ten-frame': {
      const ask = variant % 2 === 0 ? 'how-many' : 'to-ten'
      const items = distinctInts(r, 1, gen.max, 6).map((filled) => ({ filled }))
      return {
        blocks: [{ type: 'ten-frame', ask, items }],
        answers: items.map((it, i) => `${i + 1}. ${ask === 'how-many' ? it.filled : 10 - it.filled}`),
        instructions: ask === 'how-many' ? 'How many dots? Write the number.' : 'How many MORE dots make 10? Write the number.',
        activity: 'Ten frames',
      }
    }
    case 'number-bond': {
      const items: { whole: number; a: number; b: number; hide: 'whole' | 'a' | 'b' }[] = []
      const seen = new Set<string>()
      let guard = 0
      while (items.length < 6 && guard++ < 200) {
        const whole = r.int(gen.minTotal, gen.maxTotal)
        const a = r.int(0, whole)
        const b = whole - a
        const hide = (items.length + variant) % 3 === 0 ? 'whole' : r.pick(['a', 'b'] as const)
        const key = `${whole}-${a}-${hide}`
        if (seen.has(key)) continue
        seen.add(key)
        items.push({ whole, a, b, hide })
      }
      return {
        blocks: [{ type: 'number-bond', items }],
        answers: items.map((it, i) => `${i + 1}. ${it.hide === 'whole' ? it.whole : it.hide === 'a' ? it.a : it.b}`),
        instructions: 'The two parts make the whole. Write the missing number.',
        activity: 'Number bonds',
      }
    }
    case 'add-pictures':
    case 'sub-pictures': {
      const op = gen.kind === 'add-pictures' ? ('+' as const) : ('-' as const)
      const seen = new Set<string>()
      const items: { icon: string; a: number; b: number; op: '+' | '-' }[] = []
      let guard = 0
      while (items.length < 4 && guard++ < 200) {
        let a: number, b: number
        if (op === '+') {
          a = r.int(1, gen.max - 1)
          b = r.int(1, gen.max - a)
        } else {
          a = r.int(2, gen.max)
          b = r.int(1, a - 1)
        }
        if (seen.has(`${a}${op}${b}`)) continue
        seen.add(`${a}${op}${b}`)
        items.push({ icon: r.pick(COUNT_ICONS), a, b, op })
      }
      return {
        blocks: [{ type: 'picture-equation', items }],
        answers: items.map((it, i) => `${i + 1}. ${it.a} ${it.op === '+' ? '+' : '−'} ${it.b} = ${op === '+' ? it.a + it.b : it.a - it.b}`),
        instructions: op === '+' ? 'Count all the pictures. Write the answer.' : 'Cross out the ones taken away. Count what is left.',
        activity: op === '+' ? 'Picture addition' : 'Picture subtraction',
      }
    }
    case 'facts': {
      const count = grade === 'k' ? 8 : 12
      const items: { terms: (number | null)[]; ops: ('+' | '-' | '=')[]; answer: number }[] = []
      const seen = new Set<string>()
      let guard = 0
      while (items.length < count && guard++ < 500) {
        const op: '+' | '-' = gen.op === 'mixed' ? (items.length % 2 === 0 ? '+' : '-') : gen.op
        const min = gen.min ?? 0
        let item: (typeof items)[number]
        if (gen.three) {
          const a = r.int(1, 9)
          const b = r.next() < 0.5 && a < 10 ? 10 - a : r.int(1, 9)
          const c = r.int(1, Math.max(1, gen.max - a - b))
          if (a + b + c > gen.max) continue
          item = { terms: [a, b, c, null], ops: ['+', '+', '='], answer: a + b + c }
        } else if (gen.makeTen && min < 10) {
          const a = r.int(1, 9)
          item = { terms: [a, null, 10], ops: ['+', '='], answer: 10 - a }
        } else if (op === '+') {
          let a: number, b: number
          if (gen.doubles) {
            a = r.int(1, Math.floor(gen.max / 2))
            b = r.next() < 0.5 ? a : Math.min(a + 1, gen.max - a)
          } else if (gen.makeTen) {
            a = r.int(6, 9)
            b = r.int(Math.max(11 - a, 2), Math.min(gen.max - a, 9))
          } else {
            const sum = r.int(Math.max(min, 2), gen.max)
            a = r.int(Math.max(0, sum - 10), Math.min(sum, 10))
            b = sum - a
          }
          if (a + b > gen.max || a + b < min) continue
          item = gen.missing
            ? { terms: [a, null, a + b], ops: ['+', '='], answer: b }
            : { terms: [a, b, null], ops: ['+', '='], answer: a + b }
        } else {
          const a = r.int(Math.max(min, 2), gen.max)
          const b = r.int(Math.max(0, a - 10), Math.min(a, 10))
          item = { terms: [a, b, null], ops: ['-', '='], answer: a - b }
        }
        const key = item.terms.join(',') + item.ops.join('')
        if (seen.has(key)) continue
        seen.add(key)
        items.push(item)
      }
      return {
        blocks: [{ type: 'equations', columns: grade === 'k' ? 2 : 3, items }],
        answers: items.map((it, i) => `${i + 1}. ${it.answer}`),
        instructions: gen.missing || gen.makeTen ? 'Find the missing number. Use counters or a ten frame if you need them.' : 'Solve each problem. Use a strategy: count on, doubles, or make 10.',
        activity: 'Fact practice',
      }
    }
    case 'fact-family': {
      const items: { a: number; b: number; whole: number }[] = []
      const seen = new Set<number>()
      let guard = 0
      while (items.length < 3 && guard++ < 100) {
        const whole = r.int(5, gen.max)
        const a = r.int(1, whole - 1)
        const b = whole - a
        if (a === b || seen.has(whole * 100 + Math.min(a, b))) continue
        seen.add(whole * 100 + Math.min(a, b))
        items.push({ a, b, whole })
      }
      return {
        blocks: [{ type: 'fact-family', items }],
        answers: items.map((f, i) => `${i + 1}. ${f.a}+${f.b}=${f.whole}, ${f.b}+${f.a}=${f.whole}, ${f.whole}−${f.a}=${f.b}, ${f.whole}−${f.b}=${f.a}`),
        instructions: 'Use the three numbers in the house to write four facts.',
        activity: 'Fact families',
      }
    }
    case 'true-false': {
      const items: { left: Expr; right: Expr }[] = []
      for (let i = 0; i < 8; i++) {
        const a = r.int(1, gen.max - 1)
        const b = r.int(1, gen.max - a)
        const left: Expr = { a, op: '+', b }
        const truth = (i + variant) % 2 === 0
        let right: Expr
        if (i % 3 === 0) {
          const c = r.int(0, a + b)
          right = { a: c, op: '+', b: a + b - c + (truth ? 0 : r.pick([1, -1].filter((d) => a + b - c + d >= 0))) }
        } else {
          right = { a: a + b + (truth ? 0 : r.pick([1, 2, -1].filter((d) => a + b + d >= 0))) }
        }
        items.push(i % 2 ? { left: right, right: left } : { left, right })
      }
      return {
        blocks: [{ type: 'true-false', items }],
        answers: items.map((it, i) => `${i + 1}. ${evalExpr(it.left) === evalExpr(it.right) ? 'true' : 'false'}`),
        instructions: 'Is each side the SAME amount? Circle true or false.',
        activity: 'True or false',
      }
    }
    case 'word-problems': {
      const showPictures = gen.max <= 10
      const count = showPictures ? 3 : 4
      const items: { text: string; icon: string; answer: number; a: number; b: number; op: '+' | '-' | 'compare' }[] = []
      const names = r.sample(NAMES, count * 2)
      const things = r.sample(THINGS, count)
      for (let i = 0; i < count; i++) {
        const t = things[i]
        const [n1, n2] = [names[i * 2], names[i * 2 + 1]]
        const op: '+' | '-' | 'compare' =
          gen.op === 'mixed' ? (i % 2 === variant % 2 ? '+' : '-') : gen.op
        if (op === '+') {
          const a = r.int(1, gen.max - 1)
          const b = r.int(1, gen.max - a)
          items.push({ text: `${n1} has ${a} ${a === 1 ? t.one : t.many}. ${n2} gives ${n1} ${b} more. How many ${t.many} does ${n1} have now?`, icon: t.icon, answer: a + b, a, b, op })
        } else if (op === '-') {
          const a = r.int(2, gen.max)
          const b = r.int(1, a - 1)
          items.push({ text: `${n1} has ${a} ${t.many}. ${b} ${t.away}. How many ${t.many} are left?`, icon: t.icon, answer: a - b, a, b, op })
        } else {
          const [x, y] = distinctInts(r, 2, gen.max, 2).sort((p, q) => q - p)
          items.push({ text: `${n1} has ${x} ${t.many}. ${n2} has ${y} ${t.many}. How many more ${t.many} does ${n1} have than ${n2}?`, icon: t.icon, answer: x - y, a: x, b: y, op })
        }
      }
      return {
        blocks: [{ type: 'word-problems', showPictures, items }],
        answers: items.map((it, i) => `${i + 1}. ${it.op === '+' ? `${it.a} + ${it.b}` : `${it.a} − ${it.b}`} = ${it.answer}`),
        instructions: 'Read each story (or listen). Draw or use counters. Write the number sentence and the answer.',
        activity: 'Picture word problems',
      }
    }
    case 'number-line': {
      const items = Array.from({ length: 4 }, () => {
        const op = gen.op
        const start = op === '+' ? r.int(0, gen.max - 2) : r.int(2, gen.max)
        const jump = op === '+' ? r.int(1, Math.min(5, gen.max - start)) : r.int(1, Math.min(5, start))
        return { start, jump, op }
      })
      return {
        blocks: [{ type: 'number-line', max: gen.max, items }],
        answers: items.map((it, i) => `${i + 1}. ${it.op === '+' ? it.start + it.jump : it.start - it.jump}`),
        instructions: 'Start at the first number. Draw the jumps. Write where you land.',
        activity: 'Number lines',
      }
    }
    case 'place-value': {
      const nums = distinctInts(r, gen.min, gen.max, 6)
      return {
        blocks: [{ type: 'base-ten', items: nums.map((n) => ({ tens: Math.floor(n / 10), ones: n % 10 })) }],
        answers: nums.map((n, i) => `${i + 1}. ${Math.floor(n / 10)} tens ${n % 10} ones = ${n}`),
        instructions: 'Count the tens (long bars) and the ones (small squares). Write the number.',
        activity: 'Tens & ones',
      }
    }
    case 'ten-more-less': {
      const nums = distinctInts(r, 11, gen.max, 8)
      return {
        blocks: [{ type: 'ten-more-less', items: nums }],
        answers: nums.map((n, i) => `${i + 1}. ${n - 10} | ${n} | ${n + 10}`),
        instructions: 'Write the number that is 10 less and 10 more. Only the tens digit changes!',
        activity: '10 more, 10 less',
      }
    }
    case 'two-digit': {
      const items: { terms: (number | null)[]; ops: ('+' | '-' | '=')[]; answer: number }[] = []
      const seen = new Set<string>()
      let guard = 0
      while (items.length < 10 && guard++ < 300) {
        let a: number, b: number, op: '+' | '-' = '+'
        if (gen.type === 'add-tens') {
          a = 10 * r.int(1, 8)
          b = 10 * r.int(1, 9 - a / 10)
        } else if (gen.type === '2d+1d') {
          a = r.int(11, 89)
          b = r.int(1, Math.min(9, 99 - a))
        } else if (gen.type === '2d+tens') {
          a = r.int(11, 79)
          b = 10 * r.int(1, Math.floor((99 - a) / 10))
        } else {
          op = '-'
          a = 10 * r.int(2, 9)
          b = 10 * r.int(1, a / 10 - 1)
        }
        if (seen.has(`${a}${op}${b}`)) continue
        seen.add(`${a}${op}${b}`)
        items.push({ terms: [a, b, null], ops: [op, '='], answer: op === '+' ? a + b : a - b })
      }
      return {
        blocks: [{ type: 'equations', columns: 2, items }],
        answers: items.map((it, i) => `${i + 1}. ${it.answer}`),
        instructions: 'Add or subtract. Think in tens and ones. Draw quick tens if it helps.',
        activity: 'Two-digit practice',
      }
    }
    case 'hundred-chart': {
      const starts: number[] = []
      for (let s = 1; s + 49 <= gen.to; s += 10) starts.push(s)
      const start = starts[(variant + r.int(0, starts.length - 1)) % starts.length]
      const blanks = distinctInts(r, start, start + 49, 14).sort((a, b) => a - b)
      return {
        blocks: [{ type: 'hundred-chart', start, count: 50, blanks }],
        answers: [blanks.join(', ')],
        instructions: 'Fill in the missing numbers. Look at the patterns down and across.',
        activity: 'Number chart',
      }
    }
    case 'skip-count': {
      const rows = Array.from({ length: 4 }, (_, i) => {
        const len = 6
        const maxStart = gen.to / gen.by - len + 1
        const startStep = Math.max(1, Math.min(maxStart, 1 + ((i * 2 + variant) % Math.max(1, maxStart))))
        const values = Array.from({ length: len }, (_, j) => (startStep + j) * gen.by)
        const blanks = distinctInts(r, 1, len - 1, 2)
        return { values, blanks }
      })
      return {
        blocks: [{ type: 'skip-count', by: gen.by, rows }],
        answers: rows.map((row, i) => `${i + 1}. ${row.blanks.map((b) => row.values[b]).join(', ')}`),
        instructions: `Count by ${gen.by}s. Fill in the missing numbers.`,
        activity: 'Skip counting',
      }
    }
    case 'clock': {
      const hours = distinctInts(r, 1, 12, 6)
      const items = hours.map((h, i) => ({ h, m: (gen.half && (i + variant) % 2 === 0 ? 30 : 0) as 0 | 30 }))
      return {
        blocks: [{ type: 'clocks', items }],
        answers: items.map((c, i) => `${i + 1}. ${c.h}:${c.m === 0 ? '00' : '30'}`),
        instructions: gen.half ? 'Short hand = hour. Long hand on 12 = o’clock; on 6 = thirty. Write the time.' : 'The short hand shows the hour. Write the time.',
        activity: 'Telling time',
      }
    }
    case 'coins': {
      const items: { coins: Coin[] }[] = []
      const seen = new Set<string>()
      let guard = 0
      while (items.length < 4 && guard++ < 300) {
        const n = gen.coins.length === 1 ? r.int(2, Math.min(10, gen.maxTotal)) : r.int(3, 6)
        const coins = Array.from({ length: n }, () => r.pick(gen.coins))
        coins.sort((a, b) => COIN_VALUE[b] - COIN_VALUE[a])
        const total = coins.reduce((s, c) => s + COIN_VALUE[c], 0)
        const key = coins.join(',')
        if (total > gen.maxTotal || seen.has(key)) continue
        seen.add(key)
        items.push({ coins })
      }
      return {
        blocks: [{ type: 'coins', items }],
        answers: items.map((it, i) => `${i + 1}. ${it.coins.reduce((s, c) => s + COIN_VALUE[c], 0)}¢`),
        instructions: 'Count the coins. Start with the coin worth the most and count on. Write the total.',
        activity: 'Counting coins',
      }
    }
    case 'measure': {
      const units = distinctInts(r, 2, gen.maxUnits, 4)
      const icons = r.sample(['Pencil', 'Carrot', 'Feather', 'Leaf', 'Fish', 'Ruler'], 4)
      const items = units.map((u, i) => ({ icon: icons[i], units: u }))
      return {
        blocks: [{ type: 'measure', items }],
        answers: items.map((it, i) => `${i + 1}. ${it.units} units`),
        instructions: 'Count the boxes under each picture to measure how long it is.',
        activity: 'Measuring',
      }
    }
    case 'graph': {
      const cats = r.sample(
        [
          { icon: 'Apple', label: 'apples' },
          { icon: 'Banana', label: 'bananas' },
          { icon: 'Cherry', label: 'cherries' },
          { icon: 'Grape', label: 'grapes' },
          { icon: 'Carrot', label: 'carrots' },
        ],
        gen.categories,
      )
      const counts = distinctInts(r, 1, 6, gen.categories)
      const categories = cats.map((c, i) => ({ ...c, count: counts[i] }))
      const most = categories.reduce((a, b) => (b.count > a.count ? b : a))
      const least = categories.reduce((a, b) => (b.count < a.count ? b : a))
      const questions = [
        { q: `How many ${categories[0].label}?`, a: String(categories[0].count) },
        { q: 'Which has the most?', a: most.label },
        ...(grade === 'pre-k' ? [] : [{ q: `How many more ${most.label} than ${least.label}?`, a: String(most.count - least.count) }]),
      ]
      return {
        blocks: [{ type: 'graph', categories, questions }],
        answers: questions.map((q, i) => `${i + 1}. ${q.a}`),
        instructions: 'Look at the picture graph. Answer the questions.',
        activity: 'Picture graph',
      }
    }
    case 'fractions': {
      const items = Array.from({ length: 6 }, (_, i) => ({
        shape: (i % 2 === 0 ? 'circle' : 'rect') as 'circle' | 'rect',
        parts: gen.parts[(i + variant) % gen.parts.length],
        equal: (i + variant) % 3 !== 2,
      }))
      return {
        blocks: [{ type: 'fractions', items }],
        answers: items.map((it, i) => `${i + 1}. ${it.equal ? (it.parts === 2 ? 'halves' : 'fourths') : 'not equal parts'}`),
        instructions: 'Is each shape cut into EQUAL parts? Circle halves, fourths, or not equal.',
        activity: 'Equal parts',
      }
    }
    case 'sort': {
      const groups =
        gen.by === 'size'
          ? null
          : [
              { label: 'Animals', pics: ['Cat', 'Dog', 'Fish', 'Bird', 'Rabbit', 'Turtle', 'Snail'] },
              { label: 'Food', pics: ['Apple', 'Banana', 'Carrot', 'Cookie', 'Pizza', 'Cherry', 'Sandwich'] },
              { label: 'Things that go', pics: ['Car', 'Bus', 'Truck', 'Train', 'Ship', 'Bike', 'Rocket'] },
            ]
      const [g1, g2] = r.sample(groups!, 2)
      const items = r.shuffle([
        ...r.sample(g1.pics, 4).map((picture) => ({ picture, column: 0 })),
        ...r.sample(g2.pics, 4).map((picture) => ({ picture, column: 1 })),
      ])
      return {
        blocks: [{ type: 'sort', cut: true, columns: [g1.label, g2.label], items }],
        answers: [`${g1.label}: ${items.filter((i) => i.column === 0).map((i) => i.picture).join(', ')}`, `${g2.label}: ${items.filter((i) => i.column === 1).map((i) => i.picture).join(', ')}`],
        instructions: 'Cut out the pictures. Glue each one in the group where it belongs.',
        activity: 'Cut & paste sort',
        cutAndPaste: true,
      }
    }
    case 'ordinal': {
      const icons = r.sample(['Car', 'Bus', 'Truck', 'Train', 'Bike', 'Ship'], 5)
      const words = ['first', 'second', 'third', 'fourth', 'fifth']
      const picks = r.sample([0, 1, 2, 3, 4], 3)
      const prompts = [
        { text: 'Circle the FIRST one in line.', answer: 0 },
        { text: 'Put an X on the LAST one.', answer: 4 },
        ...(grade === 'pre-k' ? [] : picks.slice(0, 2).map((p) => ({ text: `Draw a box around the ${words[p].toUpperCase()} one.`, answer: p }))),
      ]
      return {
        blocks: [{ type: 'ordinal', icons, prompts }],
        answers: prompts.map((p, i) => `${i + 1}. ${icons[p.answer]} (${words[p.answer]})`),
        instructions: 'The line starts at the arrow. Follow each direction.',
        activity: 'First, next, last',
      }
    }
    case 'one-more': {
      const less = !!gen.less
      const items = distinctInts(r, less ? 1 : 0, gen.max, 6).map((n) => ({ icon: r.pick(COUNT_ICONS), n }))
      return {
        blocks: [{ type: 'one-more', less, items }],
        answers: items.map((it, i) => `${i + 1}. ${less ? it.n - 1 : it.n + 1}`),
        instructions: less ? 'Count. Take one away. How many now?' : 'Count. Add ONE more. How many now?',
        activity: 'One more',
      }
    }
  }
}

/** Independent answer re-computation used by the validator. */
export function checkExpr(left: Expr, right: Expr): boolean {
  return evalExpr(left) === evalExpr(right)
}
