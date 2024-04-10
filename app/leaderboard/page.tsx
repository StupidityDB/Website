import React from 'react'
import { getLeaderboard } from '../../functions/RDBAPI'
import Image from 'next/image'

export default async function Leaderboard(): Promise<JSX.Element> {

  let leaderboard = await getLeaderboard()

  return (
    <div className='flex overflow-auto overflow-x-hidden scrollbarStyle'>
      <table className='w-full'>
        <thead>
          <tr className='text-left'>
            <th>Rank</th>
            <th>Profile Photo</th>
            <th>Username</th>
            <th>Review Count</th>
          </tr>
        </thead>
        <tbody>
          {
            leaderboard.map((user, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td><Image src={user.avatar_url} className='rounded-full' width={48} height={48} alt={`Profile Photo of ${user.username}`} /></td>
                  <td>{user.username}</td>
                  <td>{user.review_count}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}
