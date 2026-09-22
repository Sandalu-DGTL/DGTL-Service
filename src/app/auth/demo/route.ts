import { NextResponse } from 'next/server'
import {
  findDemoAccount,
  isDemoAvailable,
} from '@/lib/demo-data'
import { DEMO_COOKIE_NAME } from '@/lib/demo-session'

export async function POST(request: Request) {
  if (!isDemoAvailable()) {
    return NextResponse.json({ error: 'Demo login is disabled.' }, { status: 404 })
  }

  const input = (await request.json().catch(() => null)) as
    | { email?: unknown; password?: unknown }
    | null

  if (typeof input?.email !== 'string' || typeof input.password !== 'string') {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const match = findDemoAccount(input.email, input.password)
  if (!match) {
    return NextResponse.json({ error: 'The demo credentials are not valid.' }, { status: 401 })
  }

  const [role, account] = match
  const response = NextResponse.json({ role })
  response.cookies.set(DEMO_COOKIE_NAME, account.session, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 4,
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ signedOut: true })
  response.cookies.set(DEMO_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 0,
  })
  return response
}
