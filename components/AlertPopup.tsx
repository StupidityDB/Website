import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

type AlertProps = {
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  timeout?: number
  onClose: () => void
}

const AlertPopup: React.FC<AlertProps> = ({ message, type, timeout = 3000, onClose }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), timeout) as NodeJS.Timeout
    return () => clearTimeout(timer)
  }, [timeout])

  const closeAlert = () => {
    setShow(false)
    onClose()
  }

  const alertTypeClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'info':
        return 'bg-blue-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <CSSTransition in={show} classNames="alert" timeout={timeout}>
      <div
        className={`fixed bottom-4 left-4 z-50 px-4 py-2 rounded-md ${alertTypeClass()} transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center">
          <div className="text-white">{message}</div>
          <button
            onClick={closeAlert}
            className="ml-4 text-white hover:text-gray-300 focus:outline-none"
          >
            &times;
          </button>
        </div>
      </div>
    </CSSTransition>
  )
}

export default AlertPopup
