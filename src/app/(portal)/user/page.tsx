import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ArrowUpRight, BarChart3, LayoutDashboard, ShieldCheck, Users } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { requireViewer } from '@/lib/auth'
import { getDashboardServices } from '@/lib/service-catalog'

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
  const services = getDashboardServices(viewer.services)

  return (
    <main className="portal-page">
      <AppHeader name={viewer.fullName || viewer.email} role={viewer.role} />
      <section className="portal-content">
        {viewer.id === 'demo-client' && (
          <div className="demo-banner" role="status">
            <strong>Client demo mode</strong>
            <span>These service links and account details are sample data.</span>
          </div>
        )}
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">Client workspace</span>
            <h1>Welcome back, {viewer.fullName?.split(' ')[0] || 'there'}.</h1>
            <p>Your CMS, SEO, HR and CRM tools, together in one workspace.</p>
          </div>
          <span className={`status-badge ${viewer.status}`}>{viewer.status}</span>
        </div>

        {viewer.status === 'suspended' ? (
          <div className="empty-state">
            <ShieldCheck size={30} />
            <h2>Account access is paused</h2>
            <p>Contact your DGTL account manager to restore service access.</p>
          </div>
        ) : (
          <div className="dashboard-service-grid">
            {services.map((service) => {
              const Icon = serviceIcons[service.key as keyof typeof serviceIcons] ?? LayoutDashboard
              const content = (
                <>
                  <span className="dashboard-service-icon"><Icon size={22} /></span>
                  <span className="service-code">{service.key.toUpperCase()}</span>
                  <h2>{service.name}</h2>
                  <p>{service.description}</p>
                  <span className="open-label">
                    {service.url ? <>Open {service.key.toUpperCase()} <ArrowUpRight size={17} aria-hidden="true" /></> : 'Coming soon'}
                  </span>
                </>
              )

              return service.url ? (
                <a className="dashboard-service-card" key={service.key} href={service.url}>
                  {content}
                </a>
              ) : (
                <div className="dashboard-service-card disabled" key={service.key} aria-disabled="true">
                  {content}
                  <small>Contact your DGTL team to enable this tool.</small>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
