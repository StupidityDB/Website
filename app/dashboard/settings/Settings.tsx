"use client"

import { getRDBSettings, setRDBSettings } from '@global/functions/RDBAPI';
import { Settings } from '@global/functions/interface';
import { getLocalStorageItem } from '@global/functions/localStorage';
import React, { useEffect, useState } from 'react'
import Switch from "react-switch";

const Settings: React.FC = (): JSX.Element => {
  const token = getLocalStorageItem({ key: 'rdbToken', defaultValue: '' })

  const [checked, setChecked] = React.useState(false);
  const [settings, setSettings] = React.useState({} as Settings);

  useEffect(() => {
    getRDBSettings(token).then((res) => {
      setSettings(res)
      setChecked(res.opt)
    }).catch((err: Error) => {
      console.log(err)
    })

  }, [token])

  function saveSettings(): void {
    setRDBSettings({ opt: checked }, token).catch((err: Error) => {
      console.log(err)
    }) // TODO error handling
  }

  //TODO DESIGN I SUCK AT IT
  return (
      <div className='flex flex-col md:w-2/3 w-full h-full'>
        <div className='flex h-screen'>
          <span className='text-center h-full mr-2	'>Let people review me</span>
          <Switch onChange={setChecked} checked={checked} />
        </div>
          <button className='flex button justify-center items-center' onClick={saveSettings}>Save Settings</button>
      </div>
  )
}

export default Settings
