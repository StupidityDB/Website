import { DialogProps, UseDialog } from '@global/functions/interface'
import React, { MouseEvent, ReactNode } from 'react'
import ReactDOM from 'react-dom'

export const Dialog: React.FC<DialogProps> = ({ content, isOpen, onClose }) => {
  const backdropRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOutsideClick = (e: MouseEvent): void => {
    if (e.target === backdropRef.current) {
      onClose()
    }
  }

  return ReactDOM.createPortal(
    <div
      ref={backdropRef}
      onClick={handleOutsideClick}
      className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in'
      role='dialog'
      aria-modal='true'
    >
      <div className='card !rounded-2xl p-5 sm:p-6 text-slate-100 w-full max-w-lg max-h-[85dvh] overflow-y-auto scrollbarStyle animate-dialog-in'>
        {content}
      </div>
    </div>,
    document.body
  )
}

export function useDialog(): UseDialog {
  const [isOpen, setIsOpen] = React.useState(false)
  const [content, setContent] = React.useState<ReactNode>(null)

  const openDialog = (content: ReactNode): void => {
    setContent(content)
    setIsOpen(true)
  }
  const closeDialog = (): void => setIsOpen(false)

  return { isOpen, content, openDialog, closeDialog }
}
