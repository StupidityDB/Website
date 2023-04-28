// Import required components and utilities
import Toggle from '@global/app/dashboard/settings/Toggle'
import { getRDBSettings, setRDBSettings } from '@global/functions/RDBAPI'
import { Settings } from '@global/functions/interface'
import { getLocalStorageItem } from '@global/functions/localStorage'
import { notify } from '@global/functions/showToast'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Default settings object
const defaultSettings: Settings = {
  DiscordID: null,
  opt: false,
}

// Settings component
const Settings: React.FC = (): JSX.Element => {
  // Retrieve the token from local storage
  const token = getLocalStorageItem({ key: 'rdbToken', defaultValue: '' })

  // State to store settings
  const [settings, setSettings] = React.useState(defaultSettings)

  // Fetch settings on component mount
  React.useEffect(() => {
    getRDBSettings({ token: token })
      .then((res) => {
        setSettings(res)
      })
      .catch((err: Error) => {
        console.log(err)
        notify({ message: err.message, type: 'error' })
      })
  }, [token])

  // Handle the change of the toggle input
  function handleToggleChange(key: keyof Settings, value: boolean): void {
    setSettings({ ...settings, [key]: value })
  }

  // Save settings when the save button is clicked
  function saveSettings(): void {
    setRDBSettings({ settings, token: token })
      .then((res: Response) => {
        if (res.ok) {
          notify({ message: 'Settings saved', type: 'success' })
        }
      })
      .catch((err: Error) => {
        console.log(err)
        notify({ message: err.message, type: 'error' })
      })
  }

  // Render the settings component
  return (
    <div className="flex flex-col md:w-2/3 w-full h-full">
      {settings.DiscordID && (
        <>
          <h1 className="text-3xl font-bold mb-4">Settings</h1>
          <div className="flex flex-col gap-4 h-screen">
            <Toggle
              onChange={(value) => handleToggleChange('opt', value)}
              checked={settings.opt}
              label="Let people review me"
            />
          </div>
          <button className="flex button justify-center items-center lg:w-1/3" onClick={saveSettings}>
            Save Settings
          </button>
        </>
      )}
      <ToastContainer />
    </div>
  )
}

// Export the Settings component
export default Settings
