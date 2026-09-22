'use server'

import { revalidatePath } from 'next/cache'
import { requireViewer } from '@/lib/auth'
import { updateAdminClient } from '@/lib/api'

export async function updateClientAction(formData: FormData) {
  const viewer = await requireViewer()
  if (viewer.role !== 'admin') throw new Error('FORBIDDEN')
  if (viewer.id === 'demo-admin') {
    revalidatePath('/admin')
    return
  }

  const clientId = String(formData.get('clientId') ?? '')
  const fullName = String(formData.get('fullName') ?? '').trim()
  const status = String(formData.get('status') ?? '')
  const serviceKeys = formData.getAll('serviceKeys').map(String)

  if (!clientId) throw new Error('A client id is required.')

  await updateAdminClient(clientId, { fullName, status, serviceKeys })
  revalidatePath('/admin')
}
