'use client'

import React from 'react'
import Link from 'next/link'
import { FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa'
import { AdminReport, banAdminUser, deleteReview, getAdminReports } from '@global/functions/RDBAPI'
import { getCookieItem } from '@global/functions/cookieUtils'
import { notify } from '@global/functions/showToast'
import { ToastContainer } from 'react-toastify'

const PAGE_SIZE = 20

const ReportsPage = (): JSX.Element => {
  const token = getCookieItem({ key: 'rdbToken', defaultValue: '' })
  const [reports, setReports] = React.useState<AdminReport[]>([])
  const [page, setPage] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [banDays, setBanDays] = React.useState<Record<number, 1 | 3 | 7 | 30>>({})

  React.useEffect(() => {
    setLoading(true)
    getAdminReports({ token, limit: PAGE_SIZE, offset: page * PAGE_SIZE }).then(setReports).finally(() => setLoading(false))
  }, [page, token])

  const removeReview = async (report: AdminReport): Promise<void> => {
    const result = await deleteReview({ reviewID: report.review.id, discordID: report.review.sender.discordID, token })
    if (result?.success) {
      setReports(current => current.filter(item => item.id !== report.id))
      notify({ message: 'Review removed.', type: 'success' })
    } else notify({ message: result?.message || 'Unable to remove review.', type: 'error' })
  }

  const deleteAndBan = async (report: AdminReport): Promise<void> => {
    const banResult = await banAdminUser({ id: report.review.sender.discordID, reviewID: report.review.id, days: banDays[report.id] || 1, token })
    if (!banResult?.success) {
      notify({ message: banResult?.message || 'Unable to ban the author.', type: 'error' })
      return
    }
    const deleteResult = await deleteReview({ reviewID: report.review.id, discordID: report.review.sender.discordID, token })
    if (deleteResult?.success) {
      setReports(current => current.filter(item => item.id !== report.id))
      notify({ message: 'Review removed and author banned.', type: 'success' })
    } else notify({ message: `Author banned, but the review could not be deleted: ${deleteResult?.message || 'unknown error'}`, type: 'error' })
  }

  return <main className='flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6'>
    <div className='flex items-center justify-between mb-6'><div><h1 className='text-2xl gg-bold text-white'>Reports queue</h1><p className='text-sm text-slate-400 mt-1'>Recent reports, newest first.</p></div><Link href='/dashboard/moderation' className='link text-sm'>Moderation home</Link></div>
    <section className='card overflow-hidden'>
      {loading ? <p className='p-5 text-slate-400'>Loading reports…</p> : reports.length === 0 ? <p className='p-5 text-slate-400'>No reports on this page.</p> : reports.map(report => <article key={report.id} className='p-4 border-b border-white/5 last:border-0 flex gap-3'>
        <img src={report.review.sender.profilePhoto || '/defaultAvatar.png'} alt='' className='w-10 h-10 rounded-full object-cover' />
        <div className='flex-1 min-w-0'><div className='flex flex-wrap items-center gap-2'><Link href={`/dashboard/moderation/users/${report.review.sender.discordID}`} className='gg-semibold text-slate-100 hover:underline'>{report.review.sender.username}</Link><span className='text-xs text-slate-500'>reported {new Date(report.timestamp).toLocaleString()}</span></div><p className='mt-1 text-slate-200 whitespace-pre-wrap break-words'>{report.review.comment}</p><p className='mt-2 text-xs text-orange-300'>Report #{report.id} from {report.reporter.username} · Review #{report.reviewID}</p></div>
        {!report.review.missing && <div className='flex items-center gap-1 self-start flex-shrink-0'>
          <Link href={`/dashboard/moderation/users/${report.review.sender.discordID}`} className='px-2 py-1.5 rounded text-xs text-slate-300 hover:bg-white/10'>Author</Link>
          <button onClick={() => { void removeReview(report) }} className='p-1.5 text-red-400 hover:bg-red-500/10 rounded' title='Delete review'><FaTrash size={13} /></button>
          <select value={banDays[report.id] || 1} onChange={event => setBanDays(current => ({ ...current, [report.id]: Number(event.target.value) as 1 | 3 | 7 | 30 }))} className='bg-surface-2 border border-white/10 rounded px-1 py-1.5 text-xs text-slate-200' aria-label='Ban duration'><option value={1}>1d</option><option value={3}>3d</option><option value={7}>7d</option><option value={30}>30d</option></select>
          <button onClick={() => { void deleteAndBan(report) }} className='px-2 py-1.5 rounded text-xs bg-red-600 hover:bg-red-700 text-white'>Delete + ban</button>
        </div>}
      </article>)}
    </section>
    <div className='flex justify-between mt-4'><button disabled={page === 0 || loading} onClick={() => setPage(value => value - 1)} className='button !bg-slate-700 disabled:opacity-50'><FaChevronLeft />Previous</button><span className='text-sm text-slate-400 self-center'>Page {page + 1}</span><button disabled={reports.length < PAGE_SIZE || loading} onClick={() => setPage(value => value + 1)} className='button !bg-slate-700 disabled:opacity-50'>Next<FaChevronRight /></button></div>
    <ToastContainer />
  </main>
}

export default ReportsPage
