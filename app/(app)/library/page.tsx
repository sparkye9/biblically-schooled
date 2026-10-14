'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BookHeart, BookMarked, CheckCircle2, Download, HeartHandshake, Library as LibraryIcon, Plus, Trash2, Upload } from 'lucide-react'
import { getEnrichment } from '@/lib/curriculum/enrichment'
import { positionOf } from '@/lib/plan/schedule'
import { useStore } from '@/lib/store'
import type { ReadAloudBook } from '@/lib/types'
import { getWorksheetFile, saveWorksheetFile } from '@/lib/worksheet-files'
import { cn } from '@/lib/utils'
import { Card, PageHeader, Section } from '@/components/primitives'

const STATUS: { id: ReadAloudBook['status']; label: string; Icon: typeof BookHeart }[] = [
  { id: 'currently-reading', label: 'Reading now', Icon: BookMarked },
  { id: 'library', label: 'To borrow', Icon: LibraryIcon },
  { id: 'finished', label: 'Finished', Icon: CheckCircle2 },
  { id: 'favorite', label: 'Favorite', Icon: BookHeart },
]

export default function LibraryPage() {
  const store = useStore()
  const week = positionOf(store.pointer).week
  const e = getEnrichment(week)
  const [title, setTitle] = useState('')
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Read-alouds, library day & family learning" title="Library" />

      <Card className="bg-gold/10">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">This week’s library mission · Week {week}</p>
        <p className="mt-1 font-semibold">{e.library.mission}</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
          {e.library.readAloudIdeas.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Card>

      <Link href="/library/family" className="flex items-center gap-3 rounded-2xl border-2 border-primary/30 bg-sage-soft/40 p-4">
        <HeartHandshake className="size-8 shrink-0 text-primary" />
        <span>
          <span className="block font-serif text-lg font-semibold">Family Learning: Understanding Each Other</span>
          <span className="text-sm text-muted-foreground">Nine short lessons about autism, senses, feelings, boundaries, and being a sibling.</span>
        </span>
      </Link>

      <Section title="Our read-aloud list">
        <Card>
          <form
            className="flex gap-2"
            onSubmit={(ev) => {
              ev.preventDefault()
              if (!title.trim()) return
              store.addReadAloud(title.trim())
              setTitle('')
            }}
          >
            <input value={title} onChange={(ev) => setTitle(ev.target.value)} placeholder="Add a book title" aria-label="Book title" className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm" />
            <button type="submit" className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              <Plus className="size-4" /> Add
            </button>
          </form>
          {store.readAloud.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No books yet. Add what you’re reading together.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {store.readAloud.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center gap-2 py-2">
                  <span className="min-w-0 flex-1 text-sm font-semibold">{b.title}</span>
                  {STATUS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={b.status === s.id}
                      onClick={() => store.setReadAloudStatus(b.id, s.id)}
                      className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold', b.status === s.id ? 'border-primary bg-sage-soft text-primary' : 'border-border text-muted-foreground')}
                    >
                      <s.Icon className="size-3" /> {s.label}
                    </button>
                  ))}
                  <button type="button" aria-label={`Remove ${b.title}`} onClick={() => store.removeReadAloud(b.id)} className="p-1 text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Section>

      <OurFiles />
    </div>
  )
}

/** Files the family uploads stay on this device (IndexedDB). */
function OurFiles() {
  const store = useStore()
  const [busy, setBusy] = useState(false)
  return (
    <Section title="Our own files">
      <Card>
        <p className="text-sm text-muted-foreground">Keep extra worksheets or co-op handouts here. Files stay on this device.</p>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold">
          <Upload className="size-4" /> {busy ? 'Saving…' : 'Add a file'}
          <input
            type="file"
            className="sr-only"
            onChange={async (ev) => {
              const f = ev.target.files?.[0]
              if (!f) return
              setBusy(true)
              const key = `file-${Date.now()}`
              await saveWorksheetFile(key, f)
              store.addResource({
                title: f.name,
                type: 'Worksheet',
                subject: 'review',
                skill: '',
                gradeBand: 'pre-k',
                weekNumber: positionOf(store.pointer).week,
                minutes: 0,
                owner: store.activeMomHouseholdId,
                contributor: '',
                fileKey: key,
                fileName: f.name,
                fileType: f.type,
                fileSize: f.size,
              })
              setBusy(false)
              ev.target.value = ''
            }}
          />
        </label>
        {store.resources.length > 0 && (
          <ul className="mt-3 divide-y divide-border text-sm">
            {store.resources.map((r) => (
              <li key={r.id} className="flex items-center gap-2 py-2">
                <span className="flex-1">{r.title}</span>
                {r.fileKey && (
                  <button
                    type="button"
                    onClick={async () => {
                      const file = await getWorksheetFile(r.fileKey!)
                      if (!file) return alert('That file is not on this device.')
                      const url = URL.createObjectURL(file.blob)
                      window.open(url, '_blank', 'noopener')
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-bold"
                  >
                    <Download className="size-3.5" /> Open
                  </button>
                )}
                <button type="button" aria-label={`Remove ${r.title}`} onClick={() => store.removeResource(r.id)} className="p-1 text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Section>
  )
}
