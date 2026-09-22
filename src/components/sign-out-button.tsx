'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()

  async function signOut() {
    await fetch('/auth/demo', { method: 'DELETE' })
    if (isSupabaseConfigured()) {
      await createClient().auth.signOut()
    }
    router.replace('/login')
    router.refresh()
  }

  return (
    <button className="icon-button" type="button" onClick={signOut}>
      <LogOut size={17} />
      <span>Sign out</span>
    </button>
  )
}
