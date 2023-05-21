import { getRdbUser } from '@global/functions/RDBAPI'
import { GetUser } from '@global/functions/interface'

export async function GET(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url)
  let token = url.searchParams.get('token') || ''
  const page = url.searchParams.get('page') || 'dashboard'

  try {
    if (!token) return new Response(JSON.stringify({ error: 'Failed to log in', details: `You did not provide a token. Please try again, or join our Discord server for support: ${request.headers.get('host')!}/discord` }), { status: 400 })
    token = decodeURIComponent(token)

    const res: GetUser = await getRdbUser({ token: token })

    if (res) {
      let response = new Response(null, {
        status: 307,
        headers: {
          'Location': `/${page}`,
        },
      })

      // Clone the response so we can add headers
      response = new Response(response.body, response)
      response.headers.append('Set-Cookie', `rdbToken=${token}; Path=/; Secure; SameSite=Strict`)
      response.headers.append('Set-Cookie', `rdbUserInfo=${encodeURIComponent(JSON.stringify(res))}; Path=/; Secure; SameSite=Strict`)

      return response
    } else {
      return new Response(JSON.stringify({ error: 'Failed to log in', details: `You potentially provided an invalid token. Please try again, or join our Discord server for support: ${request.headers.get('host')!}/discord` }), { status: 401 })
    }

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err)
      return new Response(JSON.stringify({ error: 'Failed to log in', details: err.message }), { status: 500 })
    } else {
      console.log('Unexpected error:', err)
    }
  }

  // Add an ending return statement to handle the case where none of the conditions are met.
  return new Response(JSON.stringify({ error: 'Failed to log in', details: `An unexpected error occurred. Please try again, or join our Discord server for support: ${request.headers.get('host')!}/discord` }), { status: 500 })
}
