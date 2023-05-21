'use client'

import { useMetrics } from '@global/functions/useMetrics'

import Introduction from '@global/app/Introduction'
import MetricsDisplay from '@global/app/MetricsDisplay'
import React from 'react'

const Homepage: React.FC = (): JSX.Element => {
  const rdbMetrics = useMetrics()

  return (
    <>
      <div className='flex flex-col w-full h-full'>
        <Introduction />
        <div className='flex flex-col justify-end sm:mb-[5vw] mb-[6vw] h-full'>
          <div className='flex flex-col justify-around items-center'>
            <MetricsDisplay reviewCount={rdbMetrics.currentReviewCount} userCount={rdbMetrics.currentUsersCount} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Homepage
