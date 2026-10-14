'use client'

import { useRef, useState } from 'react'
import { Download, Trash2, Upload } from 'lucide-react'
import type { DayMode, EnrichmentKind } from '@/lib/curriculum/types'
import { MODE_INFO } from '@/lib/plan/day-plan'
import { DEFAULT_SCHEDULE, ENRICHMENT_LABELS, WEEKDAY_LABELS, type DayKind, type WeeklySchedule } from '@/lib/plan/schedule'
import { useStore } from '@/lib/store'
import { Card, PageHeader, Section } from '@/components/primitives'

const input = 'rounded-lg border border-border bg-card px-3 py-2 text-sm'

export default function SettingsPage() {
  const store = useStore()
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Set it once" title="Settings" />
      <ScheduleSettings />
      <CalendarSettings />
      <Section title="Default school day">
        <Card>
          <div className="grid gap-2 sm:grid-cols-3">
            {(['full', 'standard', 'minimum'] as DayMode[]).map((m) => (
              <button key={m} type="button" aria-pressed={store.defaultMode === m} onClick={() => store.setDefaultMode(m)} className={`rounded-xl border-2 p-3 text-left ${store.defaultMode === m ? 'border-primary bg-sage-soft/50' : 'border-border'}`}>
                <p className="font-bold">{MODE_INFO[m].label}</p>
                <p className="text-xs text-muted-foreground">{MODE_INFO[m].blurb}</p>
              </button>
            ))}
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={store.preferSeasonal} onChange={(e) => store.setPrefs({ preferSeasonal: e.target.checked })} className="size-5" />
            Use seasonal Bible lessons (Thanksgiving, Advent, Holy Week) when they’re in season
          </label>
        </Card>
      </Section>
      <HouseholdSettings />
      <PinSettings />
      <BackupSettings />
    </div>
  )
}

function ScheduleSettings() {
  const store = useStore()
  const set = (i: number, patch: Partial<WeeklySchedule[number]>) => {
    const next = store.schedule.map((d, j) => (j === i ? { ...d, ...patch } : d)) as WeeklySchedule
    store.setSchedule(next)
  }
  const order = [1, 2, 3, 4, 5, 6, 0]
  const schoolDays = store.schedule.filter((d) => d.kind === 'school').length
  return (
    <Section title="Our weekly rhythm">
      <Card>
        <p className="text-sm text-muted-foreground">Each school day teaches the next lesson. Co-op and rest days never use up a lesson.</p>
        <div className="mt-3 divide-y divide-border">
          {order.map((i) => {
            const d = store.schedule[i]
            return (
              <div key={i} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                <span className="w-24 font-semibold">{WEEKDAY_LABELS[i]}</span>
                <select aria-label={`${WEEKDAY_LABELS[i]} type`} value={d.kind} onChange={(e) => set(i, { kind: e.target.value as DayKind, enrichment: e.target.value === 'school' ? d.enrichment : null })} className={input}>
                  <option value="school">Core learning</option>
                  <option value="coop">Co-op</option>
                  <option value="off">No school</option>
                </select>
                {d.kind === 'school' && (
                  <select aria-label={`${WEEKDAY_LABELS[i]} enrichment`} value={d.enrichment ?? ''} onChange={(e) => set(i, { enrichment: (e.target.value || null) as EnrichmentKind | null })} className={input}>
                    <option value="">+ nothing extra</option>
                    {(Object.keys(ENRICHMENT_LABELS) as EnrichmentKind[]).map((k) => (
                      <option key={k} value={k}>
                        + {ENRICHMENT_LABELS[k]}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )
          })}
        </div>
        {schoolDays !== 4 && <p className="mt-2 text-xs text-muted-foreground">You have {schoolDays} school days a week. Each curriculum week has 4 lesson days, so weeks will simply take {schoolDays > 4 ? 'less' : 'more'} than a calendar week.</p>}
        <button type="button" onClick={() => store.setSchedule(DEFAULT_SCHEDULE)} className="mt-3 text-xs font-semibold text-primary underline">
          Reset to Mon science · Tue library · Wed co-op · Thu art · Fri review
        </button>
      </Card>
    </Section>
  )
}

function CalendarSettings() {
  const store = useStore()
  const [start, setStart] = useState(store.schoolYearStartDate)
  const [b, setB] = useState({ startDate: '', endDate: '', label: '' })
  return (
    <Section title="School year and breaks">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-end gap-2">
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-bold text-muted-foreground">First day of school</span>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={input} />
          </label>
          <button type="button" disabled={!start || start === store.schoolYearStartDate} onClick={() => store.setStartDate(start)} className="rounded-full border border-border px-4 py-2 text-sm font-bold disabled:opacity-40">
            Save
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Used only for the pace indicator and projected finish date. Your lessons move with you, not the calendar.</p>
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!b.startDate) return
            store.addBreak({ startDate: b.startDate, endDate: b.endDate || b.startDate, label: b.label || undefined })
            setB({ startDate: '', endDate: '', label: '' })
          }}
        >
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-bold text-muted-foreground">Break starts</span>
            <input type="date" value={b.startDate} onChange={(e) => setB({ ...b, startDate: e.target.value })} className={input} />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-bold text-muted-foreground">Ends</span>
            <input type="date" value={b.endDate} onChange={(e) => setB({ ...b, endDate: e.target.value })} className={input} />
          </label>
          <label className="grid flex-1 gap-1 text-sm">
            <span className="text-xs font-bold text-muted-foreground">Name (optional)</span>
            <input value={b.label} onChange={(e) => setB({ ...b, label: e.target.value })} placeholder="Christmas break" className={input} />
          </label>
          <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
            Add break
          </button>
        </form>
        {store.breaks.length > 0 && (
          <ul className="divide-y divide-border text-sm">
            {store.breaks.map((br) => (
              <li key={br.id} className="flex items-center gap-2 py-2">
                <span className="flex-1">
                  {br.label ?? 'Break'}: {br.startDate} → {br.endDate}
                </span>
                <button type="button" aria-label="Remove break" onClick={() => store.removeBreak(br.id)} className="p-1 text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Section>
  )
}

function HouseholdSettings() {
  const store = useStore()
  const [mom, setMom] = useState('')
  return (
    <Section title="Households">
      <Card>
        <ul className="text-sm">
          {store.households.map((h) => (
            <li key={h.id} className="py-1">
              <b>{h.momName}</b> — {store.children.filter((c) => c.householdId === h.id).map((c) => c.name).join(', ') || 'no learners yet'}
            </li>
          ))}
        </ul>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!mom.trim()) return
            store.addHousehold('', mom.trim())
            setMom('')
          }}
        >
          <input value={mom} onChange={(e) => setMom(e.target.value)} placeholder="Parent’s first name" aria-label="Parent name" className={`${input} flex-1`} />
          <button type="submit" className="rounded-full border border-border px-4 py-2 text-sm font-bold">
            Add household
          </button>
        </form>
      </Card>
    </Section>
  )
}

function PinSettings() {
  const store = useStore()
  const [view, setView] = useState('')
  const [parent, setParent] = useState('')
  return (
    <Section title="Locks">
      <Card className="space-y-4 text-sm">
        <div>
          <p className="font-semibold">App PIN {store.viewPin ? '(on)' : '(off)'}</p>
          <p className="text-xs text-muted-foreground">Asks for a PIN when the app opens on this device.</p>
          <div className="mt-2 flex gap-2">
            <input inputMode="numeric" value={view} onChange={(e) => setView(e.target.value.replace(/\D/g, ''))} placeholder="New PIN" aria-label="App PIN" className={input} />
            <button type="button" disabled={view.length < 4} onClick={() => { store.setPrefs({ viewPin: view }); setView('') }} className="rounded-full border border-border px-4 py-2 font-bold disabled:opacity-40">
              Set
            </button>
            {store.viewPin && (
              <button type="button" onClick={() => store.setPrefs({ viewPin: undefined })} className="rounded-full px-3 py-2 text-destructive">
                Turn off
              </button>
            )}
          </div>
        </div>
        <div>
          <p className="font-semibold">Grown-up PIN for leaving kid view {store.parentPin ? '(on)' : '(off)'}</p>
          <p className="text-xs text-muted-foreground">Without a PIN, leaving kid view asks a grown-up math question.</p>
          <div className="mt-2 flex gap-2">
            <input inputMode="numeric" value={parent} onChange={(e) => setParent(e.target.value.replace(/\D/g, ''))} placeholder="New PIN" aria-label="Grown-up PIN" className={input} />
            <button type="button" disabled={parent.length < 4} onClick={() => { store.setPrefs({ parentPin: parent }); setParent('') }} className="rounded-full border border-border px-4 py-2 font-bold disabled:opacity-40">
              Set
            </button>
            {store.parentPin && (
              <button type="button" onClick={() => store.setPrefs({ parentPin: undefined })} className="rounded-full px-3 py-2 text-destructive">
                Turn off
              </button>
            )}
          </div>
        </div>
      </Card>
    </Section>
  )
}

function BackupSettings() {
  const store = useStore()
  const file = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  return (
    <Section title="Backup">
      <Card className="space-y-3 text-sm">
        <p className="text-muted-foreground">Everything is saved on this device. Download a backup now and then, or to move to a new device. Backups from the previous version of the app can be restored too.</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([JSON.stringify(store.exportBackup(), null, 2)], { type: 'application/json' })
              const a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = `biblically-schooled-backup-${store.todayIso}.json`
              a.click()
              URL.revokeObjectURL(a.href)
            }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-bold text-primary-foreground"
          >
            <Download className="size-4" /> Download backup
          </button>
          <button type="button" onClick={() => file.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-bold">
            <Upload className="size-4" /> Restore from file
          </button>
          <input
            ref={file}
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              try {
                store.importBackup(JSON.parse(await f.text()))
                setMsg('Restored. Welcome back!')
              } catch (err) {
                setMsg(err instanceof Error ? err.message : 'That file could not be read.')
              }
              e.target.value = ''
            }}
          />
        </div>
        {msg && <p role="status" className="font-semibold">{msg}</p>}
        <div className="border-t border-border pt-3">
          {confirmReset ? (
            <p className="flex flex-wrap items-center gap-2">
              Erase everything on this device and start fresh? Download a backup first.
              <button type="button" onClick={() => { store.reset(); setConfirmReset(false) }} className="rounded-full bg-destructive/10 px-3 py-1 font-bold text-destructive">
                Erase
              </button>
              <button type="button" onClick={() => setConfirmReset(false)} className="rounded-full border border-border px-3 py-1">
                Cancel
              </button>
            </p>
          ) : (
            <button type="button" onClick={() => setConfirmReset(true)} className="text-xs text-muted-foreground underline">
              Start fresh…
            </button>
          )}
        </div>
      </Card>
    </Section>
  )
}
