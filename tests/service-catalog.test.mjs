import assert from 'node:assert/strict'
import test from 'node:test'
import { getDashboardServices } from '../src/lib/service-catalog.ts'

test('shows all four tools without inventing access for unassigned clients', () => {
  const services = getDashboardServices([])
  assert.deepEqual(services.map(({ key }) => key), ['cms', 'seo', 'hr', 'crm'])
  assert.ok(services.every(({ url }) => url === null))
})

test('keeps assigned destinations and additional service types', () => {
  const service = { key: 'seo', name: 'SEO', description: '', url: 'https://seo.dgtl.lk/' }
  const extra = { ...service, key: 'analytics' }
  const result = getDashboardServices([service, extra])
  assert.equal(result.find(({ key }) => key === 'seo').url, 'https://seo.dgtl.lk/sso')
  assert.equal(result.at(-1).url, service.url)
  assert.equal(result.at(-1).key, 'analytics')
  assert.equal(result.length, 5)
})

test('does not replace other hosts or missing SEO assignments', () => {
  for (const url of [null, 'https://example.com/seo']) {
    const result = getDashboardServices([{ key: 'seo', name: 'SEO', description: '', url }])
    assert.equal(result.find(({ key }) => key === 'seo').url, url)
  }
})

test('rejects executable, insecure, malformed and credential-bearing URLs', () => {
  for (const url of ['javascript:alert(1)', 'http://example.com', 'bad-url', 'https://user:pass@example.com']) {
    const result = getDashboardServices([{ key: 'seo', name: 'SEO', description: '', url }])
    assert.equal(result.find(({ key }) => key === 'seo').url, null)
  }
})
