'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { childrenInView } from '@/lib/selectors'
import { skillStatusMeta, accent, accentBg } from '@/lib/ui'
import type { SkillStatus } from '@/lib/types'
import { PageHeader, ChildAvatar } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Feather, Calculator, Check } from 'lucide-react'

const STATUS_ORDER: SkillStatus[] = [
  'not-introduced',
  'learning',
  'practicing',
  'almost',
  'mastered',
]

export default function ProgressPage() {
  const store = useStore()
  const kids = childrenInView(store.children, store.currentView)
  const [selectedId, setSelectedId] = useState(kids[0]?.id ?? '')
  const child = kids.find((c) => c.id === selectedId) ?? kids[0]

  if (!child) return null

  const literacy = store.skills.filter(
    (s) => s.childId === child.id && s.track === 'literacy',
  )
  const math = store.skills.filter((s) => s.childId === child.id && s.track === 'math')

  return (
    <div>
      <PageHeader
        eyebrow="Skill Journey"
        title="Progress"
        description="Growth over grades. Tap a skill to move it forward as your child shows what they know — no red marks, ever."
      />

      <div className="mb-6 flex flex-wrap gap-2">
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

      <div className="grid gap-5 lg:grid-cols-2">
        <SkillTrack
          label="Literacy"
          Icon={Feather}
          skills={literacy}
          color={child.color}
          onAdvance={(id, cur) =>
            store.setSkillStatus(id, nextStatus(cur))
          }
        />
        <SkillTrack
          label="Math"
          Icon={Calculator}
          skills={math}
          color={child.color}
          onAdvance={(id, cur) =>
            store.setSkillStatus(id, nextStatus(cur))
          }
        />
      </div>
    </div>
  )
}

function nextStatus(cur: SkillStatus): SkillStatus {
  const i = STATUS_ORDER.indexOf(cur)
  return STATUS_ORDER[Math.min(i + 1, STATUS_ORDER.length - 1)]
}

function SkillTrack({
  label,
  Icon,
  skills,
  color,
  onAdvance,
}: {
  label: string
  Icon: typeof Feather
  skills: { id: string; name: string; status: SkillStatus }[]
  color: string
  onAdvance: (id: string, cur: SkillStatus) => void
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <span
          className="flex size-9 items-center justify-center rounded-xl"
          style={accentBg(color, 0.18)}
        >
          <Icon className="size-5" style={accent(color)} />
        </span>
        <h2 className="font-serif text-lg font-semibold text-foreground">{label}</h2>
      </div>

      <div className="space-y-3">
        {skills.map((s) => {
          const meta = skillStatusMeta[s.status]
          const mastered = s.status === 'mastered'
          return (
            <button
              key={s.id}
              onClick={() => onAdvance(s.id, s.status)}
              className="group w-full rounded-2xl border border-border p-3.5 text-left transition-colors hover:bg-muted/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  {mastered && (
                    <Check className="size-4" style={accent(color)} />
                  )}
                  {s.name}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
                  style={accentBg(meta.token, 0.18)}
                >
                  {meta.label}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${meta.pct}%`,
                    backgroundColor: `var(--${color})`,
                  }}
                />
              </div>
              {!mastered && (
                <p className="mt-1.5 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  Tap to move forward →
                </p>
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
