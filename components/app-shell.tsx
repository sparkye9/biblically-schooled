'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  CalendarDays,
  Users,
  Users2,
  Printer,
  FolderOpen,
  TrendingUp,
  LayoutGrid,
  Library,
  Package,
  Settings,
  MoreHorizontal,
  HeartHandshake,
  ChevronDown,
  Check,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

type NavLink = { type: 'link'; href: string; label: string; Icon: LucideIcon }
type NavGroup = { type: 'group'; label: string; Icon: LucideIcon; items: NavLink[] }
type NavItem = NavLink | NavGroup

const nav: NavItem[] = [
  {
    type: 'group',
    label: 'Today',
    Icon: CalendarDays,
    items: [
      { type: 'link', href: '/today', label: 'Schedule', Icon: CalendarDays },
      { type: 'link', href: '/teaching-guide', label: 'Teaching Guide', Icon: CalendarDays },
      { type: 'link', href: '/bible', label: 'Bible & Memory Verse', Icon: CalendarDays },
    ],
  },
  {
    type: 'group',
    label: 'Plan',
    Icon: LayoutGrid,
    items: [
      { type: 'link', href: '/planner', label: 'Weekly Planner', Icon: LayoutGrid },
      { type: 'link', href: '/sunday-prep', label: 'Sunday Prep', Icon: LayoutGrid },
      { type: 'link', href: '/week', label: 'Week Overview', Icon: LayoutGrid },
      { type: 'link', href: '/shared', label: 'Shared Planning', Icon: LayoutGrid },
    ],
  },
  { type: 'link', href: '/children', label: 'Children', Icon: Users },
  {
    type: 'group',
    label: 'Resources',
    Icon: FolderOpen,
    items: [
      { type: 'link', href: '/library', label: 'Read-Aloud Library', Icon: Library },
      { type: 'link', href: '/printables', label: 'Printables', Icon: FolderOpen },
      { type: 'link', href: '/print-center', label: 'Print Center', Icon: Printer },
      { type: 'link', href: '/supplies', label: 'Supplies', Icon: Package },
    ],
  },
  {
    type: 'group',
    label: 'Progress',
    Icon: TrendingUp,
    items: [
      { type: 'link', href: '/progress', label: 'Skill Progress', Icon: TrendingUp },
      { type: 'link', href: '/portfolio', label: 'Portfolios', Icon: TrendingUp },
    ],
  },
  { type: 'link', href: '/settings', label: 'Settings', Icon: Settings },
]

const mobileNav: NavLink[] = [
  { type: 'link', href: '/today', label: 'Today', Icon: CalendarDays },
  { type: 'link', href: '/children', label: 'Children', Icon: Users },
  { type: 'link', href: '/progress', label: 'Progress', Icon: TrendingUp },
  { type: 'link', href: '/settings', label: 'Settings', Icon: Settings },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 print:hidden lg:flex">
        <Brand />
        <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto">
          {nav.map((item) => {
            if (item.type === 'link') {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent',
                  )}
                >
                  <item.Icon className="size-[18px] shrink-0" />
                  {item.label}
                </Link>
              )
            } else {
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                    <item.Icon className="size-[18px] shrink-0" />
                    {item.label}
                  </div>
                  <div className="space-y-1 pl-2">
                    {item.items.map((subitem) => {
                      const active = subitem.href === '/' ? pathname === '/' : pathname.startsWith(subitem.href)
                      return (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                            active
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent',
                          )}
                        >
                          <subitem.Icon className="size-[16px] shrink-0" />
                          {subitem.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            }
          })}
        </nav>
      </aside>

      {/* Main column */}
      <div className="print:pl-0 lg:pl-64">
        <TopBar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 print:pb-0 print:pt-0 sm:px-6 lg:pb-12 lg:pt-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border bg-card/95 backdrop-blur print:hidden lg:hidden">
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
          <DropdownMenuTrigger className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-muted-foreground">
            <MoreHorizontal className="size-5" />
            More
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="mb-2 w-52">
            {nav.map((item) => {
              if (item.type === 'link') {
                const isInMobileNav = mobileNav.some((m) => m.href === item.href)
                if (isInMobileNav) return null
                return (
                  <DropdownMenuItem key={item.href}>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.Icon className="size-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )
              } else {
                return (
                  <div key={item.label}>
                    {item.items.map((subitem) => (
                      <DropdownMenuItem key={subitem.href}>
                        <Link href={subitem.href} className="flex items-center gap-2">
                          <subitem.Icon className="size-4" />
                          {subitem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )
              }
            })}
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
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur print:hidden sm:px-6">
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
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-left shadow-sm transition-colors hover:bg-accent">
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch view</DropdownMenuLabel>
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
              </span>
              {currentView === h.id && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
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
