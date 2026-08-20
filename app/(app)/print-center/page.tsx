'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { childrenInView, assignedLessonsFor } from '@/lib/selectors'
import { accentBg } from '@/lib/ui'
import { PageHeader } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, Check, FileText, BookOpen, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { packetUrlFor } from '@/lib/worksheet-packets'

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
        id: i.assignment.id,
        child,
        title: i.lesson.title,
        sub: `${i.lesson.minutes} min`,
        subject: i.lesson.subject,
        fileUrl: packetUrlFor(child.id, i.lesson.weekNumber, i.lesson.day) ?? undefined,
      })),
  )

  const inViewIds = new Set(inView.map((c) => c.id))
  const printableResources = store.resources.filter((r) => {
    if (r.weekNumber !== store.currentWeek) return false
    if (r.childId) return inViewIds.has(r.childId)
    return store.currentView === 'shared' || r.owner === 'shared' || r.owner === store.currentView
  })

  // Real daily worksheet packets — the actual PDFs to print, grouped by child.
  const dailyPackets = printableResources.filter((r) => r.type === 'Daily Packet' && r.fileUrl)
  const parentChecklists = printableResources.filter(
    (r) => r.type === 'Parent Checklist' && r.fileUrl,
  )

  const all = [
    ...printableLessons.map((p) => ({
      id: p.id,
      title: p.title,
      sub: `${p.child.name} · ${p.sub}`,
      subject: p.subject,
      fileUrl: p.fileUrl,
    })),
    ...printableResources
      .filter((r) => r.type !== 'Daily Packet' && r.type !== 'Parent Checklist')
      .map((r) => ({
        id: r.id,
        title: r.title,
        sub: `${r.type} · Week ${r.weekNumber}`,
        subject: r.subject,
        fileUrl: r.fileUrl,
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

  const DAY_LABEL: Record<string, string> = { Mon: 'Monday', Tue: 'Tuesday', Thu: 'Thursday', Fri: 'Friday' }
  const DAY_ORDER = ['Mon', 'Tue', 'Thu', 'Fri']
  const dayCode = (url: string) => url.split('/').pop()?.replace('.pdf', '') ?? ''

  const packetsByChild = inView
    .map((child) => ({
      child,
      packets: dailyPackets
        .filter((r) => r.childId === child.id)
        .slice()
        .sort((a, b) => DAY_ORDER.indexOf(dayCode(a.fileUrl!)) - DAY_ORDER.indexOf(dayCode(b.fileUrl!))),
    }))
    .filter((g) => g.packets.length > 0)

  const openAllPdfs = (urls: string[]) => {
    urls.forEach((url) => window.open(url, '_blank', 'noopener,noreferrer'))
  }

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

      {(packetsByChild.length > 0 || parentChecklists.length > 0) && (
        <section className="mb-6 space-y-4">
          {parentChecklists.map((checklist) => (
            <Card key={checklist.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <BookOpen className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-foreground">{checklist.title}</p>
                  <p className="text-sm text-muted-foreground">Sunday prep, materials & weekly rhythm — one page for the whole household.</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="gap-1.5"
                nativeButton={false}
                render={<a href={checklist.fileUrl} target="_blank" rel="noreferrer" />}
              >
                <Download className="size-4" /> Open checklist
              </Button>
            </Card>
          ))}

          {packetsByChild.map(({ child, packets }) => (
            <Card key={child.id} className="p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex size-9 items-center justify-center rounded-xl"
                    style={accentBg(child.color, 0.18)}
                  >
                    <FileText className="size-4" style={{ color: `var(--${child.color})` }} />
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{child.name}'s Week {store.currentWeek} packets</p>
                    <p className="text-xs text-muted-foreground">Bible, math & literacy — 4 ready-to-print days</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => openAllPdfs(packets.map((p) => p.fileUrl!))}
                >
                  <Printer className="size-4" /> Open all 4
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {packets.map((packet) => {
                  const code = dayCode(packet.fileUrl!)
                  return (
                    <a
                      key={packet.id}
                      href={packet.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1 rounded-xl border border-border bg-muted/40 px-3 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      <Download className="size-4 text-muted-foreground" />
                      {DAY_LABEL[code] ?? code}
                    </a>
                  )
                })}
              </div>
            </Card>
          ))}
        </section>
      )}

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
            <Button
              onClick={() => {
                const selected = all.filter((item) => picked.has(item.id))
                const withFiles = selected.filter((item) => item.fileUrl)
                if (withFiles.length > 0) {
                  openAllPdfs(withFiles.map((item) => item.fileUrl!))
                }
                if (withFiles.length < selected.length) {
                  window.print()
                }
              }}
              className="gap-1.5"
            >
              <Printer className="size-4" /> Print now
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}