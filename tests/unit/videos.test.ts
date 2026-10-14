import { describe, expect, it } from 'vitest'
import { SEASONAL_LESSONS } from '@/lib/curriculum/bible'
import { literacySearch, videosFor } from '@/lib/curriculum/videos'
import type { Grade } from '@/lib/curriculum/types'

const GRADES: Grade[] = ['pre-k', 'k', '1st']

describe('Video Day', () => {
  it('every week and grade has Bible, reading, math, and science videos', () => {
    for (const g of GRADES) {
      for (let w = 1; w <= 36; w++) {
        const subjects = new Set(videosFor(w, g).map((v) => v.subject))
        expect([...subjects].sort(), `${g} week ${w}`).toEqual(['bible', 'literacy', 'math', 'science'])
      }
    }
  })
  it('links only go to YouTube searches on the vetted channels, with a real search term', () => {
    for (const g of GRADES) {
      for (let w = 1; w <= 36; w++) {
        for (const v of videosFor(w, g)) {
          expect(v.url).toMatch(/^https:\/\/www\.youtube\.com\/(@(saddlebackkids|jackhartmann|numberblocks)\/search\?query=|results\?search_query=(Suitcase|SciShow))/)
          expect(v.url).not.toMatch(/undefined|query=$|%20$/)
        }
      }
    }
  })
  it('letter weeks search for that letter', () => {
    expect(literacySearch('pre-k', 2)).toBe('letter M')
    expect(literacySearch('k', 1)).toBe('letter A')
  })
  it('seasonal lessons swap the Bible video', () => {
    const advent = SEASONAL_LESSONS.find((s) => s.id === 'advent')!
    expect(videosFor(15, 'k', advent).find((v) => v.subject === 'bible')!.url).toContain('Christmas')
  })
  it('prints the search terms for review', () => {
    for (const g of GRADES) {
      const rows = Array.from({ length: 36 }, (_, i) =>
        `${i + 1}: ` + videosFor(i + 1, g).map((v) => decodeURIComponent(v.url.split(/query=/)[1]).replace(/\+/g, ' ')).join(' | '),
      )
      process.stdout.write(`\n== ${g}\n${rows.join('\n')}\n`)
    }
  })
})
