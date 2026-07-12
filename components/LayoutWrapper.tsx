'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import TopBar from '@global/components/TopBar'
import BottomBar from '@global/components/BottomBar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  const pathname = usePathname()
  const isWidget = pathname.startsWith('/widget')

  if (isWidget) {
    return (
      <div className='fixed inset-0 bg-[#313338] text-slate-100 overflow-hidden w-full h-full flex flex-col p-0 m-0 select-none'>
        {children}
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Subtle brand glow behind the whole app */}
      <div aria-hidden className='pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_-10%,rgba(88,101,242,0.16),transparent_70%)]' />

      <TopBar />

      <main id='root' className='flex-1 min-h-0 overflow-y-auto scrollbarStyle'>
        <div className='flex flex-col min-h-full w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6'>
          {children}
        </div>
      </main>

      <BottomBar />
    </div>
  )
}
