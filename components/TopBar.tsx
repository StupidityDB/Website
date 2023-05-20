'use client'

import { getRdbUser } from '@global/functions/RDBAPI'
import { GetUser } from '@global/functions/interface'
import { clearCookies, getCookieItem, setCookieItem } from '@global/functions/cookieUtils'
import { IoSettingsOutline } from 'react-icons/io5'
import { MdDashboard } from 'react-icons/md'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const TopBar: React.FC = (): JSX.Element => {
  const [user, setUser] = React.useState<GetUser | null>(null)
  const [dropdownVisible, setDropdownVisible] = React.useState(false)
  const [buttonState, setButtonState] = React.useState('dashboard')

  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      setButtonState('dashboard')
    } else {
      setButtonState('me')
    }

    const token = getCookieItem({ key: 'rdbToken', defaultValue: null }) as string | null

    if (token) {
      getRdbUser({ token: token }).then((user) => {
        setUser(user)
        setCookieItem({ key: 'rdbUserInfo', value: JSON.stringify(user) })
      })
    } else {
      setUser(null)
    }

    // Hide dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = (): void => {
    setDropdownVisible(!dropdownVisible)
  }

  const getUserRole = (type: number): JSX.Element | string => {
    switch (type) {
    case -1:
      return <span className='text-red-600'>Banned</span>
    case 0:
      return <span className='text-slate-400'>User</span>
    case 1:
      return <span className='text-sky-500'>Admin</span>
    default:
      return 'Unknown'
    }
  }

  return (
    <>
      {
        user && (
          <>
            <div className='flex items-center sectionBackground px-4 py-2 rounded-xl z-50'>
              <Link href='/'><Image src='/logo.png' alt='StupidityDB Logo' width={45} height={45} className='mr-2' draggable='false' /></Link>
              <div className='md:flex items-center justify-center hidden'>
                <Link href='/dashboard' className='text-slate-100 m-3 hover:underline'>Dashboard</Link>
                <Link href='/discord' className='text-slate-100 m-3 hover:underline'>Discord</Link>
                <Link href='/dashboard/appeal' className='text-slate-100 m-3 hover:underline'>Appeal Ban</Link>
                <Link href='/dashboard/settings' className='text-slate-100 m-3 hover:underline'>Settings</Link>
                <Link href='/download' className='text-slate-100 m-3 hover:underline'>Download</Link>
              </div>

              <div className='flex items-center ml-auto'>
                <div className='relative'>
                  <button onClick={toggleDropdown} className='flex items-center'>
                    <div className='flex flex-col'>
                      <p className='mr-2 md:text-lg text-md text-slate-100 gg-semibold'>{user['username'] || 'username#0000'}</p>
                      <p className='text-sm gg-normal'>{getUserRole(user.type)}</p>
                    </div>
                    <Image src={user['profilePhoto'] || '/defaultAvatar.png'} alt='User Avatar' width={45} height={45} className='rounded-full' draggable='false' />
                  </button>
                  {dropdownVisible && (
                    <div ref={dropdownRef} className='absolute right-0 mt-2 w-48 bg-white text-slate-100 border border-slate-100 rounded shadow-md'>
                      {location.pathname !== '/dashboard/me' ? (
                        <Link href='/dashboard/me' onClick={() => setButtonState('me')}>
                          <button className='block w-full text-left px-4 py-2 rounded text-sm text-sky-600 hover:bg-sky-600 hover:text-slate-100'>
                            My profile
                          </button>
                        </Link>
                      ) : (
                        <Link href='/dashboard/settings'>
                          <button className='block w-full text-left px-4 py-2 rounded text-sm text-sky-600 hover:bg-sky-600 hover:text-slate-100'>
                            Settings
                          </button>
                        </Link>
                      )}
                      <button className='block w-full text-left px-4 py-2 rounded gg-normal text-sm text-red-600 hover:bg-red-600 hover:text-slate-100' onClick={() => {
                        clearCookies().then(() => {
                          location.reload()
                        }).catch((err: Error) => {
                          console.log(err)
                          if (confirm('An error occurred while logging out. Would you like to reload anyway?')) {
                            location.reload()
                          }
                        })
                      }}>
                      Logout
                      </button>
                    </div>
                  )}
                </div>
                {buttonState === 'me' ? (
                  <Link href='/dashboard' title='User Dashboard' onClick={() => setButtonState('dashboard')}><MdDashboard className='ml-2 text-slate-200 text-2xl hover:animate-pulse' /></Link>
                ) : (
                  <Link href='/dashboard/settings' title='User Settings' onClick={() => setButtonState('me')}><IoSettingsOutline className='ml-2 text-slate-200 text-2xl hover:animate-spin' /></Link>
                )}
              </div>
            </div>
          </>
        ) || (
          <div className='flex justify-between items-center sectionBackground px-4 py-2 rounded-xl'>
            <Link href='/'><Image src='/logo.png' alt='StupidityDB Logo' width={45} height={45} className='mr-2' draggable='false' /></Link>
            <div className='flex items-center'>
              <p className='mr-2 md:text-lg text-md text-slate-100 gg-semibold'>No brain wrinkles?</p>
            </div>
          </div>
        )
      }
    </>
  )
}

export default TopBar
