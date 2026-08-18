'use client'

import { useState } from 'react'
import { accent, accentBg } from '@/lib/ui'
import { Plus, Minus, RotateCcw } from 'lucide-react'

export function NumberBondBoard({ color }: { color: string }) {
  const [whole, setWhole] = useState(7)
  // counters split into left / right
  const [left, setLeft] = useState(3)
  const right = whole - left

  function setTotal(n: number) {
    const clamped = Math.max(1, Math.min(10, n))
    setWhole(clamped)
    setLeft(Math.min(left, clamped))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm font-semibold text-muted-foreground">Whole</span>
        <button
          onClick={() => setTotal(whole - 1)}
          className="flex size-9 items-center justify-center rounded-full border border-border text-foreground"
          aria-label="Fewer counters"
        >
          <Minus className="size-4" />
        </button>
        <span
          className="flex size-14 items-center justify-center rounded-2xl text-2xl font-black text-white"
          style={{ backgroundColor: `var(--${color})` }}
        >
          {whole}
        </span>
        <button
          onClick={() => setTotal(whole + 1)}
          className="flex size-9 items-center justify-center rounded-full border border-border text-foreground"
          aria-label="More counters"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {/* Number bond diagram */}
      <div className="flex flex-col items-center">
        <span
          className="flex size-16 items-center justify-center rounded-full text-2xl font-black text-white"
          style={{ backgroundColor: `var(--${color})` }}
        >
          {whole}
        </span>
        <div className="flex w-40 justify-between">
          <span className="h-8 w-px -rotate-[24deg] bg-border" />
          <span className="h-8 w-px rotate-[24deg] bg-border" />
        </div>
        <div className="flex gap-12">
          <span
            className="flex size-14 items-center justify-center rounded-full text-xl font-black"
            style={accentBg(color, 0.2)}
          >
            {left}
          </span>
          <span
            className="flex size-14 items-center justify-center rounded-full text-xl font-black"
            style={accentBg(color, 0.2)}
          >
            {right}
          </span>
        </div>
      </div>

      {/* Ten frame counters — tap to move between sides */}
      <div>
        <p className="mb-2 text-center text-sm font-semibold text-foreground">
          Tap a counter to move it across
        </p>
        <div className="grid grid-cols-2 gap-3">
          <CounterPan
            label="Part 1"
            count={left}
            color={color}
            onTap={() => left > 0 && setLeft(left - 1)}
          />
          <CounterPan
            label="Part 2"
            count={right}
            color={color}
            onTap={() => right > 0 && setLeft(left + 1)}
          />
        </div>
      </div>

      <p className="text-center font-serif text-lg font-semibold text-foreground">
        {left} <span style={accent(color)}>+</span> {right}{' '}
        <span style={accent(color)}>=</span> {whole}
      </p>

      <div className="flex justify-center">
        <button
          onClick={() => {
            setWhole(7)
            setLeft(3)
          }}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-semibold text-foreground"
        >
          <RotateCcw className="size-4" /> Reset
        </button>
      </div>
    </div>
  )
}

function CounterPan({
  label,
  count,
  color,
  onTap,
}: {
  label: string
  count: number
  color: string
  onTap: () => void
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex min-h-24 flex-wrap content-start justify-center gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={onTap}
            className="size-9 rounded-full shadow-sm transition-transform active:scale-90"
            style={{ backgroundColor: `var(--${color})` }}
            aria-label="Move counter"
          />
        ))}
        {count === 0 && (
          <span className="self-center text-sm text-muted-foreground">empty</span>
        )}
      </div>
    </div>
  )
}
