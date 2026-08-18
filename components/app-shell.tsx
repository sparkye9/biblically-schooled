'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Home,
  CalendarDays,
  CalendarRange,
  Users,
  Printer,
  FolderOpen,
  TrendingUp,
  LayoutGrid,
  Library,
  Package,
  Settings,
  BookOpen,
  Users2,
  ChevronDown,
  Check,
  MoreHorizontal,
  HeartHandshake,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CoverageBanner } from '@/components/coverage-banner'

const nav = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/today', label: 'Today', Icon: CalendarDays },
  { href: '/bible', label: 'Bible & Theme', Icon: BookOpen },
  { href: '/children', label: 'Children', Icon: Users },
  { href: '/progress', label: 'Progress', Icon: TrendingUp },
  { href: '/planner', label: 'Weekly Planner', Icon: LayoutGrid },
  { href: '/shared', label: 'Shared Planning', Icon: Users2 },
  { href: '/printables', label: 'Printables', Icon: FolderOpen },
  { href: '/print-center', label: 'Print Center', Icon: Printer },
  { href: '/library', label: 'Read-Aloud Library', Icon: Library },
  { href: '/supplies', label: 'Supplies', Icon: Package },
  { href: '/sunday-prep', label: 'Sunday Prep', Icon: CalendarRange },
  { href: '/settings', label: 'Settings', Icon: Settings },
]

const mobileNav = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/today', label: 'Today', Icon: CalendarDays },
  { href: '/children', label: 'Children', Icon: Users },
  { href: '/library', label: 'Library', Icon: Library },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Brand />
        <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto">
          {nav.map(({ href, label, Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent',
                )}
              >
                <Icon className="size-[18px] shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <TopBar />
        <CoverageBanner />
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 sm:px-6 lg:pb-12 lg:pt-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border bg-card/95 backdrop-blur lg:hidden">
        {mobileNav.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          )
        })}
        <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
          <DropdownMenuTrigger asChild>
            <button className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-muted-foreground">
              <MoreHorizontal className="size-5" />
              More
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="mb-2 w-52">
            {nav
              .filter((n) => !mobileNav.some((m) => m.href === n.href))
              .map(({ href, label, Icon }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href} className="flex items-center gap-2">
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  )
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <HeartHandshake className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-lg font-semibold text-foreground">
          Biblically
        </span>
        <span className="font-serif text-lg font-semibold text-primary">
          Schooled
        </span>
      </span>
    </Link>
  )
}

function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <HeartHandshake className="size-4" />
        </span>
        <span className="font-serif text-base font-semibold">
          Biblically Schooled
        </span>
      </div>
      <div className="hidden lg:block" />
      <HouseholdSwitcher />
    </header>
  )
}

export function HouseholdSwitcher() {
  const { households, currentView, setView } = useStore()
  const current =
    currentView === 'shared'
      ? { label: 'Shared Planning', sub: 'All families' }
      : (() => {
          const h = households.find((x) => x.id === currentView)
          return { label: h ? `${h.momName}\u2019s Homeschool` : 'Homeschool', sub: 'Household' }
        })()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-left shadow-sm transition-colors hover:bg-accent">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">
            {currentView === 'shared' ? (
              <Users2 className="size-4" />
            ) : (
              <span className="text-xs font-bold">
                {households.find((h) => h.id === currentView)?.momInitial ?? '?'}
              </span>
            )}
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Viewing
            </span>
            <span className="text-sm font-bold">{current.label}</span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Switch view</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {households.map((h) => (
          <DropdownMenuItem
            key={h.id}
            onClick={() => setView(h.id)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                {h.momInitial}
              </span>
              {h.momName}
              {h.away && (
                <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                  Away
                </span>
              )}
            </span>
            {currentView === h.id && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setView('shared')}
          className="flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Users2 className="size-3.5" />
            </span>
            Shared Planning
          </span>
          {currentView === 'shared' && <Check className="size-4 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
