import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Search, ShieldCheck, Users } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { getAdminClients } from '@/lib/api'
import { requireViewer } from '@/lib/auth'
import { DEMO_CLIENTS } from '@/lib/demo-data'
import { updateClientAction } from './actions'

export const metadata: Metadata = { title: 'Admin console' }
export const dynamic = 'force-dynamic'

const serviceOptions = ['cms', 'crm', 'seo', 'hr']

export default async function AdminDashboardPage() {
  const viewer = await requireViewer()
  if (viewer.role !== 'admin') redirect('/user')

  const isDemo = viewer.id === 'demo-admin'
  const clients = isDemo ? DEMO_CLIENTS : await getAdminClients()
  const activeCount = clients.filter((client) => client.status === 'active').length
  const assignedCount = clients.filter((client) => client.services.length > 0).length

  return (
    <main className="portal-page admin-portal">
      <AppHeader name={viewer.fullName || viewer.email} role={viewer.role} />
      <section className="portal-content">
        {isDemo && (
          <div className="demo-banner" role="status">
            <strong>Admin demo mode</strong>
            <span>These clients are sample data. Changes reset automatically.</span>
          </div>
        )}
        <div className="dashboard-heading admin-heading">
          <div>
            <span className="eyebrow">DGTL administration</span>
            <h1>Client access</h1>
            <p>Manage account status and decide which services each client can open.</p>
          </div>
        </div>

        <div className="admin-stats">
          <article><span><Users size={20} /></span><div><strong>{clients.length}</strong><small>Total clients</small></div></article>
          <article><span><ShieldCheck size={20} /></span><div><strong>{activeCount}</strong><small>Active accounts</small></div></article>
          <article><span><Search size={20} /></span><div><strong>{assignedCount}</strong><small>With services</small></div></article>
        </div>

        <div className="client-table-wrap">
          <div className="table-heading">
            <div><h2>Clients</h2><p>Changes are protected by the backend admin role guard.</p></div>
          </div>
          {clients.length === 0 ? (
            <div className="empty-state compact">
              <Users size={28} />
              <h2>No client accounts yet</h2>
              <p>New sign-ups will appear here after their profile is created.</p>
            </div>
          ) : (
            <div className="client-list">
              {clients.map((client) => {
                const enabled = new Set(client.services.map((service) => service.key))
                return (
                  <form className="client-row" action={updateClientAction} key={client.id}>
                    <input type="hidden" name="clientId" value={client.id} />
                    <div className="client-identity">
                      <span className="avatar">{(client.fullName || client.email).slice(0, 1).toUpperCase()}</span>
                      <label>
                        <span className="sr-only">Client name</span>
                        <input name="fullName" defaultValue={client.fullName} aria-label={`Name for ${client.email}`} />
                        <small>{client.email}</small>
                      </label>
                    </div>
                    <fieldset className="service-checks">
                      <legend>Services</legend>
                      {serviceOptions.map((service) => (
                        <label key={service}>
                          <input
                            type="checkbox"
                            name="serviceKeys"
                            value={service}
                            defaultChecked={enabled.has(service)}
                          />
                          <span>{service.toUpperCase()}</span>
                        </label>
                      ))}
                    </fieldset>
                    <label className="status-select">
                      <span className="sr-only">Account status</span>
                      <select name="status" defaultValue={client.status}>
                        <option value="invited">Invited</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </label>
                    <button className="secondary-button compact" type="submit">Save</button>
                  </form>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
