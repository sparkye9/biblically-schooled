import { AppShell } from '@/components/app-shell'
import { PinGate } from '@/components/pin-gate'
import { StoreProvider } from '@/lib/store'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <PinGate>
        <AppShell>{children}</AppShell>
      </PinGate>
    </StoreProvider>
  )
}
