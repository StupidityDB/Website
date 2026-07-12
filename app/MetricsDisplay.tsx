import { MetricsDisplayProps } from '@global/functions/interface'
import { numberWithCommas } from '@global/functions/numberUtils'

import React from 'react'

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ reviewCount, userCount }): JSX.Element => {
  const stats = [
    { label: 'Total Reviews', value: reviewCount },
    { label: 'Total Users', value: userCount },
  ]

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl'>
      {stats.map(({ label, value }) => (
        <div key={label} className='card flex flex-col items-center gap-1 px-8 py-5'>
          <span className='text-xs uppercase tracking-widest text-slate-400 gg-semibold'>{label}</span>
          <span className='text-3xl sm:text-4xl text-white gg-bold tabular-nums'>{numberWithCommas({ x: value })}</span>
        </div>
      ))}
    </div>
  )
}

export default MetricsDisplay
