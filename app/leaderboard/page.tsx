import React from 'react'
import { getLeaderboard } from '../../functions/RDBAPI'
import Image from 'next/image'
import Link from 'next/link'

const rankStyles: Record<number, string> = {
  0: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  1: 'bg-slate-400/15 text-slate-300 border-slate-400/30',
  2: 'bg-amber-700/20 text-amber-500 border-amber-600/30',
}

export default async function Leaderboard(): Promise<JSX.Element> {
  const leaderboard = await getLeaderboard()

  return (
    <div className='flex flex-col gap-6 w-full max-w-3xl mx-auto'>
      <div className='flex flex-col gap-1.5'>
        <h1 className='text-2xl sm:text-3xl gg-bold text-white'>Leaderboard</h1>
        <p className='text-sm sm:text-base text-slate-400 gg-normal'>Most reviewed users on ReviewDB.</p>
      </div>

      <ol className='flex flex-col gap-2 pb-2'>
        {leaderboard.map((user, index) => (
          <li key={user.discord_id || index}>
            <Link
              href={`/users/${user.discord_id}`}
              className='card flex items-center gap-3 sm:gap-4 px-3.5 sm:px-5 py-3 hover:border-blurple/40 hover:bg-surface-3 transition-colors'
            >
              <span className={`flex items-center justify-center w-9 h-9 rounded-lg border text-sm gg-bold tabular-nums flex-shrink-0 ${rankStyles[index] ?? 'bg-surface-0/60 text-slate-400 border-white/5'}`}>
                {index + 1}
              </span>
              <Image src={user.avatar_url} className='rounded-full flex-shrink-0' width={44} height={44} alt={`Profile photo of ${user.username}`} unoptimized />
              <span className='text-sm sm:text-base gg-semibold text-slate-100 truncate flex-1'>{user.username}</span>
              <span className='flex flex-col items-end flex-shrink-0'>
                <span className='text-base sm:text-lg gg-bold text-white tabular-nums'>{user.review_count}</span>
                <span className='text-[11px] uppercase tracking-wider text-slate-500 gg-semibold'>received</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
