'use client'

import React from 'react'
import Link from 'next/link'
import { FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa'
import { AdminReport, banAdminUser, deleteReview, dismissAdminReports, getAdminReports } from '@global/functions/RDBAPI'
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
  const [bulkBanDays, setBulkBanDays] = React.useState<1 | 3 | 7 | 30>(1)
  const [selected, setSelected] = React.useState<number[]>([])

  React.useEffect(() => {
    setLoading(true)
    getAdminReports({ token, limit: PAGE_SIZE, offset: page * PAGE_SIZE }).then(next => { setReports(next); setSelected([]) }).finally(() => setLoading(false))
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

  const dismiss = async (reportIDs: number[]): Promise<void> => {
    if (!await dismissAdminReports({ reportIDs, token })) {
      notify({ message: 'Unable to dismiss reports.', type: 'error' })
      return
    }
    setReports(current => current.filter(report => !reportIDs.includes(report.id)))
    setSelected(current => current.filter(id => !reportIDs.includes(id)))
    notify({ message: reportIDs.length === 1 ? 'Report dismissed.' : `${reportIDs.length} reports dismissed.`, type: 'success' })
  }

  const toggleSelected = (id: number): void => {
    setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id])
  }

  const toggleAll = (): void => {
    setSelected(current => current.length === reports.length ? [] : reports.map(report => report.id))
  }

  const applyBulkAction = async (action: 'delete' | 'deleteAndBan'): Promise<void> => {
    const targets = reports.filter(report => selected.includes(report.id) && !report.review.missing)
    const completed: number[] = []
    for (const report of targets) {
      if (action === 'deleteAndBan') {
        const banResult = await banAdminUser({ id: report.review.sender.discordID, reviewID: report.review.id, days: bulkBanDays, token })
        if (!banResult?.success) continue
      }
      const deleteResult = await deleteReview({ reviewID: report.review.id, discordID: report.review.sender.discordID, token })
      if (deleteResult?.success) completed.push(report.id)
    }
    if (completed.length > 0) await dismiss(completed)
    if (completed.length !== targets.length) notify({ message: `${targets.length - completed.length} selected review actions failed.`, type: 'error' })
  }

  return <main className='flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6'>
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6'><div><h1 className='text-2xl gg-bold text-white'>Reports queue</h1><p className='text-sm text-slate-400 mt-1'>Recent reports, newest first.</p></div><Link href='/dashboard/moderation' className='link text-sm'>Moderation home</Link></div>
    {reports.length > 0 && <div className='flex items-center gap-2 mb-3 text-sm text-slate-400'><input type='checkbox' checked={selected.length === reports.length} onChange={toggleAll} aria-label='Select all reports on this page' className='h-4 w-4 accent-blurple' />Select all on this page</div>}
    {selected.length > 0 && <div className='card px-4 py-3 mb-3 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2'><span className='text-sm text-slate-300 sm:mr-auto'>{selected.length} selected</span><button onClick={() => { void dismiss(selected) }} className='w-full sm:w-auto px-3 py-2 rounded text-sm bg-slate-700 hover:bg-slate-600 text-white'>Dismiss</button><button onClick={() => { void applyBulkAction('delete') }} className='w-full sm:w-auto px-3 py-2 rounded text-sm bg-red-700 hover:bg-red-600 text-white'>Delete reviews</button><div className='flex gap-2 w-full sm:w-auto'><select value={bulkBanDays} onChange={event => setBulkBanDays(Number(event.target.value) as 1 | 3 | 7 | 30)} className='flex-1 sm:flex-none bg-surface-2 border border-white/10 rounded px-2 py-2 text-sm text-slate-200' aria-label='Bulk ban duration'><option value={1}>1 day</option><option value={3}>3 days</option><option value={7}>1 week</option><option value={30}>1 month</option></select><button onClick={() => { void applyBulkAction('deleteAndBan') }} className='flex-1 sm:flex-none px-3 py-2 rounded text-sm bg-red-600 hover:bg-red-500 text-white'>Delete + ban</button></div></div>}
    <section className='card overflow-hidden'>
      {loading ? <p className='p-5 text-slate-400'>Loading reports…</p> : reports.length === 0 ? <p className='p-5 text-slate-400'>No reports on this page.</p> : reports.map(report => <article key={report.id} className='p-4 border-b border-white/5 last:border-0'>
        <div className='flex gap-3 min-w-0'>
          <input type='checkbox' checked={selected.includes(report.id)} onChange={() => toggleSelected(report.id)} aria-label={`Select report ${report.id}`} className='mt-3 h-4 w-4 flex-shrink-0 accent-blurple' />
          <img src={report.review.sender.profilePhoto || '/defaultAvatar.png'} alt='' className='w-10 h-10 rounded-full object-cover flex-shrink-0' />
          <div className='flex-1 min-w-0'><div className='flex flex-wrap items-center gap-x-2 gap-y-1'><Link href={`/dashboard/moderation/users/${report.review.sender.discordID}`} className='gg-semibold text-slate-100 hover:underline break-all'>{report.review.sender.username || 'Deleted user'}</Link><span className='text-xs text-slate-500'>reported {new Date(report.timestamp).toLocaleString()}</span></div><p className='mt-1 text-slate-200 whitespace-pre-wrap break-words'>{report.review.comment}</p><p className='mt-2 text-xs text-orange-300'>Report #{report.id} from {report.reporter.username} · Review #{report.reviewID}</p></div>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4 sm:hidden'>
          {!report.review.missing && <><Link href={`/dashboard/moderation/users/${report.review.sender.discordID}`} className='rounded-lg bg-white/5 px-3 py-2.5 text-center text-sm text-slate-200'>Inspect author</Link><button onClick={() => { void removeReview(report) }} className='rounded-lg bg-red-500/10 px-3 py-2.5 text-sm text-red-300'>Delete review</button><select value={banDays[report.id] || 1} onChange={event => setBanDays(current => ({ ...current, [report.id]: Number(event.target.value) as 1 | 3 | 7 | 30 }))} className='rounded-lg border border-white/10 bg-surface-2 px-3 py-2.5 text-sm text-slate-200' aria-label='Ban duration'><option value={1}>Ban for 1 day</option><option value={3}>Ban for 3 days</option><option value={7}>Ban for 1 week</option><option value={30}>Ban for 1 month</option></select><button onClick={() => { void deleteAndBan(report) }} className='rounded-lg bg-red-600 px-3 py-2.5 text-sm text-white'>Delete + ban</button></>}
          <button onClick={() => { void dismiss([report.id]) }} className={`${report.review.missing ? 'col-span-2' : ''} rounded-lg bg-slate-700 px-3 py-2.5 text-sm text-slate-200`}>Dismiss report</button>
        </div>
        <div className='hidden sm:flex items-center justify-end gap-1 mt-3'>
          {!report.review.missing && <><Link href={`/dashboard/moderation/users/${report.review.sender.discordID}`} className='px-2 py-1.5 rounded text-xs text-slate-300 hover:bg-white/10'>Author</Link><button onClick={() => { void removeReview(report) }} className='p-1.5 text-red-400 hover:bg-red-500/10 rounded' title='Delete review'><FaTrash size={13} /></button><select value={banDays[report.id] || 1} onChange={event => setBanDays(current => ({ ...current, [report.id]: Number(event.target.value) as 1 | 3 | 7 | 30 }))} className='bg-surface-2 border border-white/10 rounded px-1 py-1.5 text-xs text-slate-200' aria-label='Ban duration'><option value={1}>1d</option><option value={3}>3d</option><option value={7}>7d</option><option value={30}>30d</option></select><button onClick={() => { void deleteAndBan(report) }} className='px-2 py-1.5 rounded text-xs bg-red-600 hover:bg-red-700 text-white'>Delete + ban</button></>}<button onClick={() => { void dismiss([report.id]) }} className='px-2 py-1.5 rounded text-xs text-slate-400 hover:bg-white/10 hover:text-slate-200'>Dismiss</button>
        </div>
      </article>)}
    </section>
    <div className='flex items-center justify-between gap-2 mt-4'><button disabled={page === 0 || loading} onClick={() => setPage(value => value - 1)} className='button !bg-slate-700 disabled:opacity-50 !px-3'><FaChevronLeft /><span className='hidden sm:inline'>Previous</span></button><span className='text-sm text-slate-400 text-center'>Page {page + 1}</span><button disabled={reports.length < PAGE_SIZE || loading} onClick={() => setPage(value => value + 1)} className='button !bg-slate-700 disabled:opacity-50 !px-3'><span className='hidden sm:inline'>Next</span><FaChevronRight /></button></div>
    <ToastContainer />
  </main>
}

export default ReportsPage
