'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, Eye, EyeOff } from 'lucide-react'
import { DEMO_ACCOUNTS, findDemoAccount, isDemoAvailable } from '@/lib/demo-data'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

type Mode = 'login' | 'signup'

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [companyDomain, setCompanyDomain] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const isLogin = mode === 'login'
  const demoAvailable = isLogin && isDemoAvailable()

  function getSupabase() {
    if (!isSupabaseConfigured()) {
      setMessage('Connect this frontend to Supabase in .env.local before signing in.')
      return null
    }
    return createClient()
  }

  async function submitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (demoAvailable) {
      const demoAccount = findDemoAccount(email, password)
      const isDemoEmail = Object.values(DEMO_ACCOUNTS).some(
        (account) => account.email === email.trim().toLowerCase(),
      )

      if (demoAccount) {
        setBusy(true)
        setMessage(null)
        const response = await fetch('/auth/demo', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const result = (await response.json()) as { error?: string }
          setMessage(result.error ?? 'Demo login failed.')
          setBusy(false)
          return
        }

        const result = (await response.json()) as { role: 'admin' | 'client' }
        router.replace(result.role === 'admin' ? '/admin' : '/user')
        router.refresh()
        return
      }

      if (isDemoEmail) {
        setMessage('The password does not match this demo account.')
        return
      }
    }

    const supabase = getSupabase()
    if (!supabase) return

    setBusy(true)
    setMessage(null)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
        setBusy(false)
        return
      }
      router.replace('/user')
      router.refresh()
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    setBusy(false)
    if (error) {
      setMessage(error.message)
      return
    }

    if (data.session) {
      router.replace('/user')
      router.refresh()
      return
    }

    setMessage('Check your inbox to confirm your email, then sign in.')
  }

  async function continueWithGoogle() {
    const supabase = getSupabase()
    if (!supabase) return
    setBusy(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setMessage(error.message)
      setBusy(false)
    }
  }

  async function continueWithSso() {
    const domain = companyDomain.trim().toLowerCase().replace(/^@/, '')
    if (!domain) {
      setMessage('Enter your company domain, for example company.com.')
      return
    }

    const supabase = getSupabase()
    if (!supabase) return
    setBusy(true)
    const { data, error } = await supabase.auth.signInWithSSO({
      domain,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error || !data?.url) {
      setMessage(error?.message ?? 'No SSO provider is configured for this domain.')
      setBusy(false)
      return
    }
    window.location.assign(data.url)
  }

  return (
    <div className="auth-card">
      <div className="auth-heading">
        <span className="eyebrow">Secure DGTL account</span>
        <h1>{isLogin ? 'Welcome back' : 'Create your workspace'}</h1>
        <p>
          {isLogin
            ? 'Sign in once to reach every service assigned to you.'
            : 'Create your client account. Your DGTL team will activate the services you need.'}
        </p>
      </div>

      {demoAvailable && (
        <section className="demo-login-panel" aria-label="Demo login accounts">
          <div>
            <strong>Explore the demo</strong>
            <small>Choose an account, then press Sign in.</small>
          </div>
          <div className="demo-account-grid">
            {(['admin', 'client'] as const).map((role) => {
              const account = DEMO_ACCOUNTS[role]
              return (
                <button
                  key={role}
                  type="button"
                  className="demo-account"
                  onClick={() => {
                    setEmail(account.email)
                    setPassword(account.password)
                    setMessage(null)
                  }}
                >
                  <span>{account.label}</span>
                  <code>{account.email}</code>
                  <small>{account.password}</small>
                </button>
              )
            })}
          </div>
        </section>
      )}

      <button className="sso-button" type="button" onClick={continueWithGoogle} disabled={busy}>
        <span className="google-mark" aria-hidden="true">G</span>
        Continue with Google
      </button>

      <div className="divider"><span>or use email</span></div>

      <form className="auth-form" onSubmit={submitCredentials}>
        <label>
          Work email
          <input
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <span className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder={isLogin ? 'Enter your password' : 'At least 8 characters'}
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        <button className="primary-button wide" type="submit" disabled={busy}>
          {busy ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          {!busy && <ArrowRight size={18} />}
        </button>
      </form>

      {message && <p className="form-message" role="status">{message}</p>}

      {isLogin && (
        <details className="enterprise-sso">
          <summary><Building2 size={17} /> Company SSO</summary>
          <div>
            <input
              aria-label="Company domain"
              placeholder="company.com"
              value={companyDomain}
              onChange={(event) => setCompanyDomain(event.target.value)}
            />
            <button type="button" onClick={continueWithSso} disabled={busy}>Continue</button>
          </div>
        </details>
      )}

      <p className="auth-switch">
        {isLogin ? 'New to DGTL?' : 'Already have an account?'}{' '}
        <Link href={isLogin ? '/signup' : '/login'}>
          {isLogin ? 'Create account' : 'Sign in'}
        </Link>
      </p>
    </div>
  )
}
