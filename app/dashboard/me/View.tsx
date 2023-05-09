/*
  TODO:
    make this code more maintainable and move stuff to separate files
*/

import { deleteReview, getReviews, reportReview } from '@global/functions/RDBAPI'
import { getLocalStorageItem } from '@global/functions/localStorage'
import { notify } from '@global/functions/showToast'

import ReviewCard from '@global/app/dashboard/ReviewCard'
import { Review } from '@global/functions/interface'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Dashboard: React.FC = (): JSX.Element => {
  const [admin, setAdmin] = React.useState(0)
  const [reviews, setReviews] = React.useState<JSX.Element[]>([])

  React.useEffect(() => {
    setAdmin(JSON.parse(getLocalStorageItem({ key: 'rdbUserInfo', defaultValue: '{}' })).type) as unknown as number

    loadReviews()
  }, [])

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

  const loadReviews = async (): Promise<void> => {
    try {
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

      const res = await getReviews({ discordID: JSON.parse(getLocalStorageItem({ key: 'rdbUserInfo', defaultValue: '{}' })).discordID })
      res.reviews.shift()
      processReviews(res.reviews, '')
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
