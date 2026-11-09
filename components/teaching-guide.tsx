'use client'

import { BookOpen, Calculator, Feather, Library, MessagesSquare, Palette, PenLine, Sparkles } from 'lucide-react'
import { ACTIVITY_LABELS, ACTIVITY_SHORT, type ActivityType, type TeachingGuide } from '@/lib/curriculum/types'
import type { PlanSubject } from '@/lib/plan/day-plan'
import { cn } from '@/lib/utils'

export const SUBJECT_META: Record<PlanSubject, { label: string; Icon: typeof BookOpen }> = {
  bible: { label: 'Bible', Icon: BookOpen },
  literacy: { label: 'Literacy', Icon: Feather },
  math: { label: 'Math', Icon: Calculator },
  handwriting: { label: 'Handwriting', Icon: PenLine },
  language: { label: 'Language', Icon: MessagesSquare },
  enrichment: { label: 'Enrichment', Icon: Palette },
  'read-aloud': { label: 'Read-aloud', Icon: Library },
}

export function SubjectIcon({ subject, className }: { subject: PlanSubject; className?: string }) {
  const Icon = SUBJECT_META[subject]?.Icon ?? Sparkles
  return <Icon className={className ?? 'size-4'} aria-hidden />
}

const ACTIVITY_TONE: Record<ActivityType, string> = {
  academic: 'bg-muted text-foreground',
  'hands-on': 'bg-sage-soft text-primary',
  movement: 'bg-gold/25 text-foreground',
  discussion: 'bg-terracotta-soft text-foreground',
  review: 'border border-primary/40 text-primary',
}

/** Small label: Academic · Hands-on · Movement · Discussion · Review. */
export function ActivityBadge({ type, long, className }: { type: ActivityType; long?: boolean; className?: string }) {
  return (
    <span title={ACTIVITY_LABELS[type]} className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold', ACTIVITY_TONE[type], className)}>
      {long ? ACTIVITY_LABELS[type] : ACTIVITY_SHORT[type]}
    </span>
  )
}

/**
 * The parent teaching guide. Structure is the same everywhere:
 * Objective · Materials · Teach · Practice · Check · Next step (+ optional extras).
 * Math and handwriting add What / Why / How and the learning stage; a child's
 * profile can add a beginning–middle–end structure and access supports.
 */
export function TeachingGuideView({ guide, minimum }: { guide: TeachingGuide; minimum?: boolean }) {
  if (minimum) {
    return (
      <div className="rounded-xl bg-sage-soft/60 p-3 text-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Short version</p>
        <p className="mt-1">{guide.minimum}</p>
      </div>
    )
  }
  return (
    <dl className="grid gap-2.5 text-sm">
      <Row term="Objective">{guide.objective}</Row>
      {(guide.what || guide.why) && (
        <Row term="What · Why · How">
          <div className="space-y-1 rounded-xl bg-sage-soft/50 p-2.5">
            {guide.what && (
              <p>
                <span className="font-semibold">What:</span> {guide.what}
              </p>
            )}
            {guide.why && (
              <p>
                <span className="font-semibold">Why it works:</span> {guide.why}
              </p>
            )}
            {guide.how && (
              <div>
                <span className="font-semibold">How:</span>
                <ol className="mt-0.5 list-decimal space-y-0.5 pl-5">
                  {guide.how.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ol>
              </div>
            )}
            {guide.example && (
              <p>
                <span className="font-semibold">Say it:</span> {guide.example}
              </p>
            )}
          </div>
        </Row>
      )}
      {guide.stages && guide.stages.length > 0 && (
        <Row term="Today’s stage">
          <ul className="space-y-0.5">
            {guide.stages.map((st, i) => (
              <li key={i}>
                <span className="font-semibold">{st.label}:</span> {st.text}
              </li>
            ))}
          </ul>
        </Row>
      )}
      {guide.structure && (
        <Row term="Structure">
          <ol className="space-y-0.5">
            <li>
              <span className="font-semibold">Beginning:</span> {guide.structure.begin}
            </li>
            <li>
              <span className="font-semibold">Middle:</span> {guide.structure.middle}
            </li>
            <li>
              <span className="font-semibold">End:</span> {guide.structure.end}
            </li>
          </ol>
        </Row>
      )}
      <Row term="Materials">{guide.materials.join(' · ')}</Row>
      {guide.warmUp && <Row term="Warm-up">{guide.warmUp}</Row>}
      <Row term="Teach">
        <ol className="list-decimal space-y-1 pl-5">
          {guide.teach.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
      </Row>
      <Row term="Practice">
        <ul className="list-disc space-y-1 pl-5">
          {guide.practice.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Row>
      {guide.starters && guide.starters.length > 0 && (
        <Row term="Sentence starters">
          <p className="italic">{guide.starters.join('  ·  ')}</p>
        </Row>
      )}
      {guide.supports && guide.supports.length > 0 && (
        <Row term="Access supports">
          <ul className="list-disc space-y-1 pl-5">
            {guide.supports.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-muted-foreground">Same objective and grade-level work as siblings — these change how the lesson is reached, not what is learned.</p>
        </Row>
      )}
      <Row term="Check">{guide.check}</Row>
      <Row term="Next step">
        <p>
          <span className="font-semibold">If they struggle:</span> {guide.ifStruggling}
        </p>
        <p className="mt-1">
          <span className="font-semibold">If they’ve got it:</span> {guide.ifMastered}
        </p>
      </Row>
      {guide.whenReady && guide.whenReady.length > 0 && (
        <Row term="When ready">
          <ul className="list-disc space-y-1 pl-5">
            {guide.whenReady.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Row>
      )}
      {guide.optional && guide.optional.length > 0 && (
        <Row term="Optional">
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            {guide.optional.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Row>
      )}
    </dl>
  )
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[96px_1fr] sm:gap-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-primary sm:pt-0.5">{term}</dt>
      <dd>{children}</dd>
    </div>
  )
}
