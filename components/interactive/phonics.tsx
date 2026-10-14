'use client'

import { useState } from 'react'
import { MessageCircle, Volume2 } from 'lucide-react'
import { GRAPHEMES, VERIFIED_RECORDINGS, grapheme, speakableKeyword, speakableLetterName } from '@/lib/curriculum/phonics'
import { picturesStartingWith } from '@/lib/curriculum/pictures'
import { speak } from '@/lib/speech'
import { Pic } from '@/components/worksheets/worksheet-page'

/**
 * Letter board with SEPARATE "letter name" and "letter sound" buttons.
 * - Name: speech says "the letter M".
 * - Sound: plays a verified recording if one has been added; otherwise speech
 *   says only the keyword ("moon") and the screen shows the sound (/m/) for a
 *   grown-up to model. Speech is never asked to say an isolated sound.
 */
export function PhonicsBoard({ color, letters }: { color: string; letters?: string[] }) {
  const list = (letters?.length ? letters : ['m', 's', 'a', 't', 'p', 'i']).filter((g) => GRAPHEMES.some((x) => x.g === g))
  const [active, setActive] = useState(list[0] ?? 'm')
  const info = grapheme(active)
  const pic = picturesStartingWith(active)[0]

  const playSound = () => {
    const rec = VERIFIED_RECORDINGS[active]
    if (rec) {
      void new Audio(`/audio/phonics/${rec}`).play()
    } else {
      speak(speakableKeyword(active))
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card p-6 text-center">
        <p className="text-8xl font-black" style={{ color: `var(--${color})`, fontFamily: 'Arial, sans-serif' }}>
          {info.g.length === 1 ? `${info.name}${info.g}` : info.g}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => speak(speakableLetterName(active))} className="flex flex-col items-center gap-1 rounded-2xl border-2 border-border p-4 text-lg font-bold active:scale-95">
            <MessageCircle className="size-7" />
            Letter name
          </button>
          <button type="button" onClick={playSound} className="flex flex-col items-center gap-1 rounded-2xl p-4 text-lg font-bold text-white active:scale-95" style={{ backgroundColor: `var(--${color})` }}>
            <Volume2 className="size-7" />
            Letter sound
          </button>
        </div>
        <p className="mt-4 text-xl font-bold">
          {info.sound} as in {info.keywords[0]}
        </p>
        {pic && (
          <div className="mt-2 flex justify-center">
            <Pic name={pic.icon} size={72} />
          </div>
        )}
        {!VERIFIED_RECORDINGS[active] && (
          <p className="mt-3 text-sm text-muted-foreground">
            Grown-up: say the sound with your child. {info.cue}
          </p>
        )}
      </div>
      {list.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {list.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={g === active}
              onClick={() => setActive(g)}
              className="flex aspect-square items-center justify-center rounded-2xl border-2 text-3xl font-black"
              style={g === active ? { borderColor: `var(--${color})`, color: `var(--${color})` } : { borderColor: 'var(--border)' }}
            >
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
