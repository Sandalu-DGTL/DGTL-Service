import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

export type ServiceAccess = {
  key: string
  name: string
  description: string
  url: string | null
}

export type Viewer = {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'client'
  status: 'invited' | 'active' | 'suspended'
  services: ServiceAccess[]
}

export type AdminClient = Viewer & {
  createdAt: string
}

export async function getAccessToken() {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()
  if (claimsError || !claimsData?.claims?.sub) return null

  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken()
  if (!token) throw new Error('AUTH_REQUIRED')

  const baseUrl = process.env.API_URL ?? 'http://localhost:4000/v1'
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  })

  if (!response.ok) {
    if (response.status === 401) throw new Error('AUTH_REQUIRED')
    if (response.status === 403) throw new Error('FORBIDDEN')
    throw new Error(`API_ERROR_${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getViewer() {
  return apiFetch<Viewer>('/me')
}

export function getAdminClients() {
  return apiFetch<AdminClient[]>('/admin/clients')
}

export function updateAdminClient(
  clientId: string,
  input: { fullName?: string; status?: string; serviceKeys?: string[] },
) {
  return apiFetch<AdminClient>(`/admin/clients/${clientId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}
