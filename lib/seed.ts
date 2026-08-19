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
  {
    id: 'w16',
    number: 16,
    theme: 'Quarter Review: Wise King Solomon',
    bibleRef: '1 Kings 3',
    bigIdea: 'God was pleased and made him the wisest king ever.',
    memoryVerse: 'The fear of the LORD is the beginning of wisdom.',
    memoryVerseRef: 'Proverbs 9:10',
    art: ['Quarter Review: Wise King Solomon craft', 'Quarter Review: Wise King Solomon coloring page'],
    science: ['Science Review & Experiment Day'],
  },
  {
    id: 'w17',
    number: 17,
    theme: 'Elijah on Mount Carmel',
    bibleRef: '1 Kings 18',
    bigIdea: 'God sent fire from heaven, and everyone shouted: The LORD, He is God.',
    memoryVerse: 'The LORD, He is God!',
    memoryVerseRef: '1 Kings 18:39',
    art: ['Elijah on Mount Carmel craft', 'Elijah on Mount Carmel coloring page'],
    science: ['Living Things Up Close'],
  },
  {
    id: 'w18',
    number: 18,
    theme: 'Daniel in the Lions\' Den',
    bibleRef: 'Daniel 6',
    bigIdea: 'Daniel was safe.',
    memoryVerse: 'My God sent His angel and shut the lions\' mouths.',
    memoryVerseRef: 'Daniel 6:22',
    art: ['Daniel in the Lions\' Den craft', 'Daniel in the Lions\' Den coloring page'],
    science: ['Plant Parts'],
  },
  {
    id: 'w19',
    number: 19,
    theme: 'Jonah and the Big Fish',
    bibleRef: 'Jonah 1-3',
    bigIdea: 'Jonah prayed, obeyed, and Nineveh turned back to God.',
    memoryVerse: 'Salvation is of the LORD.',
    memoryVerseRef: 'Jonah 2:9',
    art: ['Jonah and the Big Fish craft', 'Jonah and the Big Fish coloring page'],
    science: ['My Amazing Body'],
  },
  {
    id: 'w20',
    number: 20,
    theme: 'Esther: Brave for Such a Time',
    bibleRef: 'Esther 4',
    bigIdea: 'Esther was brave, spoke up, and God saved her people.',
    memoryVerse: 'For such a time as this.',
    memoryVerseRef: 'Esther 4:14',
    art: ['Esther: Brave for Such a Time craft', 'Esther: Brave for Such a Time coloring page'],
    science: ['Healthy Food, Strong Body'],
  },
  {
    id: 'w21',
    number: 21,
    theme: 'The Birth of Jesus',
    bibleRef: 'Luke 2',
    bigIdea: 'The shepherds ran to see Jesus and praised God.',
    memoryVerse: 'For there is born to you this day a Savior.',
    memoryVerseRef: 'Luke 2:11',
    art: ['The Birth of Jesus craft', 'The Birth of Jesus coloring page'],
    science: ['Earth\'s Layers'],
  },
  {
    id: 'w22',
    number: 22,
    theme: 'Jesus Grows & Is Baptized',
    bibleRef: 'Luke 2-3',
    bigIdea: 'God spoke from heaven: This is My beloved Son.',
    memoryVerse: 'This is My beloved Son.',
    memoryVerseRef: 'Matthew 3:17',
    art: ['Jesus Grows & Is Baptized craft', 'Jesus Grows & Is Baptized coloring page'],
    science: ['Rocks & Minerals'],
  },
  {
    id: 'w23',
    number: 23,
    theme: 'Fishers of Men',
    bibleRef: 'Matthew 4',
    bigIdea: 'They left their nets at once and followed Him.',
    memoryVerse: 'Follow Me, and I will make you fishers of men.',
    memoryVerseRef: 'Matthew 4:19',
    art: ['Fishers of Men craft', 'Fishers of Men coloring page'],
    science: ['Gifts from the Earth (Natural Resources)'],
  },
  {
    id: 'w24',
    number: 24,
    theme: 'Quarter Review: Let Your Light Shine',
    bibleRef: 'Matthew 5',
    bigIdea: 'No one hides a lamp under a basket! When we love and help others, our light points people to God.',
    memoryVerse: 'Let your light so shine before men.',
    memoryVerseRef: 'Matthew 5:16',
    art: ['Quarter Review: Let Your Light Shine craft', 'Quarter Review: Let Your Light Shine coloring page'],
    science: ['Science Review & Experiment Day'],
  },
  {
    id: 'w25',
    number: 25,
    theme: 'Jesus Feeds Five Thousand',
    bibleRef: 'John 6',
    bigIdea: 'Everyone ate until they were full - with twelve baskets left over.',
    memoryVerse: 'I am the bread of life.',
    memoryVerseRef: 'John 6:35',
    art: ['Jesus Feeds Five Thousand craft', 'Jesus Feeds Five Thousand coloring page'],
    science: ['Engineering: Build a Tall Tower'],
  },
  {
    id: 'w26',
    number: 26,
    theme: 'The Good Samaritan',
    bibleRef: 'Luke 10',
    bigIdea: 'Jesus said: go and do the same - love your neighbor.',
    memoryVerse: 'You shall love your neighbor as yourself.',
    memoryVerseRef: 'Luke 10:27',
    art: ['The Good Samaritan craft', 'The Good Samaritan coloring page'],
    science: ['Inventions Old & New'],
  },
  {
    id: 'w27',
    number: 27,
    theme: 'The Lost Sheep & the Loving Father',
    bibleRef: 'Luke 15',
    bigIdea: 'He carried it home on his shoulders, full of joy! God loves each of us like that - He never gives up on us.',
    memoryVerse: 'Rejoice with me, for I have found my sheep!',
    memoryVerseRef: 'Luke 15:6',
    art: ['The Lost Sheep & the Loving Father craft', 'The Lost Sheep & the Loving Father coloring page'],
    science: ['Caring for God\'s World'],
  },
  {
    id: 'w28',
    number: 28,
    theme: 'Jesus Calms the Storm',
    bibleRef: 'Mark 4',
    bigIdea: 'The wind stopped, the water went flat, and all was calm.',
    memoryVerse: 'Peace, be still!',
    memoryVerseRef: 'Mark 4:39',
    art: ['Jesus Calms the Storm craft', 'Jesus Calms the Storm coloring page'],
    science: ['Saving Water & Power'],
  },
  {
    id: 'w29',
    number: 29,
    theme: 'The Cross: God So Loved',
    bibleRef: 'Luke 22-23',
    bigIdea: 'It looked like the saddest day - but God\'s plan was not finished.',
    memoryVerse: 'For God so loved the world that He gave His only begotten Son.',
    memoryVerseRef: 'John 3:16',
    art: ['The Cross: God So Loved craft', 'The Cross: God So Loved coloring page'],
    science: ['Keeping Our World Clean'],
  },
  {
    id: 'w30',
    number: 30,
    theme: 'He Is Risen!',
    bibleRef: 'Luke 24',
    bigIdea: 'The huge stone was rolled away - the tomb was empty! Angels said: He is not here, He is RISEN! Jesus is alive, and that is the best news in the world.',
    memoryVerse: 'He is not here, but is risen!',
    memoryVerseRef: 'Luke 24:6',
    art: ['He Is Risen! craft', 'He Is Risen! coloring page'],
    science: ['Sink or Float? A Real Investigation'],
  },
  {
    id: 'w31',
    number: 31,
    theme: 'The Great Commission: Go and Tell',
    bibleRef: 'Matthew 28',
    bigIdea: 'And remember: I am with you always, to the very end.',
    memoryVerse: 'Go therefore and make disciples of all the nations.',
    memoryVerseRef: 'Matthew 28:19',
    art: ['The Great Commission: Go and Tell craft', 'The Great Commission: Go and Tell coloring page'],
    science: ['Healthy Me: Sleep, Water, Move'],
  },
  {
    id: 'w32',
    number: 32,
    theme: 'Pentecost: The Church Begins',
    bibleRef: 'Acts 2',
    bigIdea: 'Peter preached, and three thousand people believed! The church was born - and it is still growing today.',
    memoryVerse: 'You shall be witnesses to Me.',
    memoryVerseRef: 'Acts 1:8',
    art: ['Pentecost: The Church Begins craft', 'Pentecost: The Church Begins coloring page'],
    science: ['My Science Choice'],
  },
  {
    id: 'w33',
    number: 33,
    theme: 'Growing Good Fruit',
    bibleRef: 'Galatians 5',
    bigIdea: 'This week\'s big project: show what YOU have grown this year.',
    memoryVerse: 'The fruit of the Spirit is love, joy, peace.',
    memoryVerseRef: 'Galatians 5:22',
    art: ['Growing Good Fruit craft', 'Growing Good Fruit coloring page'],
    science: ['Final Project: Observe & Record'],
  },
  {
    id: 'w34',
    number: 34,
    theme: 'God Makes All Things New',
    bibleRef: 'Revelation 21',
    bigIdea: 'Every good story we studied points to this happy ending.',
    memoryVerse: 'Behold, I make all things new.',
    memoryVerseRef: 'Revelation 21:5',
    art: ['God Makes All Things New craft', 'God Makes All Things New coloring page'],
    science: ['Science Favorites: Enrichment Day'],
  },
  {
    id: 'w35',
    number: 35,
    theme: 'Celebration: Give Thanks!',
    bibleRef: 'Psalm 107',
    bigIdea: 'Today we celebrate, present our projects, and praise Him.',
    memoryVerse: 'Give thanks to the LORD, for He is good!',
    memoryVerseRef: 'Psalm 107:1',
    art: ['Celebration: Give Thanks! craft', 'Celebration: Give Thanks! coloring page'],
    science: ['My Year in Science'],
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
  16: {
    prek: {
      math: { title: 'Review: Count 1-10', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter Review A-N', minutes: 5, essential: true, printable: true },
      science: { title: 'Science Review & Experiment Day', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Q2 Review: Frames & Teens', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Letter Review + First Blends', minutes: 7, essential: true, printable: true },
      science: { title: 'Science Review & Experiment Day', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Quarter 2 Math Review', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Q2 Reading Review', minutes: 10, essential: true, printable: true },
      science: { title: 'Science Review & Experiment Day', minutes: 12, essential: false, printable: true },
    },
  },
  17: {
    prek: {
      math: { title: 'One for You, One for Me', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter O Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Living Things Up Close', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Fair Halves or Not?', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Rr + Blend: rat, ram', minutes: 7, essential: true, printable: true },
      science: { title: 'Living Things Up Close', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Halves, Thirds & Fourths', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Long A Teams: ai, ay', minutes: 10, essential: true, printable: true },
      science: { title: 'Living Things Up Close', minutes: 12, essential: false, printable: true },
    },
  },
  18: {
    prek: {
      math: { title: 'Match the Halves', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter P Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Plant Parts', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Two Halves Make a Whole', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Ee + Blend: ten, net', minutes: 7, essential: true, printable: true },
      science: { title: 'Plant Parts', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Add Fractions with Pictures', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Long E Teams: ee, ea', minutes: 10, essential: true, printable: true },
      science: { title: 'Plant Parts', minutes: 12, essential: false, printable: true },
    },
  },
  19: {
    prek: {
      math: { title: 'Color Patterns', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter Q Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'My Amazing Body', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Color Patterns', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Ww + Blend: wet, win', minutes: 7, essential: true, printable: true },
      science: { title: 'My Amazing Body', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'For-Every Patterns', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Long O Teams: oa, ow', minutes: 10, essential: true, printable: true },
      science: { title: 'My Amazing Body', minutes: 12, essential: false, printable: true },
    },
  },
  20: {
    prek: {
      math: { title: 'How Many of 5?', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter R Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Healthy Food, Strong Body', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Out of 10 Frames', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Jj + Blend: jam, jet', minutes: 7, essential: true, printable: true },
      science: { title: 'Healthy Food, Strong Body', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Out of 10', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Long I Teams: igh, y', minutes: 10, essential: true, printable: true },
      science: { title: 'Healthy Food, Strong Body', minutes: 12, essential: false, printable: true },
    },
  },
  21: {
    prek: {
      math: { title: 'What Number Is Missing?', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter S Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Earth\'s Layers', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Missing Part of 5', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Kk + Blend: kit, kid', minutes: 7, essential: true, printable: true },
      science: { title: 'Earth\'s Layers', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Find the Missing Number', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Bossy R: ar', minutes: 10, essential: true, printable: true },
      science: { title: 'Earth\'s Layers', minutes: 12, essential: false, printable: true },
    },
  },
  22: {
    prek: {
      math: { title: 'Find and Color the Box', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter T Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Rocks & Minerals', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Find the Box', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Uu + Blend: up, cup', minutes: 7, essential: true, printable: true },
      science: { title: 'Rocks & Minerals', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Grid Treasure Map', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Bossy R: or', minutes: 10, essential: true, printable: true },
      science: { title: 'Rocks & Minerals', minutes: 12, essential: false, printable: true },
    },
  },
  23: {
    prek: {
      math: { title: 'Count & Color Graph', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter U Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Gifts from the Earth (Natural Resources)', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Count & Color Graph', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Vv + Blend: van, vet', minutes: 7, essential: true, printable: true },
      science: { title: 'Gifts from the Earth (Natural Resources)', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Count & Graph', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Bossy R: er, ir, ur', minutes: 10, essential: true, printable: true },
      science: { title: 'Gifts from the Earth (Natural Resources)', minutes: 12, essential: false, printable: true },
    },
  },
  24: {
    prek: {
      math: { title: 'Review: Count & Letters', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter Review O-U', minutes: 5, essential: true, printable: true },
      science: { title: 'Science Review & Experiment Day', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Q3 Review: Blend & Count', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Review + Blend Check', minutes: 7, essential: true, printable: true },
      science: { title: 'Science Review & Experiment Day', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Quarter 3 Math Review', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Q3 Reading Review', minutes: 10, essential: true, printable: true },
      science: { title: 'Science Review & Experiment Day', minutes: 12, essential: false, printable: true },
    },
  },
  25: {
    prek: {
      math: { title: 'Sheep Stories: One More', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter V Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Engineering: Build a Tall Tower', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Ten-Frame Story Problems', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Yy + Blend: yes, yam', minutes: 7, essential: true, printable: true },
      science: { title: 'Engineering: Build a Tall Tower', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Two-Step Bar Models', minutes: 8, essential: true, printable: true },
      literacy: { title: 'oo Two Ways: moon & book', minutes: 10, essential: true, printable: true },
      science: { title: 'Engineering: Build a Tall Tower', minutes: 12, essential: false, printable: true },
    },
  },
  26: {
    prek: {
      math: { title: 'Trace Shapes Review', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter W Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Inventions Old & New', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Shapes & Measure Review', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Zz + Blend: zip, zag', minutes: 7, essential: true, printable: true },
      science: { title: 'Inventions Old & New', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Shapes & Measure Review', minutes: 8, essential: true, printable: true },
      literacy: { title: 'ou & ow: the OW Sound', minutes: 10, essential: true, printable: true },
      science: { title: 'Inventions Old & New', minutes: 12, essential: false, printable: true },
    },
  },
  27: {
    prek: {
      math: { title: 'Count to 10 Review', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter X Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Caring for God\'s World', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Count & Add Review', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Qq + Blend: quit, quiz', minutes: 7, essential: true, printable: true },
      science: { title: 'Caring for God\'s World', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Big Arithmetic Review', minutes: 8, essential: true, printable: true },
      literacy: { title: 'oi & oy: the OY Sound', minutes: 10, essential: true, printable: true },
      science: { title: 'Caring for God\'s World', minutes: 12, essential: false, printable: true },
    },
  },
  28: {
    prek: {
      math: { title: 'Count the Sticks', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter Y Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Saving Water & Power', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Tally Marks', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Xx + Blend: box, fox', minutes: 7, essential: true, printable: true },
      science: { title: 'Saving Water & Power', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Tally Marks & Chance', minutes: 8, essential: true, printable: true },
      literacy: { title: 'au & aw: the AW Sound', minutes: 10, essential: true, printable: true },
      science: { title: 'Saving Water & Power', minutes: 12, essential: false, printable: true },
    },
  },
  29: {
    prek: {
      math: { title: 'Penny Counting', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter Z Exposure & Trace', minutes: 5, essential: true, printable: true },
      science: { title: 'Keeping Our World Clean', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Penny Store', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Review: y, z, q, x + Vowels', minutes: 7, essential: true, printable: true },
      science: { title: 'Keeping Our World Clean', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Store Math', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Compound Words', minutes: 10, essential: true, printable: true },
      science: { title: 'Keeping Our World Clean', minutes: 12, essential: false, printable: true },
    },
  },
  30: {
    prek: {
      math: { title: 'Three Happy Jars', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Alphabet Celebration A-Z', minutes: 5, essential: true, printable: true },
      science: { title: 'Sink or Float? A Real Investigation', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Save, Spend, Give Jars', minutes: 8, essential: true, printable: true },
      literacy: { title: 'CVC Words: Read & Build', minutes: 7, essential: true, printable: true },
      science: { title: 'Sink or Float? A Real Investigation', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Save, Spend, Give', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Fluency & Book Share', minutes: 10, essential: true, printable: true },
      science: { title: 'Sink or Float? A Real Investigation', minutes: 12, essential: false, printable: true },
    },
  },
  31: {
    prek: {
      math: { title: 'Set the Table: One Each', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter Review A-G', minutes: 5, essential: true, printable: true },
      science: { title: 'Healthy Me: Sleep, Water, Move', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Picnic Helper: Count It Out', minutes: 8, essential: true, printable: true },
      literacy: { title: 'CVC Family: -at, -ag', minutes: 7, essential: true, printable: true },
      science: { title: 'Healthy Me: Sleep, Water, Move', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Applied Project: Plan a Picnic', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Ending -ing', minutes: 10, essential: true, printable: true },
      science: { title: 'Healthy Me: Sleep, Water, Move', minutes: 12, essential: false, printable: true },
    },
  },
  32: {
    prek: {
      math: { title: 'Count 1-10 Review', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter Review H-N', minutes: 5, essential: true, printable: true },
      science: { title: 'My Science Choice', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Big Year Review', minutes: 8, essential: true, printable: true },
      literacy: { title: 'CVC Family: -it, -ig', minutes: 7, essential: true, printable: true },
      science: { title: 'My Science Choice', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Big Year Review 1', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Ending -ed', minutes: 10, essential: true, printable: true },
      science: { title: 'My Science Choice', minutes: 12, essential: false, printable: true },
    },
  },
  33: {
    prek: {
      math: { title: 'Project: Count & Color Graph', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter Review O-U', minutes: 5, essential: true, printable: true },
      science: { title: 'Final Project: Observe & Record', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Project: Count & Graph', minutes: 8, essential: true, printable: true },
      literacy: { title: 'CVC Family: -og, -op', minutes: 7, essential: true, printable: true },
      science: { title: 'Final Project: Observe & Record', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Project Math: Measure & Graph', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Syllables: Clap It Out', minutes: 10, essential: true, printable: true },
      science: { title: 'Final Project: Observe & Record', minutes: 12, essential: false, printable: true },
    },
  },
  34: {
    prek: {
      math: { title: 'Show What You Know', minutes: 6, essential: true, printable: true },
      literacy: { title: 'Letter Review V-Z', minutes: 5, essential: true, printable: true },
      science: { title: 'Science Favorites: Enrichment Day', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Show What You Know', minutes: 8, essential: true, printable: true },
      literacy: { title: 'CVC Family: -ug, -ed', minutes: 7, essential: true, printable: true },
      science: { title: 'Science Favorites: Enrichment Day', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Final Assessment', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Reading Assessment & Tiny Story', minutes: 10, essential: true, printable: true },
      science: { title: 'Science Favorites: Enrichment Day', minutes: 12, essential: false, printable: true },
    },
  },
  35: {
    prek: {
      math: { title: 'Numbers & Stars Party', minutes: 6, essential: true, printable: true },
      literacy: { title: 'I Know My ABCs!', minutes: 5, essential: true, printable: true },
      science: { title: 'My Year in Science', minutes: 12, essential: false, printable: false },
    },
    k: {
      math: { title: 'Numbers I Know: 1-20', minutes: 8, essential: true, printable: true },
      literacy: { title: 'I Can Read! Celebration', minutes: 7, essential: true, printable: true },
      science: { title: 'My Year in Science', minutes: 12, essential: false, printable: false },
    },
    '1st': {
      math: { title: 'Celebration Math', minutes: 8, essential: true, printable: true },
      literacy: { title: 'Celebration Words & My Letter', minutes: 10, essential: true, printable: true },
      science: { title: 'My Year in Science', minutes: 12, essential: false, printable: true },
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
  16: 'Family Bible: Quarter Review: Wise King Solomon',
  17: 'Family Bible: Elijah on Mount Carmel',
  18: 'Family Bible: Daniel in the Lions\' Den',
  19: 'Family Bible: Jonah and the Big Fish',
  20: 'Family Bible: Esther: Brave for Such a Time',
  21: 'Family Bible: The Birth of Jesus',
  22: 'Family Bible: Jesus Grows & Is Baptized',
  23: 'Family Bible: Fishers of Men',
  24: 'Family Bible: Quarter Review: Let Your Light Shine',
  25: 'Family Bible: Jesus Feeds Five Thousand',
  26: 'Family Bible: The Good Samaritan',
  27: 'Family Bible: The Lost Sheep & the Loving Father',
  28: 'Family Bible: Jesus Calms the Storm',
  29: 'Family Bible: The Cross: God So Loved',
  30: 'Family Bible: He Is Risen!',
  31: 'Family Bible: The Great Commission: Go and Tell',
  32: 'Family Bible: Pentecost: The Church Begins',
  33: 'Family Bible: Growing Good Fruit',
  34: 'Family Bible: God Makes All Things New',
  35: 'Family Bible: Celebration: Give Thanks!',
}

const BIBLE_MINUTES: Record<number, number> = { 1: 7, 2: 7, 3: 7, 4: 7, 5: 7, 6: 7, 7: 7, 8: 7, 9: 7, 10: 7, 11: 7, 12: 7, 13: 7, 14: 7, 15: 7, 16: 7, 17: 7, 18: 7, 19: 7, 20: 7, 21: 7, 22: 7, 23: 7, 24: 7, 25: 7, 26: 7, 27: 7, 28: 7, 29: 7, 30: 7, 31: 7, 32: 7, 33: 7, 34: 7, 35: 7 }

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

const PACKET_WEEKS = Array.from({ length: 35 }, (_, i) => i + 1)

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