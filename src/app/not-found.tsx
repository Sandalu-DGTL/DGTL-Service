import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <main className="error-page">
      <span className="eyebrow">404</span>
      <h1>That page is not part of this workspace.</h1>
      <Link className="primary-button" href="/">Return home</Link>
    </main>
  )
}
