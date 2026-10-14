'use client'

import { useMemo } from 'react'
import { seasonFor } from './curriculum/bible'
import { buildDayPlan, type DayPlan } from './plan/day-plan'
import { WEEKDAY_LABELS, breakOn, type DayKind } from './plan/schedule'
import * as logic from './state/logic'
import { useStore } from './store'

export interface TodayInfo {
  plan: DayPlan
  kind: DayKind
  /** Why today isn't a school day, if it isn't. */
  reason: string | null
  /** True when the plan should be shown (a school day, or "teach anyway"). */
  teaching: boolean
  welcomeBack: boolean
  weekdayLabel: string
}

/** The plan for today for the children in view — shared by Today, kid mode, and printing. */
export function useTodayPlan(): TodayInfo {
  const store = useStore()
  const { todayIso, now } = store
  return useMemo(() => {
    const kind = logic.todayKind(store, todayIso)
    const { mode, easy } = logic.modeFor(store, todayIso)
    const anyway = store.todayChoice?.date === todayIso && !!store.todayChoice.anyway
    const welcomeBack = !!store.welcomeBackPending
    const index = welcomeBack ? logic.welcomeBackIndex(store.pointer) : store.pointer
    const brk = breakOn(todayIso, store.breaks)
    const scheduled = store.schedule[now.getDay()]
    const plan = buildDayPlan({
      index,
      mode,
      easy,
      learners: store.childrenInView.map(logic.learnerOf),
      enrichment: kind === 'school' ? scheduled.enrichment : null,
      date: now,
      useSeasonal: store.preferSeasonal && !!seasonFor(now),
      keyPrefix: welcomeBack ? logic.WELCOME_BACK_PREFIX : '',
    })
    const weekdayLabel = WEEKDAY_LABELS[now.getDay()]
    const reason =
      kind === 'school'
        ? null
        : brk
          ? `On break${brk.label ? ` — ${brk.label}` : ''}`
          : kind === 'coop'
            ? `${weekdayLabel} is co-op day`
            : `${weekdayLabel} is a rest day`
    return { plan, kind, reason, teaching: kind === 'school' || anyway, welcomeBack, weekdayLabel }
  }, [store, todayIso, now])
}
