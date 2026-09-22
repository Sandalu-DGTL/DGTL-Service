import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Check,
  LayoutDashboard,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Brand } from '@/components/brand'

const services = [
  {
    key: 'CMS',
    name: 'Content Management',
    description: 'Plan, publish and maintain every digital touchpoint from one workspace.',
    icon: LayoutDashboard,
    accent: 'blue',
  },
  {
    key: 'CRM',
    name: 'Customer Operations',
    description: 'Keep relationships, conversations and opportunities visible to your team.',
    icon: Users,
    accent: 'violet',
  },
  {
    key: 'SEO',
    name: 'Search Performance',
    description: 'Turn rankings, technical health and content opportunities into action.',
    icon: BarChart3,
    accent: 'cyan',
  },
  {
    key: 'HR',
    name: 'People Operations',
    description: 'Give your people a clear, secure home for essential HR workflows.',
    icon: ShieldCheck,
    accent: 'amber',
  },
]

export default function HomePage() {
  return (
    <main>
      <section className="landing-hero">
        <header className="landing-nav">
          <Brand />
          <nav aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#security">Security</a>
            <Link className="text-button" href="/login">Sign in</Link>
            <Link className="primary-button small" href="/signup">Create account</Link>
          </nav>
        </header>

        <div className="hero-layout">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={15} /> The DGTL client experience</span>
            <h1>One secure doorway to all your digital services.</h1>
            <p>
              Access the tools your business relies on, see what is active, and move between services with a single DGTL account.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" href="/signup">Start with DGTL <ArrowRight size={18} /></Link>
              <Link className="secondary-button" href="/login">Client sign in</Link>
            </div>
            <ul className="trust-list" aria-label="Platform benefits">
              <li><Check size={16} /> Role-protected access</li>
              <li><Check size={16} /> Google and company SSO</li>
              <li><Check size={16} /> One client dashboard</li>
            </ul>
          </div>

          <div className="portal-preview" aria-label="DGTL portal preview">
            <div className="preview-topbar">
              <span className="mini-brand">D</span>
              <span>My services</span>
              <span className="preview-avatar">SL</span>
            </div>
            <div className="preview-body">
              <p>Good morning, Sandalu</p>
              <h2>Your workspace is ready.</h2>
              <div className="preview-stats">
                <span><strong>04</strong> Active services</span>
                <span><strong>100%</strong> Account secure</span>
              </div>
              <div className="preview-services">
                {services.slice(0, 3).map((service) => (
                  <span key={service.key}>
                    <service.icon size={18} />
                    <b>{service.key}</b>
                    <small>Open</small>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-heading">
          <span className="eyebrow">Built around your operation</span>
          <h2>The right tools, visible at the right time.</h2>
          <p>Your dashboard stays focused: clients see only the services assigned by the DGTL team.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.key}>
              <span className={`service-icon ${service.accent}`}><service.icon size={23} /></span>
              <span className="service-code">{service.key}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="security-section" id="security">
        <div className="security-copy">
          <span className="security-icon"><LockKeyhole size={27} /></span>
          <span className="eyebrow light">Security at every layer</span>
          <h2>Access is decided by verified roles—not an email address.</h2>
          <p>
            Authentication confirms who a person is. DGTL role policies then decide which records, tools and administration actions that person can reach.
          </p>
        </div>
        <div className="security-flow">
          <span><b>01</b> Supabase verifies identity</span>
          <span><b>02</b> The API checks the account role</span>
          <span><b>03</b> Database policies protect every row</span>
        </div>
      </section>

      <footer className="landing-footer">
        <Brand />
        <p>Secure access for the DGTL service ecosystem.</p>
        <span>© {new Date().getFullYear()} DGTL</span>
      </footer>
    </main>
  )
}
