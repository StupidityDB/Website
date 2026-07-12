/*
  TODO:
    add pagination to getReviews() and implement it in the frontend
*/

import { AddReview, DeleteReview, GetReviews, GetUser, LeaderboardUser, ReportReview, Review, Settings } from '@global/functions/interface'

export const API_BASE_URL = 'https://manti.vendicated.dev' as string

// functions

export function getRdbUser({ token }: { token: string }): Promise<GetUser> {
  return fetch(`${API_BASE_URL}/api/reviewdb/users`, {
    method: 'POST',
    headers: {},
    body: JSON.stringify({
      token: token,
    }),
  })
    .then((res) => res.json())
    .catch((err: Error) => {
      console.log(err)
      return null
    })
}

export function getReviews({ discordID }: { discordID: string }): Promise<GetReviews> {
  return fetch(`${API_BASE_URL}/api/reviewdb/users/${discordID}/reviews`, {
    method: 'GET',
    headers: {},
  })
    .then((res) => res.json())
    .catch((err: Error) => {
      console.log(err)
      return null
    })
}

// search for reviews: /api/reviewdb/reviews (GET)
export function searchReviews({ token, query }: { token: string; query: string }): Promise<GetReviews> {
  return fetch(`${API_BASE_URL}/api/reviewdb/reviews`, {
    method: 'POST',
    headers: {},
    body: JSON.stringify({
      token: token,
      query: query,
    }),
  })
    .then((res) => res.json())
    .catch((err: Error) => {
      console.log(err)
      return null
    })
}

export function addReview({ discordID, review }: { discordID: string; review: object }): Promise<AddReview> {
  return fetch(`${API_BASE_URL}/api/reviewdb/users/${discordID}/reviews`, {
    method: 'PUT',
    headers: {},
    body: JSON.stringify(review),
  })
    .then((res) => res.json())
    .catch((err: Error) => {
      console.log(err)
      return null
    })
}

export function deleteReview({ reviewID, discordID, token }: { reviewID: number; discordID: string; token: string }): Promise<DeleteReview> {
  return fetch(`${API_BASE_URL}/api/reviewdb/users/${discordID}/reviews`, {
    method: 'DELETE',
    headers: {},
    body: JSON.stringify({
      reviewid: reviewID,
      token: token,
    }),
  })
    .then((res) => res.json())
    .catch((err: Error) => {
      console.log(err)
      return null
    })
}

export function reportReview({ reviewID, token }: { reviewID: number; token: string }): Promise<ReportReview> {
  return fetch(`${API_BASE_URL}/api/reviewdb/reports`, {
    method: 'PUT',
    headers: {},
    body: JSON.stringify({
      reviewid: reviewID,
      token: token,
    }),
  })
    .then((res) => res.json())
    .catch((err: Error) => {
      console.log(err)
      return null
    })
}

/*
  this function is not needed
  user obj returns info needed (type): -1 is perma ban, 0 is normal user, 1 is admin
*/
// export function isAdmin({ currentDiscordID }: { currentDiscordID: string }): Promise<boolean> {
//   return fetch(`${API_BASE_URL}/admins`, {
//     method: 'GET',
//     headers: {},
//   })
//     .then((res) => res.json())
//     .then((admins) => admins.includes(currentDiscordID))
//     .catch((err: Error) => {
//       console.log(err)
//       return false
//     })
// }

export function getRDBSettings({ token }: { token: string }): Promise<Settings> {
  return fetch(`${API_BASE_URL}/api/reviewdb/settings`, {
    method: 'GET',
    headers: {
      'Authorization': token,
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => {
      console.log(err)
      return null
    })
}

export function setRDBSettings({ settings, token }: { settings: {}; token: string }): Promise<Response> {
  return fetch(`${API_BASE_URL}/api/reviewdb/settings`, {
    method: 'PATCH',
    headers: {
      'Authorization': token,
    },
    body: JSON.stringify(settings),
  }) // TODO: check if its successfull
}

export function submitRDBAppeal({ token, appealText }: { token: string; appealText: string }): Promise<Response> {
  return fetch(`${API_BASE_URL}/api/reviewdb/appeals`, {
    method: 'PUT',
    headers: {
      'Authorization': token,
    },
    body: JSON.stringify({
      appealText: appealText,
    }),
  })
}

export function oauthGithub({ code, token }: { code: string, token:string }): Promise<Response> {
  return fetch(`${API_BASE_URL}/api/reviewdb/oauth/github?code=` + code, {
    method: 'POST',
    headers: {
      'Authorization': token
    },
  })
}

export async function getLeaderboard(): Promise<LeaderboardUser[]> {
  return await fetch(`${API_BASE_URL}/api/reviewdb/leaderboard`, {
    method: 'GET',
    headers: {},
  }).then((res) => res.json())
}

export function getUserInfoByID({ discordID }: { discordID: string }): Promise<{
  discordID: string
  username: string
  profilePhoto: string
  badges: any[]
  type: number
  optedOut: boolean
} | null> {
  return fetch(`${API_BASE_URL}/api/reviewdb/users/${discordID}`, {
    method: 'GET',
    headers: {},
  })
    .then((res) => {
      if (res.status === 404) return null
      return res.json()
    })
    .catch((err: Error) => {
      console.log(err)
      return null
    })
}

export function voteReview({ reviewID, token, isUpvote }: { reviewID: number; token: string; isUpvote: boolean }): Promise<any> {
  return fetch(`${API_BASE_URL}/api/reviewdb/reviews/${reviewID}/vote`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isUpvote: isUpvote,
    }),
  })
    .then((res) => res.json())
    .catch((err: Error) => {
      console.log(err)
      return null
    })
}

export function getReviewVotes({ discordID, token }: { discordID: string; token: string }): Promise<{ success: boolean; votes: { reviewID: number; isUpvote: boolean }[] } | null> {
  return fetch(`${API_BASE_URL}/api/reviewdb/users/${discordID}/reviews/votes`, {
    method: 'GET',
    headers: {
      'Authorization': token,
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => {
      console.log(err)
      return null
    })
}

export interface AdminUser {
  id: number
  discord_id: string
  username: string
  profile_photo: string
  type: number
  warning_count: number
  opted_out: boolean
  reputation: number
}

const adminHeaders = (token: string): HeadersInit => ({
  Authorization: token,
  'Content-Type': 'application/json',
})

export async function getAdminUser({ id, token }: { id: string; token: string }): Promise<AdminUser | null> {
  const response = await fetch(`${API_BASE_URL}/api/reviewdb/admin/users/${id}`, { headers: adminHeaders(token) })
  if (!response.ok) return null
  return response.json()
}

export async function getAdminUserReviews({ id, token }: { id: string; token: string }): Promise<{ reviews: Review[]; reviewCount: number } | null> {
  const response = await fetch(`${API_BASE_URL}/api/reviewdb/admin/users/${id}/reviews`, { headers: adminHeaders(token) })
  if (!response.ok) return null
  return response.json()
}

export async function updateAdminUser({ user, token }: { user: Pick<AdminUser, 'id' | 'type'>; token: string }): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/reviewdb/admin/users`, {
    method: 'PATCH',
    headers: adminHeaders(token),
    body: JSON.stringify(user),
  })
  return response.ok
}

export interface AdminReport {
  id: number
  reviewID: number
  timestamp: string
  review: Review
  reporter: AdminUser
}

export async function getAdminReports({ token, limit = 20, offset = 0 }: { token: string; limit?: number; offset?: number }): Promise<AdminReport[]> {
  const response = await fetch(`${API_BASE_URL}/api/reviewdb/admin/reports?limit=${limit}&offset=${offset}`, { headers: adminHeaders(token) })
  if (!response.ok) return []
  return response.json()
}

export async function dismissAdminReports({ reportIDs, token }: { reportIDs: number[]; token: string }): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/reviewdb/admin/reports`, {
    method: 'DELETE', headers: adminHeaders(token), body: JSON.stringify({ reportIDs }),
  })
  return response.ok
}

export async function banAdminUser({ id, reviewID, days, token }: { id: string; reviewID?: number; days: 1 | 3 | 7 | 30; token: string }): Promise<{ success: boolean; message?: string } | null> {
  const response = await fetch(`${API_BASE_URL}/api/reviewdb/admin/users/${id}/ban`, {
    method: 'POST', headers: adminHeaders(token), body: JSON.stringify({ days, reviewID }),
  })
  return response.json().catch(() => null)
}

export interface AdminBadge {
  id: number
  targetDiscordID: string
  name: string
  icon: string
  redirectURL: string
  type: number
  description: string
}

export function getAdminBadges({ token }: { token: string }): Promise<AdminBadge[]> {
  return fetch(`${API_BASE_URL}/api/reviewdb/admin/badges`, { headers: adminHeaders(token) }).then(response => response.ok ? response.json() : [])
}

export function addAdminBadge({ badge, token }: { badge: Omit<AdminBadge, 'id'>; token: string }): Promise<boolean> {
  return fetch(`${API_BASE_URL}/api/reviewdb/admin/badges`, { method: 'PUT', headers: adminHeaders(token), body: JSON.stringify(badge) }).then(response => response.ok)
}

export function deleteAdminBadge({ id, token }: { id: number; token: string }): Promise<boolean> {
  return fetch(`${API_BASE_URL}/api/reviewdb/admin/badges?id=${id}`, { method: 'DELETE', headers: adminHeaders(token) }).then(response => response.ok)
}

export interface AdminFilters {
  profaneWords: string[]
  lightProfaneWords: string[]
  banWords: string[]
}

export function getAdminFilters({ token }: { token: string }): Promise<AdminFilters | null> {
  return fetch(`${API_BASE_URL}/api/reviewdb/admin/filters`, { headers: adminHeaders(token) }).then(response => response.ok ? response.json() : null)
}

export function updateAdminFilter({ word, type, remove, token }: { word: string; type: 'profane' | 'lightProfane' | 'ban'; remove?: boolean; token: string }): Promise<boolean> {
  return fetch(`${API_BASE_URL}/api/reviewdb/admin/filters`, {
    method: remove ? 'DELETE' : 'PUT', headers: adminHeaders(token), body: JSON.stringify({ word, type }),
  }).then(response => response.ok)
}
