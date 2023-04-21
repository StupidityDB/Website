import '@global/app/globals.css'
import Loading from '@global/app/loading'
import BottomBar from '@global/components/BottomBar'
import TopBar from '@global/components/TopBar'
import { Suspense } from 'react'

export const metadata = {
  title: 'ReviewDB',
  description: 'Leave reviews on other users\' Discord profiles!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className='bg-[#313338]' lang='en'>
      <body className='flex flex-col p-4 cursor-default gap-6 antialiased'>
        <TopBar />
        <div className='flex justify-center md:h-[75vh] h-[85vh]' id='root'>
          <div className='flex flex-col sectionBackground py-6 px-8 rounded-xl text-slate-100 w-full'>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </div>
        <BottomBar />
      </body>
    </html>
  )
}
