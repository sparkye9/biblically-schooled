import { getBibleWeek } from './bible'
import { getLiteracyWeek, type LiteracyWeek } from './literacy'
import { formationTalk, getHandwritingWeek } from './handwriting'
import { STRAND_LABEL, languageDay, languageSkillId } from './language'
import { getMathWeek, type MathTopic } from './math'
import { mathMethod, mentalMathWarmUp } from './math-method'
import { grapheme } from './phonics'
import { picturesStartingWith } from './pictures'
import { handwritingSkillId, hfwSkillId, literacySkillId, mathSkillId } from './skills'
import {
  LESSON_DAY_NAMES,
  type ActivityType,
  type DayMode,
  type Grade,
  type LessonDay,
  type LessonSubject,
  type PrintSubject,
  type TeachingGuide,
} from './types'

/**
 * Daily lessons are built from the scope & sequence on demand. Each of the
 * four lesson days in a week has a different job (Introduce → Practice →
 * Apply → Review) and a different activity, so the same lesson is never
 * repeated four times — the root cause of the old "repetitive lessons" issue.
 *
 * Weekly rhythm (see DAY_RHYTHM): day 0 is hands-on with nothing to print,
 * day 1 is the paper day, day 2 is hands-on and movement (readers get a story
 * page), day 3 is review with a mastery check. Every lesson carries an
 * `activity` type so the parent can see the mix at a glance.
 */

export interface WorksheetSlot {
  /** Stable id: `w{week}-d{day}-{grade}-{subject}`. */
  id: string
  week: number
  day: LessonDay
  grade: Grade
  subject: PrintSubject
}

export interface DailyLesson {
  id: string
  week: number
  day: LessonDay
  grade: Grade
  subject: LessonSubject
  title: string
  phase: string
  guide: TeachingGuide
  minutes: Record<DayMode, number>
  /** Skills practiced in this lesson. */
  skillIds: string[]
  /** Skills first introduced in this lesson (Introduce day only). */
  introduces: string[]
  /** Printable for this lesson, or null when the lesson is hands-on only. */
  worksheet: WorksheetSlot | null
  /** Short label for the child's to-do list. */
  childTask: string
  /** What kind of learning this is today. */
  activity: ActivityType
}

const MINUTES: Record<LessonSubject, Record<Grade, Record<DayMode, number>>> = {
  bible: {
    'pre-k': { minimum: 5, standard: 10, full: 15 },
    k: { minimum: 5, standard: 10, full: 15 },
    '1st': { minimum: 5, standard: 10, full: 15 },
  },
  literacy: {
    'pre-k': { minimum: 5, standard: 10, full: 15 },
    k: { minimum: 7, standard: 15, full: 20 },
    '1st': { minimum: 7, standard: 15, full: 25 },
  },
  math: {
    'pre-k': { minimum: 5, standard: 10, full: 15 },
    k: { minimum: 8, standard: 15, full: 20 },
    '1st': { minimum: 8, standard: 15, full: 20 },
  },
  // Extras switched on by a child's profile. On Minimum days handwriting is
  // skipped and language practice happens inside Bible time (picture talk).
  handwriting: {
    'pre-k': { minimum: 0, standard: 5, full: 8 },
    k: { minimum: 0, standard: 5, full: 10 },
    '1st': { minimum: 0, standard: 5, full: 8 },
  },
  // Full days also add the family read-aloud, where prediction and retell questions continue.
  language: {
    'pre-k': { minimum: 0, standard: 5, full: 5 },
    k: { minimum: 0, standard: 5, full: 5 },
    '1st': { minimum: 0, standard: 5, full: 5 },
  },
}

/**
 * Which lesson days have a printable page. Day 0 never prints (hands-on, and a
 * church morning in the default calendar). Day 2 prints only a story page for
 * K/1st readers. Pre-K literacy prints once a week — the Tuesday handwriting
 * page covers letter formation.
 */
const PRINT_DAYS: Record<PrintSubject, Record<Grade, LessonDay[]>> = {
  bible: { 'pre-k': [1], k: [1], '1st': [1] },
  literacy: { 'pre-k': [3], k: [1, 2, 3], '1st': [1, 2, 3] },
  math: { 'pre-k': [1, 3], k: [1, 3], '1st': [1, 3] },
  handwriting: { 'pre-k': [1, 3], k: [1, 3], '1st': [] },
}

export function printsOn(subject: PrintSubject, grade: Grade, day: LessonDay): boolean {
  return PRINT_DAYS[subject][grade].includes(day)
}

function slot(week: number, day: LessonDay, grade: Grade, subject: PrintSubject): WorksheetSlot {
  return { id: `w${week}-d${day}-${grade}-${subject}`, week, day, grade, subject }
}

export function lessonId(week: number, day: LessonDay, grade: Grade, subject: LessonSubject) {
  return `w${week}-d${day}-${grade}-${subject}`
}

// ───────────────────────────── BIBLE ─────────────────────────────

export function bibleLesson(week: number, day: LessonDay, grade: Grade): DailyLesson {
  const b = getBibleWeek(week)
  const verseForGrade = grade === '1st' ? b.verse.text : b.verse.short
  const guide: TeachingGuide = {
    objective: b.objective,
    materials: ['Bible', ...(day === 2 ? [b.activity] : [])],
    teach: [
      b.days[day],
      `Say: "${b.childExplanation}"`,
      `Memory verse (${b.verse.ref}): "${verseForGrade}"`,
    ],
    practice:
      day === 2
        ? [`Activity: ${b.activity}`, `Ask: "${b.questions[1]}"`]
        : day === 3
          ? [`Ask each child: "${b.questions[0]}"`, `Ask: "${b.questions[2]}"`, 'Say the memory verse together.']
          : [`Ask: "${b.questions[day]}"`, 'Say the memory verse together twice.'],
    check: `Can each child answer: "${b.questions[0]}"?`,
    ifStruggling: 'Retell the story in three sentences and act it out with toys. Practice only the short verse.',
    ifMastered: 'Let the oldest child retell the story to the youngest, then say the full verse.',
    optional: [`Prayer: ${b.prayer}`, ...(b.culturalNote ? [`Did you know? ${b.culturalNote}`] : [])],
    minimum: `Read ${b.shortReading}. Ask one question: "${b.questions[0]}" Say the verse once. Done.`,
  }
  const printsBible = printsOn('bible', grade, day)
  return {
    id: lessonId(week, day, grade, 'bible'),
    week,
    day,
    grade,
    subject: 'bible',
    title: b.title,
    phase: LESSON_DAY_NAMES[day],
    guide,
    minutes: MINUTES.bible[grade],
    skillIds: [],
    introduces: [],
    worksheet: printsBible ? slot(week, day, grade, 'bible') : null,
    childTask: day === 2 ? 'Bible activity' : 'Family Bible time',
    activity: (['discussion', 'academic', 'hands-on', 'review'] as const)[day],
  }
}

// ───────────────────────────── LITERACY ─────────────────────────────

const PATTERN_TEACH: Record<string, string> = {
  'short a': 'The letter a says /ă/ as in apple when it is closed in by a consonant: c-a-t.',
  'short i': 'The letter i says /ĭ/ as in itch: p-i-g.',
  'short o': 'The letter o says /ŏ/ as in octopus: d-o-g.',
  'short u': 'The letter u says /ŭ/ as in up: s-u-n.',
  'short e': 'The letter e says /ĕ/ as in egg: b-e-d.',
  'short a / short i': 'Two short vowels: a says /ă/ (apple), i says /ĭ/ (itch). Listen for the middle sound.',
  'short o / short u / short e': 'Three short vowels: o /ŏ/, u /ŭ/, e /ĕ/. Listen for the middle sound.',
  'mixed short vowels': 'Every short vowel: a /ă/, e /ĕ/, i /ĭ/, o /ŏ/, u /ŭ/. Change the middle sound to make new words.',
  'cvc mixed': 'Consonant–vowel–consonant words: tap each sound, then slide them together.',
  sh: 'When s and h are together they make one new sound: /sh/ (like "be quiet").',
  ch: 'When c and h are together they make one new sound: /ch/ (like a sneeze).',
  th: 'When t and h are together they make one new sound: /th/ — tongue peeks out.',
  ck: 'At the end of a short-vowel word, /k/ is spelled ck: duck, sock.',
  'review digraphs': 'Digraphs are two letters that make one sound: sh, ch, th, ck.',
  'sh / ch': 'Two digraphs: sh says /sh/, ch says /ch/. Two letters, one sound.',
  'th / wh / ck': 'th says /th/, wh says /w/, ck says /k/ at the end of short-vowel words.',
  floss: 'After a short vowel at the end of a one-syllable word, double f, l, s (and z): puff, bell, mess.',
  'floss / -all': 'Double f, l, s, z after a short vowel (puff, bell). The chunk -all says /awl/: ball, tall.',
  'plural -s': 'Add -s to mean more than one: cat → cats.',
  'initial blends': 'In a blend, you hear both sounds: s-t-op → stop. Say each sound quickly.',
  'final blends': 'An ending blend has two sounds at the end: ha-n-d → hand.',
  'a_e': 'Silent e at the end makes the vowel say its name: cap → cape.',
  'i_e': 'Silent e makes i say its name /ī/: kit → kite.',
  'o_e, u_e': 'Silent e makes o say /ō/ (hop → hope) and u say /ū/ (cub → cube).',
  'o_e / u_e / e_e': 'Silent e makes o say /ō/, u say /ū/, and e say /ē/: hope, cute, these.',
  '-ng / -nk': 'ng says /ng/ (ring); nk says /ngk/ (pink). They are "glued sounds."',
  'open syllable / y = long i': 'When a vowel is at the end of a syllable it says its name: go, me, hi. At the end of a short word, y says /ī/: my, fly.',
  '-ed': '-ed shows past time and can sound like /t/ (jumped), /d/ (played), or /ĕd/ (landed).',
  '-ing': 'Add -ing to show something happening now: jump → jumping.',
  ar: 'Bossy r changes the vowel: ar says /ar/ as in car.',
  'or / ore': 'or and ore say /or/ as in corn and more.',
  'er / ir / ur': 'er, ir, and ur all say /er/: her, bird, turn.',
  'ai / ay': 'ai and ay say /ā/. ai is in the middle (rain); ay is at the end (play).',
  'ee / ea': 'ee and ea usually say /ē/: tree, leaf.',
  'oa / ow': 'oa and ow can say /ō/: boat, snow.',
  'igh / ie / y': 'igh, ie, and y can say /ī/: night, pie, fly.',
  'oo (moon) / oo (book)': 'oo has two sounds: /oo/ as in moon and /oo/ as in book.',
  'ou / ow': 'ou and ow can say /ow/ (like "ouch!"): out, cow.',
  'oi / oy': 'oi and oy say /oy/: coin, boy. oy usually comes at the end.',
  'aw / au': 'aw and au say /aw/: saw, haul.',
  'compound words': 'Two small words join to make one new word: sun + set = sunset.',
  'two-syllable closed': 'Split between two consonants: rab | bit. Read each part, then put them together.',
  contractions: 'Two words squeeze together; an apostrophe replaces missing letters: do not → don’t.',
  'prefixes un- re-': 'un- means "not" (unhappy); re- means "again" (reread).',
  'suffixes -er -est -ful': '-er compares two, -est compares three or more, -ful means "full of."',
  fluency: 'Read smoothly, like talking. Reread to get faster and smoother.',
  review: 'Review all the sounds and patterns we have learned.',
}

function letterIntro(g: string): string[] {
  const info = grapheme(g)
  return [
    `Show the card for ${info.name}${g.length === 1 ? g : ''}. Say: "This is ${g.length === 1 ? `the letter ${info.name}` : `${g} — two letters that work together`}."`,
    `Say: "${g} says ${info.sound}." Mouth cue: ${info.cue}`,
    `Say the keywords slowly, stretching or clipping the first sound: ${info.keywords.join(', ')}.`,
    `Ask: "What sound does ${g} make?" Then: "Does ${info.keywords[0]} start with ${info.sound}?"`,
  ]
}

function prekPhonoActivity(lw: LiteracyWeek): string {
  if (lw.phono.startsWith('Listening')) return 'Sound detectives: close eyes; guess the sound (clap, tap a spoon, shake keys).'
  if (lw.phono.startsWith('Rhyming')) return 'Rhyme game: "Cat, hat — do they rhyme? Cat, dog — do they rhyme?" Thumbs up or down.'
  if (lw.phono.startsWith('Syllables')) return 'Clap the syllables of family names: Se-rai-ah (3), A-me-lia (3), Mom (1).'
  if (lw.phono.startsWith('Beginning')) return 'I Spy a sound: "I spy something that starts with /m/."'
  return 'Robot talk: say "c–at" slowly; the child blends it: "cat!"'
}

function literacyGuide(lw: LiteracyWeek, day: LessonDay, grade: Grade): TeachingGuide {
  const gs = lw.graphemes
  const kw = gs.length === 1 ? grapheme(gs[0]).keywords : []

  if (grade === 'pre-k') {
    const L = gs[0]
    const isLetter = lw.pattern === 'letter' && L
    const pics = L ? picturesStartingWith(L).map((p) => p.word) : []
    const objects = (pics.length ? pics : kw).slice(0, 3)
    if (lw.pattern === 'name') {
      const nameDays: Record<LessonDay, Pick<TeachingGuide, 'teach' | 'practice' | 'minimum'>> = {
        0: {
          teach: ['Show each child their name card. Say: "This says Seraiah / Amelia. It starts with the letter __."', 'Point to each letter and say its name together.'],
          practice: ['Find your name card among two others.', 'Build your first letter with play dough.'],
          minimum: 'Show the name card; child finds their name and names the first letter.',
        },
        1: {
          teach: ['Lay out magnetic letters or letter cards. Say: "Let’s build your name to match your name card."'],
          practice: ['Build your name with letters, matching the card one letter at a time.', 'Say each letter name as you place it.'],
          minimum: 'Find the first letter of your name among three letter cards.',
        },
        2: {
          teach: ['Cut a copy of the name card into letters. Say: "Let’s build your name like a puzzle."'],
          practice: ['Put the name puzzle back in order, then check against the card.'],
          minimum: 'Mix up 3 letters of the name; child puts them in order.',
        },
        3: {
          teach: ['Say: "Let’s hunt for the letters in your name." Then model the worksheet: "Start at the top."'],
          practice: ['Trace your name on the worksheet and draw yourself.', 'Find letters from your name in a book or cereal box.'],
          minimum: 'Find the first letter of your name on a book cover.',
        },
      }
      return {
        objective: 'Recognize my own name and the letters in it.',
        materials: ['Name card (write each child’s name on an index card)', ...(day === 1 ? ['Magnetic letters or letter cards'] : ['Play dough or crayons']), ...(day === 3 ? ['Worksheet'] : [])],
        ...nameDays[day],
        check: 'Can they find their own name card among three cards?',
        ifStruggling: 'Focus only on the first letter of the name.',
        ifMastered: 'Copy the name without tracing.',
      }
    }
    if (isLetter) {
      const intro = letterIntro(L)
      const byDay: Record<LessonDay, TeachingGuide> = {
        0: {
          objective: `Recognize ${L.toUpperCase()} and ${L} and say the sound ${grapheme(L).sound}.`,
          materials: [`Letter card ${L.toUpperCase()}${L} (index card)`, `Objects or pictures: ${objects.join(', ')}`, 'Play dough'],
          teach: intro,
          practice: [`Build ${L.toUpperCase()} with play dough or sticks.`, `Sound hunt: find something in the house that starts with ${grapheme(L).sound}.`],
          check: `Points to ${L.toUpperCase()} among three letter cards and says its sound.`,
          ifStruggling: 'This week, just learn the letter name. Say the sound with the keyword each day.',
          ifMastered: `Find ${L.toUpperCase()} and ${L} in a picture book.`,
          minimum: `Show the ${L.toUpperCase()} card. Say its name and sound. Find one thing that starts with ${grapheme(L).sound}.`,
        },
        1: {
          objective: `Hear ${grapheme(L).sound} at the beginning of words and sort objects by their first sound.`,
          materials: [`Objects: ${objects.join(', ')} and 3 that start with other sounds`, 'Two bowls'],
          teach: [`Say: "Listen: ${kw.slice(0, 2).join(', ')}. They all start with ${grapheme(L).sound}."`, `Hold up an object, say its name slowly, and ask: "Does it start with ${grapheme(L).sound}?"`],
          practice: [`Sound sort: put objects that start with ${grapheme(L).sound} in one bowl and the others in the second bowl.`, prekPhonoActivity(lw)],
          check: `Says yes/no correctly to "Does ___ start with ${grapheme(L).sound}?" for 3 words.`,
          ifStruggling: 'Exaggerate the first sound and use only 2 objects.',
          ifMastered: 'Name two more words that start with the sound.',
          minimum: `Play I Spy with ${grapheme(L).sound} for two minutes.`,
        },
        2: {
          objective: `Find ${L.toUpperCase()} and ${L} quickly and connect the letter to its sound. ${lw.phono}.`,
          materials: ['Letter cards taped to the floor (this week’s letter and 3 earlier ones)'],
          teach: [`Say a word that starts with ${grapheme(L).sound}. "Hop to the letter that makes that sound!"`],
          practice: ['Letter hop: hop to the letter for each sound you hear (5 turns).', prekPhonoActivity(lw)],
          check: `Hops to ${L.toUpperCase()} when hearing ${grapheme(L).sound}.`,
          ifStruggling: 'Use only 2 letter cards on the floor.',
          ifMastered: 'Child calls the sound and you hop.',
          minimum: `Tape the ${L.toUpperCase()} card on the floor; jump to it each time you say a ${grapheme(L).sound} word.`,
        },
        3: {
          objective: `Review ${L.toUpperCase()}${L} and earlier letters.`,
          materials: ['Worksheet', 'Letter cards from earlier weeks'],
          teach: ['Flip through letter cards from earlier weeks: child says name, then sound.'],
          practice: ['Complete the worksheet.', 'Letter cards: put the ones you know in one pile, "still learning" in another.'],
          check: 'Note which letters go in the "still learning" pile — mark them "Needs review" in Progress.',
          ifStruggling: 'Practice only this week’s letter and one earlier letter.',
          ifMastered: 'Sort cards into "says its name in the sound" vs. not.',
          minimum: 'Flip 5 letter cards; say each name and sound.',
        },
      }
      return byDay[day]
    }
    // Pre-K review and consolidation weeks — a different job each day.
    const letters = gs.length ? gs.map((g) => g.toUpperCase()).join(', ') : 'the alphabet'
    const reviewDays: Record<LessonDay, Pick<TeachingGuide, 'teach' | 'practice' | 'minimum'>> = {
      0: {
        teach: [`Card review: show ${letters}. Child says the name, then the sound.`],
        practice: ['Put cards you know in one pile and "still learning" in another.'],
        minimum: 'Flip 5 letter cards: name and sound.',
      },
      1: {
        teach: ['Letter match: lay out uppercase cards; child finds the matching lowercase card for each.'],
        practice: ['Match uppercase and lowercase cards.', prekPhonoActivity(lw)],
        minimum: 'Match 3 uppercase and lowercase letter cards.',
      },
      2: {
        teach: [`Game time: ${prekPhonoActivity(lw)}`],
        practice: ['Letter hunt: find review letters around the house and say their sounds.'],
        minimum: prekPhonoActivity(lw),
      },
      3: {
        teach: ['Quick check: show each review letter once. Note any that are still tricky.'],
        practice: ['Complete the worksheet.', 'Celebrate the letters you know — make a "My Letters" poster.'],
        minimum: 'Show each review letter once and celebrate the ones they know.',
      },
    }
    return {
      objective: `${lw.title}: ${lw.phono}.`,
      materials: ['Letter cards for letters learned so far', ...(day === 3 ? ['Worksheet'] : ['Small objects or pictures'])],
      ...reviewDays[day],
      check: 'Which letters are still tricky? Mark them "Needs review."',
      ifStruggling: 'Review just 3 letters.',
      ifMastered: 'Match uppercase to lowercase cards.',
    }
  }

  // ── K and 1st ──
  const isLetters = gs.length > 0 && !lw.review && gs.every((g) => g.length <= 2)
  const concept = PATTERN_TEACH[lw.pattern] ?? ''
  const blendWords = lw.words.slice(0, 4)
  const warmup = `Warm-up (1 min) — ${lw.phono}.`
  const hfw = lw.hfw.filter((w) => w !== 'review')

  switch (day) {
    case 0:
      return {
        objective: isLetters
          ? `Say the sound for ${gs.join(', ')} and blend words with ${gs.length > 1 ? 'them' : 'it'}.`
          : `Read words with the pattern: ${lw.pattern}.`,
        materials: ['Letter cards or whiteboard', 'Letter tiles (or letters written on paper squares)', 'Sound boxes: three boxes drawn on paper and 3 tokens'],
        teach: [
          warmup,
          ...(isLetters ? gs.flatMap((g) => letterIntro(g).slice(0, 2)) : [`Say: "${concept}"`]),
          `Blend together: write ${blendWords.join(', ')}. Touch under each sound, then slide your finger and read the word.`,
          ...(hfw.length ? [`New sight words: ${hfw.join(', ')}. Say: "We just have to know these by heart." Spell each aloud, then read it.`] : []),
        ],
        practice: [
          `Build it: say a word (${blendWords.slice(0, 3).join(', ')}). Child pushes one token into a sound box for each sound, then builds the word with letter tiles and reads it back.`,
          'Change one tile to make a new word (cat → cap → map) and read it.',
        ],
        check: `Reads ${Math.min(4, lw.words.length)} of the week's words by sounding out.`,
        ifStruggling: 'Read only 3-sound words; tap each sound on your arm before blending.',
        ifMastered: `Read the challenge words: ${lw.words.slice(4).join(', ') || lw.words.join(', ')}.`,
        minimum: isLetters
          ? `Show ${gs.join(', ')}; say the sound with the keyword. Blend two words: ${blendWords.slice(0, 2).join(', ')}.`
          : `Say the rule: "${concept}" Read two words together: ${blendWords.slice(0, 2).join(', ')}.`,
      }
    case 1:
      return {
        objective: `Practice reading and ${grade === '1st' ? 'spelling' : 'writing'} words with ${lw.pattern}.`,
        materials: ['Worksheet', 'Whiteboard'],
        teach: [
          warmup,
          `Quick review: "${concept || `What sounds do ${gs.join(', ')} make?`}"`,
          grade === '1st' && lw.sortWith
            ? `Word sort: model one word for each column (${lw.pattern.split('/')[0].trim()} vs. ${lw.sortWith.label}).`
            : 'Model: say a word, tap the sounds, write a letter for each sound.',
        ],
        practice: ['Complete the worksheet.', ...(hfw.length ? [`Sight-word flash: ${hfw.join(', ')}.`] : [])],
        check: 'Spells 3 dictated words from the list.',
        ifStruggling: 'Use letter tiles instead of writing.',
        ifMastered: 'Write a silly sentence using two list words.',
        minimum: `Dictate two words (${lw.words.slice(0, 2).join(', ')}); child spells them aloud or on a whiteboard.`,
      }
    case 2:
      return {
        objective: `Read connected text with ${lw.pattern}; ${grade === '1st' ? lw.comprehension.toLowerCase() : 'answer questions about it'}.`,
        materials: ['Story page (printed)', 'Letter cards taped to the floor for spelling hop'],
        teach: [
          `Comprehension focus: ${lw.comprehension}.`,
          lw.passage ? `Preview: "This story is called '${lw.passage.title}'." Point out one tricky word.` : 'Read the sentences together first.',
          'Child reads aloud; you reread it smoothly; child rereads.',
          'Talk about it: ask the questions out loud, one at a time. Answers are spoken, not written, today.',
        ],
        practice: [
          `Spelling hop (movement): tape letters on the floor; child hops the letters to spell ${lw.words.slice(0, 3).join(', ')}, saying each sound.`,
          'Act out or draw the story; tell what happened first, next, and last.',
        ],
        optional: [`Writing: ${lw.writing}`],
        check: lw.passage ? `Answers: "${lw.passage.questions[0].q}" (${lw.passage.questions[0].a}).` : 'Reads both sentences with help on no more than one word.',
        ifStruggling: 'You read a sentence, child echoes it. Then answer orally.',
        ifMastered: 'Child reads to a younger sibling with expression.',
        minimum: lw.passage ? `Read "${lw.passage.title}" together once; ask one question.` : `Read one sentence: "${lw.sentences[0]}"`,
      }
    case 3:
    default:
      return {
        objective: `Review ${lw.pattern}${lw.grammar ? `; grammar: ${lw.grammar.toLowerCase()}` : ''}.`,
        materials: ['Worksheet', 'Paper for dictation'],
        teach: [
          ...(lw.grammar ? [`Grammar: ${lw.grammar}. Show one example from this week’s sentences: "${lw.sentences[0]}"`] : []),
          grade === '1st' && lw.spelling ? `Spelling check: dictate ${lw.spelling.join(', ')}.` : `Dictation: say ${lw.words.slice(0, 3).join(', ')}; child writes each.`,
        ],
        practice: ['Complete the review worksheet.', lw.passage ? `Reread "${lw.passage.title}" for fluency.` : 'Reread this week’s sentences.'],
        check: 'Mark the week’s skill in Progress: Practicing, Demonstrated independently, or Needs review.',
        ifStruggling: 'Keep this pattern on next week’s warm-up cards.',
        ifMastered: 'Move on — try the optional challenge.',
        optional: ['Challenge: write your own sentence using two spelling words.'],
        minimum: `Dictate three words: ${lw.words.slice(0, 3).join(', ')}.`,
      }
  }
}

export function literacyLesson(week: number, day: LessonDay, grade: Grade): DailyLesson {
  const lw = getLiteracyWeek(grade, week)
  const guide = literacyGuide(lw, day, grade)
  const prints = printsOn('literacy', grade, day)
  const skillIds = lw.review ? [] : [literacySkillId(grade, week)]
  const hfwIds = lw.hfw.filter((w) => w !== 'review').map((w) => hfwSkillId(grade, w))
  return {
    id: lessonId(week, day, grade, 'literacy'),
    week,
    day,
    grade,
    subject: 'literacy',
    title: lw.title,
    phase: LESSON_DAY_NAMES[day],
    guide,
    minutes: MINUTES.literacy[grade],
    skillIds: [...skillIds, ...hfwIds],
    introduces: day === 0 ? [...skillIds, ...hfwIds] : [],
    worksheet: prints ? slot(week, day, grade, 'literacy') : null,
    childTask:
      grade === 'pre-k'
        ? ['Letter fun', 'Sound sort', 'Letter hop', 'Letter review'][day]
        : ['Build words', 'Word practice', 'Read & talk', 'Review'][day],
    activity: (grade === 'pre-k' ? ['hands-on', 'hands-on', 'movement', 'review'] : ['hands-on', 'academic', 'discussion', 'review'] as const)[day] as ActivityType,
  }
}

// ───────────────────────────── MATH ─────────────────────────────

function mathGuide(t: MathTopic, prev: MathTopic | null, day: LessonDay): TeachingGuide {
  const m = mathMethod(t)
  const base = {
    objective: t.objective,
    ifStruggling: t.ifStruggling,
    ifMastered: t.ifMastered,
    what: m.what,
    why: m.why,
    how: m.how,
    example: m.example,
    warmUp: mentalMathWarmUp(t.grade, t.week, day),
    whenReady: t.whenReady,
  }
  switch (day) {
    case 0:
      // Concrete: real objects only. Nothing to print.
      return {
        ...base,
        materials: t.materials,
        stages: [{ label: 'Concrete', text: m.concrete }],
        teach: [`Say what we are doing: "${m.what}"`, ...t.teach, `Say why it works: "${m.why}"`],
        practice: [...t.practice, `Child explains one answer: "I know because…" while showing it with the objects.`],
        check: t.check,
        minimum: t.easy,
      }
    case 1:
      // Pictorial → Abstract on paper.
      return {
        ...base,
        materials: [...t.materials, 'Worksheet'],
        stages: [
          { label: 'Concrete (quick re-model)', text: t.teach[0] },
          { label: 'Pictorial', text: m.pictorial },
          { label: 'Abstract', text: m.abstract },
        ],
        teach: [`Re-model once with objects: ${t.teach[0]}`, `Draw it: ${m.pictorial}`, `Write it: ${m.abstract}`, 'Do the first problem on the worksheet together, out loud.'],
        practice: ['Complete the worksheet. Keep the objects on the table — any answer can be proved with them.'],
        check: t.check,
        minimum: t.easy,
      }
    case 2:
      // Apply: everyday life + movement. Nothing to print.
      return {
        ...base,
        materials: t.materials,
        stages: [{ label: 'Apply', text: 'Real-life problems and a movement game — math away from the table.' }],
        teach: ['Real-life problems (say them aloud; act them out with real things):', ...m.realLife.map((q) => `• ${q}`)],
        practice: [`Movement game: ${m.movement}`, `Game: ${t.game}`],
        check: t.check,
        optional: ['Child makes up a story problem about today’s skill for you to solve.'],
        minimum: `${m.realLife[0]} Then play: ${m.movement}`,
      }
    case 3:
    default:
      // Review: independent practice, spiral review, mastery check.
      return {
        ...base,
        materials: ['Worksheet', ...t.materials.slice(0, 1)],
        stages: [{ label: 'Abstract — independent', text: `Independent practice${prev ? `, with review of last week (${prev.title})` : ''}.` }],
        teach: [`Spiral review: this week (${t.title})${prev ? ` and last week (${prev.title})` : ''}.`, 'Child works independently first; help only after they try.'],
        practice: [
          'Complete the review worksheet.',
          `Mastery check (out loud, no help): ${t.check}`,
          'Ask: "How did you solve that one?" Listen for the WHY, not just the answer.',
        ],
        check: 'Mark the skill in Progress: Practicing, Demonstrated independently, or Needs review. Only "Demonstrated independently" means mastered.',
        minimum: t.easy,
      }
  }
}

export function mathLesson(week: number, day: LessonDay, grade: Grade): DailyLesson {
  const t = getMathWeek(grade, week)
  const prev = week > 1 ? getMathWeek(grade, week - 1) : null
  const prints = printsOn('math', grade, day)
  const ids = t.review ? [] : [mathSkillId(grade, week)]
  return {
    id: lessonId(week, day, grade, 'math'),
    week,
    day,
    grade,
    subject: 'math',
    title: t.title,
    phase: LESSON_DAY_NAMES[day],
    guide: mathGuide(t, prev, day),
    minutes: MINUTES.math[grade],
    skillIds: ids,
    introduces: day === 0 ? ids : [],
    worksheet: prints ? slot(week, day, grade, 'math') : null,
    childTask: ['Math with objects', 'Math on paper', 'Math in real life', 'Math check'][day],
    activity: (['hands-on', 'academic', 'movement', 'review'] as const)[day],
  }
}

/**
 * Fluency gate: timed practice is offered only once the concept skills behind
 * a fluency topic are demonstrated independently. Until then practice stays
 * untimed, with objects available.
 */
export function applyFluencyGate(lesson: DailyLesson, demonstrated: (skillId: string) => boolean): DailyLesson {
  if (lesson.subject !== 'math' || lesson.day !== 3) return lesson
  const t = getMathWeek(lesson.grade, lesson.week)
  const isFacts = t.gen.kind === 'facts'
  if (!t.fluency && !isFacts) return lesson
  const prereqs = t.fluency?.prereqWeeks ?? [lesson.week]
  const ready = prereqs.every((w) => demonstrated(mathSkillId(lesson.grade, w)))
  const line = ready
    ? 'Fluency: the concept is demonstrated, so a 1-minute timed round is OK. Race your own last score, not a sibling.'
    : 'Fluency: keep practice untimed for now — the concept skill is not yet marked "Demonstrated independently." Accuracy and explaining first; speed later.'
  return { ...lesson, guide: { ...lesson.guide, practice: [...lesson.guide.practice, line] } }
}

// ───────────────────────────── HANDWRITING (Pre-K, K) ─────────────────────────────

export function handwritingLesson(week: number, day: LessonDay, grade: Grade): DailyLesson | null {
  if (grade === '1st') return null
  const hw = getHandwritingWeek(grade, week)
  const focus = hw.nameFocus ? 'your name' : hw.letters.join(' ')
  const nums = hw.numbers.join(', ')
  const talk = formationTalk([...hw.letters, ...hw.numbers].join(''))
  const what = hw.nameFocus ? 'Writing my name with each letter starting in the right place.' : `Forming ${hw.letters.join(', ')} and the number${hw.numbers.length > 1 ? 's' : ''} ${nums}.`
  const why = 'Starting each letter and number in the same place, moving the same way every time, makes writing faster and neater — and it keeps b/d and 2/5 from flipping.'
  const how = ['Find the starting place (top line or middle line).', 'Say the formation words while you move.', 'Check: does it sit on the baseline?']
  const byDay: Record<LessonDay, Omit<TeachingGuide, 'ifStruggling' | 'ifMastered'>> = {
    0: {
      objective: `See and feel how ${focus} and ${nums} are formed.`,
      materials: ['Salt, sugar, or shaving-cream tray (a baking sheet works)', 'Whiteboard or chalkboard'],
      stages: [{ label: 'Big movements', text: 'Sky-write with a straight arm, then finger-write in the tray. No pencil today.' }],
      teach: ['Model slowly, saying the words as you go:', ...talk.map((t) => `• ${t}`)],
      practice: ['Sky-write each one 3 times with a straight arm.', 'Finger-write each one in the tray, then shake to erase.'],
      check: 'Starts at the correct place without reminders.',
      minimum: 'Sky-write this week’s letter and number together, 3 times each.',
    },
    1: {
      objective: `Trace and copy ${focus} and ${nums} from the starting dot.`,
      materials: ['Handwriting page', 'Pencil (a short or golf pencil helps a pinch grip)'],
      stages: [{ label: 'Guided → copy', text: 'Green dot = start. Red arrow = which way to go. Then write one on your own.' }],
      teach: [`Tip: ${hw.tip}`, 'Do the first letter together: finger on the green dot, follow the arrow, say the formation words.'],
      practice: ['Complete the handwriting page — one row at a time; cover the rows below if it helps.', 'Circle your best one in each row.'],
      check: 'Most letters start at the dot and sit on the baseline.',
      minimum: 'Trace the first row together.',
    },
    2: {
      objective: 'Build finger strength and pencil control.',
      materials: ['See the fine-motor activity'],
      stages: [{ label: 'Fine motor', text: hw.fineMotor }],
      teach: [hw.fineMotor, `Then write ${hw.nameFocus ? 'your name' : hw.letters.slice(0, 2).join(' and ')} big on a whiteboard, sidewalk chalk, or a steamy window.`],
      practice: ['Fine-motor activity (5 minutes).', 'Whiteboard or chalk: write each letter and number of the week twice.'],
      check: 'Uses a pinch (tripod) grip for the whiteboard writing.',
      minimum: hw.fineMotor,
    },
    3: {
      objective: `Write ${focus} and ${nums} with less help; practice my name.`,
      materials: ['Handwriting page', 'Pencil'],
      stages: [{ label: 'Independent', text: 'Trace once, copy once, then write from memory.' }],
      teach: ['Dictation: say a letter (or word) from this week; child writes it without looking.', 'Count the pictures together before writing the number.'],
      practice: ['Complete the handwriting page.', 'Name: write it on the page, then on a drawing.'],
      check: 'Writes this week’s letters and numbers from memory with the correct start. Mark the handwriting skill in Progress.',
      minimum: 'Write your name once and one letter from this week.',
    },
  }
  const g = byDay[day]
  const ids = [handwritingSkillId(grade, week)]
  return {
    id: lessonId(week, day, grade, 'handwriting'),
    week,
    day,
    grade,
    subject: 'handwriting',
    title: hw.nameFocus ? 'My name' : `${hw.letters.join(' ') || `Review ${hw.review.join(' ')}`}${hw.numbers.length ? ` · ${nums}` : ''}`,
    phase: LESSON_DAY_NAMES[day],
    guide: {
      ...g,
      what,
      why,
      how,
      ifStruggling: 'Go back to big movements (sky, tray, play dough). Trace with a finger before a pencil. Fewer letters per row.',
      ifMastered: grade === 'k' ? 'Copy a short sentence from a book with finger spaces.' : 'Write the letter without the starting dot.',
    },
    minutes: MINUTES.handwriting[grade],
    skillIds: ids,
    introduces: day === 0 ? ids : [],
    worksheet: printsOn('handwriting', grade, day) ? slot(week, day, grade, 'handwriting') : null,
    childTask: ['Sky-writing', 'Handwriting page', 'Finger strength', 'Handwriting check'][day],
    activity: (['hands-on', 'academic', 'hands-on', 'review'] as const)[day],
  }
}

// ───────────────────────────── LANGUAGE BUILDING ─────────────────────────────

export function languageLesson(week: number, day: LessonDay, grade: Grade, name?: string, literacyGrade: Grade = grade): DailyLesson {
  const d = languageDay(week, day, name, literacyGrade)
  return {
    id: lessonId(week, day, grade, 'language'),
    week,
    day,
    grade,
    subject: 'language',
    title: d.title,
    phase: LESSON_DAY_NAMES[day],
    guide: {
      objective: `Language focus: ${STRAND_LABEL[d.focus]} (review: ${STRAND_LABEL[d.review].toLowerCase()}). Listen, understand, and answer in full sentences.`,
      materials: day === 0 ? ['A picture of this week’s Bible story (children’s Bible)'] : day === 3 ? ['Paper for quick sequence pictures'] : ['Household objects'],
      teach: d.steps,
      practice: [`Vocabulary this week: ${d.vocab.join(', ')}.`, `Visual support: ${d.visual}`],
      check: d.check,
      ifStruggling: 'Offer two choices (with pictures if possible), model the full sentence, and have the child say it back. Same skill, more support.',
      ifMastered: 'Ask a follow-up "why" or "how do you know?" and have the child ask you a question.',
      minimum: d.minimum,
      starters: d.starters,
    },
    minutes: MINUTES.language[grade],
    skillIds: [languageSkillId(d.focus)],
    introduces: [],
    worksheet: null,
    childTask: ['Picture talk', 'Listen & do', 'Talk game', 'Retell'][day],
    activity: d.activity,
  }
}

export function coreLessons(week: number, day: LessonDay, grade: Grade): DailyLesson[] {
  return [bibleLesson(week, day, grade), literacyLesson(week, day, grade), mathLesson(week, day, grade)]
}
