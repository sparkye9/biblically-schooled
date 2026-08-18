'use client'

import { useMemo, useState } from 'react'
import { useStore } from '@/lib/store'
import { subjectMeta } from '@/lib/ui'
import { childrenInView } from '@/lib/selectors'
import { PageHeader, StatChip } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { FileText, Printer, Sparkles } from 'lucide-react'

interface PrintItem {
  id: string
  title: string
  meta: string
  group: 'Lesson packets' | 'Saved printables' | 'Supply prep'
}

export default function PrintCenterPage() {
  const store = useStore()

  const items = useMemo<PrintItem[]>(() => {
    const kids = childrenInView(store.children, store.currentView)
    const childIds = new Set(kids.map((c) => c.id))

    // Printable lessons assigned to children in view, for the current week
    const lessonIds = new Set(
      store.assignments
        .filter((a) => childIds.has(a.childId))
        .map((a) => a.lessonId),
    )
    const lessonItems: PrintItem[] = store.lessons
      .filter(
        (l) =>
          l.printable &&
          l.weekNumber === store.currentWeek &&
          lessonIds.has(l.id),
      )
      .map((l) => ({
        id: `lesson-${l.id}`,
        title: l.title,
        meta: `${subjectMeta[l.subject].label} · ${l.minutes} min`,
        group: 'Lesson packets',
      }))

    // Saved printables from the basket
    const resourceItems: PrintItem[] = store.resources
      .filter((r) => r.saved)
      .map((r) => ({
        id: `res-${r.id}`,
        title: r.title,
        meta: `${r.type} · by ${r.contributor}`,
        group: 'Saved printables',
      }))

    // Supplies that need printing
    const supplyItems: PrintItem[] = store.supplies
      .filter((s) => s.section === 'print')
      .map((s) => ({
        id: `supply-${s.id}`,
        title: s.label,
        meta: 'From your supply list',
        group: 'Supply prep',
      }))

    return [...lessonItems, ...resourceItems, ...supplyItems]
  }, [store.children, store.currentView, store.assignments, store.lessons, store.resources, store.supplies, store.currentWeek])

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(items.map((i) => i.id)),
  )

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const groups: PrintItem['group'][] = [
    'Lesson packets',
    'Saved printables',
    'Supply prep',
  ]
  const selectedCount = items.filter((i) => selected.has(i.id)).length
  const allSelected = selectedCount === items.length && items.length > 0

  return (
    <div>
      <PageHeader
        eyebrow="Prep Once"
        title="Print Center"
        description="Everything you need on paper for the week, gathered in one place. Pick what to print, then send it to your printer in a single batch."
      >
        <Button
          className="gap-1.5"
          onClick={() => window.print()}
          disabled={selectedCount === 0}
        >
          <Printer className="size-4" /> Print {selectedCount || ''} selected
        </Button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatChip label="To print" value={String(items.length)} />
        <StatChip label="Selected" value={String(selectedCount)} />
        <StatChip label="Week" value={`#${store.currentWeek}`} />
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
          Nothing to print yet. Save some printables or check your supply list.
        </p>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setSelected(
                  allSelected ? new Set() : new Set(items.map((i) => i.id)),
                )
              }
            >
              {allSelected ? 'Clear all' : 'Select all'}
            </Button>
          </div>

          <div className="space-y-6">
            {groups.map((group) => {
              const groupItems = items.filter((i) => i.group === group)
              if (groupItems.length === 0) return null
              const Icon = group === 'Supply prep' ? Sparkles : FileText
              return (
                <section key={group}>
                  <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
                    <Icon className="size-4 text-primary" /> {group}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({groupItems.length})
                    </span>
                  </h2>
                  <Card className="divide-y divide-border p-0">
                    {groupItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                      >
                        <Checkbox
                          checked={selected.has(item.id)}
                          onCheckedChange={() => toggle(item.id)}
                        />
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-foreground">
                            {item.title}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {item.meta}
                          </span>
                        </span>
                      </label>
                    ))}
                  </Card>
                </section>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
