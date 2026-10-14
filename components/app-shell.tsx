'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CalendarRange,
  Check,
  ChevronDown,
  HeartHandshake,
  Library,
  Menu,
  Printer,
  Settings,
  Sun,
  Users,
  Users2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { registerServiceWorker } from '@/lib/service-worker'
import { OfflineIndicator } from '@/components/offline-indicator'

export const NAV = [
  { href: '/', label: 'Today', Icon: Sun },
  { href: '/week', label: 'This Week', Icon: CalendarRange },
  { href: '/curriculum', label: 'Curriculum', Icon: BookOpen },
  { href: '/students', label: 'Students', Icon: Users },
  { href: '/print', label: 'Print Center', Icon: Printer },
  { href: '/progress', label: 'Progress', Icon: BarChart3 },
  { href: '/library', label: 'Library', Icon: Library },
  { href: '/settings', label: 'Settings', Icon: Settings },
]

const MOBILE = ['/', '/week', '/print', '/progress']

const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    registerServiceWorker()
  }, [])
  useEffect(() => setMoreOpen(false), [pathname])

  return (
    <div className="min-h-dvh bg-background">
      <OfflineIndicator />
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar px-3 py-5 lg:flex">
        <Brand />
        <nav aria-label="Main" className="mt-6 flex flex-col gap-1">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(pathname, href) ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                isActive(pathname, href) ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent',
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto px-3 text-xs text-muted-foreground">“Train up a child in the way he should go.” — Proverbs 22:6</p>
      </aside>

      <div className="lg:pl-60 print:pl-0">
        <header className="no-print sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-2.5 backdrop-blur sm:px-6">
          <div className="lg:hidden">
            <Brand compact />
          </div>
          <div className="hidden lg:block" />
          <HouseholdSwitcher />
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-4 sm:px-6 lg:pb-12 print:max-w-none print:p-0">{children}</main>
      </div>

      {/* Mobile bottom navigation: the four things used every day + More */}
      <nav aria-label="Quick" className="no-print fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {NAV.filter((n) => MOBILE.includes(n.href)).map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn('flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold', isActive(pathname, href) ? 'text-primary' : 'text-muted-foreground')}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          aria-expanded={moreOpen}
          className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold text-muted-foreground"
        >
          {moreOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          More
        </button>
      </nav>
      {moreOpen && (
        <div className="no-print fixed inset-x-0 bottom-[60px] z-30 mx-3 mb-2 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-3 shadow-lg lg:hidden">
          {NAV.filter((n) => !MOBILE.includes(n.href)).map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-muted">
              <Icon className="size-5 text-primary" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <span className={cn('flex items-center justify-center rounded-xl bg-primary text-primary-foreground', compact ? 'size-8' : 'size-9')}>
        <HeartHandshake className={compact ? 'size-4' : 'size-5'} />
      </span>
      <span className="font-serif text-base font-semibold leading-tight text-foreground sm:text-lg">
        Biblically <span className="text-primary">Schooled</span>
      </span>
    </Link>
  )
}

function HouseholdSwitcher() {
  const { households, currentView, setView } = useStore()
  const [open, setOpen] = useState(false)
  const label = currentView === 'shared' ? 'All children' : `${households.find((h) => h.id === currentView)?.momName ?? 'Our'}’s homeschool`
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold shadow-sm"
      >
        {currentView === 'shared' ? <Users2 className="size-4 text-primary" /> : <CalendarDays className="size-4 text-primary" />}
        <span className="max-w-[40vw] truncate">{label}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-border bg-card p-1 shadow-lg">
          {[{ id: 'shared', label: 'All children' }, ...households.map((h) => ({ id: h.id, label: `${h.momName}’s homeschool` }))].map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setView(o.id)
                setOpen(false)
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
            >
              {o.label}
              {currentView === o.id && <Check className="size-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
