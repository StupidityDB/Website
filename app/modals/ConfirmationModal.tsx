import React from 'react'

interface ConfirmationModalProps {
  title: string
  message: string | JSX.Element
  onConfirm: () => void
  onCancel?: () => void
  submitText?: string
}

export default function ConfirmationModal({ title, message, onConfirm, onCancel, submitText = 'Submit' }: ConfirmationModalProps): JSX.Element {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-start gap-4'>
        <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500/15 border border-red-500/25'>
          <svg className='h-5 w-5 text-red-400' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' aria-hidden='true'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' />
          </svg>
        </div>
        <div className='min-w-0'>
          <h3 className='text-base gg-semibold text-white' id='modal-title'>{title}</h3>
          <div className='mt-1.5 text-sm text-slate-300 gg-normal leading-relaxed'>{message}</div>
        </div>
      </div>
      <div className='flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-1'>
        <button type='button' className='button-secondary text-sm' onClick={onCancel}>Cancel</button>
        <button type='button' className='button-danger text-sm' onClick={onConfirm}>{submitText}</button>
      </div>
    </div>
  )
}
