'use client'

import React from 'react'
import Link from 'next/link'
import { AdminBadge, addAdminBadge, deleteAdminBadge, getAdminBadges } from '@global/functions/RDBAPI'
import { getCookieItem } from '@global/functions/cookieUtils'
import { notify } from '@global/functions/showToast'
import { ToastContainer } from 'react-toastify'

const emptyBadge = { targetDiscordID: '', name: '', icon: '', redirectURL: '', type: 0, description: '' }

const BadgesPage = (): JSX.Element => {
  const token = getCookieItem({ key: 'rdbToken', defaultValue: '' })
  const [badges, setBadges] = React.useState<AdminBadge[]>([])
  const [badge, setBadge] = React.useState(emptyBadge)
  const load = (): void => { getAdminBadges({ token }).then(setBadges) }
  React.useEffect(load, [token])
  const add = async (event: React.FormEvent): Promise<void> => { event.preventDefault(); if (await addAdminBadge({ badge, token })) { setBadge(emptyBadge); load() } else notify({ message: 'Unable to add badge.', type: 'error' }) }
  const remove = async (id: number): Promise<void> => { if (await deleteAdminBadge({ id, token })) setBadges(current => current.filter(item => item.id !== id)); else notify({ message: 'Unable to delete badge.', type: 'error' }) }
  return <main className='flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6'><Link href='/dashboard/moderation' className='link text-sm'>Moderation home</Link><h1 className='text-2xl gg-bold text-white mt-4'>Badge management</h1><form onSubmit={add} className='card p-4 grid sm:grid-cols-2 gap-3 my-5'>{Object.entries(badge).filter(([key]) => key !== 'type').map(([key, value]) => <input key={key} required={key !== 'redirectURL'} value={value} onChange={event => setBadge({ ...badge, [key]: event.target.value })} placeholder={key} className='bg-surface-3 border border-white/10 rounded px-3 py-2 text-slate-100' />)}<input type='number' value={badge.type} onChange={event => setBadge({ ...badge, type: Number(event.target.value) })} placeholder='type' className='bg-surface-3 border border-white/10 rounded px-3 py-2 text-slate-100' /><button className='button'>Add badge</button></form><section className='card overflow-hidden'>{badges.map(item => <div key={item.id} className='p-3 border-b border-white/5 flex items-center gap-3'><img src={item.icon} alt='' className='w-7 h-7 object-contain' /><div className='flex-1'><p className='text-slate-100'>{item.name}</p><p className='text-xs text-slate-400'>{item.targetDiscordID} · {item.description}</p></div><button onClick={() => { void remove(item.id) }} className='text-red-400 text-sm'>Delete</button></div>)}</section><ToastContainer /></main>
}
export default BadgesPage
