import { AppShell } from '@/components/app-shell'
import { PinGate } from '@/components/pin-gate'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PinGate>
      <AppShell>{children}</AppShell>
    </PinGate>
  )
}
