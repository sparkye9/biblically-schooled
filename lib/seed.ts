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
    bigIdea: 'God made everything — and He made me on purpose.',
    memoryVerse: 'God saw all that he had made, and it was very good.',
    memoryVerseRef: 'Genesis 1:31',
    art: ['Creation Day collage', '"God Made Me Special" self portrait'],
    science: ['Living vs Nonliving', 'Five Senses'],
  },
  {
    id: 'w2',
    number: 2,
    theme: "Noah: Weather, Water & God's Promise",
    bibleRef: 'Genesis 6–9',
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
    bibleRef: 'Genesis 37, 39–45',
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
    bibleRef: 'Exodus 2–14',
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
    memoryVerse: 'The battle is the Lord’s.',
    memoryVerseRef: '1 Samuel 17:47',
    art: ['Five-stone craft', 'Goliath measurement art'],
    science: ['Measurement', 'Plant growth'],
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
      math: { title: 'Count Objects 1–5', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter A Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Five Senses Walk', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Counting 0–10 and +1', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Sound /ă/ — Multisensory', minutes: 6, essential: true, printable: true },
      science: { title: 'Living vs Nonliving Sort', minutes: 10, essential: false, printable: true },
    },
    '1st': {
      math: { title: 'Number Bonds to 10', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Short A: Decodable Reading', minutes: 10, essential: true, printable: true },
      science: { title: 'Living vs Nonliving Sort', minutes: 12, essential: false, printable: true },
    },
  },
  2: {
    prek: {
      math: { title: 'Count & Match 1–5 with Water Drops', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter B and the Blue Rainbow', minutes: 5, essential: true, printable: true },
      science: { title: 'Sink or Float', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Counting to 20 and Skip +1', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Short A Word Families: -at, -an', minutes: 7, essential: true, printable: true },
      science: { title: 'Weather Observation', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Addition within 10', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Short E Decodable Reader', minutes: 10, essential: true, printable: true },
      science: { title: 'Water Density: Sink or Float', minutes: 12, essential: false, printable: true },
    },
  },
  3: {
    prek: {
      math: { title: 'Sort & Count by Color', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter C and Colors', minutes: 5, essential: true, printable: true },
      science: { title: 'Color Mixing', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Patterns: AB and AAB', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Short O and Color Words', minutes: 7, essential: true, printable: true },
      science: { title: 'Texture Investigation', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Subtraction within 10', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Short O Word Building', minutes: 10, essential: true, printable: true },
      science: { title: 'Patterns in Nature', minutes: 12, essential: false, printable: true },
    },
  },
  4: {
    prek: {
      math: { title: 'Shapes & Shadow Sizes', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter D and Sound', minutes: 5, essential: true, printable: true },
      science: { title: 'Light and Shadows', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Number Order 1–20', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Sight Words: the, is, my, we', minutes: 7, essential: true, printable: true },
      science: { title: 'Sound and Vibration', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Shadows and Measurement', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Silent E Introduction', minutes: 10, essential: true, printable: true },
      science: { title: 'Light and Shadows Lab', minutes: 12, essential: false, printable: true },
    },
  },
  5: {
    prek: {
      math: { title: 'Count the 5 Stones', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter Review A–D', minutes: 5, essential: true, printable: true },
      science: { title: 'Plant Growth: Seed to Plant', minutes: 10, essential: false, printable: false },
    },
    k: {
      math: { title: 'Counting to 20 and Shapes', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Compare & Sort: Big vs Small', minutes: 7, essential: true, printable: true },
      science: { title: 'Measurement: Big vs Small', minutes: 10, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Measurement: Length', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Sight & CVC Review', minutes: 10, essential: true, printable: true },
      science: { title: 'Measuring Plants', minutes: 12, essential: false, printable: true },
    },
  },
}

const BIBLE_TITLES: Record<number, string> = {
  1: 'Family Bible: God Created Everything',
  2: 'Family Bible: Noah and the Rainbow Promise',
  3: 'Family Bible: Joseph — Good Things from Hard',
  4: 'Family Bible: Moses and Courage',
  5: 'Family Bible: David and Goliath',
}

const BIBLE_MINUTES: Record<number, number> = { 1: 7, 2: 8, 3: 8, 4: 7, 5: 8 }

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

const WORKSHEET_POOL: Array<{
  title: string
  type: Resource['type']
  subject: Resource['subject']
  skill: string
  gradeBand: Resource['gradeBand']
}> = [
  { title: 'Number Bonds to 10 Practice', type: 'Math Practice', subject: 'math', skill: 'Number Bonds', gradeBand: '1st' },
  { title: 'Short A Word Family Cards', type: 'Flash Cards', subject: 'literacy', skill: 'Short A', gradeBand: '1st' },
  { title: 'Letter A Tracing Page', type: 'Tracing', subject: 'literacy', skill: 'Handwriting', gradeBand: 'pre-k' },
  { title: 'Count & Color 1–5', type: 'Worksheet', subject: 'math', skill: 'Counting', gradeBand: 'pre-k' },
  { title: 'Counting to 20 Chart', type: 'Math Practice', subject: 'math', skill: 'Counting', gradeBand: 'k' },
  { title: 'Short A Decodable Passage', type: 'Reading Passage', subject: 'literacy', skill: 'Decodable Reading', gradeBand: '1st' },
  { title: 'Creation Days Coloring Book', type: 'Coloring', subject: 'bible', skill: 'Creation', gradeBand: 'pre-k' },
  { title: 'Genesis 1 Read-Aloud Mini Book', type: 'Mini Book', subject: 'bible', skill: 'Creation', gradeBand: 'k' },
  { title: 'Living vs Nonliving Cut & Paste', type: 'Cut & Paste', subject: 'science', skill: 'Classification', gradeBand: 'k' },
]

const CONTRIBUTORS: Array<Resource['contributor']> = ['Venessa', 'Lola']

function buildResources(): Resource[] {
  const out: Resource[] = []
  let n = 0
  const nextId = () => `r-seed-${++n}`
  for (const week of weeks) {
    WORKSHEET_POOL.forEach((w, index) => {
      out.push({
        id: nextId(),
        title: w.title,
        type: w.type,
        subject: w.subject,
        skill: w.skill,
        gradeBand: w.gradeBand,
        weekNumber: week.number,
        minutes: 10,
        owner: index % 3 === 0 ? 'h-venessa' : 'shared',
        contributor: CONTRIBUTORS[index % CONTRIBUTORS.length],
        saved: index % 2 === 0,
      })
    })
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

const PACKET_WEEKS = [1, 2, 3, 4, 5]

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

export const resources: Resource[] = [...buildResources(), ...buildPacketResources()]

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