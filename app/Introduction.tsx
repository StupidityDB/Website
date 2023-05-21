import Link from 'next/link'
import React from 'react'

const Introduction: React.FC = (): JSX.Element => (
  <div className='flex flex-col gap-3 items-center justify-between mt-16'>
    <h2 className='gg-semibold text-4xl'>ReviewDB</h2>
    <p className='gg-normal text-xl text-center'>Leave reviews on other users&apos; Discord profiles!<br />Anyone with a ReviewDB plugin on any Discord client mod will be able to see your review.</p>
    <div className='flex md:flex-row flex-col w-full justify-center md:gap-5 gap-3' >
      <Link className='button mt-2 lg:mt-4 md:w-1/5 text-center flex-1 md:flex-none items-center flex justify-center' href='/dashboard'>Dashboard </Link>
      <Link className='button mt-2 lg:mt-4 md:w-1/5 text-center flex-1 md:flex-none items-center flex justify-center' href='/download'>Download ReviewDB</Link>
    </div>
  </div>
)

export default Introduction
