import { useState } from 'react'

export type AlertOptions = {
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  timeout?: number
}

export const useAlert = () => {
  const [showAlert, setShowAlert] = useState(false)
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({
    message: '',
    type: 'success',
    timeout: 3000,
  })

  const showAlertWithMessage = (options: AlertOptions) => {
    setAlertOptions(options)
    setShowAlert(true)
  }

  const handleAlertClose = () => {
    setShowAlert(false)
  }

  return { showAlert, showAlertWithMessage, handleAlertClose, alertOptions }
}
