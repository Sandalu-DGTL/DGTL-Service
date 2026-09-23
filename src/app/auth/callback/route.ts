import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeAuthReturn } from '@/lib/auth-return'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = safeAuthReturn(url.searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, url.origin))
  }

  const login = new URL('/login', url.origin)
  login.searchParams.set('error', 'callback')
  login.searchParams.set('next', next)
  return NextResponse.redirect(login)
}
