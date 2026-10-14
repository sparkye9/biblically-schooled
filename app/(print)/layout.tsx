import { PinGate } from '@/components/pin-gate'

/** Print pages render without the app shell so only the paper shows. */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <PinGate>{children}</PinGate>
}
