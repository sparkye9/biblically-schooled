'use client'

import Link from 'next/link'
import { Printer, Quote, ChevronRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { childrenInView } from '@/lib/selectors'
import { dayLabels } from '@/lib/ui'
import { PageHeader, ChildAvatar } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TeachingGuidePage() {
  const store = useStore()
  const { children, currentView, currentWeek, currentDay } = store
  const week = store.weeks.find((w) => w.number === currentWeek) ?? store.weeks[0]
  const inView = childrenInView(children, currentView)

  return (
    <div className=”space-y-6”>
      <PageHeader
        eyebrow={`${dayLabels[currentDay]} · Week ${currentWeek}`}
        title=”Teaching Guide”
        description=”One guide per child. Click on a child to see their lessons for the day.”
      >
        <Button onClick={() => window.print()} className=”gap-1.5 print:hidden”>
          <Printer className=”size-4” /> Print
        </Button>
      </PageHeader>

      {week && (
        <Card className=”p-5”>
          <p className=”text-xs font-bold uppercase tracking-widest text-primary”>
            {week.bibleRef} · {week.theme}
          </p>
          <p className=”mt-2 flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-sm text-foreground”>
            <Quote className=”mt-0.5 size-4 shrink-0 text-primary” />
            <span>
              <span className=”font-semibold”>Memory verse:</span> “{week.memoryVerse}” —{' '}
              {week.memoryVerseRef}
            </span>
          </p>
        </Card>
      )}

      {inView.length === 0 ? (
        <p className=”rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground”>
          No children in this view yet.
        </p>
      ) : (
        <div className=”grid gap-3 sm:grid-cols-2 lg:grid-cols-3”>
          {inView.map((child) => (
            <Link
              key={child.id}
              href={`/teaching-guide/${child.id}`}
              className=”group rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50”
            >
              <div className=”flex items-center justify-between”>
                <div className=”flex items-center gap-3”>
                  <ChildAvatar child={child} />
                  <div>
                    <p className=”font-serif font-bold text-foreground”>{child.name}</p>
                    <p className=”text-sm text-muted-foreground”>{child.grade}</p>
                  </div>
                </div>
                <ChevronRight className=”size-4 transition-transform group-hover:translate-x-1 text-muted-foreground” />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
