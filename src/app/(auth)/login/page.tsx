import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth-shell'
import { safeAuthReturn } from '@/lib/auth-return'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <AuthShell mode="login" next={safeAuthReturn((await searchParams).next)} />
}
