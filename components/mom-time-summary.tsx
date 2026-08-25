'use client'

import { Coffee } from 'lucide-react'
import { useStore } from '@/lib/store'
import { calculateMomTime, totalMomTimeMinutes, childrenInView } from '@/lib/selectors'
import { ChildAvatar } from './primitives'
import { cn } from '@/lib/utils'

export function MomTimeSummary() {
  const { children, assignments, lessons, currentView, currentWeek, currentDay } =
    useStore()
  const inView = childrenInView(children, currentView)
  const sessions = calculateMomTime(inView, assignments, lessons, currentWeek, currentDay)
  const totalMinutes = totalMomTimeMinutes(sessions)

  if (sessions.length === 0) {
    return null
  }

  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)
  const timeLabel =
    hours > 0
      ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`
      : `${minutes}m`

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-momtime/12 text-momtime">
            <Coffee className="size-4" />
          </span>
          <div>
            <p className="font-bold leading-tight text-foreground">
              Mom time needed: {timeLabel}
            </p>
            <p className="text-xs text-muted-foreground">
              One-on-one lessons to do today
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {sessions.map((session) => {
          const child = children.find((c) => c.id === session.childId)
          return (
            <div
              key={`${session.childId}-${session.lesson.id}`}
              className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                {child && <ChildAvatar child={child} />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{session.lesson.title}</p>
                </div>
              </div>
              <span className="shrink-0 whitespace-nowrap rounded-full bg-momtime/15 px-2.5 py-1 text-xs font-semibold text-momtime">
                {session.minutes}m
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
