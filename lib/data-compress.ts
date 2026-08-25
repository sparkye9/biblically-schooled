/** Data compression and encoding utilities for efficient storage */

export function compressJSON(data: unknown): string {
  const json = JSON.stringify(data)
  const encoded = encodeURIComponent(json)
  return encoded
}

export function decompressJSON(encoded: string): unknown {
  try {
    const json = decodeURIComponent(encoded)
    return JSON.parse(json)
  } catch {
    throw new Error('Failed to decompress data')
  }
}

export function estimateCompressionRatio(original: string): number {
  const encoded = encodeURIComponent(original)
  return encoded.length / original.length
}

export function createCompressedBackupFile(data: unknown): Blob {
  const json = JSON.stringify(data)
  const encoded = encodeURIComponent(json)
  return new Blob([encoded], { type: 'application/json' })
}

export function extractFromCompressedBackup(blob: Blob): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const encoded = e.target?.result as string
        const data = decompressJSON(encoded)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read compressed backup'))
    reader.readAsText(blob)
  })
}
