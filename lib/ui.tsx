import type { CSSProperties } from 'react'
import {
  BookOpen,
  Calculator,
  Feather,
  FlaskConical,
  Palette,
  Library,
  RefreshCw,
  HandHelping,
  User,
  Users2,
  Sparkles,
} from 'lucide-react'
import type { ActivityType, GradeBand, SkillStatus, Subject } from './types'

export const activityMeta: Record<
  ActivityType,
  { label: string; token: string; description: string }
> = {
  'mom-time': {
    label: 'Mom Time',
    token: 'momtime',
    description: 'Direct teaching — usually 5\u201310 minutes.',
  },
  independent: {
    label: 'Independent',
    token: 'independent',
    description: 'Child can do this without constant help.',
  },
  'hands-on': {
    label: 'Hands-On',
    token: 'handson',
    description: 'Set it up once, then let them explore.',
  },
  optional: {
    label: 'Optional',
    token: 'optional',
    description: 'Enrichment — fine to skip on a busy day.',
  },
}

export const subjectMeta: Record<
  Subject,
  { label: string; Icon: typeof BookOpen }
> = {
  bible: { label: 'Bible', Icon: BookOpen },
  math: { label: 'Math', Icon: Calculator },
  literacy: { label: 'Literacy', Icon: Feather },
  science: { label: 'Science', Icon: FlaskConical },
  art: { label: 'Art', Icon: Palette },
  library: { label: 'Library', Icon: Library },
  review: { label: 'Review', Icon: RefreshCw },
}

export const skillStatusMeta: Record<
  SkillStatus,
  { label: string; pct: number; token: string }
> = {
  'not-introduced': { label: 'Not Introduced', pct: 0, token: 'optional' },
  learning: { label: 'Learning', pct: 30, token: 'handson' },
  practicing: { label: 'Practicing', pct: 60, token: 'momtime' },
  almost: { label: 'Almost There', pct: 80, token: 'independent' },
  mastered: { label: 'Mastered', pct: 100, token: 'independent' },
}

/** returns an inline style with the child's accent color as CSS var */
export function accent(token: string): CSSProperties {
  return { color: `var(--${token})` }
}

export function accentBg(token: string, alpha = 0.14): CSSProperties {
  return {
    backgroundColor: `color-mix(in oklch, var(--${token}) ${alpha * 100}%, transparent)`,
    color: `var(--${token})`,
  }
}

export function accentRing(token: string): CSSProperties {
  return { boxShadow: `inset 0 0 0 2px var(--${token})` }
}

export const dayLabels: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
}

export const dayRhythm: Record<string, string> = {
  monday: 'Introduce',
  tuesday: 'Practice + Explore',
  wednesday: 'Co-op Day',
  thursday: 'Deepen',
  friday: 'Review + Show What You Know',
}

export const viewIcons = { shared: Users2, mom: User, sparkle: Sparkles, help: HandHelping }

export const gradeBandOptions: { value: GradeBand; label: string }[] = [
  { value: 'pre-k', label: 'Pre-K' },
  { value: 'k', label: 'Kindergarten' },
  { value: '1st', label: '1st Grade' },
  { value: '2nd', label: '2nd Grade' },
  { value: '3rd', label: '3rd Grade' },
  { value: '4th', label: '4th Grade' },
  { value: '5th', label: '5th Grade' },
  { value: '6th', label: '6th Grade' },
  { value: '7th', label: '7th Grade' },
  { value: '8th', label: '8th Grade' },
  { value: '9th', label: '9th Grade' },
  { value: '10th', label: '10th Grade' },
  { value: '11th', label: '11th Grade' },
  { value: '12th', label: '12th Grade' },
]

export const gradeBandLabels: Record<GradeBand, string> = Object.fromEntries(
  gradeBandOptions.map((option) => [option.value, option.label]),
) as Record<GradeBand, string>
