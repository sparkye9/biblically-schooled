// Checks the Family Learning resource links. Needs internet access.
// Run: npm run check:links — then update `checked` dates in lib/curriculum/family.ts.
import { readFileSync } from 'node:fs'
const src = readFileSync(new URL('../lib/curriculum/family.ts', import.meta.url), 'utf8')
const urls = [...src.matchAll(/url: '([^']+)'/g)].map((m) => m[1])
let bad = 0
for (const url of urls) {
  try {
    const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) })
    console.log(`${r.ok ? 'OK ' : 'BAD'} ${r.status} ${url}`)
    if (!r.ok) bad++
  } catch (e) {
    console.log(`ERR ${url} ${e.message}`)
    bad++
  }
}
process.exit(bad ? 1 : 0)
