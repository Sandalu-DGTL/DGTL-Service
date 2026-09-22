import { redirect } from 'next/navigation'
import { getViewer, type Viewer } from '@/lib/api'

export async function requireViewer(): Promise<Viewer> {
  try {
    return await getViewer()
  } catch (error) {
    if (error instanceof Error && error.message === 'AUTH_REQUIRED') {
      redirect('/login')
    }
    throw error
  }
}
