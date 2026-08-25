/** Reusable animated modal wrapper for consistent transitions */

import { cn } from '@/lib/utils'
import { animations, transitions } from '@/lib/animations'

interface AnimatedModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function AnimatedModal({ isOpen, onClose, children, title }: AnimatedModalProps) {
  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
        transitions.fast,
        isOpen ? 'opacity-100' : 'opacity-0',
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'w-full max-w-2xl rounded-2xl bg-card shadow-lg',
          transitions.normal,
          isOpen ? 'scale-100' : 'scale-95',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
