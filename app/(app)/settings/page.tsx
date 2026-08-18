'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { accentBg } from '@/lib/ui'
import { PageHeader, ChildAvatar } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, RotateCcw, Home, User, Users } from 'lucide-react'
import { AddProfileDialog, AddChildDialog } from '@/components/profile-dialogs'

export default function SettingsPage() {
  const store = useStore()
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Manage your homeschool"
        title="Settings"
        description="Add family profiles and learners, or start fresh with the demo data."
      />

      {/* Families */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">Family profiles</h2>
          <AddProfileDialog trigger={<Button variant="outline"><Plus className="size-4" /> Add profile</Button>} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {store.households.map((h) => (
            <Card key={h.id} className="p-5">
              <div className="flex items-center gap-3">
                <span
                  className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-lg font-bold text-primary"
                >
                  {h.momInitial}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg font-semibold text-foreground">{h.name}</h3>
                  <p className="text-sm text-muted-foreground">{h.momName}&apos;s household</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {store.children.filter((c) => c.householdId === h.id).map((c) => (
                  <div key={c.id} className="flex items-center gap-2 text-sm text-foreground">
                    <ChildAvatar child={c} size="sm" />
                    {c.name} <span className="text-muted-foreground">· {c.grade}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="size-4" />
                  {store.children.filter((c) => c.householdId === h.id).length} learners
                </div>
              </div>
            </Card>
          ))}
          {store.households.length === 0 && (
            <p className="text-muted-foreground">No family profiles yet.</p>
          )}
        </div>
      </section>

      {/* Learners */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">Learners</h2>
          <AddChildDialog trigger={<Button variant="outline"><Plus className="h-4 w-4" /> Add child</Button>} />
        </div>
        <Card className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {store.children.map((c) => {
              const h = store.households.find((x) => x.id === c.householdId)
              return (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <ChildAvatar child={c} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.grade} · {h?.name}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <label className="flex items-center gap-1.5">
                      <Switch
                        checked={c.childMode}
                        onCheckedChange={(on) => store.setChildMode(c.id, on)}
                      />
                      Child
                    </label>
                    <label className="flex items-center gap-1.5">
                      <Checkbox
                        checked={c.lowDistraction}
                        onCheckedChange={(on) => store.setLowDistraction(c.id, !!on)}
                      />
                      Calm
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="mb-3 font-serif text-xl font-semibold">Data</h2>
        <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-foreground">Reset demo data</p>
            <p className="text-sm text-muted-foreground">
              Clears local progress and restores the sample household, learners, and lessons.
            </p>
          </div>
          {confirmReset ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setConfirmReset(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { store.reset(); setConfirmReset(false); }}>
                <RotateCcw className="h-4 w-4" /> Reset now
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setConfirmReset(true)}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          )}
        </Card>
      </section>
    </div>
  )
}