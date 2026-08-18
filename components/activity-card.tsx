'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Check,
  Printer,
  Lightbulb,
  LifeBuoy,
  Clock,
  ArrowRight,
  Play,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import type { AssignedLesson } from '@/lib/selectors'
import { ActivityBadge, SubjectPill } from '@/components/primitives'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'

const interactiveHref: Record<string, string> = {
  phonics: '/lessons/phonics',
  'math-manipulatives': '/lessons/math',
  'word-building': '/lessons/word-building',
  'memory-verse': '/bible',
}

export function ActivityCard({
  item,
  childName,
}: {
  item: AssignedLesson
  childName?: string
}) {
  const { toggleAssignment } = useStore()
  const { lesson, assignment } = item
  const done = assignment.status === 'done'

  return (
    <div
      className={cn(
        'rounded-2xl border p-4 transition-colors',
        done ? 'border-secondary bg-secondary/30' : 'border-border bg-card',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <SubjectPill subject={lesson.subject} />
          <ActivityBadge type={lesson.activityType} />
        </div>
        <span className="flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-muted-foreground">
          <Clock className="size-3.5" />
          {lesson.minutes} min
        </span>
      </div>

      <p className="mt-2.5 font-bold text-foreground text-balance">{lesson.title}</p>
      {childName && (
        <p className="text-sm text-muted-foreground">for {childName}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={done ? 'secondary' : 'default'}
          onClick={() => toggleAssignment(assignment.id)}
        >
          <Check className="size-4" />
          {done ? 'Done' : 'Mark done'}
        </Button>

        {lesson.interactive && (
          <Button size="sm" variant="outline" asChild>
            <Link href={interactiveHref[lesson.interactive]}>
              <Play className="size-4" /> Do online
            </Link>
          </Button>
        )}

        {lesson.printable && (
          <Button size="sm" variant="ghost" asChild>
            <Link href="/print-center">
              <Printer className="size-4" /> Print
            </Link>
          </Button>
        )}

        {lesson.activityType === 'mom-time' && lesson.teach && (
          <HelpMeTeach item={item} />
        )}

        <MyChildIsStuck title={lesson.title} />
      </div>
    </div>
  )
}

function HelpMeTeach({ item }: { item: AssignedLesson }) {
  const { lesson } = item
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-primary">
          <Lightbulb className="size-4" /> Help me teach this
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogDescription className="text-xs font-bold uppercase tracking-widest text-primary">
            How to teach
          </DialogDescription>
          <DialogTitle className="font-serif text-2xl">{lesson.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {lesson.youNeed && (
            <TeachBlock label="You need">
              <ul className="list-disc space-y-1 pl-5">
                {lesson.youNeed.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </TeachBlock>
          )}
          {lesson.teach && (
            <TeachBlock label="Teach">
              <ol className="list-decimal space-y-1 pl-5">
                {lesson.teach.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </TeachBlock>
          )}
          {lesson.ask && (
            <TeachBlock label="Ask">
              <ul className="space-y-1">
                {lesson.ask.map((a) => (
                  <li key={a} className="italic text-foreground">
                    &ldquo;{a}&rdquo;
                  </li>
                ))}
              </ul>
            </TeachBlock>
          )}
          {lesson.watchFor && (
            <TeachBlock label="Watch for">{lesson.watchFor}</TeachBlock>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TeachBlock({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-muted/60 p-4">
      <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}

const hints = [
  { label: 'Hint 1', text: 'Ask a guiding question. "What do you already know about this?"' },
  { label: 'Hint 2', text: 'Bring out manipulatives — counters, LEGO, or letter tiles — and act it out together.' },
  { label: 'Hint 3', text: 'Show a picture model or draw it so they can see the idea.' },
  { label: 'Teach it again', text: 'Pause and give a short 2\u20135 minute mini lesson, then try one easy example together.' },
]

function MyChildIsStuck({ title }: { title: string }) {
  const [revealed, setRevealed] = useState(1)
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) setRevealed(1)
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-muted-foreground">
          <LifeBuoy className="size-4" /> Stuck?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription className="text-xs font-bold uppercase tracking-widest text-primary">
            My child is stuck
          </DialogDescription>
          <DialogTitle className="font-serif text-2xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {hints.slice(0, revealed).map((h) => (
            <div key={h.label} className="rounded-2xl bg-muted/60 p-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {h.label}
              </p>
              <p className="text-sm text-foreground">{h.text}</p>
            </div>
          ))}
        </div>
        {revealed < hints.length ? (
          <Button
            variant="outline"
            onClick={() => setRevealed((r) => r + 1)}
            className="w-full"
          >
            Show next scaffold <ArrowRight className="size-4" />
          </Button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Got it
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              More practice
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Stop for today
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
