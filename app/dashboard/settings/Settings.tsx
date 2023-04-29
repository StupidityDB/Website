import Toggle from '@global/app/dashboard/settings/Toggle'
import { getRDBSettings, setRDBSettings } from '@global/functions/RDBAPI'
import { Settings } from '@global/functions/interface'
import { getLocalStorageItem } from '@global/functions/localStorage'
import { notify } from '@global/functions/showToast'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Settings: React.FC = (): JSX.Element => {
  const token = getLocalStorageItem({ key: 'rdbToken', defaultValue: '' })

  const [checked, setChecked] = React.useState(false as boolean)
  const [settings, setSettings] = React.useState({} as Settings)

  React.useEffect(() => {
    getRDBSettings({ token: token }).then((res) => {
      setSettings(res)
      setChecked(!res.opt)
    }).catch((err: Error) => {
      console.log(err)
      notify({ message: err.message, type: 'error' })
    })
  }, [token]) // using notify as a dependency causes an infinite loop

  function saveSettings(): void {
    setRDBSettings({ settings: { opt: !checked }, token: token }).then((res: Response) => {
      if (res.ok) {
        notify({ message: 'Settings successfully saved', type: 'success' })
      } else {
        notify({ message: 'An unknown error has occurred', type: 'error' })
      }
    }).catch((err: Error) => {
      console.log(err)
      notify({ message: err.message, type: 'error' })
    })
  }

  return (
    <div className='flex flex-col md:w-2/3 w-full h-full'>
      {settings.DiscordID && (
        <>
          <h1 className='text-3xl font-bold mb-4'>Settings</h1>
          <div className='flex flex-col gap-4 h-screen'>
            <Toggle onChange={setChecked} checked={checked} label='Let people review me' />
          </div>
          <button className='flex button justify-center items-center lg:w-1/3' onClick={saveSettings}>Save Settings</button>
        </>
      )}
      <ToastContainer />
    </div>
  )
}

export default Settings
