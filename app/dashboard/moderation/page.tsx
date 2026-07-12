'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaFlag, FaIdBadge, FaSearch, FaShieldAlt } from 'react-icons/fa'
import { getCookieItem } from '@global/functions/cookieUtils'

const ModerationHome = (): JSX.Element => {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [authorized, setAuthorized] = React.useState(false)

  React.useEffect(() => {
    setAuthorized(JSON.parse(getCookieItem({ key: 'rdbUserInfo', defaultValue: '{}' })).type === 1)
  }, [])

  if (!authorized) return <div className='p-8 text-slate-300'>This page is only available to ReviewDB administrators.</div>

  const inspect = (): void => {
    if (query.trim()) router.push(`/dashboard/moderation/users/${query.trim()}`)
  }

  const tools = [
    { href: '/dashboard/moderation/reports', title: 'Reports queue', description: 'Review recent reports and take action on reported reviews.', icon: <FaFlag /> },
    { href: '/dashboard/moderation/badges', title: 'Badge management', description: 'Create, review, and revoke profile badges.', icon: <FaIdBadge /> },
    { href: '/dashboard/moderation/filters', title: 'Word filters', description: 'Manage profanity, light-profanity, and auto-ban word lists.', icon: <FaShieldAlt /> },
  ]

  return <main className='flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6'>
    <h1 className='text-2xl gg-bold text-white'>Moderation</h1>
    <p className='text-sm text-slate-400 mt-1 mb-6'>Choose a tool or inspect an account.</p>
    <div className='card p-4 mb-6 flex flex-col sm:flex-row gap-3'>
      <input value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => event.key === 'Enter' && inspect()} placeholder='Discord ID or ReviewDB user ID' className='flex-1 bg-surface-3 border border-white/10 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-blurple' />
      <button onClick={inspect} className='button w-full sm:w-auto justify-center'><FaSearch />Inspect user</button>
    </div>
    <div className='grid sm:grid-cols-3 gap-4'>{tools.map(tool => <Link key={tool.href} href={tool.href} className='card p-5 hover:bg-white/5 transition-colors'>
      <span className='text-blurple text-xl'>{tool.icon}</span><h2 className='mt-3 text-base gg-semibold text-white'>{tool.title}</h2><p className='mt-1 text-sm text-slate-400'>{tool.description}</p>
    </Link>)}</div>
  </main>
}

export default ModerationHome
