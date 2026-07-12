import Link from 'next/link'
import React from 'react'

const Introduction: React.FC = (): JSX.Element => (
  <div className='flex flex-col gap-5 items-center text-center'>
    <h1 className='gg-bold text-4xl sm:text-5xl leading-tight tracking-tight text-white max-w-2xl'>
      Leave reviews on Discord profiles
    </h1>

    <p className='gg-normal text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed'>
      Anyone with a ReviewDB plugin on any Discord client mod will be able to see your review.
    </p>

    <div className='flex sm:flex-row flex-col w-full sm:w-auto justify-center gap-3 mt-1'>
      <Link className='button !px-6 !py-2.5' href='/download'>
        Download ReviewDB
      </Link>
      <Link className='button-secondary !px-6 !py-2.5' href='/dashboard'>
        Open Dashboard
      </Link>
    </div>

    <p className='text-sm text-slate-500 gg-normal'>
      Available for Vencord, Aliucord, BetterDiscord and more.
    </p>
  </div>
)

export default Introduction
