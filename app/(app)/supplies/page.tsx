'use client'

import { useStore } from '@/lib/store'
import { accentBg } from '@/lib/ui'
import { PageHeader } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Printer, Home, Scissors, FlaskConical, Sparkles, Lightbulb } from 'lucide-react'
import type { SupplyItem } from '@/lib/types'

const SECTION_META: Record<
  SupplyItem['section'],
  { label: string; token: string; Icon: typeof Home }
> = {
  print: { label: 'To Print', token: 'primary', Icon: Printer },
  household: { label: 'Around the House', token: 'child-olori', Icon: Home },
  craft: { label: 'Craft Supplies', token: 'child-seraiah', Icon: Scissors },
  science: { label: 'Science', token: 'child-alijah', Icon: FlaskConical },
  optional: { label: 'Nice to Have', token: 'child-amelia', Icon: Sparkles },
}

export default function SuppliesPage() {
  const store = useStore()
  const haveCount = store.supplies.filter((s) => s.have).length

  const sections = (Object.keys(SECTION_META) as SupplyItem['section'][])
    .map((section) => ({
      section,
      items: store.supplies.filter((s) => s.section === section),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div>
      <PageHeader
        eyebrow="Prep Once"
        title="Supplies & Materials"
        description="Everything you need for the week — most of it is already in your kitchen. Check off what you have so nothing surprises you mid-lesson."
      >
        <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-foreground">
          {haveCount}/{store.supplies.length} ready
        </span>
      </PageHeader>

      <div className="grid gap-5 md:grid-cols-2">
        {sections.map(({ section, items }) => {
          const meta = SECTION_META[section]
          return (
            <Card key={section} className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="flex size-8 items-center justify-center rounded-lg"
                  style={accentBg(meta.token, 0.18)}
                >
                  <meta.Icon
                    className="size-4"
                    style={{ color: `var(--${meta.token})` }}
                  />
                </span>
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  {meta.label}
                </h2>
              </div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50">
                      <Checkbox
                        checked={item.have}
                        onCheckedChange={() => store.toggleSupply(item.id)}
                        className="mt-0.5"
                      />
                      <span className="flex-1">
                        <span
                          className={
                            item.have
                              ? 'font-medium text-muted-foreground line-through'
                              : 'font-medium text-foreground'
                          }
                        >
                          {item.label}
                        </span>
                        {item.substitute && (
                          <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Lightbulb className="size-3 shrink-0 text-primary" />
                            No problem — use {item.substitute}
                          </span>
                        )}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
