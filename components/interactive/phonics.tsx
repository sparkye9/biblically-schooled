'use client'

import { useState } from 'react'
import { speak } from '@/lib/speech'
import { Volume2, Check } from 'lucide-react'
import { accent, accentBg } from '@/lib/ui'

const LETTERS = [
  { letter: 'A', sound: 'ah', word: 'apple' },
  { letter: 'S', sound: 'sss', word: 'sun' },
  { letter: 'T', sound: 'tuh', word: 'top' },
  { letter: 'P', sound: 'puh', word: 'pig' },
  { letter: 'N', sound: 'nnn', word: 'nest' },
  { letter: 'M', sound: 'mmm', word: 'moon' },
]

export function PhonicsBoard({ color }: { color: string }) {
  const [active, setActive] = useState<string | null>('A')
  const current = LETTERS.find((l) => l.letter === active) ?? LETTERS[0]
  const [found, setFound] = useState<string[]>([])

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          This letter says
        </p>
        <button
          onClick={() => speak(current.sound)}
          className="mx-auto mt-3 flex size-32 items-center justify-center rounded-3xl text-7xl font-black text-white transition-transform active:scale-95"
          style={{ backgroundColor: `var(--${color})` }}
          aria-label={`Play the sound for ${current.letter}`}
        >
          {current.letter}
        </button>
        <button
          onClick={() => speak(current.sound)}
          className="mx-auto mt-4 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
          style={accentBg(color, 0.16)}
        >
          <Volume2 className="size-4" /> Hear the sound &ldquo;{current.sound}&rdquo;
        </button>
        <p className="mt-3 text-muted-foreground">
          Like in{' '}
          <button
            onClick={() => speak(current.word)}
            className="font-bold underline decoration-dotted underline-offset-2"
            style={accent(color)}
          >
            {current.word}
          </button>
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">
          Tap each letter to hear its sound
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {LETTERS.map((l) => (
            <button
              key={l.letter}
              onClick={() => {
                setActive(l.letter)
                speak(l.sound)
                if (!found.includes(l.letter)) setFound((f) => [...f, l.letter])
              }}
              className="relative flex aspect-square items-center justify-center rounded-2xl border-2 text-3xl font-black transition-all"
              style={
                active === l.letter
                  ? { borderColor: `var(--${color})`, ...accentBg(color, 0.14) }
                  : { borderColor: 'var(--border)', color: 'var(--foreground)' }
              }
            >
              {l.letter}
              {found.includes(l.letter) && (
                <span
                  className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: `var(--${color})` }}
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
