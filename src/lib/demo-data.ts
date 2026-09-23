import type { AdminClient, ServiceAccess, Viewer } from '@/lib/api'
import { SERVICE_CATALOG } from '@/lib/service-catalog'

export const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@dgtl.lk',
    password: 'Admin@123',
    label: 'Admin demo',
    session: 'dgtl-admin-demo-v1',
  },
  client: {
    email: 'client@dgtl.lk',
    password: 'Client@123',
    label: 'Client demo',
    session: 'dgtl-client-demo-v1',
  },
} as const

export type DemoRole = keyof typeof DEMO_ACCOUNTS

const serviceCatalog: Record<string, ServiceAccess> = Object.fromEntries(
  SERVICE_CATALOG.map((service) => [service.key, {
    ...service,
    url: `https://${service.key === 'cms' ? 'seo' : service.key}.dgtl.lk/`,
  }]),
)

export const DEMO_VIEWERS: Record<DemoRole, Viewer> = {
  admin: {
    id: 'demo-admin',
    email: DEMO_ACCOUNTS.admin.email,
    fullName: 'Sandalu Admin',
    role: 'admin',
    status: 'active',
    services: [],
  },
  client: {
    id: 'demo-client',
    email: DEMO_ACCOUNTS.client.email,
    fullName: 'Nethmi Perera',
    role: 'client',
    status: 'active',
    services: Object.values(serviceCatalog),
  },
}

export const DEMO_CLIENTS: AdminClient[] = [
  {
    id: 'demo-client',
    email: 'client@dgtl.lk',
    fullName: 'Nethmi Perera',
    role: 'client',
    status: 'active',
    createdAt: '2026-09-18T09:15:00.000Z',
    services: [serviceCatalog.cms, serviceCatalog.crm, serviceCatalog.seo, serviceCatalog.hr],
  },
  {
    id: 'demo-client-2',
    email: 'amal@serendib.example',
    fullName: 'Amal Fernando',
    role: 'client',
    status: 'active',
    createdAt: '2026-09-19T11:40:00.000Z',
    services: [serviceCatalog.cms, serviceCatalog.seo],
  },
  {
    id: 'demo-client-3',
    email: 'operations@lanka.example',
    fullName: 'Lanka Operations',
    role: 'client',
    status: 'invited',
    createdAt: '2026-09-21T07:30:00.000Z',
    services: [serviceCatalog.crm, serviceCatalog.hr],
  },
]

export function isDemoAvailable() {
  return process.env.NODE_ENV !== 'production'
}

export function findDemoAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  return (Object.entries(DEMO_ACCOUNTS) as [DemoRole, (typeof DEMO_ACCOUNTS)[DemoRole]][])
    .find(([, account]) => account.email === normalizedEmail && account.password === password)
}
