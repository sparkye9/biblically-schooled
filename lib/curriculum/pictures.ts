/**
 * Picture words that worksheets may draw. Every picture is an inline SVG icon
 * bundled with the app (lucide-react), so a worksheet can never show a missing
 * image. Each entry records the phonics facts a worksheet relies on, so tests
 * can check that "circle the first sound" items are actually correct.
 *
 * Words are only included when the icon reads unambiguously to a young child
 * (e.g. no "mouse" — the icon is a computer mouse; no "gem" — soft g).
 */

export interface PictureWord {
  word: string
  icon: string
  /** First sound as a grapheme a child would write: 'm', 'sh', 'ch', 'th'… */
  first: string
  syllables: number
  /** CVC-decodable short-vowel word (consonant–vowel–consonant). */
  cvc?: boolean
  /** Phonics pattern a 1st grader would use to spell it. */
  pattern?: string
  rhyme?: string
}

export const PICTURES: PictureWord[] = [
  { word: 'apple', icon: 'Apple', first: 'a', syllables: 2 },
  { word: 'anchor', icon: 'Anchor', first: 'a', syllables: 2 },
  { word: 'axe', icon: 'Axe', first: 'a', syllables: 1 },
  { word: 'bed', icon: 'Bed', first: 'b', syllables: 1, cvc: true, pattern: 'short e' },
  { word: 'bell', icon: 'Bell', first: 'b', syllables: 1, pattern: 'floss', rhyme: 'ell' },
  { word: 'bike', icon: 'Bike', first: 'b', syllables: 1, pattern: 'i_e' },
  { word: 'bird', icon: 'Bird', first: 'b', syllables: 1, pattern: 'ir' },
  { word: 'bone', icon: 'Bone', first: 'b', syllables: 1, pattern: 'o_e', rhyme: 'one' },
  { word: 'book', icon: 'Book', first: 'b', syllables: 1, pattern: 'oo (book)' },
  { word: 'bug', icon: 'Bug', first: 'b', syllables: 1, cvc: true, pattern: 'short u' },
  { word: 'bus', icon: 'Bus', first: 'b', syllables: 1, cvc: true, pattern: 'short u' },
  { word: 'banana', icon: 'Banana', first: 'b', syllables: 3 },
  { word: 'cake', icon: 'Cake', first: 'c', syllables: 1, pattern: 'a_e' },
  { word: 'car', icon: 'Car', first: 'c', syllables: 1, pattern: 'ar', rhyme: 'ar' },
  { word: 'carrot', icon: 'Carrot', first: 'c', syllables: 2 },
  { word: 'cat', icon: 'Cat', first: 'c', syllables: 1, cvc: true, pattern: 'short a' },
  { word: 'cone', icon: 'Cone', first: 'c', syllables: 1, pattern: 'o_e', rhyme: 'one' },
  { word: 'cookie', icon: 'Cookie', first: 'c', syllables: 2 },
  { word: 'cherry', icon: 'Cherry', first: 'ch', syllables: 2 },
  { word: 'church', icon: 'Church', first: 'ch', syllables: 1, pattern: 'ur' },
  { word: 'dog', icon: 'Dog', first: 'd', syllables: 1, cvc: true, pattern: 'short o' },
  { word: 'drum', icon: 'Drum', first: 'd', syllables: 1, pattern: 'blend dr' },
  { word: 'egg', icon: 'Egg', first: 'e', syllables: 1 },
  { word: 'eraser', icon: 'Eraser', first: 'e-long', syllables: 3 },
  { word: 'fan', icon: 'Fan', first: 'f', syllables: 1, cvc: true, pattern: 'short a', rhyme: 'an' },
  { word: 'feather', icon: 'Feather', first: 'f', syllables: 2 },
  { word: 'fish', icon: 'Fish', first: 'f', syllables: 1, pattern: 'sh' },
  { word: 'flag', icon: 'Flag', first: 'f', syllables: 1, pattern: 'blend fl' },
  { word: 'flower', icon: 'Flower', first: 'f', syllables: 2 },
  { word: 'gift', icon: 'Gift', first: 'g', syllables: 1, pattern: 'final blend ft' },
  { word: 'globe', icon: 'Globe', first: 'g', syllables: 1, pattern: 'o_e' },
  { word: 'grapes', icon: 'Grape', first: 'g', syllables: 1, pattern: 'a_e' },
  { word: 'ham', icon: 'Ham', first: 'h', syllables: 1, cvc: true, pattern: 'short a' },
  { word: 'hand', icon: 'Hand', first: 'h', syllables: 1, pattern: 'final blend nd' },
  { word: 'heart', icon: 'Heart', first: 'h', syllables: 1 },
  { word: 'house', icon: 'House', first: 'h', syllables: 1, pattern: 'ou' },
  { word: 'kayak', icon: 'Kayak', first: 'k', syllables: 2 },
  { word: 'lamp', icon: 'Lamp', first: 'l', syllables: 1, pattern: 'final blend mp' },
  { word: 'leaf', icon: 'Leaf', first: 'l', syllables: 1, pattern: 'ea' },
  { word: 'lock', icon: 'Lock', first: 'l', syllables: 1, pattern: 'ck', rhyme: 'ock' },
  { word: 'clock', icon: 'Clock', first: 'c', syllables: 1, pattern: 'ck', rhyme: 'ock' },
  { word: 'lollipop', icon: 'Lollipop', first: 'l', syllables: 3 },
  { word: 'magnet', icon: 'Magnet', first: 'm', syllables: 2 },
  { word: 'map', icon: 'Map', first: 'm', syllables: 1, cvc: true, pattern: 'short a' },
  { word: 'medal', icon: 'Medal', first: 'm', syllables: 2 },
  { word: 'milk', icon: 'Milk', first: 'm', syllables: 1, pattern: 'final blend lk' },
  { word: 'moon', icon: 'Moon', first: 'm', syllables: 1, pattern: 'oo (moon)' },
  { word: 'mop', icon: 'Mop', first: 'm', syllables: 1, cvc: true, pattern: 'short o' },
  { word: 'mountain', icon: 'Mountain', first: 'm', syllables: 2 },
  { word: 'nut', icon: 'Nut', first: 'n', syllables: 1, cvc: true, pattern: 'short u' },
  { word: 'octagon', icon: 'Octagon', first: 'o', syllables: 3 },
  { word: 'pen', icon: 'Pen', first: 'p', syllables: 1, cvc: true, pattern: 'short e' },
  { word: 'pencil', icon: 'Pencil', first: 'p', syllables: 2 },
  { word: 'pin', icon: 'Pin', first: 'p', syllables: 1, cvc: true, pattern: 'short i' },
  { word: 'pizza', icon: 'Pizza', first: 'p', syllables: 2 },
  { word: 'plug', icon: 'Plug', first: 'p', syllables: 1, pattern: 'blend pl' },
  { word: 'popcorn', icon: 'Popcorn', first: 'p', syllables: 2 },
  { word: 'rabbit', icon: 'Rabbit', first: 'r', syllables: 2 },
  { word: 'rainbow', icon: 'Rainbow', first: 'r', syllables: 2 },
  { word: 'rain', icon: 'CloudRain', first: 'r', syllables: 1, pattern: 'ai', rhyme: 'ain' },
  { word: 'road', icon: 'Road', first: 'r', syllables: 1, pattern: 'oa' },
  { word: 'rocket', icon: 'Rocket', first: 'r', syllables: 2 },
  { word: 'rose', icon: 'Rose', first: 'r', syllables: 1, pattern: 'o_e' },
  { word: 'ruler', icon: 'Ruler', first: 'r', syllables: 2 },
  { word: 'sandwich', icon: 'Sandwich', first: 's', syllables: 2 },
  { word: 'snail', icon: 'Snail', first: 's', syllables: 1, pattern: 'ai' },
  { word: 'soup', icon: 'Soup', first: 's', syllables: 1 },
  { word: 'star', icon: 'Star', first: 's', syllables: 1, pattern: 'ar', rhyme: 'ar' },
  { word: 'sun', icon: 'Sun', first: 's', syllables: 1, cvc: true, pattern: 'short u' },
  { word: 'shell', icon: 'Shell', first: 'sh', syllables: 1, pattern: 'sh', rhyme: 'ell' },
  { word: 'ship', icon: 'Ship', first: 'sh', syllables: 1, pattern: 'sh' },
  { word: 'shirt', icon: 'Shirt', first: 'sh', syllables: 1, pattern: 'ir' },
  { word: 'shield', icon: 'Shield', first: 'sh', syllables: 1 },
  { word: 'tent', icon: 'Tent', first: 't', syllables: 1, pattern: 'final blend nt' },
  { word: 'train', icon: 'Train', first: 't', syllables: 1, pattern: 'ai', rhyme: 'ain' },
  { word: 'tree', icon: 'TreePine', first: 't', syllables: 1, pattern: 'ee' },
  { word: 'truck', icon: 'Truck', first: 't', syllables: 1, pattern: 'ck' },
  { word: 'turtle', icon: 'Turtle', first: 't', syllables: 2 },
  { word: 'umbrella', icon: 'Umbrella', first: 'u', syllables: 3 },
  { word: 'van', icon: 'Van', first: 'v', syllables: 1, cvc: true, pattern: 'short a', rhyme: 'an' },
  { word: 'wand', icon: 'Wand', first: 'w', syllables: 1 },
  { word: 'watch', icon: 'Watch', first: 'w', syllables: 1 },
  { word: 'worm', icon: 'Worm', first: 'w', syllables: 1 },
  { word: 'crown', icon: 'Crown', first: 'c', syllables: 1, pattern: 'ow (cow)' },
  { word: 'cloud', icon: 'Cloud', first: 'c', syllables: 1, pattern: 'ou' },
  { word: 'snowflake', icon: 'Snowflake', first: 's', syllables: 2 },
  { word: 'backpack', icon: 'Backpack', first: 'b', syllables: 2 },
  { word: 'mailbox', icon: 'Mailbox', first: 'm', syllables: 2 },
  { word: 'calendar', icon: 'Calendar', first: 'c', syllables: 3 },
  { word: 'bath', icon: 'Bath', first: 'b', syllables: 1, pattern: 'th' },
]

export const pictureByWord = new Map(PICTURES.map((p) => [p.word, p]))

/** Rhyming picture pairs a Pre-K child can match by sound. */
export const RHYME_PAIRS: [string, string][] = [
  ['fan', 'van'],
  ['lock', 'clock'],
  ['star', 'car'],
  ['bell', 'shell'],
  ['bone', 'cone'],
  ['train', 'rain'],
]

export function picturesStartingWith(first: string): PictureWord[] {
  return PICTURES.filter((p) => p.first === first)
}
