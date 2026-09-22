import Link from 'next/link'
import { Brand } from '@/components/brand'
import { SignOutButton } from '@/components/sign-out-button'

export function AppHeader({
  name,
  role,
}: {
  name: string
  role: 'admin' | 'client'
}) {
  return (
    <header className="app-header">
      <Brand />
      <nav className="app-nav" aria-label="Account navigation">
        <Link href={role === 'admin' ? '/admin' : '/user'}>
          {role === 'admin' ? 'Admin console' : 'My services'}
        </Link>
        <span className="user-pill">
          <span className="avatar" aria-hidden="true">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <span>
            <strong>{name}</strong>
            <small>{role}</small>
          </span>
        </span>
        <SignOutButton />
      </nav>
    </header>
  )
}
