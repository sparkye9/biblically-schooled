import { getBibleWeek } from '../curriculum/bible'
import { getLiteracyWeek, graphemesTaughtThrough, type LiteracyWeek } from '../curriculum/literacy'
import { grapheme } from '../curriculum/phonics'
import { PICTURES, RHYME_PAIRS, pictureByWord, picturesStartingWith } from '../curriculum/pictures'
import type { Grade } from '../curriculum/types'
import type { GenOut } from './math-gen'
import type { Rng } from './rng'
import { NAME_PLACEHOLDER, type Block } from './types'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

/** c and k (and ck) share /k/ — never use one as a "wrong" answer for the other. */
export function sameSound(a: string, b: string): boolean {
  if (a === b) return true
  try {
    return grapheme(a).sound === grapheme(b).sound
  } catch {
    return false
  }
}

/** Letters (single graphemes) with at least `min` unambiguous pictures. */
function pictureLetters(min = 1) {
  return ALPHABET.filter((l) => picturesStartingWith(l).length >= min)
}

function traceRowsFor(g: string): string[] {
  if (g.length > 1) return [`${g} ${g} ${g} ${g}`, `${g[0].toUpperCase()}${g.slice(1)} ${g[0].toUpperCase()}${g.slice(1)} ${g[0].toUpperCase()}${g.slice(1)}`]
  return [`${g.toUpperCase()} ${g.toUpperCase()} ${g.toUpperCase()} ${g.toUpperCase()} ${g.toUpperCase()}`, `${g} ${g} ${g} ${g} ${g} ${g}`]
}

/** "Circle the letter it starts with" items using real picture first-sounds. */
function beginningSoundItems(r: Rng, targets: string[], distractorPool: string[], n: number) {
  const items: { picture: string; choices: string[]; answer: string }[] = []
  const usable = targets.filter((t) => picturesStartingWith(t).length > 0)
  const used = new Set<string>()
  let guard = 0
  while (items.length < n && usable.length && guard++ < 100) {
    const t = usable[items.length % usable.length]
    const pics = picturesStartingWith(t).filter((p) => !used.has(p.word))
    if (!pics.length) {
      usable.splice(usable.indexOf(t), 1)
      continue
    }
    const pic = r.pick(pics)
    used.add(pic.word)
    const distractors = r.sample(distractorPool.filter((d) => !sameSound(d, t) && d.length === 1), 2)
    if (distractors.length < 2) continue
    items.push({ picture: pic.icon, choices: r.shuffle([t, ...distractors]), answer: t })
  }
  return items
}

function letterGrid(r: Rng, target: string, pool: string[]): Block {
  const others = pool.filter((p) => p !== target && p.length === 1)
  const k = r.int(5, 7)
  const letters = r.shuffle([
    ...Array.from({ length: k }, (_, i) => (i % 2 ? target : target.toUpperCase())),
    ...Array.from({ length: 24 - k }, () => {
      const o = r.pick(others.length ? others : ['b', 'd', 'k'])
      return r.next() < 0.5 ? o : o.toUpperCase()
    }),
  ])
  return { type: 'letter-grid', target, letters }
}

function upperLowerMatch(r: Rng, letters: string[]): { block: Block; answers: string[] } {
  const picked = r.sample(letters.filter((l) => l.length === 1), 5)
  const order = r.shuffle(picked.map((_, i) => i))
  return {
    block: {
      type: 'match',
      left: picked.map((l) => ({ text: l.toUpperCase() })),
      right: order.map((i) => ({ text: picked[i] })),
      pairs: picked.map((_, i) => [i, order.indexOf(i)] as [number, number]),
    },
    answers: picked.map((l) => `${l.toUpperCase()} — ${l}`),
  }
}

function cvcPictures(allowed: Set<string>) {
  return PICTURES.filter((p) => p.cvc && p.word.split('').every((c) => allowed.has(c)))
}

// ───────────────────────────── PRE-K ─────────────────────────────

function prekLiteracy(lw: LiteracyWeek, day: number, r: Rng): GenOut {
  const g = lw.graphemes[0]
  const taught = graphemesTaughtThrough('pre-k', lw.week).filter((x) => x.length === 1)
  const pool = taught.length >= 4 ? taught : ['m', 's', 'a', 't', 'p', 'b', 'o', 'c']

  if (lw.pattern === 'name') {
    return {
      blocks: [
        { type: 'trace', rows: [NAME_PLACEHOLDER, NAME_PLACEHOLDER, NAME_PLACEHOLDER], size: 'lg', label: 'Trace your name.' },
        { type: 'draw', label: 'Draw yourself!', height: 'lg' },
      ],
      answers: ['Name traced; self-portrait drawn.'],
      instructions: 'Trace your name, starting each letter at the top. Then draw a picture of yourself.',
      activity: 'Name tracing',
    }
  }

  if (lw.pattern === 'letter' && g) {
    if (day === 1) {
      const pics = picturesStartingWith(g)
      const second: Block =
        pics.length >= 2
          ? {
              type: 'sort',
              cut: false,
              columns: [`Starts with ${grapheme(g).sound}`, 'Does not'],
              items: r.shuffle([
                ...r.sample(pics, 2).map((p) => ({ picture: p.icon, column: 0 })),
                ...r
                  .sample(PICTURES.filter((p) => p.first.length === 1 && !sameSound(p.first, g)), 2)
                  .map((p) => ({ picture: p.icon, column: 1 })),
              ]),
            }
          : letterGrid(r, g, pool)
      return {
        blocks: [{ type: 'trace', rows: traceRowsFor(g), size: 'xl', label: `Trace ${g.toUpperCase()} and ${g}.` }, second],
        answers: [
          `Traced ${g.toUpperCase()}${g}.`,
          second.type === 'sort'
            ? `Starts with ${g}: ${second.items.filter((i) => i.column === 0).map((i) => i.picture).join(', ')}`
            : `Circle every ${g} / ${g.toUpperCase()}.`,
        ],
        instructions:
          second.type === 'sort'
            ? `Trace the letters. Then draw a line from each picture to the right box: starts with ${grapheme(g).sound} or not.`
            : `Trace the letters. Then circle every ${g.toUpperCase()} and ${g}.`,
        activity: 'Tracing & sound',
      }
    }
    // day 3 review
    const others = pool.filter((p) => p !== g)
    const items = beginningSoundItems(r, [g, ...r.sample(others, 2)], pool, 3)
    return {
      blocks: [letterGrid(r, g, pool), ...(items.length >= 2 ? [{ type: 'picture-choice' as const, prompt: 'Say the picture name. Circle the first sound.', items }] : [])],
      answers: [`Grid: every ${g.toUpperCase()} and ${g}.`, ...items.map((it, i) => `${i + 1}. ${it.answer}`)],
      instructions: `Find and circle every ${g.toUpperCase()} and ${g}. Then say each picture and circle its first letter.`,
      activity: 'Letter find',
    }
  }

  // Consolidation & review weeks — rotate formats so weeks don't repeat.
  const letters = lw.graphemes.length ? lw.graphemes.filter((x) => x.length === 1) : pool
  if (lw.pattern === 'rhyming') {
    const pairs = r.sample(RHYME_PAIRS, 4)
    const order = r.shuffle(pairs.map((_, i) => i))
    return {
      blocks: [{ type: 'match', left: pairs.map(([a]) => ({ picture: pictureByWord.get(a)!.icon })), right: order.map((i) => ({ picture: pictureByWord.get(pairs[i][1])!.icon })), pairs: pairs.map((_, i) => [i, order.indexOf(i)] as [number, number]) }],
      answers: pairs.map(([a, b]) => `${a} — ${b}`),
      instructions: 'Say the names of the pictures. Draw a line to match the pictures that rhyme.',
      activity: 'Rhyme matching',
    }
  }
  if (lw.pattern === 'syllables') {
    const items = r.sample(PICTURES.filter((p) => p.syllables <= 3 && p.first !== 'e-long'), 5).map((p) => ({ picture: p.icon, syllables: p.syllables }))
    return {
      blocks: [{ type: 'syllables', items }],
      answers: items.map((it, i) => `${i + 1}. ${it.syllables}`),
      instructions: 'Say the picture name and clap the parts. Color one box for each clap.',
      activity: 'Clap syllables',
    }
  }
  if (lw.pattern === 'beginning sounds') {
    const cols = r.sample(letters.filter((l) => picturesStartingWith(l).length >= 2), 2)
    const items = r.shuffle(cols.flatMap((c, ci) => r.sample(picturesStartingWith(c), 3).map((p) => ({ picture: p.icon, column: ci }))))
    return {
      blocks: [{ type: 'sort', cut: true, columns: cols.map((c) => `${c.toUpperCase()}${c}  ${grapheme(c).sound}`), items }],
      answers: cols.map((c, ci) => `${c}: ${items.filter((i) => i.column === ci).map((i) => i.picture).join(', ')}`),
      instructions: 'Cut out the pictures. Say each one. Glue it under the letter it starts with.',
      activity: 'Cut & paste sound sort',
      cutAndPaste: true,
    }
  }
  if (lw.pattern === 'oral blending') {
    const pics = r.sample(cvcPictures(new Set(ALPHABET)), 4)
    return {
      blocks: [{ type: 'picture-choice', prompt: 'Grown-up says the sounds slowly (c–a–t). Child circles the picture.', items: pics.map((p) => ({ picture: p.icon, choices: [p.word.split('').join('–')], answer: p.word.split('').join('–') })) }],
      answers: pics.map((p, i) => `${i + 1}. ${p.word}`),
      instructions: 'Listen to the robot sounds. Point to the picture and say the whole word.',
      activity: 'Sound blending',
    }
  }
  if (day === 1 || lw.week === 30 || lw.week === 36) {
    const m = upperLowerMatch(r, letters.length >= 5 ? letters : ALPHABET)
    return { blocks: [m.block], answers: m.answers, instructions: 'Draw a line from each big letter to its little letter.', activity: 'Matching letters' }
  }
  const items = beginningSoundItems(r, letters, pool.length >= 4 ? pool : ALPHABET, 4)
  return {
    blocks: [{ type: 'picture-choice', prompt: 'Say the picture name. Circle the letter it starts with.', items }],
    answers: items.map((it, i) => `${i + 1}. ${it.answer}`),
    instructions: 'Say each picture name slowly. Circle the first sound.',
    activity: 'Beginning sounds',
  }
}

// ───────────────────────────── K & 1st ─────────────────────────────

function grammarBlock(lw: LiteracyWeek, r: Rng): { block: Block; answers: string[]; label: string } {
  const g = (lw.grammar ?? '').toLowerCase()
  const NOUNS = ['cat', 'dog', 'hat', 'bed', 'sun', 'cup', 'ship', 'fish', 'tent', 'frog']
  const VERBS = ['run', 'hop', 'sit', 'dig', 'jump', 'swim', 'nap', 'sing', 'clap', 'kick']
  const ADJS = ['big', 'red', 'hot', 'wet', 'sad', 'fast', 'soft', 'tall', 'glad', 'thin']
  const sortOf = (a: string[], b: string[], la: string, lb: string) => {
    const words = r.shuffle([...r.sample(a, 4).map((word) => ({ word, column: 0 as const })), ...r.sample(b, 4).map((word) => ({ word, column: 1 as const }))])
    return {
      block: { type: 'word-sort' as const, columns: [la, lb] as [string, string], words },
      answers: [`${la}: ${words.filter((w) => w.column === 0).map((w) => w.word).join(', ')}`, `${lb}: ${words.filter((w) => w.column === 1).map((w) => w.word).join(', ')}`],
      label: 'Word sort',
    }
  }
  const rewrite = (prompt: string, pairs: [string, string][], label: string) => {
    const chosen = r.sample(pairs, 5)
    return {
      block: { type: 'sentences' as const, prompt, items: chosen.map(([from, to]) => ({ text: `${from}  →  _________`, answer: to })) },
      answers: chosen.map(([from, to], i) => `${i + 1}. ${from} → ${to}`),
      label,
    }
  }
  if (g.includes('pronoun'))
    return rewrite('Write a pronoun (he, she, it, they, we) for the words.', [['Dad', 'he'], ['Mom', 'she'], ['the cat', 'it'], ['Mom and Dad', 'they'], ['my brother', 'he'], ['my sister', 'she'], ['the kids', 'they'], ['you and I', 'we'], ['the ship', 'it']], 'Pronouns')
  if (g.includes('plural') || g.includes('one and more'))
    return rewrite('Make each word mean MORE than one. Add -s or -es.', [['cat', 'cats'], ['box', 'boxes'], ['dish', 'dishes'], ['hen', 'hens'], ['fox', 'foxes'], ['bus', 'buses'], ['ship', 'ships'], ['bench', 'benches']], 'Plurals')
  if (g.includes('past'))
    return rewrite('Write each action word in the past. Add -ed.', [['jump', 'jumped'], ['play', 'played'], ['help', 'helped'], ['kick', 'kicked'], ['fill', 'filled'], ['rest', 'rested'], ['land', 'landed'], ['pick', 'picked']], 'Past tense')
  if (g.includes('comparing') || g.includes('-er'))
    return rewrite('Add -er or -est.', [['tall (two things)', 'taller'], ['tall (three things)', 'tallest'], ['fast (two things)', 'faster'], ['fast (three things)', 'fastest'], ['small (two things)', 'smaller'], ['cold (three things)', 'coldest'], ['long (two things)', 'longer']], 'Comparing words')
  if (g.includes('contraction'))
    return rewrite('Write the contraction.', [['do not', "don't"], ['can not', "can't"], ['I am', "I'm"], ['it is', "it's"], ['we are', "we're"], ['is not', "isn't"], ['let us', "let's"]], 'Contractions')
  if (g.includes('prefix'))
    return rewrite('Add un- (not) or re- (again) to make the meaning.', [['not happy', 'unhappy'], ['read again', 'reread'], ['not lock', 'unlock'], ['fill again', 'refill'], ['tell again', 'retell'], ['not pack', 'unpack']], 'Prefixes')
  if (g.includes('adjective')) return sortOf(NOUNS, ADJS, 'Naming words (nouns)', 'Describing words (adjectives)')
  if (g.includes('verb') && !g.includes('helping') && !g.includes('is/are')) return sortOf(NOUNS, VERBS, 'Naming words (nouns)', 'Action words (verbs)')
  if (g.includes('noun') && !g.includes('proper')) return sortOf(NOUNS, VERBS, 'Naming words (nouns)', 'Action words (verbs)')
  if (g.includes('question') || g.includes('ask') || g.includes('exclamation') || g.includes('punctuation') || g.includes('period') || g.includes('ends')) {
    const items = lw.sentences.map((s) => ({ text: s.replace(/[.?!"]+$/, '') + ' ___', answer: s.trim().slice(-1) === '"' ? s.trim().slice(-2, -1) : s.trim().slice(-1) }))
    return {
      block: { type: 'sentences', prompt: 'Add the end mark: . or ? or !', items },
      answers: items.map((it, i) => `${i + 1}. ${it.answer}`),
      label: 'End marks',
    }
  }
  // capitals, names, and everything else: copy the sentence correctly
  const items = lw.sentences.map((s) => ({ text: s.charAt(0).toLowerCase() + s.slice(1).replace(/[.?!]$/, ''), answer: s }))
  return {
    block: { type: 'sentences', prompt: 'Fix each sentence: capital letter at the start, end mark at the end. Write it on the line.', items },
    answers: items.map((it, i) => `${i + 1}. ${it.answer}`),
    label: 'Fix the sentence',
  }
}

function kFirstLiteracy(lw: LiteracyWeek, day: number, grade: Grade, r: Rng): GenOut {
  const taught = new Set(graphemesTaughtThrough(grade, lw.week).filter((x) => x.length === 1))
  if (grade === '1st') ALPHABET.forEach((a) => taught.add(a))
  const isLetters = lw.graphemes.length > 0 && !lw.review && lw.graphemes.every((x) => x.length <= 2)
  const hfw = lw.hfw.filter((w) => w !== 'review')

  if (day === 0) {
    if (isLetters && grade === 'k') {
      const items = beginningSoundItems(r, lw.graphemes.filter((x) => x.length === 1), [...taught], 3)
      return {
        blocks: [
          { type: 'trace', rows: lw.graphemes.flatMap((g) => traceRowsFor(g).slice(0, lw.graphemes.length > 2 ? 1 : 2)), size: lw.graphemes.length > 2 ? 'md' : 'lg', label: 'Trace the letters. Say the sound each time.' },
          ...(items.length ? [{ type: 'picture-choice' as const, prompt: 'Circle the first sound.', items }] : []),
          ...(hfw.length ? [{ type: 'trace' as const, rows: [hfw.join('   ')], size: 'md' as const, label: 'Trace the sight words.' }] : []),
        ],
        answers: items.map((it, i) => `${i + 1}. ${it.answer}`).concat(items.length ? [] : ['Tracing only.']),
        instructions: 'Trace each letter and say its sound. Circle the first sound of each picture.',
        activity: 'Tracing & sounds',
      }
    }
    return {
      blocks: [
        { type: 'word-list', words: lw.words },
        ...(grade === '1st' && lw.spelling ? [{ type: 'trace' as const, rows: [lw.spelling.slice(0, 3).join('   '), lw.spelling.slice(3).join('   ')], size: 'md' as const, label: 'Spelling words: trace, then write each one on your own paper.' }] : []),
        ...(hfw.length ? [{ type: 'trace' as const, rows: [hfw.join('    ')], size: 'md' as const, label: 'Sight words' }] : []),
      ],
      answers: ['Parent listens: child reads each word and checks the box.'],
      instructions: 'Read each word. Tap the sounds, then slide them together. Check the box when you read it.',
      activity: 'Read & check',
    }
  }

  if (day === 1) {
    if (grade === '1st' && lw.sortWith) {
      const mainWords = lw.words.filter((w) => !lw.sortWith!.words.includes(w)).slice(0, 4)
      const words = r.shuffle([...mainWords.map((word) => ({ word, column: 0 as const })), ...lw.sortWith.words.map((word) => ({ word, column: 1 as const }))])
      const mainLabel = lw.pattern.split('/')[0].trim()
      return {
        blocks: [{ type: 'word-sort', columns: [mainLabel, lw.sortWith.label], words }, { type: 'lines', count: 2, label: 'Write a sentence with one word from each side.' }],
        answers: [`${mainLabel}: ${words.filter((w) => w.column === 0).map((w) => w.word).join(', ')}`, `${lw.sortWith.label}: ${words.filter((w) => w.column === 1).map((w) => w.word).join(', ')}`],
        instructions: 'Read each word. Write it in the column where it belongs.',
        activity: 'Word sort',
      }
    }
    // Prefer pictures that use exactly this week's pattern; fall back to any decodable picture.
    const exact = PICTURES.filter((p) => p.pattern && (p.pattern === lw.pattern || lw.pattern.split(/\s*\/\s*/).includes(p.pattern)))
    const decodable = PICTURES.filter((p) => p.cvc && p.word.split('').every((c) => taught.has(c)))
    const pics = r.sample(exact.length >= 3 ? exact : grade === 'k' ? decodable : [], 4)
    if (pics.length >= 3) {
      return {
        blocks: [{ type: 'picture-write', prompt: 'Say the picture name. Write one letter in each box.', items: pics.map((p) => ({ picture: p.icon, answer: p.word, boxes: p.word.length })) }],
        answers: pics.map((p, i) => `${i + 1}. ${p.word}`),
        instructions: 'Say the word slowly. Tap the sounds. Write a letter for each sound.',
        activity: 'Picture spelling',
      }
    }
    // Fill in the blank with this week's words
    const sentences = lw.sentences.length ? lw.sentences : [`I can read ${lw.words[0]}.`]
    const items = sentences.slice(0, 3).map((s) => {
      const word = lw.words.find((w) => new RegExp(`\\b${w}\\b`, 'i').test(s)) ?? hfw.find((w) => new RegExp(`\\b${w}\\b`, 'i').test(s))
      if (!word) return { text: s }
      const distractors = r.sample(lw.words.filter((w) => w.toLowerCase() !== word.toLowerCase()), 2)
      return { text: s.replace(new RegExp(`\\b${word}\\b`, 'i'), '_____'), answer: word, choices: r.shuffle([word, ...distractors]) }
    })
    return {
      blocks: [
        { type: 'sentences', prompt: 'Read the sentence. Circle the word that fits.', items },
        { type: 'lines', count: 2, label: `Write two words from this week: ${lw.words.slice(0, 4).join(', ')}` },
      ],
      answers: items.map((it, i) => `${i + 1}. ${it.answer ?? '(read only)'}`),
      instructions: 'Read each sentence. Circle the word that makes sense.',
      activity: 'Fill in the blank',
    }
  }

  if (day === 2) {
    if (lw.passage) {
      return {
        blocks: [
          { type: 'passage', title: lw.passage.title, text: lw.passage.text, questions: lw.passage.questions },
          { type: 'draw', label: 'Draw your favorite part.', height: 'sm' },
        ],
        answers: lw.passage.questions.map((q, i) => `${i + 1}. ${q.a}`),
        instructions: 'Read the story two times. Answer the questions.',
        activity: 'Reading passage',
      }
    }
    return {
      blocks: [
        { type: 'sentences', prompt: 'Read each sentence. Draw a picture of one.', items: lw.sentences.map((text) => ({ text })) },
        { type: 'draw', label: 'My picture', height: 'md' },
        { type: 'lines', count: 1, label: 'Write a word that labels your picture.' },
      ],
      answers: ['Child reads each sentence aloud; picture matches a sentence.'],
      instructions: 'Read the sentences out loud. Draw one of them.',
      activity: 'Read & draw',
    }
  }

  // day 3 — review
  const gram = grammarBlock(lw, r)
  return {
    blocks: [
      gram.block,
      { type: 'lines', count: grade === '1st' ? 3 : 2, label: grade === '1st' && lw.spelling ? 'Spelling check: write the words your grown-up says.' : 'Write the words your grown-up says.' },
      { type: 'lines', count: grade === '1st' ? 2 : 1, label: `Writing: ${lw.writing}` },
    ],
    answers: [...gram.answers, `Dictation: ${(lw.spelling ?? lw.words).slice(0, 3).join(', ')}`],
    instructions: 'Finish the sentence practice. Then write the words your grown-up reads.',
    activity: gram.label,
  }
}

export function literacyBlocks(grade: Grade, week: number, day: number, r: Rng): GenOut {
  const lw = getLiteracyWeek(grade, week)
  return grade === 'pre-k' ? prekLiteracy(lw, day, r) : kFirstLiteracy(lw, day, grade, r)
}

export function bibleBlocks(grade: Grade, week: number): GenOut {
  const b = getBibleWeek(week)
  const verse = grade === '1st' ? b.verse.text : b.verse.short
  const blocks: Block[] =
    grade === 'pre-k'
      ? [
          { type: 'verse', ref: b.verse.ref, text: b.verse.short, mode: 'trace' },
          { type: 'draw', label: `Draw the story: ${b.title}`, height: 'lg' },
          { type: 'talk', questions: b.questions.slice(0, 2) },
        ]
      : grade === 'k'
        ? [
            { type: 'verse', ref: b.verse.ref, text: b.verse.short, mode: 'trace' },
            { type: 'draw', label: `Draw the story: ${b.title}`, height: 'md' },
            { type: 'lines', count: 1, label: b.questions[0] },
          ]
        : [
            { type: 'verse', ref: b.verse.ref, text: verse.length > 140 ? b.verse.short : verse, mode: 'copy' },
            { type: 'lines', count: 2, label: b.questions[0] },
            { type: 'lines', count: 2, label: b.questions[2] },
            { type: 'draw', label: 'Draw the story', height: 'sm' },
          ]
  return {
    blocks,
    answers: [`Talk it over: ${b.questions.join(' / ')}`],
    instructions: grade === '1st' ? 'Copy the memory verse. Answer the questions. Draw the story.' : 'Trace the memory verse. Draw the story. Talk about the questions with your grown-up.',
    activity: 'Bible page',
  }
}
