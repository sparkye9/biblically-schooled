# The curriculum engine

Every lesson in the app is generated from code each time it is shown. Change a rule here and every week follows it.

The engine's philosophy is **traditional academics + conceptual understanding + hands-on learning + individualized instruction.**

The 36-week sequence, the four Bible units, and the KJV memory verses are unchanged. Saved progress, completions, notes, and children are unchanged too.

## 1. What changed in lesson generation

| Piece | File | What it does now |
|---|---|---|
| Weekly rhythm | `lib/curriculum/types.ts` (`DAY_RHYTHM`), `lib/curriculum/lessons.ts` (`PRINT_DAYS`) | Day 1 is hands-on with nothing to print. Day 2 is the paper day. Day 3 is hands-on and movement (readers get one story page). Day 4 is review with a mastery check. |
| Activity types | `ActivityType` on every lesson and plan item | Each activity is labeled Traditional academic · Hands-on · Movement · Discussion & exploration · Review & assessment. |
| Math method | `lib/curriculum/math-method.ts` | Every topic gets What / Why / How, Concrete → Pictorial → Abstract stages, everyday story problems, a movement game, and a mental-math warm-up drawn from earlier weeks. |
| Fluency gate | `applyFluencyGate` in `lessons.ts` | Timed practice is offered only after the concept skills are marked *Demonstrated independently*. |
| Handwriting | `lib/curriculum/handwriting.ts`, `handwriting-glyphs.ts`, `lib/worksheets/handwriting-gen.ts` | A daily letter- and number-formation block for Pre-K and K. Pages are drawn from stroke data: starting dots, numbered strokes, arrows. |
| Language building | `lib/curriculum/language.ts` | A 36-week receptive and expressive language strand. Mostly talk, games, movement, and role-play. |
| Access supports | `lib/curriculum/adapt.ts` | Changes **how** a child reaches a lesson, never **what** it teaches. |
| Learning profiles | `LearningProfile` on each child (Students page) | `handwriting`, `languageBuilding`, `accessSupports`. Each child's profile is separate. |
| Calendar | `lib/plan/schedule.ts` | Mon art · Tue science · Wed co-op · Thu art · Fri science + library. Church is noted Monday and Wednesday, 9–12. |
| New math weeks (1st grade) | `lib/curriculum/math.ts` | Column addition with carrying (week 20), equal groups / beginning multiplication (31), sharing / beginning division (34). Borrowing is a "when ready" step in weeks 22 and 35. |

Mastery is still set only by the parent.

- Finishing a lesson marks a skill *Introduced* at most.
- Friday's mastery check prompts you to choose *Practicing*, *Demonstrated independently*, or *Needs review*.
- Handwriting and language skills now have their own Progress tabs.

## 2. How a math week is structured

| Day | Stage | What happens | Paper? |
|---|---|---|---|
| Mon | **Concrete** | Say *what* we're doing and *why it works*, then do it with counters, blocks, bundles, coins. The child proves one answer with objects: "I know because…" | No |
| Tue | **Pictorial → Abstract** | Re-model once with objects, then draw it (ten frames, number lines, quick tens and ones), then write it. Do the first problem together. | Yes |
| Thu | **Apply** | Everyday story problems (cooking, setting the table, money, sharing snacks) plus a movement game (number hopscotch, answer hop, tens-and-ones relay). | No |
| Fri | **Independent + review** | Independent page with spiral review of last week, then an out-loud mastery check: "How did you solve that one?" | Yes |

Every math lesson also starts with a 1–2 minute mental-math warm-up: counting forward and back, partners of 10, doubles, 10 more and 10 less.

Example, 1st grade week 10 (Make 10 to Add):

- **What:** adding numbers like 8 + 5 by making a ten first.
- **Why:** 10 is a friendly number. 8 needs 2 more to make 10. Break 5 into 2 and 3, give 2 to the 8, and 10 and 3 is 13. The total doesn't change; we only moved counters.
- **How:** start with the bigger number → how many more make 10? → break the other number → make the ten → add the rest.

## 3. Alijah's language and access supports

Alijah is on the same 1st-grade lessons as always, alongside his siblings: same objectives, same skills, same worksheets, same checks. A test enforces this.

**Language building** is 5 minutes a day. It is tied to the week's Bible story, reading passage, and science, so the same skill shows up in different contexts:

- **Monday — picture talk.** Who / what / where questions, then why and how later in the year, three vocabulary words, and the week's focus skill.
- **Tuesday — listen and do.** Directions grow from 1 step (weeks 1–6) to 2 steps, then before/after, then 3 steps (weeks 28–36). Then he gives you directions.
- **Thursday — a game for the focus skill.** Mystery-bag describing, sentence builder, puppet retell, cause and effect with the science activity, prediction during a read-aloud, clue-detective inference, alike/different sorting, or teach-back.
- **Friday — retell and check.** Sequence the Bible story with 3 events at first, then 4, then 5. Ask direct comprehension questions on the reading passage; he points to the place in the story that shows each answer.

Every activity comes with sentence starters and a visual support (picture choices, one finger per step).

**Access supports** are added to every lesson:

- **Structure:** a predictable beginning (3 picture cards and what "finished" looks like), a middle (3–5 minute chunks), and an end (a finish signal and a movement break).
- **Instructions:** one at a time, with 5–10 seconds of wait time, repeated in the same words.
- **Showing understanding:** saying it, pointing, building, or writing all count.
- **Copying:** reduced when copying isn't the skill. He copies the short part of the verse; you write math problems or he works from the printed page; letter tiles count for spelling.
- **Comprehension:** checked directly, with picture choices and sequencing.
- **Math:** objects stay on the table every day.

## 4. Handwriting and numbers for Seraiah and Olori-Joy

- **Letters** follow each child's reading sequence, so Seraiah writes D d the week she learns /d/. Kindergarten moves on to words (week 15) and short sentences (week 22+).
- **Numbers** follow their own sequence: Pre-K 1 → 10 → 0 → review pairs; K 0–20, then reversal-prone digits and larger numbers.
- **Stages:** guided (green starting dot, numbered strokes, red arrow) → trace → copy from a model → write from memory. Later weeks use fewer guided rows.

The daily handwriting block follows the same weekly rhythm:

- **Monday:** sky-writing and a salt tray, saying the formation words ("Down from the top, back up, over the hump, and down").
- **Tuesday:** "learn it" page — guided rows, copy, numbers, and count-and-write.
- **Thursday:** a fine-motor activity (play-dough snakes, tongs, clothespins, lacing, water painting…), then whiteboard or chalk writing.
- **Friday:** "show what you know" page — a short trace warm-up, copying, dictation, name practice, and numbers.

Pages never repeat one exercise across the whole sheet, and all 144 were checked in a browser to fit Letter paper.

## 5. How worksheets alternate with hands-on learning

| | Mon | Tue | Thu | Fri |
|---|---|---|---|---|
| Pre-K | nothing | Bible · math · handwriting | nothing | literacy · math · handwriting |
| K | nothing | Bible · phonics · math · handwriting | story page | literacy · math · handwriting |
| 1st | nothing | Bible · phonics · math | story page | literacy · math |

- **Monday and Thursday** are hands-on: letter tiles, sound boxes, sound sorts with real objects, letter hop, spelling hop, real-life math, movement games, experiments, art.
- **Thursday's** reading is done together and answered out loud.
- **Pages per week:** Seraiah and Amelia 6 each (2 of them handwriting), Olori-Joy 8 (2 handwriting), Alijah 6 (was 8). Every page lands on Tuesday or Friday, except the Thursday story page for readers.

## 6. A complete week

See [EXAMPLE-WEEK.md](EXAMPLE-WEEK.md). It is generated straight from this engine with `npm run docs:example-week -- 12`.

## Limits worth knowing

- Lesson days follow the lesson pointer, not the weekday. If Monday is missed, Tuesday becomes the hands-on day and nothing is skipped.
- Standard days now run 40–55 minutes, because handwriting or language adds 5 minutes where a child's profile includes it. Minimum days stay about 20 minutes: handwriting is skipped and language happens inside Bible time.
- Diagnoses are not stored in the app or the code. The profile only records which supports to apply.
