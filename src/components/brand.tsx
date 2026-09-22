import Link from 'next/link'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="DGTL home">
      <span className="brand-mark" aria-hidden="true">
        D
      </span>
      {!compact && (
        <span className="brand-copy">
          <strong>DGTL</strong>
          <small>Service Hub</small>
        </span>
      )}
    </Link>
  )
}
