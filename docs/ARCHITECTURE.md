# Architecture (after the redesign)

## Big picture

```
lib/curriculum/   Static, versioned curriculum (code, not saved data)
  bible.ts          36 Bible weeks in 4 units, KJV verses, seasonal lessons, Easter/Thanksgiving math
  literacy.ts       Pre-K / K / 1st scope & sequence, passages, sight words, spelling, grammar
  math.ts           Pre-K / K / 1st topics with guides + worksheet generator settings
  enrichment.ts     Science, art, social studies, life skills, library mission × 36
  phonics.ts        Letter names vs. sounds, mouth cues, keywords, verified-recording list
  pictures.ts       Picture words worksheets may draw (inline SVG icons + phonics facts)
  lessons.ts        Builds each day's lesson + teaching guide (Introduce/Practice/Apply/Review)
  skills.ts         Skill catalog for progress tracking
  family.ts         Family Learning (autism & sibling understanding) module
lib/plan/
  schedule.ts       Flexible calendar: lesson pointer, weekly rhythm, breaks, pace, finish date
  day-plan.ts       Today's plan for any mode: items, materials, skippable, rotation, time estimate
lib/state/          Pure state functions (tested without a browser)
  types.ts, defaults.ts, logic.ts (completions, rollover, restart, summaries), migrate.ts (v5 → v6)
lib/worksheets/     Worksheet specs: generators, seeded randomness, registry, validator
lib/store.tsx       React context: loads/migrates/saves localStorage, exposes actions
components/worksheets/  Letter-size printable renderer (SVG/HTML, black & white friendly)
app/(app)/        Screens with the app shell: Today, This Week, Curriculum, Students,
                  Print Center, Progress, Library (+ Family Learning), Settings, Restart
app/(print)/      Print-only pages (no shell): /print/packet, /print/family
app/(kid)/        Child-facing view: /kid/[childId]
```

## Key design decisions

| Problem (see AUDIT.md) | Decision |
|---|---|
| Lessons skipped when days were missed | A **lesson pointer** (0–143). It advances only when a lesson day was taught on an earlier date, or the parent taps "We're done for today". Dates decide *what kind* of day it is; the pointer decides *what* is taught. |
| Duplicate / repetitive worksheets | Worksheets are **generated specs** with seeded randomness; the year is generated in one fixed order and any page whose content matches an earlier one is regenerated. Each lesson day has a different job and format. |
| Missing images, broken links | No external worksheet files. Pictures are bundled SVG icons; the validator rejects any icon not in the bundle; the renderer shows a visible marker if one ever were missing. |
| Wrong answers | Answer keys are computed, then re-checked independently by the validator. |
| Incorrect phonics audio | Separate Name/Sound buttons; speech never says isolated sounds; optional verified recordings. |
| Progress not saving | Every checkbox writes to the store; state saves to localStorage on change. |
| Too much navigation | 8 destinations; Today is the home page; mobile bottom bar has Today, Week, Print, Progress + More. |
| Stale app after updates | Service worker is network-first. |

## Data model (localStorage `biblically-schooled-v6`)

Only family data is stored: households, children (+ pathway adjustments and supports),
`pointer`, `dayLog`, `completions` (`"<index>|<childId>|<subject>"` → date/mode),
`skillStatus` (per child per skill, set by the parent), notes, books, files, custom
activities, schedule, breaks, preferences, PINs. Curriculum content is never stored,
so updates to lessons reach every device immediately.

On first load the previous `biblically-schooled-v5` data is migrated (see
`lib/state/migrate.ts` and `tests/unit/migration.test.ts`) and left in place untouched.

## Features kept, merged, or retired

| Before | Now |
|---|---|
| Home + Today + Start School | **Today** (with guided rotation and "We're done for today") |
| Weekly Planner, Prep, Sunday Prep, Supplies | **This Week** (materials for the week, our place, own activities) |
| Teaching Guide, Bible & Theme | **Curriculum** (every guide, every week) |
| Children | **Students** (pathways, pace, supports, kid view) |
| Printables, Print Center | **Print Center** (Print My Week) + archive of the original PDFs |
| Progress, Portfolio | **Progress** (skills, weekly summary, notes) |
| Read-Aloud Library | **Library** (+ library mission, Family Learning, own files) |
| Lesson editor for built-in lessons | Built-in lessons are curriculum code now; families add **their own activities** in This Week. Custom lessons from before were migrated. |
| Interactive boards | Kept in kid view, now tied to the week's letters, words, and verse |
| Household switcher, PIN lock, backup/restore, offline | Kept (backup format v6; v5 backups still restore) |

Old URLs redirect to their replacements (`next.config.mjs`).
