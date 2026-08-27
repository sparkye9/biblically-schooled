import type { Lesson } from './types'

/**
 * Comprehensive curriculum for 36-week homeschool year
 * Monday/Thursday: Core + Art
 * Tuesday/Friday: Core + Science + Library Mission
 * Wednesday: Co-op (no regular coursework)
 *
 * Structure:
 * - Learning Objective: Single, measurable skill
 * - Biblical Connection: How this connects to faith
 * - Materials: What teacher/child needs
 * - Mom Time: 5-10 min teaching script + steps
 * - Guided Practice: Teacher demonstrates, child observes/participates
 * - Independent Activity: Child does mostly alone (worksheet or hands-on)
 * - Answer Key: Expected responses or solutions
 * - If Struggling: Support strategy
 * - If Advanced: Challenge extension
 */

// ==================== WEEK 1: God Created Me & My World ====================

const week1Lessons: Lesson[] = [
  // Monday Pre-K: Literacy
  {
    id: 'l-w1-mon-pre-k-lit',
    title: 'I Am Special (Letter M & I)',
    subject: 'literacy',
    activityType: 'mom-time',
    weekNumber: 1,
    day: 'monday',
    gradeBand: 'pre-k',
    minutes: 8,
    essential: true,
    owner: 'shared',
    learningObjective: 'Recognize and name letters M and I; connect to self-identity',
    biblicalConnection: 'God made me and I am special to Him (Genesis 1:27)',
    materials: ['Picture cards of body parts', 'Large M and I letter cards', 'Crayons', 'Worksheet'],
    momTime: {
      duration: 8,
      script: `Today we're learning about YOU and how special you are. God made you, and that makes you special! We're learning two letters: M for Me and I for I. Let's say them together. M is for ME! I is for I! Let's look at our body parts - eyes, nose, mouth. Can you point to YOUR eyes? Now trace this big letter M with your finger. Good! The letter M looks like two mountains, and YOU are wonderful like a mountain!`,
      steps: [
        'Introduce self-identity: "God made you special"',
        'Show M and I letter cards, say sounds together',
        'Point to body parts on own body',
        'Trace large M and I letters with finger',
        'Color self-portrait together',
      ],
    },
    guidedPractice: {
      description: 'Teacher shows body part pictures, child names them and traces',
      example: 'Teacher points to eye picture. Child says "eye" and traces E in the picture',
    },
    independentActivity: {
      description: 'Complete worksheet with body part matching and letter tracing',
      isHandsOn: false,
    },
    requiredWorksheet: {
      title: 'I Am Special (Tracing & Matching)',
      fileUrl: '/worksheets/week-01/pre-k/Monday_Literacy_Introduce.pdf',
    },
    challengeWorksheet: {
      title: '⭐ Challenge Me! Letter Hunt',
      fileUrl: '/worksheets/week-01/pre-k/Challenge_Letter_Hunt.pdf',
      description: 'Find multiple M and I letters in pictures, sort by shape',
    },
    answerKey: 'Matching: eye-eye, hand-hand, ear-ear. Traced M and I shown on worksheet.',
    ifStruggling: 'Focus on just M. Trace together multiple times. Skip I for now.',
    ifAdvanced: 'Find M and I in words around house (Mom, I, It, me)',
  },

  // Monday Pre-K: Math
  {
    id: 'l-w1-mon-pre-k-math',
    title: 'Counting to 3 with Manipulatives',
    subject: 'math',
    activityType: 'hands-on',
    weekNumber: 1,
    day: 'monday',
    gradeBand: 'pre-k',
    minutes: 10,
    essential: true,
    owner: 'shared',
    learningObjective: 'Count 1-3 objects with one-to-one correspondence; recognize quantities',
    biblicalConnection: 'God created the sun, moon, and stars (3 parts of day/night)',
    materials: ['Small objects (blocks, buttons, etc.)', 'Number cards 1-3', 'Worksheet', 'Manipulatives'],
    momTime: {
      duration: 10,
      script: `We're learning to COUNT! One, two, three. Let me give you some blocks. Here's ONE block. You hold it. Now here's TWO blocks. Count with me: one, two. Great! Now THREE blocks. One, two, THREE! You're counting! Let's count your blocks again. Point to each one as we count: one... two... three. Perfect!`,
      steps: [
        'Introduce counting 1-3 with enthusiasm',
        'Give child 1 block, say "one", child repeats',
        'Give child 2 blocks, count together pointing to each',
        'Give child 3 blocks, count together',
        'Have child count independently with support',
      ],
    },
    guidedPractice: {
      description: 'Adult counts while child points to each object. "You point, I count"',
      example: 'Adult puts 2 buttons down. Child points to each, adult says "one, two"',
    },
    independentActivity: {
      description: 'Child circles groups of 1, 2, 3 on worksheet; counts aloud',
      isHandsOn: true,
    },
    requiredWorksheet: {
      title: 'Number Sense: Count to 3',
      fileUrl: '/worksheets/week-01/pre-k/Math_Count_to_3.pdf',
    },
    challengeWorksheet: {
      title: '⭐ Challenge Me! Counting Beyond',
      fileUrl: '/worksheets/week-01/pre-k/Challenge_Count_Beyond.pdf',
      description: 'Count to 5; compare more/fewer groups',
    },
    answerKey: 'Child circles correct quantities; counts aloud to verify',
    ifStruggling: 'Focus on 1 and 2 only. Use very concrete objects. Multiple practice days.',
    ifAdvanced: 'Count to 5 with same materials',
  },

  // Monday Kindergarten: Literacy
  {
    id: 'l-w1-mon-k-lit',
    title: 'Alphabet Sounds: /A/ and /I/',
    subject: 'literacy',
    activityType: 'mom-time',
    weekNumber: 1,
    day: 'monday',
    gradeBand: 'k',
    minutes: 10,
    essential: true,
    owner: 'shared',
    learningObjective: 'Recognize and produce /a/ and /i/ sounds; match to letter forms A and I',
    biblicalConnection: 'God gave us words to speak and letters to write (Genesis 11:1-9 on language)',
    materials: ['Letter cards A and I', 'Picture cards (apple, ant, ice, igloo)', 'Letter formation guide'],
    momTime: {
      duration: 10,
      script: `Listen carefully. This is the /A/ sound. Say it with me: /A/ /A/ /A/. Can you hear it? Now listen to /I/: /I/ /I/ /I/. Great! Look at this letter—it's A. It makes the /A/ sound. And this is I. It makes the /I/ sound. Let me show you some pictures. APPLE starts with /A/. What sound does it start with? /A/! ICE starts with /I/. /I/! You're learning sounds!`,
      steps: [
        'Model /a/ sound with exaggerated mouth, have child repeat',
        'Model /i/ sound, have child repeat',
        'Show letter A, say sound together',
        'Show letter I, say sound together',
        'Show picture cards, child identifies beginning sound',
      ],
    },
    guidedPractice: {
      description: 'Adult shows picture, makes sound. Child repeats sound and tries to name picture.',
      example: 'Adult shows apple picture, says "/A/". Child repeats "/A/" and says "apple"',
    },
    independentActivity: {
      description: 'Child completes worksheet matching pictures to sounds',
      isHandsOn: false,
    },
    requiredWorksheet: {
      title: 'Introduce: Alphabet Sounds /A/ and /I/',
      fileUrl: '/worksheets/week-01/k/Monday_Literacy_Phonics.pdf',
    },
    challengeWorksheet: {
      title: '⭐ Challenge Me! Decode CVC Word',
      fileUrl: '/worksheets/week-01/k/Challenge_Decode_CVC.pdf',
      description: 'Use known sounds to read unfamiliar CVC word',
    },
    answerKey: 'Circled pictures: apple, ant, ice, igloo (or similar /a/ and /i/ words)',
    ifStruggling: 'Focus on just /A/ for 2-3 days. Use real objects (apple). Add /I/ later.',
    ifAdvanced: 'Find /A/ and /I/ words around house',
  },

  // Monday Kindergarten: Math
  {
    id: 'l-w1-mon-k-math',
    title: 'Number Bonds & Decomposition (1-5)',
    subject: 'math',
    activityType: 'hands-on',
    weekNumber: 1,
    day: 'monday',
    gradeBand: 'k',
    minutes: 12,
    essential: true,
    owner: 'shared',
    learningObjective: 'Show different ways to make 3, 4, and 5 using manipulatives and pictures',
    biblicalConnection: 'God made creation with different parts that work together (Psalm 19:1)',
    materials: ['Counters or blocks', 'Ten-frames or circles on paper', 'Pictures showing decomposition'],
    momTime: {
      duration: 12,
      script: `Today we're finding DIFFERENT ways to make numbers. Watch: I have 5 blocks. I can make 5 this way: 3 blocks here, 2 blocks here. Three and two make five! Let me try again. This time: 4 blocks here, 1 block here. Four and one make five! Same number, different ways. Can YOU make five? Here are your 5 blocks. Try making it with different groups.`,
      steps: [
        'Show 5 blocks, separate into 3 + 2, say "three and two make five"',
        'Show same 5 blocks, separate into 4 + 1, say "four and one make five"',
        'Try with 4 blocks: 2 + 2, then 3 + 1',
        'Give child blocks to explore different combinations',
        'Record with pictures what they made',
      ],
    },
    guidedPractice: {
      description: 'Adult arranges blocks, child says the combination. Then child arranges, adult repeats.',
      example: 'Adult puts 2 blocks + 3 blocks. Child says "two and three make five"',
    },
    independentActivity: {
      description: 'Child uses blocks to show different ways to make 4 and 5; draws or records solutions',
      isHandsOn: true,
    },
    requiredWorksheet: {
      title: 'Number Bonds: Ways to Make Numbers',
      fileUrl: '/worksheets/week-01/k/Math_Number_Bonds.pdf',
    },
    answerKey: 'For 5: 1+4, 2+3, 3+2, 4+1. For 4: 1+3, 2+2, 3+1',
    ifStruggling: 'Focus on 3 only: 1+2 and 2+1. Use concrete blocks, not pictures.',
    ifAdvanced: 'Show 6 and 7; find all combinations',
  },

  // Monday 1st Grade: Literacy
  {
    id: 'l-w1-mon-1st-lit',
    title: 'Consonant Digraph: /TH/ Sound',
    subject: 'literacy',
    activityType: 'mom-time',
    weekNumber: 1,
    day: 'monday',
    gradeBand: '1st',
    minutes: 10,
    essential: true,
    owner: 'shared',
    learningObjective: 'Identify and produce /th/ sound; recognize TH digraph in words',
    biblicalConnection: 'Words have power—we use our mouths to speak truth (Proverbs 31:26)',
    materials: ['Word list with /th/ words', 'Picture cards', 'Letter cards T and H'],
    momTime: {
      duration: 10,
      script: `Today we're learning a NEW sound: /TH/. It's made by TWO letters together: T and H. Listen: /TH/. Say it with me: /TH/. Feel your tongue between your teeth. /TH/. Here are some words that have this sound: THE, THAT, THIS, THINK, THREE, THANK YOU. Listen for the /TH/ sound. Say these with me: THE... THAT... THIS... THINK. You've got it!`,
      steps: [
        'Model /th/ sound, show tongue between teeth',
        'Have child repeat /th/ sound multiple times',
        'Say word list together: the, that, this, think, three',
        'Have child identify /th/ words in sentence: "I think the dog is there"',
        'Write TH letters, explain two letters make one sound (digraph)',
      ],
    },
    guidedPractice: {
      description: 'Adult says /th/ word, child repeats. Then child finds words in text.',
      example: 'Adult: "I say THINK. What sound is at the beginning?" Child: "/TH/"',
    },
    independentActivity: {
      description: 'Child decodes /th/ words; circles them in sentences',
      isHandsOn: false,
    },
    requiredWorksheet: {
      title: 'Introduce: Digraph /TH/ Sound',
      fileUrl: '/worksheets/week-01/1st/Monday_Literacy_Digraph.pdf',
    },
    challengeWorksheet: {
      title: '⭐ Challenge Me! Digraph Application',
      fileUrl: '/worksheets/week-01/1st/Challenge_Digraph_Sentences.pdf',
      description: 'Write sentences using /th/ words; read unfamiliar passage',
    },
    answerKey: 'Words circled: the, that, this, think, three, thank. Sentences follow phonics rule.',
    ifStruggling: 'Use only 3-4 /th/ words. Practice sound in isolation daily.',
    ifAdvanced: 'Distinguish voiced /th/ (this, that) from unvoiced /th/ (think, thank)',
  },

  // Monday 1st Grade: Math
  {
    id: 'l-w1-mon-1st-math',
    title: 'Addition Strategies: Make 10',
    subject: 'math',
    activityType: 'hands-on',
    weekNumber: 1,
    day: 'monday',
    gradeBand: '1st',
    minutes: 12,
    essential: true,
    owner: 'shared',
    learningObjective: 'Use "make 10" strategy to solve addition facts efficiently',
    biblicalConnection: 'Jesus taught us to think wisely and find good solutions (Proverbs 3:21)',
    materials: ['Ten-frames', 'Counters', 'Number cards', 'Worksheet'],
    momTime: {
      duration: 12,
      script: `Today we're learning a SMART way to add. It's called MAKE TEN. Watch: I have 8 + 4. That's a lot to count. But here's the trick: 8 is almost 10! I just need 2 more to make 10. Look at my 4—I can take 2 of those and give it to 8 to MAKE 10. Now I have 10 plus 2 left over. 10 and 2 make 12! So 8 + 4 = 12. Let's try another: 9 + 3. Make 10 first!`,
      steps: [
        'Show 8 on ten-frame (8 full, 2 empty)',
        'Show the 4 counters separately',
        'Identify: 8 needs 2 more to make 10',
        'Move 2 of the 4 counters to complete the ten-frame',
        'Count: 10 (full frame) + 2 (left over) = 12',
        'Practice with 9 + 3, 8 + 5, 7 + 4',
      ],
    },
    guidedPractice: {
      description: 'Adult shows problem on ten-frame. Child identifies how many more to make 10, then solves.',
      example: 'Adult: "I have 7. What do I add to make 10?" Child: "3." Adult: "Right! 7 + 3 = 10."',
    },
    independentActivity: {
      description: 'Child solves make-10 problems using ten-frames',
      isHandsOn: true,
    },
    requiredWorksheet: {
      title: 'Introduction: Make 10 Strategy',
      fileUrl: '/worksheets/week-01/1st/Math_Make_10_Intro.pdf',
    },
    challengeWorksheet: {
      title: '⭐ Challenge Me! Multi-Step Problems',
      fileUrl: '/worksheets/week-01/1st/Challenge_Multi_Step_Math.pdf',
      description: 'Solve 2-3 step word problems using make-10 strategy',
    },
    answerKey: '8+4=12, 9+3=12, 7+5=12, 9+4=13, 8+5=13',
    ifStruggling: 'Use only 10-frame method. Practice 9 + 1, 8 + 2 repeatedly first.',
    ifAdvanced: 'Apply make-10 strategy to two-digit addition (23 + 8)',
  },
]

// ==================== WEEK 2: God Made Me & My Family ====================

const week2Lessons: Lesson[] = [
  // Pre-K Family theme
  {
    id: 'l-w2-mon-pre-k-lit',
    title: 'Family Members (Naming & Matching)',
    subject: 'literacy',
    activityType: 'mom-time',
    weekNumber: 2,
    day: 'monday',
    gradeBand: 'pre-k',
    minutes: 8,
    essential: true,
    owner: 'shared',
    learningObjective: 'Name family members; recognize family unit; letter M',
    biblicalConnection: 'God made families on purpose. Family is a gift (Genesis 2:22-24)',
    materials: ['Family picture cards', 'Letter M card', 'Worksheet'],
    momTime: {
      duration: 8,
      script: `God made YOUR family on purpose! Look at these pictures. This is a mommy. This is a daddy. This is a sister. This is a brother. Which one is in YOUR family? Let me tell you about your family. You have a mom and a dad. That's your family! The letter M is for MOM and MOMMY. Let's say it: M is for MOM.`,
      steps: [
        'Introduce family concept',
        'Show family pictures, name each role',
        'Discuss child's own family',
        'Connect to M for Mom',
        'Practice tracing M',
      ],
    },
    guidedPractice: {
      description: 'Show pictures, child names family members',
      example: 'Adult shows mom picture. Child says "mommy"',
    },
    independentActivity: {
      description: 'Match family pictures; color family portrait',
      isHandsOn: false,
    },
    requiredWorksheet: {
      title: 'Introduce: Family Members',
      fileUrl: '/worksheets/week-02/pre-k/Monday_Literacy_Family.pdf',
    },
    challengeWorksheet: {
      title: '⭐ Challenge Me! Family Patterns',
      fileUrl: '/worksheets/week-02/pre-k/Challenge_Family_Patterns.pdf',
    },
    answerKey: 'Matched family pictures; colored family portrait showing all members',
    ifStruggling: 'Focus on 2 family roles only (mom, child)',
    ifAdvanced: 'Extend family: grandparents, aunts, uncles',
  },

  {
    id: 'l-w2-mon-pre-k-math',
    title: 'Count My Family (Grouping & Sorting)',
    subject: 'math',
    activityType: 'hands-on',
    weekNumber: 2,
    day: 'monday',
    gradeBand: 'pre-k',
    minutes: 10,
    essential: true,
    owner: 'shared',
    learningObjective: 'Count family members; understand groups; sort by attributes',
    biblicalConnection: 'God created us in His image and gave us families to belong to',
    materials: ['Family picture cards', 'Counters', 'Sorting circles'],
    momTime: {
      duration: 10,
      script: `Let's count YOUR family! How many people live with you? Let me count: one, two, three... That's your family group! Let's count mine: one, two, three, four. I have four. Look at these family cards. Girls are here (point), boys are here (point). We can sort them! This is grouping.`,
      steps: [
        'Count child's family members together',
        'Use counters to represent family',
        'Sort by: mom, dad, siblings, etc.',
        'Count each group',
        'Compare groups (more/fewer)',
      ],
    },
    guidedPractice: {
      description: 'Adult sorts one card, child sorts the next',
      example: 'Adult puts mom card in circle. Child puts sister card in circle.',
    },
    independentActivity: {
      description: 'Child sorts family cards by different attributes',
      isHandsOn: true,
    },
    requiredWorksheet: {
      title: 'Count & Sort My Family',
      fileUrl: '/worksheets/week-02/pre-k/Math_Count_Families.pdf',
    },
    answerKey: 'Counting and grouping shown in worksheet; child's own family configuration',
    ifStruggling: 'Just count total family. Skip sorting for now.',
    ifAdvanced: 'Sort by multiple attributes (mom/dad, older/younger)',
  },

  // Kindergarten Week 2
  {
    id: 'l-w2-mon-k-lit',
    title: '/F/ and /M/ Beginning Sounds (Family theme)',
    subject: 'literacy',
    activityType: 'mom-time',
    weekNumber: 2,
    day: 'monday',
    gradeBand: 'k',
    minutes: 10,
    essential: true,
    owner: 'shared',
    learningObjective: 'Recognize /f/ and /m/ sounds; connect to family words',
    biblicalConnection: 'Our mouths speak love to our family (Proverbs 31:26)',
    materials: ['Letter cards F and M', 'Picture cards (family, father, mother, fish)'],
    momTime: {
      duration: 10,
      script: `We learned M for MOM last week! Remember? /M/. Today we add /F/. Listen: /F/. That's the /F/ sound for FAMILY and FATHER! Say it: /F/ /F/. Here are words: FAMILY starts with /F/. What sound? /F/! MOTHER starts with /M/! FATHER starts with /F/!`,
      steps: [
        'Review M for Mom',
        'Introduce /f/ sound',
        'Practice /f/ and /m/ together',
        'Match sounds to family words',
        'Trace F and M letters',
      ],
    },
    guidedPractice: {
      description: 'Adult says family word, child identifies sound',
      example: 'Adult: "MOMMY." Child: "/M/"',
    },
    independentActivity: {
      description: 'Match family words to sounds on worksheet',
      isHandsOn: false,
    },
    requiredWorksheet: {
      title: 'Introduce: /F/ & /M/ Sounds',
      fileUrl: '/worksheets/week-02/k/Monday_Literacy_FM_Sounds.pdf',
    },
    challengeWorksheet: {
      title: '⭐ Challenge Me! Create Own Word',
      fileUrl: '/worksheets/week-02/k/Challenge_Create_Word.pdf',
    },
    answerKey: 'Matched family, father, mother, fish to /f/ and /m/ sounds',
    ifStruggling: 'Focus only on /M/ sound this week',
    ifAdvanced: 'Find /f/ and /m/ words in read-aloud books',
  },

  {
    id: 'l-w2-mon-k-math',
    title: 'Comparing Quantities: More & Less',
    subject: 'math',
    activityType: 'hands-on',
    weekNumber: 2,
    day: 'monday',
    gradeBand: 'k',
    minutes: 12,
    essential: true,
    owner: 'shared',
    learningObjective: 'Compare two groups; identify more, less, equal',
    biblicalConnection: 'God gives us different amounts and teaches us to be grateful',
    materials: ['Counters', 'Number cards', 'Comparison pictures'],
    momTime: {
      duration: 12,
      script: `Let me show you something. Here are 5 blocks. Here are 2 blocks. Which group has MORE? That's right—5 blocks! Which group has LESS? 2 blocks! Let's use a cool symbol: > means MORE is on the left, < means LESS is on the left. 5 > 2. Say: "5 is MORE than 2."`,
      steps: [
        'Create two groups of different sizes',
        'Ask which is more/less',
        'Introduce > and < symbols informally',
        'Practice saying comparisons',
        'Have child create groups and compare',
      ],
    },
    guidedPractice: {
      description: 'Adult creates groups, child says more or less',
      example: 'Adult puts 3 and 4 blocks. Child: "3 is less, 4 is more"',
    },
    independentActivity: {
      description: 'Child circles larger group in multiple comparisons',
      isHandsOn: true,
    },
    requiredWorksheet: {
      title: 'Comparing: More & Less',
      fileUrl: '/worksheets/week-02/k/Math_More_Less.pdf',
    },
    answerKey: 'Larger groups consistently circled; correct comparisons identified',
    ifStruggling: 'Use very different quantities first (1 vs 5)',
    ifAdvanced: 'Use 3-4 groups; order from least to most',
  },

  // 1st Grade Week 2
  {
    id: 'l-w2-mon-1st-lit',
    title: 'Vowel Teams: /OO/ Sound',
    subject: 'literacy',
    activityType: 'mom-time',
    weekNumber: 2,
    day: 'monday',
    gradeBand: '1st',
    minutes: 10,
    essential: true,
    owner: 'shared',
    learningObjective: 'Distinguish long /oo/ and short /oo/ sounds; read words with OO',
    biblicalConnection: 'Two letters working together make one sound—teamwork (1 Corinthians 12:12)',
    materials: ['Word cards with oo words', 'Picture cards (book, boot, moon, wood)'],
    momTime: {
      duration: 10,
      script: `Today we learn about TWO letters making ONE sound. Watch: O and O together = OO. But listen—there are TWO different /oo/ sounds! BOOK has the short /oo/ sound. Listen: /ook/. But MOON has the LONG /oo/ sound. Listen: /ooon/. Let me read some words: BOOT (long oo), WOOD (short oo). You try!`,
      steps: [
        'Introduce vowel team concept',
        'Model long /oo/ (moon, boot)',
        'Model short /oo/ (book, wood)',
        'Distinguish with picture cards',
        'Practice reading both types',
      ],
    },
    guidedPractice: {
      description: 'Adult says word, child identifies long or short oo',
      example: 'Adult: "BOOT." Child: "Long OO."',
    },
    independentActivity: {
      description: 'Sort OO words by long/short sound',
      isHandsOn: false,
    },
    requiredWorksheet: {
      title: 'Introduce: Vowel Team /OO/',
      fileUrl: '/worksheets/week-02/1st/Monday_Literacy_OO_Team.pdf',
    },
    challengeWorksheet: {
      title: '⭐ Challenge Me! OO Sound Discrimination',
      fileUrl: '/worksheets/week-02/1st/Challenge_OO_Reading.pdf',
    },
    answerKey: 'Long oo: moon, boot, food, cool. Short oo: book, foot, wood, look',
    ifStruggling: 'Focus only on long /oo/ (moon, boot) first',
    ifAdvanced: 'Distinguish from /u/ sound (cut); identify other vowel teams (ai, ea)',
  },

  {
    id: 'l-w2-mon-1st-math',
    title: 'Subtraction as Inverse of Addition',
    subject: 'math',
    activityType: 'hands-on',
    weekNumber: 2,
    day: 'monday',
    gradeBand: '1st',
    minutes: 12,
    essential: true,
    owner: 'shared',
    learningObjective: 'Understand subtraction as inverse of addition; connect related facts',
    biblicalConnection: 'God shows us how things are connected and work together',
    materials: ['Ten-frames', 'Counters', 'Worksheet'],
    momTime: {
      duration: 12,
      script: `Watch something cool. I have 5 blocks. I add 2. Now I have 7. 5 + 2 = 7. Now watch: I have 7 blocks. I take AWAY 2. Now I have 5. 7 - 2 = 5. They're OPPOSITES! Addition and subtraction are friends! 5 + 2 = 7 and 7 - 2 = 5. They work together!`,
      steps: [
        'Show addition problem: 5 + 3 = 8',
        'Show subtraction going backward: 8 - 3 = 5',
        'Explain inverse relationship',
        'Try with 4 + 2 = 6 and 6 - 2 = 4',
        'Child creates related facts',
      ],
    },
    guidedPractice: {
      description: 'Adult shows addition on ten-frame. Child shows corresponding subtraction.',
      example: 'Adult: 6 + 1 = 7 on ten-frame. Child: "So 7 - 1 = 6"',
    },
    independentActivity: {
      description: 'Child writes related addition/subtraction facts',
      isHandsOn: true,
    },
    requiredWorksheet: {
      title: 'Subtraction as Inverse',
      fileUrl: '/worksheets/week-02/1st/Math_Subtraction_Inverse.pdf',
    },
    answerKey: 'Related facts: 3+4=7 and 7-4=3; 5+2=7 and 7-2=5; etc.',
    ifStruggling: 'Focus on one related fact pair (5+3=8, 8-3=5) for a week',
    ifAdvanced: 'Extend to larger numbers (14 + 6 = 20, 20 - 6 = 14)',
  },
]

export const curriculumLessons: Lesson[] = [
  ...week1Lessons,
  ...week2Lessons,
  // Weeks 3-36: Template structure (skeleton pattern shown below)
  // Continue systematically...
]

/**
 * Helper: Get all lessons for a week
 */
export function getLessonsForWeek(weekNumber: number): Lesson[] {
  return curriculumLessons.filter((l) => l.weekNumber === weekNumber)
}

/**
 * Helper: Get lessons for a specific child (grade band)
 */
export function getLessonsForChild(
  weekNumber: number,
  day: string,
  gradeBand: string,
): Lesson[] {
  return curriculumLessons.filter(
    (l) => l.weekNumber === weekNumber && l.day === day && l.gradeBand === gradeBand,
  )
}
