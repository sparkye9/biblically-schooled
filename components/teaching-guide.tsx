'use client'

import { BookOpen, Calculator, Feather, Library, Palette, Sparkles } from 'lucide-react'
import type { TeachingGuide } from '@/lib/curriculum/types'
import type { PlanSubject } from '@/lib/plan/day-plan'

export const SUBJECT_META: Record<PlanSubject, { label: string; Icon: typeof BookOpen }> = {
  bible: { label: 'Bible', Icon: BookOpen },
  literacy: { label: 'Literacy', Icon: Feather },
  math: { label: 'Math', Icon: Calculator },
  enrichment: { label: 'Enrichment', Icon: Palette },
  'read-aloud': { label: 'Read-aloud', Icon: Library },
}

export function SubjectIcon({ subject, className }: { subject: PlanSubject; className?: string }) {
  const Icon = SUBJECT_META[subject]?.Icon ?? Sparkles
  return <Icon className={className ?? 'size-4'} aria-hidden />
}

/**
 * The parent teaching guide. Structure is the same everywhere:
 * Objective · Materials · Teach · Practice · Check · Next step (+ optional extras).
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
      <Row term="Materials">{guide.materials.join(' · ')}</Row>
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
      <Row term="Check">{guide.check}</Row>
      <Row term="Next step">
        <p>
          <span className="font-semibold">If they struggle:</span> {guide.ifStruggling}
        </p>
        <p className="mt-1">
          <span className="font-semibold">If they’ve got it:</span> {guide.ifMastered}
        </p>
      </Row>
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
