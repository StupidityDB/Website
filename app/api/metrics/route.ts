export async function GET(request: Request) {
  const allowedDomains = ['manti.vendicated.dev', 'localhost:8080', 'public.spin.rip']
  if (!allowedDomains.includes(request.headers.get('host')!)) return new Response('Not allowed', { status: 403 })

  const response = await fetch('https://manti.vendicated.dev/metrics').then((res: Response) => res.text()).then((text: string) => {
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
