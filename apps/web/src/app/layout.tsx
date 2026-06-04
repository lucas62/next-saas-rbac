import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'

import { Providers } from './porviders'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'RBAC - Next Saas Boilerplate',
  description: 'Next.js + Prisma + Fastify',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn('font-sans', inter.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
