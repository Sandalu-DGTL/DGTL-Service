import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth-shell'
import { safeAuthReturn } from '@/lib/auth-return'

export const metadata: Metadata = { title: 'Create account' }

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <AuthShell mode="signup" next={safeAuthReturn((await searchParams).next)} />
}
