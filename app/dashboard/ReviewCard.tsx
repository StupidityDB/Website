import ReviewDialogContent from '@global/app/dashboard/ReviewDialogContent'
import ConfirmationModal from '@global/app/modals/ConfirmationModal'
import { Dialog, useDialog } from '@global/components/Dialog'
import { ReviewCardProps } from '@global/functions/interface'
import { getCookieItem } from '@global/functions/cookieUtils'
import { voteReview } from '@global/functions/RDBAPI'
import { notify } from '@global/functions/showToast'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaChevronUp, FaChevronDown, FaFlag, FaTrash, FaInfoCircle } from 'react-icons/fa'

const ReviewCard: React.FC<ReviewCardProps> = ({ review, handleReportReviewClick, handleDeleteReviewClick, isAdmin }): JSX.Element => {
  const { isOpen, content, openDialog, closeDialog } = useDialog()

  const [userVote, setUserVote] = React.useState<boolean | undefined>(undefined)
  const [score, setScore] = React.useState(review.score || 0)
  const [voting, setVoting] = React.useState(false)

  const userInfo = JSON.parse(getCookieItem({ key: 'rdbUserInfo', defaultValue: '{}' }))
  const isSender = userInfo['discordID'] === review.sender.discordID
  const canDelete = isAdmin == 1 || userInfo['ID'] === review.sender.id

  const handleVote = async (isUpvote: boolean): Promise<void> => {
    const token = getCookieItem({ key: 'rdbToken', defaultValue: '' })
    if (!token) {
      notify({ message: 'Log in to vote on reviews.', type: 'error' })
      return
    }
    if (voting) return

    setVoting(true)
    try {
      const res = await voteReview({ reviewID: review.id, token, isUpvote })
      if (res && res.success) {
        // Voting the same direction again removes the vote
        const next = userVote === isUpvote ? undefined : isUpvote
        const valueOf = (vote: boolean | undefined): number => vote === undefined ? 0 : vote ? 1 : -1
        setScore((prev) => prev + valueOf(next) - valueOf(userVote))
        setUserVote(next)
      } else {
        notify({ message: res?.message || 'Vote failed.', type: 'error' })
      }
    } finally {
      setVoting(false)
    }
  }

  const openInfoDialog = (): void => {
    openDialog(
      <ReviewDialogContent
        review={review}
        handleReportReviewClick={handleReportReviewClick}
        handleDeleteReviewClick={handleDeleteReviewClick}
        closeDialog={closeDialog}
        isAdmin={isAdmin}
      />
    )
  }

  const openReportDialog = (): void => {
    openDialog(
      <ConfirmationModal
        title='Report Review'
        message='Report this review for harassment or spam? Our moderators will take a look at it.'
        submitText='Report'
        onConfirm={() => { handleReportReviewClick(review.id); closeDialog() }}
        onCancel={closeDialog}
      />
    )
  }

  const openDeleteDialog = (): void => {
    openDialog(
      <ConfirmationModal
        title='Delete Review'
        message='This will permanently delete this review. This action cannot be undone.'
        submitText='Delete'
        onConfirm={() => { handleDeleteReviewClick(review.id, review.sender.discordID).then(() => closeDialog()) }}
        onCancel={closeDialog}
      />
    )
  }

  // Discord-style timestamp: "Today at 10:30 PM", "Yesterday at 11:15 AM" or absolute date
  const formatDiscordTimestamp = (timestampSeconds: number): string => {
    if (!timestampSeconds) return ''
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
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} ${timeStr}`
    }
  }

  return (
    <div className='group relative flex items-start gap-3 px-3 sm:px-4 py-2.5 rounded-lg hover:bg-[#2e3035]/60 transition-colors w-full' key={review.id}>

      {/* Avatar */}
      <Link href={`/users/${review.sender.discordID}`} className='relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-[#35393e] mt-0.5'>
        <Image
          src={review.sender.profilePhoto || '/defaultAvatar.png'}
          alt={`${review.sender.username}'s avatar`}
          fill
          className='object-cover'
          draggable='false'
          unoptimized
        />
      </Link>

      {/* Message body */}
      <div className='flex-1 flex flex-col min-w-0'>
        <div className='flex items-center flex-wrap gap-x-2 gap-y-0.5'>
          <Link href={`/users/${review.sender.discordID}`} title={`View ${review.sender.username}'s profile`} className='text-[15px] gg-semibold text-slate-100 hover:underline truncate max-w-[180px] sm:max-w-none'>
            {review.sender.username}
          </Link>

          {review.sender.badges && review.sender.badges.length > 0 && (
            <span className='flex items-center gap-1 bg-surface-1/40 px-1.5 py-0.5 rounded'>
              {review.sender.badges.map((badge, idx) => (
                <Image
                  key={badge.icon + idx}
                  src={badge.icon}
                  alt={badge.name}
                  title={badge.description || badge.name}
                  width={14}
                  height={14}
                  className='object-contain'
                  unoptimized
                />
              ))}
            </span>
          )}

          <span className='text-xs text-slate-500 gg-normal select-none'>
            {formatDiscordTimestamp(review.timestamp)}
          </span>
        </div>

        <p className='text-[15px] text-[#dbdee1] leading-relaxed break-words gg-normal whitespace-pre-wrap mt-0.5 pr-1'>
          {review.comment}
        </p>
      </div>

      {/* Elevator vote buttons */}
      <div className='flex flex-col items-stretch flex-shrink-0 rounded-lg border border-white/10 bg-surface-1 overflow-hidden select-none'>
        <button
          title='Upvote'
          disabled={voting}
          onClick={() => handleVote(true)}
          className={`px-2.5 py-1.5 hover:bg-white/5 transition-colors ${userVote === true ? 'text-green-400' : 'text-slate-400 hover:text-green-400'}`}
        >
          <FaChevronUp size={11} />
        </button>
        <span className={`text-center text-xs gg-semibold tabular-nums py-0.5 px-1 ${userVote === true ? 'text-green-400' : userVote === false ? 'text-red-400' : 'text-slate-200'}`}>
          {score}
        </span>
        <button
          title='Downvote'
          disabled={voting}
          onClick={() => handleVote(false)}
          className={`px-2.5 py-1.5 hover:bg-white/5 transition-colors ${userVote === false ? 'text-red-400' : 'text-slate-400 hover:text-red-400'}`}
        >
          <FaChevronDown size={11} />
        </button>
      </div>

      {/* Discord-style hover action bar */}
      <div className='absolute -top-3 right-14 sm:right-16 bg-surface-2 border border-white/10 rounded-lg shadow-lg flex items-center gap-0.5 px-1 py-0.5 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity duration-150'>
        <button
          title='Review details'
          className='p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors'
          onClick={openInfoDialog}
        >
          <FaInfoCircle size={13} />
        </button>
        {!isSender && (
          <button
            title='Report'
            className='p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-orange-400 transition-colors'
            onClick={openReportDialog}
          >
            <FaFlag size={13} />
          </button>
        )}
        {canDelete && (
          <button
            title='Delete'
            className='p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors'
            onClick={openDeleteDialog}
          >
            <FaTrash size={13} />
          </button>
        )}
      </div>

      <Dialog content={content} isOpen={isOpen} onClose={closeDialog} />
    </div>
  )
}

export default ReviewCard
