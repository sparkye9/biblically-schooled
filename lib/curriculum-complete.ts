// Curriculum Weeks 3-36 Template Structure
// This file provides the skeleton for systematic expansion
// Copy/paste pattern for each week; fill in content incrementally

import type { Lesson } from './types'

/**
 * WEEKS 3-36 TEMPLATE STRUCTURE
 *
 * Each week follows this pattern:
 * - Monday: Core subject (Bible, Literacy, Math) + introduction
 * - Tuesday: Phonics/Math continuation + Science intro
 * - Wednesday: Co-op (no regular lessons)
 * - Thursday: Art + Core reinforcement
 * - Friday: Library + Review
 *
 * For each day, create 3 lessons (one per grade band: pre-k, k, 1st)
 */

export const week3To36Template = `
// ==================== WEEK X: [THEME] ====================

const weekXLessons: Lesson[] = [
  // Monday Pre-K
  {
    id: 'l-wX-mon-pre-k-lit',
    title: '[TITLE]',
    subject: 'literacy',
    activityType: 'mom-time',
    weekNumber: X,
    day: 'monday',
    gradeBand: 'pre-k',
    minutes: 8,
    essential: true,
    owner: 'shared',
    learningObjective: '[OBJECTIVE]',
    biblicalConnection: '[CONNECTION]',
    materials: ['[MATERIAL 1]', '[MATERIAL 2]'],
    momTime: {
      duration: 8,
      script: '[5-10 sentence teaching script]',
      steps: [
        '[Step 1]',
        '[Step 2]',
        '[Step 3]',
        '[Step 4]',
        '[Step 5]',
      ],
    },
    guidedPractice: {
      description: '[Description of adult modeling]',
      example: '[Concrete example]',
    },
    independentActivity: {
      description: '[What child does mostly alone]',
      isHandsOn: false,
    },
    requiredWorksheet: {
      title: '[WORKSHEET TITLE]',
      fileUrl: '/worksheets/week-0X/pre-k/[FILE_NAME].pdf',
    },
    challengeWorksheet: {
      title: '⭐ Challenge Me! [CHALLENGE TITLE]',
      fileUrl: '/worksheets/week-0X/pre-k/Challenge_[NAME].pdf',
      description: '[What makes it a challenge]',
    },
    answerKey: '[Expected responses]',
    ifStruggling: '[Support strategy]',
    ifAdvanced: '[Acceleration suggestion]',
  },

  // Monday Pre-K Math
  {
    id: 'l-wX-mon-pre-k-math',
    title: '[MATH TITLE]',
    subject: 'math',
    activityType: 'hands-on',
    weekNumber: X,
    day: 'monday',
    gradeBand: 'pre-k',
    minutes: 10,
    essential: true,
    owner: 'shared',
    // ... continue with same structure
  },

  // Monday Kindergarten Literacy
  {
    id: 'l-wX-mon-k-lit',
    // ... same structure, different content
  },

  // ... continue with k-math, 1st-lit, 1st-math for Monday
  // Then repeat for Tuesday, Thursday, Friday (Wednesday is co-op)
]
`

/**
 * CURRICULUM SCOPE & SEQUENCE (36-WEEK YEAR)
 *
 * Month 1-2 (Weeks 1-8): Foundations
 * - Week 1: Creation & Identity
 * - Week 2: Family
 * - Week 3: God's Care
 * - Week 4: Senses & Exploration
 * - Week 5: Animals
 * - Week 6: Habitats
 * - Week 7: Growth & Change
 * - Week 8: Fall Harvest
 *
 * Month 3-4 (Weeks 9-16): Community & Relationships
 * - Week 9: Community Helpers
 * - Week 10: Emotions
 * - Week 11: Kindness
 * - Week 12: Thanksgiving/Gratitude
 * - Week 13: Jesus Stories
 * - Week 14: Winter Weather
 * - Week 15: New Year/New Beginnings
 * - Week 16: Celebrations
 *
 * Month 5-6 (Weeks 17-24): Natural World & God's Creation
 * - Week 17: Water Cycle
 * - Week 18: Plants
 * - Week 19: Insects
 * - Week 20: Birds
 * - Week 21: Weather
 * - Week 22: Space & Stars
 * - Week 23: Spring Signs
 * - Week 24: Life Cycles
 *
 * Month 7-8 (Weeks 25-32): Growth & Learning
 * - Week 25: Learning & Brains
 * - Week 26: Healthy Bodies
 * - Week 27: Healthy Habits
 * - Week 28: Friendship
 * - Week 29: Colors & Rainbows
 * - Week 30: Shapes
 * - Week 31: Patterns
 * - Week 32: Measurement
 *
 * Month 9 (Weeks 33-36): Review & Celebration
 * - Week 33: Bible Review
 * - Week 34: Skills Review
 * - Week 35: Favorite Topics Replay
 * - Week 36: Year-End Celebration
 */

/**
 * LITERACY PROGRESSION (K-1st)
 *
 * Kindergarten:
 * - Weeks 1-4: Letter sounds (A, I, O, U, consonants)
 * - Weeks 5-8: Beginning sounds + CVC introduction
 * - Weeks 9-12: CVC word families
 * - Weeks 13-16: Blending CVC words
 * - Weeks 17-20: Short vowel practice
 * - Weeks 21-24: Introduction to long vowels
 * - Weeks 25-28: Word families & rhyming
 * - Weeks 29-32: Sight words & CVC review
 * - Weeks 33-36: Celebration & fluency
 *
 * 1st Grade:
 * - Weeks 1-4: Review short vowels + digraphs (CH, TH, SH)
 * - Weeks 5-8: Blending & CVC application
 * - Weeks 9-12: Vowel teams (AI, EA, OO)
 * - Weeks 13-16: R-controlled vowels (AR, ER, OR)
 * - Weeks 17-20: Silent E patterns
 * - Weeks 21-24: Consonant blends (BR, CR, DR, etc.)
 * - Weeks 25-28: Sight words & sight word sentences
 * - Weeks 29-32: Reading comprehension
 * - Weeks 33-36: Chapter books & fluency
 */

/**
 * MATH PROGRESSION
 *
 * Pre-K:
 * - Counting 1-10
 * - One-to-one correspondence
 * - Shapes (circle, square, triangle, rectangle)
 * - Sorting & categorizing
 * - Measuring (length, height)
 * - Patterns (simple AB patterns)
 *
 * Kindergarten:
 * - Counting to 20
 * - Number recognition
 * - Number bonds (ways to make 5-10)
 * - Comparison (more, less, equal)
 * - Introduction to addition (within 10)
 * - Introduction to subtraction (within 10)
 * - Measurement & comparison
 * - 2D & 3D shapes
 *
 * 1st Grade:
 * - Addition facts to 20
 * - Subtraction facts to 20
 * - Word problems
 * - Place value (tens and ones)
 * - Measurement (inches, centimeters)
 * - Time (hour, half-hour)
 * - Money (pennies, nickels, dimes)
 * - 2D & 3D shapes & properties
 */

export const curriculumScope = {
  totalWeeks: 36,
  lessonsPerWeek: 15, // 5 days × 3 grade bands (with multiple subjects per day)
  totalLessons: 540, // Approximate
  subjects: ['bible', 'literacy', 'math', 'science', 'art'],
  activityTypes: ['mom-time', 'independent', 'hands-on', 'optional'],
  gradeBands: ['pre-k', 'k', '1st'],
}

export const buildProgressionMap = (weekNumber: number) => {
  const progressionBySubject: Record<string, Record<string, string>> = {
    literacy: {
      'pre-k': 'Letter recognition, sounds, tracing',
      'k': 'Phonics scope & sequence by week',
      '1st': 'Decoding, blending, fluency progression',
    },
    math: {
      'pre-k': 'Counting, sorting, shapes, patterns',
      'k': 'Addition/subtraction intro, place value intro',
      '1st': 'Addition/subtraction fluency, place value, measurement',
    },
    bible: {
      'pre-k': 'Stories, God's care, safety in God',
      'k': 'Bible characters, God's character traits',
      '1st': 'Bible history, character development, God's plan',
    },
    science: {
      'pre-k': 'Observation, sensory exploration, simple sorting',
      'k': 'Animals, plants, weather, life cycles',
      '1st': 'Ecosystems, life cycles, scientific method, physical science',
    },
    art: {
      'pre-k': 'Process-focused (paint, color, collage)',
      'k': 'Techniques (mixing colors, cutting, combining materials)',
      '1st': 'Projects with purpose, observation-based art',
    },
  }

  return progressionBySubject
}
