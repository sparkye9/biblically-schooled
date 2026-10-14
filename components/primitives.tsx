'use client'

import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Child } from '@/lib/types'

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>}
        <h1 className="mt-1 font-serif text-2xl font-semibold text-balance text-foreground sm:text-3xl">{title}</h1>
        {description && <div className="mt-1.5 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">{description}</div>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}

export function ChildAvatar({ child, size = 'md' }: { child: Pick<Child, 'name' | 'color'>; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-lg' }
  return (
    <span
      aria-hidden
      className={cn('flex shrink-0 items-center justify-center rounded-full font-bold text-white', sizes[size])}
      style={{ backgroundColor: `var(--${child.color})` }}
    >
      {child.name.charAt(0)}
    </span>
  )
}

/** Large, clearly visible completion checkbox (44px touch target). */
export function DoneBox({
  done,
  onToggle,
  label,
  color,
}: {
  done: boolean
  onToggle: () => void
  label: string
  color?: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-xl border-2 transition-colors',
        done ? 'text-white' : 'border-border bg-card hover:border-primary',
      )}
      style={done ? { backgroundColor: color ? `var(--${color})` : 'var(--primary)', borderColor: color ? `var(--${color})` : 'var(--primary)' } : undefined}
    >
      {done && <Check className="size-6" strokeWidth={3} />}
    </button>
  )
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-2xl border border-border bg-card p-4 sm:p-5', className)}>{children}</div>
}

export function Pill({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'sage' | 'gold' | 'terracotta' }) {
  const tones = {
    muted: 'bg-muted text-muted-foreground',
    sage: 'bg-sage-soft text-primary',
    gold: 'bg-gold/25 text-foreground',
    terracotta: 'bg-terracotta-soft text-foreground',
  }
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone])}>{children}</span>
}

export function ProgressBar({ value, total, color }: { value: number; total: number; color?: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color ? `var(--${color})` : 'var(--primary)' }} />
    </div>
  )
}

export function Section({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-lg font-semibold sm:text-xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
