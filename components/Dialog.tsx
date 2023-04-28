import { DialogProps } from '@global/functions/interface'
import React, { MouseEvent, ReactNode } from 'react'
import ReactDOM from 'react-dom'

export const Dialog: React.FC<DialogProps> = ({ content, isOpen, onClose }) => {
  const dialogRef = React.useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const handleOutsideClick = (e: MouseEvent) => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  return ReactDOM.createPortal(
    <div
      ref={dialogRef}
      onClick={handleOutsideClick}
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40'
    >
      <div className='border border-slate-200/25 bg-[#3e434d] shadow-lg rounded-lg p-6 text-slate-100 lg:w-1/4'>
        <div className='max-w-fit'>
          {content}
        </div>
      </div>
    </div>,
    document.getElementById('root')!
  )
}

export function useDialog() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [content, setContent] = React.useState<ReactNode>(null)

  const openDialog = (content: ReactNode) => {
    setContent(content)
    setIsOpen(true)
  }
  const closeDialog = () => setIsOpen(false)

  return { isOpen, content, openDialog, closeDialog }
}
