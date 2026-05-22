import React from 'react'
import Image from 'next/image'
import { FaThumbsUp, FaThumbsDown, FaFlag, FaTrash } from 'react-icons/fa'
import { Review, Sender } from '@global/functions/interface'

interface DiscordMessageProps {
  review: Review
  currentUserId: string | null
  userVote: boolean | undefined // true = upvoted, false = downvoted, undefined = none
  isProfileOwner: boolean
  isAdmin: boolean
  onVote: (_isUpvote: boolean) => Promise<void>
  onDelete: () => Promise<void>
  onReport: () => Promise<void>
}

const DiscordMessage: React.FC<DiscordMessageProps> = ({
  review,
  currentUserId,
  userVote,
  isProfileOwner,
  isAdmin,
  onVote,
  onDelete,
  onReport
}) => {
  const isSender = currentUserId === review.sender?.discordID
  const canDelete = isSender || isProfileOwner || isAdmin

  // Format timestamp like Discord: "Today at 10:30 PM" or "Yesterday at 11:15 AM" or absolute date
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
      return `${date.toLocaleDateString()} ${timeStr}`
    }
  }

  // Determine role colors or styles for user types
  const getUsernameColor = (sender: Sender | undefined): string => {
    if (!sender) return 'text-slate-200'
    // check if system warning or special review
    if (sender.discordID === '1134864775000629298' || sender.username === 'Warning') {
      return 'text-amber-500 font-bold'
    }
    // we can use standard gray/white
    return 'text-slate-100'
  }

  return (
    <div className='flex items-start gap-4 px-4 py-3 hover:bg-[#2e3035]/60 rounded-lg transition-colors group relative select-none w-full'>
      {/* Avatar */}
      <div className='relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden select-none bg-[#35393e]'>
        <Image
          src={review.sender?.profilePhoto || '/defaultAvatar.png'}
          alt={`${review.sender?.username || 'User'}'s avatar`}
          fill
          className='object-cover'
          draggable='false'
          unoptimized
        />
      </div>

      {/* Message Body */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* Top Header line */}
        <div className='flex items-center flex-wrap gap-x-2 gap-y-1'>
          <span className={`text-[15px] font-medium hover:underline cursor-pointer gg-semibold ${getUsernameColor(review.sender)}`}>
            {review.sender?.username || 'Unknown User'}
          </span>

          {/* Badges */}
          {review.sender?.badges && review.sender.badges.length > 0 && (
            <div className='flex items-center gap-1.5 bg-[#1e1f22]/40 px-1.5 py-0.5 rounded-md'>
              {review.sender.badges.map((badge, idx) => (
                <a
                  key={badge.icon + idx}
                  href={badge.redirectURL || '#'}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center hover:scale-110 transition-transform'
                  title={badge.description || badge.name}
                >
                  <Image
                    src={badge.icon}
                    alt={badge.name}
                    width={16}
                    height={16}
                    className='object-contain'
                    unoptimized
                  />
                </a>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <span className='text-xs text-slate-400 gg-normal select-none'>
            {formatDiscordTimestamp(review.timestamp || Math.floor(Date.now() / 1000))}
          </span>
        </div>

        {/* Comment Content */}
        <div className='text-[15px] text-[#dbdee1] break-words gg-normal whitespace-pre-wrap mt-[3px] leading-relaxed pr-6'>
          {review.comment}
        </div>

        {/* Reaction Pill (Upvote/Downvote Scores) */}
        {review.id !== 0 && (
          <div className='flex flex-wrap items-center gap-2 mt-2 select-none'>
            {/* Net Score Pill */}
            <div
              className={`flex items-center gap-1.5 border rounded-lg px-2 py-0.5 text-xs transition cursor-pointer select-none font-medium gg-semibold ${
                userVote === true
                  ? 'bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500/20'
                  : userVote === false
                    ? 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20'
                    : 'bg-[#2b2d31] border-slate-700/30 text-slate-300 hover:bg-[#35373c]'
              }`}
              onClick={() => onVote(true)}
            >
              <FaThumbsUp className={userVote === true ? 'text-green-400 scale-105' : 'text-slate-400'} />
              <span>Score: {review.score || 0}</span>
            </div>

            {/* Downvote indicator pill if user downvoted to show active choice */}
            {userVote === false && (
              <div
                className='flex items-center gap-1.5 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg px-2 py-0.5 text-xs transition cursor-pointer select-none hover:bg-red-500/20'
                onClick={() => onVote(false)}
              >
                <FaThumbsDown className='scale-105' />
                <span>Downvoted</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover Action Bar */}
      {review.id !== 0 && (
        <div className='absolute -top-3 right-4 bg-[#313338] border border-slate-700/50 rounded flex items-center shadow-lg opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 z-10 px-1 py-0.5 gap-0.5'>
          {/* Upvote */}
          <button
            title='Upvote'
            className={`p-2 hover:bg-[#3f4248] rounded transition cursor-pointer ${userVote === true ? 'text-green-400' : 'text-slate-300 hover:text-green-400'}`}
            onClick={() => onVote(true)}
          >
            <FaThumbsUp size={14} />
          </button>

          {/* Downvote */}
          <button
            title='Downvote'
            className={`p-2 hover:bg-[#3f4248] rounded transition cursor-pointer ${userVote === false ? 'text-red-400' : 'text-slate-300 hover:text-red-400'}`}
            onClick={() => onVote(false)}
          >
            <FaThumbsDown size={14} />
          </button>

          {/* Report (if not sender) */}
          {!isSender && currentUserId && (
            <button
              title='Report'
              className='p-2 hover:bg-[#3f4248] rounded text-slate-300 hover:text-orange-400 transition cursor-pointer'
              onClick={onReport}
            >
              <FaFlag size={14} />
            </button>
          )}

          {/* Delete */}
          {canDelete && currentUserId && (
            <button
              title='Delete'
              className='p-2 hover:bg-[#3f4248] rounded text-slate-300 hover:text-red-500 transition cursor-pointer'
              onClick={onDelete}
            >
              <FaTrash size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default DiscordMessage
