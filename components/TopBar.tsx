'use client'

import { getRdbUser } from '@global/functions/RDBAPI'
import { GetUser } from '@global/functions/interface'
import { clearCookies, getCookieItem, setCookieItem } from '@global/functions/cookieUtils'
import { IoSettingsOutline } from 'react-icons/io5'
import { MdDashboard } from 'react-icons/md'
import { FaDiscord } from 'react-icons/fa'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

const TopBar: React.FC = (): JSX.Element => {
  const pathname = usePathname()
  const [user, setUser] = React.useState<GetUser | null>(null)
  const [dropdownVisible, setDropdownVisible] = React.useState(false)
  const [buttonState, setButtonState] = React.useState('dashboard')

  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (pathname === '/dashboard' || pathname === '/') {
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
  }, [pathname])

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
    case 2:
      return <span className='text-sky-300'>Moderator</span>
    default:
      return <span className='text-sky-50'>Unknown</span>
    }
  }

  return (
    <div className='flex items-center sectionBackground px-4 py-2 rounded-xl z-50 w-full'>
      <Link href='/'>
        <Image src='/logo.png' alt='StupidityDB Logo' width={45} height={45} className='mr-2' draggable='false' />
      </Link>
      
      {/* Navigation Links */}
      <div className='flex items-center justify-center md:gap-4 gap-2 text-sm md:text-base ml-4'>
        {user && (
          <div className='md:flex items-center justify-center hidden md:gap-4 gap-2'>
            <Link href='/dashboard' className='text-slate-100 hover:underline'>Dashboard</Link>
            <Link href='/dashboard/settings' className='text-slate-100 hover:underline'>Settings</Link>
            <Link href='/dashboard/appeal' className='text-slate-100 hover:underline'>Appeal Ban</Link>
          </div>
        )}
        <Link href='/download' className='text-slate-100 hover:underline'>Download</Link>
        <Link href='/discord' className='text-slate-100 hover:underline'>Discord</Link>
      </div>

      {/* Profile / Login Area */}
      <div className='flex items-center ml-auto'>
        {user ? (
          <>
            <div className='relative'>
              <button onClick={toggleDropdown} className='flex items-center'>
                <div className='flex flex-col text-right'>
                  <p className='mr-2 md:text-lg text-md text-slate-100 gg-semibold leading-tight'>{user['username'] || 'username#0000'}</p>
                  <p className='text-xs gg-normal leading-tight mt-0.5'>{getUserRole(user.type)}</p>
                </div>
                <Image src={user['profilePhoto'] || '/defaultAvatar.png'} alt='User Avatar' width={45} height={45} className='rounded-full' draggable='false' />
              </button>
              {dropdownVisible && (
                <div ref={dropdownRef} className='absolute right-0 mt-2 w-48 bg-white text-slate-100 border border-slate-100 rounded shadow-md z-[100]'>
                  {pathname !== '/dashboard/me' ? (
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
          </>
        ) : (
          <div className='flex items-center gap-3 select-none'>
            <span className='hidden sm:block text-slate-400 text-xs font-semibold gg-normal italic mr-1'>
              No brain wrinkles?
            </span>
            <a 
              href='https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2Fapi%2Freviewdb%2Fauthweb&response_type=code&scope=identify'
              className='flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] active:bg-[#3c45a5] text-white py-1.5 px-4 rounded-lg text-xs font-bold shadow-md transition duration-150 transform hover:scale-[1.02] cursor-pointer'
            >
              <FaDiscord size={13} />
              <span>Login</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopBar
