import { SessionProvider } from 'next-auth/react'
import { StoreProvider } from '@/lib/store'

export default function KidLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>{children}</StoreProvider>
    </SessionProvider>
  )
}
