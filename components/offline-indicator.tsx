'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export function OfflineIndicator() {
  const [online, setOnline] = useState(true)

  useEffect(() => {
    setOnline(navigator.onLine)

    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 lg:left-64 lg:right-4 z-40 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 border border-amber-200 shadow-sm dark:bg-amber-950 dark:text-amber-100 dark:border-amber-900">
      <WifiOff className="size-4 shrink-0" />
      You're offline — changes will sync when you reconnect
    </div>
  )
}
