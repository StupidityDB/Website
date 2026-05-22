'use client'

export const runtime = 'edge'

import React from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ToastContainer } from 'react-toastify'
import { FaDiscord, FaPaperPlane, FaCode, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import 'react-toastify/dist/ReactToastify.css'

import { getCookieItem } from '@global/functions/cookieUtils'
import { getReviews, getUserInfoByID, addReview, deleteReview, reportReview, voteReview, getReviewVotes } from '@global/functions/RDBAPI'
import { Review, Badge, GetUser } from '@global/functions/interface'
import { notify } from '@global/functions/showToast'
import DiscordMessage from '@global/components/DiscordMessage'
import LoadingSkeleton from '@global/app/LoadingSkeleton'

interface UserProfile {
  discordID: string
  username: string
  profilePhoto: string
  badges: Badge[]
  type: number
  optedOut: boolean
}

const ProfilePage: React.FC = () => {
  const params = useParams()
  const discordID = params.id as string

  // State
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [reviewCount, setReviewCount] = React.useState<number>(0)
  const [userVotes, setUserVotes] = React.useState<Record<number, boolean | undefined>>({}) // reviewID -> isUpvote
  const [loading, setLoading] = React.useState(true)
  const [comment, setComment] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  // Current logged in user info
  const [token, setToken] = React.useState<string | null>(null)
  const [currentUser, setCurrentUser] = React.useState<GetUser | null>(null)

  React.useEffect(() => {
    const t = getCookieItem({ key: 'rdbToken', defaultValue: null })
    setToken(t)
    const userInfo = getCookieItem({ key: 'rdbUserInfo', defaultValue: null })
    if (userInfo) {
      try {
        setCurrentUser(JSON.parse(userInfo))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Load all page data
  const loadData = async (): Promise<void> => {
    try {
      setLoading(true)

      // 1. Fetch profile info
      const prof = await getUserInfoByID({ discordID })
      if (!prof) {
        setProfile({
          discordID,
          username: `Discord User (${discordID})`,
          profilePhoto: '/defaultAvatar.png',
          badges: [],
          type: 0,
          optedOut: false
        })
      } else {
        setProfile(prof)
      }

      // 2. Fetch reviews
      const reviewsRes = await getReviews({ discordID })
      if (reviewsRes && reviewsRes.success !== false) {
        // filter out system warnings/opt-out reviews or empty reviews if needed,
        // but let's keep all and sort them (newest at bottom for Discord layout!)
        // Actually, Go backend returns list sorted newest first. Discord has oldest first.
        // We will reverse them or display them in traditional scroll order.
        const sortedReviews = [...(reviewsRes.reviews || [])].reverse()
        setReviews(sortedReviews)
        
        const count = reviewsRes.reviewCount ?? reviewsRes.review_count ?? sortedReviews.length
        setReviewCount(count)
      }

      // 3. Fetch votes if user is logged in
      const activeToken = getCookieItem({ key: 'rdbToken', defaultValue: null })
      if (activeToken) {
        const votesRes = await getReviewVotes({ discordID, token: activeToken })
        if (votesRes && votesRes.success) {
          const voteMap: Record<number, boolean> = {}
          votesRes.votes.forEach((v) => {
            voteMap[v.reviewID] = v.isUpvote
          })
          setUserVotes(voteMap)
        }
      }
    } catch (err) {
      console.error(err)
      notify({ message: 'Failed to load profile reviews.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (discordID) {
      loadData()
    }
  }, [discordID])

  // Handle direct review addition
  const handleSendReview = async (e?: React.FormEvent): Promise<void> => {
    if (e) e.preventDefault()
    if (!comment.trim()) return
    if (!token) {
      notify({ message: 'You must be logged in to review.', type: 'error' })
      return
    }

    setSubmitting(true)
    try {
      const res = await addReview({
        discordID,
        review: {
          token,
          comment: comment.trim(),
          reviewtype: 0
        }
      })

      if (res && res.success) {
        notify({ message: res.message || 'Review added!', type: 'success' })
        setComment('')
        // reload data to fetch latest updates
        await loadData()
      } else {
        notify({ message: res?.message || 'Failed to submit review.', type: 'error' })
      }
    } catch (err) {
      console.error(err)
      notify({ message: (err as Error).message || 'An error occurred.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle upvoting/downvoting
  const handleVote = async (reviewID: number, isUpvote: boolean): Promise<void> => {
    if (!token) {
      notify({ message: 'Log in to vote on reviews.', type: 'error' })
      return
    }

    try {
      // Optimistic state update
      const currentVote = userVotes[reviewID]
      if (currentVote === isUpvote) {
        // Toggle off the vote
      }

      const res = await voteReview({ reviewID, token, isUpvote })
      if (res && res.success) {
        // Update local state
        setUserVotes((prev) => ({
          ...prev,
          [reviewID]: prev[reviewID] === isUpvote ? undefined : isUpvote
        }))
        // Refresh to update exact score counts from server
        const reviewsRes = await getReviews({ discordID })
        if (reviewsRes && reviewsRes.success !== false) {
          const sortedReviews = [...(reviewsRes.reviews || [])].reverse()
          setReviews(sortedReviews)
          const count = reviewsRes.reviewCount ?? reviewsRes.review_count ?? sortedReviews.length
          setReviewCount(count)
        }
      } else {
        notify({ message: res?.message || 'Vote failed.', type: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Handle report review
  const handleReport = async (reviewID: number): Promise<void> => {
    if (!token) {
      notify({ message: 'Log in to report reviews.', type: 'error' })
      return
    }

    if (!confirm('Are you sure you want to report this review for harassment or spam?')) return

    try {
      const res = await reportReview({ reviewID, token })
      if (res && res.success) {
        notify({ message: 'Review reported successfully.', type: 'success' })
      } else {
        notify({ message: res?.message || 'Failed to report review.', type: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Handle delete review
  const handleDelete = async (reviewID: number): Promise<void> => {
    if (!token) return

    if (!confirm('Are you sure you want to permanently delete this review?')) return

    try {
      const res = await deleteReview({ reviewID, discordID, token })
      if (res && res.success) {
        notify({ message: 'Review deleted successfully.', type: 'success' })
        setReviews((prev) => prev.filter((r) => r.id !== reviewID))
        setReviewCount((prev) => Math.max(0, prev - 1))
      } else {
        notify({ message: res?.message || 'Failed to delete review.', type: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCopyWidget = (): void => {
    const code = `<iframe src="https://reviewdb.mantikafasi.dev/widget/${discordID}" width="100%" height="450" frameborder="0" style="border:none;border-radius:12px;"></iframe>`
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendReview()
    }
  }

  if (loading && !profile) {
    return <LoadingSkeleton />
  }

  const isBanned = profile?.type === -1
  const isOptedOut = profile?.optedOut || false
  const activeUserBanned = currentUser?.type === -1

  return (
    <div className='flex flex-col lg:flex-row gap-6 h-full w-full select-none overflow-hidden max-h-[70vh] md:max-h-[69vh]'>
      
      {/* SIDEBAR: Profile Card & Embed code */}
      <div className='w-full lg:w-[280px] xl:w-[320px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent'>
        
        {/* Discord Profile Card Design */}
        <div className='bg-[#1e1f22] rounded-xl overflow-hidden shadow-2xl flex flex-col border border-slate-800/40'>
          {/* Card Banner */}
          <div className='h-20 bg-sky-600 relative w-full' />
          
          {/* Avatar Area */}
          <div className='px-4 pb-4 relative flex flex-col'>
            <div className='relative w-[80px] h-[80px] rounded-full overflow-hidden border-[6px] border-[#1e1f22] -mt-10 mb-2 bg-[#2b2d31]'>
              <Image 
                src={profile?.profilePhoto || '/defaultAvatar.png'}
                alt={`${profile?.username || 'User'}'s avatar`}
                fill
                className='object-cover'
                unoptimized
              />
            </div>

            {/* Profile Info */}
            <h2 className='text-xl font-bold text-white tracking-wide gg-bold flex items-center gap-2'>
              {profile?.username}
            </h2>
            <span className='text-xs text-slate-400 font-mono select-all mt-0.5'>@{profile?.discordID}</span>

            {/* Badges display on card */}
            {profile?.badges && profile.badges.length > 0 && (
              <div className='flex flex-wrap gap-1.5 mt-3 bg-[#111214] p-2 rounded-lg border border-slate-800/40'>
                {profile.badges.map((badge: Badge, idx: number) => (
                  <a
                    key={badge.icon + idx}
                    href={badge.redirectURL || '#'}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='relative w-6 h-6 hover:scale-115 transition-transform'
                    title={badge.description || badge.name}
                  >
                    <Image
                      src={badge.icon}
                      alt={badge.name}
                      fill
                      className='object-contain'
                      unoptimized
                    />
                  </a>
                ))}
              </div>
            )}

            {/* Premium details block */}
            <div className='border-t border-slate-800 my-4 pt-4 flex flex-col gap-2.5 text-xs text-slate-300 gg-normal'>
              <div className='flex justify-between items-center'>
                <span className='text-slate-400'>Total Reviews</span>
                <span className='bg-slate-800 px-2 py-0.5 rounded-full text-slate-200 font-semibold'>{reviewCount}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-slate-400'>Status</span>
                <span>
                  {isBanned ? (
                    <span className='text-red-500 font-bold'>Banned</span>
                  ) : isOptedOut ? (
                    <span className='text-orange-500 font-bold'>Opted Out</span>
                  ) : (
                    <span className='text-green-500 font-bold'>Active</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COPY WIDGET CODE BOX */}
        <div className='bg-[#1e1f22] p-4 rounded-xl flex flex-col gap-3 shadow-2xl border border-slate-800/40'>
          <div className='flex items-center gap-2 text-sky-400 font-semibold text-sm gg-semibold'>
            <FaCode />
            <span>Profile Widget Embed</span>
          </div>
          <p className='text-xs text-slate-400 leading-relaxed gg-normal'>
            Copy this HTML to embed reviews for this user on your own website or blog!
          </p>
          <button
            onClick={handleCopyWidget}
            className={`flex justify-center items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold select-none transition-colors duration-200 ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-sky-600/20 hover:bg-sky-600/35 text-sky-400 border border-sky-500/20'
            }`}
          >
            {copied ? (
              <>
                <FaCheck />
                <span>Copied Code!</span>
              </>
            ) : (
              <>
                <span>Copy Embed Code</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* CHAT CONTAINER: Channel structure and list of messages */}
      <div className='flex-1 bg-[#313338] rounded-xl border border-slate-800/25 flex flex-col overflow-hidden h-full shadow-2xl'>
        
        {/* Channel Header Bar */}
        <div className='h-12 border-b border-[#1f2023] px-4 flex items-center justify-between bg-[#313338] select-none flex-shrink-0 z-10'>
          <div className='flex items-center gap-2'>
            <span className='text-slate-400 text-2xl font-light'>#</span>
            <span className='text-white font-bold tracking-wide gg-bold'>reviews-for-{profile?.username}</span>
          </div>
          {isOptedOut && (
            <div className='flex items-center gap-2 text-xs bg-orange-500/10 border border-orange-500/30 text-orange-400 px-2 py-1 rounded-md'>
              <FaExclamationTriangle />
              <span>Reviews Disabled</span>
            </div>
          )}
        </div>

        {/* Scrollable Message List */}
        <div className='flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent'>
          
          {/* Welcome Message (shown at top of thread or if empty) */}
          {reviews.length === 0 ? (
            <div className='p-6 flex flex-col justify-center items-start text-left max-w-lg mt-auto mb-auto ml-4 select-none'>
              <div className='bg-[#383a40] p-4 rounded-full text-slate-200 mb-4 text-3xl'>
                <FaDiscord />
              </div>
              <h1 className='text-white text-3xl font-extrabold mb-2 gg-bold'>Welcome to @{profile?.username}&apos;s profile reviews!</h1>
              <p className='text-slate-400 gg-normal leading-relaxed text-sm mb-4'>
                This is the start of reviews for this user. Say something nice, write a review, and let others know about your experience!
              </p>
            </div>
          ) : (
            <div className='flex flex-col w-full'>
              {/* Start of thread marker */}
              <div className='px-4 pt-4 pb-6 border-b border-[#3f4147]/40 mb-4 select-none'>
                <div className='bg-[#383a40] w-14 h-14 rounded-full flex items-center justify-center text-slate-200 text-3xl mb-3'>
                  #
                </div>
                <h2 className='text-white text-2xl font-bold gg-bold'>Welcome to the beginning of @{profile?.username}&apos;s history!</h2>
                <p className='text-slate-400 text-sm gg-normal mt-1'>This is the absolute beginning of the reviews for @{profile?.username}.</p>
              </div>

              {/* Render Discord Chat Messages */}
              <div className='flex flex-col gap-1 w-full'>
                {reviews.map((rev) => (
                  <DiscordMessage
                    key={rev.id}
                    review={rev}
                    currentUserId={currentUser?.discordID || null}
                    userVote={userVotes[rev.id]}
                    isProfileOwner={currentUser?.discordID === discordID}
                    isAdmin={currentUser?.type === 1}
                    onVote={(isUpvote) => handleVote(rev.id, isUpvote)}
                    onDelete={() => handleDelete(rev.id)}
                    onReport={() => handleReport(rev.id)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Discord Chat input Box */}
        <div className='p-4 pt-0 select-none flex-shrink-0 bg-[#313338]'>
          {activeUserBanned ? (
            <div className='w-full bg-[#2b2d31] p-4 rounded-xl text-center text-red-500 font-semibold gg-semibold flex items-center justify-center gap-2 border border-red-500/20'>
              <FaExclamationTriangle />
              <span>You are banned from ReviewDB and cannot post reviews.</span>
            </div>
          ) : isOptedOut ? (
            <div className='w-full bg-[#2b2d31] p-4 rounded-xl text-center text-orange-400 font-semibold gg-semibold flex items-center justify-center gap-2 border border-orange-500/20'>
              <FaExclamationTriangle />
              <span>This user has opted out of ReviewDB. Review submission is disabled.</span>
            </div>
          ) : token ? (
            <form onSubmit={handleSendReview} className='relative flex items-center bg-[#383a40] rounded-xl pr-3 pl-4 focus-within:ring-2 ring-sky-500/50 transition-all'>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Send a review to @${profile?.username}... (Press Enter to send, Shift+Enter for newline)`}
                rows={1}
                maxLength={1000}
                className='flex-1 bg-transparent py-4 text-[#dbdee1] placeholder-[#80848e] text-[15px] outline-none border-none resize-none gg-normal leading-normal max-h-32 scrollbar-none'
              />
              <div className='flex items-center gap-2 ml-2'>
                {comment.length > 800 && (
                  <span className='text-xs text-slate-500 font-semibold'>{comment.length}/1000</span>
                )}
                <button
                  type='submit'
                  disabled={submitting || !comment.trim()}
                  className='p-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-md'
                >
                  <FaPaperPlane size={14} />
                </button>
              </div>
            </form>
          ) : (
            <div className='w-full bg-[#2b2d31] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800/40 shadow-inner'>
              <div className='flex flex-col text-left'>
                <span className='text-slate-300 font-bold gg-bold text-[15px]'>Want to leave a review for this user?</span>
                <span className='text-slate-400 text-xs gg-normal mt-0.5'>Log in securely with your Discord account to get started.</span>
              </div>
              <a
                href='https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2Fapi%2Freviewdb%2Fauthweb&response_type=code&scope=identify'
                className='flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white py-2 px-4 rounded-lg text-sm font-bold shadow transition duration-150 transform hover:scale-[1.02]'
              >
                <FaDiscord />
                <span>Login with Discord</span>
              </a>
            </div>
          )}
        </div>

      </div>

      <ToastContainer />
    </div>
  )
}

export default ProfilePage
