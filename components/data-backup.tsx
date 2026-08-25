'use client'

import { useState, useRef } from 'react'
import { useStore } from '@/lib/store'
import { createBackup, downloadBackup, importBackup, getBackupStats, getBackupSize } from '@/lib/data-export'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Upload, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { transitions } from '@/lib/animations'

export function DataBackup() {
  const store = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [confirmRestore, setConfirmRestore] = useState(false)
  const [restoreFile, setRestoreFile] = useState<File | null>(null)

  const currentBackup = createBackup({
    households: store.households,
    children: store.children,
    weeks: store.weeks,
    lessons: store.lessons,
    assignments: store.assignments,
    skills: store.skills,
    resources: store.resources,
    readAloud: store.readAloud,
    supplies: store.supplies,
    parentNotes: store.parentNotes,
    pausedWeeks: store.pausedWeeks,
    schoolYearStartDate: store.schoolYearStartDate,
  })

  const stats = getBackupStats(currentBackup)
  const size = getBackupSize(currentBackup)

  const handleExport = () => {
    downloadBackup(currentBackup)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    try {
      setImporting(true)
      const backup = await importBackup(file)
      setRestoreFile(file)
      setConfirmRestore(true)
    } catch (error) {
      alert('Failed to read backup file. Make sure it\'s a valid Biblically Schooled backup.')
      setImporting(false)
    }
  }

  const handleRestore = async () => {
    if (!restoreFile) return

    try {
      const backup = await importBackup(restoreFile)
      store.restoreFromBackup(backup)
      setConfirmRestore(false)
      setRestoreFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      alert('Failed to restore backup.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Export */}
      <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="font-bold text-foreground">Export backup</p>
          <p className="text-sm text-muted-foreground">
            Download your curriculum, children, schedules, and progress as a JSON file. {size}
          </p>
          <div className="mt-2 text-xs text-muted-foreground">
            {Object.entries(stats).map(([key, count]) => (
              <div key={key}>
                {key}: {count}
              </div>
            ))}
          </div>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="size-4" /> Export
        </Button>
      </Card>

      {/* Import/Restore */}
      <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="font-bold text-foreground">Restore from backup</p>
          <p className="text-sm text-muted-foreground">
            Upload a previously exported backup file to restore all your data.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            disabled={importing}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="gap-2"
          >
            <Upload className="size-4" /> Choose file
          </Button>
        </div>
      </Card>

      {/* Restore confirmation */}
      {confirmRestore && restoreFile && (
        <Card className={cn('flex flex-col gap-3 border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950 sm:flex-row sm:items-center sm:justify-between animate-in slide-in-from-top duration-300', transitions.normal)}>
          <div className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-200 text-amber-700 dark:bg-amber-900 dark:text-amber-200">
              <AlertCircle className="size-4" />
            </span>
            <div className="flex-1">
              <p className="font-bold text-amber-900 dark:text-amber-100">Restore {restoreFile.name}?</p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                This will replace all your current data. This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmRestore(false)
                setRestoreFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              disabled={importing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRestore}
              disabled={importing}
            >
              {importing ? 'Restoring...' : 'Restore'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
