import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from '../worker.js'
import { PROMPTS } from '../shared/prompts.js'
import { apiResponse } from './fixtures.js'

const origin = 'https://arshamchabok.github.io'
const payload = kind => ({ model: 'claude-sonnet-4-5', max_tokens: 5000, system: PROMPTS[kind], messages: [{ role: 'user', content: 'A service for busy families' }] })
const env = () => ({ ANTHROPIC_API_KEY: 'test-secret', PER_IP_LIMITER: { limit: async () => ({ success: true }) }, GLOBAL_LIMITER: { limit: async () => ({ success: true }) } })
const request = (body = payload('main'), headers = {}, method = 'POST', path = '/') => new Request(`https://worker.example${path}`, { method, headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers }, ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}) })

test('rejects other origins, missing origins, unknown routes, and unsupported methods', async () => {
  for (const bad of ['https://attacker.example', 'null', '']) assert.equal((await worker.fetch(request(undefined, { Origin: bad }), env())).status, 403)
  assert.equal((await worker.fetch(request(undefined, {}, 'GET'), env())).status, 405)
  assert.equal((await worker.fetch(request(undefined, {}, 'POST', '/other'), env())).status, 404)
  const response = await worker.fetch(request(undefined, {}, 'OPTIONS'), env())
  assert.equal(response.status, 204)
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin)
  assert.equal(response.headers.get('Access-Control-Allow-Credentials'), null)
})

test('rejects malformed, excessive, and arbitrary upstream requests before fetch', async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw Error('must not call upstream') })
  for (const body of ['invalid json', { ...payload('main'), system: 'Arbitrary chat prompt' }, { ...payload('main'), model: 'other' }, { ...payload('main'), max_tokens: 999999 }, { ...payload('main'), tools: [] }, { ...payload('main'), messages: [{ role: 'assistant', content: 'hello' }] }]) {
    assert.equal((await worker.fetch(request(body), env())).status, 400)
  }
  assert.equal((await worker.fetch(request(undefined, { 'Content-Type': 'text/plain' }), env())).status, 415)
  assert.equal((await worker.fetch(request('x'.repeat(6 * 1024 * 1024 + 1)), env())).status, 413)
  assert.equal(fetch.mock.callCount(), 0)
})

test('fails closed without abuse controls and enforces both rate limits', async () => {
  assert.equal((await worker.fetch(request(), {})).status, 503)
  for (const name of ['PER_IP_LIMITER', 'GLOBAL_LIMITER']) {
    const configured = env()
    configured[name].limit = async () => ({ success: false })
    const response = await worker.fetch(request(), configured)
    assert.equal(response.status, 429)
    assert.equal(response.headers.get('Retry-After'), '60')
  }
})

test('validates all five persona schemas and strips provider headers and private metadata', async t => {
  for (const kind of Object.keys(PROMPTS)) {
    const fetch = t.mock.method(globalThis, 'fetch', async (url, init) => {
      assert.equal(url, 'https://api.anthropic.com/v1/messages')
      assert.equal(init.headers['x-api-key'], 'test-secret')
      assert.equal(JSON.parse(init.body).max_tokens, 5000)
      return Response.json({ ...apiResponse(kind), private: 'hidden' }, { headers: { 'x-provider-secret': 'hidden' } })
    })
    const response = await worker.fetch(request(payload(kind)), env())
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('Cache-Control'), 'no-store')
    assert.equal(response.headers.get('x-provider-secret'), null)
    const data = await response.json()
    assert.equal(data.private, undefined)
    assert.equal(JSON.parse(data.content[0].text).length, 3)
    fetch.mock.restore()
  }
})

test('returns controlled errors for upstream rejection, timeout, and malformed results', async t => {
  for (const upstream of [() => new Response('private provider error', { status: 500 }), () => Response.json({ content: [{ type: 'text', text: '[null]' }] }), () => { throw new DOMException('secret detail', 'TimeoutError') }]) {
    const fetch = t.mock.method(globalThis, 'fetch', async () => upstream())
    const response = await worker.fetch(request(), env())
    assert.ok([502, 504].includes(response.status))
    assert.doesNotMatch(await response.text(), /private|secret/)
    fetch.mock.restore()
  }
})

test('checks image signatures, formats, sizes, and allowed tools', async t => {
  const body = payload('fashion')
  body.messages[0].content = [{ type: 'image', source: { type: 'base64', media_type: 'image/png', data: btoa('not an image') } }, { type: 'text', text: 'Clothing image' }]
  assert.equal((await worker.fetch(request(body), env())).status, 400)
  body.messages[0].content[0].source.data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aM1sAAAAASUVORK5CYII='
  t.mock.method(globalThis, 'fetch', async () => Response.json(apiResponse('fashion')))
  assert.equal((await worker.fetch(request(body), env())).status, 200)
  body.system = PROMPTS.main
  assert.equal((await worker.fetch(request(body), env())).status, 400)
})
