'use client'

import { useMetrics } from '@global/functions/useMetrics'

import Introduction from '@global/app/Introduction'
import MetricsDisplay from '@global/app/MetricsDisplay'
import React from 'react'

const Homepage: React.FC = (): JSX.Element => {
  const rdbMetrics = useMetrics()

  return (
    <div className='flex-1 flex flex-col items-center justify-center gap-10 sm:gap-14 py-8'>
      <Introduction />
      <MetricsDisplay reviewCount={rdbMetrics.currentReviewCount} userCount={rdbMetrics.currentUsersCount} />
    </div>
  )
}

export default Homepage
