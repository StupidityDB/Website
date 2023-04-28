"use client"

import { getRdbUser } from '@global/functions/RDBAPI'
import { clearLocalStorage, getLocalStorageItem } from '@global/functions/localStorage'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const TopBar: React.FC = (): JSX.Element => {
  const [user, setUser] = React.useState<any>(null)
  const [dropdownVisible, setDropdownVisible] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const token = getLocalStorageItem({ key: 'rdbToken', defaultValue: null }) as string | null

    if (token) {
      getRdbUser({ token: token }).then((user) => {
        setUser(user)
      })
    } else {
      setUser(null)
    }

    // Hide dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible)
  }

  return (
    <>
      {
        user && (
          <>
            <div className='flex justify-between items-center sectionBackground px-4 py-2 rounded-xl z-50'>
              <Link href='/'><Image src='/logo.png' alt='StupidityDB Logo' width={45} height={45} className='mr-2' draggable='false' /></Link>
              <div className='relative'>
                <button onClick={toggleDropdown} className='flex items-center'>
                  <p className='mr-2 md:text-lg text-md text-slate-100 font-semibold'>{user['username'] || 'username#0000'}</p>
                  <Image src={user['profilePhoto'] || '/defaultAvatar.png'} alt='User Avatar' width={45} height={45} className='rounded-full' draggable='false' />
                </button>
                {dropdownVisible && (
                  <div ref={dropdownRef} className='absolute right-0 mt-2 w-48 bg-white text-slate-100 border border-slate-100 rounded shadow-md'>
                    <Link href={`/dashboard${location.pathname.includes('/settings') ? '' : '/settings'}`}>
                      <button className='block w-full text-left px-4 py-2 rounded text-sm text-sky-600 hover:bg-sky-600 hover:text-slate-100'>
                        {location.pathname.includes('/settings') ? 'Dashboard' : 'Settings'}
                      </button>
                    </Link>
                    <button className='block w-full text-left px-4 py-2 rounded text-sm text-red-600 hover:bg-red-600 hover:text-slate-100' onClick={() => {
                      clearLocalStorage({ fallback: 'rdbToken' })
                    }}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) || (
          <div className='flex justify-between items-center sectionBackground px-4 py-2 rounded-xl'>
            <Link href='/'><Image src='/logo.png' alt='StupidityDB Logo' width={45} height={45} className='mr-2' draggable='false' /></Link>
            <div className='flex items-center'>
              <p className='mr-2 md:text-lg text-md text-slate-100 font-semibold'>No brain wrinkles?</p>
            </div>
          </div>
        )
      }
    </>
  )
}

export default TopBar
