import { getLocalStorageItem } from "@global/functions/localStorage"
import { GetUser, GetReviews, AddReview, DeleteReview, ReportReview, Review } from "@global/functions/interface"

const API_BASE_URL = 'https://manti.vendicated.dev'

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
    .catch((err: any) => {
      console.error(err)
      return null as any
    })
}

export function getReviews({ discordID }: { discordID: string }): Promise<GetReviews> {
  return fetch(`${API_BASE_URL}/api/reviewdb/users/${discordID}/reviews`, {
    method: 'GET',
    headers: {},
  })
    .then((res) => res.json())
    .catch((err: any) => {
      console.error(err)
      return null as any
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
    .catch((err: any) => {
      console.error(err)
      return null as any
    })
}

export function addReview({ discordID, review }: { discordID: string; review: object }): Promise<AddReview> {
  return fetch(`${API_BASE_URL}/api/reviewdb/users/${discordID}/reviews`, {
    method: 'PUT',
    headers: {},
    body: JSON.stringify(review),
  })
    .then((res) => res.json())
    .catch((err: any) => {
      console.error(err)
      return null as any
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
    .catch((err: any) => {
      console.error(err)
      return null as any
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
    .catch((err: any) => {
      console.error(err)
      return null as any
    })
}

// endpoint: https://manti.vendicated.dev/admins
export function isAdmin({ currentDiscordID }: { currentDiscordID: string }): Promise<boolean> {
  return fetch(`${API_BASE_URL}/admins`, {
    method: 'GET',
    headers: {},
  })
    .then((res) => res.json())
    .then((admins) => admins.includes(currentDiscordID))
    .catch((err: any) => {
      console.error(err)
      return false
    })
}
