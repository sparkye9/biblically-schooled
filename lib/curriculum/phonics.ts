/**
 * Phonics reference — the single source of truth for every letter/sound the
 * app teaches, speaks, or prints.
 *
 * Audio accuracy rules (fixing the old "tuh / puh / sss" problem):
 *  1. A letter NAME and a letter SOUND are always separate buttons and labels.
 *  2. Text-to-speech is never asked to pronounce an isolated sound. Browser
 *     voices read "tuh" or "sss" as words or letters and add an extra "uh".
 *     Instead the app either plays a verified recording (see
 *     `public/audio/phonics/README.md`) or speaks the KEYWORD ("t… top") and
 *     shows the parent a mouth cue for modelling the pure sound.
 *  3. Stop sounds (b, c, d, g, k, p, t…) are clipped — no "uh" added.
 */

export interface Grapheme {
  /** Lowercase spelling, e.g. 'm', 'sh', 'qu'. */
  g: string
  /** How the letter name is spoken, e.g. 'M' → "the letter M". */
  name: string
  /** Dictionary-style sound, e.g. '/m/', '/ă/'. */
  sound: string
  /** Continuous sounds can be stretched (mmm); stop sounds must be clipped. */
  continuous: boolean
  /** Mouth cue for the parent. */
  cue: string
  /** Words that begin with exactly this sound — used for teaching and audio. */
  keywords: string[]
  /** Optional verified recording file name in /public/audio/phonics. */
  audio?: string
}

const G = (
  g: string,
  sound: string,
  continuous: boolean,
  cue: string,
  keywords: string[],
): Grapheme => ({ g, name: g.toUpperCase(), sound, continuous, cue, keywords })

export const GRAPHEMES: Grapheme[] = [
  G('a', '/ă/', true, 'Open wide, like the doctor says "say ah," but shorter: /ă/ as in apple.', ['apple', 'ant', 'astronaut']),
  G('b', '/b/', false, 'Lips together, then pop them open. Quick — no "buh."', ['bus', 'bed', 'bug']),
  G('c', '/k/', false, 'Back of tongue taps the roof of the mouth. A quiet click — no "kuh."', ['cat', 'cup', 'car']),
  G('d', '/d/', false, 'Tongue taps behind the top teeth. Quick — no "duh."', ['dog', 'drum', 'duck']),
  G('e', '/ĕ/', true, 'Smile a little, jaw slightly down: /ĕ/ as in egg.', ['egg', 'elephant', 'elbow']),
  G('f', '/f/', true, 'Top teeth on bottom lip and blow: fff (no voice).', ['fan', 'fish', 'feather']),
  G('g', '/g/', false, 'Back of tongue up, quick gulp sound — no "guh."', ['gift', 'goat', 'gum']),
  G('h', '/h/', true, 'Just a puff of breath, like fogging a mirror.', ['hand', 'ham', 'house']),
  G('i', '/ĭ/', true, 'Small smile, short sound: /ĭ/ as in itch or igloo.', ['igloo', 'itch', 'insect']),
  G('j', '/j/', false, 'Lips pushed forward, quick — no "juh."', ['jam', 'jet', 'jump']),
  G('k', '/k/', false, 'Same sound as c: quiet click at the back of the mouth.', ['kite', 'kayak', 'kid']),
  G('l', '/l/', true, 'Tongue tip up behind top teeth and hum: lll.', ['lamp', 'leaf', 'lock']),
  G('m', '/m/', true, 'Lips together and hum: mmm.', ['moon', 'map', 'mop']),
  G('n', '/n/', true, 'Tongue up behind top teeth and hum through the nose: nnn.', ['nut', 'nest', 'nose']),
  G('o', '/ŏ/', true, 'Round, open mouth: /ŏ/ as in octopus.', ['octopus', 'otter', 'octagon']),
  G('p', '/p/', false, 'Lips together, pop out a puff of air — no voice, no "puh."', ['pen', 'pin', 'pizza']),
  G('qu', '/kw/', false, 'Q and u work together: /kw/ as in queen.', ['queen', 'quilt', 'quiet']),
  G('r', '/r/', true, 'Lips a little round, tongue pulled back: rrr (not "er").', ['rabbit', 'rocket', 'rain']),
  G('s', '/s/', true, 'Teeth together, smile, and hiss like a snake: sss.', ['sun', 'sock', 'soup']),
  G('t', '/t/', false, 'Tongue taps behind top teeth. Whisper it — no "tuh."', ['tent', 'top', 'turtle']),
  G('u', '/ŭ/', true, 'Relaxed mouth, sound from the belly: /ŭ/ as in up.', ['umbrella', 'up', 'under']),
  G('v', '/v/', true, 'Top teeth on bottom lip and hum: vvv (f with your voice on).', ['van', 'vest', 'violin']),
  G('w', '/w/', false, 'Lips make a small circle, then open: /w/ — no "wuh."', ['worm', 'wand', 'web']),
  G('x', '/ks/', false, 'Usually at the END of a word: /ks/ as in box and fox.', ['box', 'fox', 'six']),
  G('y', '/y/', true, 'Smile, tongue high: /y/ as in yes and yarn.', ['yes', 'yarn', 'yo-yo']),
  G('z', '/z/', true, 'Teeth together and buzz like a bee: zzz.', ['zebra', 'zip', 'zoo']),
  G('sh', '/sh/', true, 'Lips forward, "quiet please" sound: shhh.', ['ship', 'shell', 'shirt']),
  G('ch', '/ch/', false, 'Lips forward, quick sneeze sound: /ch/ (ah-CHOO).', ['chin', 'cherry', 'chip']),
  G('th', '/th/', true, 'Tongue peeks out between teeth and blow: th (thumb, then).', ['thumb', 'think', 'then']),
  G('wh', '/w/', false, 'In most American speech, wh sounds like /w/: whale, when.', ['whale', 'when', 'whip']),
  G('ck', '/k/', false, 'ck comes right after a short vowel at the end of a word: duck, sock.', ['duck', 'sock', 'truck']),
  G('ng', '/ng/', true, 'Back of tongue up, hum through the nose: ring, sing.', ['ring', 'king', 'sing']),
]

export const graphemeMap = new Map(GRAPHEMES.map((g) => [g.g, g]))

export function grapheme(g: string): Grapheme {
  const found = graphemeMap.get(g)
  if (!found) throw new Error(`Unknown grapheme: ${g}`)
  return found
}

/** What text-to-speech may say for a NAME button. Never a sound. */
export function speakableLetterName(g: string): string {
  if (g.length > 1) return `${g.split('').map((c) => c.toUpperCase()).join(', ')}`
  return `the letter ${g.toUpperCase()}`
}

/** What text-to-speech may say for a SOUND button: the keyword only. */
export function speakableKeyword(g: string): string {
  return grapheme(g).keywords[0]
}

/**
 * Verified recordings available in /public/audio/phonics. Empty until real,
 * reviewed recordings are added — see public/audio/phonics/README.md.
 * Only list a file here after a person has listened to it and confirmed the
 * sound is pure (no added "uh").
 */
export const VERIFIED_RECORDINGS: Record<string, string> = {}
