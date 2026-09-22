import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ArrowUpRight, BarChart3, LayoutDashboard, ShieldCheck, Users } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { requireViewer } from '@/lib/auth'

export const metadata: Metadata = { title: 'My services' }
export const dynamic = 'force-dynamic'

const serviceIcons = {
  cms: LayoutDashboard,
  crm: Users,
  seo: BarChart3,
  hr: ShieldCheck,
}

export default async function UserDashboardPage() {
  const viewer = await requireViewer()
  if (viewer.role === 'admin') redirect('/admin')

  return (
    <main className="portal-page">
      <AppHeader name={viewer.fullName || viewer.email} role={viewer.role} />
      <section className="portal-content">
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">Client workspace</span>
            <h1>Welcome back, {viewer.fullName?.split(' ')[0] || 'there'}.</h1>
            <p>Everything your DGTL team has activated for your account is here.</p>
          </div>
          <span className={`status-badge ${viewer.status}`}>{viewer.status}</span>
        </div>

        {viewer.status === 'suspended' ? (
          <div className="empty-state">
            <ShieldCheck size={30} />
            <h2>Account access is paused</h2>
            <p>Contact your DGTL account manager to restore service access.</p>
          </div>
        ) : viewer.services.length === 0 ? (
          <div className="empty-state">
            <LayoutDashboard size={30} />
            <h2>Your workspace is being prepared</h2>
            <p>Your DGTL team will assign services here as soon as they are ready.</p>
          </div>
        ) : (
          <div className="dashboard-service-grid">
            {viewer.services.map((service) => {
              const Icon = serviceIcons[service.key as keyof typeof serviceIcons] ?? LayoutDashboard
              const content = (
                <>
                  <span className="dashboard-service-icon"><Icon size={22} /></span>
                  <span className="service-code">{service.key.toUpperCase()}</span>
                  <h2>{service.name}</h2>
                  <p>{service.description}</p>
                  <span className="open-label">Open service <ArrowUpRight size={17} /></span>
                </>
              )

              return service.url ? (
                <a className="dashboard-service-card" key={service.key} href={service.url}>
                  {content}
                </a>
              ) : (
                <div className="dashboard-service-card disabled" key={service.key}>
                  {content}
                  <small>URL not configured</small>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
