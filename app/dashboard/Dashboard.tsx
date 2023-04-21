"use client"

import { deleteReview, getReviews, reportReview, searchReviews } from '@global/functions/RDBAPI'
import { getLocalStorageItem } from '@global/functions/localStorage'
import { useAlert } from '@global/hooks/useAlert'

import ReviewCard from '@global/app/dashboard/ReviewCard'
import AlertPopup from '@global/components/AlertPopup'
import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const Dashboard: React.FC = (): JSX.Element => {
  const { showAlert, showAlertWithMessage, handleAlertClose, alertOptions } = useAlert()

  const [admin, setAdmin] = React.useState(false)
  React.useEffect(() => {
    setAdmin(JSON.parse(getLocalStorageItem({ key: 'rdbUserInfo', defaultValue: '{}' })).admin)
  }, [])

  // used for the search/userid input
  const [inputValue, setInputValue] = React.useState('')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value.trim())
  }

  // handles the report review button click
  const handleReportReviewClick = (reviewId: number) => {
    //event.preventDefault()
    reportReview({ reviewID: reviewId, token: getLocalStorageItem({ key: 'rdbToken', defaultValue: '' }) }).then((res) => {
      if (res.success) showAlertWithMessage({ message: res.message || 'Review reported successfully', type: 'success' })
    }).catch((err: Error) => {
      showAlertWithMessage({ message: err.message || 'An error occurred while reporting the review', type: 'error' })
      console.log(err)
    })
  }

  // handles the delete review button click
  const [reviews, setReviews] = React.useState<JSX.Element[]>([])
  const handleDeleteReviewClick = (reviewId: number, discordId: string) => {
    //event.preventDefault()
    deleteReview({ reviewID: reviewId, discordID: discordId, token: getLocalStorageItem({ key: 'rdbToken', defaultValue: '' }) }).then((res) => {
      if (res.success) {
        const indexToRemove = reviews.findIndex((element: any) => element.review.id === reviewId) as number
        if (indexToRemove !== -1) {
          reviews.splice(indexToRemove, 1)
          setReviews([...reviews])
        }
        showAlertWithMessage({ message: res.message || 'Review deleted successfully', type: 'success' })
      }
    }).catch((err: Error) => {
      showAlertWithMessage({ message: err.message || 'An error occurred while deleting the review', type: 'error' })
      console.log(err)
    })
  }

  // sets the go button to a loading state
  const [loading, setLoading] = React.useState(false)
  // handles the go button click
  const handleClick = async () => {
    if (inputValue.length === 0) {
      showAlertWithMessage({ message: 'Please enter a valid Discord ID or search query', type: 'error' })
      return
    }

    setLoading(true)

    const showAlert = (message: string) => showAlertWithMessage({ message, type: 'error' })

    // processes the reviews and sets the reviews state
    const processReviews = (reviews: any[], query?: string, callback?: () => void) => {
      if (!reviews || reviews.length === 0) {
        showAlert(query ? 'No reviews found for this query' : 'No reviews found for this Discord ID')
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

    // if the input is a discord id
    if (/[0-9]{16,19}/.test(inputValue)) {
      getReviews({ discordID: inputValue })
        .then((res) => {
          if (res.success === false) {
            showAlert(res.message)
          } else {
            res.reviews.shift()
            processReviews(res.reviews, '', () => setLoading(false))
          }
        })
        .catch((err: Error) => {
          console.log(err)
        })
    } else { // if the input is a search query
      searchReviews({ query: inputValue, token: getLocalStorageItem({ key: 'rdbToken', defaultValue: '' }) })
        .then((res) => {
          if (res.success === false) {
            showAlert(res.message)
          } else {
            processReviews(res.reviews, inputValue, () => setLoading(false))
          }
        })
        .catch((err: Error) => {
          console.log(err)
        })
    }
  }

  return (
    <div className='flex flex-col gap-4 h-screen'>
      {showAlert && (
        <AlertPopup
          message={alertOptions.message}
          type={alertOptions.type}
          timeout={alertOptions.timeout}
          onClose={handleAlertClose}
        />
      )}
      <div className='flex md:flex-row flex-col gap-4'>
        <input type='text' className='input md:w-[20em] w-full' onChange={handleChange} placeholder='Discord ID or search query' />
        <button className='flex button justify-center items-center' onClick={handleClick} disabled={loading}>
          {loading ? (
            <AiOutlineLoading3Quarters className='animate-spin' />
          ) : (
            'Go'
          )}
        </button>
      </div>
      <div>
        <div className='flex items-start gap-4 max-w-full overflow-auto overflow-x-hidden md:max-h-[63vh] max-h-[65vh] flex-wrap scrollbarStyle'>
          {reviews}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
