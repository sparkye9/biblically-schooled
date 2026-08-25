/** Batch print operations utility */

export function downloadMultiplePDFs(urls: string[], names: string[]) {
  urls.forEach((url, index) => {
    const link = document.createElement('a')
    link.href = url
    link.download = names[index] || `document-${index + 1}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

export function openMultiplePDFs(urls: string[]) {
  urls.forEach((url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  })
}

export function printMultiplePDFs(urls: string[]) {
  openMultiplePDFs(urls)
}

export interface PrintItem {
  id: string
  title: string
  url: string
  fileSize?: number
  type?: string
}

export function estimateTotalSize(items: PrintItem[]): string {
  const totalBytes = items.reduce((sum, item) => sum + (item.fileSize || 0), 0)
  if (totalBytes === 0) return 'Unknown'
  if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`
  return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatFileName(title: string, index: number): string {
  return `${index + 1}-${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
}
