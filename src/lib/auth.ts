import { redirect } from 'next/navigation'
import { getViewer, type Viewer } from '@/lib/api'
import { getDemoViewer } from '@/lib/demo-session'

export async function requireViewer(): Promise<Viewer> {
  const demoViewer = await getDemoViewer()
  if (demoViewer) return demoViewer

  try {
    return await getViewer()
  } catch (error) {
    if (error instanceof Error && error.message === 'AUTH_REQUIRED') {
      redirect('/login')
    }
    throw error
  }
}
