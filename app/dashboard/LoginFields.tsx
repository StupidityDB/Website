'use client'

import React from 'react'
import { FaDiscord } from 'react-icons/fa'

const LoginFields: React.FC = (): JSX.Element => {
  return (
    <div className='flex-1 flex flex-col justify-center items-center gap-6 py-12 text-center'>
      <h1 className='text-4xl sm:text-5xl gg-bold text-white'>ReviewDB</h1>
      <p className='text-slate-400 text-center max-w-sm gg-normal text-base leading-relaxed'>
        Leave reviews on Discord profiles and let everyone see them! To manage reviews and start posting, log in with your Discord account.
      </p>
      <a
        href='https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2Fapi%2Freviewdb%2Fauthweb&response_type=code&scope=identify'
        className='button !px-7 !py-3 text-base'
      >
        <FaDiscord className='text-2xl' />
        Login with Discord
      </a>
    </div>
  )
}

export default LoginFields
