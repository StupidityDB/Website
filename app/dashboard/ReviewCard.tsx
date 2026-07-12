import ReviewDialogContent from '@global/app/dashboard/ReviewDialogContent'
import { Dialog, useDialog } from '@global/components/Dialog'
import { ReviewCardProps } from '@global/functions/interface'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaThumbsUp, FaInfoCircle } from 'react-icons/fa'

const ReviewCard: React.FC<ReviewCardProps> = ({ review, handleReportReviewClick, handleDeleteReviewClick, isAdmin }): JSX.Element => {
  const { isOpen, content, openDialog, closeDialog } = useDialog()

  const dialogContent = (
    <ReviewDialogContent
      review={review}
      handleReportReviewClick={handleReportReviewClick}
      handleDeleteReviewClick={handleDeleteReviewClick}
      closeDialog={closeDialog}
      isAdmin={isAdmin}
    />
  )

  const formatDate = (timestampSeconds: number): string => {
    if (!timestampSeconds) return ''
    const date = new Date(timestampSeconds * 1000)
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className='flex flex-col bg-[#1e1f22] hover:bg-[#2b2d31] border border-slate-800/40 hover:border-slate-700/60 p-4 rounded-xl w-full h-[14.5em] shadow-lg hover:shadow-xl transition-all duration-200 select-none' key={review.id}>
      
      {/* Sender Header */}
      <div className='flex gap-3 items-start justify-between w-full'>
        <div className='flex gap-3 items-center min-w-0'>
          <div className='relative w-[40px] h-[40px] rounded-full overflow-hidden bg-[#35393e] flex-shrink-0'>
            <Image 
              src={review.sender.profilePhoto || '/defaultAvatar.png'} 
              alt={`${review.sender.username}'s avatar`} 
              fill
              className='object-cover'
              draggable='false' 
              unoptimized
            />
          </div>
          <div className='flex flex-col min-w-0 leading-tight'>
            <Link href={`/users/${review.sender.discordID}`} title={`View ${review.sender.username}'s profile`} className='text-[15px] font-semibold text-slate-100 truncate hover:underline gg-semibold'>
              {review.sender.username}
            </Link>
            <span className='text-[11px] text-slate-400 font-mono select-all mt-0.5 truncate'>
              @{review.sender.discordID}
            </span>
          </div>
        </div>

        {/* Timestamp */}
        <span className='text-[11px] text-slate-500 font-medium gg-normal flex-shrink-0 mt-0.5'>
          {formatDate(review.timestamp)}
        </span>
      </div>

      {/* Badges Display */}
      {review.sender.badges && review.sender.badges.length > 0 && (
        <div className='flex flex-wrap gap-1 mt-2.5 bg-[#111214]/50 px-2 py-1 rounded-md w-fit border border-slate-800/30'>
          {review.sender.badges.map((badge, idx) => (
            <div key={badge.icon + idx} className='relative w-4 h-4 hover:scale-110 transition-transform' title={badge.description || badge.name}>
              <Image
                src={badge.icon}
                alt={badge.name}
                fill
                className='object-contain'
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      {/* Review Content */}
      <div className='mt-2.5 overflow-y-auto flex-1 scrollbarStyle pr-1'>
        <p className='text-sm text-[#dbdee1] leading-relaxed break-words gg-normal whitespace-pre-wrap'>
          {review.comment}
        </p>
      </div>

      {/* Footer / Actions */}
      <div className='flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800/30'>
        {/* Reaction/Score Pill */}
        <div className='flex items-center gap-1.5 bg-[#111214] border border-slate-800/60 rounded-full px-2.5 py-0.5 text-xs text-slate-300 font-medium gg-semibold'>
          <FaThumbsUp className='text-slate-400' size={11} />
          <span>Score: {review.score || 0}</span>
        </div>

        {/* Info Trigger Button */}
        <button 
          className='flex items-center gap-1.5 px-3 py-1 bg-[#35393e] hover:bg-[#4e5058] active:bg-[#6d6f78] text-[#dbdee1] hover:text-white text-xs font-semibold rounded-md transition-colors shadow-sm cursor-pointer gg-semibold' 
          onClick={() => openDialog(dialogContent)}
        >
          <FaInfoCircle size={12} />
          <span>Info</span>
        </button>
      </div>

      <Dialog content={content} isOpen={isOpen} onClose={closeDialog} />
    </div>
  )
}

export default ReviewCard
