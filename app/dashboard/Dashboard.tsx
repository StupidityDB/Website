import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
    <div className='flex flex-col gap-4 h-screen'>
      <div className='flex md:flex-row flex-col gap-4'>
        <input type='text' className='input md:w-[20em] w-full' onChange={handleChange} onKeyDown={handleKeyDown} placeholder={admin == 1 ? 'Discord ID or search query' : 'Discord ID'} />
        <button className='flex button justify-center items-center' onClick={handleClickWrapper} disabled={loading}>
          {loading ? (
            <AiOutlineLoading3Quarters className='animate-spin' />
          ) : (
            'Search'
          )}
        </button>
      </div>
      <div>
        <div className='flex items-start gap-4 max-w-full overflow-auto overflow-x-hidden md:max-h-[63vh] max-h-[65vh] flex-wrap scrollbarStyle'>
          {reviews}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Dashboard
