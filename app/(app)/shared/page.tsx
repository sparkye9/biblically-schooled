'use client'

import { useStore } from '@/lib/store'
import { accentBg } from '@/lib/ui'
import { PageHeader, ChildAvatar, StatChip } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Share2, Sparkles, Users2, Home } from 'lucide-react'

export default function SharedPage() {
  const store = useStore()
  const sharedResources = store.resources.filter((r) => r.owner === 'shared')

  return (
    <div>
      <PageHeader
        eyebrow="Together"
        title="Shared Planning"
        description="You each run your own homeschool, but you can pool the lessons and printables you've made. See both families at a glance and share what's working."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatChip label="Families" value={String(store.households.length)} />
        <StatChip label="Children" value={String(store.children.length)} />
        <StatChip label="Shared resources" value={String(sharedResources.length)} />
        <StatChip label="Week" value={`#${store.currentWeek}`} />
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-semibold text-foreground">
            <Users2 className="size-5 text-primary" /> Both homeschools
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {store.households.map((h) => {
              const kids = store.children.filter((c) => c.householdId === h.id)
              return (
                <Card key={h.id} className="p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-lg font-bold text-primary">
                      {h.momInitial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-lg font-semibold text-foreground">
                        {h.momName}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Home className="size-3" /> {h.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {kids.length === 0 ? (
                      <span className="text-sm text-muted-foreground">
                        No children yet.
                      </span>
                    ) : (
                      kids.map((child) => (
                        <span
                          key={child.id}
                          className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3"
                        >
                          <ChildAvatar child={child} size="sm" />
                          <span className="text-sm font-semibold text-foreground">
                            {child.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {child.grade}
                          </span>
                        </span>
                      ))
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-semibold text-foreground">
            <Share2 className="size-5 text-primary" /> Shared between you
          </h2>
          {sharedResources.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
              No shared resources yet. Contribute one from the Printables page.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sharedResources.map((r) => (
                <Card key={r.id} className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                      style={accentBg('momtime', 0.16)}
                    >
                      {r.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{r.minutes} min</span>
                  </div>
                  <p className="font-bold leading-snug text-foreground">{r.title}</p>
                  <p className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Sparkles className="size-3 text-primary" />
                    Shared by {r.contributor}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
