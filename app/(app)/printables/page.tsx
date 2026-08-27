'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Printer,
  FileText,
  Star,
  Download,
  ChevronRight,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import {
  getWeeklyWorksheets,
  getChallengeWorksheets,
} from '@/lib/worksheets'
import { PageHeader, ChildAvatar } from '@/components/primitives'
import { cn } from '@/lib/utils'
import { dayLabels } from '@/lib/ui'
import type { DayName, GradeBand } from '@/lib/types'

type PrintMode = 'today' | 'week' | 'child-week' | 'archive'

export default function PrintablesPage() {
  const { children, currentWeek, currentDay, currentView } = useStore()
  const [mode, setMode] = useState<PrintMode>('today')
  const [selectedChild, setSelectedChild] = useState(children[0]?.id)
  const [selectedWeek, setSelectedWeek] = useState(currentWeek)
  const [includeChallenges, setIncludeChallenges] = useState(true)

  const inView = children.filter(
    (c) => currentView === 'shared' || c.householdId === currentView,
  )
  const selectedChildObj = children.find((c) => c.id === selectedChild)

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        eyebrow="Print Center"
        title="Generate Worksheets"
        description="Select what you need to print and download ready-to-use PDF packets."
      />

      {/* Mode Selector */}
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          onClick={() => setMode('today')}
          className={cn(
            'rounded-lg border-2 p-4 text-left transition-all',
            mode === 'today'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/30',
          )}
        >
          <p className="font-bold text-foreground">Print Today</p>
          <p className="text-sm text-muted-foreground">
            All worksheets for {dayLabels[currentDay as DayName]}
          </p>
        </button>

        <button
          onClick={() => setMode('week')}
          className={cn(
            'rounded-lg border-2 p-4 text-left transition-all',
            mode === 'week'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/30',
          )}
        >
          <p className="font-bold text-foreground">Print This Week</p>
          <p className="text-sm text-muted-foreground">Monday through Friday</p>
        </button>

        <button
          onClick={() => setMode('child-week')}
          className={cn(
            'rounded-lg border-2 p-4 text-left transition-all',
            mode === 'child-week'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/30',
          )}
        >
          <p className="font-bold text-foreground">Print Child + Week</p>
          <p className="text-sm text-muted-foreground">Custom selection</p>
        </button>

        <button
          onClick={() => setMode('archive')}
          className={cn(
            'rounded-lg border-2 p-4 text-left transition-all',
            mode === 'archive'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/30',
          )}
        >
          <p className="font-bold text-foreground">All Worksheets</p>
          <p className="text-sm text-muted-foreground">Browse entire archive</p>
        </button>
      </div>

      {/* Selectors for Custom Mode */}
      {mode === 'child-week' && (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-bold text-foreground mb-2">
              Child
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {inView.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} ({child.grade})
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-foreground mb-2">
              Week
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {Array.from({ length: 36 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Content Display */}
      {mode === 'today' && (
        <PrintToday
          inView={inView}
          week={currentWeek}
          day={currentDay as DayName}
          includeChallenges={includeChallenges}
        />
      )}

      {mode === 'week' && (
        <PrintWeek
          inView={inView}
          week={currentWeek}
          includeChallenges={includeChallenges}
        />
      )}

      {mode === 'child-week' && selectedChildObj && (
        <PrintChildWeek
          child={selectedChildObj}
          week={selectedWeek}
          includeChallenges={includeChallenges}
        />
      )}

      {mode === 'archive' && <PrintArchive includeChallenges={includeChallenges} />}

      {/* Challenges Toggle */}
      {mode !== 'archive' && (
        <label className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
          <input
            type="checkbox"
            checked={includeChallenges}
            onChange={(e) => setIncludeChallenges(e.target.checked)}
            className="size-4 rounded border-border"
          />
          <span className="text-sm font-medium text-foreground">
            Include optional challenge worksheets
          </span>
        </label>
      )}
    </div>
  )
}

function PrintToday({
  inView,
  week,
  day,
  includeChallenges,
}: {
  inView: ReturnType<typeof useStore>['children']
  week: number
  day: DayName
  includeChallenges: boolean
}) {
  if (inView.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">No children in current view.</p>
      </div>
    )
  }

  const days: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        📅 {dayLabels[day]} • Week {week}
      </p>
      {inView.map((child) => (
        <WorksheetGroup
          key={child.id}
          child={child}
          week={week}
          day={day}
          title={`${child.name}'s ${dayLabels[day]} Work`}
          includeChallenges={includeChallenges}
        />
      ))}
    </div>
  )
}

function PrintWeek({
  inView,
  week,
  includeChallenges,
}: {
  inView: ReturnType<typeof useStore>['children']
  week: number
  includeChallenges: boolean
}) {
  if (inView.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">No children in current view.</p>
      </div>
    )
  }

  const days: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

  return (
    <div className="space-y-6">
      {inView.map((child) => (
        <div key={child.id} className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <ChildAvatar child={child} />
            <h3 className="font-bold text-foreground">{child.name}</h3>
            <p className="text-xs text-muted-foreground ml-auto">Week {week}</p>
          </div>
          <div className="space-y-3">
            {days.map((day) => (
              <WorksheetGroup
                key={`${child.id}-${day}`}
                child={child}
                week={week}
                day={day}
                title={dayLabels[day]}
                compact
                includeChallenges={includeChallenges}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function PrintChildWeek({
  child,
  week,
  includeChallenges,
}: {
  child: ReturnType<typeof useStore>['children'][0]
  week: number
  includeChallenges: boolean
}) {
  const days: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-2">
          <ChildAvatar child={child} />
          <div>
            <h3 className="font-bold text-foreground">{child.name}</h3>
            <p className="text-sm text-muted-foreground">{child.grade}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Week {week}</p>
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <WorksheetGroup
            key={`${child.id}-${day}`}
            child={child}
            week={week}
            day={day}
            title={dayLabels[day]}
            includeChallenges={includeChallenges}
          />
        ))}
      </div>

      {/* Dual Copy Notice for Pre-K */}
      {child.gradeBand === 'pre-k' && (
        <div className="rounded-lg border border-secondary bg-secondary/10 p-4">
          <p className="text-sm font-medium text-foreground mb-1">
            📋 Pre-K Printing Note
          </p>
          <p className="text-xs text-muted-foreground">
            Seraiah & Amelia share the Pre-K curriculum. When printing, we automatically
            generate 2 copies of student worksheets while avoiding duplicate teacher
            pages.
          </p>
        </div>
      )}
    </div>
  )
}

function PrintArchive({ includeChallenges }: { includeChallenges: boolean }) {
  const { children } = useStore()
  const weeks = Array.from({ length: 36 }, (_, i) => i + 1)

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Browse and download any worksheet from the 36-week curriculum.
      </p>
      <div className="grid gap-4">
        {children.map((child) => (
          <div key={child.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <ChildAvatar child={child} />
              <h4 className="font-bold text-foreground">{child.name}</h4>
              <span className="text-xs text-muted-foreground">{child.grade}</span>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {weeks.map((week) => (
                <ArchiveWeekCard
                  key={`${child.id}-w${week}`}
                  child={child}
                  week={week}
                  includeChallenges={includeChallenges}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WorksheetGroup({
  child,
  week,
  day,
  title,
  compact = false,
  includeChallenges,
}: {
  child: ReturnType<typeof useStore>['children'][0]
  week: number
  day: DayName
  title: string
  compact?: boolean
  includeChallenges: boolean
}) {
  const worksheets = getWeeklyWorksheets(week, child.gradeBand as GradeBand, false)
    .filter((ws) => ws.day === day)
  const challenges = includeChallenges
    ? getChallengeWorksheets(week, child.gradeBand as GradeBand).filter(
        (ws) => ws.day === day,
      )
    : []

  if (worksheets.length === 0 && challenges.length === 0) {
    return (
      <div className={cn(
        'rounded-lg border border-dashed border-border p-3 text-center',
        compact && 'text-sm',
      )}>
        <p className="text-muted-foreground">No worksheets assigned</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4',
        !compact && 'space-y-4',
      )}
    >
      {!compact && <h4 className="font-bold text-foreground">{title}</h4>}

      {/* Required Worksheets */}
      {worksheets.length > 0 && (
        <div className="space-y-2">
          {!compact && (
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Required
            </p>
          )}
          {worksheets.map((ws) => (
            <WorksheetLink key={ws.id} worksheet={ws} isDual={child.gradeBand === 'pre-k'} />
          ))}
        </div>
      )}

      {/* Challenge Worksheets */}
      {challenges.length > 0 && (
        <div className="space-y-2 border-t border-border/30 pt-3">
          {!compact && (
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Optional Challenge
            </p>
          )}
          {challenges.map((ws) => (
            <WorksheetLink key={ws.id} worksheet={ws} isChallenge isDual={child.gradeBand === 'pre-k'} />
          ))}
        </div>
      )}
    </div>
  )
}

function ArchiveWeekCard({
  child,
  week,
  includeChallenges,
}: {
  child: ReturnType<typeof useStore>['children'][0]
  week: number
  includeChallenges: boolean
}) {
  const worksheets = getWeeklyWorksheets(week, child.gradeBand as GradeBand, false)
  const challengeCount = includeChallenges
    ? getChallengeWorksheets(week, child.gradeBand as GradeBand).length
    : 0

  return (
    <Link
      href="#"
      className="rounded-lg border border-border bg-card p-3 hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-foreground">Week {week}</p>
          <p className="text-xs text-muted-foreground">
            {worksheets.length} worksheets{includeChallenges && ` + ${challengeCount} challenges`}
          </p>
        </div>
        <Download className="size-4 text-muted-foreground" />
      </div>
    </Link>
  )
}

function WorksheetLink({
  worksheet,
  isChallenge = false,
  isDual = false,
}: {
  worksheet: ReturnType<typeof getWeeklyWorksheets>[0]
  isChallenge?: boolean
  isDual?: boolean
}) {
  return (
    <a
      href={worksheet.fileUrl}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 p-3 hover:bg-muted/40 transition-colors"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isChallenge && <Star className="size-4 text-secondary flex-shrink-0" />}
        <FileText className="size-4 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {worksheet.title}
          </p>
          {isDual && (
            <p className="text-xs text-muted-foreground">2 copies will print</p>
          )}
        </div>
      </div>
      <ChevronRight className="size-4 text-muted-foreground flex-shrink-0" />
    </a>
  )
}
