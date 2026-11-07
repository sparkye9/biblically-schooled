import { GLYPHS, GLYPH_GAP, glyphWidth, startDirection, type Stroke } from '@/lib/curriculum/handwriting-glyphs'
import type { HandwritingRow } from '@/lib/worksheets/types'

/**
 * One row of handwriting practice on print-size guide lines (top line, dashed
 * midline, baseline). Letters are drawn from stroke data:
 *  - guided: dotted letters with a green starting dot (numbered by stroke) and a direction arrow
 *  - trace:  dotted letters only
 *  - copy:   one solid model with starting dots, then empty space to write
 *  - write:  empty guide lines
 */

const SCALE = { lg: 0.78, md: 0.52 } as const
/** Room on the left so the first letter's arrow is not clipped. */
const PAD_X = 26

export function HandwritingLine({ row, name }: { row: HandwritingRow; name?: string }) {
  const k = SCALE[row.size]
  const top = 12
  const h = Math.round(top + 145 * k + 6)
  const y = (v: number) => top + v * k
  const text = row.text.replace('{{NAME}}', name || 'My Name')
  const glyphs: { ch: string; x: number }[] = []
  let x = PAD_X / k
  for (const ch of text) {
    glyphs.push({ ch, x })
    x += glyphWidth(ch) + GLYPH_GAP
  }
  const showText = row.mode === 'write' ? [] : glyphs
  const endX = x - GLYPH_GAP
  // A long model (a word or sentence) gets its own empty line underneath to copy onto.
  const copyBelow = row.mode === 'copy' && endX * k > 360

  return (
    <div className="break-inside-avoid">
      {row.label && <p className="mb-0.5 text-[12px] font-bold">{row.label}</p>}
      <svg viewBox={`0 0 720 ${h}`} width="100%" height={h} role="img" aria-label={`${row.mode}: ${text}`}>
        <line x1="0" x2="720" y1={y(0)} y2={y(0)} stroke="#555" strokeWidth="1.2" />
        <line x1="0" x2="720" y1={y(50)} y2={y(50)} stroke="#999" strokeWidth="1" strokeDasharray="7 6" />
        <line x1="0" x2="720" y1={y(100)} y2={y(100)} stroke="#000" strokeWidth="1.6" />
        {row.mode === 'copy' && !copyBelow && <line x1={endX * k + 16} x2={endX * k + 16} y1={y(-4)} y2={y(108)} stroke="#bbb" strokeWidth="1" />}
        {showText.map((g, i) =>
          g.ch === ' ' || !GLYPHS[g.ch] ? null : (
            <Glyph
              key={i}
              strokes={GLYPHS[g.ch]}
              ox={g.x}
              k={k}
              top={top}
              // Full stroke numbers and arrows on the first of each letter; later copies just get the starting dot.
              // Short copy models (a letter or two) show starting dots; words, names, and sentences stay clean.
              mode={row.mode === 'copy' ? (glyphs.length <= 6 ? 'model' : 'plain') : row.mode === 'guided' ? (glyphs.findIndex((o) => o.ch === g.ch) === i ? 'guided' : 'start') : 'trace'}
            />
          ),
        )}
      </svg>
      {copyBelow && (
        <svg viewBox={`0 0 720 ${h}`} width="100%" height={h} aria-hidden>
          <line x1="0" x2="720" y1={y(0)} y2={y(0)} stroke="#555" strokeWidth="1.2" />
          <line x1="0" x2="720" y1={y(50)} y2={y(50)} stroke="#999" strokeWidth="1" strokeDasharray="7 6" />
          <line x1="0" x2="720" y1={y(100)} y2={y(100)} stroke="#000" strokeWidth="1.6" />
        </svg>
      )}
    </div>
  )
}

function Glyph({ strokes, ox, k, top, mode }: { strokes: Stroke[]; ox: number; k: number; top: number; mode: 'guided' | 'start' | 'trace' | 'model' | 'plain' }) {
  const px = (p: [number, number]) => [(ox + p[0]) * k, top + p[1] * k] as const
  const dotted = mode !== 'model' && mode !== 'plain'
  const width = mode === 'model' || mode === 'plain' ? 3.2 : 2.4
  return (
    <g>
      {strokes.map((s, i) => {
        if (s.length === 1) {
          const [cx, cy] = px(s[0])
          return <circle key={i} cx={cx} cy={cy} r={dotted ? 2.6 : 3.2} fill={dotted ? 'none' : '#222'} stroke="#444" strokeWidth={1.4} />
        }
        const d = s.map((p, j) => `${j ? 'L' : 'M'}${px(p)[0].toFixed(1)} ${px(p)[1].toFixed(1)}`).join(' ')
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={dotted ? '#666' : '#222'}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dotted ? '0.1 6' : undefined}
          />
        )
      })}
      {(mode === 'guided' || mode === 'model' || mode === 'start') &&
        strokes.map((s, i) => {
          if (mode === 'start' && i > 0) return null
          let [sx, sy] = px(s[0])
          // Two strokes starting at the same place: nudge the later dot so both numbers show.
          const twins = strokes.slice(0, i).filter((o) => Math.hypot(o[0][0] - s[0][0], o[0][1] - s[0][1]) < 6).length
          if (twins && mode === 'guided') sx += 11 * twins
          const dir = startDirection(s)
          return (
            <g key={`m${i}`}>
              <circle cx={sx} cy={sy} r={mode === 'guided' ? 5 : mode === 'start' ? 4 : 3.6} fill="#2f8f4e" />
              {mode === 'guided' && strokes.length > 1 && (
                <text x={sx} y={sy + 2.6} fontSize="7" fontWeight="700" textAnchor="middle" fill="#fff">
                  {i + 1}
                </text>
              )}
              {mode === 'guided' && dir && <Arrow x={sx} y={sy} dir={dir} />}
            </g>
          )
        })}
    </g>
  )
}

/** A small arrow beside the start of a stroke, pointing the way the pencil moves. */
function Arrow({ x, y, dir }: { x: number; y: number; dir: [number, number] }) {
  const [dx, dy] = dir
  // offset to the side of the stroke so it never covers the dotted line
  const nx = -dy
  const ny = dx
  const ax = x + nx * 11 + dx * 6
  const ay = y + ny * 11 + dy * 6
  const len = 12
  const bx = ax + dx * len
  const by = ay + dy * len
  const head = 4
  return (
    <g stroke="#c0392b" strokeWidth="1.6" fill="none" strokeLinecap="round">
      <line x1={ax} y1={ay} x2={bx} y2={by} />
      <line x1={bx} y1={by} x2={bx - dx * head - dy * head} y2={by - dy * head + dx * head} />
      <line x1={bx} y1={by} x2={bx - dx * head + dy * head} y2={by - dy * head - dx * head} />
    </g>
  )
}
