'use client'

export const runtime = 'edge'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FaBan, FaCheck, FaTrash } from 'react-icons/fa'
import { AdminUser, deleteReview, getAdminUser, getAdminUserReviews, updateAdminUser } from '@global/functions/RDBAPI'
import { Review } from '@global/functions/interface'
import { getCookieItem } from '@global/functions/cookieUtils'
import { notify } from '@global/functions/showToast'
import { ToastContainer } from 'react-toastify'

const UserModerationPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>()
  const token = getCookieItem({ key: 'rdbToken', defaultValue: '' })
  const [user, setUser] = React.useState<AdminUser | null>(null)
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [reviewCount, setReviewCount] = React.useState(0)

  React.useEffect(() => {
    getAdminUser({ id, token }).then(async found => {
      setUser(found)
      if (found) {
        const history = await getAdminUserReviews({ id: String(found.id), token })
        setReviews(history?.reviews || [])
        setReviewCount(history?.reviewCount || 0)
      }
    })
  }, [id, token])

  const setBanState = async (banned: boolean): Promise<void> => {
    if (!user) return
    const success = await updateAdminUser({ user: { id: user.id, type: banned ? -1 : 0 }, token })
    if (success) setUser({ ...user, type: banned ? -1 : 0 })
    else notify({ message: 'Unable to update user.', type: 'error' })
  }
  const removeReview = async (review: Review): Promise<void> => {
    const result = await deleteReview({ reviewID: review.id, discordID: review.sender.discordID, token })
    if (result?.success) { setReviews(current => current.filter(item => item.id !== review.id)); setReviewCount(current => current - 1) }
    else notify({ message: result?.message || 'Unable to remove review.', type: 'error' })
  }

  return <main className='flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6'>
    <Link href='/dashboard/moderation' className='link text-sm'>Moderation home</Link>
    {!user ? <p className='mt-6 text-slate-400'>Loading user or user not found.</p> : <>
      <section className='card p-4 my-5 flex flex-col sm:flex-row sm:items-center gap-4'><Image src={user.profile_photo || '/defaultAvatar.png'} alt='' width={52} height={52} className='rounded-full' unoptimized /><div className='flex-1'><h1 className='text-xl gg-bold text-white'>{user.username}</h1><p className='text-sm text-slate-400'>{user.discord_id} · {reviewCount} reviews written · reputation {user.reputation}</p></div>{user.type === -1 ? <button onClick={() => { void setBanState(false) }} className='button !bg-emerald-600'><FaCheck />Unban</button> : <button onClick={() => { void setBanState(true) }} className='button !bg-red-600'><FaBan />Ban</button>}</section>
      <section className='card overflow-hidden'><div className='px-4 py-3 border-b border-white/10 text-sm gg-semibold text-slate-200'>Reviews written by this user</div>{reviews.length === 0 ? <p className='p-4 text-sm text-slate-400'>No reviews written by this user.</p> : reviews.map(review => <article key={review.id} className='p-4 border-b border-white/5 last:border-0 flex gap-3'><div className='flex-1'><p className='text-slate-200 whitespace-pre-wrap'>{review.comment}</p><p className='mt-2 text-xs text-slate-400'>#{review.id} · {new Date(review.timestamp * 1000).toLocaleString()}</p></div><button onClick={() => { void removeReview(review) }} className='p-2 text-red-400 hover:bg-red-500/10 rounded self-start'><FaTrash /></button></article>)}</section>
    </>}
    <ToastContainer />
  </main>
}

export default UserModerationPage
