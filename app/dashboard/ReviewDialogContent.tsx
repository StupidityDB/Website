// components/ReviewDialogContent.tsx
import { ReviewDialogContentProps } from '@global/functions/interface'
import Image from 'next/image'
import React from 'react'

const ReviewDialogContent: React.FC<ReviewDialogContentProps> = ({
  review,
  handleReportReviewClick,
  handleDeleteReviewClick,
  closeDialog,
  isAdmin,
}) => {
  const getLocalStorageItem = (params: { key: string; defaultValue: string }) => {
    if (typeof window === 'undefined') return params.defaultValue
    const value = window.localStorage.getItem(params.key)
    return value === null ? params.defaultValue : value
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-4 items-center'>
        <Image src={review.sender.profilePhoto} alt='User Avatar' width={45} height={45} className='rounded-full' draggable='false' />
        <p className='md:text-2xl overflow-scroll scrollbar-none font-semibold'>{review.sender.username}</p>
      </div>
      <div className='flex flex-col gap-4 mb-2'>
        <p>{review.comment}</p>
        <div className="w-full h-[1px] my-1 bg-slate-200/25"></div>
        <div className='flex flex-col gap-2'>
          <p className='md:text-2xl text-xl text-slate-300 font-semibold'>Review Information</p>
          <div className='flex flex-col gap-1'>
            <p className='text-slate-300'>Review ID: <em>{review.id}</em></p>
            <p className='text-slate-300'>Review Date: <em>{new Date(review.timestamp * 1000).toLocaleString()}</em></p>
            {review.query && <p className='text-slate-300'>Found under: <em>{review.query}</em></p>}
          </div>
        </div>
      </div>
      <div className='flex gap-4 mt-4'>
        <button className='button !bg-orange-700 hover:!bg-orange-800' onClick={() => handleReportReviewClick(review.id)}>Report</button>
        {isAdmin || JSON.parse(getLocalStorageItem({ key: 'rdbUserInfo', defaultValue: '{}' }))['ID'] === review.sender.id ? (
          <button className='button !bg-red-700 hover:!bg-red-800' onClick={() => handleDeleteReviewClick(review.id, review.sender.discordID)}>Delete</button>
        ) : null}
        <button onClick={closeDialog} className="button !bg-gray-500 hover:!bg-gray-600">Close Dialog</button>
      </div>
    </div>
  )
}

export default ReviewDialogContent
