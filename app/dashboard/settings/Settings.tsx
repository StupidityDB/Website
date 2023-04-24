import AlertPopup from '@global/components/AlertPopup'
import { getRDBSettings, setRDBSettings } from '@global/functions/RDBAPI'
import { Settings } from '@global/functions/interface'
import { getLocalStorageItem } from '@global/functions/localStorage'
import { useAlert } from '@global/hooks/useAlert'
import React from 'react'
import Toggle from '@global/app/dashboard/settings/Toggle'

const Settings: React.FC = (): JSX.Element => {
  const { showAlert, showAlertWithMessage, handleAlertClose, alertOptions } = useAlert()

  const token = getLocalStorageItem({ key: 'rdbToken', defaultValue: '' })

  const [checked, setChecked] = React.useState(false as boolean)
  const [settings, setSettings] = React.useState({} as Settings)

  React.useEffect(() => {
    getRDBSettings({ token: token }).then((res) => {
      setSettings(res)
      setChecked(res.opt)
    }).catch((err: Error) => {
      console.log(err)
      showAlertWithMessage({ message: err.message, type: 'error' })
    })
  }, [token, showAlertWithMessage])

  function saveSettings(): void {
    setRDBSettings({ settings: { opt: checked }, token: token }).catch((err: Error) => {
      console.log(err)
      showAlertWithMessage({ message: err.message, type: 'error' })
    })
  }

  return (
    <div className='flex flex-col md:w-2/3 w-full h-full'>
      {showAlert && (
        <AlertPopup
          message={alertOptions.message}
          type={alertOptions.type}
          timeout={alertOptions.timeout}
          onClose={handleAlertClose}
        />
      )}
      {settings.DiscordID && (
        <>
          <h1 className='text-3xl font-bold mb-4'>Settings</h1>
          <div className='flex flex-col gap-4 h-screen'>
            <Toggle onChange={setChecked} checked={settings.opt} label='Let people review me' />
          </div>
          <button className='flex button justify-center items-center lg:w-1/3' onClick={saveSettings}>Save Settings</button>
        </>
      )}
    </div>
  )
}

export default Settings
