"use client"

import { useMetrics } from '@global/functions/useMetrics'

import React from 'react'
import MetricsDisplay from '@global/app/MetricsDisplay'
import Introduction from '@global/app/Introduction'

const Homepage: React.FC = (): JSX.Element => {
  const rdbMetrics = useMetrics();

  return (
    <>
      <div className="flex flex-col md:w-2/3 w-full h-full">
        <Introduction />
        <div className="flex flex-col justify-end sm:mb-[10vw] mb-[12vw] h-full">
          <div className="flex flex-col justify-around items-center">
            <MetricsDisplay reviewCount={rdbMetrics.currentReviewCount} userCount={rdbMetrics.currentUsersCount} requestsCount={rdbMetrics.currentRequestsCount} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepage
