/** Keep authentication continuations on this application, including OAuth consent. */
export function safeAuthReturn(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u0020]/.test(value)) return '/user'
  const url = new URL(value, 'https://auth.dgtl.lk')
  return url.origin === 'https://auth.dgtl.lk' ? `${url.pathname}${url.search}${url.hash}` : '/user'
}
