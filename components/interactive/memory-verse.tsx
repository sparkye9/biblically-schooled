'use client'

import { useState } from 'react'
import { speak } from '@/lib/speech'
import { accent, accentBg } from '@/lib/ui'
import { Volume2, Eye, RotateCcw } from 'lucide-react'

export function MemoryVerseBoard({
  verse,
  reference,
  color,
}: {
  verse: string
  reference: string
  color: string
}) {
  const words = verse.replace(/[.,]/g, '').split(' ')
  const [hidden, setHidden] = useState<number[]>([])

  function hideNext() {
    const visible = words.map((_, i) => i).filter((i) => !hidden.includes(i))
    if (visible.length === 0) return
    // hide a random currently-visible word
    const pick = visible[Math.floor(Math.random() * visible.length)]
    setHidden((h) => [...h, pick])
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card p-6 text-center">
        <p className="flex flex-wrap justify-center gap-x-2 gap-y-1 font-serif text-2xl font-semibold leading-relaxed text-foreground">
          {words.map((w, i) => (
            <button
              key={i}
              onClick={() =>
                setHidden((h) =>
                  h.includes(i) ? h.filter((x) => x !== i) : [...h, i],
                )
              }
              className="rounded-lg px-1 transition-colors"
              style={
                hidden.includes(i)
                  ? { ...accentBg(color, 0.18), color: 'transparent' }
                  : undefined
              }
            >
              {hidden.includes(i) ? '\u00A0\u00A0\u00A0\u00A0' : w}
            </button>
          ))}
        </p>
        <p className="mt-3 text-sm font-bold" style={accent(color)}>
          {reference}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => speak(verse)}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold"
          style={accentBg(color, 0.16)}
        >
          <Volume2 className="size-4" /> Say it aloud
        </button>
        <button
          onClick={hideNext}
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
        >
          <Eye className="size-4" /> Hide a word
        </button>
        <button
          onClick={() => setHidden([])}
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
        >
          <RotateCcw className="size-4" /> Show all
        </button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Hide one word at a time and say the verse together until every word is
        covered.
      </p>
    </div>
  )
}
