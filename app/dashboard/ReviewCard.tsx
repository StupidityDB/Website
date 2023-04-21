import { Review } from '@global/functions/interface'
import { getLocalStorageItem } from '@global/functions/localStorage'
import Image from 'next/image'
import React from 'react'

interface ReviewCardProps {
  review: Review;
  handleReportReviewClick: (reviewId: number) => void;
  handleDeleteReviewClick: (reviewId: number, discordId: string) => void;
  isAdmin: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, handleReportReviewClick, handleDeleteReviewClick, isAdmin }) => {
  return (
    <div className='flex flex-col gap-4 bg-slate-500/25 backdrop-blur-sm md:p-4 p-2 rounded-md w-[310px] md:h-[18em]' key={review.id}>
      <div className='flex gap-4 items-center'>
        <Image src={review.sender.profilePhoto} alt='User Avatar' width={45} height={45} className='rounded-full' draggable='false' />
        <p className='md:text-2xl overflow-scroll scrollbar-none'>{review.sender.username}</p>
      </div>
      <div className='flex-grow flex-shrink overflow-y-auto scrollbarStyle'>
        <p>{review.comment}</p>
      </div>
      <div className='flex gap-4 mt-4'>
        <button className='button !bg-orange-700 hover:!bg-orange-800' onClick={() => handleReportReviewClick(review.id)}>Report</button>
        {isAdmin || JSON.parse(getLocalStorageItem({ key: 'rdbUserInfo', defaultValue: '{}' }))['ID'] === review.sender.id ? (
          <button className='button !bg-red-700 hover:!bg-red-800' onClick={() => handleDeleteReviewClick(review.id, review.sender.discordID)}>Delete</button>
        ) : null}
        <button className='button'>Info</button>
      </div>
    </div>
  )
}

export default ReviewCard
