'use client'

/**
 * Lightweight IndexedDB-backed store for locally uploaded worksheet files.
 * Files stay on this device (no upload to a server) and can be retrieved
 * later for download/review. Falls back to in-memory if IndexedDB is
 * unavailable (e.g. private browsing).
 */

const DB_NAME = 'biblically-schooled-files'
const STORE = 'worksheets'
const VERSION = 1

export interface StoredWorksheetFile {
  key: string
  blob: Blob
  name: string
  type: string
  size: number
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available.'))
      return
    }
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'key' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('Could not open file storage.'))
  })
}

const memory: Record<string, StoredWorksheetFile> = {}

export async function saveWorksheetFile(key: string, file: File): Promise<void> {
  const blob = file as Blob
  const record: StoredWorksheetFile = {
    key,
    blob,
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
  }
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(record)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('Could not save file.'))
    })
  } catch {
    memory[key] = record
  }
}

export async function getWorksheetFile(key: string): Promise<StoredWorksheetFile | null> {
  try {
    const db = await openDb()
    const record = await new Promise<StoredWorksheetFile | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(key)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error ?? new Error('Could not read file.'))
    })
    if (record) return record
  } catch {
    /* fall through to memory */
  }
  return memory[key] ?? null
}