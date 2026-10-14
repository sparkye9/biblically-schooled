# Verified phonics recordings (optional)

The app never asks text-to-speech to pronounce an isolated sound — browser
voices turn "t" into "tuh" or read it as a letter name. Instead, the
**Letter sound** button speaks the keyword word ("top") and shows the sound
(/t/) plus a mouth cue for a grown-up to model.

If you want true letter-sound audio:

1. Record each sound (a clear adult voice, no added "uh" on b, c, d, g, k, p, t).
   Continuous sounds (m, s, f, l, n, r, v, z, sh, th) can be held ~1 second.
2. Save as `public/audio/phonics/<grapheme>.mp3`, e.g. `m.mp3`, `sh.mp3`, `qu.mp3`.
3. **Listen to each file** and confirm it matches the grapheme on screen.
4. Only then list it in `VERIFIED_RECORDINGS` in `lib/curriculum/phonics.ts`:
   `export const VERIFIED_RECORDINGS = { m: 'm.mp3', s: 's.mp3' }`

Unlisted files are ignored, so an unchecked recording can never play.
