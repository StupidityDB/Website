'use client'

import { getRdbUser } from '@global/functions/RDBAPI'
import { GetUser } from '@global/functions/interface'
import { clearCookies, getCookieItem, setCookieItem } from '@global/functions/cookieUtils'
import { IoSettingsOutline } from 'react-icons/io5'
import { HiMenu, HiX } from 'react-icons/hi'
import { FaDiscord, FaUser, FaGavel, FaSignOutAlt } from 'react-icons/fa'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

const DISCORD_LOGIN_URL = 'https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2Fapi%2Freviewdb%2Fauthweb&response_type=code&scope=identify'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/download', label: 'Download' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/discord', label: 'Discord' },
]

const TopBar: React.FC = (): JSX.Element => {
  const pathname = usePathname()
  const [user, setUser] = React.useState<GetUser | null>(null)
  const [dropdownVisible, setDropdownVisible] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const token = getCookieItem({ key: 'rdbToken', defaultValue: null }) as string | null

    if (token) {
      getRdbUser({ token: token }).then((user) => {
        setUser(user)
        setCookieItem({ key: 'rdbUserInfo', value: JSON.stringify(user) })
      })
    } else {
      setUser(null)
    }
  }, [])

  // Close menus on navigation
  React.useEffect(() => {
    setDropdownVisible(false)
    setMobileMenuOpen(false)
  }, [pathname])

  // Hide dropdown when clicking outside of it (ref wraps trigger + menu)
  React.useEffect(() => {
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

  const handleLogout = (): void => {
    clearCookies().then(() => {
      location.reload()
    }).catch((err: Error) => {
      console.log(err)
      if (confirm('An error occurred while logging out. Would you like to reload anyway?')) {
        location.reload()
      }
    })
  }

  const getUserRole = (type: number): JSX.Element => {
    switch (type) {
    case -1:
      return <span className='text-red-500'>Banned</span>
    case 0:
      return <span className='text-slate-400'>User</span>
    case 1:
      return <span className='text-sky-400'>Admin</span>
    case 2:
      return <span className='text-sky-300'>Moderator</span>
    default:
      return <span className='text-slate-400'>Unknown</span>
    }
  }

  const isActive = (href: string): boolean =>
    href === '/dashboard' ? (pathname === '/dashboard' || pathname === '/') : pathname.startsWith(href)

  return (
    <header className='flex-shrink-0 z-40 border-b border-white/5 bg-surface-1/85 backdrop-blur-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3'>

        {/* Brand */}
        <Link href='/' className='flex items-center gap-2.5 flex-shrink-0 group'>
          <Image src='/logo.png' alt='ReviewDB Logo' width={36} height={36} className='rounded-lg' draggable='false' />
          <span className='text-lg gg-bold text-white tracking-tight group-hover:text-slate-200 transition-colors'>ReviewDB</span>
        </Link>

        {/* Desktop navigation */}
        <nav className='hidden md:flex items-center gap-1 ml-4'>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={`navLink ${isActive(href) ? 'navLinkActive' : ''}`}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side: profile / login */}
        <div className='flex items-center gap-2 ml-auto'>
          {user ? (
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setDropdownVisible(v => !v)}
                className='flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors'
              >
                <div className='hidden sm:flex flex-col text-right leading-tight'>
                  <span className='text-sm gg-semibold text-slate-100'>{user.username || 'username'}</span>
                  <span className='text-xs gg-normal'>{getUserRole(user.type)}</span>
                </div>
                <Image src={user.profilePhoto || '/defaultAvatar.png'} alt='User Avatar' width={36} height={36} className='rounded-full' draggable='false' />
              </button>

              {dropdownVisible && (
                <div className='absolute right-0 mt-2 w-52 card p-1.5 z-50 animate-dialog-in'>
                  <Link href='/dashboard/me' className='flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 hover:text-white transition-colors'>
                    <FaUser size={13} className='text-slate-400' />
                    My Profile
                  </Link>
                  <Link href='/dashboard/settings' className='flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 hover:text-white transition-colors'>
                    <IoSettingsOutline size={14} className='text-slate-400' />
                    Settings
                  </Link>
                  <Link href='/dashboard/appeal' className='flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 hover:text-white transition-colors'>
                    <FaGavel size={13} className='text-slate-400' />
                    Appeal Ban
                  </Link>
                  <div className='h-px bg-white/5 my-1.5 mx-2' />
                  <button
                    className='flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors'
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt size={13} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className='flex items-center gap-3 select-none'>
              <span className='hidden lg:block text-slate-500 text-xs gg-normal italic'>
                No brain wrinkles?
              </span>
              <a href={DISCORD_LOGIN_URL} className='button !py-2 text-sm'>
                <FaDiscord size={16} />
                <span>Login</span>
              </a>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className='md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors'
            onClick={() => setMobileMenuOpen(open => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <nav className='md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-1 bg-surface-1/95 backdrop-blur-md animate-fade-in'>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={`navLink !py-2.5 ${isActive(href) ? 'navLinkActive' : ''}`}>
              {label}
            </Link>
          ))}
          {user && (
            <>
              <div className='h-px bg-white/5 my-1' />
              <Link href='/dashboard/me' className='navLink !py-2.5'>My Profile</Link>
              <Link href='/dashboard/settings' className='navLink !py-2.5'>Settings</Link>
              <Link href='/dashboard/appeal' className='navLink !py-2.5'>Appeal Ban</Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}

export default TopBar
