import { BarChart3, LayoutDashboard, ShieldCheck, Users } from 'lucide-react'
import { Brand } from '@/components/brand'
import { AuthForm } from '@/components/auth-form'

export function AuthShell({ mode }: { mode: 'login' | 'signup' }) {
  return (
    <main className="auth-page">
      <section className="auth-story">
        <Brand />
        <div className="auth-story-copy">
          <span className="eyebrow light">One account. Every DGTL service.</span>
          <h2>Your tools, team and access—kept in one secure place.</h2>
          <p>
            Move between content, customer, search and people operations without juggling separate accounts.
          </p>
          <div className="auth-service-grid" aria-label="Available service categories">
            <span><LayoutDashboard size={20} /> CMS</span>
            <span><Users size={20} /> CRM</span>
            <span><BarChart3 size={20} /> SEO</span>
            <span><ShieldCheck size={20} /> HR</span>
          </div>
        </div>
        <p className="auth-story-foot">Protected by Supabase Auth and database-level access policies.</p>
      </section>
      <section className="auth-panel">
        <AuthForm mode={mode} />
      </section>
    </main>
  )
}
