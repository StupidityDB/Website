import Link from 'next/link'
import React from 'react'

const Introduction: React.FC = (): JSX.Element => (
  <div className='flex flex-col gap-3 items-center justify-between mt-16'>
    <h2 className='gg-semibold text-4xl'>ReviewDB</h2>
    <p className='gg-normal text-xl text-center'>Leave reviews on other users&apos; Discord profiles!<br />Anyone with a ReviewDB plugin on any Discord client mod will be able to see your review.</p>
    <div className='w-full flex items-center justify-center' >
      <a className='button mt-2 lg:mt-4 lg:w-1/5 text-center' href='/dashboard'>Dashboard</a>
      <a className='button mt-2 lg:mt-4 lg:w-1/5 ml-4 text-center' href='/download'>Download ReviewDB</a>
    </div>
  </div>
)

export default Introduction
