'use client'

import { cn } from '@/lib/utils'
import { accent, accentBg, activityMeta, subjectMeta } from '@/lib/ui'
import type { ActivityType, Child, Subject } from '@/lib/types'

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 font-serif text-3xl font-semibold text-balance text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}

export function ActivityBadge({ type }: { type: ActivityType }) {
  const meta = activityMeta[type]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
      style={accentBg(meta.token, 0.16)}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: `var(--${meta.token})` }}
      />
      {meta.label}
    </span>
  )
}

export function SubjectPill({ subject }: { subject: Subject }) {
  const { label, Icon } = subjectMeta[subject]
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
      <Icon className="size-3.5" />
      {label}
    </span>
  )
}

export function ChildAvatar({
  child,
  size = 'md',
}: {
  child: Child
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'size-8 text-xs',
    md: 'size-10 text-sm',
    lg: 'size-14 text-lg',
  }
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-bold',
        sizes[size],
      )}
      style={accentBg(child.color, 0.22)}
    >
      {child.name.charAt(0)}
    </span>
  )
}

export function ProgressRing({
  value,
  total,
  color,
  size = 52,
}: {
  value: number
  total: number
  color: string
  size?: number
}) {
  const pct = total === 0 ? 0 : value / total
  const stroke = 5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`var(--${color})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-all duration-500"
        />
      </svg>
      <span
        className="absolute text-[11px] font-bold"
        style={accent(color)}
      >
        {value}/{total}
      </span>
    </span>
  )
}

export function StatChip({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card p-4', className)}>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
