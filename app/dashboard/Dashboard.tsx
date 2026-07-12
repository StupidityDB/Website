import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaSearch, FaDatabase, FaListUl } from 'react-icons/fa'

import { handleClick } from '@global/app/dashboard/dashboardUtils/handleClick'
import useAdminState from '@global/app/dashboard/dashboardUtils/useAdminState'
import useInputValueState from '@global/app/dashboard/dashboardUtils/useInputValueState'
import { getQueryParameterValue } from '@global/functions/paramUtils'

const Dashboard: React.FC = (): JSX.Element => {
  const admin = useAdminState()
  const [isMounted, setIsMounted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [reviews, setReviews] = React.useState<JSX.Element[]>([])
  const { inputValue, handleChange } = useInputValueState(isMounted)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    if (!isMounted) return

    const query = getQueryParameterValue({ param: 'query' })
    if (query) {
      handleClick({
        admin,
        inputValue: query,
        setReviews,
        setLoading
      })
    }
  }, [isMounted])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      handleClick({
        admin,
        setReviews,
        setLoading,
        inputValue,
      })
    }
  }

  const handleClickWrapper = (): void => {
    handleClick({
      admin,
      inputValue,
      setReviews,
      setLoading,
    })
  }

  return (
    <div className='flex flex-col flex-1 min-h-0 w-full select-none'>
      
      {/* Discord-style Dashboard Header */}
      <div className='flex items-center justify-between border-b border-[#3f4147]/40 pb-4 mb-5 select-none flex-shrink-0'>
        <div className='flex items-center gap-2.5'>
          <span className='text-slate-400 text-2xl font-light'>#</span>
          <h1 className='text-white text-lg font-bold tracking-wide gg-bold flex items-center gap-2'>
            review-directory
          </h1>
          <div className='hidden sm:block w-[1px] h-4 bg-slate-700/50 mx-2' />
          <p className='hidden sm:block text-xs text-slate-400 gg-normal'>
            Search and inspect user profiles or review content database-wide.
          </p>
        </div>
      </div>

      {/* Modern Search Controls */}
      <div className='flex flex-col sm:flex-row gap-3.5 mb-5 w-full items-stretch sm:items-center flex-shrink-0'>
        <div className='relative flex-1 max-w-full sm:max-w-md'>
          <span className='absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#80848e] pointer-events-none'>
            <FaSearch size={14} />
          </span>
          <input 
            type='text' 
            className='w-full pl-10 pr-4 py-2.5 bg-[#1e1f22] text-[#dbdee1] placeholder-[#80848e] rounded-lg border border-slate-800/60 focus:border-[#5865F2] outline-none focus:ring-2 focus:ring-[#5865F2]/45 transition-all gg-normal text-sm' 
            onChange={handleChange} 
            onKeyDown={handleKeyDown} 
            placeholder={admin == 1 ? 'Enter Discord ID or review comment query...' : 'Enter Discord ID...'} 
          />
        </div>
        <button 
          className='flex justify-center items-center gap-2 px-6 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] active:bg-[#3c45a5] disabled:bg-slate-700 text-white text-sm font-semibold rounded-lg shadow transition-colors cursor-pointer gg-semibold flex-shrink-0 min-h-[42px]' 
          onClick={handleClickWrapper} 
          disabled={loading}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className='animate-spin' />
          ) : (
            <>
              <FaSearch size={13} />
              <span>Search</span>
            </>
          )}
        </button>
      </div>

      {/* Search Results / Directory Feed */}
      <div className='flex-1 min-h-0 flex flex-col'>
        {reviews.length === 0 && !loading ? (
          /* Empty / Initial State */
          <div className='flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800/40 rounded-2xl bg-[#1e1f22]/15 max-w-xl mx-auto my-auto min-h-[260px] select-none'>
            <div className='bg-[#2b2d31] p-5 rounded-full text-[#5865F2] mb-5 text-4xl shadow-inner border border-slate-800/30'>
              <FaDatabase />
            </div>
            <h3 className='text-white text-lg font-bold mb-2 gg-bold'>Search the ReviewDB Directory</h3>
            <p className='text-slate-400 text-xs gg-normal leading-relaxed mb-4 max-w-md'>
              Lookup any Discord user by their ID to inspect their badge profile and reviews history, or search matching reviews.
            </p>
            <div className='flex flex-wrap justify-center gap-2 text-[11px] text-slate-500 font-mono'>
              <span className='bg-[#1e1f22] px-2.5 py-1.5 rounded border border-slate-800/50'>ID lookup: 915703782174752809</span>
              {admin === 1 && (
                <span className='bg-[#1e1f22] px-2.5 py-1.5 rounded border border-slate-800/50'>Query: &quot;cool plugin&quot;</span>
              )}
            </div>
          </div>
        ) : (
          /* Result Grid Grid */
          <div className='flex-grow min-h-0 flex flex-col gap-3'>
            <div className='flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1 select-none flex-shrink-0'>
              <FaListUl size={12} className='text-slate-500' />
              <span>Search Results</span>
              <span className='bg-[#1e1f22]/80 border border-slate-800/40 text-[#dbdee1] px-2 py-0.5 rounded-full text-[10px]'>{reviews.length} items</span>
            </div>
            <div className='flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-1 scrollbarStyle pb-4'>
              {reviews}
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  )
}

export default Dashboard
