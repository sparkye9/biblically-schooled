import { getBibleWeek } from './bible'
import { getLiteracyWeek, type LiteracyWeek } from './literacy'
import { getMathWeek, type MathTopic } from './math'
import { grapheme } from './phonics'
import { picturesStartingWith } from './pictures'
import { hfwSkillId, literacySkillId, mathSkillId } from './skills'
import {
  LESSON_DAY_NAMES,
  type CoreSubject,
  type DayMode,
  type Grade,
  type LessonDay,
  type TeachingGuide,
} from './types'

/**
 * Daily lessons are built from the scope & sequence on demand. Each of the
 * four lesson days in a week has a different job (Introduce → Practice →
 * Apply → Review) and a different activity, so the same lesson is never
 * repeated four times — the root cause of the old "repetitive lessons" issue.
 */

export interface WorksheetSlot {
  /** Stable id: `w{week}-d{day}-{grade}-{subject}`. */
  id: string
  week: number
  day: LessonDay
  grade: Grade
  subject: CoreSubject
}

export interface DailyLesson {
  id: string
  week: number
  day: LessonDay
  grade: Grade
  subject: CoreSubject
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
}

const MINUTES: Record<CoreSubject, Record<Grade, Record<DayMode, number>>> = {
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
}

/** Pre-K gets printed work only twice a week; the other days are hands-on. */
const PREK_PRINT_DAYS: LessonDay[] = [1, 3]

function slot(week: number, day: LessonDay, grade: Grade, subject: CoreSubject): WorksheetSlot {
  return { id: `w${week}-d${day}-${grade}-${subject}`, week, day, grade, subject }
}

export function lessonId(week: number, day: LessonDay, grade: Grade, subject: CoreSubject) {
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
  const printsBible = day === 1
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
          teach: ['Model tracing your own name slowly: "Start at the top."'],
          practice: ['Trace your name on the worksheet.', 'Draw a picture of yourself.'],
          minimum: 'Trace the first letter of your name in the air three times.',
        },
        2: {
          teach: ['Cut a copy of the name card into letters. Say: "Let’s build your name like a puzzle."'],
          practice: ['Put the name puzzle back in order, then check against the card.'],
          minimum: 'Mix up 3 letters of the name; child puts them in order.',
        },
        3: {
          teach: ['Say: "Let’s hunt for the letters in your name."'],
          practice: ['Find letters from your name in a book or cereal box.', 'Clap the syllables in each family name.'],
          minimum: 'Find the first letter of your name on a book cover.',
        },
      }
      return {
        objective: 'Recognize my own name and the letters in it.',
        materials: ['Name card (write each child’s name on an index card)', 'Play dough or crayons', ...(day === 1 ? ['Worksheet'] : [])],
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
          objective: `Trace ${L.toUpperCase()} and ${L} with correct starting points.`,
          materials: ['Worksheet', 'Crayons'],
          teach: [`Model: "Start at the top." Trace a big ${L.toUpperCase()} in the air together, then on the table with a finger.`, `Say the sound ${grapheme(L).sound} while tracing.`],
          practice: ['Trace the letters on the worksheet (finger first, then crayon).', prekPhonoActivity(lw)],
          check: `Starts ${L.toUpperCase()} from the top.`,
          ifStruggling: 'Trace with a finger in a tray of salt or rice instead of the worksheet.',
          ifMastered: `Write ${L.toUpperCase()} without tracing.`,
          minimum: `Trace ${L.toUpperCase()} in the air three times while saying ${grapheme(L).sound}.`,
        },
        2: {
          objective: `Hear ${grapheme(L).sound} at the beginning of words. ${lw.phono}.`,
          materials: ['Salt/rice tray or shaving cream', `Objects: ${objects.join(', ')}`],
          teach: [`Say: "Listen: ${kw.slice(0, 2).join(', ')}. They all start with ${grapheme(L).sound}."`],
          practice: [`Write ${L} in the sensory tray.`, prekPhonoActivity(lw)],
          check: `Says yes/no correctly to "Does ___ start with ${grapheme(L).sound}?" for 3 words.`,
          ifStruggling: 'Exaggerate the first sound and use real objects.',
          ifMastered: 'Name two more words that start with the sound.',
          minimum: `Play I Spy with ${grapheme(L).sound} for two minutes.`,
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
        teach: ['Model the worksheet with the first item, thinking out loud.'],
        practice: ['Complete the worksheet.', prekPhonoActivity(lw)],
        minimum: 'Do the first two items of the worksheet together, out loud.',
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
      materials: ['Letter cards for letters learned so far', ...(day % 2 === 1 ? ['Worksheet'] : ['Small objects or pictures'])],
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
        materials: ['Letter cards or whiteboard', 'Worksheet'],
        teach: [
          warmup,
          ...(isLetters ? gs.flatMap((g) => letterIntro(g).slice(0, 2)) : [`Say: "${concept}"`]),
          `Blend together: write ${blendWords.join(', ')}. Touch under each sound, then slide your finger and read the word.`,
          ...(hfw.length ? [`New sight words: ${hfw.join(', ')}. Say: "We just have to know these by heart." Spell each aloud, then read it.`] : []),
        ],
        practice: ['Child reads the words on the board.', 'Complete the worksheet.'],
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
        materials: ['Worksheet (reading passage)'],
        teach: [
          `Comprehension focus: ${lw.comprehension}.`,
          lw.passage ? `Preview: "This story is called '${lw.passage.title}'." Point out one tricky word.` : 'Read the sentences together first.',
          'Child reads aloud; you reread it smoothly; child rereads.',
        ],
        practice: ['Answer the questions on the worksheet.', `Writing: ${lw.writing}`],
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
  const prints = grade === 'pre-k' ? PREK_PRINT_DAYS.includes(day) : true
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
        ? ['Letter fun', 'Letter tracing', 'Sound hunt', 'Letter review'][day]
        : ['New sounds', 'Word practice', 'Reading', 'Review'][day],
  }
}

// ───────────────────────────── MATH ─────────────────────────────

function mathGuide(t: MathTopic, prev: MathTopic | null, day: LessonDay): TeachingGuide {
  const base = {
    objective: t.objective,
    ifStruggling: t.ifStruggling,
    ifMastered: t.ifMastered,
  }
  switch (day) {
    case 0:
      return { ...base, materials: t.materials, teach: t.teach, practice: t.practice, check: t.check, minimum: t.easy }
    case 1:
      return {
        ...base,
        materials: [...t.materials, 'Worksheet'],
        teach: [`Re-model once: ${t.teach[0]}`, 'Say: "Today we use pictures instead of objects."'],
        practice: ['Complete the worksheet. Keep counters on the table to check answers.', ...t.practice.slice(1)],
        check: t.check,
        minimum: t.easy,
      }
    case 2:
      return {
        ...base,
        materials: [...t.materials, 'Worksheet'],
        teach: [`Game: ${t.game}`],
        practice: ['Play the game for 5 minutes.', 'Complete the worksheet.'],
        check: t.check,
        optional: ['Make up your own math story about today’s skill.'],
        minimum: `Play the game for 5 minutes: ${t.game}`,
      }
    case 3:
    default:
      return {
        ...base,
        materials: ['Worksheet', ...t.materials.slice(0, 1)],
        teach: [`Spiral review: this week (${t.title})${prev ? ` and last week (${prev.title})` : ''}.`],
        practice: ['Complete the review worksheet.', `Quick check: ${t.check}`],
        check: 'Mark the skill in Progress: Practicing, Demonstrated independently, or Needs review.',
        minimum: t.easy,
      }
  }
}

export function mathLesson(week: number, day: LessonDay, grade: Grade): DailyLesson {
  const t = getMathWeek(grade, week)
  const prev = week > 1 ? getMathWeek(grade, week - 1) : null
  // Introduce day is always hands-on with real objects (concrete before pictures).
  const prints = grade === 'pre-k' ? PREK_PRINT_DAYS.includes(day) : day !== 0
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
    childTask: ['Math with objects', 'Math practice', 'Math game', 'Math review'][day],
  }
}

export function coreLessons(week: number, day: LessonDay, grade: Grade): DailyLesson[] {
  return [bibleLesson(week, day, grade), literacyLesson(week, day, grade), mathLesson(week, day, grade)]
}
