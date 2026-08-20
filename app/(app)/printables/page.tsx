'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  Download,
  FileText,
  Heart,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { getWorksheetFile, saveWorksheetFile } from '@/lib/worksheet-files'
import { subjectMeta } from '@/lib/ui'
import type { GradeBand, ResourceType, Subject } from '@/lib/types'
import { PageHeader, SubjectPill } from '@/components/primitives'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const MAX_FILE_SIZE = 15 * 1024 * 1024
const fieldClass =
  'h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30'
const resourceTypes: ResourceType[] = [
  'Worksheet',
  'Tracing',
  'Mini Book',
  'Flash Cards',
  'Cut & Paste',
  'Reading Passage',
  'Math Practice',
  'Coloring',
  'Science',
  'Art',
  'Bible',
]

export default function PrintablesPage() {
  const store = useStore()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<ResourceType>('Worksheet')
  const [subject, setSubject] = useState<Subject>('literacy')
  const [skill, setSkill] = useState('General practice')
  const [gradeBand, setGradeBand] = useState<GradeBand>('pre-k')
  const [weekNumber, setWeekNumber] = useState(store.currentWeek)
  const [minutes, setMinutes] = useState(10)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [openingId, setOpeningId] = useState('')

  const owner =
    store.currentView === 'shared' ? store.activeMomHouseholdId : store.currentView
  const contributor =
    store.households.find((household) => household.id === owner)?.momName ?? 'Family'
  const resources = store.resources.filter(
    (resource) =>
      // Hide placeholder entries with no actual file behind them.
      (resource.fileUrl || resource.fileKey) &&
      (store.currentView === 'shared' ||
        resource.owner === 'shared' ||
        resource.owner === store.currentView),
  )

  async function openWorksheet(resourceId: string, fileKey: string) {
    setOpeningId(resourceId)
    setError('')
    try {
      const stored = await getWorksheetFile(fileKey)
      if (!stored) throw new Error('This file is not available on this device.')
      const url = URL.createObjectURL(stored.blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = stored.name
      anchor.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not open the worksheet.')
    } finally {
      setOpeningId('')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Printable library"
        title="Worksheets & printables"
        description="Upload your own worksheet, tag it by week and grade, then find it alongside the curriculum resources."
      />

      <Card className="p-5">
        <div className="mb-5 flex items-start gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Upload className="size-5" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-semibold">Upload a worksheet</h2>
            <p className="text-sm text-muted-foreground">
              PDF, Word, JPG, PNG, or WebP up to 15 MB. Files stay on this device.
            </p>
          </div>
        </div>

        <form
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={async (event) => {
            event.preventDefault()
            setError('')
            setStatus('')
            if (!file) {
              setError('Choose a worksheet file to upload.')
              return
            }
            if (file.size > MAX_FILE_SIZE) {
              setError('That file is larger than 15 MB.')
              return
            }

            setUploading(true)
            try {
              const fileKey = `worksheet-${crypto.randomUUID()}`
              await saveWorksheetFile(fileKey, file)
              store.addResource({
                title: title.trim() || file.name.replace(/\.[^.]+$/, ''),
                type,
                subject,
                skill: skill.trim() || 'General practice',
                gradeBand,
                weekNumber,
                minutes,
                owner,
                contributor,
                saved: true,
                fileKey,
                fileName: file.name,
                fileType: file.type || 'application/octet-stream',
                fileSize: file.size,
              })
              setStatus(`${file.name} uploaded successfully.`)
              setFile(null)
              setTitle('')
              setSkill('General practice')
              const fileInput = document.getElementById('worksheet-file') as HTMLInputElement | null
              if (fileInput) fileInput.value = ''
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : 'The worksheet could not be saved.')
            } finally {
              setUploading(false)
            }
          }}
        >
          <div className="space-y-2 sm:col-span-2 lg:col-span-4">
            <Label htmlFor="worksheet-file">Worksheet file</Label>
            <Input
              id="worksheet-file"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null
                setFile(selected)
                if (selected && !title.trim()) {
                  setTitle(selected.name.replace(/\.[^.]+$/, ''))
                }
              }}
              required
              className="h-10 py-1.5"
            />
          </div>
          <Field label="Title" id="worksheet-title" className="sm:col-span-2">
            <Input id="worksheet-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Short A word sort" />
          </Field>
          <NativeSelect label="Type" value={type} onChange={(value) => setType(value as ResourceType)}>
            {resourceTypes.map((resourceType) => <option key={resourceType} value={resourceType}>{resourceType}</option>)}
          </NativeSelect>
          <NativeSelect label="Subject" value={subject} onChange={(value) => setSubject(value as Subject)}>
            {(Object.keys(subjectMeta) as Subject[]).map((item) => <option key={item} value={item}>{subjectMeta[item].label}</option>)}
          </NativeSelect>
          <Field label="Skill or topic" id="worksheet-skill" className="sm:col-span-2">
            <Input id="worksheet-skill" value={skill} onChange={(event) => setSkill(event.target.value)} />
          </Field>
          <NativeSelect label="Grade" value={gradeBand} onChange={(value) => setGradeBand(value as GradeBand)}>
            <option value="pre-k">Pre-K</option>
            <option value="k">Kindergarten</option>
            <option value="1st">1st Grade</option>
          </NativeSelect>
          <NativeSelect label="Week" value={String(weekNumber)} onChange={(value) => setWeekNumber(Number(value))}>
            {store.weeks.map((week) => <option key={week.id} value={week.number}>Week {week.number}</option>)}
          </NativeSelect>
          <Field label="Minutes" id="worksheet-minutes">
            <Input id="worksheet-minutes" type="number" min={1} max={180} value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} />
          </Field>
          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <Button type="submit" disabled={uploading || !file} className="w-full sm:w-auto">
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {uploading ? 'Saving…' : 'Upload worksheet'}
            </Button>
          </div>
        </form>

        {status && (
          <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2 text-sm font-semibold text-secondary-foreground">
            <CheckCircle2 className="size-4" /> {status}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold">Resource library</h2>
            <p className="text-sm text-muted-foreground">{resources.length} resources in this view</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-primary">
                  <FileText className="size-4" />
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => store.toggleResourceSaved(resource.id)}
                    aria-label={resource.saved ? `Remove ${resource.title} from saved` : `Save ${resource.title}`}
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted"
                  >
                    <Heart className={`size-4 ${resource.saved ? 'fill-primary text-primary' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${resource.title}"? This can't be undone.`)) {
                        store.deleteResource(resource.id)
                      }
                    }}
                    aria-label={`Delete ${resource.title}`}
                    className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-3 font-bold">{resource.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <SubjectPill subject={resource.subject} />
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">{resource.type}</span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">Week {resource.weekNumber}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {resource.skill} · {gradeLabel(resource.gradeBand)} · {resource.minutes} min
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Shared by {resource.contributor}</p>
              {resource.fileUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  nativeButton={false}
                  render={<a href={resource.fileUrl} target="_blank" rel="noreferrer" />}
                >
                  <Download className="size-4" />
                  Download PDF
                </Button>
              )}
              {!resource.fileUrl && resource.fileKey && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  disabled={openingId === resource.id}
                  onClick={() => openWorksheet(resource.id, resource.fileKey!)}
                >
                  {openingId === resource.id ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                  {openingId === resource.id ? 'Opening…' : 'Download file'}
                </Button>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

function Field({ label, id, className, children }: { label: string; id: string; className?: string; children: React.ReactNode }) {
  return <div className={`space-y-2 ${className ?? ''}`}><Label htmlFor={id}>{label}</Label>{children}</div>
}

function NativeSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  const id = `resource-${label.toLowerCase().replaceAll(' ', '-')}`
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>{children}</select></div>
}

function gradeLabel(gradeBand: GradeBand) {
  if (gradeBand === 'pre-k') return 'Pre-K'
  if (gradeBand === 'k') return 'Kindergarten'
  return '1st Grade'
}
