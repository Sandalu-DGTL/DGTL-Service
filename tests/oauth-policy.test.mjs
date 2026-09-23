import assert from 'node:assert/strict'
import { test } from 'node:test'
import { safeAuthReturn } from '../src/lib/auth-return.ts'
import { allowedSeoCallback, allowedSeoScopes } from '../src/lib/oauth-policy.ts'

test('login preserves a local OAuth authorization continuation', () => {
  const next = '/oauth/consent?authorization_id=request-123'
  assert.equal(safeAuthReturn(next), next)
})
test('login rejects external or ambiguous return paths', () => {
  for (const value of ['https://evil.test', '//evil.test', '/\\evil.test', '/\tevil.test', undefined]) {
    assert.equal(safeAuthReturn(value), '/user')
  }
})
test('callback permits only exact first-party origins and paths', () => {
  const allowed = 'https://seo.dgtl.lk/api/auth/oauth2/callback/dgtl-sso'
  assert.equal(allowedSeoCallback(`${allowed}?code=one-time&state=bound`, allowed), true)
  for (const url of ['https://evil.test/api/auth/oauth2/callback/dgtl-sso', `${allowed}/extra`, `${allowed}#secret`, 'http://seo.dgtl.lk/api/auth/oauth2/callback/dgtl-sso']) {
    assert.equal(allowedSeoCallback(url, allowed), false)
  }
  assert.equal(allowedSeoCallback(allowed, undefined), false)
})
test('auto approval denies expanded scopes', () => {
  assert.equal(allowedSeoScopes('openid email profile'), true)
  assert.equal(allowedSeoScopes('openid email profile admin'), false)
  assert.equal(allowedSeoScopes('email'), false)
})
