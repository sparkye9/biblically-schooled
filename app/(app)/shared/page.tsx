'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { accentBg } from '@/lib/ui'
import { PageHeader, ChildAvatar, StatChip } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Check,
  HeartHandshake,
  Share2,
  Sparkles,
  Users2,
  Home,
} from 'lucide-react'

export default function SharedPlanningPage() {
  const store = useStore()
  const totalChildren = store.children.length
  const sharedResources = store.resources.filter((r) => r.owner === 'shared')

  return (
    <div>
      <PageHeader
        eyebrow="Co-op"
        title="Shared Planning"
        description="Plan together across every family. See who's teaching, cover for each other on hard days, and share the resources you've made."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatChip label="Families" value={String(store.households.length)} />
        <StatChip label="Children" value={String(totalChildren)} />
        <StatChip label="Shared resources" value={String(sharedResources.length)} />
        <StatChip
          label="Week"
          value={`#${store.currentWeek}`}
        />
      </div>

      <div className="space-y-8">
        <CoverageSection />
        <FamiliesSection />
        <SharedResourcesSection />
      </div>
    </div>
  )
}

function CoverageSection() {
  const store = useStore()
  const [reason, setReason] = useState('')
  const active = store.households.find((h) => h.id === store.activeMomHouseholdId)
  const open = store.coverageRequests.filter((c) => !c.resolved)

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-semibold text-foreground">
        <HeartHandshake className="size-5 text-primary" /> Coverage & care
      </h2>

      <Card className="mb-4 p-5">
        <p className="text-sm text-muted-foreground">
          Rough morning? Let the co-op know you&apos;re out and someone can pick up
          your children&apos;s essentials.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            store.requestCoverage(store.activeMomHouseholdId, reason.trim())
            setReason('')
          }}
          className="mt-3 flex flex-col gap-2 sm:flex-row"
        >
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Reason (e.g. ${active?.momName ?? 'I'} am home sick)`}
            className="flex-1"
          />
          <Button type="submit" className="gap-1.5">
            <HeartHandshake className="size-4" /> Request coverage
          </Button>
        </form>
      </Card>

      {open.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
          No open coverage requests — everyone&apos;s good today.
        </p>
      ) : (
        <ul className="space-y-3">
          {open.map((req) => {
            const from = store.households.find((h) => h.id === req.fromHouseholdId)
            const isMine = req.fromHouseholdId === store.activeMomHouseholdId
            const helping = req.helpers.includes(store.activeMomHouseholdId)
            return (
              <li key={req.id}>
                <Card className="flex flex-col gap-3 border-accent bg-accent/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <HeartHandshake className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {from?.momName ?? 'A mom'} needs coverage
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {req.reason || 'Out today — could use a hand with school.'}
                      </p>
                      {req.helpers.length > 0 && (
                        <p className="mt-1 text-xs font-semibold text-foreground">
                          {req.helpers
                            .map(
                              (h) =>
                                store.households.find((x) => x.id === h)?.momName,
                            )
                            .filter(Boolean)
                            .join(', ')}{' '}
                          offered to help
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2 pl-12 sm:pl-0">
                    {isMine ? (
                      <Button size="sm" onClick={() => store.resolveCoverage(req.id)}>
                        <Check className="size-4" /> I&apos;m back
                      </Button>
                    ) : helping ? (
                      <Button size="sm" variant="secondary" disabled>
                        <Check className="size-4" /> You&apos;re helping
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() =>
                          store.offerHelp(req.id, store.activeMomHouseholdId)
                        }
                      >
                        <HeartHandshake className="size-4" /> I can help
                      </Button>
                    )}
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function FamiliesSection() {
  const store = useStore()

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-semibold text-foreground">
        <Users2 className="size-5 text-primary" /> Families in the co-op
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
                {h.away && (
                  <Badge className="border-0 bg-accent text-accent-foreground">
                    Away
                  </Badge>
                )}
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
  )
}

function SharedResourcesSection() {
  const store = useStore()
  const shared = store.resources.filter((r) => r.owner === 'shared')

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-serif text-xl font-semibold text-foreground">
        <Share2 className="size-5 text-primary" /> Shared by the co-op
      </h2>
      {shared.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
          No shared resources yet. Contribute one from the Printables page.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shared.map((r) => (
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
  )
}
