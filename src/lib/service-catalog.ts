import type { ServiceAccess } from './api'

export const SERVICE_CATALOG: ServiceAccess[] = [
  { key: 'cms', name: 'Content Management', description: 'Plan, publish and maintain your digital content.', url: null },
  { key: 'seo', name: 'Search Performance', description: 'Track search visibility and turn insights into action.', url: null },
  { key: 'hr', name: 'People Operations', description: 'Access essential people and HR workflows.', url: null },
  { key: 'crm', name: 'Customer Operations', description: 'Keep customer relationships and opportunities visible.', url: null },
]

// Catalog visibility does not grant access. Only backend-assigned URLs are clickable.
export function getDashboardServices(assigned: ServiceAccess[]) {
  const byKey = new Map(assigned.map((service) => [service.key, service]))
  const knownKeys = new Set(SERVICE_CATALOG.map((service) => service.key))
  return [
    ...SERVICE_CATALOG.map((service) => byKey.get(service.key) ?? service),
    ...assigned.filter((service) => !knownKeys.has(service.key)),
  ].map((service) => {
    const url = safeServiceUrl(service.url)
    // A hub launch must establish the current central identity, even when
    // this browser still has another user's SEO session.
    return {
      ...service,
      url: service.key === 'seo' && url && new URL(url).origin === 'https://seo.dgtl.lk'
        ? 'https://seo.dgtl.lk/sso'
        : url,
    }
  })
}

function safeServiceUrl(value: string | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null
  } catch {
    return null
  }
}
