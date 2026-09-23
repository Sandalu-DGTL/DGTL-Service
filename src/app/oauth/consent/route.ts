import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getViewer } from '@/lib/api'
import { allowedSeoCallback, allowedSeoScopes } from '@/lib/oauth-policy'

export const dynamic = 'force-dynamic'

function failure(status: number, message: string) {
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><title>DGTL service access</title><main><h1>Unable to open SEO</h1><p>${message}</p><a href="/user">Return to My services</a></main></html>`, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
  })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const authorizationId = url.searchParams.get('authorization_id')
  if (!authorizationId || !/^[a-zA-Z0-9_-]{1,200}$/.test(authorizationId)) {
    return failure(400, 'This authorization request is invalid. Open SEO again from My services.')
  }
  if (!process.env.DGTL_OAUTH_SEO_CLIENT_ID || !process.env.DGTL_OAUTH_SEO_CALLBACK_URLS) {
    return failure(503, 'DGTL single sign-on is not configured yet. Please contact your administrator.')
  }

  try {
    const supabase = await createClient()
    const { data: identity, error: identityError } = await supabase.auth.getUser()
    if (identityError || !identity.user) {
      const login = new URL('/login', url.origin)
      login.searchParams.set('next', `${url.pathname}?${new URLSearchParams({ authorization_id: authorizationId })}`)
      return NextResponse.redirect(login)
    }

    // Use the real backend, never the portal's demo session.
    const viewer = await getViewer()
    if (viewer.id !== identity.user.id || viewer.status !== 'active' || !viewer.services.some((service) => service.key === 'seo')) {
      return failure(403, 'Your account does not have active SEO access. Please contact your administrator.')
    }
    const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId)
    if (error || !data) return failure(400, 'This authorization request expired. Open SEO again from My services.')

    const callbacks = process.env.DGTL_OAUTH_SEO_CALLBACK_URLS
    if ('redirect_url' in data) {
      if (!allowedSeoCallback(data.redirect_url, callbacks)) return failure(403, 'This application is not an approved DGTL service.')
      const response = NextResponse.redirect(data.redirect_url)
      response.headers.set('Cache-Control', 'no-store')
      response.headers.set('Referrer-Policy', 'no-referrer')
      return response
    }
    if (data.client.id !== process.env.DGTL_OAUTH_SEO_CLIENT_ID || data.user.id !== identity.user.id ||
        !allowedSeoScopes(data.scope) || !allowedSeoCallback(data.redirect_uri, callbacks)) {
      return failure(403, 'This application or permission request is not approved for automatic DGTL sign-in.')
    }
    const approved = await supabase.auth.oauth.approveAuthorization(authorizationId, { skipBrowserRedirect: true })
    if (approved.error || !approved.data || !allowedSeoCallback(approved.data.redirect_url, callbacks)) {
      return failure(400, 'Authorization could not finish. Open SEO again from My services.')
    }
    const response = NextResponse.redirect(approved.data.redirect_url)
    response.headers.set('Cache-Control', 'no-store')
    response.headers.set('Referrer-Policy', 'no-referrer')
    return response
  } catch {
    return failure(503, 'The login service is temporarily unavailable. Please try again later.')
  }
}
