// components/ReviewDialogContent.tsx
import { ReviewDialogContentProps } from '@global/functions/interface'
import { getLocalStorageItem } from '@global/functions/localStorage'
import Image from 'next/image'
import React from 'react'

const ReviewDialogContent: React.FC<ReviewDialogContentProps> = ({
  review,
  handleReportReviewClick,
  handleDeleteReviewClick,
  closeDialog,
  isAdmin,
}): JSX.Element => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-4 items-center'>
        <Image src={review.sender.profilePhoto} alt='User Avatar' width={45} height={45} className='rounded-full' draggable='false' />
        <p className='flex flex-col text-2xl overflow-scroll scrollbar-none gg-semibold'>
          {review.sender.username}
          {review.sender.badges && <div className='flex gap-2'>{review.sender.badges.map(i => <Image key={i.icon} src={i.icon} width={20} height={20} title={i.description || i.name} alt={i.name || 'Badge'} />)}</div>}
        </p>
      </div>
      <div className='flex flex-col gap-4 mb-2'>
        <p className='gg-normal'>{review.comment}</p>
        <div className='w-full h-[1px] my-1 bg-slate-200/25'></div>
        <div className='flex flex-col gap-2'>
          <p className='md:text-2xl text-xl text-slate-300 gg-semibold'>Review Information</p>
          <div className='flex flex-col gap-1'>
            <p className='gg-normal text-slate-300'>Review ID: <span className='gg-italic'>{review.id}</span></p>
            <p className='gg-normal text-slate-300'>Review Date: <span className='gg-italic'>{new Date(review.timestamp * 1000).toLocaleString()}</span></p>
            {review.query && <p className='text-slate-300'>Found under: <span className='gg-italic'>{review.query}</span></p>}
          </div>
          <p className='md:text-2xl text-xl text-slate-300 gg-semibold'>User Information</p>
          <div className='flex flex-col gap-1'>
            <p className='gg-normal text-slate-300'>Discord ID: <span className='gg-italic'>{review.sender.discordID}</span></p>
            <p className='gg-normal text-slate-300'>Sender ID: <span className='gg-italic'>{review.sender.id}</span></p>
          </div>
        </div>
      </div>
      <div className='flex gap-4 mt-4'>
        <button className='button !bg-orange-700 hover:!bg-orange-800' onClick={() => handleReportReviewClick(review.id)}>Report</button>
        {isAdmin == 1 || JSON.parse(getLocalStorageItem({ key: 'rdbUserInfo', defaultValue: '{}' }))['ID'] === review.sender.id ? (
          <button className='button !bg-red-700 hover:!bg-red-800' onClick={() => handleDeleteReviewClick(review.id, review.sender.discordID)}>Delete</button>
        ) : null}
        <button onClick={closeDialog} className='button !bg-gray-500 hover:!bg-gray-600'>Close</button>
      </div>
    </div>
  )
}

export default ReviewDialogContent
