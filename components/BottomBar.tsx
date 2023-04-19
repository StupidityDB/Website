import React from 'react'

const BottomBar: React.FC = (): JSX.Element => {
  return (
    <div className='flex sectionBackground px-4 py-2 rounded-xl'>
      <div className='flex items-center justify-center w-full'>
        <p className='mr-2 md:text-lg text-md text-slate-100/75 font-semibold'>Made possible by <a href='https://github.com/StupidityDB/' className='link' target='_blank'>StupidityDB</a> ♡ Website by <a href='https://out.spin.rip/home' target='_blank' className='link'>spin</a></p>
      </div>
    </div>
  )
}

export default BottomBar
