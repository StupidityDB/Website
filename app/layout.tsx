import '@global/app/globals.css'
import Loading from '@global/app/loading'
import BottomBar from '@global/components/BottomBar'
import TopBar from '@global/components/TopBar'
import { Suspense } from 'react'

const metaText = {
  title: 'ReviewDB',
  description: 'Leave reviews on any Discord profile!',
  theme: '#0284c7',
  metaImage: '/meta.png',
  website: 'https://reviewdb.mantikafasi.dev/',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html className='bg-[#313338]' lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta content='IE=edge' httpEquiv='X-UA-Compatible' />
        <meta content='width=device-width, initial-scale=1' name='viewport' />
        <meta content={metaText.title} name='title' />
        <meta content={metaText.description} name='description' />
        <meta content={metaText.theme} name='theme-color' />
        <meta content={metaText.theme} name='msapplication-navbutton-color' />
        <meta content={metaText.theme} name='apple-mobile-web-app-status-bar-style' />

        <meta property='og:type' content='website' />
        <meta property='og:url' content={metaText.website} />
        <meta property='og:title' content={metaText.title} />
        <meta property='og:description' content={metaText.description} />
        <meta property='og:image' content={metaText.metaImage} />

        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content={metaText.website} />
        <meta property='twitter:title' content={metaText.title} />
        <meta property='twitter:description' content={metaText.description} />
        <meta property='twitter:image' content={metaText.metaImage} />

        <link rel='icon' href='/favicon.ico' />
      </head>
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
