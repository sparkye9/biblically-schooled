import type { Grade } from './types'

/**
 * Literacy scope & sequence — one entry per grade per week (36 × 3).
 *
 * The sequences follow a systematic, explicit phonics order used by structured
 * literacy programs (continuous sounds and high-utility letters first; CVC →
 * digraphs → blends → silent-e → vowel teams → r-controlled → morphology) and
 * align with Common Core Foundational Skills (RF.K, RF.1) and Pre-K early
 * learning guidelines (alphabet knowledge, phonological awareness, print
 * concepts, name writing).
 *
 * Passages are original and pattern-controlled: they use the week's pattern,
 * earlier patterns, and listed high-frequency words.
 */

export interface Passage {
  title: string
  text: string
  questions: { q: string; a: string }[]
}

export interface LiteracyWeek {
  week: number
  grade: Grade
  title: string
  /** New letters/patterns this week (graphemes from phonics.ts or pattern labels). */
  graphemes: string[]
  /** Pattern label used for skills, e.g. 'short a', 'sh', 'a_e'. */
  pattern: string
  phono: string
  words: string[]
  /** Second pattern for a word sort (1st grade / K). */
  sortWith?: { label: string; words: string[] }
  hfw: string[]
  sentences: string[]
  passage?: Passage
  comprehension: string
  grammar?: string
  spelling?: string[]
  handwriting: string
  writing: string
  review?: boolean
}

// ───────────────────────────── PRE-K ─────────────────────────────

const PREK_LETTERS: (string | null)[] = [
  null, 'm', 's', 'a', 't', 'p', 'i', 'n', null,
  'c', 'o', 'd', 'g', 'h', 'e', 'r', 'f', null,
  'b', 'l', 'u', 'k', 'w', 'j', 'v', null,
  'y', 'z', 'x', null, null, null, null, null, null, null,
]
// W29 covers x and q together (index 28); W30–36 consolidation.

const PREK_PHONO = (w: number) =>
  w <= 4
    ? 'Listening: same or different sounds (bell vs. drum, clap patterns)'
    : w <= 12
      ? 'Rhyming: hear and match words that rhyme'
      : w <= 20
        ? 'Syllables: clap the parts of words and names'
        : w <= 30
          ? 'Beginning sounds: what sound does the word start with?'
          : 'Oral blending: put sounds together (c–at → cat)'

const PREK_SPECIAL: Record<number, Partial<LiteracyWeek>> = {
  1: {
    title: 'My Name Is Special',
    graphemes: [],
    pattern: 'name',
    handwriting: 'Trace your name; find the first letter of your name',
    writing: 'Draw yourself and trace your name under the picture.',
  },
  9: { title: 'Review: M S A T P I N', graphemes: ['m', 's', 'a', 't', 'p', 'i', 'n'], pattern: 'review', review: true },
  18: { title: 'Review: C O D G H E R F', graphemes: ['c', 'o', 'd', 'g', 'h', 'e', 'r', 'f'], pattern: 'review', review: true },
  26: { title: 'Review: B L U K W J V', graphemes: ['b', 'l', 'u', 'k', 'w', 'j', 'v'], pattern: 'review', review: true },
  29: { title: 'Letters Q and X', graphemes: ['qu', 'x'], pattern: 'letter' },
  30: { title: 'Alphabet Review: Big and Little Letters', graphemes: [], pattern: 'review', review: true },
  31: { title: 'Beginning Sounds Sort', graphemes: ['m', 's', 't', 'b'], pattern: 'beginning sounds', review: true },
  32: { title: 'Rhyme Time', graphemes: ['c', 'f', 'p'], pattern: 'rhyming', review: true },
  33: { title: 'Clap the Syllables', graphemes: ['l', 'r', 'h'], pattern: 'syllables', review: true },
  34: { title: 'Blending Sounds Together', graphemes: ['a', 'i', 'o'], pattern: 'oral blending', review: true },
  35: { title: 'Writing My Name and Favorite Letters', graphemes: [], pattern: 'name', review: true },
  36: { title: 'Alphabet Celebration Parade', graphemes: [], pattern: 'review', review: true },
}

function buildPreK(): LiteracyWeek[] {
  const out: LiteracyWeek[] = []
  for (let w = 1; w <= 36; w++) {
    const special = PREK_SPECIAL[w]
    const letter = PREK_LETTERS[w - 1]
    const graphemes = special?.graphemes ?? (letter ? [letter] : [])
    const L = graphemes[0]
    out.push({
      week: w,
      grade: 'pre-k',
      title: special?.title ?? `Letter ${L!.toUpperCase()}${L} — Name and Sound`,
      graphemes,
      pattern: special?.pattern ?? 'letter',
      phono: PREK_PHONO(w),
      words: [],
      hfw: [],
      sentences: [],
      comprehension:
        w <= 12
          ? 'Listen to a picture book; point to the pictures and name them'
          : w <= 24
            ? 'Retell a short story: who was in it? what happened?'
            : 'Predict: what will happen next? Then check.',
      handwriting:
        special?.handwriting ??
        (L
          ? `Trace big ${L.toUpperCase()} and little ${L}; build the letter with play dough or sticks`
          : 'Name writing: trace, then copy the first letter of your name'),
      writing: special?.writing ?? 'Draw a picture and tell a grown-up about it; they write your words.',
      review: special?.review,
    })
  }
  return out
}

// ───────────────────────────── KINDERGARTEN ─────────────────────────────

type K = Omit<LiteracyWeek, 'grade' | 'phono' | 'comprehension' | 'handwriting' | 'writing'> &
  Partial<Pick<LiteracyWeek, 'comprehension' | 'handwriting' | 'writing'>>

const K_PHONO = (w: number) =>
  w <= 4
    ? 'Rhyming: produce a rhyme (cat → hat, bat)'
    : w <= 8
      ? 'Syllables: clap and count syllables'
      : w <= 12
        ? 'Isolate the first sound in a word'
        : w <= 16
          ? 'Blend 3 sounds into a word (/m/ /a/ /p/ → map)'
          : w <= 24
            ? 'Segment a CVC word into 3 sounds (tap one finger per sound)'
            : 'Change a sound to make a new word (cat → hat → hot)'

const K_WEEKS: K[] = [
  { week: 1, title: 'Sounds /ă/ and /m/', graphemes: ['a', 'm'], pattern: 'a, m', words: ['am', 'Mam'], hfw: ['I', 'a'], sentences: ['I am.'] },
  { week: 2, title: 'Sounds /s/ and /t/', graphemes: ['s', 't'], pattern: 's, t', words: ['sat', 'mat', 'at', 'am', 'Sam', 'Tam'], hfw: ['the'], sentences: ['Sam sat.', 'I sat at the mat.'] },
  { week: 3, title: 'Sounds /p/ and /f/', graphemes: ['p', 'f'], pattern: 'p, f', words: ['map', 'tap', 'pat', 'sap', 'fat', 'Pam'], hfw: ['see'], sentences: ['I see a map.', 'Pam can tap.'] },
  { week: 4, title: 'Sounds /ĭ/ and /n/', graphemes: ['i', 'n'], pattern: 'i, n', words: ['pin', 'tin', 'fin', 'sit', 'tip', 'nap', 'pan', 'man'], hfw: ['and'], sentences: ['I see a pin and a pan.', 'Sam sat in the tin.'] },
  { week: 5, title: 'Review and Blend: a m s t p f i n', graphemes: ['a', 'm', 's', 't', 'p', 'f', 'i', 'n'], pattern: 'review', review: true, words: ['sat', 'fin', 'map', 'tip', 'pan', 'fat', 'pit', 'man'], hfw: ['is'], sentences: ['The pan is in the tin.', 'Tim can sit at the map.'], passage: { title: 'Sam and Tim', text: 'Sam sat. Tim sat. Sam and Tim sat at the map. I see Sam and Tim.', questions: [{ q: 'Who sat?', a: 'Sam and Tim' }, { q: 'Where did they sit?', a: 'At the map' }] } },
  { week: 6, title: 'Sounds /ŏ/ and /d/', graphemes: ['o', 'd'], pattern: 'o, d', words: ['dot', 'pot', 'mop', 'top', 'dad', 'nod', 'Don', 'not'], hfw: ['can'], sentences: ['Dad can mop.', 'I can see a pot and a top.'] },
  { week: 7, title: 'Sounds /k/ (c) and /ŭ/', graphemes: ['c', 'u'], pattern: 'c, u', words: ['cup', 'cut', 'cat', 'cot', 'sun', 'nut', 'mud', 'pup'], hfw: ['to'], sentences: ['The cat can nap in the sun.', 'I can cut a nut.'] },
  { week: 8, title: 'Sounds /g/ and /b/', graphemes: ['g', 'b'], pattern: 'g, b', words: ['bag', 'big', 'bug', 'dig', 'gum', 'bus', 'tub', 'bat'], hfw: ['go'], sentences: ['A big bug is in the bus.', 'I can go dig.'] },
  { week: 9, title: 'Review: o d c u g b', graphemes: ['o', 'd', 'c', 'u', 'g', 'b'], pattern: 'review', review: true, words: ['cub', 'dog', 'bud', 'cog', 'gob', 'dug', 'cob', 'bog'], hfw: ['we'], sentences: ['We can go to the bus.', 'The dog dug in the mud.'], passage: { title: 'The Pup', text: 'The pup dug in the mud. The pup is a mud pup! Dad got a tub. We can rub the pup. The pup is not a mud pup.', questions: [{ q: 'Where did the pup dig?', a: 'In the mud' }, { q: 'What did Dad get?', a: 'A tub' }] } },
  { week: 10, title: 'Sounds /ĕ/ and /k/ (k)', graphemes: ['e', 'k'], pattern: 'e, k', words: ['pet', 'pen', 'ten', 'net', 'bed', 'kid', 'kit', 'men'], hfw: ['my'], sentences: ['My pet is in bed.', 'The kid got ten pens.'] },
  { week: 11, title: 'Sounds /h/ and /r/', graphemes: ['h', 'r'], pattern: 'h, r', words: ['hat', 'hot', 'hen', 'hug', 'rat', 'run', 'rug', 'red'], hfw: ['like'], sentences: ['I like my red hat.', 'The rat can run on the rug.'] },
  { week: 12, title: 'Sounds /l/ and /w/', graphemes: ['l', 'w'], pattern: 'l, w', words: ['lap', 'lid', 'log', 'leg', 'wig', 'wet', 'web', 'win'], hfw: ['you'], sentences: ['You can sit on my lap.', 'The web is wet.'] },
  { week: 13, title: 'Sounds /j/ and /y/', graphemes: ['j', 'y'], pattern: 'j, y', words: ['jam', 'jet', 'jog', 'jug', 'yes', 'yet', 'yum', 'yak'], hfw: ['he'], sentences: ['He can jog.', 'Yes! The jam is yum.'] },
  { week: 14, title: 'Sounds x, qu, v, z', graphemes: ['x', 'qu', 'v', 'z'], pattern: 'x, qu, v, z', words: ['box', 'fox', 'six', 'quit', 'quiz', 'van', 'vet', 'zip'], hfw: ['she'], sentences: ['She can zip the box.', 'The fox is in the van.'] },
  { week: 15, title: 'All Letter Sounds Review', graphemes: [], pattern: 'review', review: true, words: ['fox', 'jet', 'web', 'hug', 'yak', 'quiz', 'vet', 'zip'], hfw: ['me', 'look'], sentences: ['Look at me!', 'Look at the fox and the yak.'], passage: { title: 'Look at Me', text: 'Look at me! I can hop. I can jog. I can zip up my red top. Look at me! I can hug my mom.', questions: [{ q: 'Name one thing the child can do.', a: 'Hop, jog, zip up, or hug' }, { q: 'Who does the child hug?', a: 'Mom' }] } },
  { week: 16, title: 'Short a Word Families: -at, -an, -ap', graphemes: ['a'], pattern: 'short a', words: ['cat', 'hat', 'bat', 'can', 'fan', 'van', 'cap', 'map', 'nap'], hfw: ['said'], sentences: ['Dad said, "Nap on the mat."', 'The cat got a hat.'], passage: { title: 'The Cat Nap', text: 'Pat has a cat. The cat can nap. The cat can nap on a mat. The cat can nap in a van! Pat said, "Get up, cat!"', questions: [{ q: 'Who has a cat?', a: 'Pat' }, { q: 'Where can the cat nap?', a: 'On a mat or in a van' }] } },
  { week: 17, title: 'Short i Word Families: -it, -in, -ig', graphemes: ['i'], pattern: 'short i', words: ['sit', 'hit', 'fit', 'pin', 'win', 'fin', 'big', 'dig', 'pig'], hfw: ['was'], sentences: ['The pig was big.', 'Can a kid win? Yes!'], passage: { title: 'The Big Pig', text: 'Kim has a big pig. The pig can dig. The pig was in a pit. Kim did not quit. Kim got the pig. The pig sat by Kim.', questions: [{ q: 'What does Kim have?', a: 'A big pig' }, { q: 'Where was the pig?', a: 'In a pit' }] } },
  { week: 18, title: 'Short o Word Families: -ot, -op, -og', graphemes: ['o'], pattern: 'short o', words: ['hot', 'pot', 'dot', 'hop', 'mop', 'top', 'dog', 'log', 'fog'], hfw: ['do'], sentences: ['Do not hop on the log.', 'The pot is hot.'], passage: { title: 'Hop, Dog, Hop', text: 'Tom has a dog. The dog can hop on a log. The dog can hop on a box. "Do not hop on the pot!" said Tom. The pot is hot.', questions: [{ q: 'What can the dog hop on?', a: 'A log or a box' }, { q: 'Why should the dog not hop on the pot?', a: 'The pot is hot' }] } },
  { week: 19, title: 'Short u Word Families: -ug, -un, -ut', graphemes: ['u'], pattern: 'short u', words: ['bug', 'hug', 'rug', 'sun', 'run', 'bun', 'cut', 'nut', 'hut'], hfw: ['are'], sentences: ['We are in the sun.', 'A bug is in the rug.'], passage: { title: 'Fun in the Sun', text: 'We are in the sun. We can run and run. Gus has a bun. Bud has a nut. We sit on a rug. It is fun in the sun!', questions: [{ q: 'What does Gus have?', a: 'A bun' }, { q: 'Where do they sit?', a: 'On a rug' }] } },
  { week: 20, title: 'Short e Word Families: -et, -en, -ed', graphemes: ['e'], pattern: 'short e', words: ['net', 'pet', 'wet', 'hen', 'ten', 'pen', 'bed', 'red', 'fed'], hfw: ['for'], sentences: ['The hen is for Ted.', 'My pet got wet.'], passage: { title: 'Ten Red Hens', text: 'Meg has ten red hens. Meg fed the hens. A hen got wet. Meg set the wet hen on a bed.', questions: [{ q: 'How many hens does Meg have?', a: 'Ten' }, { q: 'What did Meg do with the wet hen?', a: 'Set it on a bed' }] } },
  { week: 21, title: 'Mixed Short Vowels and Sentences', graphemes: [], pattern: 'mixed short vowels', review: true, words: ['bat', 'bit', 'bet', 'but', 'pan', 'pin', 'pen', 'pup'], hfw: ['have', 'of'], sentences: ['I have a lot of pets.', 'Ten of the cats can nap.'], passage: { title: 'A Lot of Pets', text: 'I have a lot of pets. I have a cat, a dog, and a pig. The cat can nap. The dog can dig. The pig can sit in the mud. I like my pets!', questions: [{ q: 'Name the pets.', a: 'A cat, a dog, and a pig' }, { q: 'What can the pig do?', a: 'Sit in the mud' }] } },
  { week: 22, title: 'Digraph sh', graphemes: ['sh'], pattern: 'sh', words: ['ship', 'shop', 'shed', 'shut', 'fish', 'dish', 'wish', 'cash'], hfw: ['they'], sentences: ['They shut the shed.', 'The fish is in a dish.'], passage: { title: 'The Fish Shop', text: 'Josh and Beth went to a fish shop. They got a fish. The fish is red. They set the fish in a big dish. Josh had a wish: "Can we get ten fish?"', questions: [{ q: 'Where did Josh and Beth go?', a: 'A fish shop' }, { q: 'What color is the fish?', a: 'Red' }] } },
  { week: 23, title: 'Digraph ch', graphemes: ['ch'], pattern: 'ch', words: ['chin', 'chip', 'chop', 'chat', 'much', 'rich', 'such', 'chum'], hfw: ['here'], sentences: ['Here is a chip.', 'Chad can chop.'], passage: { title: 'Chips for Lunch', text: 'Here is Chad. Chad can chop. Chad can chat. Chad has a chip on his chin! Mom said, "Get the chip, Chad!"', questions: [{ q: 'What can Chad do?', a: 'Chop and chat' }, { q: 'Where is the chip?', a: 'On his chin' }] } },
  { week: 24, title: 'Digraph th', graphemes: ['th'], pattern: 'th', words: ['this', 'that', 'them', 'then', 'thin', 'with', 'bath', 'math'], hfw: ['this'], sentences: ['This is a thin cat.', 'Then the dog had a bath.'], passage: { title: 'Bath Time', text: 'This is Seth. Seth has a dog. The dog is in a bath. Seth gets wet with the dog! Then Seth has a bath, too.', questions: [{ q: 'Who has a dog?', a: 'Seth' }, { q: 'What happened to Seth?', a: 'He got wet and had a bath too' }] } },
  { week: 25, title: 'Ending ck', graphemes: ['ck'], pattern: 'ck', words: ['back', 'pack', 'sick', 'kick', 'rock', 'sock', 'duck', 'luck'], hfw: ['what'], sentences: ['What is in the pack?', 'The duck sat on a rock.'], passage: { title: 'What Is in the Pack?', text: 'Nick has a pack on his back. What is in the pack? A sock! A rock! A duck? No, a duck is not in the pack.', questions: [{ q: 'Where is Nick’s pack?', a: 'On his back' }, { q: 'What is in the pack?', a: 'A sock and a rock' }] } },
  { week: 26, title: 'Review: sh, ch, th, ck', graphemes: ['sh', 'ch', 'th', 'ck'], pattern: 'review digraphs', review: true, words: ['shock', 'check', 'thick', 'chick', 'shack', 'path', 'chin', 'shed'], hfw: ['little', 'down'], sentences: ['The little chick sat down.', 'Check the thick rock.'], passage: { title: 'The Little Chick', text: 'A little chick ran down the path. The chick hid in a shed. Then the chick sat on a thick rug. Chip, chip! said the chick.', questions: [{ q: 'Where did the chick hide?', a: 'In a shed' }, { q: 'What did the chick sit on?', a: 'A thick rug' }] } },
  { week: 27, title: 'Double Letters: ff, ll, ss', graphemes: [], pattern: 'floss', words: ['puff', 'off', 'bell', 'hill', 'doll', 'mess', 'kiss', 'pass'], hfw: ['come', 'some'], sentences: ['Come up the hill.', 'Some kids can pass the doll.'], passage: { title: 'Up the Hill', text: 'Come with me up the hill. We can huff and puff. At the top, Bill has a bell. Ring the bell! Some kids sit on the hill.', questions: [{ q: 'Where do they go?', a: 'Up the hill' }, { q: 'What does Bill have?', a: 'A bell' }] } },
  { week: 28, title: 'Adding -s to Make More', graphemes: [], pattern: 'plural -s', words: ['cats', 'dogs', 'hats', 'pigs', 'bugs', 'cups', 'beds', 'ships'], hfw: ['play', 'put'], sentences: ['Put the cups on the mat.', 'The pigs play in the mud.'], passage: { title: 'Pets at Play', text: 'The cats play with the hats. The dogs play with the cups. The pigs play in the mud. Mom put the pets in the tub!', questions: [{ q: 'What do the dogs play with?', a: 'The cups' }, { q: 'Where did Mom put the pets?', a: 'In the tub' }] } },
  { week: 29, title: 'Beginning Blends', graphemes: [], pattern: 'initial blends', words: ['stop', 'spin', 'snap', 'flag', 'clap', 'frog', 'trip', 'plum'], hfw: ['one', 'two'], sentences: ['One frog can spin.', 'Two kids clap.'], passage: { title: 'The Frog Trip', text: 'One frog and two frogs went on a trip. The frogs hop and stop. They spin and flip. Then they sit on a log.', questions: [{ q: 'How many frogs went on the trip?', a: 'Three (one and two)' }, { q: 'Where did they sit?', a: 'On a log' }] } },
  { week: 30, title: 'Ending Blends', graphemes: [], pattern: 'final blends', words: ['hand', 'sand', 'nest', 'best', 'jump', 'lamp', 'tent', 'milk'], hfw: ['three', 'from'], sentences: ['Three eggs sat in a nest.', 'Jump from the sand.'], passage: { title: 'At Camp', text: 'We set up a tent at camp. We dig in the sand with a hand. We jump in the pond. We get milk from Mom. Camp is the best!', questions: [{ q: 'What did they set up?', a: 'A tent' }, { q: 'Where did they jump?', a: 'In the pond' }] } },
  { week: 31, title: 'Magic e: a_e', graphemes: [], pattern: 'a_e', words: ['cake', 'make', 'lake', 'game', 'name', 'tape', 'cape', 'gate'], sortWith: { label: 'short a', words: ['cap', 'tap', 'can', 'mat'] }, hfw: ['there', 'where'], sentences: ['Where is the cake?', 'There is a lake by the gate.'], passage: { title: 'Jake Makes a Cake', text: 'Jake can make a cake. Where is the pan? There it is! Jake and Dad bake the cake. Jake puts his name on it. Yum!', questions: [{ q: 'What does Jake make?', a: 'A cake' }, { q: 'What does Jake put on the cake?', a: 'His name' }] } },
  { week: 32, title: 'Magic e: i_e', graphemes: [], pattern: 'i_e', words: ['bike', 'like', 'kite', 'bite', 'five', 'hide', 'time', 'pine'], sortWith: { label: 'short i', words: ['bit', 'kit', 'fin', 'hid'] }, hfw: ['who', 'want'], sentences: ['Who wants to ride a bike?', 'I want a kite.'], passage: { title: 'Kite Time', text: 'Who wants to fly a kite? I do! I ride my bike to the hill. It is kite time. The kite is up, up, up! I like my kite.', questions: [{ q: 'How did the child get to the hill?', a: 'Rode a bike' }, { q: 'What did the child fly?', a: 'A kite' }] } },
  { week: 33, title: 'Magic e: o_e and u_e', graphemes: [], pattern: 'o_e, u_e', words: ['home', 'bone', 'rope', 'nose', 'cute', 'mule', 'tube', 'cube'], hfw: ['does', 'good'], sentences: ['The dog has a good bone.', 'Does the mule like the rope?'], passage: { title: 'A Bone at Home', text: 'Rose has a cute dog. The dog digs at home. Does the dog want a rope? No! The dog wants a bone. Good dog!', questions: [{ q: 'Who has a cute dog?', a: 'Rose' }, { q: 'What does the dog want?', a: 'A bone' }] } },
  { week: 34, title: 'Reading Short Stories', graphemes: [], pattern: 'fluency', review: true, words: ['ship', 'lake', 'stop', 'chip', 'home', 'jump', 'bike', 'thick'], hfw: ['could', 'would'], sentences: ['Could we ride to the lake?', 'I would like a chip.'], passage: { title: 'A Trip to the Lake', text: 'Could we go to the lake? Mom said yes! We ride our bikes. At the lake, we jump in. A fish swims by. We sit and munch on chips. Then we ride home.', questions: [{ q: 'How did they get to the lake?', a: 'Rode bikes' }, { q: 'What did they eat?', a: 'Chips' }, { q: 'What swam by?', a: 'A fish' }] } },
  { week: 35, title: 'Review: Blends and Magic e', graphemes: [], pattern: 'review', review: true, words: ['grape', 'slide', 'stone', 'flute', 'skate', 'smile', 'plane', 'drive'], hfw: ['were', 'your'], sentences: ['Were you on the slide?', 'Smile at your mom.'], passage: { title: 'The Big Slide', text: 'Were you at the park? There is a big slide. We slide and smile. We skate and jump. Then we sit on a stone and eat grapes.', questions: [{ q: 'What is at the park?', a: 'A big slide' }, { q: 'What did they eat?', a: 'Grapes' }] } },
  { week: 36, title: 'Celebration: I Am a Reader!', graphemes: [], pattern: 'fluency', review: true, words: ['cake', 'fish', 'jump', 'bike', 'chin', 'home', 'stop', 'that'], hfw: ['all', 'very'], sentences: ['I can read all of this!', 'I am very glad.'], passage: { title: 'I Can Read', text: 'I can read a lot of words. I can read cake and fish. I can read ship and bike. I am a reader! God gave me eyes to read and a mind to think.', questions: [{ q: 'Name two words the child can read.', a: 'Any two: cake, fish, ship, bike' }, { q: 'What did God give the child?', a: 'Eyes to read and a mind to think' }] } },
]

function buildK(): LiteracyWeek[] {
  return K_WEEKS.map((k) => ({
    ...k,
    grade: 'k' as const,
    phono: K_PHONO(k.week),
    comprehension:
      k.comprehension ??
      (k.week <= 9
        ? 'Listening comprehension: name the characters and setting of a read-aloud'
        : k.week <= 18
          ? 'Retell a story with a beginning, middle, and end'
          : k.week <= 27
            ? 'Ask and answer who, what, where questions about a text'
            : 'Connect pictures and words; tell the main topic of a book'),
    handwriting:
      k.handwriting ??
      (k.graphemes.length && k.graphemes.every((g) => g.length === 1)
        ? `Form ${k.graphemes.map((g) => g.toUpperCase() + g).join(', ')} with correct starting point`
        : 'Write words neatly with finger spaces between them'),
    writing:
      k.writing ??
      (k.week <= 12
        ? 'Draw and label: write the first sound of your picture'
        : k.week <= 24
          ? 'Write a CVC word to label a drawing'
          : 'Write one sentence with a capital letter, finger spaces, and a period'),
    grammar:
      k.week <= 12
        ? 'Print concepts: words are separated by spaces'
        : k.week <= 24
          ? 'A sentence starts with a capital and ends with a period'
          : 'Nouns name people, places, and things; question marks ask',
  }))
}

// ───────────────────────────── FIRST GRADE ─────────────────────────────

type F = Omit<LiteracyWeek, 'grade' | 'phono' | 'handwriting' | 'writing'> &
  Partial<Pick<LiteracyWeek, 'handwriting' | 'writing'>>

const F_PHONO = (w: number) =>
  w <= 9
    ? 'Blend and segment words with 4–5 sounds (s-t-o-p)'
    : w <= 18
      ? 'Change one sound to make a new word (stop → step → strap)'
      : w <= 27
        ? 'Count sounds vs. letters (boat: 4 letters, 3 sounds)'
        : 'Break longer words into syllables and sounds'

const F_WEEKS: F[] = [
  {
    week: 1, title: 'Short a and Short i Review', graphemes: ['a', 'i'], pattern: 'short a / short i',
    words: ['cat', 'map', 'bag', 'jam', 'pig', 'sit', 'win', 'lid'], sortWith: { label: 'short i', words: ['pig', 'sit', 'win', 'lid'] },
    hfw: ['the', 'a', 'is'], spelling: ['cat', 'map', 'bag', 'pig', 'sit', 'win'],
    sentences: ['The cat is at the mat.', 'A pig sat in the mud.'],
    comprehension: 'Characters: who is in the story?', grammar: 'A sentence begins with a capital letter',
    passage: { title: 'Tab the Cat', text: 'Sam has a cat. The cat is Tab. Tab is a big cat. Tab can sit in a bag. Tab can nap on a mat. Sam pats Tab. Tab can nap and nap!', questions: [{ q: 'Who is Tab?', a: 'Sam’s cat' }, { q: 'Where can Tab sit?', a: 'In a bag' }, { q: 'What does Sam do?', a: 'Pats Tab' }] },
  },
  {
    week: 2, title: 'Short o, u, e Review', graphemes: ['o', 'u', 'e'], pattern: 'short o / short u / short e',
    words: ['hot', 'dog', 'mop', 'bug', 'sun', 'cup', 'bed', 'pen', 'wet'], sortWith: { label: 'short e', words: ['bed', 'pen', 'wet', 'ten'] },
    hfw: ['to', 'of', 'was'], spelling: ['hot', 'dog', 'bug', 'sun', 'bed', 'pen'],
    sentences: ['The dog was hot in the sun.', 'A bug got in the cup.'],
    comprehension: 'Setting: where and when does the story happen?', grammar: 'A telling sentence ends with a period',
    passage: { title: 'A Hot Day', text: 'It was a hot day. The sun was up. Ben and his dog ran to the pond. The dog got wet. Ben got wet, too! Then they sat in the sun.', questions: [{ q: 'Where did Ben and the dog run?', a: 'To the pond' }, { q: 'What was the weather like?', a: 'Hot and sunny' }, { q: 'Who got wet?', a: 'Ben and the dog' }] },
  },
  {
    week: 3, title: 'CVC Words in Sentences', graphemes: [], pattern: 'cvc mixed', review: true,
    words: ['web', 'fox', 'rug', 'kid', 'yes', 'zip', 'van', 'hut'],
    hfw: ['you', 'said', 'are'], spelling: ['web', 'fox', 'rug', 'kid', 'zip', 'van'],
    sentences: ['"You are fun!" said the kid.', 'The fox hid in the van.'],
    comprehension: 'Retell: beginning, middle, and end', grammar: 'Nouns: words for people, places, and things',
    passage: { title: 'The Fox and the Hen', text: 'A red fox ran up to a hen. "You are my lunch!" said the fox. The hen ran and hid in a box. The fox did not get the hen. The hen sat in the box until the fox left.', questions: [{ q: 'What happened at the beginning?', a: 'A fox ran up to a hen' }, { q: 'Where did the hen hide?', a: 'In a box' }, { q: 'How did it end?', a: 'The fox left; the hen was safe' }] },
  },
  {
    week: 4, title: 'Digraphs sh and ch', graphemes: ['sh', 'ch'], pattern: 'sh / ch',
    words: ['ship', 'shop', 'fish', 'dish', 'chin', 'chop', 'much', 'lunch'], sortWith: { label: 'ch', words: ['chin', 'chop', 'much', 'lunch'] },
    hfw: ['they', 'have', 'do'], spelling: ['ship', 'shop', 'fish', 'chin', 'chop', 'much'],
    sentences: ['They have fish for lunch.', 'Do not chop the dish!'],
    comprehension: 'Ask and answer who and what questions', grammar: 'Names of people and places start with a capital letter',
    passage: { title: 'Lunch on the Ship', text: 'Chad and Shelly are on a big ship. They have fish and chips for lunch. Chad has much to munch. Shelly has a dish of chips. "This ship is the best," said Chad.', questions: [{ q: 'Where are Chad and Shelly?', a: 'On a big ship' }, { q: 'What do they have for lunch?', a: 'Fish and chips' }, { q: 'Which names start with a capital?', a: 'Chad, Shelly' }] },
  },
  {
    week: 5, title: 'Digraphs th, wh, and ck', graphemes: ['th', 'wh', 'ck'], pattern: 'th / wh / ck',
    words: ['this', 'thin', 'bath', 'when', 'whip', 'duck', 'sock', 'back'], sortWith: { label: 'ck', words: ['duck', 'sock', 'back', 'kick'] },
    hfw: ['what', 'where', 'there'], spelling: ['this', 'thin', 'when', 'duck', 'sock', 'back'],
    sentences: ['Where is the duck?', 'There is a sock in the bath.'],
    comprehension: 'Use picture clues to understand the text', grammar: 'Verbs: action words',
    passage: { title: 'Where Is the Duck?', text: 'When Seth got in the bath, his duck was not there. "Where is my duck?" said Seth. He checked his sock. He checked his back pack. What is that? The duck was in the sink!', questions: [{ q: 'What was Seth looking for?', a: 'His duck' }, { q: 'Name one place Seth checked.', a: 'His sock or his backpack' }, { q: 'Where was the duck?', a: 'In the sink' }] },
  },
  {
    week: 6, title: 'Double Letters: ff, ll, ss, zz and -all', graphemes: [], pattern: 'floss / -all',
    words: ['puff', 'stiff', 'bell', 'hill', 'mess', 'kiss', 'buzz', 'ball', 'tall', 'call'],
    hfw: ['one', 'two', 'from'], spelling: ['bell', 'hill', 'mess', 'buzz', 'ball', 'tall'],
    sentences: ['One ball fell from the hill.', 'Two bugs buzz in the grass.'],
    comprehension: 'Sequence: first, next, last', grammar: 'An asking sentence ends with a question mark',
    passage: { title: 'The Ball on the Hill', text: 'First, Jill had a red ball. Next, the ball fell from her hand and ran down the hill. Jill had to run fast. Last, Jill got the ball at the end of the hill. Will she miss it next time?', questions: [{ q: 'What happened first?', a: 'Jill had a red ball' }, { q: 'What happened next?', a: 'The ball fell and rolled down the hill' }, { q: 'What happened last?', a: 'Jill got the ball' }] },
  },
  {
    week: 7, title: 'Beginning Blends (l, r, s blends)', graphemes: [], pattern: 'initial blends',
    words: ['flag', 'clap', 'plum', 'frog', 'crab', 'drum', 'stop', 'snack', 'swim'],
    hfw: ['come', 'some', 'were'], spelling: ['flag', 'clap', 'frog', 'drum', 'stop', 'swim'],
    sentences: ['Some frogs swim in the pond.', 'Come and clap with me!'],
    comprehension: 'Main topic: what is this mostly about?', grammar: 'Adjectives: words that describe',
    passage: { title: 'Frogs', text: 'Frogs can swim. Frogs can jump. A frog has strong back legs to help it jump. Some frogs are green, and some are brown. Frogs snap up bugs as a snack. Frogs were made by God, and they are fun to watch!', questions: [{ q: 'What is this text mostly about?', a: 'Frogs' }, { q: 'What helps a frog jump?', a: 'Strong back legs' }, { q: 'What do frogs eat as a snack?', a: 'Bugs' }] },
  },
  {
    week: 8, title: 'Ending Blends (nd, nt, st, mp, sk)', graphemes: [], pattern: 'final blends',
    words: ['hand', 'sand', 'tent', 'went', 'nest', 'best', 'jump', 'lamp', 'desk'],
    hfw: ['your', 'put', 'want'], spelling: ['hand', 'tent', 'nest', 'jump', 'lamp', 'desk'],
    sentences: ['Put your hand in the sand.', 'I want to jump and run.'],
    comprehension: 'Key details: find facts in the text', grammar: 'One and more: add -s to nouns',
    passage: { title: 'The Best Camp', text: 'We went to camp. We put up a tent. A bird had a nest on a branch. At dusk, we lit a lamp. We sang and had snacks. It was the best camp trip!', questions: [{ q: 'What did they put up?', a: 'A tent' }, { q: 'What did the bird have?', a: 'A nest' }, { q: 'What did they light at dusk?', a: 'A lamp' }] },
  },
  {
    week: 9, title: 'Review: Digraphs and Blends', graphemes: [], pattern: 'review', review: true,
    words: ['shrimp', 'chest', 'thump', 'trash', 'crunch', 'flash', 'stamp', 'cloth'],
    hfw: ['review'], spelling: ['chest', 'trash', 'flash', 'stamp', 'cloth', 'thump'],
    sentences: ['Dad will stack the trash.', 'The crab hid in the chest.'],
    comprehension: 'Retell with key details', grammar: 'Complete sentences: who + what they do',
    passage: { title: 'The Chest in the Sand', text: 'Beth and Chet dug in the sand. Thump! They hit a chest. They had to tug and tug. The chest had shells and a crab in it! The crab went snap, snap. Beth and Chet ran and grinned.', questions: [{ q: 'What did Beth and Chet find?', a: 'A chest' }, { q: 'What was in the chest?', a: 'Shells and a crab' }, { q: 'What did the crab do?', a: 'Snapped' }] },
  },
  {
    week: 10, title: 'Glued Sounds: -ng and -nk', graphemes: ['ng'], pattern: '-ng / -nk',
    words: ['ring', 'sing', 'king', 'long', 'bank', 'pink', 'drink', 'trunk'], sortWith: { label: '-nk', words: ['bank', 'pink', 'drink', 'trunk'] },
    hfw: ['could', 'would', 'should'], spelling: ['ring', 'sing', 'long', 'pink', 'drink', 'trunk'],
    sentences: ['The king would sing a long song.', 'You should drink from the cup.'],
    comprehension: 'Character feelings: how does the character feel and why?', grammar: 'Pronouns: he, she, it, they',
    passage: { title: 'The King Who Could Not Sing', text: 'The king had a pink ring. He could not sing. "I think I should sing," said the king. He sang a long, long song. The song was bad, and the king was sad. Then his pals sang with him, and he was glad!', questions: [{ q: 'How did the king feel when his song was bad?', a: 'Sad' }, { q: 'Why did he feel glad at the end?', a: 'His friends sang with him' }, { q: 'What color was his ring?', a: 'Pink' }] },
  },
  {
    week: 11, title: 'Magic e: a_e', graphemes: [], pattern: 'a_e',
    words: ['cake', 'game', 'name', 'plane', 'shape', 'skate', 'brave', 'grape'], sortWith: { label: 'short a', words: ['can', 'tap', 'mad', 'plan'] },
    hfw: ['saw', 'look', 'does'], spelling: ['cake', 'game', 'name', 'plane', 'shape', 'brave'],
    sentences: ['Look at the plane in the sky!', 'Jane saw a cake shaped.'],
    comprehension: 'Compare two characters', grammar: 'Verbs that tell now and verbs that tell the past (-ed)',
    passage: { title: 'Jane and Dave', text: 'Jane and Dave made a game. Jane is brave. She likes to skate fast. Dave is calm. He likes to bake a cake. Jane and Dave are not the same, but they both like the game they made!', questions: [{ q: 'How is Jane different from Dave?', a: 'Jane is brave and skates; Dave is calm and bakes' }, { q: 'How are they the same?', a: 'They both like the game' }] },
  },
  {
    week: 12, title: 'Magic e: i_e', graphemes: [], pattern: 'i_e',
    words: ['bike', 'kite', 'time', 'smile', 'slide', 'white', 'drive', 'prize'], sortWith: { label: 'short i', words: ['bit', 'kit', 'slid', 'win'] },
    hfw: ['who', 'know', 'again'], spelling: ['bike', 'kite', 'time', 'smile', 'slide', 'white'],
    sentences: ['Who will ride the white bike?', 'I know it is time to slide again!'],
    comprehension: 'Problem and solution', grammar: 'Adjectives for size, color, and number',
    passage: { title: 'The Kite in the Pine', text: 'Mike had a white kite. The wind was strong, and the kite went up. Then it got stuck in a pine! Mike did not know what to do. Dad got a long pole. Dad got the kite, and Mike had a big smile.', questions: [{ q: 'What was the problem?', a: 'The kite got stuck in a pine tree' }, { q: 'How was it solved?', a: 'Dad used a long pole to get it' }] },
  },
  {
    week: 13, title: 'Magic e: o_e, u_e, e_e', graphemes: [], pattern: 'o_e / u_e / e_e',
    words: ['home', 'bone', 'stone', 'rope', 'cute', 'mule', 'flute', 'these'],
    hfw: ['many', 'any', 'other'], spelling: ['home', 'bone', 'rope', 'cute', 'flute', 'these'],
    sentences: ['These stones are smooth.', 'Do you have any rope?'],
    comprehension: 'Author’s purpose: to tell a story or to teach facts?', grammar: 'Sentences that tell vs. sentences that ask',
    passage: { title: 'Rocks and Stones', text: 'Stones are made of rock. Many stones are smooth. Some are rough. A stone in a stream gets smooth as the water rubs it. You can use stones to make a home for a pet bug. Do you have any stones at home?', questions: [{ q: 'Is this text a story or does it teach facts?', a: 'It teaches facts' }, { q: 'What makes a stone smooth?', a: 'Water rubbing it' }] },
  },
  {
    week: 14, title: 'Open Syllables and Y as Long i', graphemes: [], pattern: 'open syllable / y = long i',
    words: ['go', 'no', 'me', 'we', 'hi', 'my', 'fly', 'cry', 'sky', 'try'], sortWith: { label: 'y says /ī/', words: ['my', 'fly', 'sky', 'try'] },
    hfw: ['give', 'live', 'very'], spelling: ['go', 'me', 'hi', 'my', 'fly', 'try'],
    sentences: ['We live in a very big home.', 'Try to fly my kite!'],
    comprehension: 'Use details to describe a setting', grammar: 'Proper nouns: days of the week',
    passage: { title: 'Fly, Fly, Fly', text: 'Birds can fly in the sky. Can we fly? No, we cannot. But we can go up in a plane! My dad and I went in a plane. We saw the sky. I did not cry. I was so glad!', questions: [{ q: 'Can people fly like birds?', a: 'No' }, { q: 'How did the child go up in the sky?', a: 'In a plane' }] },
  },
  {
    week: 15, title: 'Endings: -ed (three sounds)', graphemes: [], pattern: '-ed',
    words: ['jumped', 'helped', 'played', 'filled', 'landed', 'wanted', 'rested', 'kicked'],
    hfw: ['their', 'says', 'been'], spelling: ['jumped', 'helped', 'played', 'filled', 'landed', 'wanted'],
    sentences: ['They played and rested.', 'The kids helped their mom.'],
    comprehension: 'Sequence events with first, then, after that', grammar: 'Past-tense verbs with -ed',
    passage: { title: 'Helping Day', text: 'On Saturday, the kids helped their mom. First, they filled the tub with water. Then they scrubbed the dog. After that, they played in the yard. At last, they rested on the deck. It had been a fun day!', questions: [{ q: 'What did the kids do first?', a: 'Filled the tub' }, { q: 'What did they do after they scrubbed the dog?', a: 'Played in the yard' }, { q: 'What did they do last?', a: 'Rested on the deck' }] },
  },
  {
    week: 16, title: 'Endings: -ing', graphemes: [], pattern: '-ing',
    words: ['jumping', 'singing', 'resting', 'fishing', 'helping', 'playing', 'reading', 'sleeping'],
    hfw: ['walk', 'talk', 'because'], spelling: ['jumping', 'singing', 'resting', 'fishing', 'helping', 'playing'],
    sentences: ['We walk and talk.', 'He is resting because he is sleepy.'],
    comprehension: 'Describe the setting with details', grammar: 'Helping verb + -ing (is jumping)',
    passage: { title: 'At the Lake', text: 'Dad is fishing at the lake. Mom is reading on a blanket. The kids are jumping in the water and singing songs. The dog is sleeping in the sun because it is tired from playing.', questions: [{ q: 'Where does the story take place?', a: 'At the lake' }, { q: 'What is Mom doing?', a: 'Reading' }, { q: 'Why is the dog sleeping?', a: 'It is tired from playing' }] },
  },
  {
    week: 17, title: 'Review: Magic e and Endings', graphemes: [], pattern: 'review', review: true,
    words: ['hoped', 'riding', 'skated', 'baking', 'smiled', 'hoping', 'liked', 'sliding'],
    hfw: ['review'], spelling: ['hoped', 'riding', 'skated', 'baking', 'smiled', 'liked'],
    sentences: ['She smiled while riding her bike.', 'We liked baking cakes.'],
    comprehension: 'Retell a story with characters, setting, and events', grammar: 'Review: nouns, verbs, adjectives',
    passage: { title: 'The Bake Sale', text: 'Kate and Jake were baking for a bake sale. Kate liked making cupcakes. Jake hoped to make a pie. They smiled when lots of kids came. They gave the money to help a family in need.', questions: [{ q: 'Who are the characters?', a: 'Kate and Jake' }, { q: 'What did they do with the money?', a: 'Gave it to help a family in need' }] },
  },
  {
    week: 18, title: 'R-Controlled: ar', graphemes: [], pattern: 'ar',
    words: ['car', 'star', 'park', 'farm', 'yard', 'barn', 'shark', 'smart'],
    hfw: ['friend', 'school', 'once'], spelling: ['car', 'star', 'park', 'farm', 'barn', 'shark'],
    sentences: ['My friend has a farm with a red barn.', 'Once, we went to the park.'],
    comprehension: 'Fiction or nonfiction? How can you tell?', grammar: 'Combine two short sentences with "and"',
    passage: { title: 'A Day on the Farm', text: 'Once, my friend Mark and I went to a farm. We saw a big red barn. We fed the hens in the yard. At dark, we saw the stars. A farm is a fun place to be!', questions: [{ q: 'Is this fiction or nonfiction?', a: 'Fiction (a story)' }, { q: 'What did they feed?', a: 'Hens' }, { q: 'What did they see at dark?', a: 'Stars' }] },
  },
  {
    week: 19, title: 'R-Controlled: or, ore', graphemes: [], pattern: 'or / ore',
    words: ['corn', 'fork', 'horse', 'storm', 'short', 'more', 'store', 'shore'],
    hfw: ['people', 'water', 'also'], spelling: ['corn', 'fork', 'horse', 'storm', 'more', 'store'],
    sentences: ['People need water.', 'We got more corn at the store.'],
    comprehension: 'Text features: title, headings, labels', grammar: 'Commas in a list',
    passage: { title: 'Horses', text: 'Horses are big, strong animals. A horse has four legs and a long tail. Horses eat grass, hay, and corn. People ride horses. Horses also need lots of water. In a storm, a horse may go into a barn.', questions: [{ q: 'What do horses eat?', a: 'Grass, hay, and corn' }, { q: 'Where may a horse go in a storm?', a: 'Into a barn' }] },
  },
  {
    week: 20, title: 'R-Controlled: er, ir, ur', graphemes: [], pattern: 'er / ir / ur',
    words: ['her', 'fern', 'bird', 'girl', 'shirt', 'turn', 'burn', 'church'],
    hfw: ['around', 'every', 'only'], spelling: ['her', 'bird', 'girl', 'shirt', 'turn', 'church'],
    sentences: ['Every bird can sing.', 'The girl went around the church.'],
    comprehension: 'Ask and answer questions about key details in nonfiction', grammar: 'Pronouns: I, me, we, us',
    passage: { title: 'Birds', text: 'Every bird has feathers. Birds have wings, but only some birds can fly. A bird builds a nest to keep its eggs safe. The mother bird sits on the eggs to keep them warm. When the chicks hatch, they chirp for food!', questions: [{ q: 'What does every bird have?', a: 'Feathers' }, { q: 'Why does a bird build a nest?', a: 'To keep its eggs safe' }] },
  },
  {
    week: 21, title: 'Vowel Teams: ai and ay', graphemes: [], pattern: 'ai / ay',
    words: ['rain', 'train', 'paint', 'snail', 'play', 'day', 'gray', 'stay'], sortWith: { label: 'ay (end of word)', words: ['play', 'day', 'gray', 'stay'] },
    hfw: ['great', 'together', 'always'], spelling: ['rain', 'train', 'paint', 'play', 'day', 'gray'],
    sentences: ['We always play together on gray days.', 'The snail is on the train.'],
    comprehension: 'Main idea: what is the most important idea?', grammar: 'Statements, questions, and exclamations',
    passage: { title: 'A Rainy Day', text: 'It is a gray day, and it is raining. We cannot play in the yard. So we stay in and paint. We paint a train and a snail. We play a game together. A rainy day can be a great day!', questions: [{ q: 'What is the main idea?', a: 'A rainy day can still be a great day' }, { q: 'What did they paint?', a: 'A train and a snail' }] },
  },
  {
    week: 22, title: 'Vowel Teams: ee and ea', graphemes: [], pattern: 'ee / ea',
    words: ['tree', 'feet', 'sleep', 'green', 'leaf', 'beach', 'read', 'team'], sortWith: { label: 'ea', words: ['leaf', 'beach', 'read', 'team'] },
    hfw: ['answer', 'learn', 'eye'], spelling: ['tree', 'feet', 'sleep', 'leaf', 'read', 'team'],
    sentences: ['We learn to read.', 'The green leaf fell from the tree.'],
    comprehension: 'Describe a character using details', grammar: 'Adjectives that describe feelings',
    passage: { title: 'Pete at the Beach', text: 'Pete is kind and neat. At the beach, he keeps his towel clean. He helps his little sister dig in the sand. He reads her a book under a tree. Pete is a good big brother.', questions: [{ q: 'What words describe Pete?', a: 'Kind, neat, helpful' }, { q: 'How does Pete help his sister?', a: 'Digs with her and reads to her' }] },
  },
  {
    week: 23, title: 'Vowel Teams: oa and ow (snow)', graphemes: [], pattern: 'oa / ow',
    words: ['boat', 'coat', 'road', 'soap', 'snow', 'grow', 'show', 'yellow'], sortWith: { label: 'ow', words: ['snow', 'grow', 'show', 'yellow'] },
    hfw: ['buy', 'laugh', 'sure'], spelling: ['boat', 'coat', 'road', 'snow', 'grow', 'show'],
    sentences: ['Be sure to buy a coat for the snow.', 'We laugh as the boat floats.'],
    comprehension: 'Retell a story using important details', grammar: 'Possessives: the boy’s coat',
    passage: { title: 'The Snow Boat', text: 'Joan made a boat from a box. She put on her coat and went out in the snow. She slid her boat down the road. The boat was slow, then fast! Joan laughed and laughed. "I will show Dad!" she said.', questions: [{ q: 'What did Joan make her boat from?', a: 'A box' }, { q: 'Where did she slide it?', a: 'Down the snowy road' }, { q: 'Who will she show?', a: 'Dad' }] },
  },
  {
    week: 24, title: 'Long i: igh, ie, y', graphemes: [], pattern: 'igh / ie / y',
    words: ['night', 'light', 'right', 'high', 'pie', 'tie', 'fly', 'sky'],
    hfw: ['both', 'mother', 'father'], spelling: ['night', 'light', 'right', 'high', 'pie', 'tie'],
    sentences: ['Both Mother and Father like pie.', 'The kite flies high in the sky.'],
    comprehension: 'Compare two texts on the same topic', grammar: 'Plural nouns that change: -s and -es',
    passage: { title: 'Night Lights', text: 'At night, the sky gets dark. God made lights for the night: the moon and the stars. The moon is bright. It shines high in the sky. Both my mother and father like to sit outside and look at the night lights.', questions: [{ q: 'What lights did God make for the night?', a: 'The moon and the stars' }, { q: 'Who likes to look at the night lights?', a: 'Mother and father' }] },
  },
  {
    week: 25, title: 'Review: Vowel Teams and R-Controlled', graphemes: [], pattern: 'review', review: true,
    words: ['rainbow', 'seashell', 'snowball', 'sailboat', 'starfish', 'birdbath', 'cornfield', 'playground'],
    hfw: ['review'], spelling: ['rain', 'seat', 'boat', 'star', 'bird', 'corn'],
    sentences: ['The sailboat is near the shore.', 'We saw a rainbow after the storm.'],
    comprehension: 'Answer questions with evidence from the text', grammar: 'Review: sentence types and punctuation',
    passage: { title: 'After the Storm', text: 'The storm was loud. Rain fell all night. In the morning, the sun came out. We ran to the playground. A big rainbow was in the sky! It made me think of God’s promise to Noah.', questions: [{ q: 'When did the sun come out?', a: 'In the morning' }, { q: 'What did the rainbow remind the child of?', a: 'God’s promise to Noah' }] },
  },
  {
    week: 26, title: 'Two Sounds of oo', graphemes: [], pattern: 'oo (moon) / oo (book)',
    words: ['moon', 'food', 'spoon', 'room', 'book', 'look', 'cook', 'wood'], sortWith: { label: 'oo as in book', words: ['book', 'look', 'cook', 'wood'] },
    hfw: ['brother', 'warm', 'carry'], spelling: ['moon', 'food', 'room', 'book', 'look', 'cook'],
    sentences: ['My brother can cook food.', 'Carry the book to your room.'],
    comprehension: 'Make predictions and check them', grammar: 'Verbs: is/are and was/were',
    passage: { title: 'Brother Cooks', text: 'My big brother can cook. Today he will cook food for us. He looks in a book. He gets a pot and a spoon. Soon the room smells good. What do you think he made? Soup!', questions: [{ q: 'What did the brother look in?', a: 'A book' }, { q: 'What did he make?', a: 'Soup' }] },
  },
  {
    week: 27, title: 'Diphthongs: ou and ow (cow)', graphemes: [], pattern: 'ou / ow',
    words: ['out', 'house', 'cloud', 'shout', 'cow', 'town', 'brown', 'crown'],
    hfw: ['four', 'door', 'floor'], spelling: ['out', 'house', 'cloud', 'cow', 'town', 'brown'],
    sentences: ['Four brown cows went out the door.', 'The crown is on the floor.'],
    comprehension: 'Who is telling the story?', grammar: 'Prepositions: in, on, under, behind',
    passage: { title: 'The Cow in Town', text: 'I saw a brown cow in town! It came out of a house. It walked down the road and stood under a cloud of dust. People began to shout. A farmer came and took the cow home.', questions: [{ q: 'Who is telling the story?', a: 'A person who saw the cow ("I")' }, { q: 'Where did the cow come from?', a: 'Out of a house' }] },
  },
  {
    week: 28, title: 'Diphthongs: oi and oy', graphemes: [], pattern: 'oi / oy',
    words: ['coin', 'oil', 'point', 'soil', 'boy', 'toy', 'joy', 'enjoy'], sortWith: { label: 'oy', words: ['boy', 'toy', 'joy', 'enjoy'] },
    hfw: ['move', 'early', 'enough'], spelling: ['coin', 'oil', 'soil', 'boy', 'toy', 'joy'],
    sentences: ['The boy had enough coins for a toy.', 'Plants grow in the soil.'],
    comprehension: 'Lessons in stories: what did the character learn?', grammar: 'Conjunctions: and, but, so',
    passage: { title: 'Roy’s Coins', text: 'Roy saved his coins in a jar. He wanted a toy truck. One day, he saw a boy who had no lunch. Roy used his coins to buy the boy lunch. The boy smiled. Roy felt joy. He could save again for the toy.', questions: [{ q: 'What did Roy want to buy?', a: 'A toy truck' }, { q: 'What did Roy learn?', a: 'Giving brings joy' }] },
  },
  {
    week: 29, title: 'aw and au', graphemes: [], pattern: 'aw / au',
    words: ['saw', 'paw', 'draw', 'straw', 'yawn', 'haul', 'launch', 'August'],
    hfw: ['whole', 'piece', 'half'], spelling: ['saw', 'paw', 'draw', 'straw', 'yawn', 'haul'],
    sentences: ['I can draw a whole cat.', 'Paul ate half a piece of toast.'],
    comprehension: 'Key details in pictures and words', grammar: 'Articles: a, an, the',
    passage: { title: 'Paul Draws', text: 'Paul likes to draw. He saw a cat with a hurt paw. He drew the whole cat on a piece of paper. Then he gave the picture to the cat’s owner. She said, "What an awesome drawing!"', questions: [{ q: 'What did Paul see?', a: 'A cat with a hurt paw' }, { q: 'Who did he give the picture to?', a: 'The cat’s owner' }] },
  },
  {
    week: 30, title: 'Compound Words', graphemes: [], pattern: 'compound words',
    words: ['sunset', 'cupcake', 'bathtub', 'raincoat', 'backpack', 'snowman', 'football', 'bedtime'],
    hfw: ['different', 'picture', 'country'], spelling: ['sunset', 'cupcake', 'bathtub', 'raincoat', 'backpack', 'bedtime'],
    sentences: ['Put your raincoat in your backpack.', 'We ate a cupcake at sunset.'],
    comprehension: 'Compare characters’ experiences', grammar: 'Capitalize dates and names of places',
    passage: { title: 'Bedtime', text: 'At sunset, it is almost bedtime. First, I hop in the bathtub. Then I put on my pajamas. I pack my backpack for the next day. Dad reads me a story, and we pray. Good night!', questions: [{ q: 'What does the child do first?', a: 'Hops in the bathtub' }, { q: 'What two things do they do with Dad?', a: 'Read a story and pray' }] },
  },
  {
    week: 31, title: 'Two-Syllable Words', graphemes: [], pattern: 'two-syllable closed',
    words: ['rabbit', 'napkin', 'muffin', 'kitten', 'basket', 'picnic', 'puppet', 'insect'],
    hfw: ['above', 'below', 'children'], spelling: ['rabbit', 'napkin', 'muffin', 'kitten', 'basket', 'picnic'],
    sentences: ['The children had a picnic.', 'A rabbit hid in the basket.'],
    comprehension: 'Use illustrations to describe characters and events', grammar: 'Exclamation points show strong feelings',
    passage: { title: 'The Picnic', text: 'The children had a picnic. They had muffins in a basket. A kitten came to sniff the napkins. Then a rabbit hopped by! The kitten ran after the rabbit. What a fun picnic!', questions: [{ q: 'What was in the basket?', a: 'Muffins' }, { q: 'What did the kitten do?', a: 'Sniffed the napkins and chased the rabbit' }] },
  },
  {
    week: 32, title: 'Contractions', graphemes: [], pattern: 'contractions',
    words: ["can't", "don't", "it's", "I'm", "isn't", "we're", "she's", "let's"],
    hfw: ['wear', 'question', 'thought'], spelling: ["can't", "don't", "it's", "I'm", "isn't", "let's"],
    sentences: ["Let's go! It's time.", "I can't find my hat, but I'm not sad."],
    comprehension: 'Questions and answers: find the answer in the text', grammar: 'Contractions use an apostrophe',
    passage: { title: "Let's Go!", text: "\"Let's go to the park!\" said Mom. \"I can't find my shoes,\" said Ben. \"They're by the door,\" said Kim. \"I'm ready!\" said Ben. \"It's a sunny day,\" said Mom. \"We're going to have fun!\"", questions: [{ q: 'Where are they going?', a: 'To the park' }, { q: 'Where were Ben’s shoes?', a: 'By the door' }] },
  },
  {
    week: 33, title: 'Prefixes: un- and re-', graphemes: [], pattern: 'prefixes un- re-',
    words: ['unlock', 'unpack', 'unhappy', 'undo', 'redo', 'reread', 'refill', 'retell'], sortWith: { label: 're- (again)', words: ['redo', 'reread', 'refill', 'retell'] },
    hfw: ['work', 'word', 'world'], spelling: ['unlock', 'unpack', 'unhappy', 'redo', 'reread', 'refill'],
    sentences: ['I will reread the book.', 'Please unpack your bag.'],
    comprehension: 'Use words and pictures to retell', grammar: 'Prefixes change word meaning',
    passage: { title: 'The Unhappy Puppy', text: 'The puppy was unhappy. Its water bowl was empty. Sam saw the bowl and said, "I will refill it!" He refilled the bowl. The puppy drank and drank. Now the puppy is not unhappy. It is happy!', questions: [{ q: 'Why was the puppy unhappy?', a: 'Its water bowl was empty' }, { q: 'What does "refill" mean?', a: 'Fill again' }] },
  },
  {
    week: 34, title: 'Suffixes: -er, -est, -ful', graphemes: [], pattern: 'suffixes -er -est -ful',
    words: ['taller', 'tallest', 'faster', 'fastest', 'helpful', 'thankful', 'playful', 'colder'],
    hfw: ['earth', 'heard', 'idea'], spelling: ['taller', 'tallest', 'faster', 'fastest', 'helpful', 'thankful'],
    sentences: ['Dad is taller than me.', 'I am thankful for my helpful sister.'],
    comprehension: 'Compare and contrast facts', grammar: 'Comparing with -er and -est',
    passage: { title: 'Tall, Taller, Tallest', text: 'A pine tree is tall. A barn is taller. A mountain is the tallest of all! God made the earth with big and small things. I am thankful for all of them.', questions: [{ q: 'Which is the tallest?', a: 'The mountain' }, { q: 'What is the child thankful for?', a: 'All the things God made' }] },
  },
  {
    week: 35, title: 'Review: Words and Word Parts', graphemes: [], pattern: 'review', review: true,
    words: ['unhappy', 'quickest', 'raincoat', "don't", 'thankful', 'retell', 'sunset', 'faster'],
    hfw: ['review'], spelling: ['raincoat', 'sunset', "don't", 'retell', 'thankful', 'faster'],
    sentences: ["Don't forget your raincoat.", 'Can you retell the story?'],
    comprehension: 'Retell and give an opinion with a reason', grammar: 'Review: capitals, punctuation, spelling',
    passage: { title: 'The Thankful Farmer', text: 'A farmer planted seeds in the spring. It did not rain, and the farmer was unhappy. He prayed. Then the rain came! The plants grew faster. At harvest time, the farmer was thankful. He shared his food with his neighbors.', questions: [{ q: 'Why was the farmer unhappy?', a: 'It did not rain' }, { q: 'What did he do after the harvest?', a: 'Shared his food with neighbors' }, { q: 'Did you like this story? Why?', a: 'Any answer with a reason' }] },
  },
  {
    week: 36, title: 'Fluency Celebration', graphemes: [], pattern: 'fluency', review: true,
    words: ['celebrate', 'reader', 'thankful', 'grown', 'strong', 'brightest', 'wonderful', 'growing'],
    hfw: ['review'], spelling: ['reader', 'strong', 'grown', 'growing', 'brightest', 'thankful'],
    sentences: ['I am a strong reader!', 'This year I have grown.'],
    comprehension: 'Share a favorite book and explain why', grammar: 'Write a paragraph: topic sentence + details',
    passage: { title: 'I Have Grown', text: 'This year I have grown taller and stronger. I learned to read long words. I learned to add and subtract. I learned that God made me wonderfully. Next year I will keep growing. I am thankful!', questions: [{ q: 'Name two things the child learned.', a: 'Any two: read long words, add and subtract, God made me wonderfully' }, { q: 'How does the child feel?', a: 'Thankful' }] },
  },
]

function buildFirst(): LiteracyWeek[] {
  return F_WEEKS.map((f) => ({
    ...f,
    grade: '1st' as const,
    phono: F_PHONO(f.week),
    handwriting:
      f.handwriting ??
      (f.week <= 12
        ? 'Lowercase letters sit on the line; tall letters touch the top line'
        : f.week <= 24
          ? 'Capital letters and spacing between words'
          : 'Neat copywork of a full sentence'),
    writing:
      f.writing ??
      (f.week <= 9
        ? 'Write one complete sentence about this week’s story'
        : f.week <= 18
          ? 'Write two sentences: one that tells and one that asks'
          : f.week <= 27
            ? 'Write three sentences in order: first, next, last'
            : 'Write a short paragraph with a topic sentence and two details'),
  }))
}

export const LITERACY: Record<Grade, LiteracyWeek[]> = {
  'pre-k': buildPreK(),
  k: buildK(),
  '1st': buildFirst(),
}

export function getLiteracyWeek(grade: Grade, week: number): LiteracyWeek {
  const list = LITERACY[grade]
  return list.find((l) => l.week === week) ?? list[list.length - 1]
}

/** All letters/patterns introduced up to and including `week`. */
export function graphemesTaughtThrough(grade: Grade, week: number): string[] {
  const seen = new Set<string>()
  for (const l of LITERACY[grade]) {
    if (l.week > week) break
    if (!l.review) l.graphemes.forEach((g) => seen.add(g))
  }
  return [...seen]
}
