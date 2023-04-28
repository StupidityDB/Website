'use client'

import { getLocalStorageItem } from '@global/functions/localStorage'

import Settings from '@global/app/dashboard/settings/Settings'
import LoginFields from '@global/app/dashboard/LoginFields'
import React from 'react'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Home = () => {
  const [loggedIn, setLoggedIn] = React.useState(false)

  React.useEffect(() => {
    const token = getLocalStorageItem({ key: 'rdbToken', defaultValue: null }) as string | null
    if (token) {
      setLoggedIn(true)
    }
  }, [])

  return (
    <>
      {loggedIn ? (
        <Settings />
      ) : (
        <LoginFields />
      )}
    </>
  )
}

export default Home
