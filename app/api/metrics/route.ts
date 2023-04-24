import { API_BASE_URL } from '@global/functions/RDBAPI'

export async function GET(request: Request) {
  const allowedDomains = ['reviewdb.mantikafasi.dev', 'localhost:8080', 'public.spin.rip']
  if (!allowedDomains.includes(request.headers.get('host')!)) return new Response('Not allowed', { status: 403 })

  const response = await fetch(API_BASE_URL + '/metrics').then((res: Response) => res.text()).then((text: string) => {
    return {
      totalReviews: parseFloat(text.match(/review_count\s([\d\.e\+]+)/)![1]),
      totalUsers: parseFloat(text.match(/user_count\s([\d\.e\+]+)/)![1]),
      totalRequests: parseFloat(text.match(/total_request\s([\d\.e\+]+)/)![1]),
    }
  }).catch((err: Error) => {
    return {
      totalReviews: 0,
      totalUsers: 0,
      totalRequests: 0,
      error: err,
    }
  })
  return new Response(JSON.stringify(response))
}
