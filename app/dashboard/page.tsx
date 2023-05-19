'use client'

import { getCookieItem } from '@global/functions/cookieUtils'

import Dashboard from '@global/app/dashboard/Dashboard'
import LoginFields from '@global/app/dashboard/LoginFields'
import React from 'react'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Home = () => {
  const [loggedIn, setLoggedIn] = React.useState(false)

  React.useEffect(() => {
    const token = getCookieItem({ key: 'rdbToken', defaultValue: null }) as string | null
    if (token) {
      setLoggedIn(true)
    }
  }, [])

  return (
    <>
      {loggedIn ? (
        <Dashboard />
      ) : (
        <LoginFields />
      )}
    </>
  )
}

export default Home
