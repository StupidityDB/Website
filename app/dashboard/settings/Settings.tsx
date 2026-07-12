import Toggle from '@global/app/dashboard/settings/Toggle'
import { getRDBSettings, setRDBSettings } from '@global/functions/RDBAPI'
import type { Settings } from '@global/functions/interface'
import { getCookieItem } from '@global/functions/cookieUtils'
import { notify } from '@global/functions/showToast'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Settings: React.FC = (): JSX.Element => {
  const token = getCookieItem({ key: 'rdbToken', defaultValue: '' })

  const [checked, setChecked] = React.useState(false as boolean)
  const [saving, setSaving] = React.useState(false)
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
    setSaving(true)
    setRDBSettings({ settings: { opt: !checked }, token: token }).then((res: Response) => {
      if (res.ok) {
        notify({ message: 'Settings successfully saved', type: 'success' })
      } else {
        notify({ message: 'An unknown error has occurred', type: 'error' })
      }
    }).catch((err: Error) => {
      console.log(err)
      notify({ message: err.message, type: 'error' })
    }).finally(() => setSaving(false))
  }

  return (
    <div className='flex flex-col gap-6 w-full max-w-2xl mx-auto'>
      {settings.DiscordID && (
        <>
          <div className='flex flex-col gap-1.5'>
            <h1 className='text-2xl sm:text-3xl gg-bold text-white'>Settings</h1>
            <p className='text-sm sm:text-base text-slate-400 gg-normal'>Control how ReviewDB works on your profile.</p>
          </div>

          <div className='card flex flex-col divide-y divide-white/5'>
            <div className='flex items-center justify-between gap-4 p-5'>
              <div className='flex flex-col gap-1 min-w-0'>
                <span className='gg-semibold text-slate-100'>Let people review me</span>
                <span className='text-sm text-slate-400 gg-normal'>When disabled, your profile is opted out and nobody can leave new reviews on it.</span>
              </div>
              <Toggle onChange={setChecked} checked={checked} />
            </div>
            <div className='flex justify-end p-4'>
              <button className='button text-sm' onClick={saveSettings} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  )
}

export default Settings
