'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { FaComments } from 'react-icons/fa'
import { getReviews, getUserInfoByID } from '@global/functions/RDBAPI'
import { Review, Badge } from '@global/functions/interface'

interface UserProfile {
  discordID: string
  username: string
  profilePhoto: string
  badges: Badge[]
  type: number
  optedOut: boolean
}

const WidgetPage: React.FC = () => {
  const params = useParams()
  const discordID = params.id as string

  // State
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [reviewCount, setReviewCount] = React.useState<number>(0)
  const [loading, setLoading] = React.useState(true)
  const [scale, setScale] = React.useState<number>(1.0)

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true)
      const prof = await getUserInfoByID({ discordID })
      if (!prof) {
        setProfile({
          discordID,
          username: 'Discord User',
          profilePhoto: '/defaultAvatar.png',
          badges: [],
          type: 0,
          optedOut: false
        })
      } else {
        setProfile(prof)
      }

      const reviewsRes = await getReviews({ discordID })
      if (reviewsRes && reviewsRes.success !== false) {
        const sortedReviews = [...(reviewsRes.reviews || [])].reverse()
        setReviews(sortedReviews)
        const count = reviewsRes.reviewCount ?? reviewsRes.review_count ?? sortedReviews.length
        setReviewCount(count)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (discordID) {
      loadData()
    }
  }, [discordID])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const s = params.get('scale')
      if (s) {
        const parsed = parseFloat(s)
        if (!isNaN(parsed) && parsed > 0) {
          setScale(parsed)
        }
      }
    }
  }, [])

  const formatDiscordTimestamp = (timestampSeconds: number): string => {
    const date = new Date(timestampSeconds * 1000)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    if (date.getTime() >= today.getTime()) {
      return `Today at ${timeStr}`
    } else if (date.getTime() >= yesterday.getTime()) {
      return `Yesterday at ${timeStr}`
    } else {
      return `${date.toLocaleDateString()}`
    }
  }

  if (loading && !profile) {
    return (
      <div className='flex flex-col items-center justify-center h-screen w-full bg-[#313338] text-slate-400 gap-3'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500' />
        <span className='text-xs gg-normal'>Loading reviews...</span>
      </div>
    )
  }

  return (
    <div 
      className='flex flex-col h-full w-full bg-[#313338] select-none text-slate-100 p-0 m-0 border-none'
      style={scale !== 1.0 ? { zoom: scale } : {}}
    >
      
      {/* Widget Header Bar */}
      <div className='h-12 border-b border-[#1f2023] px-3 flex items-center justify-between bg-[#2b2d31] flex-shrink-0 z-10 shadow-sm'>
        <div className='flex items-center gap-2 min-w-0'>
          <div className='relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-[#35393e]'>
            <Image 
              src={profile?.profilePhoto || '/defaultAvatar.png'}
              alt='Profile Avatar'
              fill
              className='object-cover'
              unoptimized
            />
          </div>
          <span className='font-bold text-sm text-white truncate gg-bold'>@{profile?.username}</span>
          <span className='text-[10px] bg-[#383a40] text-slate-300 px-1.5 py-0.5 rounded-full font-mono flex-shrink-0'>
            {reviewCount} reviews
          </span>
        </div>
        
      </div>

      {/* Message Thread */}
      <div className='flex-1 overflow-y-auto px-1 py-3 flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent'>
        {reviews.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center p-6 text-slate-400 select-none'>
            <FaComments size={28} className='text-slate-500 mb-2' />
            <h4 className='text-white font-semibold text-xs gg-semibold'>No reviews yet</h4>
            <p className='text-[10px] mt-1 leading-normal max-w-[180px] gg-normal'>
              Be the first to review @{profile?.username}! Click the button above.
            </p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className='flex items-start gap-2.5 px-3 py-1.5 hover:bg-[#2e3035]/30 rounded-md transition-colors w-full'>
              {/* Sender Avatar */}
              <div className='relative flex-shrink-0 w-7 h-7 rounded-full overflow-hidden select-none bg-[#35393e]'>
                <Image
                  src={rev.sender?.profilePhoto || '/defaultAvatar.png'}
                  alt='Avatar'
                  fill
                  className='object-cover'
                  unoptimized
                />
              </div>

              {/* Message Details */}
              <div className='flex-1 flex flex-col min-w-0'>
                <div className='flex items-center gap-1.5'>
                  <span className='text-xs font-semibold text-white truncate max-w-[120px] gg-semibold'>
                    {rev.sender?.username || 'Unknown'}
                  </span>
                  
                  {/* Badges */}
                  {rev.sender?.badges && rev.sender.badges.length > 0 && (
                    <div className='flex items-center gap-0.5 bg-[#1e1f22]/30 px-1 py-0.5 rounded'>
                      {rev.sender.badges.slice(0, 2).map((badge, idx) => (
                        <Image
                          key={badge.icon + idx}
                          src={badge.icon}
                          alt={badge.name}
                          width={10}
                          height={10}
                          className='object-contain'
                          unoptimized
                        />
                      ))}
                    </div>
                  )}

                  <span className='text-[9px] text-slate-400 gg-normal select-none flex-shrink-0'>
                    {formatDiscordTimestamp(rev.timestamp)}
                  </span>
                </div>
                <div className='text-xs text-[#dbdee1] break-words gg-normal whitespace-pre-wrap mt-0.5 leading-normal'>
                  {rev.comment}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Widget Footer: Discord invite layout */}
      <div className='p-2.5 bg-[#2b2d31] border-t border-[#1f2023] flex items-center justify-between flex-shrink-0 select-none'>
        <div className='flex items-center gap-2 min-w-0'>
          <div className='relative w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 bg-[#1e1f22] p-0.5 border border-slate-700/30'>
            <Image 
              src='/logo.png' 
              alt='ReviewDB Logo' 
              fill 
              className='object-contain'
              unoptimized
            />
          </div>
          <div className='flex flex-col text-left min-w-0'>
            <span className='text-slate-200 font-bold text-[10px] gg-bold truncate'>Review @{profile?.username}</span>
            <span className='text-slate-400 text-[8px] gg-normal leading-none mt-0.5 truncate'>Powered by ReviewDB</span>
          </div>
        </div>
        
        <a
          href={`https://reviewdb.mantikafasi.dev/users/${discordID}`}
          target='_blank'
          rel='noopener noreferrer'
          className='bg-[#248046] hover:bg-[#1a6535] text-white py-1 px-3 rounded text-[10px] font-bold shadow-sm transition-colors duration-150 flex-shrink-0 gg-bold'
        >
          Review Profile
        </a>
      </div>

    </div>
  )
}

export default WidgetPage
