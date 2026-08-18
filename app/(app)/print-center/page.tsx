'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { childrenInView, assignedLessonsFor } from '@/lib/selectors'
import { accentBg } from '@/lib/ui'
import { PageHeader } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, Check, FileText, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PrintCenterPage() {
  const store = useStore()
  const inView = childrenInView(store.children, store.currentView)
  const [picked, setPicked] = useState<Set<string>>(new Set())

  const printableLessons = inView.flatMap((child) =>
    assignedLessonsFor(child.id, store.assignments, store.lessons, {
      week: store.currentWeek,
    })
      .filter((i) => i.lesson.printable)
      .map((i) => ({
        child,
        title: i.lesson.title,
        sub: `${i.lesson.minutes} min`,
        subject: i.lesson.subject,
      })),
  )

  const printableResources = store.resources.filter(
    (r) => r.weekNumber === store.currentWeek,
  )

  const all = [
    ...printableLessons.map((p) => ({
      id: `${p.child.id}-${p.title}`,
      title: p.title,
      sub: `${p.child.name} · ${p.sub}`,
      subject: p.subject,
    })),
    ...printableResources.map((r) => ({
      id: r.id,
      title: r.title,
      sub: `${r.type} · Week ${r.weekNumber}`,
      subject: r.subject,
    })),
  ]
  const total = all.length

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => setPicked(new Set(all.map((a) => a.id)))
  const clearAll = () => setPicked(new Set())

  return (
    <div>
      <PageHeader
        eyebrow="Grab-and-Go"
        title="Print Center"
        description="Everything worth printing this week, in one place. Pick what you need, then hit Print."
      >
        <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-foreground">
          {picked.size}/{total} selected
        </span>
      </PageHeader>

      <div className="mb-5 flex flex-wrap gap-2">
        <Button variant="outline" onClick={selectAll} className="gap-1.5">
          <Check className="size-4" /> Select all
        </Button>
        <Button variant="ghost" onClick={clearAll}>
          Clear
        </Button>
      </div>

      {all.length === 0 ? (
        <Card className="p-8 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Printer className="size-6" />
          </span>
          <p className="mt-3 font-semibold text-foreground">Nothing to print this week</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No printable lessons or resources are tagged for Week {store.currentWeek}.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {all.map((item) => {
            const isPicked = picked.has(item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className={cn(
                  'flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors',
                  isPicked
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:bg-muted/50',
                )}
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                  style={accentBg('child-seraiah', 0.18)}
                >
                  <FileText className="size-5" style={{ color: 'var(--child-seraiah)' }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-foreground">{item.title}</span>
                  <span className="block text-sm text-muted-foreground">{item.sub}</span>
                </span>
                <span
                  className={cn(
                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                    isPicked
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-transparent',
                  )}
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>
              </button>
            )
          })}
        </div>
      )}

      {picked.size > 0 && (
        <div className="sticky bottom-20 mt-6 lg:bottom-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-foreground">
              {picked.size} page{picked.size === 1 ? '' : 's'} ready
            </p>
            <Button onClick={() => window.print()} className="gap-1.5">
              <Printer className="size-4" /> Print now
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}