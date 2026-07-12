import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaExternalLinkAlt, FaInbox } from 'react-icons/fa'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ReviewCard from '@global/app/dashboard/ReviewCard'
import { handleDeleteReviewClick, handleReportReviewClick } from '@global/app/dashboard/dashboardUtils/reviewHandler'
import { getReviews } from '@global/functions/RDBAPI'
import { getCookieItem } from '@global/functions/cookieUtils'
import { GetUser, Review } from '@global/functions/interface'

const View: React.FC = (): JSX.Element => {
  const [user] = React.useState<GetUser | null>(() => {
    try {
      return JSON.parse(getCookieItem({ key: 'rdbUserInfo', defaultValue: 'null' }))
    } catch {
      return null
    }
  })
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!user?.discordID) {
      setLoading(false)
      return
    }

    getReviews({ discordID: user.discordID }).then((res) => {
      if (res && res.success !== false) {
        // Drop the API's "Looking for reviews?" pseudo-review (id 0)
        setReviews((res.reviews || []).filter((review) => review.id !== 0))
      }
    }).finally(() => setLoading(false))
  }, [user?.discordID])

  // You own this profile, so any review on it can be deleted; on success drop it from the list
  const handleDelete = async (reviewId: number, discordId: string): Promise<boolean> => {
    const success = await handleDeleteReviewClick(reviewId, discordId)
    if (success) {
      setReviews((prev) => prev.filter((review) => review.id !== reviewId))
    }
    return success
  }

  return (
    <div className='flex flex-col gap-6 w-full'>
      {/* Profile header */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between'>
        <div className='flex items-center gap-4 min-w-0'>
          <Image src={user?.profilePhoto || '/defaultAvatar.png'} alt='Your avatar' width={52} height={52} className='rounded-full flex-shrink-0' draggable='false' unoptimized />
          <div className='flex flex-col min-w-0'>
            <h1 className='text-xl sm:text-2xl gg-bold text-white truncate'>Reviews on my profile</h1>
            <p className='text-sm text-slate-400 gg-normal'>
              {loading ? 'Loading…' : `${reviews.length} review${reviews.length === 1 ? '' : 's'}`} — you can delete any review left on your profile.
            </p>
          </div>
        </div>
        {user?.discordID && (
          <Link href={`/users/${user.discordID}`} className='button-secondary text-sm flex-shrink-0 self-start sm:self-auto'>
            View public profile
            <FaExternalLinkAlt size={11} />
          </Link>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className='flex-1 flex items-center justify-center py-20 text-slate-400'>
          <AiOutlineLoading3Quarters className='animate-spin text-2xl' />
        </div>
      ) : reviews.length === 0 ? (
        <div className='flex flex-col items-center justify-center text-center gap-3 py-16 card border-dashed'>
          <div className='bg-surface-3 p-4 rounded-full text-slate-400 text-3xl'>
            <FaInbox />
          </div>
          <h2 className='text-lg gg-semibold text-white'>No reviews yet</h2>
          <p className='text-sm text-slate-400 gg-normal max-w-sm'>
            Nobody has reviewed your profile so far. Share your profile and the reviews will show up here.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-2'>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              handleReportReviewClick={handleReportReviewClick}
              handleDeleteReviewClick={handleDelete}
              isAdmin={1} // profile owners can delete any review on their own profile
            />
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

export default View
