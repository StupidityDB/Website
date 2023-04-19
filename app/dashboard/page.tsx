"use client"

import { getLocalStorageItem } from '@global/functions/localStorage'

import React from 'react'
import Dashboard from '@global/app/dashboard/Dashboard'
import LoginFields from '@global/app/dashboard/LoginFields'

const Home = () => {
  const [loggedIn, setLoggedIn] = React.useState(false)

  React.useEffect(() => {
    const token = getLocalStorageItem({ key: 'rdbToken', defaultValue: null })
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
