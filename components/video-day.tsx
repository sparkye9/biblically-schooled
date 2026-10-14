'use client'

import { ExternalLink, PlayCircle } from 'lucide-react'
import { seasonFor } from '@/lib/curriculum/bible'
import { STREAMING_EXTRAS, videosFor, type VideoLink } from '@/lib/curriculum/videos'
import type { Grade } from '@/lib/curriculum/types'
import * as logic from '@/lib/state/logic'
import { gradeLabel, useStore } from '@/lib/store'
import { Card, Pill } from '@/components/primitives'
import { SubjectIcon } from '@/components/teaching-guide'

const SUBJECT_LABEL: Record<VideoLink['subject'], string> = { bible: 'Bible', literacy: 'Reading', math: 'Math', science: 'Science' }

/** Videos matched to a curriculum week, grouped by each child's literacy/math level. */
export function VideoDay({ week }: { week: number }) {
  const store = useStore()
  const season = store.preferSeasonal ? seasonFor(store.now) : null
  const grades = [...new Set(store.childrenInView.map((c) => logic.learnerOf(c).grade))] as Grade[]
  const namesFor = (g: Grade) => store.childrenInView.filter((c) => logic.learnerOf(c).grade === g).map((c) => c.name)
  const bible = videosFor(week, grades[0] ?? '1st', season).find((v) => v.subject === 'bible')

  return (
    <Card className="scroll-mt-20">
      <div id="videos" className="flex items-start gap-3">
        <PlayCircle className="mt-0.5 size-6 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-lg font-semibold">Video day — Week {week}</h2>
          <p className="text-sm text-muted-foreground">
            For a day you need a break: videos that go over this week’s learning. Each link opens a trusted channel’s own search for the topic, so pick from the
            results. Faith-based where possible; no magic shows.
          </p>
        </div>
      </div>

      {bible && (
        <div className="mt-4">
          <p className="text-sm font-bold">Everyone together</p>
          <VideoRow v={bible} />
        </div>
      )}

      {grades.map((g) => (
        <div key={g} className="mt-4">
          <p className="text-sm font-bold">
            {namesFor(g).join(' & ')} <span className="font-normal text-muted-foreground">· {gradeLabel(g)}</span>
          </p>
          <ul className="mt-1 divide-y divide-border">
            {videosFor(week, g, season)
              .filter((v) => v.subject !== 'bible')
              .map((v) => (
                <li key={v.url}>
                  <VideoRow v={v} />
                </li>
              ))}
          </ul>
        </div>
      ))}

      <div className="mt-4 rounded-xl bg-gold/15 p-3 text-sm">
        <p className="font-bold">Before you press play</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-5">
          <li>Watch the first minute of a new video yourself — channels add videos over time.</li>
          <li>Turn off autoplay and play full-screen so the next suggestion doesn’t start on its own.</li>
          <li>About 20–30 minutes total is plenty. Afterward, ask one question from this week’s Bible lesson.</li>
        </ul>
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-semibold text-primary">More faith-based options outside YouTube</summary>
        <ul className="mt-2 space-y-1.5">
          {STREAMING_EXTRAS.map((x) => (
            <li key={x.name}>
              <a href={x.url} target="_blank" rel="noreferrer noopener" className="font-semibold text-primary underline">
                {x.name}
              </a>{' '}
              — {x.note}
            </li>
          ))}
        </ul>
      </details>
    </Card>
  )
}

function VideoRow({ v }: { v: VideoLink }) {
  return (
    <a href={v.url} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 py-2.5 hover:bg-muted/40">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sage-soft text-primary">
        <SubjectIcon subject={v.subject === 'science' ? 'enrichment' : v.subject} className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">
          {SUBJECT_LABEL[v.subject]}: {v.topic}
        </span>
        <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {v.source.name}
          {v.source.faithBased ? <Pill tone="sage">Faith-based</Pill> : <Pill>No magic</Pill>}
        </span>
      </span>
      <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
    </a>
  )
}
