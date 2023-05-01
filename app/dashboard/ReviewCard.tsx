import ReviewDialogContent from '@global/app/dashboard/ReviewDialogContent'
import { Dialog, useDialog } from '@global/components/Dialog'
import { ReviewCardProps } from '@global/functions/interface'
import Image from 'next/image'
import React from 'react'

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

  return (
    <div className='flex flex-col gap-4 bg-slate-500/25 backdrop-blur-sm md:p-4 p-2 rounded-md w-[310px] md:h-[18em]' key={review.id}>
      <div className='flex gap-4 items-center'>
        <Image src={review.sender.profilePhoto} alt='User Avatar' width={45} height={45} className='rounded-full' draggable='false' />
        <p className='md:text-2xl overflow-scroll scrollbar-none gg-normal'>{review.sender.username}</p>
      </div>
      <div className='flex-grow flex-shrink overflow-y-auto scrollbarStyle'>
        <p className='gg-normal'>{review.comment}</p>
      </div>
      <div className='flex gap-4 mt-4'>
        <button className='button' onClick={() => openDialog(dialogContent)}>Info</button>
      </div>

      <Dialog content={content} isOpen={isOpen} onClose={closeDialog} />
    </div>
  )
}

export default ReviewCard
