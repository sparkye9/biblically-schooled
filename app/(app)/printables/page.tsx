'use client'

import { useMemo, useState } from 'react'
import { useStore } from '@/lib/store'
import { accentBg } from '@/lib/ui'
import { PageHeader } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Bookmark, BookmarkCheck, Plus, Printer, Search } from 'lucide-react'
import type { GradeBand, Resource, ResourceType, Subject } from '@/lib/types'

const GRADE_LABELS: Record<GradeBand | 'all', string> = {
  all: 'All grades',
  'pre-k': 'Pre-K',
  k: 'Kindergarten',
  '1st': '1st Grade',
}

const RESOURCE_TYPES: ResourceType[] = [
  'Worksheet',
  'Tracing',
  'Mini Book',
  'Flash Cards',
  'Cut & Paste',
  'Reading Passage',
  'Math Practice',
  'Coloring',
  'Science',
  'Art',
  'Bible',
]

const SUBJECTS: Subject[] = ['bible', 'math', 'literacy', 'science', 'art']

export default function PrintablesPage() {
  const store = useStore()
  const [query, setQuery] = useState('')
  const [grade, setGrade] = useState<GradeBand | 'all'>('all')
  const [savedOnly, setSavedOnly] = useState(false)

  const filtered = useMemo(() => {
    return store.resources.filter((r) => {
      if (savedOnly && !r.saved) return false
      if (grade !== 'all' && r.gradeBand !== grade) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        if (
          !r.title.toLowerCase().includes(q) &&
          !r.skill.toLowerCase().includes(q) &&
          !r.type.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [store.resources, savedOnly, grade, query])

  const savedCount = store.resources.filter((r) => r.saved).length

  return (
    <div>
      <PageHeader
        eyebrow="Ready to Print"
        title="Printables"
        description="Worksheets, tracing pages, mini books, and flash cards contributed by your co-op. Save the ones you want, then send them to the Print Center."
      >
        <Button
          variant={savedOnly ? 'default' : 'outline'}
          className="gap-1.5"
          onClick={() => setSavedOnly((v) => !v)}
        >
          <Bookmark className="size-4" /> Saved ({savedCount})
        </Button>
      </PageHeader>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, skill, or type…"
              className="h-10 pl-9"
            />
          </div>
          <Select value={grade} onValueChange={(v) => setGrade(v as GradeBand | 'all')}>
            <SelectTrigger className="h-10 w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(GRADE_LABELS) as (GradeBand | 'all')[]).map((g) => (
                <SelectItem key={g} value={g}>
                  {GRADE_LABELS[g]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
          No printables match your filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              onToggle={() => store.toggleResourceSaved(r.id)}
            />
          ))}
        </div>
      )}

      <ContributeForm />
    </div>
  )
}

function ResourceCard({
  resource,
  onToggle,
}: {
  resource: Resource
  onToggle: () => void
}) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={accentBg('momtime', 0.16)}
        >
          {resource.type}
        </span>
        <button
          onClick={onToggle}
          aria-pressed={!!resource.saved}
          aria-label={resource.saved ? 'Remove from saved' : 'Save printable'}
          className={cn(
            'flex size-8 items-center justify-center rounded-full transition-colors',
            resource.saved
              ? 'bg-primary text-primary-foreground'
              : 'border border-border text-muted-foreground hover:bg-muted',
          )}
        >
          {resource.saved ? (
            <BookmarkCheck className="size-4" />
          ) : (
            <Bookmark className="size-4" />
          )}
        </button>
      </div>
      <div>
        <p className="font-bold leading-snug text-foreground">{resource.title}</p>
        <p className="text-xs text-muted-foreground">{resource.skill}</p>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="font-semibold">
          {GRADE_LABELS[resource.gradeBand]} · {resource.minutes} min
        </span>
        <span>by {resource.contributor}</span>
      </div>
    </Card>
  )
}

function ContributeForm() {
  const store = useStore()
  const [title, setTitle] = useState('')
  const [type, setType] = useState<ResourceType>('Worksheet')
  const [subject, setSubject] = useState<Subject>('literacy')
  const [gradeBand, setGradeBand] = useState<GradeBand>('pre-k')
  const [skill, setSkill] = useState('')

  const active = store.households.find((h) => h.id === store.activeMomHouseholdId)

  return (
    <Card className="mt-8 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <Plus className="size-4" />
        </span>
        <div>
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Contribute a printable
          </h2>
          <p className="text-xs text-muted-foreground">
            Add one to the shared basket for the whole co-op.
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!title.trim()) return
          store.addResource({
            title: title.trim(),
            type,
            subject,
            skill: skill.trim() || 'General',
            gradeBand,
            weekNumber: store.currentWeek,
            minutes: 10,
            owner: 'shared',
            contributor: active?.momName ?? 'You',
            saved: true,
          })
          setTitle('')
          setSkill('')
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="res-title">Title</Label>
          <Input
            id="res-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Short E Word Family Cards"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="res-skill">Skill / focus</Label>
          <Input
            id="res-skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="e.g. Short E"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as ResourceType)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESOURCE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Select value={subject} onValueChange={(v) => setSubject(v as Subject)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Grade</Label>
          <Select
            value={gradeBand}
            onValueChange={(v) => setGradeBand(v as GradeBand)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(['pre-k', 'k', '1st'] as GradeBand[]).map((g) => (
                <SelectItem key={g} value={g}>
                  {GRADE_LABELS[g]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end sm:col-span-2">
          <Button type="submit" className="w-full gap-1.5" disabled={!title.trim()}>
            <Printer className="size-4" /> Add to shared basket
          </Button>
        </div>
      </form>
    </Card>
  )
}
