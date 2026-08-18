'use client'

import { useMemo, useState } from 'react'
import { ArrowUp, ArrowDown, Repeat, GripVertical } from 'lucide-react'
import { useStore } from '@/lib/store'
import { assignedLessonsFor, childrenInView } from '@/lib/selectors'
import { Button } from '@/components/ui/button'

const blocks = ['First', 'While they work', 'Next', 'Then', 'Everyone together']

interface Step {
  id: string
  title: string
  detail: string
}

export function RotationAssistant() {
  const { children, assignments, lessons, currentView, currentWeek, currentDay } =
    useStore()
  const inView = childrenInView(children, currentView)

  const generated = useMemo<Step[]>(() => {
    const steps: Step[] = []
    // Family bible first if present
    const bible = inView
      .flatMap((c) =>
        assignedLessonsFor(c.id, assignments, lessons, {
          week: currentWeek,
          day: currentDay,
        }),
      )
      .find((i) => i.lesson.subject === 'bible')
    if (bible) {
      steps.push({
        id: 'b',
        title: 'Family Bible',
        detail: `${bible.lesson.title} \u2014 everyone together (${bible.lesson.minutes} min)`,
      })
    }
    inView.forEach((child) => {
      const momTime = assignedLessonsFor(child.id, assignments, lessons, {
        week: currentWeek,
        day: currentDay,
      }).find((i) => i.lesson.activityType === 'mom-time' && i.lesson.subject !== 'bible')
      if (momTime) {
        const others = inView
          .filter((c) => c.id !== child.id)
          .map((c) => c.name)
          .join(' + ')
        steps.push({
          id: child.id,
          title: `Teach ${child.name}: ${momTime.lesson.title}`,
          detail: others
            ? `${others} on independent / hands-on work`
            : 'Others continue independent work',
        })
      }
    })
    return steps
  }, [inView, assignments, lessons, currentWeek, currentDay])

  const [order, setOrder] = useState<Step[]>(generated)
  const [dirty, setDirty] = useState(false)
  const steps = dirty ? order : generated

  const move = (index: number, dir: -1 | 1) => {
    const base = dirty ? [...order] : [...generated]
    const target = index + dir
    if (target < 0 || target >= base.length) return
    ;[base[index], base[target]] = [base[target], base[index]]
    setOrder(base)
    setDirty(true)
  }

  if (steps.length === 0) return null

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Repeat className="size-4" />
          </span>
          <div>
            <p className="font-bold leading-tight text-foreground">
              Suggested rotation
            </p>
            <p className="text-xs text-muted-foreground">
              Who to work with, in order. Reorder to fit your morning.
            </p>
          </div>
        </div>
        {dirty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDirty(false)
            }}
          >
            Reset
          </Button>
        )}
      </div>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li
            key={step.id}
            className="flex items-center gap-3 rounded-xl bg-muted/50 p-3"
          >
            <GripVertical className="size-4 shrink-0 text-muted-foreground" />
            <span className="w-32 shrink-0 text-xs font-bold uppercase tracking-wide text-primary">
              {blocks[Math.min(i, blocks.length - 1)]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.detail}</p>
            </div>
            <div className="flex shrink-0 flex-col">
              <button
                aria-label="Move up"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="p-1 text-muted-foreground disabled:opacity-30"
              >
                <ArrowUp className="size-4" />
              </button>
              <button
                aria-label="Move down"
                onClick={() => move(i, 1)}
                disabled={i === steps.length - 1}
                className="p-1 text-muted-foreground disabled:opacity-30"
              >
                <ArrowDown className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
