/**
 * Manuscript (ball-and-stick) letter and number formation, as stroke data.
 *
 * Each glyph is a list of strokes in the order a child writes them. A stroke is
 * a list of points; the first point is where the pencil starts (drawn as a
 * green starting dot) and the first segment gives the direction arrow. Because
 * the dotted tracing letter, the starting dot, and the arrow all come from the
 * same data, they always agree.
 *
 * Coordinates: y = 0 top line, 50 dashed midline, 100 baseline, 140 descender.
 * x starts at 0; a glyph's width is its largest x.
 */

export type Pt = [number, number]
export type Stroke = Pt[]

const L = (...pts: Pt[]): Pt[] => pts

/** Points along an ellipse arc. Angles in degrees; 0 = right, 90 = down (screen coordinates). */
function arc(cx: number, cy: number, rx: number, ry: number, from: number, to: number): Pt[] {
  const steps = Math.max(4, Math.ceil(Math.abs(to - from) / 10))
  const out: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    const a = ((from + ((to - from) * i) / steps) * Math.PI) / 180
    out.push([round(cx + rx * Math.cos(a)), round(cy + ry * Math.sin(a))])
  }
  return out
}
const round = (n: number) => Math.round(n * 10) / 10
const join = (...parts: Pt[][]): Stroke => parts.flat()

const LOWER: Record<string, Stroke[]> = {
  a: [arc(25, 75, 25, 25, -30, -390), L([50, 50], [50, 100])],
  b: [L([0, 0], [0, 100]), join(L([0, 100], [0, 75]), arc(25, 75, 25, 25, 180, 540))],
  c: [arc(25, 75, 25, 25, -40, -320)],
  d: [arc(25, 75, 25, 25, -30, -390), L([50, 0], [50, 100])],
  e: [join(L([0, 75], [50, 75]), arc(25, 75, 25, 25, 0, -320))],
  f: [join(arc(32, 18, 14, 14, -20, -180), L([18, 18], [18, 100])), L([4, 50], [36, 50])],
  g: [arc(25, 75, 25, 25, -30, -390), join(L([50, 50], [50, 122]), arc(30, 122, 20, 16, 0, 170))],
  h: [L([0, 0], [0, 100]), join(L([0, 100], [0, 72]), arc(25, 72, 25, 22, 180, 360), L([50, 72], [50, 100]))],
  i: [L([12, 50], [12, 100]), L([12, 30])],
  j: [join(L([30, 50], [30, 122]), arc(15, 122, 15, 16, 0, 170)), L([30, 30])],
  k: [L([0, 0], [0, 100]), L([42, 50], [0, 78], [42, 100])],
  l: [L([10, 0], [10, 100])],
  m: [L([0, 50], [0, 100]), join(L([0, 100], [0, 70]), arc(16, 70, 16, 20, 180, 360), L([32, 70], [32, 100], [32, 70]), arc(48, 70, 16, 20, 180, 360), L([64, 70], [64, 100]))],
  n: [L([0, 50], [0, 100]), join(L([0, 100], [0, 72]), arc(25, 72, 25, 22, 180, 360), L([50, 72], [50, 100]))],
  o: [arc(25, 75, 25, 25, -90, -450)],
  p: [L([0, 50], [0, 140]), join(L([0, 100], [0, 75]), arc(25, 75, 25, 25, 180, 540))],
  q: [arc(25, 75, 25, 25, -30, -390), L([50, 50], [50, 140])],
  r: [L([0, 50], [0, 100]), join(L([0, 100], [0, 72]), arc(20, 72, 20, 20, 180, 315))],
  s: [join(arc(24, 62.5, 22, 12.5, -20, -270), arc(24, 87.5, 22, 12.5, -90, 160))],
  t: [L([20, 8], [20, 100]), L([4, 50], [36, 50])],
  u: [join(L([0, 50], [0, 75]), arc(25, 75, 25, 25, 180, 0), L([50, 75], [50, 50])), L([50, 50], [50, 100])],
  v: [L([0, 50], [25, 100], [50, 50])],
  w: [L([0, 50], [15, 100], [30, 60], [45, 100], [60, 50])],
  x: [L([0, 50], [45, 100]), L([45, 50], [0, 100])],
  y: [L([0, 50], [25, 100]), L([50, 50], [12, 140])],
  z: [L([0, 50], [45, 50], [0, 100], [45, 100])],
}

const UPPER: Record<string, Stroke[]> = {
  A: [L([30, 0], [0, 100]), L([30, 0], [60, 100]), L([12, 62], [48, 62])],
  B: [L([0, 0], [0, 100]), join(L([0, 0], [25, 0]), arc(25, 25, 22, 25, -90, 90), L([25, 50], [0, 50])), join(L([0, 50], [28, 50]), arc(28, 75, 24, 25, -90, 90), L([28, 100], [0, 100]))],
  C: [arc(40, 50, 40, 50, -40, -320)],
  D: [L([0, 0], [0, 100]), join(L([0, 0], [20, 0]), arc(20, 50, 38, 50, -90, 90), L([20, 100], [0, 100]))],
  E: [L([0, 0], [0, 100]), L([0, 0], [45, 0]), L([0, 50], [36, 50]), L([0, 100], [45, 100])],
  F: [L([0, 0], [0, 100]), L([0, 0], [45, 0]), L([0, 50], [36, 50])],
  G: [join(arc(40, 50, 40, 50, -40, -360), L([80, 50], [48, 50]))],
  H: [L([0, 0], [0, 100]), L([60, 0], [60, 100]), L([0, 50], [60, 50])],
  I: [L([25, 0], [25, 100]), L([0, 0], [50, 0]), L([0, 100], [50, 100])],
  J: [join(L([40, 0], [40, 75]), arc(20, 75, 20, 25, 0, 180))],
  K: [L([0, 0], [0, 100]), L([50, 0], [0, 55], [50, 100])],
  L: [L([0, 0], [0, 100], [45, 100])],
  M: [L([0, 0], [0, 100]), L([0, 0], [35, 65], [70, 0], [70, 100])],
  N: [L([0, 0], [0, 100]), L([0, 0], [55, 100], [55, 0])],
  O: [arc(40, 50, 40, 50, -90, -450)],
  P: [L([0, 0], [0, 100]), join(L([0, 0], [25, 0]), arc(25, 25, 24, 25, -90, 90), L([25, 50], [0, 50]))],
  Q: [arc(40, 50, 40, 50, -90, -450), L([48, 72], [82, 104])],
  R: [L([0, 0], [0, 100]), join(L([0, 0], [25, 0]), arc(25, 25, 24, 25, -90, 90), L([25, 50], [0, 50])), L([22, 50], [52, 100])],
  S: [join(arc(34, 25, 32, 25, -20, -270), arc(34, 75, 32, 25, -90, 160))],
  T: [L([30, 0], [30, 100]), L([0, 0], [60, 0])],
  U: [join(L([0, 0], [0, 65]), arc(30, 65, 30, 35, 180, 0), L([60, 65], [60, 0]))],
  V: [L([0, 0], [30, 100], [60, 0])],
  W: [L([0, 0], [20, 100], [40, 30], [60, 100], [80, 0])],
  X: [L([0, 0], [60, 100]), L([60, 0], [0, 100])],
  Y: [L([0, 0], [30, 50]), L([60, 0], [30, 50], [30, 100])],
  Z: [L([0, 0], [55, 0], [0, 100], [55, 100])],
}

const DIGITS: Record<string, Stroke[]> = {
  '0': [arc(28, 50, 28, 50, -90, -450)],
  '1': [L([20, 0], [20, 100])],
  '2': [join(arc(25, 28, 25, 26, -160, 0), L([50, 28], [0, 100], [52, 100]))],
  '3': [join(arc(24, 25, 22, 25, -150, 90), arc(24, 75, 26, 25, -90, 150))],
  '4': [L([0, 0], [0, 60], [50, 60]), L([40, 0], [40, 100])],
  '5': [join(L([3, 0], [3, 48], [10.7, 50.7]), arc(25, 72, 25, 26, -125, 150)), L([3, 0], [45, 0])],
  '6': [join(arc(45, 55, 40, 50, -95, -180), L([5, 55], [5, 75]), arc(28, 75, 23, 25, 180, -180))],
  '7': [L([0, 0], [50, 0], [15, 100])],
  '8': [join(arc(25, 25, 20, 25, -90, -270), arc(25, 75, 24, 25, -90, 270), arc(25, 25, 20, 25, 90, -90))],
  '9': [join(arc(25, 28, 24, 26, 0, -360), L([49, 28], [49, 100]))],
}

const PUNCT: Record<string, Stroke[]> = {
  '.': [L([5, 98])],
  ',': [L([6, 96], [2, 110])],
  '!': [L([6, 0], [6, 72]), L([6, 98])],
  '?': [join(arc(22, 22, 22, 22, -170, 90), L([22, 44], [22, 70])), L([22, 98])],
  "'": [L([4, 0], [4, 22])],
  '’': [L([4, 0], [4, 22])],
  '-': [L([0, 70], [28, 70])],
}

export const GLYPHS: Record<string, Stroke[]> = { ...LOWER, ...UPPER, ...DIGITS, ...PUNCT }

export function hasGlyph(ch: string): boolean {
  return ch === ' ' || ch in GLYPHS
}

/** Width of a glyph in glyph units (a single dot counts as 10 wide). */
export function glyphWidth(ch: string): number {
  if (ch === ' ') return 34
  const strokes = GLYPHS[ch]
  if (!strokes) return 40
  return Math.max(10, ...strokes.flat().map(([x]) => x))
}

/** Gap between glyphs, in glyph units. */
export const GLYPH_GAP = 22

export function textWidth(text: string): number {
  return [...text].reduce((w, ch, i) => w + glyphWidth(ch) + (i ? GLYPH_GAP : 0), 0)
}

/** Unit-length direction of a stroke's first movement, for its arrow. */
export function startDirection(stroke: Stroke): Pt | null {
  if (stroke.length < 2) return null
  const [x0, y0] = stroke[0]
  for (let i = 1; i < stroke.length; i++) {
    const dx = stroke[i][0] - x0
    const dy = stroke[i][1] - y0
    const d = Math.hypot(dx, dy)
    if (d >= 6) return [dx / d, dy / d]
  }
  const [x1, y1] = stroke[stroke.length - 1]
  const d = Math.hypot(x1 - x0, y1 - y0) || 1
  return [(x1 - x0) / d, (y1 - y0) / d]
}
