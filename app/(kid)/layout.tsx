import { StoreProvider } from '@/lib/store'

export default function KidLayout({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>
}
