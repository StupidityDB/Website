import Link from 'next/link'
import React from 'react'
import { FaDownload, FaArrowRight } from 'react-icons/fa'

const Introduction: React.FC = (): JSX.Element => (
  <div className='flex flex-col gap-6 items-center text-center'>
    <span className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blurple/30 bg-blurple/10 text-xs sm:text-sm text-slate-200 gg-medium select-none'>
      <span className='w-1.5 h-1.5 rounded-full bg-blurple' />
      Works with Vencord, Aliucord, BetterDiscord &amp; more
    </span>

    <h1 className='gg-bold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight text-white max-w-3xl'>
      Leave reviews on any{' '}
      <span className='text-transparent bg-clip-text bg-gradient-to-r from-blurple via-sky-400 to-blurple'>
        Discord profile
      </span>
    </h1>

    <p className='gg-normal text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed'>
      Anyone with a ReviewDB plugin on any Discord client mod will be able to see your review — right on the profile.
    </p>

    <div className='flex sm:flex-row flex-col w-full sm:w-auto justify-center gap-3 mt-2'>
      <Link className='button !px-7 !py-3 text-base' href='/download'>
        <FaDownload size={14} />
        Download ReviewDB
      </Link>
      <Link className='button-secondary !px-7 !py-3 text-base' href='/dashboard'>
        Open Dashboard
        <FaArrowRight size={13} />
      </Link>
    </div>
  </div>
)

export default Introduction
