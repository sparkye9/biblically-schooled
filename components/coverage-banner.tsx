'use client'

import { HeartHandshake, Check } from 'lucide-react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

export function CoverageBanner() {
  const {
    coverageRequests,
    households,
    activeMomHouseholdId,
    offerHelp,
    resolveCoverage,
  } = useStore()

  const open = coverageRequests.filter((c) => !c.resolved)
  if (open.length === 0) return null

  return (
    <div className="space-y-2 px-4 pt-3 sm:px-6">
      {open.map((req) => {
        const from = households.find((h) => h.id === req.fromHouseholdId)
        const isMine = req.fromHouseholdId === activeMomHouseholdId
        const helping = req.helpers.includes(activeMomHouseholdId)
        return (
          <div
            key={req.id}
            className="flex flex-col gap-3 rounded-2xl border border-accent bg-accent/40 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <HeartHandshake className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {from?.momName ?? 'A mom'} needs coverage
                </p>
                <p className="text-sm text-muted-foreground">
                  {req.reason || 'Out sick — could use a hand with school today.'}
                  {req.helpers.length > 0 && (
                    <>
                      {' '}
                      <span className="font-semibold text-foreground">
                        {req.helpers
                          .map((h) => households.find((x) => x.id === h)?.momName)
                          .filter(Boolean)
                          .join(', ')}{' '}
                        offered to help.
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2 pl-12 sm:pl-0">
              {isMine ? (
                <Button size="sm" onClick={() => resolveCoverage(req.id)}>
                  <Check className="size-4" /> I&apos;m back
                </Button>
              ) : helping ? (
                <Button size="sm" variant="secondary" disabled>
                  <Check className="size-4" /> You&apos;re helping
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
        )
      })}
    </div>
  )
}
