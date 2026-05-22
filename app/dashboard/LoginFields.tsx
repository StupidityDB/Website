'use client'

import React from 'react'
import { FaDiscord } from 'react-icons/fa'

const LoginFields: React.FC = (): JSX.Element => {
  return (
    <div className='flex flex-col justify-center items-center gap-6 h-[60vh]'>
      <h1 className='headerText !text-5xl font-extrabold tracking-wider text-sky-400 gg-semibold'>ReviewDB</h1>
      <p className='text-slate-300 text-center max-w-sm gg-normal text-md leading-relaxed'>
        Leave reviews on Discord profiles and let everyone see them! To manage reviews and start posting, log in with your Discord account.
      </p>
      <a
        href='https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2Fapi%2Freviewdb%2Fauthweb&response_type=code&scope=identify'
        className='flex justify-center items-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded-xl text-lg gg-bold shadow-lg transition duration-200 ease-in-out transform hover:scale-[1.02]'
      >
        <FaDiscord className='text-2xl' />
        Login with Discord
      </a>
    </div>
  )
}

export default LoginFields
