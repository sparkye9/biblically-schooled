'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { childrenInView, assignedLessonsFor, countDone } from '@/lib/selectors'
import { skillStatusMeta, accentBg, accent } from '@/lib/ui'
import { PageHeader, ChildAvatar, ProgressRing } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Sparkles, EyeOff } from 'lucide-react'

export default function ChildrenPage() {
  const store = useStore()
  const kids = childrenInView(store.children, store.currentView)

  return (
    <div>
      <PageHeader
        eyebrow="Learners"
        title="Children"
        description="Each child has their own pace, colors, and skill journey. Turn on Child Mode to hand them the screen."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {kids.map((child) => {
          const household = store.households.find((h) => h.id === child.householdId)
          const items = assignedLessonsFor(child.id, store.assignments, store.lessons, {
            week: store.currentWeek,
            day: store.currentDay,
          })
          const { done, total } = countDone(items)
          const childSkills = store.skills.filter((s) => s.childId === child.id)
          const mastered = childSkills.filter((s) => s.status === 'mastered').length

          return (
            <Card key={child.id} className="overflow-hidden p-0">
              <div
                className="flex items-center gap-4 p-5"
                style={accentBg(child.color, 0.1)}
              >
                <ChildAvatar child={child} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-semibold text-foreground">
                      {child.name}
                    </h2>
                    {child.childMode && (
                      <Badge
                        className="gap-1 border-0"
                        style={accentBg(child.color, 0.2)}
                      >
                        <Sparkles className="size-3" /> Child Mode
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {child.grade} · {household?.momName}
                  </p>
                </div>
                <ProgressRing value={done} total={total} color={child.color} size={56} />
              </div>

              <div className="space-y-4 p-5">
                <div className="flex flex-wrap gap-2">
                  {childSkills.slice(0, 4).map((s) => {
                    const meta = skillStatusMeta[s.status]
                    return (
                      <span
                        key={s.id}
                        className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={accentBg(meta.token, 0.16)}
                      >
                        {s.name}
                      </span>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="size-4 text-primary" />
                    <span className="font-medium text-foreground">Child Mode</span>
                    <span className="text-muted-foreground">— big, tappable, kid-safe</span>
                  </div>
                  <Switch
                    checked={child.childMode}
                    onCheckedChange={(v) => store.setChildMode(child.id, v)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    <EyeOff className="size-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Low-distraction</span>
                    <span className="text-muted-foreground">— one task at a time</span>
                  </div>
                  <Switch
                    checked={child.lowDistraction}
                    onCheckedChange={(v) => store.setLowDistraction(child.id, v)}
                  />
                </div>

                <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
                  <span>
                    <b className="text-foreground">{mastered}</b> skills mastered
                  </span>
                  <span>
                    <b className="text-foreground">{childSkills.length}</b> in progress
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href="/progress"
                    className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    View progress <ChevronRight className="size-4" />
                  </Link>
                  {child.childMode && (
                    <Link
                      href={`/kid/${child.id}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2.5 text-sm font-semibold text-white"
                      style={{ backgroundColor: `var(--${child.color})` }}
                    >
                      Open kid screen
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
