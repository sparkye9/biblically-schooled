import type { ReactNode } from 'react'
import type { ShapeName } from '@/lib/curriculum/math'
import { COIN_VALUE, NAME_PLACEHOLDER, type Block, type Coin, type WorksheetSpec } from '@/lib/worksheets/types'
import { exprText } from '@/lib/worksheets/math-gen'
import { ICONS } from './icons'

/**
 * One printable worksheet = one letter-size page (8.5 × 11 in, 0.5 in margins).
 * Everything is drawn with inline SVG and text, black-and-white friendly.
 * `data-ws-page` / `data-ws-content` are used by the print QA tests to detect
 * clipped content.
 */

const GRADE_LABEL = { 'pre-k': 'Pre-K', k: 'Kindergarten', '1st': '1st Grade' } as const
const DAY_LABEL = ['Introduce', 'Practice', 'Apply', 'Review']
const SUBJECT_LABEL = { bible: 'Bible', literacy: 'Literacy', math: 'Math', family: 'Family Learning' } as const

export function Pic({ name, size = 40, className }: { name: string; size?: number; className?: string }) {
  const Icon = ICONS[name]
  if (!Icon) {
    // Never silently blank: a visible marker makes a missing picture obvious in QA.
    return <span data-missing-picture={name} className="inline-block border border-red-500 text-[10px]">?{name}</span>
  }
  return <Icon size={size} strokeWidth={1.6} className={className} aria-label={name} data-picture={name} />
}

export function WorksheetPage({
  spec,
  studentName,
  date,
  accent,
}: {
  spec: WorksheetSpec
  studentName?: string
  date?: string
  /** Optional CSS color for the header rule (off = pure black & white). */
  accent?: string
}) {
  return (
    <section
      data-ws-page={spec.id}
      className="ws-page relative mx-auto flex flex-col bg-white text-black"
      style={{ width: '8.5in', height: '11in', padding: '0.5in', fontFamily: 'var(--font-nunito), Arial, sans-serif' }}
    >
      <header className="flex items-end justify-between gap-4 border-b-2 pb-2" style={{ borderColor: accent ?? '#000' }}>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider">
            {SUBJECT_LABEL[spec.subject]} · {GRADE_LABEL[spec.grade]}{spec.week > 0 && ` · Week ${spec.week} · ${DAY_LABEL[spec.day] ?? ''}`}
          </p>
          <h1 className="text-[22px] font-extrabold leading-tight" style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}>
            {spec.title}
          </h1>
        </div>
        <div className="shrink-0 space-y-1 text-[13px]">
          <p>
            Name: <span className="inline-block min-w-[2.2in] border-b border-black px-1 font-semibold">{studentName ?? ''}</span>
          </p>
          <p>
            Date: <span className="inline-block min-w-[2.2in] border-b border-black px-1">{date ?? ''}</span>
          </p>
        </div>
      </header>
      <p className="mt-1 text-[11px] italic text-neutral-700">Skill: {spec.objective}</p>
      <div className="mt-2 rounded-md border border-black px-3 py-1.5 text-[14px] font-semibold">
        {spec.instructions}
        {spec.cutAndPaste && <span className="ml-2 text-[12px] font-normal">(You need scissors and glue.)</span>}
      </div>
      <div data-ws-content className="mt-3 flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
        {spec.blocks.map((b, i) => (
          <BlockView key={i} block={b} name={studentName} />
        ))}
      </div>
      <footer className="flex justify-between border-t border-neutral-400 pt-1 text-[9px] text-neutral-600">
        <span>Biblically Schooled</span>
        <span>{spec.activity}</span>
        <span>{spec.id}</span>
      </footer>
    </section>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-1 text-[13px] font-bold">{children}</p>
}

function Bubble({ children }: { children: ReactNode }) {
  return <span className="inline-flex min-w-[44px] items-center justify-center rounded-full border-2 border-black px-2 py-0.5 text-[20px] font-bold">{children}</span>
}

function AnswerBox({ w = 56 }: { w?: number }) {
  return <span className="inline-block h-[40px] rounded border-2 border-black align-middle" style={{ width: w }} />
}

function Blank({ w = 70 }: { w?: number }) {
  return <span className="inline-block border-b-2 border-black align-baseline" style={{ width: w }}>&nbsp;</span>
}

function TraceRow({ text, size }: { text: string; size: 'xl' | 'lg' | 'md' }) {
  const h = size === 'xl' ? 100 : size === 'lg' ? 76 : 54
  const fs = h * 0.72
  const base = h * 0.82
  return (
    <svg viewBox={`0 0 720 ${h}`} width="100%" height={h} aria-label={`Trace: ${text}`}>
      <line x1="0" x2="720" y1={h * 0.1} y2={h * 0.1} stroke="#888" strokeWidth="1" />
      <line x1="0" x2="720" y1={h * 0.46} y2={h * 0.46} stroke="#aaa" strokeWidth="1" strokeDasharray="6 5" />
      <line x1="0" x2="720" y1={base} y2={base} stroke="#000" strokeWidth="1.5" />
      <text
        x="8"
        y={base}
        fontSize={fs}
        fontFamily="Arial, Helvetica, sans-serif"
        fill="none"
        stroke="#555"
        strokeWidth="1.6"
        strokeDasharray="4 3"
        letterSpacing={size === 'md' ? 2 : 6}
        textLength={text.length > 22 ? 700 : undefined}
        lengthAdjust="spacingAndGlyphs"
        style={{ whiteSpace: 'pre' }}
      >
        {text}
      </text>
    </svg>
  )
}

function WriteLines({ count, height = 44 }: { count: number; height?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox={`0 0 720 ${height}`} width="100%" height={height}>
          <line x1="0" x2="720" y1="4" y2="4" stroke="#999" strokeWidth="1" />
          <line x1="0" x2="720" y1={height / 2} y2={height / 2} stroke="#bbb" strokeDasharray="6 5" />
          <line x1="0" x2="720" y1={height - 4} y2={height - 4} stroke="#000" strokeWidth="1.3" />
        </svg>
      ))}
    </div>
  )
}

function Shape({ shape, size = 60, rotate = 0 }: { shape: ShapeName; size?: number; rotate?: number }) {
  const s = size
  const common = { fill: 'none', stroke: '#000', strokeWidth: 2.5 }
  let el: ReactNode
  switch (shape) {
    case 'circle':
      el = <circle cx={s / 2} cy={s / 2} r={s * 0.42} {...common} />
      break
    case 'oval':
      el = <ellipse cx={s / 2} cy={s / 2} rx={s * 0.45} ry={s * 0.28} {...common} />
      break
    case 'square':
      el = <rect x={s * 0.12} y={s * 0.12} width={s * 0.76} height={s * 0.76} {...common} />
      break
    case 'rectangle':
      el = <rect x={s * 0.04} y={s * 0.25} width={s * 0.92} height={s * 0.5} {...common} />
      break
    case 'triangle':
      el = <polygon points={`${s / 2},${s * 0.08} ${s * 0.94},${s * 0.88} ${s * 0.06},${s * 0.88}`} {...common} />
      break
    case 'rhombus':
      el = <polygon points={`${s / 2},${s * 0.05} ${s * 0.9},${s / 2} ${s / 2},${s * 0.95} ${s * 0.1},${s / 2}`} {...common} />
      break
    case 'hexagon': {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i
        return `${s / 2 + s * 0.44 * Math.cos(a)},${s / 2 + s * 0.44 * Math.sin(a)}`
      }).join(' ')
      el = <polygon points={pts} {...common} />
      break
    }
  }
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-label={shape}>
      <g transform={`rotate(${rotate} ${s / 2} ${s / 2})`}>{el}</g>
    </svg>
  )
}

function IconGroup({ icon, n, size = 26, crossLast = 0 }: { icon: string; n: number; size?: number; crossLast?: number }) {
  return (
    <span className="inline-flex max-w-full flex-wrap items-center gap-1">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="relative inline-flex">
          <Pic name={icon} size={size} />
          {i >= n - crossLast && (
            <svg className="absolute inset-0" viewBox="0 0 10 10" width={size} height={size}>
              <line x1="1" y1="1" x2="9" y2="9" stroke="#000" strokeWidth="1.2" />
              <line x1="9" y1="1" x2="1" y2="9" stroke="#000" strokeWidth="1.2" />
            </svg>
          )}
        </span>
      ))}
    </span>
  )
}

function TenFrame({ filled, cell = 28 }: { filled: number; cell?: number }) {
  return (
    <svg width={cell * 5 + 2} height={cell * 2 + 2} viewBox={`0 0 ${cell * 5 + 2} ${cell * 2 + 2}`}>
      {Array.from({ length: 10 }).map((_, i) => {
        const x = 1 + (i % 5) * cell
        const y = 1 + Math.floor(i / 5) * cell
        return (
          <g key={i}>
            <rect x={x} y={y} width={cell} height={cell} fill="none" stroke="#000" strokeWidth="1.5" />
            {i < filled && <circle cx={x + cell / 2} cy={y + cell / 2} r={cell * 0.32} fill="#000" />}
          </g>
        )
      })}
    </svg>
  )
}

function Clock({ h, m, size = 120 }: { h: number; m: number; size?: number }) {
  const c = size / 2
  const hourAngle = (((h % 12) + m / 60) * 30 - 90) * (Math.PI / 180)
  const minAngle = (m * 6 - 90) * (Math.PI / 180)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`clock ${h}:${m === 0 ? '00' : m}`}>
      <circle cx={c} cy={c} r={c - 3} fill="none" stroke="#000" strokeWidth="2.5" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = ((i + 1) * 30 - 90) * (Math.PI / 180)
        return (
          <text key={i} x={c + (c - 16) * Math.cos(a)} y={c + (c - 16) * Math.sin(a) + 5} textAnchor="middle" fontSize={size * 0.12} fontFamily="Arial">
            {i + 1}
          </text>
        )
      })}
      <line x1={c} y1={c} x2={c + c * 0.45 * Math.cos(hourAngle)} y2={c + c * 0.45 * Math.sin(hourAngle)} stroke="#000" strokeWidth="5" strokeLinecap="round" />
      <line x1={c} y1={c} x2={c + c * 0.72 * Math.cos(minAngle)} y2={c + c * 0.72 * Math.sin(minAngle)} stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={c} cy={c} r="4" fill="#000" />
    </svg>
  )
}

const COIN_SIZE: Record<Coin, number> = { dime: 34, penny: 38, nickel: 42, quarter: 48 }
function CoinView({ coin }: { coin: Coin }) {
  const s = COIN_SIZE[coin]
  return (
    <span className="inline-flex flex-col items-center">
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <circle cx={s / 2} cy={s / 2} r={s / 2 - 2} fill="none" stroke="#000" strokeWidth={coin === 'penny' ? 2.5 : 1.8} strokeDasharray={coin === 'dime' || coin === 'quarter' ? '2 1.5' : undefined} />
        <text x={s / 2} y={s / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="Arial">
          {COIN_VALUE[coin]}¢
        </text>
      </svg>
      <span className="text-[10px]">{coin}</span>
    </span>
  )
}

function Fraction({ shape, parts, equal }: { shape: 'circle' | 'rect'; parts: 2 | 4; equal: boolean }) {
  const s = 90
  const st = { stroke: '#000', strokeWidth: 2, fill: 'none' }
  const off = equal ? 0 : 16
  if (shape === 'circle') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <circle cx={45} cy={45} r={40} {...st} />
        <line x1={45 + off} y1={5} x2={45 + off} y2={85} {...st} />
        {parts === 4 && <line x1={5} y1={45 - off} x2={85} y2={45 - off} {...st} />}
      </svg>
    )
  }
  return (
    <svg width={s + 30} height={s * 0.7} viewBox={`0 0 ${s + 30} ${s * 0.7}`}>
      <rect x={3} y={3} width={s + 24} height={s * 0.7 - 6} {...st} />
      <line x1={(s + 30) / 2 + off} y1={3} x2={(s + 30) / 2 + off} y2={s * 0.7 - 3} {...st} />
      {parts === 4 && <line x1={3} y1={(s * 0.7) / 2 + off / 2} x2={s + 27} y2={(s * 0.7) / 2 + off / 2} {...st} />}
    </svg>
  )
}

function BlockView({ block: b, name }: { block: Block; name?: string }) {
  switch (b.type) {
    case 'trace':
      return (
        <div>
          {b.label && <Label>{b.label}</Label>}
          {b.rows.map((row, i) => (
            <TraceRow key={i} text={row === NAME_PLACEHOLDER ? name || 'My Name' : row} size={b.size} />
          ))}
        </div>
      )
    case 'lines':
      return (
        <div>
          {b.label && <Label>{b.label}</Label>}
          <WriteLines count={b.count} />
        </div>
      )
    case 'draw':
      return (
        <div className="rounded-lg border-2 border-black p-2" style={{ minHeight: b.height === 'lg' ? 300 : b.height === 'md' ? 200 : 130 }}>
          <p className="text-[12px] font-bold">{b.label}</p>
        </div>
      )
    case 'letter-grid':
      return (
        <div className="grid grid-cols-8 gap-2 text-center">
          {b.letters.map((l, i) => (
            <span key={i} className="py-1 text-[34px] font-bold" style={{ fontFamily: 'Arial' }}>
              {l}
            </span>
          ))}
        </div>
      )
    case 'match':
      return (
        <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-y-4">
          {b.left.map((cell, i) => (
            <MatchRow key={i} left={cell} right={b.right[i]} />
          ))}
        </div>
      )
    case 'picture-choice':
      return (
        <div>
          <Label>{b.prompt}</Label>
          <div className="space-y-3">
            {b.items.map((it, i) => (
              <div key={i} className="flex items-center gap-6 rounded-lg border border-neutral-400 px-3 py-1.5">
                <span className="w-6 text-[13px]">{i + 1}.</span>
                <Pic name={it.picture} size={58} />
                <div className="flex gap-4">
                  {it.choices.map((c) => (
                    <Bubble key={c}>{c}</Bubble>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    case 'picture-write':
      return (
        <div>
          <Label>{b.prompt}</Label>
          <div className="grid grid-cols-2 gap-5">
            {b.items.map((it, i) => (
              <div key={i} className="flex flex-col items-center gap-2 rounded-lg border border-neutral-400 p-2">
                <Pic name={it.picture} size={70} />
                <div className="flex gap-1">
                  {Array.from({ length: it.boxes ?? it.answer.length }).map((_, j) => (
                    <span key={j} className="inline-block h-[46px] w-[40px] border-2 border-black" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    case 'count':
      return (
        <div className="grid grid-cols-2 gap-4">
          {b.items.map((it, i) => (
            <div key={i} className="flex min-h-[150px] flex-col justify-between rounded-lg border border-neutral-400 p-2">
              <div className="flex flex-wrap gap-1.5">
                <IconGroup icon={it.icon} n={it.count} size={it.count > 10 ? 22 : 30} />
              </div>
              <div className="mt-2 flex items-center justify-end gap-3">
                {it.choices ? it.choices.map((c) => <Bubble key={c}>{c}</Bubble>) : <AnswerBox />}
              </div>
            </div>
          ))}
        </div>
      )
    case 'shape-find':
      return (
        <div className="grid grid-cols-4 place-items-center gap-y-4 rounded-lg border border-neutral-400 p-3">
          {b.shapes.map((s, i) => (
            <Shape key={i} shape={s.shape} size={Math.round(70 * s.scale)} rotate={s.rotate} />
          ))}
          <p className="col-span-4 justify-self-end text-[14px] font-bold">
            I found <AnswerBox w={50} /> {b.target}s.
          </p>
        </div>
      )
    case 'shape-table':
      return (
        <table className="w-full border-collapse text-[15px]">
          <thead>
            <tr>
              <th className="border border-black p-1">Shape</th>
              <th className="border border-black p-1">Sides</th>
              <th className="border border-black p-1">Corners</th>
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-1 text-center">
                  <Shape shape={r.shape} size={64} />
                </td>
                <td className="border border-black p-1" />
                <td className="border border-black p-1" />
              </tr>
            ))}
          </tbody>
        </table>
      )
    case 'pattern':
      return (
        <div className="space-y-3">
          {b.rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-400 px-3 py-2">
              <div className="flex items-center gap-1.5">
                {r.seq.map((s, j) => (
                  <Pic key={j} name={s} size={36} />
                ))}
                <span className="ml-1 inline-flex h-[42px] w-[42px] items-center justify-center border-2 border-dashed border-black text-[22px] font-bold">?</span>
              </div>
              <div className="flex gap-2">
                {r.choices.map((c) => (
                  <span key={c} className="rounded-full border-2 border-black p-1">
                    <Pic name={c} size={28} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    case 'compare-groups':
      return (
        <div className="space-y-3">
          {b.items.map((it, i) => (
            <div key={i} className="grid grid-cols-2 gap-4">
              {[it.left, it.right].map((n, j) => (
                <div key={j} className="flex min-h-[110px] flex-wrap content-center items-center justify-center gap-1 rounded-xl border-2 border-black p-2">
                  <IconGroup icon={it.icon} n={n} size={30} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )
    case 'compare-numbers':
      return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-[28px] font-bold">
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center justify-center gap-4">
              <span>{it.left}</span>
              {b.symbols ? <span className="inline-block h-[44px] w-[44px] rounded-full border-2 border-black" /> : <span className="text-[16px] font-normal">or</span>}
              <span>{it.right}</span>
            </div>
          ))}
        </div>
      )
    case 'size-compare':
      return (
        <div className="space-y-3">
          {b.items.map((it, i) => (
            <div key={i} className="grid grid-cols-[24px_1fr_1fr] items-end gap-4 rounded-lg border border-neutral-400 p-2">
              <span className="self-center text-[13px]">{i + 1}.</span>
              {[it.a, it.b].map((t, j) => (
                <div key={j} className="flex min-h-[100px] items-end justify-center">
                  {t.bar === 'tall' ? (
                    <div className="flex flex-col items-center">
                      <Pic name={t.icon} size={22} />
                      {Array.from({ length: t.units ?? 1 }).map((_, k) => (
                        <span key={k} className="block h-[11px] w-[34px] border border-black" />
                      ))}
                    </div>
                  ) : t.bar === 'long' ? (
                    <div className="flex items-center">
                      <Pic name={t.icon} size={22} />
                      <span className="block h-[14px] border-2 border-black" style={{ width: (t.units ?? 1) * 30 }} />
                    </div>
                  ) : (
                    <Pic name={t.icon} size={Math.round(70 * t.scale)} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )
    case 'ten-frame':
      return (
        <div className="grid grid-cols-2 gap-5">
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center justify-center gap-4">
              <TenFrame filled={it.filled} />
              <AnswerBox />
            </div>
          ))}
        </div>
      )
    case 'number-bond':
      return (
        <div className="grid grid-cols-3 gap-6">
          {b.items.map((it, i) => (
            <svg key={i} viewBox="0 0 160 140" width="100%" height={140}>
              <line x1="80" y1="45" x2="35" y2="105" stroke="#000" strokeWidth="2" />
              <line x1="80" y1="45" x2="125" y2="105" stroke="#000" strokeWidth="2" />
              {[
                { x: 80, y: 32, v: it.whole, hide: it.hide === 'whole' },
                { x: 35, y: 108, v: it.a, hide: it.hide === 'a' },
                { x: 125, y: 108, v: it.b, hide: it.hide === 'b' },
              ].map((c, j) => (
                <g key={j}>
                  <circle cx={c.x} cy={c.y} r="26" fill="#fff" stroke="#000" strokeWidth="2.5" />
                  {!c.hide && (
                    <text x={c.x} y={c.y + 9} textAnchor="middle" fontSize="26" fontWeight="bold" fontFamily="Arial">
                      {c.v}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          ))}
        </div>
      )
    case 'picture-equation':
      return (
        <div className="space-y-3">
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-neutral-400 p-2 text-[24px] font-bold">
              {it.op === '+' ? (
                <>
                  <IconGroup icon={it.icon} n={it.a} size={28} />
                  <span>+</span>
                  <IconGroup icon={it.icon} n={it.b} size={28} />
                </>
              ) : (
                <IconGroup icon={it.icon} n={it.a} size={28} crossLast={it.b} />
              )}
              <span className="ml-auto whitespace-nowrap">
                {it.a} {it.op === '+' ? '+' : '−'} {it.b} = <AnswerBox w={50} />
              </span>
            </div>
          ))}
        </div>
      )
    case 'equations':
      return (
        <div className={`grid gap-x-8 gap-y-5 text-[26px] font-bold ${b.columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap">
              <span className="w-6 text-[12px] font-normal">{i + 1}.</span>
              {it.terms.map((t, j) => (
                <span key={j} className="inline-flex items-center gap-2">
                  {t === null ? <AnswerBox w={52} /> : <span>{t}</span>}
                  {j < it.ops.length && <span>{it.ops[j] === '-' ? '−' : it.ops[j]}</span>}
                </span>
              ))}
            </div>
          ))}
        </div>
      )
    case 'true-false':
      return (
        <div className="space-y-2.5 text-[24px] font-bold">
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-400 px-3 py-1">
              <span>
                {exprText(it.left)} = {exprText(it.right)}
              </span>
              <span className="flex gap-3 text-[16px]">
                <Bubble>true</Bubble>
                <Bubble>false</Bubble>
              </span>
            </div>
          ))}
        </div>
      )
    case 'fact-family':
      return (
        <div className="grid grid-cols-3 gap-4">
          {b.items.map((f, i) => (
            <div key={i} className="flex flex-col items-center">
              <svg viewBox="0 0 160 70" width="100%" height={70}>
                <polygon points="80,4 156,66 4,66" fill="none" stroke="#000" strokeWidth="2.5" />
                <text x="80" y="36" textAnchor="middle" fontSize="20" fontWeight="bold" fontFamily="Arial">{f.whole}</text>
                <text x="48" y="60" textAnchor="middle" fontSize="18" fontFamily="Arial">{f.a}</text>
                <text x="112" y="60" textAnchor="middle" fontSize="18" fontFamily="Arial">{f.b}</text>
              </svg>
              <div className="w-full border-2 border-t-0 border-black p-2 text-[18px] leading-[2.1]">
                {['+', '+', '−', '−'].map((op, j) => (
                  <p key={j}>
                    <Blank w={30} /> {op} <Blank w={30} /> = <Blank w={30} />
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    case 'word-problems':
      return (
        <div className="space-y-3">
          {b.items.map((it, i) => (
            <div key={i} className="rounded-lg border border-neutral-500 p-2">
              <p className="text-[16px] leading-snug">
                <span className="font-bold">{i + 1}.</span> {it.text}
              </p>
              <div className="mt-1 flex min-h-[64px] items-end justify-between gap-2">
                {b.showPictures ? (
                  <span className="flex flex-wrap items-center gap-2">
                    <IconGroup icon={it.icon} n={it.a} size={22} />
                    {it.op === '+' && (
                      <>
                        <b>+</b>
                        <IconGroup icon={it.icon} n={it.b} size={22} />
                      </>
                    )}
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-600">Show your work (draw or write):</span>
                )}
                <span className="whitespace-nowrap text-[16px]">
                  <Blank w={40} /> {it.op === '+' ? '+' : '−'} <Blank w={40} /> = <AnswerBox w={50} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )
    case 'number-line':
      return (
        <div className="space-y-3">
          {b.items.map((it, i) => (
            <div key={i}>
              <p className="text-[15px]">
                {i + 1}. Start at <b>{it.start}</b>. Jump {it.op === '+' ? 'forward' : 'back'} <b>{it.jump}</b>. I land on <AnswerBox w={46} />
              </p>
              <svg viewBox="0 0 720 48" width="100%" height={48}>
                <line x1="12" x2="708" y1="20" y2="20" stroke="#000" strokeWidth="2" />
                {Array.from({ length: b.max + 1 }).map((_, n) => {
                  const x = 12 + (n * 696) / b.max
                  return (
                    <g key={n}>
                      <line x1={x} x2={x} y1="12" y2="28" stroke="#000" strokeWidth="1.5" />
                      <text x={x} y="44" textAnchor="middle" fontSize={b.max > 12 ? 11 : 14} fontFamily="Arial">{n}</text>
                    </g>
                  )
                })}
              </svg>
            </div>
          ))}
        </div>
      )
    case 'base-ten':
      return (
        <div className="grid grid-cols-2 gap-4">
          {b.items.map((it, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-neutral-400 p-2">
              <svg viewBox="0 0 300 110" width="100%" height={110}>
                {Array.from({ length: it.tens }).map((_, t) => (
                  <g key={t}>
                    {Array.from({ length: 10 }).map((__, k) => (
                      <rect key={k} x={4 + t * 18} y={4 + k * 10} width="14" height="10" fill="none" stroke="#000" strokeWidth="1.2" />
                    ))}
                  </g>
                ))}
                {Array.from({ length: it.ones }).map((_, o) => (
                  <rect key={o} x={30 + it.tens * 18 + (o % 3) * 16} y={60 + Math.floor(o / 3) * 16 - 40} width="12" height="12" fill="none" stroke="#000" strokeWidth="1.2" />
                ))}
              </svg>
              <p className="text-[15px]">
                <Blank w={30} /> tens <Blank w={30} /> ones = <Blank w={44} />
              </p>
            </div>
          ))}
        </div>
      )
    case 'ten-more-less':
      return (
        <table className="w-full border-collapse text-center text-[22px] font-bold">
          <thead>
            <tr className="text-[14px]">
              <th className="border border-black p-1">10 less</th>
              <th className="border border-black p-1">Number</th>
              <th className="border border-black p-1">10 more</th>
            </tr>
          </thead>
          <tbody>
            {b.items.map((n, i) => (
              <tr key={i}>
                <td className="h-[40px] border border-black" />
                <td className="border border-black">{n}</td>
                <td className="border border-black" />
              </tr>
            ))}
          </tbody>
        </table>
      )
    case 'hundred-chart':
      return (
        <div className="grid grid-cols-10 border-l border-t border-black text-center text-[17px] font-bold">
          {Array.from({ length: b.count }).map((_, i) => {
            const n = b.start + i
            return (
              <span key={n} className="flex h-[38px] items-center justify-center border-b border-r border-black">
                {b.blanks.includes(n) ? '' : n}
              </span>
            )
          })}
        </div>
      )
    case 'skip-count':
      return (
        <div className="space-y-3">
          {b.rows.map((r, i) => (
            <div key={i} className="flex gap-2">
              {r.values.map((v, j) => (
                <span key={j} className="flex h-[48px] flex-1 items-center justify-center rounded border-2 border-black text-[22px] font-bold">
                  {r.blanks.includes(j) ? '' : v}
                </span>
              ))}
            </div>
          ))}
        </div>
      )
    case 'clocks':
      return (
        <div className="grid grid-cols-3 gap-5">
          {b.items.map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Clock h={c.h} m={c.m} />
              <p className="text-[22px] font-bold">
                <AnswerBox w={40} /> : <AnswerBox w={40} />
              </p>
            </div>
          ))}
        </div>
      )
    case 'coins':
      return (
        <div className="space-y-3">
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-400 p-2">
              <div className="flex flex-wrap items-end gap-2">
                {it.coins.map((c, j) => (
                  <CoinView key={j} coin={c} />
                ))}
              </div>
              <span className="text-[20px] font-bold">
                <AnswerBox w={56} /> ¢
              </span>
            </div>
          ))}
          <p className="text-[11px] text-neutral-600">Coins are drawn by size with their value. Use real coins for extra practice.</p>
        </div>
      )
    case 'measure':
      return (
        <div className="space-y-4">
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center">
                  <Pic name={it.icon} size={24} />
                  <span className="block h-[12px] bg-neutral-300" style={{ width: it.units * 40 - 24 }} />
                </div>
                <div className="flex">
                  {Array.from({ length: it.units }).map((_, k) => (
                    <span key={k} className="block h-[22px] w-[40px] border-2 border-black" />
                  ))}
                </div>
              </div>
              <span className="whitespace-nowrap text-[16px]">
                <AnswerBox w={46} /> units long
              </span>
            </div>
          ))}
        </div>
      )
    case 'graph':
      return (
        <div>
          <div className="rounded-lg border-2 border-black p-2">
            {b.categories.map((c, i) => (
              <div key={i} className="flex items-center gap-2 border-b border-neutral-300 py-1 last:border-0">
                <span className="w-24 text-[14px] font-bold capitalize">{c.label}</span>
                <IconGroup icon={c.icon} n={c.count} size={28} />
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-2 text-[15px]">
            {b.questions.map((q, i) => (
              <p key={i}>
                {i + 1}. {q.q} <Blank w={120} />
              </p>
            ))}
          </div>
        </div>
      )
    case 'fractions':
      return (
        <div className="grid grid-cols-3 gap-5">
          {b.items.map((it, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Fraction shape={it.shape} parts={it.parts} equal={it.equal} />
              <div className="flex flex-wrap justify-center gap-1 text-[12px]">
                {['halves', 'fourths', 'not equal'].map((w) => (
                  <span key={w} className="rounded-full border border-black px-2">{w}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    case 'sort':
      return (
        <div>
          <div className="grid grid-cols-2 gap-4">
            {b.columns.map((c, i) => (
              <div key={i} className="min-h-[200px] rounded-xl border-2 border-black p-2">
                <p className="text-center text-[18px] font-bold">{c}</p>
              </div>
            ))}
          </div>
          <div className={`mt-4 grid grid-cols-4 gap-3 ${b.cut ? 'rounded-lg border-2 border-dashed border-black p-2' : ''}`}>
            {b.cut && <p className="col-span-4 text-[11px]">✂ Cut along the dashed lines.</p>}
            {b.items.map((it, i) => (
              <span key={i} className={`flex h-[90px] items-center justify-center ${b.cut ? 'border border-dashed border-black' : ''}`}>
                <Pic name={it.picture} size={58} />
              </span>
            ))}
          </div>
        </div>
      )
    case 'ordinal':
      return (
        <div>
          <div className="flex items-center gap-5 rounded-lg border border-neutral-400 p-3">
            <span className="text-[12px] font-bold">FRONT</span>
            <Pic name="ArrowRight" size={20} className="rotate-180" />
            {b.icons.map((ic, i) => (
              <Pic key={i} name={ic} size={58} />
            ))}
          </div>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-[16px]">
            {b.prompts.map((p, i) => (
              <li key={i}>{p.text}</li>
            ))}
          </ol>
        </div>
      )
    case 'one-more':
      return (
        <div className="grid grid-cols-2 gap-4">
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center justify-between gap-2 rounded-lg border border-neutral-400 p-2">
              <span className="flex flex-wrap items-center gap-1">
                <IconGroup icon={it.icon} n={it.n} size={24} crossLast={b.less ? 1 : 0} />
                {!b.less && <span className="ml-1 inline-flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-dashed border-black text-[12px]">+1</span>}
              </span>
              <AnswerBox w={48} />
            </div>
          ))}
        </div>
      )
    case 'word-list':
      return (
        <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-[26px] font-semibold">
          {b.words.map((w) => (
            <span key={w} className="flex items-center gap-2">
              <span className="inline-block h-[22px] w-[22px] shrink-0 border-2 border-black" />
              {w}
            </span>
          ))}
        </div>
      )
    case 'word-sort':
      return (
        <div>
          <div className="mb-3 flex flex-wrap gap-3 rounded-lg border border-neutral-500 p-2 text-[20px] font-semibold">
            {b.words.map((w) => (
              <span key={w.word}>{w.word}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {b.columns.map((c) => (
              <div key={c} className="rounded-lg border-2 border-black p-2">
                <p className="text-center text-[15px] font-bold">{c}</p>
                <WriteLines count={Math.ceil(b.words.length / 2)} height={38} />
              </div>
            ))}
          </div>
        </div>
      )
    case 'sentences':
      return (
        <div>
          <Label>{b.prompt}</Label>
          <div className="space-y-3">
            {b.items.map((it, i) => (
              <div key={i}>
                <p className="text-[21px] leading-snug">
                  {i + 1}. {it.text}
                </p>
                {it.choices ? (
                  <div className="mt-1 flex gap-3 pl-6">
                    {it.choices.map((c) => (
                      <Bubble key={c}>{c}</Bubble>
                    ))}
                  </div>
                ) : it.answer && !it.text.includes('→') && !it.text.endsWith('___') ? (
                  <WriteLines count={1} height={40} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )
    case 'passage':
      return (
        <div>
          <div className="rounded-lg border-2 border-black p-3">
            <p className="mb-1 text-center text-[18px] font-extrabold">{b.title}</p>
            <p className="text-[19px] leading-[1.65]">{b.text}</p>
          </div>
          <div className="mt-3 space-y-2">
            {b.questions.map((q, i) => (
              <div key={i}>
                <p className="text-[16px] font-semibold">
                  {i + 1}. {q.q}
                </p>
                <WriteLines count={1} height={36} />
              </div>
            ))}
          </div>
        </div>
      )
    case 'verse': {
      const words = b.text.split(' ')
      const lines: string[] = []
      const per = b.mode === 'trace' ? 22 : 999
      let cur = ''
      for (const w of words) {
        if ((cur + ' ' + w).trim().length > per) {
          lines.push(cur.trim())
          cur = w
        } else cur += ' ' + w
      }
      if (cur.trim()) lines.push(cur.trim())
      return (
        <div>
          <Label>Memory verse — {b.ref} (KJV)</Label>
          {b.mode === 'trace' ? (
            lines.map((l, i) => <TraceRow key={i} text={l} size="lg" />)
          ) : (
            <>
              <p className="rounded border border-neutral-500 p-2 text-[17px] italic leading-snug">“{b.text}”</p>
              <p className="mt-2 text-[13px] font-bold">Copy the verse:</p>
              <WriteLines count={Math.min(4, Math.ceil(b.text.length / 48))} />
            </>
          )}
        </div>
      )
    }
    case 'talk':
      return (
        <div className="rounded-lg border border-dashed border-black p-2 text-[14px]">
          <p className="font-bold">Talk about it (grown-up reads):</p>
          <ul className="list-disc pl-5">
            {b.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      )
    case 'feelings':
      return (
        <div className="space-y-4">
          {b.prompts.map((p, i) => (
            <div key={i} className="rounded-lg border border-neutral-500 p-2">
              <p className="text-[16px] font-semibold">{p}</p>
              <div className="mt-1 flex items-center gap-4">
                {['Laugh', 'Smile', 'Meh', 'Frown', 'Angry'].map((f) => (
                  <Pic key={f} name={f} size={34} />
                ))}
              </div>
              <WriteLines count={1} height={36} />
            </div>
          ))}
        </div>
      )
    case 'syllables':
      return (
        <div className="space-y-3">
          {b.items.map((it, i) => (
            <div key={i} className="flex items-center gap-6 rounded-lg border border-neutral-400 p-2">
              <Pic name={it.picture} size={56} />
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <span key={n} className="inline-block h-[40px] w-[52px] border-2 border-black" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )
  }
}

function MatchRow({ left, right }: { left: { text?: string; picture?: string }; right?: { text?: string; picture?: string } }) {
  const cell = (c?: { text?: string; picture?: string }) =>
    c?.picture ? <Pic name={c.picture} size={56} /> : <span className="text-[38px] font-bold" style={{ fontFamily: 'Arial' }}>{c?.text}</span>
  return (
    <>
      <span className="flex items-center justify-end gap-3">
        {cell(left)}
        <span className="h-3 w-3 rounded-full bg-black" />
      </span>
      <span />
      <span className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-black" />
        {cell(right)}
      </span>
    </>
  )
}

/** Parent-only answer key page for a set of worksheets. */
export function AnswerKeyPage({ title, specs }: { title: string; specs: WorksheetSpec[] }) {
  return (
    <section className="ws-page mx-auto bg-white text-black" style={{ width: '8.5in', minHeight: '11in', padding: '0.5in' }}>
      <h1 className="border-b-2 border-black pb-1 text-[20px] font-extrabold">Answer Key — {title}</h1>
      <p className="mt-1 text-[11px]">Parent section. Keep separate from student pages.</p>
      <div className="mt-3 columns-2 gap-6 text-[11px] leading-snug">
        {specs.map((s) => (
          <div key={s.id} className="mb-3 break-inside-avoid">
            <p className="font-bold">
              {s.title} <span className="font-normal">({GRADE_LABEL[s.grade]} · {DAY_LABEL[s.day]} · {s.id})</span>
            </p>
            {s.answerKey.map((a, i) => (
              <p key={i}>{a}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
