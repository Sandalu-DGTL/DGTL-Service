import 'server-only'

import { cookies } from 'next/headers'
import { DEMO_ACCOUNTS, DEMO_VIEWERS, isDemoAvailable, type DemoRole } from '@/lib/demo-data'

export const DEMO_COOKIE_NAME = 'dgtl_demo_session'

export async function getDemoViewer() {
  if (!isDemoAvailable()) return null

  const session = (await cookies()).get(DEMO_COOKIE_NAME)?.value
  const role = (Object.keys(DEMO_ACCOUNTS) as DemoRole[]).find(
    (candidate) => DEMO_ACCOUNTS[candidate].session === session,
  )

  return role ? DEMO_VIEWERS[role] : null
}
