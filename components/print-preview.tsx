'use client'

import { useState } from 'react'
import { Download, Printer, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { transitions } from '@/lib/animations'
import type { PrintItem } from '@/lib/print-batch'
import { downloadMultiplePDFs, openMultiplePDFs, formatFileName, estimateTotalSize } from '@/lib/print-batch'

interface PrintPreviewProps {
  items: PrintItem[]
  onClose: () => void
}

export function PrintPreview({ items, onClose }: PrintPreviewProps) {
  const [previewing, setPreviewing] = useState(true)
  const totalSize = estimateTotalSize(items)

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-300', transitions.fast)}>
      <Card className={cn('max-h-[90vh] w-full max-w-2xl overflow-y-auto animate-in zoom-in-95 duration-300', transitions.normal)}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-4">
          <div>
            <h2 className="font-serif text-xl font-semibold">Print Preview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {items.length} document{items.length !== 1 ? 's' : ''} • {totalSize}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted"
            aria-label="Close preview"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Preview content */}
        <div className="space-y-2 p-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="flex size-8 items-center justify-center rounded bg-primary/15 text-primary shrink-0">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{item.title}</p>
                  {item.fileSize && (
                    <p className="text-xs text-muted-foreground">
                      {(item.fileSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground shrink-0">
                {index + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="sticky bottom-0 border-t border-border bg-card p-4 flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              openMultiplePDFs(items.map((i) => i.url))
            }}
            className="gap-2 flex-1"
          >
            <Printer className="size-4" />
            Open to Print
          </Button>
          <Button
            onClick={() => {
              downloadMultiplePDFs(
                items.map((i) => i.url),
                items.map((i, idx) => formatFileName(i.title, idx))
              )
            }}
            className="gap-2 flex-1"
          >
            <Download className="size-4" />
            Download All
          </Button>
        </div>
      </Card>
    </div>
  )
}
