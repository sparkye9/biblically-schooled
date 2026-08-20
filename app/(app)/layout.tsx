import { SessionProvider } from 'next-auth/react'
import { AppShell } from '@/components/app-shell'
import { StoreProvider } from '@/lib/store'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>
        <AppShell>{children}</AppShell>
      </StoreProvider>
    </SessionProvider>
  )
}
