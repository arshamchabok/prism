import { MAX_TOKENS, PROMPTS } from './shared/prompts.js'
import { IMAGE_LIMIT, parsePersonas } from './shared/personas.js'

const MAX_BODY = 6 * 1024 * 1024
const productionOrigin = 'https://arshamchabok.github.io'

// Sonnet 5 is the current generation of the tier this app already used: same
// class of output, lower per-token price than sonnet-4-5.
const MODEL = 'claude-sonnet-5'

// Cost controls, in the order they matter here:
// - thinking off: this is structured writing, not reasoning, and thinking
//   tokens bill at output rates.
// - effort medium: enough for a creative brief, less spend than the default.
// - cache_control: repeated prompts inside the 5 minute window read at ~10%.
// - per-tool max_tokens: a truncated response costs a full retry, so the cap
//   sits above the observed ceiling and well under the old flat 5000.
const TUNING = {
  thinking: { type: 'disabled' },
  output_config: { effort: 'medium' },
}

async function readBody(request) {
  if (Number(request.headers.get('Content-Length')) > MAX_BODY) throw new RangeError()
  const reader = request.body?.getReader()
  if (!reader) throw new Error()
  const chunks = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BODY) { await reader.cancel(); throw new RangeError() }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
  return JSON.parse(new TextDecoder().decode(bytes))
}

export function validateRequest(body) {
  if (!body || typeof body !== 'object' || Object.keys(body).some(key => !['tool', 'messages'].includes(key))) throw new Error()
  const kind = body.tool
  if (typeof kind !== 'string' || !Object.hasOwn(PROMPTS, kind)) throw new Error()
  if (!Array.isArray(body.messages) || body.messages.length !== 1 || body.messages[0]?.role !== 'user') throw new Error()
  const validText = value => typeof value === 'string' && value.trim().length >= 5 && value.length <= 4000
  let content = body.messages[0].content
  if (typeof content === 'string') {
    if (!validText(content)) throw new Error()
  } else {
    if (!['fashion', 'plate'].includes(kind) || !Array.isArray(content) || content.length !== 2) throw new Error()
    const image = content.find(block => block?.type === 'image')?.source
    const text = content.find(block => block?.type === 'text')?.text
    if (!image || image.type !== 'base64' || !['image/jpeg', 'image/png', 'image/webp'].includes(image.media_type) || typeof image.data !== 'string' || !image.data.length || image.data.length > Math.ceil(IMAGE_LIMIT / 3) * 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image.data) || image.data.length % 4 !== 0 || !validText(text)) throw new Error()
    const prefix = atob(image.data.slice(0, 32))
    const matches = image.media_type === 'image/jpeg' ? prefix.startsWith('\xff\xd8\xff') : image.media_type === 'image/png' ? prefix.startsWith('\x89PNG\r\n\x1a\n') : prefix.startsWith('RIFF') && prefix.slice(8, 12) === 'WEBP'
    if (!matches) throw new Error()
    content = [{ type: 'image', source: { type: 'base64', media_type: image.media_type, data: image.data } }, { type: 'text', text }]
  }
  const payload = {
    model: MODEL,
    max_tokens: MAX_TOKENS[kind],
    ...TUNING,
    system: [{ type: 'text', text: PROMPTS[kind], cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content }],
  }
  return { kind, payload }
}

// The tuning fields are optional by design: if the account or model rejects
// one, the generation still completes on the plain request instead of failing.
async function callAnthropic(payload, key) {
  const send = body => fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal: AbortSignal.timeout(80000),
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(body),
  })
  const response = await send(payload)
  if (response.status !== 400) return response
  await response.body?.cancel()
  const { thinking, output_config, ...plain } = payload
  return send({ ...plain, system: plain.system[0].text })
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const allowed = new Set((env.ALLOWED_ORIGINS || productionOrigin).split(',').map(value => value.trim()))
    const headers = {
      'Content-Type': 'application/json', 'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Vary': 'Origin',
      ...(allowed.has(origin) ? { 'Access-Control-Allow-Origin': origin } : {}),
    }
    const json = (status, message, extra = {}) => new Response(JSON.stringify({ error: { message } }), { status, headers: { ...headers, ...extra } })
    if (new URL(request.url).pathname !== '/') return json(404, 'Not found.')
    if (!allowed.has(origin)) return json(403, 'Origin not allowed.')
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' } })
    if (request.method !== 'POST') return json(405, 'Method not allowed.', { Allow: 'POST, OPTIONS' })
    if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return json(415, 'Use application/json.')
    // CORS is not authentication; require abuse controls as well.
    if (!env.ANTHROPIC_API_KEY || !env.PER_IP_LIMITER || !env.GLOBAL_LIMITER) return json(503, 'Generation is temporarily unavailable.')
    try {
      const ip = request.headers.get('CF-Connecting-IP')
      if (!ip) return json(403, 'Request could not be verified.')
      const client = await env.PER_IP_LIMITER.limit({ key: ip })
      if (!client.success) return json(429, 'Please wait before trying again.', { 'Retry-After': '60' })
      const global = await env.GLOBAL_LIMITER.limit({ key: 'generation' })
      if (!global.success) return json(429, 'Generation is busy. Please try again shortly.', { 'Retry-After': '60' })
    } catch { return json(503, 'Generation is temporarily unavailable.') }
    let validated
    try { validated = validateRequest(await readBody(request)) }
    catch (error) { return json(error instanceof RangeError ? 413 : 400, 'Invalid generation request.') }
    try {
      const response = await callAnthropic(validated.payload, env.ANTHROPIC_API_KEY)
      if (!response.ok) {
        await response.body?.cancel()
        return json(response.status === 429 ? 429 : response.status === 400 ? 400 : 502, 'Generation is temporarily unavailable.')
      }
      const personas = parsePersonas(await response.json(), validated.kind)
      return new Response(JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(personas) }], stop_reason: 'end_turn' }), { headers })
    } catch (error) {
      return json(error.name === 'TimeoutError' ? 504 : 502, 'Generation could not finish. Please try again.')
    }
  },
}
