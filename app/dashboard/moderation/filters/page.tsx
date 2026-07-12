'use client'

import React from 'react'
import Link from 'next/link'
import { AdminFilters, getAdminFilters, updateAdminFilter } from '@global/functions/RDBAPI'
import { getCookieItem } from '@global/functions/cookieUtils'
import { notify } from '@global/functions/showToast'
import { ToastContainer } from 'react-toastify'

type FilterType = 'profane' | 'lightProfane' | 'ban'
const groups: { type: FilterType; title: string; key: keyof AdminFilters }[] = [
  { type: 'profane', title: 'Profane words', key: 'profaneWords' },
  { type: 'lightProfane', title: 'Light-profanity words', key: 'lightProfaneWords' },
  { type: 'ban', title: 'Auto-ban words', key: 'banWords' },
]

const FiltersPage = (): JSX.Element => {
  const token = getCookieItem({ key: 'rdbToken', defaultValue: '' })
  const [filters, setFilters] = React.useState<AdminFilters | null>(null)
  const [words, setWords] = React.useState<Record<FilterType, string>>({ profane: '', lightProfane: '', ban: '' })
  const load = (): void => { getAdminFilters({ token }).then(setFilters) }
  React.useEffect(load, [token])
  const add = async (type: FilterType): Promise<void> => { const word = words[type].trim(); if (!word) return; if (await updateAdminFilter({ word, type, token })) { setWords({ ...words, [type]: '' }); load() } else notify({ message: 'Unable to add word.', type: 'error' }) }
  const remove = async (word: string, type: FilterType): Promise<void> => { if (await updateAdminFilter({ word, type, remove: true, token })) load(); else notify({ message: 'Unable to remove word.', type: 'error' }) }
  return <main className='flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6'><Link href='/dashboard/moderation' className='link text-sm'>Moderation home</Link><h1 className='text-2xl gg-bold text-white mt-4 mb-5'>Word filters</h1><div className='grid lg:grid-cols-3 gap-4'>{groups.map(group => <section key={group.type} className='card p-4'><h2 className='gg-semibold text-slate-100'>{group.title}</h2><div className='flex gap-2 my-3'><input value={words[group.type]} onChange={event => setWords({ ...words, [group.type]: event.target.value })} onKeyDown={event => event.key === 'Enter' && add(group.type)} placeholder='Add word' className='min-w-0 flex-1 bg-surface-3 border border-white/10 rounded px-2 py-1.5 text-sm text-slate-100' /><button onClick={() => { void add(group.type) }} className='button !py-1.5 text-sm'>Add</button></div><div className='flex flex-wrap gap-2'>{filters?.[group.key]?.map(word => <button key={word} onClick={() => { void remove(word, group.type) }} title='Remove word' className='px-2 py-1 text-xs rounded bg-white/5 text-slate-300 hover:bg-red-500/20 hover:text-red-300'>{word} ×</button>)}</div></section>)}</div><ToastContainer /></main>
}
export default FiltersPage
