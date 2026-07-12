import { ReviewDialogContentProps } from '@global/functions/interface'
import { getCookieItem } from '@global/functions/cookieUtils'
import Image from 'next/image'
import React from 'react'

const ReviewDialogContent: React.FC<ReviewDialogContentProps> = ({
  review,
  handleReportReviewClick,
  handleDeleteReviewClick,
  closeDialog,
  isAdmin,
}): JSX.Element => {
  const canDelete = isAdmin == 1 || JSON.parse(getCookieItem({ key: 'rdbUserInfo', defaultValue: '{}' }))['ID'] === review.sender.id
  const [confirmingDelete, setConfirmingDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const onDeleteClick = async (): Promise<void> => {
    if (!confirmingDelete) {
      setConfirmingDelete(true)
      return
    }
    setDeleting(true)
    const success = await handleDeleteReviewClick(review.id, review.sender.discordID)
    setDeleting(false)
    setConfirmingDelete(false)
    if (success) closeDialog()
  }

  const infoRows: Array<{ label: string, value: React.ReactNode }> = [
    { label: 'Review ID', value: review.id },
    { label: 'Review Date', value: new Date(review.timestamp * 1000).toLocaleString() },
    ...(review.query ? [{ label: 'Found under', value: review.query }] : []),
    { label: 'Discord ID', value: review.sender.discordID },
    { label: 'Sender ID', value: review.sender.id },
  ]

  return (
    <div className='flex flex-col gap-5'>
      {/* Sender */}
      <div className='flex gap-3.5 items-center min-w-0'>
        <Image src={review.sender.profilePhoto || '/defaultAvatar.png'} alt='User Avatar' width={48} height={48} className='rounded-full flex-shrink-0' draggable='false' unoptimized />
        <div className='flex flex-col min-w-0'>
          <span className='text-lg gg-semibold text-white truncate'>{review.sender.username}</span>
          {review.sender.badges && review.sender.badges.length > 0 && (
            <div className='flex flex-wrap gap-1.5 mt-1'>
              {review.sender.badges.map(badge => (
                <Image key={badge.icon} src={badge.icon} width={18} height={18} title={badge.description || badge.name} alt={badge.name || 'Badge'} unoptimized />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment */}
      <p className='gg-normal text-slate-200 leading-relaxed break-words whitespace-pre-wrap bg-surface-0/60 border border-white/5 rounded-lg p-3.5'>
        {review.comment}
      </p>

      {/* Details */}
      <div className='flex flex-col divide-y divide-white/5 rounded-lg border border-white/5 overflow-hidden'>
        {infoRows.map(({ label, value }) => (
          <div key={label} className='flex items-center justify-between gap-4 px-3.5 py-2.5 text-sm'>
            <span className='text-slate-400 gg-normal flex-shrink-0'>{label}</span>
            <span className='text-slate-200 font-mono text-xs select-all truncate'>{value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className='flex flex-col-reverse sm:flex-row justify-end gap-2.5'>
        <button onClick={closeDialog} className='button-secondary text-sm'>Close</button>
        <button className='button !bg-orange-600 hover:!bg-orange-700 text-sm' onClick={() => handleReportReviewClick(review.id)}>Report</button>
        {canDelete && (
          <button className='button-danger text-sm' onClick={onDeleteClick} disabled={deleting}>
            {deleting ? 'Deleting…' : confirmingDelete ? 'Click again to confirm' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ReviewDialogContent
