export function allowedSeoCallback(destination: string, configured: string | undefined): boolean {
  try {
    const target = new URL(destination)
    return (configured ?? '').split(',').some((value) => {
      const allowed = new URL(value.trim())
      return !allowed.username && !allowed.password && !allowed.search && !allowed.hash &&
        (allowed.protocol === 'https:' || (allowed.protocol === 'http:' && allowed.hostname === 'localhost')) &&
        target.origin === allowed.origin && target.pathname === allowed.pathname &&
        !target.username && !target.password && !target.hash
    })
  } catch {
    return false
  }
}

export function allowedSeoScopes(scope: string): boolean {
  const scopes = scope.split(/\s+/).filter(Boolean)
  return scopes.includes('openid') && scopes.every((item) => ['openid', 'email', 'profile'].includes(item))
}
