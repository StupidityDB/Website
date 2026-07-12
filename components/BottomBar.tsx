import React from 'react'

const BottomBar: React.FC = (): JSX.Element => {
  return (
    <footer className='flex-shrink-0 border-t border-white/5 bg-surface-1/85 backdrop-blur-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center'>
        <p className='text-xs sm:text-sm text-slate-400 gg-normal text-center'>
          Made possible by <a href='https://github.com/StupidityDB/' className='link' target='_blank'>StupidityDB</a> ♡ Website by <a href='https://out.spin.rip/home' target='_blank' className='link'>spin</a>
        </p>
      </div>
    </footer>
  )
}

export default BottomBar
