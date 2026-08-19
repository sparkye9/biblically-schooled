import type {
  Assignment,
  Child,
  CoverageRequest,
  CurriculumWeek,
  Household,
  Lesson,
  ParentNote,
  ReadAloudBook,
  Resource,
  Skill,
  SupplyItem,
} from './types'

export const DEMO_DAY = 'tuesday' as const
export const DEMO_WEEK = 1

export const households: Household[] = [
  { id: 'h-venessa', name: "Venessa's Homeschool", momName: 'Venessa', momInitial: 'V' },
  { id: 'h-lola', name: "Lola's Homeschool", momName: 'Lola', momInitial: 'L' },
]

export const children: Child[] = [
  {
    id: 'c-alijah',
    name: 'Alijah',
    grade: '1st Grade',
    gradeBand: '1st',
    householdId: 'h-venessa',
    color: 'child-alijah',
    childMode: true,
    lowDistraction: false,
  },
  {
    id: 'c-olori',
    name: 'Olori-Joy',
    grade: 'Kindergarten',
    gradeBand: 'k',
    householdId: 'h-venessa',
    color: 'child-olori',
    childMode: false,
    lowDistraction: false,
  },
  {
    id: 'c-seraiah',
    name: 'Seraiah',
    grade: 'Pre-K',
    gradeBand: 'pre-k',
    householdId: 'h-venessa',
    color: 'child-seraiah',
    childMode: false,
    lowDistraction: false,
  },
  {
    id: 'c-amelia',
    name: 'Amelia',
    grade: 'Pre-K',
    gradeBand: 'pre-k',
    householdId: 'h-lola',
    color: 'child-amelia',
    childMode: false,
    lowDistraction: false,
  },
]

export const weeks: CurriculumWeek[] = [
  {
    id: 'w1',
    number: 1,
    theme: 'God Created Me & My World',
    bibleRef: 'Genesis 1',
    bigIdea: 'Then God made people, and He said it was very good.',
    memoryVerse: 'Then God saw everything that He had made, and indeed it was very good.',
    memoryVerseRef: 'Genesis 1:31',
    art: ['God Created Me & My World craft', 'God Created Me & My World coloring page'],
    science: ['Living vs Nonliving'],
  },
  {
    id: 'w2',
    number: 2,
    theme: 'God Made Me & My Family',
    bibleRef: 'Genesis 1-2',
    bigIdea: 'God made your family on purpose, too.',
    memoryVerse: 'So God created man in His own image.',
    memoryVerseRef: 'Genesis 1:27',
    art: ['God Made Me & My Family craft', 'God Made Me & My Family coloring page'],
    science: ['My Five Senses'],
  },
  {
    id: 'w3',
    number: 3,
    theme: 'Noah Trusted God',
    bibleRef: 'Genesis 6-9',
    bigIdea: 'God put a rainbow in the sky as His promise.',
    memoryVerse: 'Thus Noah did; according to all that God commanded him, so he did.',
    memoryVerseRef: 'Genesis 6:22',
    art: ['Noah Trusted God craft', 'Noah Trusted God coloring page'],
    science: ['What Living Things Need'],
  },
  {
    id: 'w4',
    number: 4,
    theme: 'Abraham Follows God',
    bibleRef: 'Genesis 12',
    bigIdea: 'Abraham trusted God every step of the way.',
    memoryVerse: 'I will bless you.',
    memoryVerseRef: 'Genesis 12:2',
    art: ['Abraham Follows God craft', 'Abraham Follows God coloring page'],
    science: ['Animal Habitats'],
  },
  {
    id: 'w5',
    number: 5,
    theme: 'Joseph: God Has a Plan',
    bibleRef: 'Genesis 37-50',
    bigIdea: 'God turned something bad into something good.',
    memoryVerse: 'God meant it for good.',
    memoryVerseRef: 'Genesis 50:20',
    art: ['Joseph: God Has a Plan craft', 'Joseph: God Has a Plan coloring page'],
    science: ['Landforms & Water'],
  },
  {
    id: 'w6',
    number: 6,
    theme: 'Baby Moses: God Protects',
    bibleRef: 'Exodus 1-3',
    bigIdea: 'When Moses grew up, God spoke to him from a burning bush.',
    memoryVerse: 'I will certainly be with you.',
    memoryVerseRef: 'Exodus 3:12',
    art: ['Baby Moses: God Protects craft', 'Baby Moses: God Protects coloring page'],
    science: ['Matter: Solids & Liquids'],
  },
  {
    id: 'w7',
    number: 7,
    theme: 'Let My People Go',
    bibleRef: 'Exodus 5-12',
    bigIdea: 'God set His people free.',
    memoryVerse: 'Let My people go, that they may serve Me.',
    memoryVerseRef: 'Exodus 9:1',
    art: ['Let My People Go craft', 'Let My People Go coloring page'],
    science: ['States of Matter: Solid, Liquid, Gas'],
  },
  {
    id: 'w8',
    number: 8,
    theme: 'Quarter Review: God Keeps His Promises',
    bibleRef: 'Exodus 14-15',
    bigIdea: 'The people sang a thank-you song to God.',
    memoryVerse: 'The LORD is my strength and song.',
    memoryVerseRef: 'Exodus 15:2',
    art: ['Quarter Review: God Keeps His Promises craft', 'Quarter Review: God Keeps His Promises coloring page'],
    science: ['Science Review & Experiment Day'],
  },
  {
    id: 'w9',
    number: 9,
    theme: 'The Ten Commandments',
    bibleRef: 'Exodus 19-20',
    bigIdea: 'God\'s rules keep us safe and happy.',
    memoryVerse: 'Honor your father and your mother.',
    memoryVerseRef: 'Exodus 20:12',
    art: ['The Ten Commandments craft', 'The Ten Commandments coloring page'],
    science: ['Force & Motion: Push and Pull'],
  },
  {
    id: 'w10',
    number: 10,
    theme: 'God Provides: Manna in the Desert',
    bibleRef: 'Exodus 16',
    bigIdea: 'God gave His people just what they needed, every day.',
    memoryVerse: 'Man shall not live by bread alone.',
    memoryVerseRef: 'Deuteronomy 8:3',
    art: ['God Provides: Manna in the Desert craft', 'God Provides: Manna in the Desert coloring page'],
    science: ['Energy: Light & Heat from the Sun'],
  },
  {
    id: 'w11',
    number: 11,
    theme: 'Joshua & the Walls of Jericho',
    bibleRef: 'Joshua 1-6',
    bigIdea: 'The people obeyed, and the walls fell down.',
    memoryVerse: 'Be strong and of good courage.',
    memoryVerseRef: 'Joshua 1:9',
    art: ['Joshua & the Walls of Jericho craft', 'Joshua & the Walls of Jericho coloring page'],
    science: ['Simple Machines: Ramp, Lever, Wheel'],
  },
  {
    id: 'w12',
    number: 12,
    theme: 'Gideon: Small but Mighty',
    bibleRef: 'Judges 6-7',
    bigIdea: 'God won the battle so everyone knew it was His power.',
    memoryVerse: 'The LORD is with you, mighty man of valor!',
    memoryVerseRef: 'Judges 6:12',
    art: ['Gideon: Small but Mighty craft', 'Gideon: Small but Mighty coloring page'],
    science: ['Ecosystems: Pond & Forest'],
  },
  {
    id: 'w13',
    number: 13,
    theme: 'Ruth: Loyal Love',
    bibleRef: 'Ruth 1-4',
    bigIdea: 'God took care of Ruth and gave her a new family.',
    memoryVerse: 'Your people shall be my people, and your God, my God.',
    memoryVerseRef: 'Ruth 1:16',
    art: ['Ruth: Loyal Love craft', 'Ruth: Loyal Love coloring page'],
    science: ['Food Chains'],
  },
  {
    id: 'w14',
    number: 14,
    theme: 'David & Goliath',
    bibleRef: '1 Samuel 17',
    bigIdea: 'The battle belonged to the Lord.',
    memoryVerse: 'The battle is the LORD\'s.',
    memoryVerseRef: '1 Samuel 17:47',
    art: ['David & Goliath craft', 'David & Goliath coloring page'],
    science: ['Weather Patterns'],
  },
  {
    id: 'w15',
    number: 15,
    theme: 'David the Shepherd (Psalm 23)',
    bibleRef: 'Psalm 23',
    bigIdea: 'God cares for us like a good shepherd cares for his sheep.',
    memoryVerse: 'The LORD is my shepherd; I shall not want.',
    memoryVerseRef: 'Psalm 23:1',
    art: ['David the Shepherd (Psalm 23) craft', 'David the Shepherd (Psalm 23) coloring page'],
    science: ['Climate: Hot & Cold Places'],
  },
]

// ---------------------------------------------------------------------------
// Curriculum builder — fills every week with lessons, assignments & worksheets
// so every household and grade sees a full, usable term on first load.
// ---------------------------------------------------------------------------

const HOME_DAYS: Array<'monday' | 'tuesday' | 'thursday' | 'friday'> = [
  'monday',
  'tuesday',
  'thursday',
  'friday',
]

interface SubjectPlan {
  title: string
  minutes: number
  essential: boolean
  printable: boolean
}

interface GradePlans {
  math: SubjectPlan
  literacy: SubjectPlan
  science: SubjectPlan
}

type GradeBandKey = 'prek' | 'k' | '1st'

const WEEK_PLANS: Record<number, Record<GradeBandKey, GradePlans>> = {
  1: {
    prek: {
      math: { title: 'Five Frame: Count 1-5', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter A Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Living vs Nonliving', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Ten Frames: Count & +1', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Aa - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'Living vs Nonliving', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Number Bonds to 10', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Short A: Decodable Reading', minutes: 10, essential: true, printable: true },
      science: { title: 'Living vs Nonliving', minutes: 10, essential: false, printable: true },
    },
  },
  2: {
    prek: {
      math: { title: 'Five Frame: Count 1-5', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter B Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'My Five Senses', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Teen Numbers: 10 and Some More', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Mm - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'My Five Senses', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Tens & Ones: Teen Numbers', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Short E: Decodable Reading', minutes: 10, essential: true, printable: true },
      science: { title: 'My Five Senses', minutes: 10, essential: false, printable: true },
    },
  },
  3: {
    prek: {
      math: { title: 'Circles & Squares', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter C Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'What Living Things Need', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Compare with Ten Frames', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Ss - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'What Living Things Need', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Make 10 to Add', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Short I: Decodable Reading', minutes: 10, essential: true, printable: true },
      science: { title: 'What Living Things Need', minutes: 10, essential: false, printable: true },
    },
  },
  4: {
    prek: {
      math: { title: 'Big & Small', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter D Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Animal Habitats', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Shapes All Around', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Tt - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'Animal Habitats', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Subtract with 10', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Short O: Decodable Reading', minutes: 10, essential: true, printable: true },
      science: { title: 'Animal Habitats', minutes: 10, essential: false, printable: true },
    },
  },
  5: {
    prek: {
      math: { title: 'Count & Color 1-5', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter E Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Landforms & Water', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Number Bonds of 5', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Pp - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'Landforms & Water', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Number Bonds & Equal Groups', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Short U: Decodable Reading', minutes: 10, essential: true, printable: true },
      science: { title: 'Landforms & Water', minutes: 10, essential: false, printable: true },
    },
  },
  6: {
    prek: {
      math: { title: 'Match the Halves', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter F Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Matter: Solids & Liquids', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Halves & Fair Shares', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Nn - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'Matter: Solids & Liquids', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Fractions: Halves & Fourths', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Digraph SH: Read & Write', minutes: 10, essential: true, printable: true },
      science: { title: 'Matter: Solids & Liquids', minutes: 10, essential: false, printable: true },
    },
  },
  7: {
    prek: {
      math: { title: 'Shape Patterns', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter G Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'States of Matter: Solid, Liquid, Gas', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Ways to Make 5', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Cc - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'States of Matter: Solid, Liquid, Gas', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Equal Parts & Fair Shares', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Digraph CH: Read & Write', minutes: 10, essential: true, printable: true },
      science: { title: 'States of Matter: Solid, Liquid, Gas', minutes: 10, essential: false, printable: true },
    },
  },
  8: {
    prek: {
      math: { title: 'Review: Count & Shapes', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter Review A-G', minutes: 5, essential: true, printable: true },
      science: { title: 'Science Review & Experiment Day', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Q1 Review: Count, Shapes, Add', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Review Aa-Cc', minutes: 6, essential: true, printable: true },
      science: { title: 'Science Review & Experiment Day', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Quarter 1 Math Review', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Reading Check: Q1 Review', minutes: 10, essential: true, printable: true },
      science: { title: 'Science Review & Experiment Day', minutes: 10, essential: false, printable: true },
    },
  },
  9: {
    prek: {
      math: { title: 'Count 6-10', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter H Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Force & Motion: Push and Pull', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Pennies & Dimes', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Dd - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'Force & Motion: Push and Pull', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Coins: Count On from 10', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Digraph TH: Read & Write', minutes: 10, essential: true, printable: true },
      science: { title: 'Force & Motion: Push and Pull', minutes: 10, essential: false, printable: true },
    },
  },
  10: {
    prek: {
      math: { title: 'Count to 10', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter I Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Energy: Light & Heat from the Sun', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Count by 10s', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Gg - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'Energy: Light & Heat from the Sun', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Tens & Money', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Digraph WH: Read & Write', minutes: 10, essential: true, printable: true },
      science: { title: 'Energy: Light & Heat from the Sun', minutes: 10, essential: false, printable: true },
    },
  },
  11: {
    prek: {
      math: { title: 'Long & Short', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter J Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Simple Machines: Ramp, Lever, Wheel', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Longer or Shorter?', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Oo - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'Simple Machines: Ramp, Lever, Wheel', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Measure & Compare', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Silent E: a_e Words', minutes: 10, essential: true, printable: true },
      science: { title: 'Simple Machines: Ramp, Lever, Wheel', minutes: 10, essential: false, printable: true },
    },
  },
  12: {
    prek: {
      math: { title: 'Trace Triangles', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter K Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Ecosystems: Pond & Forest', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Sides & Corners', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Bb - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'Ecosystems: Pond & Forest', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Shapes: Sides & Corners', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Silent E: i_e Words', minutes: 10, essential: true, printable: true },
      science: { title: 'Ecosystems: Pond & Forest', minutes: 10, essential: false, printable: true },
    },
  },
  13: {
    prek: {
      math: { title: 'Count the Squares', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter L Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Food Chains', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Count the Squares', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Ff - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'Food Chains', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Count Squares: Area & Sides', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Silent E: o_e Words', minutes: 10, essential: true, printable: true },
      science: { title: 'Food Chains', minutes: 10, essential: false, printable: true },
    },
  },
  14: {
    prek: {
      math: { title: 'My Day in Order', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter M Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Weather Patterns', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Clock Hands & Hours', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Hh - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'Weather Patterns', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Clocks to the Hour & Half Hour', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Silent E: u_e Words', minutes: 10, essential: true, printable: true },
      science: { title: 'Weather Patterns', minutes: 10, essential: false, printable: true },
    },
  },
  15: {
    prek: {
      math: { title: 'Count & Pattern Review', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter N Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Climate: Hot & Cold Places', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Picture Problems to 5', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Ll - Sound & Trace', minutes: 6, essential: true, printable: true },
      science: { title: 'Climate: Hot & Cold Places', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Bar Model Word Problems', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Silent E Review & Rhymes', minutes: 10, essential: true, printable: true },
      science: { title: 'Climate: Hot & Cold Places', minutes: 10, essential: false, printable: true },
    },
  },
}

const BIBLE_TITLES: Record<number, string> = {
  1: 'Family Bible: God Created Me & My World',
  2: 'Family Bible: God Made Me & My Family',
  3: 'Family Bible: Noah Trusted God',
  4: 'Family Bible: Abraham Follows God',
  5: 'Family Bible: Joseph: God Has a Plan',
  6: 'Family Bible: Baby Moses: God Protects',
  7: 'Family Bible: Let My People Go',
  8: 'Family Bible: Quarter Review: God Keeps His Promises',
  9: 'Family Bible: The Ten Commandments',
  10: 'Family Bible: God Provides: Manna in the Desert',
  11: 'Family Bible: Joshua & the Walls of Jericho',
  12: 'Family Bible: Gideon: Small but Mighty',
  13: 'Family Bible: Ruth: Loyal Love',
  14: 'Family Bible: David & Goliath',
  15: 'Family Bible: David the Shepherd (Psalm 23)',
}

const BIBLE_MINUTES: Record<number, number> = { 1: 7, 2: 7, 3: 7, 4: 7, 5: 7, 6: 7, 7: 7, 8: 7, 9: 7, 10: 7, 11: 7, 12: 7, 13: 7, 14: 7, 15: 7 }

const SUBJECT_KEYS: Array<'math' | 'literacy' | 'science'> = [
  'math',
  'literacy',
  'science',
]

const GRADE_KEY: Record<string, GradeBandKey> = {
  'pre-k': 'prek',
  k: 'k',
  '1st': '1st',
}

function buildLessons(): Lesson[] {
  const out: Lesson[] = []
  let n = 0
  const nextId = () => `l-seed-${++n}`

  for (const week of weeks) {
    // Shared family Bible lesson — every child, Monday.
    out.push({
      id: nextId(),
      title: BIBLE_TITLES[week.number],
      subject: 'bible',
      activityType: 'mom-time',
      weekNumber: week.number,
      day: 'monday',
      gradeBand: 'pre-k',
      minutes: BIBLE_MINUTES[week.number],
      essential: true,
      owner: 'shared',
      youNeed: ['A Bible', 'Crayons for a coloring page'],
      teach: [
        `Read ${week.bibleRef} together.`,
        'Talk about this week’s big idea.',
        `Practice the memory verse: ${week.memoryVerseRef}.`,
      ],
      ask: ['What did you learn about God this week?', 'How can we thank God today?'],
      watchFor: 'Keep it short and warm for the little ones.',
      interactive: 'memory-verse',
      printable: true,
    })

    for (const child of children) {
      const gradeKey = GRADE_KEY[child.gradeBand]
      const plan = WEEK_PLANS[week.number][gradeKey]
      for (const day of HOME_DAYS) {
        for (const subject of SUBJECT_KEYS) {
          const s = plan[subject]
          const isScience = subject === 'science'
          out.push({
            id: nextId(),
            title: s.title,
            subject,
            activityType: isScience ? 'hands-on' : 'mom-time',
            weekNumber: week.number,
            day,
            gradeBand: child.gradeBand,
            minutes: s.minutes,
            essential: s.essential,
            owner: 'shared',
            youNeed: isScience
              ? ['Objects from around the house']
              : ['A few supplies from this week’s list'],
            teach: [
              `Introduce ${s.title} for Week ${week.number}.`,
              'Model it once, then let your child try with help.',
              'Wrap up by celebrating what they did.',
            ],
            ask: ['What was easy?', 'What did you notice?'],
            watchFor: 'Stop while they’re still enjoying it.',
            interactive: isScience ? 'math-manipulatives' : 'phonics',
            printable: s.printable,
          })
        }
      }
    }
  }
  return out
}

function buildAssignments(lessons: Lesson[]): Assignment[] {
  const out: Assignment[] = []
  let n = 0
  const nextId = () => `a-seed-${++n}`
  for (const lesson of lessons) {
    for (const child of children) {
      const isBible = lesson.subject === 'bible'
      if (!isBible && lesson.gradeBand !== child.gradeBand) continue
      out.push({
        id: nextId(),
        lessonId: lesson.id,
        childId: child.id,
        status: lesson.weekNumber === 1 ? 'done' : 'todo',
        completedAt: lesson.weekNumber === 1 ? '2026-07-17' : undefined,
      })
    }
  }
  return out
}

// ---- Built exports ---------------------------------------------------------

export const lessons: Lesson[] = buildLessons()

export const assignments: Assignment[] = buildAssignments(lessons)

export const skills: Skill[] = [
  { id: 's1', childId: 'c-alijah', track: 'literacy', name: 'CVC Blending', status: 'mastered' },
  { id: 's2', childId: 'c-alijah', track: 'literacy', name: 'Short A', status: 'mastered' },
  { id: 's3', childId: 'c-alijah', track: 'literacy', name: 'Short E', status: 'practicing' },
  { id: 's4', childId: 'c-alijah', track: 'literacy', name: 'Digraph SH', status: 'learning' },
  { id: 's5', childId: 'c-alijah', track: 'literacy', name: 'Fluency', status: 'practicing' },
  { id: 's6', childId: 'c-alijah', track: 'math', name: 'Number Bonds', status: 'practicing' },
  { id: 's7', childId: 'c-alijah', track: 'math', name: 'Addition within 10', status: 'practicing' },
  { id: 's8', childId: 'c-alijah', track: 'math', name: 'Word Problems', status: 'learning' },
  { id: 's9', childId: 'c-olori', track: 'literacy', name: 'Phonemic Awareness', status: 'practicing' },
  { id: 's10', childId: 'c-olori', track: 'literacy', name: 'Letter Sounds', status: 'learning' },
  { id: 's11', childId: 'c-olori', track: 'literacy', name: 'Oral Blending', status: 'learning' },
  { id: 's12', childId: 'c-olori', track: 'math', name: 'Counting to 10', status: 'practicing' },
  { id: 's13', childId: 'c-olori', track: 'math', name: 'Number Sense', status: 'learning' },
  { id: 's14', childId: 'c-seraiah', track: 'literacy', name: 'Letter Exposure', status: 'learning' },
  { id: 's15', childId: 'c-seraiah', track: 'literacy', name: 'Phonological Awareness', status: 'learning' },
  { id: 's16', childId: 'c-seraiah', track: 'math', name: 'Counting 1–5', status: 'practicing' },
  { id: 's17', childId: 'c-seraiah', track: 'math', name: 'Shapes', status: 'learning' },
  { id: 's18', childId: 'c-amelia', track: 'literacy', name: 'Letter Exposure', status: 'practicing' },
  { id: 's19', childId: 'c-amelia', track: 'literacy', name: 'Phonological Awareness', status: 'learning' },
  { id: 's20', childId: 'c-amelia', track: 'math', name: 'Counting 1–5', status: 'learning' },
  { id: 's21', childId: 'c-amelia', track: 'math', name: 'Sorting', status: 'learning' },
]

// ---------------------------------------------------------------------------
// Real printable packets — Weeks 1–5 worksheet PDFs shipped in /public/worksheets.
// Each child gets a personalized Mon/Tue/Thu/Fri packet; Amelia's packets are
// Seraiah's content relabeled with her name (same Pre-K plan, both girls).
// ---------------------------------------------------------------------------

const PACKET_DAY_FILE: Record<'monday' | 'tuesday' | 'thursday' | 'friday', string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  thursday: 'Thu',
  friday: 'Fri',
}

const PACKET_CHILD_FOLDER: Record<string, string> = {
  'c-alijah': 'Alijah',
  'c-olori': 'Olori-Joy',
  'c-seraiah': 'Seraiah',
  'c-amelia': 'Amelia',
}

const PACKET_WEEKS = Array.from({ length: 15 }, (_, i) => i + 1)

function weekFolder(weekNumber: number) {
  return `week-${String(weekNumber).padStart(2, '0')}`
}

function buildPacketResources(): Resource[] {
  const out: Resource[] = []
  let n = 0
  const nextId = () => `r-packet-${++n}`

  for (const weekNumber of PACKET_WEEKS) {
    for (const child of children) {
      const folder = PACKET_CHILD_FOLDER[child.id]
      for (const day of HOME_DAYS) {
        out.push({
          id: nextId(),
          title: `Week ${weekNumber} · ${dayTitle(day)} Packet — ${child.name}`,
          type: 'Daily Packet',
          subject: 'review',
          skill: 'Bible, math & literacy practice',
          gradeBand: child.gradeBand,
          weekNumber,
          minutes: 20,
          owner: child.householdId,
          contributor: child.name,
          saved: false,
          childId: child.id,
          fileUrl: `/worksheets/${weekFolder(weekNumber)}/${folder}/${PACKET_DAY_FILE[day]}.pdf`,
        })
      }
    }
    out.push({
      id: nextId(),
      title: `Week ${weekNumber} Parent Checklist`,
      type: 'Parent Checklist',
      subject: 'review',
      skill: 'Sunday prep & weekly rhythm',
      gradeBand: 'pre-k',
      weekNumber,
      minutes: 10,
      owner: 'h-venessa',
      contributor: 'Venessa',
      saved: false,
      fileUrl: `/worksheets/${weekFolder(weekNumber)}/Parent_Checklist.pdf`,
    })
  }
  return out
}

function dayTitle(day: 'monday' | 'tuesday' | 'thursday' | 'friday') {
  if (day === 'monday') return 'Monday'
  if (day === 'tuesday') return 'Tuesday'
  if (day === 'thursday') return 'Thursday'
  return 'Friday'
}

export const resources: Resource[] = buildPacketResources()

export const readAloud: ReadAloudBook[] = [
  { id: 'b1', title: 'The Berenstain Bears and the Spooky Old Tree', status: 'currently-reading', householdId: 'h-venessa' },
  { id: 'b2', title: 'Blueberries for Sal', status: 'favorite', householdId: 'h-venessa' },
  { id: 'b3', title: 'The Big Book of Weather', status: 'library', householdId: 'h-venessa' },
  { id: 'b4', title: 'God Made the World', status: 'finished', householdId: 'h-lola' },
]

export const supplies: SupplyItem[] = [
  { id: 'sp1', label: 'Print Monday & Tuesday packets', section: 'print', have: false },
  { id: 'sp2', label: '7 counters (or LEGO / beans)', section: 'household', have: true, substitute: 'LEGO, beans, buttons, or snacks' },
  { id: 'sp3', label: 'Construction paper', section: 'craft', have: true },
  { id: 'sp4', label: 'Glue & crayons', section: 'craft', have: true },
  { id: 'sp5', label: 'Small objects for living/nonliving sort', section: 'science', have: false },
  { id: 'sp6', label: 'Sand or salt tray', section: 'optional', have: false, substitute: 'Shaving cream or a textured tracing card' },
]

export const coverageRequests: CoverageRequest[] = []

export const parentNotes: ParentNote[] = []