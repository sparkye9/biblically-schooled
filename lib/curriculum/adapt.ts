import type { DailyLesson } from './lessons'
import { getLiteracyWeek } from './literacy'
import { STARTERS } from './language'

/**
 * Access supports: change HOW a child reaches a lesson, never WHAT they are
 * learning. The objective, skills, worksheet, and checks stay exactly the
 * same as their siblings' grade-level lesson. What changes:
 *
 *  - a predictable beginning, middle, and end (a 3-step visual schedule)
 *  - one instruction at a time, simple direct words, extra processing time
 *  - a finished example shown first
 *  - short work chunks with a movement break between them
 *  - more ways to show understanding (say it, point, build, write)
 *  - less copying when copying is not the skill being taught
 *  - comprehension checked directly, with picture choices and sentence starters
 *  - concrete objects and pictures before written math
 */

const COMMON = (name: string) => [
  `Clear the table except today’s materials. One task is visible at a time — fold or cover the rest of a worksheet.`,
  `Give one instruction at a time in short, direct words. Wait 5–10 seconds before repeating, and repeat with the same words.`,
  `${name} can show understanding by saying it, pointing to it, building it with objects, or writing it — each one counts.`,
]

export function adaptLesson(lesson: DailyLesson, name: string): DailyLesson {
  const g = lesson.guide
  const supports = [...COMMON(name)]
  let starters = g.starters

  switch (lesson.subject) {
    case 'math':
      supports.push('Real objects stay on the table for every problem — even on paper days. Draw it before writing it.')
      supports.push(`Copying problems is not today’s skill: work from the printed page, or write the problems for ${name} to answer.`)
      supports.push(`After each answer ask "How do you know?" Starters: "I know because…", "First I… then I…".`)
      if (lesson.worksheet) supports.push('Do the first problem together as the finished example, then 3–4 problems at a time with a movement break between chunks.')
      starters = STARTERS.explaining
      break
    case 'literacy': {
      supports.push('Spelling with letter tiles counts the same as writing when spelling (not handwriting) is the goal.')
      if (lesson.day === 2) {
        const lw = getLiteracyWeek(lesson.grade, lesson.week)
        supports.push('Reading the words is not the same as understanding them. After reading, ask the questions one at a time.')
        supports.push(`Offer 2–3 answer choices (pictures or words) for any question that is hard. Have ${name} point to the sentence that shows the answer.`)
        supports.push(`Sequence it: draw 3 quick pictures of the story; put them in order and retell with first / next / last.${lw.passage ? ` (Story: "${lw.passage.title}")` : ''}`)
        starters = STARTERS.retelling
      } else if (lesson.worksheet) {
        supports.push('Show a finished example of the first item before starting. Read every direction aloud.')
      }
      if (lesson.grade === '1st' && lesson.day === 3) supports.push('For the writing part: talk the sentence out loud first, then write. A sentence starter is fine.')
      break
    }
    case 'bible':
      supports.push('Use a picture of the story the whole time you talk about it. Ask who / what / where with picture choices before asking why.')
      if (lesson.worksheet) supports.push('Copying the full verse is not the goal on the Bible page: copy the short part, and you write the rest. The goal is knowing the verse.')
      starters = STARTERS['wh-questions']
      break
    case 'language':
      // Already built for this.
      break
    case 'handwriting':
      supports.push('Short rows with a break: one row, then a stretch or wall push-ups.')
      break
  }

  const finished = lesson.worksheet ? 'the page is finished' : 'the activity is finished'
  return {
    ...lesson,
    guide: {
      ...g,
      structure: {
        begin: `Show the plan with 3 picture cards: "First ${lesson.childTask.toLowerCase()}, then a movement break, then ${finished}." Show what finished looks like.`,
        middle: 'Work in short chunks (3–5 minutes). Point to the card you are on. Praise effort specifically: "You started at the top!"',
        end: `Finish signal: ${name} moves the card to "done" or checks the box. Name one thing that went well. Then a 2-minute movement break before the next subject.`,
      },
      supports,
      starters,
    },
  }
}
