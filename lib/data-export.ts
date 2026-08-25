/** Data export and backup utilities */

import type {
  Household,
  Child,
  Lesson,
  Assignment,
  Skill,
  Resource,
  ReadAloudBook,
  SupplyItem,
  ParentNote,
  CurriculumWeek,
  PausedWeek,
} from './types'

export interface BackupData {
  version: string
  timestamp: string
  households: Household[]
  children: Child[]
  weeks: CurriculumWeek[]
  lessons: Lesson[]
  assignments: Assignment[]
  skills: Skill[]
  resources: Resource[]
  readAloud: ReadAloudBook[]
  supplies: SupplyItem[]
  parentNotes: ParentNote[]
  pausedWeeks: PausedWeek[]
  schoolYearStartDate: string
}

export function createBackup(data: {
  households: Household[]
  children: Child[]
  weeks: CurriculumWeek[]
  lessons: Lesson[]
  assignments: Assignment[]
  skills: Skill[]
  resources: Resource[]
  readAloud: ReadAloudBook[]
  supplies: SupplyItem[]
  parentNotes: ParentNote[]
  pausedWeeks: PausedWeek[]
  schoolYearStartDate: string
}): BackupData {
  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    ...data,
  }
}

export function exportBackupAsJSON(backup: BackupData): string {
  return JSON.stringify(backup, null, 2)
}

export function downloadBackup(backup: BackupData, filename?: string) {
  const json = exportBackupAsJSON(backup)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `biblically-schooled-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function importBackup(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (!data.version || !data.timestamp) {
          reject(new Error('Invalid backup file format'))
        }
        resolve(data as BackupData)
      } catch (error) {
        reject(new Error('Failed to parse backup file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export function getBackupStats(backup: BackupData) {
  return {
    households: backup.households.length,
    children: backup.children.length,
    weeks: backup.weeks.length,
    lessons: backup.lessons.length,
    assignments: backup.assignments.length,
    skills: backup.skills.length,
    resources: backup.resources.length,
    readAloudBooks: backup.readAloud.length,
    supplyItems: backup.supplies.length,
    parentNotes: backup.parentNotes.length,
    pausedWeeks: backup.pausedWeeks.length,
  }
}

export function getBackupSize(backup: BackupData): string {
  const json = JSON.stringify(backup)
  const bytes = new Blob([json]).size
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
