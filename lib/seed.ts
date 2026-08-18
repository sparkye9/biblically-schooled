import type {
  Assignment,
  Child,
  CoverageRequest,
  CurriculumWeek,
  GradeBand,
  Household,
  Lesson,
  ParentNote,
  ReadAloudBook,
  Resource,
  ResourceType,
  Skill,
  Subject,
  SupplyItem,
} from './types'

export const DEMO_DAY = 'tuesday' as const
export const DEMO_WEEK = 1

export const households: Household[] = [
  { id: 'h-venessa', name: "Venessa's Homeschool", momName: 'Venessa', momInitial: 'V' },
  { id: 'h-lola', name: "Damilola's Homeschool", momName: 'Damilola', momInitial: 'D' },
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
    bigIdea: 'God made everything — and He made me on purpose.',
    memoryVerse: 'God saw all that he had made, and it was very good.',
    memoryVerseRef: 'Genesis 1:31',
    art: ['Creation Day collage', '"God Made Me Special" self portrait'],
    science: ['Living vs Nonliving', 'Five Senses'],
  },
  {
    id: 'w2',
    number: 2,
    theme: 'Noah: Weather, Water & God\u2019s Promise',
    bibleRef: 'Genesis 6\u20139',
    bigIdea: 'God keeps His promises, and the rainbow reminds us.',
    memoryVerse: 'I have set my rainbow in the clouds.',
    memoryVerseRef: 'Genesis 9:13',
    art: ['Rainbow resist', 'Ark craft'],
    science: ['Weather observation', 'Sink or float'],
  },
  {
    id: 'w3',
    number: 3,
    theme: 'Joseph: Colors, Patterns & Feelings',
    bibleRef: 'Genesis 37, 39\u201345',
    bigIdea: 'God can turn hard things into good things.',
    memoryVerse: 'You intended to harm me, but God intended it for good.',
    memoryVerseRef: 'Genesis 50:20',
    art: ['Colorful coat collage', 'Pattern weaving'],
    science: ['Color mixing', 'Texture investigation'],
  },
  {
    id: 'w4',
    number: 4,
    theme: 'Moses: Light, Sound & Courage',
    bibleRef: 'Exodus 2\u201314',
    bigIdea: 'God gives us courage to do hard things.',
    memoryVerse: 'The Lord will fight for you; you need only to be still.',
    memoryVerseRef: 'Exodus 14:14',
    art: ['Burning bush craft', 'Shadow art'],
    science: ['Light and shadows', 'Sound and vibration'],
  },
  {
    id: 'w5',
    number: 5,
    theme: 'David & Goliath: Strength, Measurement & Growth',
    bibleRef: '1 Samuel 17',
    bigIdea: 'God makes us brave when we trust Him.',
    memoryVerse: 'The battle is the Lord\u2019s.',
    memoryVerseRef: '1 Samuel 17:47',
    art: ['Five-stone craft', 'Goliath measurement art'],
    science: ['Measurement', 'Plant growth'],
  },
]

// ---- Lessons (seeded for Week 1) --------------------------------------------

const week1Lessons: Lesson[] = [
  // Shared family Bible — assigned to everyone
  {
    id: 'l-bible-w1',
    title: 'Family Bible: God Created Everything',
    subject: 'bible',
    activityType: 'mom-time',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: 'pre-k',
    minutes: 7,
    essential: true,
    owner: 'shared',
    youNeed: ['A Bible', 'Optional: crayons for coloring page'],
    teach: [
      'Read Genesis 1:1\u20135 together.',
      'Point to things in the room and ask "Did God make this, or did people make this?"',
      'Practice the memory verse: Genesis 1:31.',
    ],
    ask: ['What did God create?', 'What is your favorite thing God made?'],
    watchFor: 'Little ones losing focus — keep it to 7 minutes and stay warm.',
    interactive: 'memory-verse',
    printable: true,
  },
  // Alijah (1st)
  {
    id: 'l-alijah-math-w1',
    title: 'Number Bonds to 10',
    subject: 'math',
    activityType: 'mom-time',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: '1st',
    minutes: 8,
    essential: true,
    owner: 'h-venessa',
    youNeed: ['7 counters (or LEGO, beans, buttons)'],
    teach: [
      'Put 7 counters on the table.',
      'Move 3 to one side and 4 to the other.',
      'Say: "7 is made of 3 and 4."',
    ],
    ask: ['What two parts make 7?', 'Can you show me another way to make 7?'],
    watchFor: 'Recounting everything instead of recognizing the parts.',
    interactive: 'math-manipulatives',
    printable: true,
  },
  {
    id: 'l-alijah-lit-w1',
    title: 'Short A: Decodable Reading',
    subject: 'literacy',
    activityType: 'independent',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: '1st',
    minutes: 10,
    essential: true,
    owner: 'h-venessa',
    interactive: 'phonics',
    printable: true,
  },
  {
    id: 'l-alijah-sci-w1',
    title: 'Living vs Nonliving Sort',
    subject: 'science',
    activityType: 'hands-on',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: '1st',
    minutes: 12,
    essential: false,
    owner: 'shared',
    printable: true,
  },
  // Olori-Joy (K)
  {
    id: 'l-olori-lit-w1',
    title: 'Letter Sound /\u0103/ — Multisensory',
    subject: 'literacy',
    activityType: 'mom-time',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: 'k',
    minutes: 6,
    essential: true,
    owner: 'h-venessa',
    youNeed: ['Sand or salt tray (optional)'],
    teach: [
      'Say "/\u0103/ like apple." Have her repeat it 3 times.',
      'Show the letter A and 3 picture cards.',
      'Trace A together in the air.',
    ],
    ask: ['What sound does A make?', 'Can you find something that starts with /\u0103/?'],
    watchFor: 'Confusing letter name "ay" with the sound "/\u0103/".',
    interactive: 'phonics',
    printable: true,
  },
  {
    id: 'l-olori-math-w1',
    title: 'Counting 0\u201310 and +1',
    subject: 'math',
    activityType: 'independent',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: 'k',
    minutes: 8,
    essential: true,
    owner: 'h-venessa',
    interactive: 'math-manipulatives',
    printable: true,
  },
  {
    id: 'l-olori-sci-w1',
    title: 'Five Senses Walk',
    subject: 'science',
    activityType: 'optional',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: 'k',
    minutes: 10,
    essential: false,
    owner: 'shared',
  },
  // Seraiah (Pre-K, Venessa)
  {
    id: 'l-seraiah-math-w1',
    title: 'Count Objects 1\u20135',
    subject: 'math',
    activityType: 'hands-on',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: 'pre-k',
    minutes: 6,
    essential: true,
    owner: 'shared',
    interactive: 'math-manipulatives',
    printable: true,
  },
  {
    id: 'l-seraiah-lit-w1',
    title: 'Letter A Exposure & Trace',
    subject: 'literacy',
    activityType: 'hands-on',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: 'pre-k',
    minutes: 5,
    essential: true,
    owner: 'shared',
    interactive: 'phonics',
    printable: true,
  },
  // Amelia (Pre-K, Damilola) — shares the same Pre-K lessons
  {
    id: 'l-amelia-math-w1',
    title: 'Count Objects 1\u20135',
    subject: 'math',
    activityType: 'hands-on',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: 'pre-k',
    minutes: 6,
    essential: true,
    owner: 'shared',
    interactive: 'math-manipulatives',
    printable: true,
  },
  {
    id: 'l-amelia-lit-w1',
    title: 'Letter A Exposure & Trace',
    subject: 'literacy',
    activityType: 'hands-on',
    weekNumber: 1,
    day: 'tuesday',
    gradeBand: 'pre-k',
    minutes: 5,
    essential: true,
    owner: 'shared',
    interactive: 'phonics',
    printable: true,
  },
  // A shared Pre-K letter lesson used by Seraiah + Amelia (Monday)
  {
    id: 'l-shared-letterA',
    title: 'Letter A Multisensory Practice',
    subject: 'literacy',
    activityType: 'mom-time',
    weekNumber: 1,
    day: 'monday',
    gradeBand: 'pre-k',
    minutes: 6,
    essential: true,
    owner: 'shared',
    interactive: 'phonics',
    printable: true,
  },
]

const week1Assignments: Assignment[] = [
  // Bible — everyone. Some already done.
  { id: 'a1', lessonId: 'l-bible-w1', childId: 'c-alijah', status: 'done', completedAt: '' },
  { id: 'a2', lessonId: 'l-bible-w1', childId: 'c-olori', status: 'done', completedAt: '' },
  { id: 'a3', lessonId: 'l-bible-w1', childId: 'c-seraiah', status: 'done', completedAt: '' },
  { id: 'a4', lessonId: 'l-bible-w1', childId: 'c-amelia', status: 'done', completedAt: '' },
  // Alijah — 2 of 4 done
  { id: 'a5', lessonId: 'l-alijah-math-w1', childId: 'c-alijah', status: 'done', completedAt: '' },
  { id: 'a6', lessonId: 'l-alijah-lit-w1', childId: 'c-alijah', status: 'todo' },
  { id: 'a7', lessonId: 'l-alijah-sci-w1', childId: 'c-alijah', status: 'todo' },
  // Olori-Joy — 1 of 4 done (bible only)
  { id: 'a8', lessonId: 'l-olori-lit-w1', childId: 'c-olori', status: 'todo' },
  { id: 'a9', lessonId: 'l-olori-math-w1', childId: 'c-olori', status: 'todo' },
  { id: 'a10', lessonId: 'l-olori-sci-w1', childId: 'c-olori', status: 'todo' },
  // Seraiah — 3 of 3 (small load) — mark 2 more done
  { id: 'a11', lessonId: 'l-seraiah-math-w1', childId: 'c-seraiah', status: 'done', completedAt: '' },
  { id: 'a12', lessonId: 'l-seraiah-lit-w1', childId: 'c-seraiah', status: 'done', completedAt: '' },
  // Amelia — Damilola's household
  { id: 'a13', lessonId: 'l-amelia-math-w1', childId: 'c-amelia', status: 'done', completedAt: '' },
  { id: 'a14', lessonId: 'l-amelia-lit-w1', childId: 'c-amelia', status: 'todo' },
]

export const skills: Skill[] = [
  // Alijah literacy
  { id: 's1', childId: 'c-alijah', track: 'literacy', name: 'CVC Blending', status: 'mastered' },
  { id: 's2', childId: 'c-alijah', track: 'literacy', name: 'Short A', status: 'mastered' },
  { id: 's3', childId: 'c-alijah', track: 'literacy', name: 'Short E', status: 'practicing' },
  { id: 's4', childId: 'c-alijah', track: 'literacy', name: 'Digraph SH', status: 'learning' },
  { id: 's5', childId: 'c-alijah', track: 'literacy', name: 'Fluency', status: 'practicing' },
  // Alijah math
  { id: 's6', childId: 'c-alijah', track: 'math', name: 'Number Bonds', status: 'practicing' },
  { id: 's7', childId: 'c-alijah', track: 'math', name: 'Addition within 10', status: 'practicing' },
  { id: 's8', childId: 'c-alijah', track: 'math', name: 'Word Problems', status: 'learning' },
  // Olori-Joy literacy
  { id: 's9', childId: 'c-olori', track: 'literacy', name: 'Phonemic Awareness', status: 'practicing' },
  { id: 's10', childId: 'c-olori', track: 'literacy', name: 'Letter Sounds', status: 'learning' },
  { id: 's11', childId: 'c-olori', track: 'literacy', name: 'Oral Blending', status: 'learning' },
  { id: 's12', childId: 'c-olori', track: 'math', name: 'Counting to 10', status: 'practicing' },
  { id: 's13', childId: 'c-olori', track: 'math', name: 'Number Sense', status: 'learning' },
  // Seraiah
  { id: 's14', childId: 'c-seraiah', track: 'literacy', name: 'Letter Exposure', status: 'learning' },
  { id: 's15', childId: 'c-seraiah', track: 'literacy', name: 'Phonological Awareness', status: 'learning' },
  { id: 's16', childId: 'c-seraiah', track: 'math', name: 'Counting 1\u20135', status: 'practicing' },
  { id: 's17', childId: 'c-seraiah', track: 'math', name: 'Shapes', status: 'learning' },
  // Amelia
  { id: 's18', childId: 'c-amelia', track: 'literacy', name: 'Letter Exposure', status: 'practicing' },
  { id: 's19', childId: 'c-amelia', track: 'literacy', name: 'Phonological Awareness', status: 'learning' },
  { id: 's20', childId: 'c-amelia', track: 'math', name: 'Counting 1\u20135', status: 'learning' },
  { id: 's21', childId: 'c-amelia', track: 'math', name: 'Sorting', status: 'learning' },
]

const week1Resources: Resource[] = [
  { id: 'r1', title: 'Short A Word Family Cards', type: 'Flash Cards', subject: 'literacy', skill: 'Short A', gradeBand: '1st', weekNumber: 1, minutes: 10, owner: 'shared', contributor: 'Venessa' },
  { id: 'r2', title: 'Number Bonds to 10 Practice', type: 'Math Practice', subject: 'math', skill: 'Number Bonds', gradeBand: '1st', weekNumber: 1, minutes: 15, owner: 'h-venessa', contributor: 'Venessa' },
  { id: 'r3', title: 'Letter A Tracing Page', type: 'Tracing', subject: 'literacy', skill: 'Handwriting', gradeBand: 'pre-k', weekNumber: 1, minutes: 8, owner: 'shared', contributor: 'Damilola' },
  { id: 'r4', title: 'Creation Days Coloring Book', type: 'Coloring', subject: 'bible', skill: 'Creation', gradeBand: 'pre-k', weekNumber: 1, minutes: 12, owner: 'shared', contributor: 'Venessa' },
  { id: 'r5', title: 'Living vs Nonliving Cut & Paste', type: 'Cut & Paste', subject: 'science', skill: 'Classification', gradeBand: 'k', weekNumber: 1, minutes: 10, owner: 'shared', contributor: 'Damilola' },
  { id: 'r6', title: 'Count & Color 1\u20135', type: 'Worksheet', subject: 'math', skill: 'Counting', gradeBand: 'pre-k', weekNumber: 1, minutes: 8, owner: 'shared', contributor: 'Damilola' },
  { id: 'r7', title: 'Genesis 1 Read-Aloud Mini Book', type: 'Mini Book', subject: 'bible', skill: 'Creation', gradeBand: 'k', weekNumber: 1, minutes: 10, owner: 'shared', contributor: 'Venessa' },
  { id: 'r8', title: 'Short A Decodable Passage', type: 'Reading Passage', subject: 'literacy', skill: 'Decodable Reading', gradeBand: '1st', weekNumber: 1, minutes: 12, owner: 'h-venessa', contributor: 'Venessa' },
]

// ---- Weeks 2\u20135: data-driven curriculum ------------------------------------

interface WeekPlan {
  week: number
  letter: string
  letterSound: string
  bibleTitle: string
  bibleRef: string
  verseRef: string
  bibleTeach: string[]
  bibleAsk: string[]
  bibleWatch: string
  alijah: {
    mathTitle: string
    mathSkill: string
    mathNeed: string[]
    mathTeach: string[]
    mathAsk: string[]
    mathWatch: string
    litTitle: string
    litInteractive: Lesson['interactive']
    sciTitle: string
  }
  olori: {
    litTitle: string
    litNeed: string[]
    litTeach: string[]
    litAsk: string[]
    litWatch: string
    mathTitle: string
    sciTitle: string
  }
  prekMathTitle: string
  prekLitTitle: string
  resources: {
    title: string
    type: ResourceType
    subject: Subject
    skill: string
    gradeBand: GradeBand
    minutes: number
    owner: string
    contributor: string
  }[]
}

const weekPlans: WeekPlan[] = [
  {
    week: 2,
    letter: 'N',
    letterSound: '/n/ like Noah',
    bibleTitle: 'Family Bible: Noah & God\u2019s Rainbow Promise',
    bibleRef: 'Genesis 6\u20139',
    verseRef: 'Genesis 9:13',
    bibleTeach: [
      'Read Genesis 6:9\u201322 and 9:8\u201316 together.',
      'Talk about how Noah obeyed God even when it was hard.',
      'Practice the memory verse: Genesis 9:13 \u2014 the rainbow is God\u2019s promise.',
    ],
    bibleAsk: ['Why did God send the rainbow?', 'How did Noah show he trusted God?'],
    bibleWatch: 'Keep the flood gentle for little ones \u2014 focus on rescue and promise.',
    alijah: {
      mathTitle: 'Counting Animal Pairs (2s)',
      mathSkill: 'Skip Counting by 2',
      mathNeed: ['Pairs of small animal toys or counters'],
      mathTeach: [
        'Line up animals two by two, like they walked into the ark.',
        'Count by 2s: 2, 4, 6, 8\u2026',
        'Ask how many animals in 5 pairs.',
      ],
      mathAsk: ['What comes after 6 when we count by 2s?', 'How many feet do 2 animals have?'],
      mathWatch: 'Slipping back to counting by 1s \u2014 point to each pair.',
      litTitle: 'Short E: Decodable Reading',
      litInteractive: 'phonics',
      sciTitle: 'Sink or Float Investigation',
    },
    olori: {
      litTitle: 'Letter Sound /n/ \u2014 Multisensory',
      litNeed: ['Sand or salt tray (optional)'],
      litTeach: [
        'Say "/n/ like Noah." Repeat it 3 times together.',
        'Show the letter N and 3 picture cards.',
        'Trace N in the air, then on the table.',
      ],
      litAsk: ['What sound does N make?', 'Can you find something that starts with /n/?'],
      litWatch: 'Confusing the letter name with the /n/ sound.',
      mathTitle: 'Counting 0\u201310 with Animal Pairs',
      sciTitle: 'Weather Watch: Clouds & Rain',
    },
    prekMathTitle: 'Count the Animals 1\u20136',
    prekLitTitle: 'Letter N Exposure & Trace',
    resources: [
      { title: 'Noah\u2019s Ark Count by 2s', type: 'Math Practice', subject: 'math', skill: 'Skip Counting', gradeBand: '1st', minutes: 12, owner: 'h-venessa', contributor: 'Venessa' },
      { title: 'Rainbow Color Words Tracing', type: 'Tracing', subject: 'literacy', skill: 'Color Words', gradeBand: 'k', minutes: 8, owner: 'shared', contributor: 'Venessa' },
      { title: 'Letter N Tracing Page', type: 'Tracing', subject: 'literacy', skill: 'Handwriting', gradeBand: 'pre-k', minutes: 8, owner: 'shared', contributor: 'Damilola' },
      { title: 'Sink or Float Recording Sheet', type: 'Science', subject: 'science', skill: 'Prediction', gradeBand: 'k', minutes: 10, owner: 'shared', contributor: 'Damilola' },
      { title: 'Two-by-Two Animal Match', type: 'Cut & Paste', subject: 'math', skill: 'Counting', gradeBand: 'pre-k', minutes: 8, owner: 'shared', contributor: 'Damilola' },
      { title: 'Noah Obeyed God Mini Book', type: 'Mini Book', subject: 'bible', skill: 'Obedience', gradeBand: 'k', minutes: 10, owner: 'shared', contributor: 'Venessa' },
    ],
  },
  {
    week: 3,
    letter: 'J',
    letterSound: '/j/ like Joseph',
    bibleTitle: 'Family Bible: Joseph\u2019s Colorful Coat',
    bibleRef: 'Genesis 37, 39\u201345',
    verseRef: 'Genesis 50:20',
    bibleTeach: [
      'Read the story of Joseph and his brothers (Genesis 37).',
      'Talk about how God was with Joseph even in hard times.',
      'Practice the memory verse: Genesis 50:20.',
    ],
    bibleAsk: ['How did God turn a hard thing into good?', 'When is it hard to be kind to family?'],
    bibleWatch: 'Big story \u2014 keep to the coat, the pit, and the happy ending.',
    alijah: {
      mathTitle: 'Growing Patterns & Skip Counting',
      mathSkill: 'Patterns',
      mathNeed: ['Colored counters or beads'],
      mathTeach: [
        'Make an AB pattern with two colors.',
        'Extend it, then try an ABC pattern.',
        'Ask what comes next and why.',
      ],
      mathAsk: ['What is the pattern rule?', 'Can you make your own ABC pattern?'],
      mathWatch: 'Copying instead of predicting the next item.',
      litTitle: 'Digraph SH: Decodable Reading',
      litInteractive: 'phonics',
      sciTitle: 'Color Mixing Lab',
    },
    olori: {
      litTitle: 'Letter Sound /j/ \u2014 Multisensory',
      litNeed: ['Picture cards for J words'],
      litTeach: [
        'Say "/j/ like Joseph." Repeat it 3 times.',
        'Show the letter J and find J pictures.',
        'Trace J in the air, then on paper.',
      ],
      litAsk: ['What sound does J make?', 'Can you name a J word?'],
      litWatch: 'Mixing up /j/ and /g/ sounds.',
      mathTitle: 'AB & ABC Patterns',
      sciTitle: 'Texture Investigation',
    },
    prekMathTitle: 'Sort by Color',
    prekLitTitle: 'Letter J Exposure & Trace',
    resources: [
      { title: 'Joseph\u2019s Coat Pattern Strips', type: 'Math Practice', subject: 'math', skill: 'Patterns', gradeBand: '1st', minutes: 10, owner: 'shared', contributor: 'Venessa' },
      { title: 'Digraph SH Word Cards', type: 'Flash Cards', subject: 'literacy', skill: 'Digraph SH', gradeBand: '1st', minutes: 10, owner: 'h-venessa', contributor: 'Venessa' },
      { title: 'Color Mixing Recording Sheet', type: 'Science', subject: 'science', skill: 'Color Mixing', gradeBand: 'k', minutes: 10, owner: 'shared', contributor: 'Damilola' },
      { title: 'Letter J Tracing Page', type: 'Tracing', subject: 'literacy', skill: 'Handwriting', gradeBand: 'pre-k', minutes: 8, owner: 'shared', contributor: 'Damilola' },
      { title: 'Color Sorting Mats', type: 'Cut & Paste', subject: 'math', skill: 'Sorting', gradeBand: 'pre-k', minutes: 8, owner: 'shared', contributor: 'Damilola' },
      { title: 'Joseph Forgives Coloring Pages', type: 'Coloring', subject: 'bible', skill: 'Forgiveness', gradeBand: 'pre-k', minutes: 10, owner: 'shared', contributor: 'Venessa' },
    ],
  },
  {
    week: 4,
    letter: 'M',
    letterSound: '/m/ like Moses',
    bibleTitle: 'Family Bible: Moses & the Red Sea',
    bibleRef: 'Exodus 2\u201314',
    verseRef: 'Exodus 14:14',
    bibleTeach: [
      'Read how God led His people out of Egypt (Exodus 14).',
      'Talk about being brave because God is with us.',
      'Practice the memory verse: Exodus 14:14.',
    ],
    bibleAsk: ['How did God make a way through the sea?', 'When do you need to be brave?'],
    bibleWatch: 'Keep the plagues brief \u2014 focus on rescue and courage.',
    alijah: {
      mathTitle: 'Addition Word Problems within 10',
      mathSkill: 'Addition',
      mathNeed: ['Counters', 'Paper for drawing'],
      mathTeach: [
        'Tell a story: 6 people crossed, then 3 more.',
        'Draw and write the number sentence 6 + 3 = 9.',
        'Try one more story problem together.',
      ],
      mathAsk: ['What is the number sentence?', 'How did you know to add?'],
      mathWatch: 'Adding without understanding the story \u2014 draw it first.',
      litTitle: 'Long A: Decodable Reading',
      litInteractive: 'phonics',
      sciTitle: 'Light & Shadows',
    },
    olori: {
      litTitle: 'Letter Sound /m/ \u2014 Multisensory',
      litNeed: ['Sand or salt tray (optional)'],
      litTeach: [
        'Say "/m/ like Moses." Repeat it 3 times.',
        'Show the letter M and find M pictures.',
        'Trace M in the air, then on the table.',
      ],
      litAsk: ['What sound does M make?', 'Can you find something that starts with /m/?'],
      litWatch: 'Reversing M and W \u2014 point to the mountains in M.',
      mathTitle: 'Teen Numbers 11\u201315',
      sciTitle: 'Sound & Vibration',
    },
    prekMathTitle: 'Count Objects 1\u20138',
    prekLitTitle: 'Letter M Exposure & Trace',
    resources: [
      { title: 'Red Sea Addition Stories', type: 'Math Practice', subject: 'math', skill: 'Addition', gradeBand: '1st', minutes: 12, owner: 'h-venessa', contributor: 'Venessa' },
      { title: 'Long A Decodable Passage', type: 'Reading Passage', subject: 'literacy', skill: 'Long A', gradeBand: '1st', minutes: 12, owner: 'h-venessa', contributor: 'Venessa' },
      { title: 'Light & Shadow Recording Sheet', type: 'Science', subject: 'science', skill: 'Light', gradeBand: 'k', minutes: 10, owner: 'shared', contributor: 'Damilola' },
      { title: 'Letter M Tracing Page', type: 'Tracing', subject: 'literacy', skill: 'Handwriting', gradeBand: 'pre-k', minutes: 8, owner: 'shared', contributor: 'Damilola' },
      { title: 'Teen Numbers 11\u201315 Mats', type: 'Worksheet', subject: 'math', skill: 'Teen Numbers', gradeBand: 'k', minutes: 10, owner: 'shared', contributor: 'Venessa' },
      { title: 'Moses Was Brave Mini Book', type: 'Mini Book', subject: 'bible', skill: 'Courage', gradeBand: 'pre-k', minutes: 10, owner: 'shared', contributor: 'Venessa' },
    ],
  },
  {
    week: 5,
    letter: 'D',
    letterSound: '/d/ like David',
    bibleTitle: 'Family Bible: David & Goliath',
    bibleRef: '1 Samuel 17',
    verseRef: '1 Samuel 17:47',
    bibleTeach: [
      'Read how young David trusted God against Goliath (1 Samuel 17).',
      'Talk about how God makes us brave when we trust Him.',
      'Practice the memory verse: 1 Samuel 17:47.',
    ],
    bibleAsk: ['Why wasn\u2019t David afraid?', 'What big thing can you trust God with?'],
    bibleWatch: 'Focus on David\u2019s trust, not the battle.',
    alijah: {
      mathTitle: 'Measuring Length',
      mathSkill: 'Measurement',
      mathNeed: ['Ruler or measuring cubes', 'A few small objects'],
      mathTeach: [
        'Measure 3 objects with cubes, then a ruler.',
        'Record how many units long each one is.',
        'Compare which is longest and shortest.',
      ],
      mathAsk: ['Which object is longest?', 'How many cubes long is it?'],
      mathWatch: 'Leaving gaps between units when measuring.',
      litTitle: 'Digraph TH: Decodable Reading',
      litInteractive: 'phonics',
      sciTitle: 'Plant Growth: Start a Seed',
    },
    olori: {
      litTitle: 'Letter Sound /d/ \u2014 Multisensory',
      litNeed: ['Picture cards for D words'],
      litTeach: [
        'Say "/d/ like David." Repeat it 3 times.',
        'Show the letter D and find D pictures.',
        'Trace D in the air, then on paper.',
      ],
      litAsk: ['What sound does D make?', 'Can you name a D word?'],
      litWatch: 'Reversing b and d \u2014 practice d starts with a line down.',
      mathTitle: 'Compare Big & Small',
      sciTitle: 'Plant Growth: Start a Seed',
    },
    prekMathTitle: 'Measure with Cubes',
    prekLitTitle: 'Letter D Exposure & Trace',
    resources: [
      { title: 'Measure Like David Cards', type: 'Math Practice', subject: 'math', skill: 'Measurement', gradeBand: '1st', minutes: 12, owner: 'shared', contributor: 'Venessa' },
      { title: 'Digraph TH Word Cards', type: 'Flash Cards', subject: 'literacy', skill: 'Digraph TH', gradeBand: '1st', minutes: 10, owner: 'h-venessa', contributor: 'Venessa' },
      { title: 'Plant Growth Journal', type: 'Science', subject: 'science', skill: 'Life Cycles', gradeBand: 'k', minutes: 10, owner: 'shared', contributor: 'Damilola' },
      { title: 'Letter D Tracing Page', type: 'Tracing', subject: 'literacy', skill: 'Handwriting', gradeBand: 'pre-k', minutes: 8, owner: 'shared', contributor: 'Damilola' },
      { title: 'Big & Small Sorting Cards', type: 'Cut & Paste', subject: 'math', skill: 'Comparing', gradeBand: 'pre-k', minutes: 8, owner: 'shared', contributor: 'Damilola' },
      { title: 'David Trusted God Coloring Pages', type: 'Coloring', subject: 'bible', skill: 'Trust', gradeBand: 'pre-k', minutes: 10, owner: 'shared', contributor: 'Venessa' },
    ],
  },
]

function buildWeek(plan: WeekPlan): {
  lessons: Lesson[]
  assignments: Assignment[]
  resources: Resource[]
} {
  const w = plan.week
  const lessons: Lesson[] = [
    {
      id: `l-bible-w${w}`,
      title: plan.bibleTitle,
      subject: 'bible',
      activityType: 'mom-time',
      weekNumber: w,
      day: 'monday',
      gradeBand: 'pre-k',
      minutes: 7,
      essential: true,
      owner: 'shared',
      youNeed: ['A Bible', 'Optional: crayons for coloring page'],
      teach: plan.bibleTeach,
      ask: plan.bibleAsk,
      watchFor: plan.bibleWatch,
      interactive: 'memory-verse',
      printable: true,
    },
    // Alijah (1st)
    {
      id: `l-alijah-math-w${w}`,
      title: plan.alijah.mathTitle,
      subject: 'math',
      activityType: 'mom-time',
      weekNumber: w,
      day: 'tuesday',
      gradeBand: '1st',
      minutes: 10,
      essential: true,
      owner: 'h-venessa',
      youNeed: plan.alijah.mathNeed,
      teach: plan.alijah.mathTeach,
      ask: plan.alijah.mathAsk,
      watchFor: plan.alijah.mathWatch,
      interactive: 'math-manipulatives',
      printable: true,
    },
    {
      id: `l-alijah-lit-w${w}`,
      title: plan.alijah.litTitle,
      subject: 'literacy',
      activityType: 'independent',
      weekNumber: w,
      day: 'tuesday',
      gradeBand: '1st',
      minutes: 10,
      essential: true,
      owner: 'h-venessa',
      interactive: plan.alijah.litInteractive,
      printable: true,
    },
    {
      id: `l-alijah-sci-w${w}`,
      title: plan.alijah.sciTitle,
      subject: 'science',
      activityType: 'hands-on',
      weekNumber: w,
      day: 'thursday',
      gradeBand: '1st',
      minutes: 12,
      essential: false,
      owner: 'shared',
      printable: true,
    },
    // Olori-Joy (K)
    {
      id: `l-olori-lit-w${w}`,
      title: plan.olori.litTitle,
      subject: 'literacy',
      activityType: 'mom-time',
      weekNumber: w,
      day: 'tuesday',
      gradeBand: 'k',
      minutes: 6,
      essential: true,
      owner: 'h-venessa',
      youNeed: plan.olori.litNeed,
      teach: plan.olori.litTeach,
      ask: plan.olori.litAsk,
      watchFor: plan.olori.litWatch,
      interactive: 'phonics',
      printable: true,
    },
    {
      id: `l-olori-math-w${w}`,
      title: plan.olori.mathTitle,
      subject: 'math',
      activityType: 'independent',
      weekNumber: w,
      day: 'tuesday',
      gradeBand: 'k',
      minutes: 8,
      essential: true,
      owner: 'h-venessa',
      interactive: 'math-manipulatives',
      printable: true,
    },
    {
      id: `l-olori-sci-w${w}`,
      title: plan.olori.sciTitle,
      subject: 'science',
      activityType: 'optional',
      weekNumber: w,
      day: 'thursday',
      gradeBand: 'k',
      minutes: 10,
      essential: false,
      owner: 'shared',
    },
    // Seraiah (Pre-K, Venessa)
    {
      id: `l-seraiah-math-w${w}`,
      title: plan.prekMathTitle,
      subject: 'math',
      activityType: 'hands-on',
      weekNumber: w,
      day: 'tuesday',
      gradeBand: 'pre-k',
      minutes: 6,
      essential: true,
      owner: 'shared',
      interactive: 'math-manipulatives',
      printable: true,
    },
    {
      id: `l-seraiah-lit-w${w}`,
      title: plan.prekLitTitle,
      subject: 'literacy',
      activityType: 'hands-on',
      weekNumber: w,
      day: 'monday',
      gradeBand: 'pre-k',
      minutes: 5,
      essential: true,
      owner: 'shared',
      interactive: 'phonics',
      printable: true,
    },
    // Amelia (Pre-K, Damilola)
    {
      id: `l-amelia-math-w${w}`,
      title: plan.prekMathTitle,
      subject: 'math',
      activityType: 'hands-on',
      weekNumber: w,
      day: 'tuesday',
      gradeBand: 'pre-k',
      minutes: 6,
      essential: true,
      owner: 'shared',
      interactive: 'math-manipulatives',
      printable: true,
    },
    {
      id: `l-amelia-lit-w${w}`,
      title: plan.prekLitTitle,
      subject: 'literacy',
      activityType: 'hands-on',
      weekNumber: w,
      day: 'monday',
      gradeBand: 'pre-k',
      minutes: 5,
      essential: true,
      owner: 'shared',
      interactive: 'phonics',
      printable: true,
    },
  ]

  const assign = (lessonId: string, childId: string): Assignment => ({
    id: `a-${lessonId}-${childId}`,
    lessonId,
    childId,
    status: 'todo',
  })

  const assignments: Assignment[] = [
    assign(`l-bible-w${w}`, 'c-alijah'),
    assign(`l-bible-w${w}`, 'c-olori'),
    assign(`l-bible-w${w}`, 'c-seraiah'),
    assign(`l-bible-w${w}`, 'c-amelia'),
    assign(`l-alijah-math-w${w}`, 'c-alijah'),
    assign(`l-alijah-lit-w${w}`, 'c-alijah'),
    assign(`l-alijah-sci-w${w}`, 'c-alijah'),
    assign(`l-olori-lit-w${w}`, 'c-olori'),
    assign(`l-olori-math-w${w}`, 'c-olori'),
    assign(`l-olori-sci-w${w}`, 'c-olori'),
    assign(`l-seraiah-math-w${w}`, 'c-seraiah'),
    assign(`l-seraiah-lit-w${w}`, 'c-seraiah'),
    assign(`l-amelia-math-w${w}`, 'c-amelia'),
    assign(`l-amelia-lit-w${w}`, 'c-amelia'),
  ]

  const resources: Resource[] = plan.resources.map((r, i) => ({
    id: `r-w${w}-${i + 1}`,
    title: r.title,
    type: r.type,
    subject: r.subject,
    skill: r.skill,
    gradeBand: r.gradeBand,
    weekNumber: w,
    minutes: r.minutes,
    owner: r.owner,
    contributor: r.contributor,
  }))

  return { lessons, assignments, resources }
}

const generated = weekPlans.map(buildWeek)

export const lessons: Lesson[] = [
  ...week1Lessons,
  ...generated.flatMap((g) => g.lessons),
]

export const assignments: Assignment[] = [
  ...week1Assignments,
  ...generated.flatMap((g) => g.assignments),
]

export const resources: Resource[] = [
  ...week1Resources,
  ...generated.flatMap((g) => g.resources),
]

export const readAloud: ReadAloudBook[] = [
  { id: 'b1', title: 'The Berenstain Bears and the Spooky Old Tree', status: 'currently-reading', householdId: 'h-venessa' },
  { id: 'b2', title: 'Blueberries for Sal', status: 'favorite', householdId: 'h-venessa' },
  { id: 'b3', title: 'The Big Book of Weather', status: 'library', householdId: 'h-venessa' },
  { id: 'b4', title: 'God Made the World', status: 'finished', householdId: 'h-lola' },
]

export const supplies: SupplyItem[] = [
  { id: 'sp1', label: "Print Monday & Tuesday packets", section: 'print', have: false },
  { id: 'sp2', label: '7 counters (or LEGO / beans)', section: 'household', have: true, substitute: 'LEGO, beans, buttons, or snacks' },
  { id: 'sp3', label: 'Construction paper', section: 'craft', have: true },
  { id: 'sp4', label: 'Glue & crayons', section: 'craft', have: true },
  { id: 'sp5', label: 'Small objects for living/nonliving sort', section: 'science', have: false },
  { id: 'sp6', label: 'Sand or salt tray', section: 'optional', have: false, substitute: 'Shaving cream or a textured tracing card' },
]

export const coverageRequests: CoverageRequest[] = []

export const parentNotes: ParentNote[] = []
