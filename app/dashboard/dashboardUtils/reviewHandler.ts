import { getCookieItem } from '@global/functions/cookieUtils'
import { notify } from '@global/functions/showToast'
import { deleteReview, reportReview } from '@global/functions/RDBAPI'

export const handleReportReviewClick = async (reviewId: number): Promise<void> => {
  try {
    const res = await reportReview({ reviewID: reviewId, token: getCookieItem({ key: 'rdbToken', defaultValue: '' }) })
    if (res.success) notify({ message: res.message || 'Review reported successfully', type: 'success' })
  } catch (err: unknown) {
    if (err instanceof Error) {
      notify({ message: err.message || 'An unknown error has occurred', type: 'error' })
      console.log(err)
    } else {
      console.log('Unexpected error:', err)
    }
  }
}

export const handleDeleteReviewClick = async (reviewId: number, discordId: string): Promise<void> => {
  try {
    const res = await deleteReview({ reviewID: reviewId, discordID: discordId, token: getCookieItem({ key: 'rdbToken', defaultValue: '' }) })
    if (res.success) {
      notify({ message: res.message || 'Review deleted successfully', type: 'success' })
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
