import { getBibleWeek } from './bible'
import { getEnrichment } from './enrichment'
import { getLiteracyWeek } from './literacy'
import type { Grade, LessonDay } from './types'

/**
 * Language-building strand (receptive and expressive language), switched on per
 * child in their learning profile. Ten minutes a day, mostly talk, movement,
 * games, and role-play — not worksheets.
 *
 * The same skills come back in different contexts (the Bible story, the
 * reading passage, science, everyday life) and grow in difficulty across the
 * year: 1-step → 2-step → 3-step directions; 3 → 4 → 5 events to sequence;
 * "what happened" → "why" → "what clues helped you know".
 */

export type LanguageStrand =
  | 'wh-questions'
  | 'directions'
  | 'vocabulary'
  | 'describing'
  | 'sentences'
  | 'sequencing'
  | 'retelling'
  | 'cause-effect'
  | 'prediction'
  | 'inference'
  | 'compare'
  | 'explaining'

export const STRAND_LABEL: Record<LanguageStrand, string> = {
  'wh-questions': 'Who / what / where / when / why / how questions',
  directions: 'Following and giving directions',
  vocabulary: 'Vocabulary',
  describing: 'Describing objects, pictures, and experiences',
  sentences: 'Building sentences',
  sequencing: 'Sequencing events',
  retelling: 'Retelling stories',
  'cause-effect': 'Cause and effect',
  prediction: 'Predicting what happens next',
  inference: 'Inferring: using clues',
  compare: 'Alike and different',
  explaining: 'Explaining my thinking',
}

export const STRANDS = Object.keys(STRAND_LABEL) as LanguageStrand[]

export function languageSkillId(strand: LanguageStrand) {
  return `lang-${strand}`
}

/** Focus for each week, plus a strand that comes back for review. */
const PLAN: { focus: LanguageStrand; review: LanguageStrand }[] = [
  // Unit 1 — weeks 1–9: who/what/where, describing, 1–2 step directions, sequencing 3 events
  { focus: 'wh-questions', review: 'vocabulary' },
  { focus: 'describing', review: 'wh-questions' },
  { focus: 'vocabulary', review: 'describing' },
  { focus: 'sentences', review: 'wh-questions' },
  { focus: 'sequencing', review: 'sentences' },
  { focus: 'describing', review: 'sequencing' },
  { focus: 'wh-questions', review: 'directions' },
  { focus: 'sequencing', review: 'describing' },
  { focus: 'retelling', review: 'sentences' },
  // Unit 2 — weeks 10–18: when/why, sentences with "and"/"because", retelling, cause and effect
  { focus: 'wh-questions', review: 'retelling' },
  { focus: 'sentences', review: 'vocabulary' },
  { focus: 'cause-effect', review: 'wh-questions' },
  { focus: 'describing', review: 'sentences' },
  { focus: 'retelling', review: 'cause-effect' },
  { focus: 'cause-effect', review: 'sequencing' },
  { focus: 'prediction', review: 'describing' },
  { focus: 'sequencing', review: 'cause-effect' },
  { focus: 'retelling', review: 'prediction' },
  // Unit 3 — weeks 19–27: how questions, prediction, inference, alike/different, 4 events
  { focus: 'wh-questions', review: 'retelling' },
  { focus: 'compare', review: 'vocabulary' },
  { focus: 'prediction', review: 'compare' },
  { focus: 'inference', review: 'wh-questions' },
  { focus: 'compare', review: 'cause-effect' },
  { focus: 'cause-effect', review: 'inference' },
  { focus: 'explaining', review: 'sequencing' },
  { focus: 'inference', review: 'retelling' },
  { focus: 'retelling', review: 'explaining' },
  // Unit 4 — weeks 28–36: inference with clues, explaining, 5-event retell, 3-step directions
  { focus: 'explaining', review: 'wh-questions' },
  { focus: 'inference', review: 'compare' },
  { focus: 'describing', review: 'inference' },
  { focus: 'cause-effect', review: 'explaining' },
  { focus: 'compare', review: 'retelling' },
  { focus: 'explaining', review: 'cause-effect' },
  { focus: 'prediction', review: 'inference' },
  { focus: 'retelling', review: 'explaining' },
  { focus: 'explaining', review: 'retelling' },
]

/** Three words per week from the Bible story and science, taught with a picture or an action. */
const VOCAB: string[][] = [
  ['create', 'light', 'living'],
  ['image', 'special', 'senses'],
  ['wonderful', 'unique', 'need'],
  ['faithful', 'worship', 'group'],
  ['family', 'helper', 'body'],
  ['disobey', 'sorry', 'promise'],
  ['obey', 'build', 'weather'],
  ['thankful', 'remind', 'season'],
  ['honor', 'respect', 'journal'],
  ['journey', 'trust', 'soil'],
  ['believe', 'covenant', 'sparkle'],
  ['impossible', 'laugh', 'force'],
  ['dream', 'ladder', 'slope'],
  ['jealous', 'prison', 'float'],
  ['forgive', 'choose', 'shadow'],
  ['protect', 'brave', 'vibrate'],
  ['remember', 'strange', 'safety'],
  ['afraid', 'rescue', 'melt'],
  ['manger', 'shepherd', 'hibernate'],
  ['follow', 'gift', 'distance'],
  ['grow', 'baptize', 'change'],
  ['disciple', 'fishermen', 'gills'],
  ['neighbor', 'mercy', 'germs'],
  ['calm', 'storm', 'breeze'],
  ['share', 'crowd', 'healthy'],
  ['sacrifice', 'love', 'sprout'],
  ['risen', 'tomb', 'bloom'],
  ['pray', 'daily', 'root'],
  ['power', 'courage', 'life cycle'],
  ['peace', 'joy', 'invisible'],
  ['patient', 'gentle', 'seed'],
  ['armor', 'shield', 'insect'],
  ['kind', 'boast', 'nest'],
  ['serve', 'humble', 'recycle'],
  ['tell', 'nations', 'reflect'],
  ['grace', 'grateful', 'discover'],
]

const OBJECTS = ['the red cup', 'your shoes', 'a book', 'the spoon', 'two blocks', 'the pillow', 'a crayon', 'the toy car', 'a sock', 'the ball']
const PLACES = ['on the table', 'under the chair', 'next to the door', 'in the basket', 'behind the couch', 'on your bed', 'between the two pillows', 'by the window']
const ACTIONS = ['jump 3 times', 'clap twice', 'touch your nose', 'spin around once', 'sit down', 'hop on one foot', 'give me a high five', 'walk like a bear to me']

const at = <T,>(list: T[], n: number) => list[((n % list.length) + list.length) % list.length]

function directions(week: number, day: number): string[] {
  const s = week * 7 + day
  const one = (k: number) => `"Put ${at(OBJECTS, s + k)} ${at(PLACES, s + k * 3)}."`
  if (week <= 6) return [one(0), `"${capitalize(at(ACTIONS, s))}."`, one(1)]
  if (week <= 18) return [
    `"Put ${at(OBJECTS, s)} ${at(PLACES, s + 1)}, then ${at(ACTIONS, s)}."`,
    `"${capitalize(at(ACTIONS, s + 2))}, and then bring me ${at(OBJECTS, s + 3)}."`,
    `"Put ${at(OBJECTS, s + 4)} ${at(PLACES, s + 5)}, then ${at(ACTIONS, s + 1)}."`,
  ]
  if (week <= 27) return [
    `"Before you ${at(ACTIONS, s)}, put ${at(OBJECTS, s + 1)} ${at(PLACES, s + 2)}."`,
    `"After you ${at(ACTIONS, s + 3)}, bring me ${at(OBJECTS, s + 2)}."`,
    `"Put ${at(OBJECTS, s + 5)} ${at(PLACES, s + 4)}, then ${at(ACTIONS, s + 5)}."`,
  ]
  return [
    `"Put ${at(OBJECTS, s)} ${at(PLACES, s + 1)}, ${at(ACTIONS, s + 2)}, and then bring me ${at(OBJECTS, s + 3)}."`,
    `"${capitalize(at(ACTIONS, s + 4))}, put ${at(OBJECTS, s + 5)} ${at(PLACES, s + 2)}, and then sit down."`,
    `"Before you ${at(ACTIONS, s + 1)}, put ${at(OBJECTS, s + 2)} ${at(PLACES, s + 6)} and bring me ${at(OBJECTS, s + 7)}."`,
  ]
}
const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

export const STARTERS: Record<LanguageStrand, string[]> = {
  'wh-questions': ['The person is ___.', 'They are at ___.', 'It happened when ___.', 'It happened because ___.'],
  directions: ['First I ___, then I ___.', 'You said to ___.'],
  vocabulary: ['___ means ___.', 'I can use ___ in a sentence: ___.'],
  describing: ['It is ___ (color / size / shape).', 'It feels ___.', 'We use it to ___.', 'You find it in the ___.'],
  sentences: ['___ is ___-ing ___.', '___ and ___ ___.', '___ because ___.'],
  sequencing: ['First ___.', 'Next ___.', 'Then ___.', 'Last ___.'],
  retelling: ['This story is about ___.', 'At the beginning ___.', 'The problem was ___.', 'At the end ___.'],
  'cause-effect': ['___ happened because ___.', 'Because ___, ___.', 'If ___, then ___.'],
  prediction: ['I think ___ will happen because ___.', 'I predict ___.'],
  inference: ['I think ___.', 'The clue that helped me is ___.', 'I know because ___.'],
  compare: ['They are alike because ___.', 'They are different because ___.', 'Both ___.', 'Only one ___.'],
  explaining: ['First I ___. Then I ___.', 'I know it is right because ___.', 'My idea is ___ because ___.'],
}

const THURSDAY: Record<LanguageStrand, (c: Ctx) => string[]> = {
  'wh-questions': (c) => [`Question cards: write WHO, WHAT, WHERE, WHEN, WHY, HOW on six cards. Take turns drawing a card and asking a question about ${c.bible}. Child answers, then asks you one.`],
  directions: (c) => [`Obstacle course: give the directions, child follows; then child gives YOU directions. ${c.week >= 28 ? 'Use 3 steps.' : c.week >= 7 ? 'Use 2 steps.' : 'One step at a time.'}`],
  vocabulary: (c) => [`Act it out: act each word (${c.vocab.join(', ')}); the other person guesses. Then use each word in a sentence about your own day.`],
  describing: () => ['Mystery bag: put an object in a bag. Describe it without saying its name — color, size, shape, how it feels, what it is used for, where we find it. The other person guesses. Switch roles.'],
  sentences: (c) => [`Sentence builder: make word cards for WHO (Mom, the dog, ${c.name}), DOING (runs, eats, builds), WHAT/WHERE (an apple, at the park). Build a sentence, read it, then change one card to make a new one.`, c.week >= 10 ? 'Make it longer with "and" or "because".' : 'Start with who + doing.'],
  sequencing: () => ['Real-life sequence: make a snack together (sandwich, cereal). Take a photo or draw a quick picture of each step. Mix up the pictures; child puts them in order and tells the steps.'],
  retelling: (c) => [`Puppet retell: use toys or paper puppets to retell ${c.bible}. Use a story map: who, where, the problem, what happened, the ending.`],
  'cause-effect': (c) => [`Science cause and effect (${c.science}): do one small test together (roll a car down a ramp, drop things in water, shine a flashlight). Before and after each test say: "Because ___, ___ happened."`],
  prediction: () => ['Read-aloud pause: read a picture book and stop before the end of each page. Ask: "What do you think will happen next? Why do you think that?" Then read to check.'],
  inference: () => ['Clue detective: set up a little scene — a wet umbrella by the door, crumbs on a plate, muddy shoes. Ask: "What happened here? What clues helped you know?"'],
  compare: () => ['Alike and different: choose two things (an apple and an orange, a fork and a spoon). Sort what you notice into two piles: "both" and "only one." Then say a sentence for each pile.'],
  explaining: (c) => [`Teach-back: ${c.name} teaches a puppet or sibling how to do something — a math problem from this week, brushing teeth, or making a bed — step by step. The listener asks "Why?" once.`],
}

interface Ctx {
  week: number
  name: string
  bible: string
  science: string
  vocab: string[]
}

export interface LanguageDay {
  focus: LanguageStrand
  review: LanguageStrand
  title: string
  vocab: string[]
  activity: 'discussion' | 'movement' | 'hands-on' | 'review'
  steps: string[]
  starters: string[]
  /** Picture/visual support for this activity. */
  visual: string
  check: string
  minimum: string
}

/** Events to sequence on review day: grows from 3 to 5 across the year. */
const eventsFor = (week: number) => (week <= 9 ? 3 : week <= 27 ? 4 : 5)

export function languageDay(week: number, day: LessonDay, name = 'your child', literacyGrade: Grade = '1st'): LanguageDay {
  const w = Math.min(Math.max(week, 1), 36)
  const plan = PLAN[w - 1]
  const b = getBibleWeek(w)
  const sci = getEnrichment(w).science
  const lw = getLiteracyWeek(literacyGrade, w)
  const vocab = VOCAB[w - 1]
  const ctx: Ctx = { week: w, name, bible: `"${b.title}"`, science: sci.title, vocab }
  const focusLabel = STRAND_LABEL[plan.focus]
  const starters = STARTERS[plan.focus]

  switch (day) {
    case 0:
      return {
        ...plan,
        title: `Picture talk: ${b.title}`,
        vocab,
        activity: 'discussion',
        steps: [
          `Show a picture of ${b.title} (from a children’s Bible or a simple drawing). Say: "Look at the picture. What is happening?" Wait 10 seconds before helping.`,
          `Ask the WH questions one at a time: Who is in the picture? What are they doing? Where are they?${w >= 10 ? ' Why do you think they are doing that?' : ''}${w >= 19 ? ' How do you think they feel? What clue tells you?' : ''}`,
          `New words: ${vocab.join(', ')}. Say each word, show it (picture or action), use it in a sentence, and have ${name} say it back in a sentence.`,
          `Focus this week — ${focusLabel}: ${focusPrompt(plan.focus, b.title, w)}`,
        ],
        starters,
        visual: 'Use the picture the whole time. Offer two picture choices if an answer does not come ("Is he in a boat or a house?").',
        check: `Answers who / what / where about the picture in a full sentence${w >= 10 ? ', and gives a "because" for why' : ''}.`,
        minimum: `Look at a picture of ${b.title}. Ask "Who? What are they doing? Where?" Help with a sentence starter.`,
      }
    case 1:
      return {
        ...plan,
        title: `Listen and do: ${w >= 28 ? '3-step' : w >= 7 ? '2-step' : '1-step'} directions`,
        vocab,
        activity: 'movement',
        steps: [
          `Get ${name}’s attention first (say the name, wait for eyes or a nod). Say the direction once, slowly. Wait.`,
          ...directions(w, 1).map((d, i) => `Direction ${i + 1}: ${d}`),
          'If a step is missed, say only the missed part again and show it with a gesture. Then fade the gesture.',
          `Switch: ${name} gives YOU a direction. Use a word from this week: ${vocab[0]}.`,
        ],
        starters: STARTERS.directions,
        visual: 'Hold up one finger per step while you say the direction. For a hard day, draw quick picture cards for each step.',
        check: `Follows ${w >= 28 ? 'a 3-step' : w >= 7 ? 'a 2-step' : 'a 1-step'} direction after hearing it once.`,
        minimum: `Give one ${w >= 7 ? '2-step' : '1-step'} direction during a chore: ${directions(w, 1)[0]}`,
      }
    case 2:
      return {
        ...plan,
        title: `${focusLabel}: game time`,
        vocab,
        activity: plan.focus === 'retelling' || plan.focus === 'describing' || plan.focus === 'sentences' ? 'hands-on' : plan.focus === 'directions' ? 'movement' : 'hands-on',
        steps: [...THURSDAY[plan.focus](ctx), `Use this week’s words if they fit: ${vocab.join(', ')}.`],
        starters,
        visual: 'Model one turn first so the child hears exactly what a good answer sounds like.',
        check: checkFor(plan.focus, w),
        minimum: THURSDAY[plan.focus](ctx)[0],
      }
    case 3:
    default: {
      const n = eventsFor(w)
      const passage = lw.passage
      return {
        ...plan,
        title: `Retell and check: ${b.title}`,
        vocab,
        activity: 'review',
        steps: [
          `Sequence: draw ${n} quick pictures (stick figures are fine) of what happened in ${b.title}. Mix them up. ${name} puts them in order and tells the story using first, next, then, last.`,
          passage
            ? `Reading check — "${passage.title}": after it is read (by the child or by you), ask the questions one at a time: ${passage.questions.map((q) => `"${q.q}"`).join(' ')} Reading it is not the same as understanding it — ask, and have the child point to the place in the story that shows the answer.`
            : `Listening check: read the sentences from this week’s reading aloud. Ask one who, one what, and one why question about them.`,
          `Review — ${STRAND_LABEL[plan.review]}: ${focusPrompt(plan.review, b.title, w)}`,
          `Vocabulary check: "Tell me what ${vocab[1]} means. Use it in a sentence."`,
        ],
        starters: STARTERS.sequencing,
        visual: `${n} picture cards for the retell. Offer two answer choices for any question that is hard ("Was it Peter or Paul?").`,
        check: `Retells ${n} events in order and answers comprehension questions with a full sentence. Mark the focus skill in Progress.`,
        minimum: `Retell ${b.title} in ${Math.min(n, 3)} parts: first, next, last.`,
      }
    }
  }
}

function focusPrompt(s: LanguageStrand, title: string, week: number): string {
  switch (s) {
    case 'wh-questions':
      return week >= 19 ? 'Ask a "how" question and a "why" question about the story.' : week >= 10 ? 'Ask "when" and "why" questions about the story.' : 'Ask "who," "what," and "where."'
    case 'directions':
      return 'Give one direction about the picture: "Point to the person who is ___, then point to ___."'
    case 'vocabulary':
      return 'Sort this week’s words: which ones are things, which are actions, which are feelings?'
    case 'describing':
      return 'Pick one thing in the picture. Describe it with three details without naming it; I will guess.'
    case 'sentences':
      return `Make a sentence about the picture with who + doing + where${week >= 10 ? ', then make it longer with "because"' : ''}.`
    case 'sequencing':
      return `What happened first in ${title}? What happened next? What happened last?`
    case 'retelling':
      return 'Tell me the story as if I have never heard it.'
    case 'cause-effect':
      return 'What happened? Why did it happen? Say "___ because ___."'
    case 'prediction':
      return 'Before reading on: what do you think happens next? Why?'
    case 'inference':
      return 'How do you think the person feels? What clue in the picture tells you?'
    case 'compare':
      return 'Compare two people in the story: how are they alike? How are they different?'
    case 'explaining':
      return 'Tell me what you think the lesson of the story is — and why you think so.'
  }
}

function checkFor(s: LanguageStrand, week: number): string {
  switch (s) {
    case 'describing':
      return 'Gives 3 details (color, size, use…) so someone else can guess the object.'
    case 'sentences':
      return `Builds and says a complete sentence${week >= 10 ? ' that uses "and" or "because"' : ''}.`
    case 'cause-effect':
      return 'Says what happened and why with "because."'
    case 'prediction':
      return 'Makes a prediction and gives a reason.'
    case 'inference':
      return 'Makes a good guess and names the clue that helped.'
    case 'compare':
      return 'Names one way two things are alike and one way they are different.'
    case 'explaining':
      return 'Explains the steps in order and says why it works.'
    case 'retelling':
      return 'Retells with a beginning, a problem, and an ending.'
    case 'sequencing':
      return 'Puts the pictures in order and uses first / next / then / last.'
    default:
      return 'Answers in a full sentence with little help.'
  }
}
