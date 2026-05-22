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
    <>
      <TopBar />
      <div className='flex justify-center md:h-[75vh] h-[85vh]' id='root'>
        <div className='flex flex-col sectionBackground py-6 px-8 rounded-xl text-slate-100 w-full overflow-hidden'>
          {children}
        </div>
      </div>
      <BottomBar />
    </>
  )
}
