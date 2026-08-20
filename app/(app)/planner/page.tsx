'use client'

import { useState, type ReactNode, type ReactElement } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Edit3,
  Plus,
  Trash2,
  Users,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { dayLabels, gradeBandOptions, subjectMeta } from '@/lib/ui'
import type {
  ActivityType,
  CurriculumWeek,
  DayName,
  GradeBand,
  Lesson,
  Subject,
} from '@/lib/types'
import { ActivityBadge, PageHeader, SubjectPill } from '@/components/primitives'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const days: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const subjects = Object.keys(subjectMeta) as Subject[]
const activityTypes: ActivityType[] = ['mom-time', 'independent', 'hands-on', 'optional']
const gradeBands = gradeBandOptions
const fieldClass =
  'h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30'

export default function PlannerPage() {
  const store = useStore()
  const [message, setMessage] = useState('')
  const week =
    store.weeks.find((item) => item.number === store.currentWeek) ?? store.weeks[0]

  if (!week) {
    return <p className="text-muted-foreground">No curriculum weeks are available.</p>
  }

  const visibleLessons = store.lessons.filter(
    (lesson) =>
      lesson.weekNumber === week.number &&
      (store.currentView === 'shared' ||
        lesson.owner === 'shared' ||
        lesson.owner === store.currentView),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Curriculum editor"
        title="Weekly Planner"
        description="Edit the weekly Bible theme, adjust teaching details, and assign each lesson to the right children."
      >
        {store.weeks.length < 36 && (
          <WeekEditor
            onSaved={(number) => setMessage(`Week ${number} added.`)}
            trigger={
              <Button variant="outline">
                <Plus className="size-4" /> Add week
              </Button>
            }
          />
        )}
        <WeekEditor week={week} onSaved={() => setMessage(`Week ${week.number} updated.`)} />
        <LessonEditor
          weekNumber={week.number}
          onSaved={() => setMessage('New lesson added and assigned.')}
          trigger={
            <Button>
              <Plus className="size-4" /> Add lesson
            </Button>
          }
        />
      </PageHeader>

      {message && (
        <div role="status" className="flex items-center gap-2 rounded-2xl bg-secondary/60 px-4 py-3 text-sm font-semibold text-secondary-foreground">
          <CheckCircle2 className="size-4" /> {message}
        </div>
      )}

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Week {week.number} · {week.bibleRef}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold">{week.theme}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{week.bigIdea}</p>
            <p className="mt-3 text-sm">
              <span className="font-semibold">Memory verse:</span> “{week.memoryVerse}” —{' '}
              {week.memoryVerseRef}
            </p>
          </div>
          <div className="w-full sm:w-48">
            <Label htmlFor="planner-week" className="mb-2">Jump to week</Label>
            <select
              id="planner-week"
              value={week.number}
              onChange={(event) => {
                store.setCurrentWeek(Number(event.target.value))
                setMessage('')
              }}
              className={fieldClass}
            >
              {store.weeks.map((item) => (
                <option key={item.id} value={item.number}>
                  Week {item.number}: {item.theme}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {days.map((day) => {
          const lessons = visibleLessons.filter((lesson) => lesson.day === day)
          return (
            <Card key={day} className="overflow-hidden p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  <h3 className="font-serif text-lg font-semibold">{dayLabels[day]}</h3>
                  {day === 'wednesday' && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold uppercase text-secondary-foreground">
                      Co-op day
                    </span>
                  )}
                </div>
                {day !== 'wednesday' && (
                  <LessonEditor
                    weekNumber={week.number}
                    defaultDay={day}
                    onSaved={() => setMessage(`${dayLabels[day]} lesson added.`)}
                    trigger={
                      <Button size="sm" variant="ghost">
                        <Plus className="size-4" /> Add lesson
                      </Button>
                    }
                  />
                )}
              </div>
              <div className="grid gap-3 p-4 lg:grid-cols-2">
                {lessons.map((lesson) => {
                  const assigned = store.assignments
                    .filter((assignment) => assignment.lessonId === lesson.id)
                    .map((assignment) =>
                      store.children.find((child) => child.id === assignment.childId),
                    )
                    .filter(Boolean)
                  return (
                    <div key={lesson.id} className="rounded-2xl border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          <SubjectPill subject={lesson.subject} />
                          <ActivityBadge type={lesson.activityType} />
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <LessonEditor
                            lesson={lesson}
                            weekNumber={week.number}
                            onSaved={() => setMessage(`“${lesson.title}” updated.`)}
                            trigger={
                              <Button size="icon-sm" variant="ghost" aria-label={`Edit ${lesson.title}`}>
                                <Edit3 className="size-4" />
                              </Button>
                            }
                          />
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`Delete ${lesson.title}`}
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              if (window.confirm(`Delete "${lesson.title}"? This can't be undone.`)) {
                                store.deleteLesson(lesson.id)
                                setMessage(`“${lesson.title}” deleted.`)
                              }
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="mt-3 font-bold">{lesson.title}</h4>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" /> {lesson.minutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3.5" />{' '}
                          {assigned.length > 0
                            ? assigned.map((child) => child?.name).join(', ')
                            : 'Not assigned'}
                        </span>
                      </div>
                    </div>
                  )
                })}
                {lessons.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground lg:col-span-2">
                    {day === 'wednesday'
                      ? 'No home lesson packet—this day stays open for co-op.'
                      : 'No lessons scheduled yet.'}
                  </p>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function WeekEditor({
  week,
  trigger,
  onSaved,
}: {
  week?: CurriculumWeek
  trigger?: ReactElement
  onSaved: (weekNumber: number) => void
}) {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(() => (week ? weekToForm(week) : blankWeekForm()))
  const nextWeekNumber = Math.max(0, ...store.weeks.map((item) => item.number)) + 1

  function update<K extends keyof ReturnType<typeof weekToForm>>(
    key: K,
    value: ReturnType<typeof weekToForm>[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setForm(week ? weekToForm(week) : blankWeekForm())
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="outline">
              <Edit3 className="size-4" /> Edit week
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const payload = {
              theme: form.theme.trim(),
              bibleRef: form.bibleRef.trim(),
              bigIdea: form.bigIdea.trim(),
              memoryVerse: form.memoryVerse.trim(),
              memoryVerseRef: form.memoryVerseRef.trim(),
              art: lines(form.art),
              science: lines(form.science),
            }
            const savedWeekNumber = week
              ? (store.updateWeek(week.id, payload), week.number)
              : store.addWeek(payload)
            setOpen(false)
            onSaved(savedWeekNumber)
          }}
          className="contents"
        >
          <DialogHeader>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-primary">
              Week {week?.number ?? nextWeekNumber}
            </DialogDescription>
            <DialogTitle className="font-serif text-2xl">
              {week ? 'Edit weekly theme' : 'Add a curriculum week'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Theme" id="week-theme" className="sm:col-span-2">
              <Input id="week-theme" value={form.theme} onChange={(event) => update('theme', event.target.value)} required />
            </Field>
            <Field label="Bible passage" id="week-bible-ref">
              <Input id="week-bible-ref" value={form.bibleRef} onChange={(event) => update('bibleRef', event.target.value)} required />
            </Field>
            <Field label="Memory verse reference" id="week-memory-ref">
              <Input id="week-memory-ref" value={form.memoryVerseRef} onChange={(event) => update('memoryVerseRef', event.target.value)} required />
            </Field>
            <Field label="Big idea" id="week-big-idea" className="sm:col-span-2">
              <Textarea id="week-big-idea" value={form.bigIdea} onChange={(event) => update('bigIdea', event.target.value)} required />
            </Field>
            <Field label="Memory verse" id="week-memory" className="sm:col-span-2">
              <Textarea id="week-memory" value={form.memoryVerse} onChange={(event) => update('memoryVerse', event.target.value)} required />
            </Field>
            <Field label="Art ideas (one per line)" id="week-art">
              <Textarea id="week-art" value={form.art} onChange={(event) => update('art', event.target.value)} />
            </Field>
            <Field label="Science ideas (one per line)" id="week-science">
              <Textarea id="week-science" value={form.science} onChange={(event) => update('science', event.target.value)} />
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{week ? 'Save week' : 'Add week'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function LessonEditor({
  weekNumber,
  lesson,
  defaultDay = 'monday',
  trigger,
  onSaved,
}: {
  weekNumber: number
  lesson?: Lesson
  defaultDay?: DayName
  trigger: ReactElement
  onSaved: () => void
}) {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(() => lessonToForm(lesson, defaultDay, store))

  function update(key: string, value: string | boolean | string[]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setForm(lessonToForm(lesson, defaultDay, store))
          setError('')
        }
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!form.title.trim()) return
            if (form.childIds.length === 0) {
              setError('Choose at least one child for this lesson.')
              return
            }
            const payload: Omit<Lesson, 'id'> = {
              title: form.title.trim(),
              subject: form.subject as Subject,
              activityType: form.activityType as ActivityType,
              weekNumber,
              day: form.day as DayName,
              gradeBand: form.gradeBand as GradeBand,
              minutes: Math.max(1, Number(form.minutes) || 1),
              essential: form.essential,
              owner: form.owner,
              youNeed: lines(form.youNeed),
              teach: lines(form.teach),
              ask: lines(form.ask),
              watchFor: form.watchFor.trim() || undefined,
              interactive: form.interactive
                ? (form.interactive as Lesson['interactive'])
                : undefined,
              printable: form.printable,
            }
            const lessonId = lesson?.id ?? store.addLesson(payload)
            if (lesson) store.updateLesson(lesson.id, payload)
            store.setLessonAssignments(lessonId, form.childIds)
            setOpen(false)
            onSaved()
          }}
          className="contents"
        >
          <DialogHeader>
            <DialogDescription className="text-xs font-bold uppercase tracking-widest text-primary">
              Week {weekNumber}
            </DialogDescription>
            <DialogTitle className="font-serif text-2xl">
              {lesson ? 'Edit lesson' : 'Add a lesson'}
            </DialogTitle>
          </DialogHeader>

          {error && <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{error}</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Lesson title" id={`lesson-title-${lesson?.id ?? 'new'}`} className="sm:col-span-2">
              <Input id={`lesson-title-${lesson?.id ?? 'new'}`} value={form.title} onChange={(event) => update('title', event.target.value)} required autoFocus />
            </Field>
            <NativeSelect label="Day" value={form.day} onChange={(value) => update('day', value)}>
              {days.filter((day) => day !== 'wednesday').map((day) => <option key={day} value={day}>{dayLabels[day]}</option>)}
            </NativeSelect>
            <NativeSelect label="Subject" value={form.subject} onChange={(value) => update('subject', value)}>
              {subjects.map((subject) => <option key={subject} value={subject}>{subjectMeta[subject].label}</option>)}
            </NativeSelect>
            <NativeSelect label="Grade level" value={form.gradeBand} onChange={(value) => update('gradeBand', value)}>
              {gradeBands.map((grade) => <option key={grade.value} value={grade.value}>{grade.label}</option>)}
            </NativeSelect>
            <NativeSelect label="Time code" value={form.activityType} onChange={(value) => update('activityType', value)}>
              {activityTypes.map((type) => <option key={type} value={type}>{type === 'mom-time' ? 'Mom Time' : type === 'hands-on' ? 'Hands-On' : `${type.charAt(0).toUpperCase()}${type.slice(1)}`}</option>)}
            </NativeSelect>
            <Field label="Minutes" id={`lesson-minutes-${lesson?.id ?? 'new'}`}>
              <Input id={`lesson-minutes-${lesson?.id ?? 'new'}`} type="number" min={1} max={180} value={form.minutes} onChange={(event) => update('minutes', event.target.value)} required />
            </Field>
            <NativeSelect label="Owner" value={form.owner} onChange={(value) => update('owner', value)}>
              <option value="shared">Shared by both families</option>
              {store.households.map((household) => <option key={household.id} value={household.id}>{household.name}</option>)}
            </NativeSelect>
            <NativeSelect label="Online activity" value={form.interactive} onChange={(value) => update('interactive', value)}>
              <option value="">None</option>
              <option value="phonics">Phonics</option>
              <option value="math-manipulatives">Math manipulatives</option>
              <option value="word-building">Word building</option>
              <option value="memory-verse">Memory verse</option>
            </NativeSelect>

            <fieldset className="space-y-2 sm:col-span-2">
              <legend className="text-sm font-medium">Assign to children</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {store.children.map((child) => {
                  const household = store.households.find((item) => item.id === child.householdId)
                  return (
                    <label key={child.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3">
                      <input
                        type="checkbox"
                        checked={form.childIds.includes(child.id)}
                        onChange={(event) =>
                          update(
                            'childIds',
                            event.target.checked
                              ? [...form.childIds, child.id]
                              : form.childIds.filter((id) => id !== child.id),
                          )
                        }
                        className="size-4 accent-primary"
                      />
                      <span className="text-sm"><b>{child.name}</b><span className="block text-xs text-muted-foreground">{child.grade} · {household?.momName}</span></span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <Field label="You need (one per line)" id={`lesson-need-${lesson?.id ?? 'new'}`}>
              <Textarea id={`lesson-need-${lesson?.id ?? 'new'}`} value={form.youNeed} onChange={(event) => update('youNeed', event.target.value)} />
            </Field>
            <Field label="Teach steps (one per line)" id={`lesson-teach-${lesson?.id ?? 'new'}`}>
              <Textarea id={`lesson-teach-${lesson?.id ?? 'new'}`} value={form.teach} onChange={(event) => update('teach', event.target.value)} />
            </Field>
            <Field label="Questions to ask (one per line)" id={`lesson-ask-${lesson?.id ?? 'new'}`}>
              <Textarea id={`lesson-ask-${lesson?.id ?? 'new'}`} value={form.ask} onChange={(event) => update('ask', event.target.value)} />
            </Field>
            <Field label="Watch for" id={`lesson-watch-${lesson?.id ?? 'new'}`}>
              <Textarea id={`lesson-watch-${lesson?.id ?? 'new'}`} value={form.watchFor} onChange={(event) => update('watchFor', event.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-4 sm:col-span-2">
              <Toggle label="Essential core lesson" checked={form.essential} onChange={(checked) => update('essential', checked)} />
              <Toggle label="Has a printable" checked={form.printable} onChange={(checked) => update('printable', checked)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{lesson ? 'Save lesson' : 'Add lesson'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, id, className, children }: { label: string; id: string; className?: string; children: ReactNode }) {
  return <div className={`space-y-2 ${className ?? ''}`}><Label htmlFor={id}>{label}</Label>{children}</div>
}

function NativeSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  const id = `select-${label.toLowerCase().replaceAll(' ', '-')}`
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>{children}</select></div>
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex cursor-pointer items-center gap-2 text-sm font-medium"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-primary" />{label}</label>
}

function lines(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean)
}

function weekToForm(week: CurriculumWeek) {
  return {
    theme: week.theme,
    bibleRef: week.bibleRef,
    bigIdea: week.bigIdea,
    memoryVerse: week.memoryVerse,
    memoryVerseRef: week.memoryVerseRef,
    art: week.art.join('\n'),
    science: week.science.join('\n'),
  }
}

function blankWeekForm() {
  return {
    theme: '',
    bibleRef: '',
    bigIdea: '',
    memoryVerse: '',
    memoryVerseRef: '',
    art: '',
    science: '',
  }
}

function lessonToForm(
  lesson: Lesson | undefined,
  defaultDay: DayName,
  store: ReturnType<typeof useStore>,
) {
  const defaultOwner = store.currentView === 'shared' ? 'shared' : store.currentView
  return {
    title: lesson?.title ?? '',
    subject: lesson?.subject ?? 'literacy',
    activityType: lesson?.activityType ?? 'mom-time',
    day: lesson?.day ?? defaultDay,
    gradeBand: lesson?.gradeBand ?? 'pre-k',
    minutes: String(lesson?.minutes ?? 10),
    essential: lesson?.essential ?? true,
    owner: lesson?.owner ?? defaultOwner,
    interactive: lesson?.interactive ?? '',
    printable: lesson?.printable ?? false,
    youNeed: lesson?.youNeed?.join('\n') ?? '',
    teach: lesson?.teach?.join('\n') ?? '',
    ask: lesson?.ask?.join('\n') ?? '',
    watchFor: lesson?.watchFor ?? '',
    childIds: lesson
      ? store.assignments
          .filter((assignment) => assignment.lessonId === lesson.id)
          .map((assignment) => assignment.childId)
      : store.children
          .filter((child) =>
            store.currentView === 'shared' ? true : child.householdId === store.currentView,
          )
          .filter((child) => child.gradeBand === 'pre-k')
          .map((child) => child.id),
  }
}
