'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { childrenInView } from '@/lib/selectors'
import { subjectMeta } from '@/lib/ui'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  ActivityType,
  CurriculumWeek,
  DayName,
  GradeBand,
  Subject,
} from '@/lib/types'
import { Check, Pencil, Plus, Trash2 } from 'lucide-react'

const DAYS: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const SUBJECTS: Subject[] = ['bible', 'math', 'literacy', 'science', 'art', 'review']
const ACTIVITIES: { value: ActivityType; label: string }[] = [
  { value: 'mom-time', label: 'Mom Time' },
  { value: 'independent', label: 'Independent' },
  { value: 'hands-on', label: 'Hands-On' },
  { value: 'optional', label: 'Optional' },
]
const GRADES: { value: GradeBand; label: string }[] = [
  { value: 'pre-k', label: 'Pre-K' },
  { value: 'k', label: 'Kindergarten' },
  { value: '1st', label: '1st Grade' },
]

export function ManageWeekDialog() {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const week = store.weeks.find((w) => w.number === store.currentWeek)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="gap-1.5">
            <Pencil className="size-4" /> Manage week
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            Manage Week {store.currentWeek}
          </DialogTitle>
          <DialogDescription>
            Edit this week&apos;s theme and verse, then add, adjust, or remove
            lessons.
          </DialogDescription>
        </DialogHeader>

        {week && <WeekDetails key={week.id} week={week} />}
        <LessonManager />
      </DialogContent>
    </Dialog>
  )
}

function WeekDetails({ week }: { week: CurriculumWeek }) {
  const store = useStore()
  const [theme, setTheme] = useState(week.theme)
  const [bigIdea, setBigIdea] = useState(week.bigIdea)
  const [bibleRef, setBibleRef] = useState(week.bibleRef)
  const [memoryVerse, setMemoryVerse] = useState(week.memoryVerse)
  const [memoryVerseRef, setMemoryVerseRef] = useState(week.memoryVerseRef)
  const [saved, setSaved] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        store.updateWeek(week.id, {
          theme: theme.trim(),
          bigIdea: bigIdea.trim(),
          bibleRef: bibleRef.trim(),
          memoryVerse: memoryVerse.trim(),
          memoryVerseRef: memoryVerseRef.trim(),
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 1800)
      }}
      className="space-y-3 rounded-xl border border-border p-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="wk-theme">Theme</Label>
        <Input
          id="wk-theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="wk-idea">Big idea</Label>
        <Textarea
          id="wk-idea"
          rows={2}
          value={bigIdea}
          onChange={(e) => setBigIdea(e.target.value)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="wk-ref">Bible reference</Label>
          <Input
            id="wk-ref"
            value={bibleRef}
            onChange={(e) => setBibleRef(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wk-vref">Memory verse ref</Label>
          <Input
            id="wk-vref"
            value={memoryVerseRef}
            onChange={(e) => setMemoryVerseRef(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="wk-verse">Memory verse</Label>
        <Textarea
          id="wk-verse"
          rows={2}
          value={memoryVerse}
          onChange={(e) => setMemoryVerse(e.target.value)}
        />
      </div>
      <Button type="submit" size="sm" className="gap-1.5">
        {saved ? <Check className="size-4" /> : null}
        {saved ? 'Saved' : 'Save week details'}
      </Button>
    </form>
  )
}

function LessonManager() {
  const store = useStore()
  const lessons = store.lessons
    .filter((l) => l.weekNumber === store.currentWeek)
    .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))

  return (
    <div className="space-y-3">
      <h3 className="font-serif text-base font-semibold text-foreground">
        Lessons ({lessons.length})
      </h3>
      <ul className="space-y-2">
        {lessons.map((l) => (
          <LessonRow key={l.id} lessonId={l.id} />
        ))}
      </ul>
      <AddLessonForm />
    </div>
  )
}

function LessonRow({ lessonId }: { lessonId: string }) {
  const store = useStore()
  const lesson = store.lessons.find((l) => l.id === lessonId)
  const [editing, setEditing] = useState(false)
  if (!lesson) return null

  const { Icon } = subjectMeta[lesson.subject]
  const assignedCount = store.assignments.filter(
    (a) => a.lessonId === lesson.id,
  ).length

  if (!editing) {
    return (
      <li className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {lesson.title}
          </p>
          <p className="text-xs capitalize text-muted-foreground">
            {lesson.day} · {lesson.minutes}m · {assignedCount}{' '}
            {assignedCount === 1 ? 'child' : 'children'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Edit lesson"
          onClick={() => setEditing(true)}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Delete lesson"
          onClick={() => store.deleteLesson(lesson.id)}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </li>
    )
  }

  return (
    <li className="space-y-2 rounded-lg border border-primary/30 bg-primary/[0.03] p-3">
      <Input
        value={lesson.title}
        onChange={(e) => store.updateLesson(lesson.id, { title: e.target.value })}
        className="h-8"
      />
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={lesson.day}
          onValueChange={(v) => store.updateLesson(lesson.id, { day: v as DayName })}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAYS.map((d) => (
              <SelectItem key={d} value={d} className="capitalize">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={lesson.subject}
          onValueChange={(v) =>
            store.updateLesson(lesson.id, { subject: v as Subject })
          }
        >
          <SelectTrigger className="h-8 w-full">
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
      <div className="flex items-center gap-2">
        <Label htmlFor={`min-${lesson.id}`} className="text-xs">
          Minutes
        </Label>
        <Input
          id={`min-${lesson.id}`}
          type="number"
          min={1}
          value={lesson.minutes}
          onChange={(e) =>
            store.updateLesson(lesson.id, {
              minutes: Math.max(1, Number(e.target.value) || 1),
            })
          }
          className="h-8 w-20"
        />
        <Button
          size="sm"
          className="ml-auto gap-1.5"
          onClick={() => setEditing(false)}
        >
          <Check className="size-4" /> Done
        </Button>
      </div>
    </li>
  )
}

function AddLessonForm() {
  const store = useStore()
  const kids = childrenInView(store.children, store.currentView)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState<Subject>('bible')
  const [day, setDay] = useState<DayName>('monday')
  const [activityType, setActivityType] = useState<ActivityType>('mom-time')
  const [gradeBand, setGradeBand] = useState<GradeBand>('pre-k')
  const [minutes, setMinutes] = useState(8)
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!title.trim() || selected.length === 0) return
        store.addLesson(
          {
            title: title.trim(),
            subject,
            activityType,
            weekNumber: store.currentWeek,
            day,
            gradeBand,
            minutes,
            essential: true,
            owner: store.activeMomHouseholdId,
            printable: true,
          },
          selected,
        )
        setTitle('')
        setSelected([])
      }}
      className="space-y-3 rounded-xl border border-dashed border-border p-4"
    >
      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <Plus className="size-4 text-primary" /> Add a lesson
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="new-title">Title</Label>
        <Input
          id="new-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Letter B Multisensory Practice"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
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
          <Label>Day</Label>
          <Select value={day} onValueChange={(v) => setDay(v as DayName)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((d) => (
                <SelectItem key={d} value={d} className="capitalize">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select
            value={activityType}
            onValueChange={(v) => setActivityType(v as ActivityType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITIES.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
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
              {GRADES.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="new-min" className="text-xs">
          Minutes
        </Label>
        <Input
          id="new-min"
          type="number"
          min={1}
          value={minutes}
          onChange={(e) => setMinutes(Math.max(1, Number(e.target.value) || 1))}
          className="h-8 w-20"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Assign to</Label>
        {kids.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No children in this view.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {kids.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={selected.includes(c.id)}
                  onCheckedChange={() => toggle(c.id)}
                />
                {c.name}
              </label>
            ))}
          </div>
        )}
      </div>
      <Button
        type="submit"
        size="sm"
        className="gap-1.5"
        disabled={!title.trim() || selected.length === 0}
      >
        <Plus className="size-4" /> Add lesson
      </Button>
    </form>
  )
}
