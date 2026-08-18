'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { accentBg } from '@/lib/ui'
import { PageHeader } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BookHeart, Plus, BookMarked, CheckCircle2, Library as LibraryIcon } from 'lucide-react'
import type { ReadAloudBook } from '@/lib/types'

const STATUS_META: Record<
  ReadAloudBook['status'],
  { label: string; token: string; Icon: typeof BookHeart }
> = {
  'currently-reading': { label: 'Reading Now', token: 'primary', Icon: BookMarked },
  favorite: { label: 'Favorite', token: 'child-alijah', Icon: BookHeart },
  library: { label: 'To Borrow', token: 'child-olori', Icon: LibraryIcon },
  finished: { label: 'Finished', token: 'child-amelia', Icon: CheckCircle2 },
}

export default function LibraryPage() {
  const store = useStore()
  const [title, setTitle] = useState('')

  const household =
    store.currentView === 'shared' ? store.activeMomHouseholdId : store.currentView
  const books =
    store.currentView === 'shared'
      ? store.readAloud
      : store.readAloud.filter((b) => b.householdId === store.currentView)

  const grouped = (Object.keys(STATUS_META) as ReadAloudBook['status'][]).map(
    (status) => ({
      status,
      books: books.filter((b) => b.status === status),
    }),
  )

  return (
    <div>
      <PageHeader
        eyebrow="Living Books"
        title="Read-Aloud Library"
        description="A Charlotte Mason-inspired book basket. Track what you're reading together and what to grab from the library next."
      />

      <Card className="mb-6 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (title.trim()) {
              store.addReadAloud(title.trim(), household)
              setTitle('')
            }
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a book to your basket…"
            className="flex-1"
          />
          <Button type="submit" className="gap-1.5">
            <Plus className="size-4" /> Add Book
          </Button>
        </form>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        {grouped.map(({ status, books }) => {
          const meta = STATUS_META[status]
          return (
            <Card key={status} className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="flex size-8 items-center justify-center rounded-lg"
                  style={accentBg(meta.token, 0.18)}
                >
                  <meta.Icon
                    className="size-4"
                    style={{ color: `var(--${meta.token})` }}
                  />
                </span>
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  {meta.label}
                </h2>
                <span className="ml-auto text-sm font-semibold text-muted-foreground">
                  {books.length}
                </span>
              </div>
              {books.length === 0 ? (
                <p className="rounded-xl bg-muted/50 px-3 py-4 text-center text-sm text-muted-foreground">
                  Nothing here yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {books.map((b) => (
                    <li
                      key={b.id}
                      className="rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground"
                    >
                      {b.title}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
