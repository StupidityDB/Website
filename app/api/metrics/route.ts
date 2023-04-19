export async function GET(request: Request) {
  const response = await fetch('https://manti.vendicated.dev/metrics').then((res: any) => res.text()).then((text: any) => {
    return {
      totalReviews: parseFloat(text.match(/review_count\s([\d\.e\+]+)/)[1]),
      totalUsers: parseFloat(text.match(/user_count\s([\d\.e\+]+)/)[1]),
      totalRequests: parseFloat(text.match(/total_request\s([\d\.e\+]+)/)[1]),
    }
  }).catch((err: any) => {
    return {
      totalReviews: 0,
      totalUsers: 0,
      totalRequests: 0,
      error: err,
    }
  })
  return new Response(JSON.stringify(response))
}
