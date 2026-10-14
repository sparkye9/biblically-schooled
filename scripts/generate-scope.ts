/**
 * Writes docs/SCOPE-AND-SEQUENCE.md from the curriculum data, so the document
 * always matches what the app teaches. Run: npm run docs:curriculum
 */
import { writeFileSync } from 'node:fs'
import { BIBLE_WEEKS, SEASONAL_LESSONS, UNITS } from '../lib/curriculum/bible'
import { ENRICHMENT } from '../lib/curriculum/enrichment'
import { LITERACY } from '../lib/curriculum/literacy'
import { MATH } from '../lib/curriculum/math'
import type { Grade } from '../lib/curriculum/types'

const G: [Grade, string][] = [['pre-k', 'Pre-K (Seraiah, Amelia)'], ['k', 'Kindergarten (Olori-Joy)'], ['1st', '1st Grade (Alijah)']]
const esc = (s: string) => s.replace(/\|/g, '/')
const out: string[] = []
out.push('# Scope & Sequence — 36 Weeks', '', '_Generated from `lib/curriculum/*` by `npm run docs:curriculum`. Do not edit by hand._', '')
out.push('Each week has four lesson days: **Introduce → Practice → Apply → Review**. Wednesday is co-op by default; lessons only advance when school actually happens.', '')
out.push('## Curriculum map', '')
for (const u of UNITS) out.push(`- **Unit ${u.number} (Weeks ${u.weeks[0]}–${u.weeks[1]}): ${u.title}** — ${u.bigIdea}`)
out.push('', '## Bible', '', '| Wk | Lesson | Passage | Memory verse (KJV) | Character |', '|---|---|---|---|---|')
for (const b of BIBLE_WEEKS) out.push(`| ${b.week} | ${esc(b.title)} | ${b.passage} | ${b.verse.ref} — “${esc(b.verse.short)}” | ${b.character} |`)
out.push('', 'Seasonal swaps (offered automatically in season):', '')
for (const s of SEASONAL_LESSONS) out.push(`- **${s.title}** — ${s.passage} · ${s.verse.ref}`)
for (const [g, label] of G) {
  out.push('', `## ${label}`, '', '| Wk | Literacy | Sight words | Math | Standard |', '|---|---|---|---|---|')
  LITERACY[g].forEach((l, i) => {
    const m = MATH[g][i]
    out.push(`| ${l.week} | ${esc(l.title)} | ${l.hfw.filter((w) => w !== 'review').join(', ') || '—'} | ${esc(m.title)} | ${m.standard ?? '—'} |`)
  })
}
out.push('', '## Enrichment', '', '| Wk | Science | Art | Social studies | Life skill |', '|---|---|---|---|---|')
for (const e of ENRICHMENT) out.push(`| ${e.week} | ${esc(e.science.title)} | ${esc(e.art.title)} | ${esc(e.socialStudies.title)} | ${esc(e.lifeSkill.title)} |`)
writeFileSync('docs/SCOPE-AND-SEQUENCE.md', out.join('\n') + '\n')
console.log('Wrote docs/SCOPE-AND-SEQUENCE.md')
