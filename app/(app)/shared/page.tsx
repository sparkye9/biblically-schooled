'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { accentBg } from '@/lib/ui'
import { PageHeader } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { HeartHandshake, Check, Share2, Users2, Sparkles } from 'lucide-react'

export default function SharedPage() {
  const store = useStore()
  const {
    households,
    coverageRequests,
    activeMomHouseholdId,
    requestCoverage,
    offerHelp,
    resolveCoverage,
    addResource,
    resources,
  } = store

  const [reason, setReason] = useState('')
  const [title, setTitle] = useState('')
  const [skill, setSkill] = useState('')
  const openRequests = coverageRequests.filter((c) => !c.resolved)

  const submitCoverage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return
    requestCoverage(activeMomHouseholdId, reason.trim())
    setReason('')
  }

  const shareResource = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const mom = households.find((h) => h.id === activeMomHouseholdId)?.momName ?? 'Family'
    addResource({
      title: title.trim(),
      type: 'Worksheet',
      subject: 'review',
      skill: skill.trim() || 'General practice',
      gradeBand: 'pre-k',
      weekNumber: store.currentWeek,
      minutes: 10,
      owner: 'shared',
      contributor: mom,
      saved: true,
    })
    setTitle('')
    setSkill('')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Together"
        title="Shared Planning"
        description="Two families, one week. Request coverage when someone is out, and share resources everyone can use."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Coverage */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <HeartHandshake className="size-5" />
              </span>
              <div>
                <h2 className="font-serif text-lg font-semibold">Coverage requests</h2>
                <p className="text-sm text-muted-foreground">
                  Let the other family know you need a hand today.
                </p>
              </div>
            </div>

            <form onSubmit={submitCoverage} className="flex flex-col gap-2">
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Lola is sick — could use a hand with school today."
                className="min-h-20"
              />
              <Button type="submit" disabled={!reason.trim()} className="gap-1.5 self-start">
                <HeartHandshake className="size-4" /> Ask for coverage
              </Button>
            </form>
          </Card>

          <div className="space-y-3">
            {openRequests.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                No open coverage requests. Everyone&apos;s covered.
              </p>
            ) : (
              openRequests.map((req) => {
                const from = households.find((h) => h.id === req.fromHouseholdId)
                const isMine = req.fromHouseholdId === activeMomHouseholdId
                const helping = req.helpers.includes(activeMomHouseholdId)
                return (
                  <Card key={req.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <Users2 className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-foreground">
                          {from?.momName ?? 'A mom'} needs coverage
                        </p>
                        <p className="text-sm text-muted-foreground">{req.reason}</p>
                        {req.helpers.length > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {req.helpers
                              .map((h) => households.find((x) => x.id === h)?.momName)
                              .filter(Boolean)
                              .join(', ')}{' '}
                            offered to help.
                          </p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {isMine ? (
                          <Button size="sm" onClick={() => resolveCoverage(req.id)}>
                            <Check className="size-4" /> I&apos;m back
                          </Button>
                        ) : helping ? (
                          <Button size="sm" variant="secondary" disabled>
                            <Check className="size-4" /> Helping
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => offerHelp(req.id, activeMomHouseholdId)}
                          >
                            <HeartHandshake className="size-4" /> I can help
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {/* Shared resources */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Share2 className="size-5" />
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold">Share a resource</h2>
                <p className="text-sm text-muted-foreground">
                  Post a worksheet idea both families can use this week.
                </p>
              </div>
            </div>
            <form onSubmit={shareResource} className="flex flex-col gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Resource title, e.g. Short A word sort"
              />
              <Input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="Skill or topic (optional)"
              />
              <Button type="submit" disabled={!title.trim()} className="gap-1.5 self-start">
                <Sparkles className="size-4" /> Share with families
              </Button>
            </form>
          </Card>

          <div className="space-y-3">
            <h3 className="font-serif text-lg font-semibold">Shared this week</h3>
            {resources.filter((r) => r.owner === 'shared').length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                No shared resources yet — post one above.
              </p>
            ) : (
              resources
                .filter((r) => r.owner === 'shared')
                .map((r) => (
                  <Card key={r.id} className="flex items-center gap-3 p-4">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                      style={accentBg('child-seraiah', 0.18)}
                    >
                      <Sparkles className="size-5" style={{ color: 'var(--child-seraiah)' }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-foreground">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.type} · {r.skill} · Week {r.weekNumber}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      by {r.contributor}
                    </p>
                  </Card>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}