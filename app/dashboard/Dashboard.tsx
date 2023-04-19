"use client"

import { getReviews, searchReviews, addReview, deleteReview, reportReview } from '@global/functions/RDBAPI'
import { getLocalStorageItem } from '@global/functions/localStorage'
import { useAlert } from '@global/hooks/useAlert'

import React from 'react'
import ReviewCard from '@global/app/dashboard/ReviewCard'
import AlertPopup from '@global/components/AlertPopup'

const Dashboard: React.FC = (): JSX.Element => {
  const { showAlert, showAlertWithMessage, handleAlertClose, alertOptions } = useAlert()

  const [admin, setAdmin] = React.useState(false)
  React.useEffect(() => {
    setAdmin(JSON.parse(getLocalStorageItem({ key: 'rdbUserInfo', defaultValue: '{}' })).admin)
  }, [])

  const [inputValue, setInputValue] = React.useState('')
  const handleChange = (event: any) => {
    setInputValue(event.target.value.trim())
  }

  const handleReportReviewClick = (reviewId: number) => {
    //event.preventDefault()
    reportReview({ reviewID: reviewId, token: getLocalStorageItem({ key: 'rdbToken', defaultValue: '' }) }).then((res) => {
      if (res.success) showAlertWithMessage({ message: res.message || 'Review reported successfully', type: 'success', timeout: 3000 })
    }).catch((err: any) => {
      showAlertWithMessage({ message: err.message || 'An error occurred while reporting the review', type: 'error', timeout: 3000 })
      console.log(err)
    })
  }

  const [reviews, setReviews] = React.useState<JSX.Element[]>([])
  const handleDeleteReviewClick = (reviewId: number, discordId: string) => {
    //event.preventDefault();
    deleteReview({ reviewID: reviewId, discordID: discordId, token: getLocalStorageItem({ key: 'rdbToken', defaultValue: '' }) }).then((res) => {
      if (res.success) {
        const indexToRemove = reviews.findIndex((element: any) => element.review.id === reviewId)
        if (indexToRemove !== -1) {
          reviews.splice(indexToRemove, 1)
          setReviews([...reviews])
        }
        showAlertWithMessage({ message: res.message || 'Review deleted successfully', type: 'success', timeout: 3000 })
      }
    }).catch((err: any) => {
      showAlertWithMessage({ message: err.message || 'An error occurred while deleting the review', type: 'error', timeout: 3000 })
      console.log(err);
    });
  };

  const handleClick = async () => {
    if (/[0-9]{16,19}/.test(inputValue)) {
      getReviews({ discordID: inputValue })
        .then((res) => {
          if (res.success === false) {
            return showAlertWithMessage({ message: res.message, type: 'error', timeout: 3000 })
          } else if (!res.reviews || res.reviews.length === 0) {
            return showAlertWithMessage({ message: 'No reviews found for this Discord ID', type: 'error', timeout: 3000 })
          }

          res.reviews.shift()
          const reviews: JSX.Element[] = []
          res.reviews.forEach((review) => {
            reviews.push(
              <ReviewCard
                key={review.id}
                review={review}
                handleReportReviewClick={handleReportReviewClick}
                handleDeleteReviewClick={handleDeleteReviewClick}
                isAdmin={admin}
              />
            )
          })
          setReviews(reviews)
          alert(JSON.stringify(reviews))
        })
        .catch((err: any) => {
          console.log(err)
        })
    } else if (inputValue.length > 0) {
      searchReviews({ query: inputValue, token: getLocalStorageItem({ key: 'rdbToken', defaultValue: '' }) }).then((res) => {
        if (res.success === false) {
          return showAlertWithMessage({ message: res.message, type: 'error', timeout: 3000 })
        } else if (!res.reviews || res.reviews.length === 0) {
          return showAlertWithMessage({ message: 'No reviews found for this query', type: 'error', timeout: 3000 })
        }

        const reviews: JSX.Element[] = []
        res.reviews.forEach((review) => {
          reviews.push(
            <ReviewCard
              key={review.id}
              review={{
                ...review,
                query: inputValue
              }}
              handleReportReviewClick={handleReportReviewClick}
              handleDeleteReviewClick={handleDeleteReviewClick}
              isAdmin={admin}
            />
          )
        })
        setReviews(reviews)
      }).catch((err: any) => {
        console.log(err)
      })
    } else {
      showAlertWithMessage({ message: 'Please enter a valid Discord ID or search query', type: 'error', timeout: 3000 })
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
        <button className='button' onClick={handleClick}>Go</button>
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
