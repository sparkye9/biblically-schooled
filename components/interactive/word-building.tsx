'use client'

import { useState } from 'react'
import { speak } from '@/lib/speech'
import { accent, accentBg } from '@/lib/ui'
import { Volume2, RotateCcw, PartyPopper } from 'lucide-react'

const WORDS = ['cat', 'sat', 'map', 'pan', 'tap']
const TILES = ['c', 'a', 't', 's', 'm', 'p', 'n']

export function WordBuilder({ color }: { color: string }) {
  const [target, setTarget] = useState(WORDS[0])
  const [built, setBuilt] = useState<string[]>([])
  const complete = built.join('') === target

  function place(letter: string) {
    if (built.length >= target.length) return
    const next = [...built, letter]
    setBuilt(next)
    speak(letter)
    if (next.join('') === target) {
      setTimeout(() => speak(target), 350)
    }
  }

  function reset(word = target) {
    setBuilt([])
    setTarget(word)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card p-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Build the word
          </p>
          <button
            onClick={() => speak(target)}
            className="text-muted-foreground"
            aria-label="Hear the word"
          >
            <Volume2 className="size-4" />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {target.split('').map((_, i) => (
            <div
              key={i}
              className="flex size-16 items-center justify-center rounded-2xl border-2 text-3xl font-black uppercase"
              style={
                built[i]
                  ? { borderColor: `var(--${color})`, ...accentBg(color, 0.14) }
                  : { borderColor: 'var(--border)', borderStyle: 'dashed' }
              }
            >
              {built[i] ?? ''}
            </div>
          ))}
        </div>

        {complete && (
          <div
            className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
            style={accentBg(color, 0.18)}
          >
            <PartyPopper className="size-4" /> You built &ldquo;{target}&rdquo;!
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">Tap the letters</p>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
          {TILES.map((t, i) => (
            <button
              key={`${t}-${i}`}
              onClick={() => place(t)}
              disabled={complete}
              className="flex aspect-square items-center justify-center rounded-2xl border-2 border-border text-3xl font-black uppercase text-foreground transition-transform active:scale-95 disabled:opacity-40"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => reset()}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-semibold text-foreground"
        >
          <RotateCcw className="size-4" /> Clear
        </button>
        {WORDS.map((w) => (
          <button
            key={w}
            onClick={() => reset(w)}
            className="rounded-full px-3 py-1.5 text-sm font-bold"
            style={
              w === target
                ? accentBg(color, 0.18)
                : { color: 'var(--muted-foreground)' }
            }
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  )
}
