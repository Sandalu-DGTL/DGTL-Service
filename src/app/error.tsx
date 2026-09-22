'use client'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="error-page">
      <span className="eyebrow">DGTL Service Hub</span>
      <h1>We could not load this page.</h1>
      <p>Check that the frontend, backend and Supabase environment variables are connected.</p>
      <button className="primary-button" onClick={reset}>Try again</button>
    </main>
  )
}
