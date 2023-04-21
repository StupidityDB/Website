import { MetricsDisplayProps } from '@global/functions/interface'
import { numberWithCommas } from '@global/functions/numberUtils'

import React from 'react'

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ reviewCount, userCount, requestsCount }): JSX.Element => {
  return (
    <div className="flex lg:flex-row flex-col items-center justify-evenly w-full">
      <div className="flex flex-col">
        <p className="headerText">Total Reviews</p>
        <p className="metricsText">{numberWithCommas({ x: reviewCount })}</p>
      </div>
      <div className="flex flex-col">
        <p className="headerText">Total Users</p>
        <p className="metricsText">{numberWithCommas({ x: userCount })}</p>
      </div>
      <div className="flex flex-col">
        <p className="headerText">Total Requests</p>
        <p className="metricsText">{numberWithCommas({ x: requestsCount })}</p>
      </div>
    </div>
  )
}

export default MetricsDisplay
