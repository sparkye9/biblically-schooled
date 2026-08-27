import type { Worksheet } from './types'

/**
 * Worksheet metadata and file paths
 * Worksheets follow a progression model:
 * - Monday/Introduce: Visual intro, minimal writing
 * - Tuesday/Guided: Modeled activity, child participates
 * - Wednesday/Independent: Child completes mostly alone
 * - Thursday/Apply: Real-world application
 * - Friday/Review: Mixed practice, preparation for next week
 *
 * Challenge worksheets are optional enrichment activities
 * that deepen thinking, not add volume.
 */

export const worksheets: Worksheet[] = [
  // ==================== WEEK 1: God Created Me & My World ====================

  // Pre-K (Seraiah/Amelia)
  {
    id: 'ws-w1-mon-pre-k-lit',
    title: 'Introduce: I Am Special (Tracing & Matching)',
    subject: 'literacy',
    skill: 'Letter Recognition - Me/I',
    weekNumber: 1,
    day: 'monday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/pre-k/Monday_Literacy_Introduce.pdf',
    description:
      'Highly visual: Match pictures of body parts, trace large letters, large pictures',
  },
  {
    id: 'ws-w1-tue-pre-k-lit',
    title: 'Guided: Trace My Name',
    subject: 'literacy',
    skill: 'Name tracing & fine motor',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/pre-k/Tuesday_Literacy_Guided.pdf',
    description: 'Trace name with dots, color self-portrait, circle familiar letters',
  },
  {
    id: 'ws-w1-wed-pre-k-lit',
    title: 'Independent: Find & Circle Me',
    subject: 'literacy',
    skill: 'Visual discrimination, letter matching',
    weekNumber: 1,
    day: 'wednesday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/pre-k/Wednesday_Literacy_Independent.pdf',
    description: 'Find and circle the letter M/I in context, visual activities',
  },
  {
    id: 'ws-w1-thu-pre-k-lit',
    title: 'Apply: Me Puzzle & Pattern',
    subject: 'literacy',
    skill: 'Pattern recognition, fine motor',
    weekNumber: 1,
    day: 'thursday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/pre-k/Thursday_Literacy_Apply.pdf',
    description: 'Cut & paste body parts, complete simple patterns',
  },
  {
    id: 'ws-w1-fri-pre-k-lit',
    title: 'Review: Creation Sequence Match',
    subject: 'literacy',
    skill: 'Sequencing, visual memory',
    weekNumber: 1,
    day: 'friday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/pre-k/Friday_Literacy_Review.pdf',
    description: 'Match pictures in order, color and celebrate learning',
  },
  {
    id: 'ws-w1-math-pre-k',
    title: 'Number Sense: Count to 3',
    subject: 'math',
    skill: 'Counting, one-to-one correspondence',
    weekNumber: 1,
    day: 'monday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/pre-k/Math_Count_to_3.pdf',
    description: 'Count objects, circle groups of 1, 2, 3, manipulatives support',
  },
  {
    id: 'ws-w1-challenge-pre-k-lit',
    title: '⭐ Challenge Me! Letter Hunt',
    subject: 'literacy',
    skill: 'Advanced letter recognition, sorting',
    weekNumber: 1,
    day: 'friday',
    gradeBand: 'pre-k',
    isChallenge: true,
    fileUrl: '/worksheets/week-01/pre-k/Challenge_Letter_Hunt.pdf',
    description:
      'Find multiple letter examples in pictures, sort by shape, puzzle challenge',
  },
  {
    id: 'ws-w1-challenge-pre-k-math',
    title: '⭐ Challenge Me! Counting Beyond',
    subject: 'math',
    skill: 'Counting beyond 3, more/less concepts',
    weekNumber: 1,
    day: 'friday',
    gradeBand: 'pre-k',
    isChallenge: true,
    fileUrl: '/worksheets/week-01/pre-k/Challenge_Count_Beyond.pdf',
    description: 'Count to 5, compare groups (more/fewer), puzzle activities',
  },

  // Kindergarten (Olori-Joy)
  {
    id: 'ws-w1-mon-k-lit',
    title: 'Introduce: Alphabet Sounds /A/ and /I/',
    subject: 'literacy',
    skill: 'Phonemic awareness, letter sounds',
    weekNumber: 1,
    day: 'monday',
    gradeBand: 'k',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/k/Monday_Literacy_Phonics.pdf',
    description: 'Sound play for /a/ and /i/, trace letters A and I, picture matching',
  },
  {
    id: 'ws-w1-tue-k-lit',
    title: 'Guided: Find & Write /A/ Words',
    subject: 'literacy',
    skill: 'Decoding, beginning sounds',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: 'k',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/k/Tuesday_Literacy_Guided.pdf',
    description: 'Find pictures that start with /a/, trace and write a, handwriting practice',
  },
  {
    id: 'ws-w1-wed-k-lit',
    title: 'Independent: Sound Sorting A vs I',
    subject: 'literacy',
    skill: 'Phonemic awareness, categorization',
    weekNumber: 1,
    day: 'wednesday',
    gradeBand: 'k',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/k/Wednesday_Literacy_Independent.pdf',
    description: 'Sort pictures by initial sound, cut & paste into columns',
  },
  {
    id: 'ws-w1-mon-k-math',
    title: 'Introduce: Number Bonds 1-5',
    subject: 'math',
    skill: 'Number sense, decomposition',
    weekNumber: 1,
    day: 'monday',
    gradeBand: 'k',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/k/Math_Number_Bonds.pdf',
    description: 'Show different ways to make 3, 4, 5 with manipulatives and pictures',
  },
  {
    id: 'ws-w1-challenge-k-lit',
    title: '⭐ Challenge Me! Decode CVC Word',
    subject: 'literacy',
    skill: 'Advanced decoding, word building',
    weekNumber: 1,
    day: 'friday',
    gradeBand: 'k',
    isChallenge: true,
    fileUrl: '/worksheets/week-01/k/Challenge_Decode_CVC.pdf',
    description: 'Use known sounds to read unfamiliar CVC words, write simple word',
  },
  {
    id: 'ws-w1-challenge-k-math',
    title: '⭐ Challenge Me! Story Problems',
    subject: 'math',
    skill: 'Problem-solving, number operations',
    weekNumber: 1,
    day: 'friday',
    gradeBand: 'k',
    isChallenge: true,
    fileUrl: '/worksheets/week-01/k/Challenge_Story_Problems.pdf',
    description:
      'Simple story problems (add/remove), draw solution, multiple ways to show answer',
  },

  // 1st Grade (Alijah)
  {
    id: 'ws-w1-mon-1st-lit',
    title: 'Introduce: Digraph /TH/ Sound',
    subject: 'literacy',
    skill: 'Phonics: Consonant digraph',
    weekNumber: 1,
    day: 'monday',
    gradeBand: '1st',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/1st/Monday_Literacy_Digraph.pdf',
    description:
      'Learn /th/ sound through pictures & words, trace and write digraph, sound discrimination',
  },
  {
    id: 'ws-w1-tue-1st-lit',
    title: 'Guided: Read & Write /TH/ Words',
    subject: 'literacy',
    skill: 'Decoding and spelling',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: '1st',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/1st/Tuesday_Literacy_Guided.pdf',
    description: 'Read words with /th/, fill-in-the-blank sentences, handwriting practice',
  },
  {
    id: 'ws-w1-wed-1st-lit',
    title: 'Independent: /TH/ Word Hunt & Comprehension',
    subject: 'literacy',
    skill: 'Reading fluency, comprehension',
    weekNumber: 1,
    day: 'wednesday',
    gradeBand: '1st',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/1st/Wednesday_Literacy_Independent.pdf',
    description:
      'Find /th/ words in short passage, answer comprehension questions, write a sentence',
  },
  {
    id: 'ws-w1-mon-1st-math',
    title: 'Introduce: Addition Strategies (Make 10)',
    subject: 'math',
    skill: 'Addition facts, decomposition',
    weekNumber: 1,
    day: 'monday',
    gradeBand: '1st',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/1st/Math_Make_10_Intro.pdf',
    description:
      'Visual introduction to making 10 with manipulatives, ten-frames, guided problems',
  },
  {
    id: 'ws-w1-tue-1st-math',
    title: 'Guided: Solve with Ten-Frames',
    subject: 'math',
    skill: 'Addition facts 0-10',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: '1st',
    isChallenge: false,
    fileUrl: '/worksheets/week-01/1st/Math_Ten_Frames_Guided.pdf',
    description: 'Fill ten-frames, solve addition problems, show thinking',
  },
  {
    id: 'ws-w1-challenge-1st-lit',
    title: '⭐ Challenge Me! Digraph Application',
    subject: 'literacy',
    skill: 'Advanced phonics application, sentence writing',
    weekNumber: 1,
    day: 'friday',
    gradeBand: '1st',
    isChallenge: true,
    fileUrl: '/worksheets/week-01/1st/Challenge_Digraph_Sentences.pdf',
    description:
      'Write sentences using /th/ words, edit for capitals & periods, read unfamiliar passage',
  },
  {
    id: 'ws-w1-challenge-1st-math',
    title: '⭐ Challenge Me! Multi-Step Problems',
    subject: 'math',
    skill: 'Problem-solving, multi-step operations',
    weekNumber: 1,
    day: 'friday',
    gradeBand: '1st',
    isChallenge: true,
    fileUrl: '/worksheets/week-01/1st/Challenge_Multi_Step_Math.pdf',
    description:
      'Solve 2-3 step word problems, show multiple strategies, explain mathematical thinking',
  },

  // ==================== WEEK 2: God Made Me & My Family ====================

  // Pre-K (Seraiah/Amelia) - Continued progression
  {
    id: 'ws-w2-mon-pre-k-lit',
    title: 'Introduce: Family Members (Naming & Matching)',
    subject: 'literacy',
    skill: 'Vocabulary, visual discrimination',
    weekNumber: 2,
    day: 'monday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-02/pre-k/Monday_Literacy_Family.pdf',
    description: 'Match family member pictures, trace M (mom/me), name-pointing',
  },
  {
    id: 'ws-w2-mon-pre-k-math',
    title: 'Count Families: 1-5 Objects',
    subject: 'math',
    skill: 'Counting, grouping',
    weekNumber: 2,
    day: 'monday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-02/pre-k/Math_Count_Families.pdf',
    description:
      'Count family members, groups of objects, visual sorting by size/color',
  },
  {
    id: 'ws-w2-challenge-pre-k-lit',
    title: '⭐ Challenge Me! Family Patterns',
    subject: 'literacy',
    skill: 'Pattern completion, sequencing',
    weekNumber: 2,
    day: 'friday',
    gradeBand: 'pre-k',
    isChallenge: true,
    fileUrl: '/worksheets/week-02/pre-k/Challenge_Family_Patterns.pdf',
    description:
      'Complete family-themed patterns, multi-attribute sorting (size, gender, clothing)',
  },

  // Kindergarten (Olori-Joy) - Continued progression
  {
    id: 'ws-w2-mon-k-lit',
    title: 'Introduce: /F/ & /M/ Beginning Sounds',
    subject: 'literacy',
    skill: 'Phonemic awareness, letter-sound correspondence',
    weekNumber: 2,
    day: 'monday',
    gradeBand: 'k',
    isChallenge: false,
    fileUrl: '/worksheets/week-02/k/Monday_Literacy_FM_Sounds.pdf',
    description: 'Sound play, trace F and M, picture-sound matching for families/mom',
  },
  {
    id: 'ws-w2-mon-k-math',
    title: 'Introduce: Comparing Quantities (More/Less)',
    subject: 'math',
    skill: 'Quantity comparison, greater than/less than',
    weekNumber: 2,
    day: 'monday',
    gradeBand: 'k',
    isChallenge: false,
    fileUrl: '/worksheets/week-02/k/Math_More_Less.pdf',
    description:
      'Compare groups of family members, circle larger/smaller group, manipulatives',
  },
  {
    id: 'ws-w2-challenge-k-lit',
    title: '⭐ Challenge Me! Create Own Word',
    subject: 'literacy',
    skill: 'Phonemic awareness, invented spelling',
    weekNumber: 2,
    day: 'friday',
    gradeBand: 'k',
    isChallenge: true,
    fileUrl: '/worksheets/week-02/k/Challenge_Create_Word.pdf',
    description: 'Create a family-themed word using known sounds, draw picture, share',
  },

  // 1st Grade (Alijah) - Continued progression
  {
    id: 'ws-w2-mon-1st-lit',
    title: 'Introduce: Vowel Team /OO/ (boot/book)',
    subject: 'literacy',
    skill: 'Vowel teams, phonics',
    weekNumber: 2,
    day: 'monday',
    gradeBand: '1st',
    isChallenge: false,
    fileUrl: '/worksheets/week-02/1st/Monday_Literacy_OO_Team.pdf',
    description:
      'Introduce long /oo/ vs short /oo/ sounds, picture sorting, tracing and writing',
  },
  {
    id: 'ws-w2-mon-1st-math',
    title: 'Introduce: Subtraction as Inverse of Addition',
    subject: 'math',
    skill: 'Subtraction, related facts',
    weekNumber: 2,
    day: 'monday',
    gradeBand: '1st',
    isChallenge: false,
    fileUrl: '/worksheets/week-02/1st/Math_Subtraction_Inverse.pdf',
    description:
      'Show inverse relationship between addition & subtraction, ten-frames, equations',
  },
  {
    id: 'ws-w2-challenge-1st-lit',
    title: '⭐ Challenge Me! OO Sound Discrimination',
    subject: 'literacy',
    skill: 'Phonics application, reading comprehension',
    weekNumber: 2,
    day: 'friday',
    gradeBand: '1st',
    isChallenge: true,
    fileUrl: '/worksheets/week-02/1st/Challenge_OO_Reading.pdf',
    description:
      'Read passage with /oo/ words, identify correct vs incorrect sounds, write explanation',
  },

  // ==================== WEEKS 3-4: Abbreviated for space ====================
  // (In production, continue this pattern for all 36 weeks)

  {
    id: 'ws-w3-mon-pre-k-lit',
    title: 'Introduce: Shapes (Circle, Square, Triangle)',
    subject: 'literacy',
    skill: 'Visual recognition, shape naming',
    weekNumber: 3,
    day: 'monday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-03/pre-k/Monday_Shapes_Intro.pdf',
  },
  {
    id: 'ws-w3-mon-k-lit',
    title: 'Introduce: Blending CVC Words (consonant-vowel-consonant)',
    subject: 'literacy',
    skill: 'Phonics, blending',
    weekNumber: 3,
    day: 'monday',
    gradeBand: 'k',
    isChallenge: false,
    fileUrl: '/worksheets/week-03/k/Monday_Blending_CVC.pdf',
  },
  {
    id: 'ws-w3-mon-1st-lit',
    title: 'Introduce: Sight Words (the, and, is)',
    subject: 'literacy',
    skill: 'Sight word recognition, fluency',
    weekNumber: 3,
    day: 'monday',
    gradeBand: '1st',
    isChallenge: false,
    fileUrl: '/worksheets/week-03/1st/Monday_Sight_Words.pdf',
  },

  {
    id: 'ws-w4-mon-pre-k-lit',
    title: 'Introduce: Colors in Nature',
    subject: 'literacy',
    skill: 'Color naming, vocabulary',
    weekNumber: 4,
    day: 'monday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-04/pre-k/Monday_Colors_Nature.pdf',
  },
  {
    id: 'ws-w4-mon-k-lit',
    title: 'Introduce: Rhyming Words',
    subject: 'literacy',
    skill: 'Phonological awareness, rhyme',
    weekNumber: 4,
    day: 'monday',
    gradeBand: 'k',
    isChallenge: false,
    fileUrl: '/worksheets/week-04/k/Monday_Rhyming.pdf',
  },
  {
    id: 'ws-w4-mon-1st-lit',
    title: 'Introduce: Compound Words',
    subject: 'literacy',
    skill: 'Word structure, vocabulary',
    weekNumber: 4,
    day: 'monday',
    gradeBand: '1st',
    isChallenge: false,
    fileUrl: '/worksheets/week-04/1st/Monday_Compound_Words.pdf',
  },

  // Add math worksheets for weeks 3-4
  {
    id: 'ws-w3-mon-pre-k-math',
    title: 'Sort Shapes & Objects',
    subject: 'math',
    skill: 'Classification, sorting',
    weekNumber: 3,
    day: 'monday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-03/pre-k/Math_Sort_Shapes.pdf',
  },
  {
    id: 'ws-w3-mon-k-math',
    title: 'Number Sequences 1-10',
    subject: 'math',
    skill: 'Number order, sequence',
    weekNumber: 3,
    day: 'monday',
    gradeBand: 'k',
    isChallenge: false,
    fileUrl: '/worksheets/week-03/k/Math_Sequences.pdf',
  },
  {
    id: 'ws-w3-mon-1st-math',
    title: 'Skip Counting by 2s & 5s',
    subject: 'math',
    skill: 'Number patterns, multiplication foundation',
    weekNumber: 3,
    day: 'monday',
    gradeBand: '1st',
    isChallenge: false,
    fileUrl: '/worksheets/week-03/1st/Math_Skip_Counting.pdf',
  },
  {
    id: 'ws-w4-mon-pre-k-math',
    title: 'Number Writing Practice 1-5',
    subject: 'math',
    skill: 'Numeral formation, fine motor',
    weekNumber: 4,
    day: 'monday',
    gradeBand: 'pre-k',
    isChallenge: false,
    fileUrl: '/worksheets/week-04/pre-k/Math_Number_Writing.pdf',
  },
  {
    id: 'ws-w4-mon-k-math',
    title: 'Measurement: Length Comparison',
    subject: 'math',
    skill: 'Measurement, comparison',
    weekNumber: 4,
    day: 'monday',
    gradeBand: 'k',
    isChallenge: false,
    fileUrl: '/worksheets/week-04/k/Math_Length.pdf',
  },
  {
    id: 'ws-w4-mon-1st-math',
    title: 'Word Problems: Addition & Subtraction',
    subject: 'math',
    skill: 'Problem-solving, operations',
    weekNumber: 4,
    day: 'monday',
    gradeBand: '1st',
    isChallenge: false,
    fileUrl: '/worksheets/week-04/1st/Math_Word_Problems.pdf',
  },
]

/**
 * Get worksheets for a specific lesson
 */
export function getWorksheetFor(
  weekNumber: number,
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday',
  subject: string,
  gradeBand: string,
  isChallenge: boolean = false,
): Worksheet | undefined {
  return worksheets.find(
    (ws) =>
      ws.weekNumber === weekNumber &&
      ws.day === day &&
      ws.subject === subject &&
      ws.gradeBand === gradeBand &&
      ws.isChallenge === isChallenge,
  )
}

/**
 * Get all worksheets for a child for a given week
 */
export function getWeeklyWorksheets(
  weekNumber: number,
  gradeBand: string,
  includeChallenge: boolean = true,
) {
  return worksheets.filter(
    (ws) =>
      ws.weekNumber === weekNumber &&
      ws.gradeBand === gradeBand &&
      (includeChallenge || !ws.isChallenge),
  )
}

/**
 * Get challenge worksheets for a child for a given week
 */
export function getChallengeWorksheets(
  weekNumber: number,
  gradeBand: string,
) {
  return worksheets.filter(
    (ws) => ws.weekNumber === weekNumber && ws.gradeBand === gradeBand && ws.isChallenge,
  )
}
