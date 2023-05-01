/*
  TODO:
    make this code more maintainable and move stuff to separate files
    convert try-catch back to .then().catch()
*/

import { deleteReview, getReviews, reportReview, searchReviews } from '@global/functions/RDBAPI'
import { getLocalStorageItem } from '@global/functions/localStorage'
import { notify } from '@global/functions/showToast'

import ReviewCard from '@global/app/dashboard/ReviewCard'
import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Review } from '@global/functions/interface'

const Dashboard: React.FC = (): JSX.Element => {
  const [admin, setAdmin] = React.useState(0)
  const [isMounted, setIsMounted] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [reviews, setReviews] = React.useState<JSX.Element[]>([])

  React.useEffect(() => {
    setAdmin(JSON.parse(getLocalStorageItem({ key: 'rdbUserInfo', defaultValue: '{}' })).type) as unknown as number
    setIsMounted(true)
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value.trim())
  }

  const getQueryParameterValue = (): string => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('query') || ''
  }

  // initialize the input value based on the URL query parameter
  React.useEffect(() => {
    if (!isMounted) return

    const query = getQueryParameterValue()
    if (query) {
      setInputValue(query)
      handleClick(query)
    }
  }, [isMounted])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      handleClick()
    }
  }

  const handleReportReviewClick = async (reviewId: number): Promise<void> => {
    try {
      const res = await reportReview({ reviewID: reviewId, token: getLocalStorageItem({ key: 'rdbToken', defaultValue: '' }) })
      if (res.success) notify({ message: res.message || 'Review reported successfully', type: 'success' })
    } catch (err: unknown) {
      if (err instanceof Error) {
        notify({ message: err.message || 'An unknown error has occurred', type: 'error' })
        console.log(err)
      } else {
        console.error('Unexpected error:', err)
      }
    }
  }

  const handleDeleteReviewClick = async (reviewId: number, discordId: string): Promise<void> => {
    try {
      const res = await deleteReview({ reviewID: reviewId, discordID: discordId, token: getLocalStorageItem({ key: 'rdbToken', defaultValue: '' }) })
      if (res.success) {
        notify({ message: res.message || 'Review deleted successfully', type: 'success' })
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        notify({ message: err.message || 'An unknown error has occurred', type: 'error' })
        console.log(err)
      } else {
        console.error('Unexpected error:', err)
      }
    }
  }

  const handleClick = async (eventOrQuery?: React.MouseEvent | string): Promise<void> => {
    const value = typeof eventOrQuery === 'string' ? eventOrQuery : inputValue

    if (value.length === 0) {
      notify({ message: 'Please enter a valid Discord ID or search query', type: 'error' })
      return
    }

    setLoading(true)

    const url = new URL(window.location.href)
    url.searchParams.set('query', value)
    window.history.pushState({}, '', url.toString())

    const processReviews = (reviews: Review[], query?: string, callback?: () => void): void => {
      if (!reviews || reviews.length === 0) {
        notify({ message: `No reviews found for this ${query ? 'query' : 'user'}`, type: 'error' })
        if (callback) callback()
        return
      }

      setReviews(
        reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={{ ...review, query }}
            handleReportReviewClick={handleReportReviewClick}
            handleDeleteReviewClick={handleDeleteReviewClick}
            isAdmin={admin}
          />
        ))
      )

      if (callback) callback()
    }

    try {
      if (/[0-9]{16,19}/.test(value)) {
        const res = await getReviews({ discordID: value })
        if (res.success === false) {
          notify({ message: res.message || 'An unknown error has occurred', type: 'error' })
        } else {
          res.reviews.shift()
          processReviews(res.reviews, '', () => setLoading(false))
        }
      } else {
        const res = await searchReviews({ query: value, token: getLocalStorageItem({ key: 'rdbToken', defaultValue: '' }) })
        if (res.success === false) {
          notify({ message: res.message || 'An unknown error has occurred', type: 'error' })
        } else {
          processReviews(res.reviews, value, () => setLoading(false))
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        notify({ message: err.message || 'An unknown error has occurred', type: 'error' })
        console.log(err)
      } else {
        console.error('Unexpected error:', err)
      }
    }
  }

  return (
    <div className='flex flex-col gap-4 h-screen'>
      <div className='flex md:flex-row flex-col gap-4'>
        <input type='text' className='input md:w-[20em] w-full' onChange={handleChange} onKeyDown={handleKeyDown} placeholder='Discord ID or search query' />
        <button className='flex button justify-center items-center' onClick={handleClick} disabled={loading}>
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
