'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { accentBg, dayLabels } from '@/lib/ui'
import { PageHeader, ChildAvatar } from '@/components/primitives'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Plus, RotateCcw, Home, User, Users, Lock, CalendarDays, CalendarOff, Trash2 } from 'lucide-react'
import { AddProfileDialog, AddChildDialog } from '@/components/profile-dialogs'
import { DataBackup } from '@/components/data-backup'
import { capitalize, formatISODate as formatDate } from '@/lib/school-calendar'

export default function SettingsPage() {
  const store = useStore()
  const [confirmReset, setConfirmReset] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [startDateInput, setStartDateInput] = useState(store.schoolYearStartDate)
  const [breakLabel, setBreakLabel] = useState('')
  const [breakStart, setBreakStart] = useState('')
  const [breakEnd, setBreakEnd] = useState('')

  const { schoolStatus } = store
  const statusText = schoolStatus.isWeekend
    ? `${capitalize(schoolStatus.actualDayName)} · Rest day.`
    : schoolStatus.notStarted
      ? `School starts ${formatDate(store.schoolYearStartDate)}.`
      : schoolStatus.onBreak
        ? `On break${schoolStatus.pause?.label ? ` — ${schoolStatus.pause.label}` : ''}. Back to Week ${store.currentWeek}, ${dayLabels[store.currentDay]} when it ends.`
        : schoolStatus.isUpcoming
          ? `Next school day: Week ${store.currentWeek}, ${dayLabels[store.currentDay]}.`
          : `Today: Week ${store.currentWeek}, ${dayLabels[store.currentDay]}.`

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Manage your homeschool"
        title="Settings"
        description="Add family profiles and learners, or start fresh with the demo data."
      />

      {/* School calendar */}
      <section>
        <h2 className="mb-3 font-serif text-xl font-semibold">School Calendar</h2>
        <Card className="space-y-5 p-5">
          <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <CalendarDays className="size-4" />
            </span>
            <p className="text-sm font-semibold text-foreground">{statusText}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <Label htmlFor="school-start" className="mb-2">
                School year start date
              </Label>
              <Input
                id="school-start"
                type="date"
                value={startDateInput}
                onChange={(event) => setStartDateInput(event.target.value)}
                className="sm:max-w-56"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Week 1, Monday begins here. Everything else — today&apos;s week and day —
                tracks forward from this date automatically.
              </p>
            </div>
            <Button
              variant="outline"
              disabled={!startDateInput || startDateInput === store.schoolYearStartDate}
              onClick={() => store.setSchoolYearStartDate(startDateInput)}
            >
              Save
            </Button>
          </div>

          <div className="border-t border-border pt-5">
            <div className="mb-3 flex items-center gap-2">
              <CalendarOff className="size-4 text-primary" />
              <h3 className="font-serif text-lg font-semibold">Pause weeks (breaks)</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Add a break — a holiday, a sick week, anything — and the schedule skips
              those days without losing your place. Weeks after the break shift forward
              to match.
            </p>

            {store.pausedWeeks.length > 0 && (
              <div className="mb-4 space-y-2">
                {store.pausedWeeks
                  .slice()
                  .sort((a, b) => a.startDate.localeCompare(b.startDate))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-foreground">{p.label || 'Break'}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(p.startDate)} &ndash; {formatDate(p.endDate)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${p.label || 'break'}`}
                        onClick={() => store.removePausedWeek(p.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
              <div>
                <Label htmlFor="break-label" className="mb-2">Label</Label>
                <Input
                  id="break-label"
                  placeholder="Christmas Break"
                  value={breakLabel}
                  onChange={(event) => setBreakLabel(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="break-start" className="mb-2">Start</Label>
                <Input
                  id="break-start"
                  type="date"
                  value={breakStart}
                  onChange={(event) => setBreakStart(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="break-end" className="mb-2">End</Label>
                <Input
                  id="break-end"
                  type="date"
                  value={breakEnd}
                  onChange={(event) => setBreakEnd(event.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  disabled={!breakStart || !breakEnd || breakEnd < breakStart}
                  onClick={() => {
                    store.addPausedWeek({
                      startDate: breakStart,
                      endDate: breakEnd,
                      label: breakLabel || undefined,
                    })
                    setBreakLabel('')
                    setBreakStart('')
                    setBreakEnd('')
                  }}
                >
                  <Plus className="size-4" /> Add
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-xl font-semibold">App lock</h2>
        <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Lock className="size-5" />
            </span>
            <div>
              <p className="font-bold text-foreground">
                {store.viewPin ? 'PIN is set' : 'No PIN set'}
              </p>
              <p className="text-sm text-muted-foreground">
                Optional — require a PIN to view this homeschool on this device.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              inputMode="numeric"
              placeholder={store.viewPin ? 'New PIN' : 'Set a PIN'}
              value={pinInput}
              onChange={(event) => setPinInput(event.target.value)}
              className="w-32"
              maxLength={12}
            />
            <Button
              variant="outline"
              disabled={!pinInput}
              onClick={() => {
                store.setViewPin(pinInput)
                setPinInput('')
              }}
            >
              Save
            </Button>
            {store.viewPin && (
              <Button variant="ghost" onClick={() => store.setViewPin(null)}>
                Remove
              </Button>
            )}
          </div>
        </Card>
      </section>

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

      {/* Backup & restore */}
      <section>
        <h2 className="mb-3 font-serif text-xl font-semibold">Backup & Restore</h2>
        <DataBackup />
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