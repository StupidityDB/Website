"use client"

import { getRdbUser } from '@global/functions/RDBAPI'
import { clearLocalStorage, getLocalStorageItem } from '@global/functions/localStorage'
import { useAlert } from '@global/hooks/useAlert'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import AlertPopup from './AlertPopup'

const TopBar: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<any>(null)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

  const { showAlert, showAlertWithMessage, handleAlertClose, alertOptions } = useAlert()

  return (
    <>
      {
        user && (
          <>
            {showAlert && (
              <AlertPopup
                message={alertOptions.message}
                type={alertOptions.type}
                timeout={alertOptions.timeout}
                onClose={handleAlertClose}
              />
            )}
            <div className='flex justify-between items-center sectionBackground px-4 py-2 rounded-xl z-40'>
              <Link href='/'><Image src='/logo.png' alt='StupidityDB Logo' width={45} height={45} className='mr-2' draggable='false' /></Link>
              <div className='relative'>
                <button onClick={toggleDropdown} className='flex items-center'>
                  <p className='mr-2 md:text-lg text-md text-slate-100 font-semibold'>{user['username'] || 'username#0000'}</p>
                  <Image src={user['profilePhoto'] || '/defaultAvatar.png'} alt='User Avatar' width={45} height={45} className='rounded-full' draggable='false' />
                </button>
                {dropdownVisible && (
                  <div ref={dropdownRef} className='absolute right-0 mt-2 w-48 bg-white text-slate-100 border border-slate-100 rounded shadow-md'>
                    <button className='block w-full text-left px-4 py-2 rounded text-sm text-red-600 hover:bg-red-600 hover:text-slate-100' onClick={() => {
                      clearLocalStorage({ fallback: 'rdbToken' }).then((res): boolean => {
                        if (res) {
                          setUser(null)
                          showAlertWithMessage({ message: 'Successfully logged out!', type: 'success', timeout: 3000 })
                          setTimeout(() => location.reload(), 500)
                        } else {
                          showAlertWithMessage({ message: 'Error clearing localStorage! Cleared token instead.', type: 'error', timeout: 3000 })
                        }
                        return res
                      })
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
