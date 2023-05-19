/*
  TODO:
    add pagination to getReviews() and implement it in the frontend
*/

import { AddReview, DeleteReview, GetReviews, GetUser, ReportReview, Settings } from '@global/functions/interface'

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
