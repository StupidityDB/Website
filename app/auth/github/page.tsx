'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { getCookieItem } from '@global/functions/cookieUtils'
import { oauthGithub } from '@global/functions/RDBAPI'
import NoSSR from '@global/components/NoSSR'

function GithubAuth(): JSX.Element{
  const token = getCookieItem({ key: 'rdbToken', defaultValue: null }) as string | null
  const [state, setState] = React.useState('Linking...')

  const searchParams = useSearchParams()

  const code = searchParams.get('code') || ''
  console.log(token,code)
  if (!token || !code) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <> {
          (token) ? 'Code not found' : 'You must to be logged in to link your GitHub account'
        } </>
      </div>
    )
  }


  oauthGithub({ token: token, code: code }).then((res) => {
    if (res.status === 200) {
      setState('Linked successfully, redirecting...')

      setTimeout(() => {
        window.location.href = '/dashboard/settings'
      }, 1000)
    } else {
      setState('Error linking GitHub account')
      setTimeout(() => {
        window.location.href = '/dashboard/'
      })
    }
  })

  return (
    <div className='flex justify-center items-center h-screen'>
      <> {state} </>
    </div>
  )
}

// gosh I hate you nextjs why's disabling ssr so hard
// theres probably better way to do this without CSR but this is probably fine for now
const StaticGithubAuth = (): JSX.Element => (
  <NoSSR>
    <GithubAuth />
  </NoSSR>
)

export default StaticGithubAuth
