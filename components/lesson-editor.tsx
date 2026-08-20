'use client'

import { useState, type ReactElement, type ReactNode } from 'react'
import { useStore } from '@/lib/store'
import { dayLabels, gradeBandOptions, subjectMeta } from '@/lib/ui'
import type { ActivityType, DayName, GradeBand, Lesson, Subject } from '@/lib/types'
import { Button } from '@/components/ui/button'
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

export const days: DayName[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
export const fieldClass =
  'h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30'

const subjects = Object.keys(subjectMeta) as Subject[]
const activityTypes: ActivityType[] = ['mom-time', 'independent', 'hands-on', 'optional']
const gradeBands = gradeBandOptions

export function LessonEditor({
  weekNumber,
  lesson,
  defaultDay = 'monday',
  defaultChildId,
  trigger,
  onSaved,
}: {
  weekNumber: number
  lesson?: Lesson
  defaultDay?: DayName
  defaultChildId?: string
  trigger: ReactElement
  onSaved: () => void
}) {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(() => lessonToForm(lesson, defaultDay, defaultChildId, store))

  function update(key: string, value: string | boolean | string[]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setForm(lessonToForm(lesson, defaultDay, defaultChildId, store))
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

export function Field({ label, id, className, children }: { label: string; id: string; className?: string; children: ReactNode }) {
  return <div className={`space-y-2 ${className ?? ''}`}><Label htmlFor={id}>{label}</Label>{children}</div>
}

function NativeSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  const id = `select-${label.toLowerCase().replaceAll(' ', '-')}`
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>{children}</select></div>
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex cursor-pointer items-center gap-2 text-sm font-medium"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-primary" />{label}</label>
}

export function lines(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean)
}

function lessonToForm(
  lesson: Lesson | undefined,
  defaultDay: DayName,
  defaultChildId: string | undefined,
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
      : defaultChildId
        ? [defaultChildId]
        : store.children
            .filter((child) =>
              store.currentView === 'shared' ? true : child.householdId === store.currentView,
            )
            .filter((child) => child.gradeBand === 'pre-k')
            .map((child) => child.id),
  }
}
