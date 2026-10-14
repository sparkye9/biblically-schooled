import { getBibleWeek, type SeasonalLesson } from './bible'
import { getEnrichment } from './enrichment'
import { getLiteracyWeek } from './literacy'
import { getMathWeek, type MathGen } from './math'
import type { Grade } from './types'

/**
 * Video Day — videos matched to each week, for days the parent needs a break.
 *
 * Links open a trusted channel's OWN search for the week's topic rather than
 * a single hard-coded video, so a removed or renamed video can never leave a
 * dead link, and results stay inside that channel. Channels were chosen for
 * being faith-based where possible and free of magic; see SOURCES notes.
 * A grown-up should still preview, since channel uploads change over time.
 */

export type VideoSourceId = 'saddleback' | 'jackhartmann' | 'numberblocks' | 'suitcase' | 'scishowkids'

export interface VideoSource {
  id: VideoSourceId
  name: string
  faithBased: boolean
  about: string
  /** Builds the link for a search term. */
  link: (q: string) => string
}

const enc = encodeURIComponent
const channelSearch = (handle: string) => (q: string) => `https://www.youtube.com/@${handle}/search?query=${enc(q)}`
const youtubeSearch = (prefix: string) => (q: string) => `https://www.youtube.com/results?search_query=${enc(`${prefix} ${q}`)}`

export const SOURCES: Record<VideoSourceId, VideoSource> = {
  saddleback: {
    id: 'saddleback',
    name: 'Saddleback Kids — Hey-O! Stories of the Bible',
    faithBased: true,
    about: 'Short animated Bible stories from Saddleback Church’s children’s ministry, for preschool and elementary ages.',
    link: channelSearch('saddlebackkids'),
  },
  jackhartmann: {
    id: 'jackhartmann',
    name: 'Jack Hartmann Kids Music Channel',
    faithBased: false,
    about: 'Teacher-made movement songs for letter sounds, sight words, counting, and math. Not faith-based; no magic.',
    link: channelSearch('jackhartmann'),
  },
  numberblocks: {
    id: 'numberblocks',
    name: 'Numberblocks',
    faithBased: false,
    about: 'Short BBC math episodes where each number is a character. Christian reviewers (Movieguide) found nothing objectionable and note magic is never mentioned; the blocks do split and join to show adding.',
    link: channelSearch('numberblocks'),
  },
  suitcase: {
    id: 'suitcase',
    name: 'Suitcase Teachers',
    faithBased: true,
    about: 'Free step-by-step phonics lessons from two kindergarten teachers at a Christian school.',
    link: youtubeSearch('Suitcase Teachers'),
  },
  scishowkids: {
    id: 'scishowkids',
    name: 'SciShow Kids',
    faithBased: false,
    about: 'Gentle science explanations for young kids. Not faith-based — preview topics like dinosaurs, space, or Earth’s history.',
    link: youtubeSearch('SciShow Kids'),
  },
}

/** Optional faith-based extras the family can use outside YouTube. */
export const STREAMING_EXTRAS = [
  { name: 'Bible App for Kids (YouVersion)', note: 'Free app with animated, interactive Bible stories.', url: 'https://bible.com/kids' },
  { name: 'Owlegories (on Minno)', note: 'Christian science-and-nature episodes: what creation teaches about God. Paid streaming.', url: 'https://www.gominno.com' },
  { name: 'What’s in the Bible? (on Minno)', note: 'Phil Vischer’s walk through the whole Bible, for older kids. Paid streaming.', url: 'https://www.gominno.com' },
]

/** The Bible-story search term for each of the 36 weeks. */
const BIBLE_SEARCH: Record<number, string> = {
  1: 'creation', 2: 'creation', 3: 'God made me', 4: 'God is good', 5: 'Adam and Eve', 6: 'Adam and Eve',
  7: 'Noah', 8: 'Noah rainbow', 9: 'Ten Commandments', 10: 'Abraham', 11: 'Abraham', 12: 'Isaac',
  13: 'Jacob', 14: 'Joseph', 15: 'Joseph', 16: 'baby Moses', 17: 'burning bush', 18: 'Red Sea',
  19: 'Jesus is born', 20: 'wise men', 21: 'Jesus baptism', 22: 'fishers of men', 23: 'Good Samaritan', 24: 'calms the storm',
  25: 'feeds 5000', 26: 'Easter', 27: 'Easter', 28: 'Lord’s Prayer', 29: 'Pentecost', 30: 'fruit of the Spirit',
  31: 'kindness', 32: 'armor of God', 33: 'love one another', 34: 'Jesus washes feet', 35: 'Great Commission', 36: 'God’s big story',
}

/** Science search term per week (titles alone make poor searches, e.g. "Science Review"). */
const SCIENCE_SEARCH: Record<number, string> = {
  1: 'living and nonliving', 2: 'five senses', 3: 'what plants need', 4: 'animal groups', 5: 'human body', 6: 'day and night',
  7: 'weather', 8: 'seasons', 9: 'nature walk', 10: 'rocks and soil', 11: 'stars', 12: 'push and pull',
  13: 'ramps', 14: 'sink or float', 15: 'shadows', 16: 'sound', 17: 'heat', 18: 'solid liquid gas',
  19: 'hibernation', 20: 'moon phases', 21: 'life cycles', 22: 'fish', 23: 'germs', 24: 'wind',
  25: 'healthy food', 26: 'seeds', 27: 'spring', 28: 'plant parts', 29: 'butterfly life cycle', 30: 'air',
  31: 'fruit and seeds', 32: 'insects', 33: 'birds nests', 34: 'recycling', 35: 'rainbows', 36: 'science experiments',
}

const SEASON_SEARCH: Record<SeasonalLesson['id'], string> = {
  thanksgiving: 'ten lepers',
  advent: 'Christmas',
  easter: 'Palm Sunday',
}

/** Turns a math worksheet kind into a search phrase kids' channels use. */
export function mathSearch(gen: MathGen): { phrase: string; numeric: boolean } {
  switch (gen.kind) {
    case 'count-circle':
    case 'count-write':
      return { phrase: `counting to ${gen.max <= 5 ? 5 : gen.max <= 10 ? 10 : 20}`, numeric: true }
    case 'trace-numbers':
      return { phrase: `numbers ${gen.from} to ${gen.to}`, numeric: true }
    case 'ten-frame':
      return { phrase: 'ten frame', numeric: true }
    case 'number-bond':
      return { phrase: 'number bonds', numeric: true }
    case 'add-pictures':
      return { phrase: 'addition', numeric: true }
    case 'sub-pictures':
      return { phrase: 'subtraction', numeric: true }
    case 'facts':
      return { phrase: gen.doubles ? 'doubles' : gen.makeTen ? 'make 10' : gen.op === '-' ? 'subtraction' : 'addition', numeric: true }
    case 'fact-family':
      return { phrase: 'fact families', numeric: true }
    case 'true-false':
      return { phrase: 'equal sign', numeric: true }
    case 'word-problems':
      return { phrase: 'word problems', numeric: true }
    case 'number-line':
      return { phrase: 'number line', numeric: true }
    case 'place-value':
      return { phrase: 'tens and ones', numeric: true }
    case 'ten-more-less':
      return { phrase: '10 more 10 less', numeric: true }
    case 'two-digit':
      return { phrase: 'adding tens', numeric: true }
    case 'hundred-chart':
      return { phrase: `count to ${gen.to}`, numeric: true }
    case 'skip-count':
      return { phrase: `count by ${gen.by}s`, numeric: true }
    case 'one-more':
      return { phrase: gen.less ? 'one less' : 'one more', numeric: true }
    case 'compare-groups':
    case 'compare-numbers':
      return { phrase: gen.kind === 'compare-numbers' && gen.symbols ? 'greater than less than' : 'more and less', numeric: true }
    case 'shape-find':
    case 'shape-attributes':
      return { phrase: 'shapes', numeric: false }
    case 'pattern':
      return { phrase: 'patterns', numeric: false }
    case 'size-compare':
      return { phrase: gen.attr === 'heavy' ? 'heavy and light' : gen.attr === 'big' ? 'big and small' : 'long and short', numeric: false }
    case 'clock':
      return { phrase: gen.half ? 'telling time half hour' : 'telling time to the hour', numeric: false }
    case 'coins':
      return { phrase: 'coins', numeric: false }
    case 'measure':
      return { phrase: 'measurement', numeric: false }
    case 'graph':
      return { phrase: 'graphs', numeric: false }
    case 'fractions':
      return { phrase: 'halves and fourths', numeric: false }
    case 'sort':
      return { phrase: 'sorting', numeric: false }
    case 'ordinal':
      return { phrase: 'ordinal numbers', numeric: false }
  }
}

/** Phonics search phrase for a literacy week. Explicit rules — keep them readable, not clever. */
export function literacySearch(grade: Grade, week: number): string {
  const lw = getLiteracyWeek(grade, week)
  const p = lw.pattern.toLowerCase()
  const special: Record<string, string> = {
    name: 'alphabet song',
    rhyming: 'rhyming words',
    syllables: 'syllables',
    'oral blending': 'blending sounds',
    'beginning sounds': 'beginning sounds',
    fluency: 'reading fluency',
    'cvc mixed': 'cvc words',
    'mixed short vowels': 'short vowels',
    'short a / short i': 'short a',
    'short o / short u / short e': 'short o',
    'review digraphs': 'digraphs',
    floss: 'double consonants',
    'floss / -all': 'double consonants',
    'plural -s': 'plurals',
    'initial blends': 'beginning blends',
    'final blends': 'ending blends',
    '-ng / -nk': 'ng nk',
    'open syllable / y = long i': 'y as long i',
    '-ed': 'ed ending',
    '-ing': 'ing ending',
    ar: 'ar words',
    'or / ore': 'or words',
    'er / ir / ur': 'er ir ur',
    'ai / ay': 'ai ay',
    'ee / ea': 'ee ea',
    'oa / ow': 'oa ow',
    'igh / ie / y': 'long i',
    'oo (moon) / oo (book)': 'oo sound',
    'ou / ow': 'ou ow',
    'oi / oy': 'oi oy',
    'aw / au': 'aw au',
    'compound words': 'compound words',
    'two-syllable closed': 'two syllable words',
    contractions: 'contractions',
    'prefixes un- re-': 'prefixes',
    'suffixes -er -est -ful': 'suffixes',
  }
  if (special[p]) return special[p]
  if (p.startsWith('short ')) return p
  if (p.includes('_e')) return 'silent e'
  if (p === 'sh' || p === 'ch' || p === 'th' || p === 'ck' || p.includes('sh / ch') || p.includes('th / wh')) return p.length <= 2 ? `${p} digraph` : 'digraphs'
  if (lw.review || p === 'review') return grade === '1st' ? 'phonics review' : 'letter sounds review'
  // Remaining Pre-K and K weeks introduce letters (pattern 'letter' or 'a, m').
  const first = lw.graphemes[0]
  if (first) return `letter ${first[0].toUpperCase()}`
  return 'letter sounds'
}

export interface VideoLink {
  subject: 'bible' | 'literacy' | 'math' | 'science'
  /** What the video should cover, in parent-friendly words. */
  topic: string
  source: VideoSource
  url: string
}

/** Videos for one grade for one curriculum week. */
export function videosFor(week: number, grade: Grade, season?: SeasonalLesson | null): VideoLink[] {
  const bible = getBibleWeek(week)
  const lw = getLiteracyWeek(grade, week)
  const mt = getMathWeek(grade, week)
  const sci = getEnrichment(week).science
  const bibleQ = season ? SEASON_SEARCH[season.id] : BIBLE_SEARCH[week]
  const litQ = literacySearch(grade, week)
  const m = mathSearch(mt.gen)
  const sight = lw.hfw.find((w) => w !== 'review')
  const sciQ = SCIENCE_SEARCH[week]

  const out: VideoLink[] = [
    { subject: 'bible', topic: season ? season.title : bible.title, source: SOURCES.saddleback, url: SOURCES.saddleback.link(bibleQ) },
    { subject: 'literacy', topic: lw.title, source: SOURCES.jackhartmann, url: SOURCES.jackhartmann.link(litQ) },
  ]
  if (grade !== 'pre-k') out.push({ subject: 'literacy', topic: lw.title, source: SOURCES.suitcase, url: SOURCES.suitcase.link(litQ) })
  if (sight) out.push({ subject: 'literacy', topic: `Sight word: ${sight}`, source: SOURCES.jackhartmann, url: SOURCES.jackhartmann.link(`sight word ${sight}`) })
  out.push(
    m.numeric
      ? { subject: 'math', topic: mt.title, source: SOURCES.numberblocks, url: SOURCES.numberblocks.link(m.phrase) }
      : { subject: 'math', topic: mt.title, source: SOURCES.jackhartmann, url: SOURCES.jackhartmann.link(m.phrase) },
  )
  out.push({ subject: 'science', topic: sci.title, source: SOURCES.scishowkids, url: SOURCES.scishowkids.link(sciQ) })
  return out
}
