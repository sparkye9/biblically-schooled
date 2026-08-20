'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { childrenInView, assignedLessonsFor } from '@/lib/selectors'
import { subjectMeta, accentBg } from '@/lib/ui'
import type { Subject } from '@/lib/types'
import { PageHeader, ChildAvatar } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Printer, BookMarked, Plus } from 'lucide-react'

export default function PortfolioPage() {
  return (
    <Suspense>
      <PortfolioContent />
    </Suspense>
  )
}

function PortfolioContent() {
  const store = useStore()
  const searchParams = useSearchParams()
  const kids = childrenInView(store.children, store.currentView)
  const requested = searchParams.get('child')
  const [selectedId, setSelectedId] = useState(
    requested && kids.some((k) => k.id === requested) ? requested : (kids[0]?.id ?? ''),
  )
  const child = kids.find((c) => c.id === selectedId) ?? kids[0]

  if (!child) {
    return (
      <div>
        <PageHeader
          eyebrow="Homeschool Record"
          title="Portfolio"
          description="A printable record of subjects covered, skills mastered, and books read."
        />
        <p className="text-muted-foreground">Add a learner first to build a portfolio.</p>
      </div>
    )
  }

  const household = store.households.find((h) => h.id === child.householdId)
  const parentName = household
    ? `${household.momName}${household.lastName ? ` ${household.lastName}` : ''}`
    : ''

  const allItems = assignedLessonsFor(child.id, store.assignments, store.lessons)
  const completed = allItems.filter((i) => i.assignment.status === 'done')

  const bySubject = new Map<Subject, { count: number; minutes: number }>()
  for (const item of completed) {
    const cur = bySubject.get(item.lesson.subject) ?? { count: 0, minutes: 0 }
    cur.count += 1
    cur.minutes += item.lesson.minutes
    bySubject.set(item.lesson.subject, cur)
  }
  const totalMinutes = completed.reduce((sum, item) => sum + item.lesson.minutes, 0)
  const weeksCovered = new Set(completed.map((item) => item.lesson.weekNumber)).size

  const skills = store.skills.filter((s) => s.childId === child.id)
  const mastered = skills.filter((s) => s.status === 'mastered')
  const inProgress = skills.filter(
    (s) => s.status !== 'mastered' && s.status !== 'not-introduced',
  )

  const booksRead = store.readAloud.filter(
    (b) => b.householdId === child.householdId && b.status === 'finished',
  )

  const notes = store.parentNotes
    .filter((n) => n.childId === child.id)
    .sort((a, b) => b.weekNumber - a.weekNumber)

  const activityLog = [...completed].sort((a, b) => {
    const at = a.assignment.completedAt ?? ''
    const bt = b.assignment.completedAt ?? ''
    return bt.localeCompare(at)
  })

  const today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Homeschool Record"
        title="Portfolio"
        description="A printable record of subjects covered, skills mastered, and books read — export as a PDF for state reporting or your own keeping."
      >
        <Button onClick={() => window.print()} className="gap-1.5">
          <Printer className="size-4" /> Print / Save as PDF
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-2 print:hidden">
        {kids.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className="flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-colors"
            style={
              c.id === child.id
                ? { ...accentBg(c.color, 0.18), borderColor: `var(--${c.color})` }
                : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }
            }
          >
            <ChildAvatar child={c} size="sm" />
            {c.name}
          </button>
        ))}
      </div>

      <Card className="space-y-6 p-6 print:rounded-none print:border-0 print:shadow-none sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <ChildAvatar child={child} size="lg" />
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">{child.name}</h2>
              <p className="text-sm text-muted-foreground">
                {child.grade}
                {parentName ? ` · ${parentName}'s household` : ''}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Printed {today}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Lessons completed" value={completed.length} />
          <Stat label="Instructional hours logged" value={(totalMinutes / 60).toFixed(1)} />
          <Stat label="Weeks of curriculum covered" value={weeksCovered} />
        </div>

        <section>
          <h3 className="mb-3 font-serif text-lg font-semibold">Subjects studied</h3>
          {bySubject.size === 0 ? (
            <p className="text-sm text-muted-foreground">No completed lessons yet.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {Array.from(bySubject.entries()).map(([subject, stat]) => {
                const meta = subjectMeta[subject]
                return (
                  <div
                    key={subject}
                    className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5"
                  >
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <meta.Icon className="size-4" />
                      {meta.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stat.count} lessons &middot; {Math.round((stat.minutes / 60) * 10) / 10} hrs
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section>
          <h3 className="mb-3 font-serif text-lg font-semibold">Skills</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Mastered ({mastered.length})
              </p>
              {mastered.length === 0 ? (
                <p className="text-sm text-muted-foreground">None yet.</p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {mastered.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-full bg-secondary/60 px-2.5 py-1 text-xs font-semibold text-secondary-foreground"
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                In progress ({inProgress.length})
              </p>
              {inProgress.length === 0 ? (
                <p className="text-sm text-muted-foreground">None right now.</p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {inProgress.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold">
            <BookMarked className="size-4" /> Reading log
          </h3>
          {booksRead.length === 0 ? (
            <p className="text-sm text-muted-foreground">No finished books logged yet.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {booksRead.map((book) => (
                <li key={book.id}>{book.title}</li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="mb-3 font-serif text-lg font-semibold">Weekly reflections</h3>
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reflections logged yet.</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="rounded-xl bg-muted/50 p-4">
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Week {note.weekNumber}
                  </p>
                  {note.worked && (
                    <p className="text-sm">
                      <span className="font-semibold">What worked:</span> {note.worked}
                    </p>
                  )}
                  {note.needsPractice && (
                    <p className="text-sm">
                      <span className="font-semibold">Needs practice:</span> {note.needsPractice}
                    </p>
                  )}
                  {note.enjoyed && (
                    <p className="text-sm">
                      <span className="font-semibold">Enjoyed:</span> {note.enjoyed}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {activityLog.length > 0 && (
          <section className="print:break-before-page">
            <h3 className="mb-3 font-serif text-lg font-semibold">Activity log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2 pr-3">Week</th>
                    <th className="py-2 pr-3">Subject</th>
                    <th className="py-2">Lesson</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLog.map((item) => (
                    <tr key={item.assignment.id} className="border-b border-border/60">
                      <td className="py-2 pr-3 whitespace-nowrap text-muted-foreground">
                        {item.assignment.completedAt
                          ? new Date(item.assignment.completedAt).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">{item.lesson.weekNumber}</td>
                      <td className="py-2 pr-3 text-muted-foreground">
                        {subjectMeta[item.lesson.subject].label}
                      </td>
                      <td className="py-2">{item.lesson.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </Card>

      <AddReflection childId={child.id} defaultWeek={store.currentWeek} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-muted/50 p-4 text-center">
      <p className="font-serif text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function AddReflection({ childId, defaultWeek }: { childId: string; defaultWeek: number }) {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const [weekNumber, setWeekNumber] = useState(defaultWeek)
  const [worked, setWorked] = useState('')
  const [needsPractice, setNeedsPractice] = useState('')
  const [enjoyed, setEnjoyed] = useState('')

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)} className="print:hidden">
        <Plus className="size-4" /> Add a weekly reflection
      </Button>
    )
  }

  return (
    <Card className="p-5 print:hidden">
      <h3 className="mb-3 font-serif text-lg font-semibold">Add a weekly reflection</h3>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          store.saveNote({ childId, weekNumber, worked, needsPractice, enjoyed })
          setWorked('')
          setNeedsPractice('')
          setEnjoyed('')
          setOpen(false)
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="reflection-week">Week</Label>
          <Input
            id="reflection-week"
            type="number"
            min={1}
            value={weekNumber}
            onChange={(event) => setWeekNumber(Number(event.target.value))}
            className="w-24"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reflection-worked">What worked</Label>
          <Textarea
            id="reflection-worked"
            value={worked}
            onChange={(event) => setWorked(event.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reflection-practice">Needs more practice</Label>
          <Textarea
            id="reflection-practice"
            value={needsPractice}
            onChange={(event) => setNeedsPractice(event.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reflection-enjoyed">What they enjoyed</Label>
          <Textarea
            id="reflection-enjoyed"
            value={enjoyed}
            onChange={(event) => setEnjoyed(event.target.value)}
            rows={2}
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Save reflection</Button>
        </div>
      </form>
    </Card>
  )
}
