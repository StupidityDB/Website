import Link from 'next/link'
import React from 'react'

const Introduction: React.FC = (): JSX.Element => (
  <div className='flex flex-col gap-3'>
    <h2 className='gg-semibold text-4xl'>ReviewDB</h2>
    <p className='gg-normal text-xl'>Leave reviews on other users&apos; Discord profiles!<br />Anyone with a ReviewDB plugin on any Discord client mod will be able to see your review.</p>
    <div>
      <Link href='/dashboard'><button className='button mt-2 lg:mt-4 lg:w-1/4'>Dashboard</button></Link>
    </div>
  </div>
)

export default Introduction
