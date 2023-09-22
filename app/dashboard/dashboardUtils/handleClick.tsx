import ReviewCard from '@global/app/dashboard/ReviewCard'
import { handleDeleteReviewClick, handleReportReviewClick } from '@global/app/dashboard/dashboardUtils/reviewHandler'
import { getReviews, searchReviews } from '@global/functions/RDBAPI'
import { getCookieItem } from '@global/functions/cookieUtils'
import { HandleClickProps, Review } from '@global/functions/interface'
import { setQueryParameterValue } from '@global/functions/paramUtils'
import { notify } from '@global/functions/showToast'

export const handleClick = async ({
  eventOrQuery,
  admin,
  inputValue,
  setReviews,
  setLoading
}: HandleClickProps): Promise<void> => {

  const value = typeof eventOrQuery === 'string' ? eventOrQuery : inputValue

  if (value.length === 0) {
    notify({ message: 'Please enter a valid Discord ID or search query', type: 'error' })
    return
  }

  if (setLoading) {
    setLoading(true)
    setQueryParameterValue({ param: 'query', value })
  }

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
        processReviews(res.reviews, '', () => setLoading && setLoading(false))
      }
    } else {
      const res = await searchReviews({ query: value, token: getCookieItem({ key: 'rdbToken', defaultValue: '' }) })
      if (res.success === false) {
        notify({ message: res.message || 'An unknown error has occurred', type: 'error' })
        setLoading && setLoading(false)
      } else {
        processReviews(res.reviews, value, () => setLoading && setLoading(false))
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      notify({ message: err.message || 'An unknown error has occurred', type: 'error' })
      console.log(err)
    } else {
      console.log('Unexpected error:', err)
    }
  }
}
