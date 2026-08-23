import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito, Fraunces } from 'next/font/google'
import { StoreProvider } from '@/lib/store'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Biblically Schooled',
  description:
    'A calm homeschool command center for faith-centered families — plan, teach, and track multiple children across households.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f4ede0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${fraunces.variable} bg-background`}>
      <body className="font-sans antialiased">
        <StoreProvider>{children}</StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
