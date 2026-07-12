import { MetricsDisplayProps } from '@global/functions/interface'
import { numberWithCommas } from '@global/functions/numberUtils'

import React from 'react'

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ reviewCount, userCount }): JSX.Element => {
  const stats = [
    { label: 'reviews', value: reviewCount },
    { label: 'users', value: userCount },
  ]

  return (
    <div className='flex items-center justify-center gap-10 sm:gap-16'>
      {stats.map(({ label, value }) => (
        <div key={label} className='flex flex-col items-center gap-0.5'>
          <span className='text-3xl sm:text-4xl text-white gg-bold tabular-nums'>{numberWithCommas({ x: value })}</span>
          <span className='text-sm text-slate-500 gg-normal'>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default MetricsDisplay
