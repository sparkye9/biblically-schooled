# Testing

Run everything: `npm run typecheck && npm test && npm run test:e2e`

## Results (October 14, 2026 — branch `claude/biblically-schooled-redesign-ehdx8i`)

| Suite | Result |
|---|---|
| TypeScript (`tsc --noEmit`, whole repo) | ✅ 0 errors (was 50+, previously hidden by `ignoreBuildErrors`) |
| Production build (`next build`) | ✅ 14 routes |
| Unit tests (Vitest) | ✅ 56 / 56 |
| Browser tests (Playwright, Chromium desktop + Pixel 7) | ✅ 12 / 12 |

## What is covered

**Curriculum** (`tests/unit/curriculum.test.ts`)
- 36 weeks × Bible/literacy/math/enrichment for every grade; 4 units of 9 weeks
- Every short memory verse is an exact piece of its full KJV verse; references well-formed; no repeated verses or titles
- Easter and Thanksgiving dates computed correctly; seasonal detection
- Phonics: names and sounds never share the same speech text; keywords start with their sound; speech never asked for "tuh"/"sss"
- Pictures: every picture's first sound is correct; rhymes really rhyme
- No repetitive lessons: the four days of every week teach different things; every lesson has a complete teaching guide
- Pre-K gets at most 4 printed literacy/math pages a week

**Worksheets** (`tests/unit/worksheets.test.ts`) — all 756 worksheets of the year
- Pass validation: computed answers re-checked, unique choices containing the answer, pictures exist, page fit, grade-appropriate numbers, passage length
- 0 duplicates within a grade; ≥ 15 activity formats per grade; no format > 20% of pages
- Every picture used is in the bundled icon set; generation is deterministic

**Family schedule simulation** (`tests/unit/family-simulation.test.ts`)
- Normal week (Mon, Tue, co-op Wed, Thu, Fri) → exactly 4 lesson days forward
- Minimum-energy day → ~20 min, no printing, progress kept; switching modes keeps checkmarks
- Missed week → no lesson skipped, nothing marked complete
- Two missed weeks → "We're starting again": welcome-back review, then resume; "catch up" never marks skipped lessons done
- Return to normal lessons; weekly summary; mastery only set by the parent
- Printing for four learners: separate Pre-K copies for Seraiah and Amelia; separate tracking
- Time estimates: Minimum 20, Standard 40–50, Full 60–90 minutes for all four learners (taught in parallel)

**Migration** (`tests/unit/migration.test.ts`) — children, households, completed lessons, custom lessons, skills, notes, books, breaks, PIN, uploads all carried over; v5 data never deleted; corrupt storage handled.

**Browser** (`tests/e2e/app.spec.ts`)
- Today shows all four learners, shared Bible, modes, Easy Day plan; no console errors
- Checkmarks persist across reload and mode switches
- Missed day keeps the same lesson; a taught day moves on the next date
- Co-op day message + "Do a lesson anyway"
- Real migration from v5 localStorage in the browser
- Restart flow after time away
- Print packet: overview, checklists, 26 worksheet pages, answer key; **PDF generated**
- **Whole year render QA**: 36 weeks × 4 learners — no clipped page, no missing picture (this caught and fixed one over-full Pre-K Bible page in Week 19)
- Kid view: task completion, star progress, letter name/sound buttons, grown-up gate
- All pages load without errors; retired URLs redirect
- Phone width: no sideways scrolling; bottom navigation present

## Known limits
- **Scripture text** was written from the KJV without an online cross-check (this environment has no internet access). Tests guarantee internal consistency (short verse ⊂ full verse), not wording against a printed Bible. Please spot-check a few verses; `lib/curriculum/bible.ts` is the single place to correct one.
- **Family resource links** could not be loaded from this environment; run `npm run check:links` where internet is available.
- **Phonics recordings** are not included; see `public/audio/phonics/README.md`.
- Vercel Analytics' script 404s locally (it exists only on Vercel); tests ignore that one URL.
