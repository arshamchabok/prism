import { PROMPTS } from '../shared/prompts.js'
import { cleanUrl, GOALS, IMAGE_LIMIT, parsePersonas, TEXT_LIMIT } from '../shared/personas.js'

export async function requestPersonas(kind, description, extra, signal) {
  const input = description.trim()
  const hasImage = ['fashion', 'plate'].includes(kind) && extra
  if (input.length > TEXT_LIMIT || (!hasImage && input.length < (kind === 'main' ? 10 : 5))) throw new Error('Please add a short description (up to 800 characters).')
  let content = `Product or brand description: ${input}`
  if (kind === 'deploy' && extra) content += `\nPublic URL for context only (not fetched): ${cleanUrl(extra)}`
  if (kind === 'fitness' && extra) {
    if (!GOALS.includes(extra)) throw new Error('Choose one of the listed fitness goals.')
    content += `\nFocus goal: ${extra}`
  }
  if (hasImage) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(extra.mediaType) || typeof extra.base64 !== 'string' || extra.base64.length > Math.ceil(IMAGE_LIMIT / 3) * 4) throw new Error('Choose a JPEG, PNG, or WebP image under 4 MB.')
    content = [{ type: 'image', source: { type: 'base64', media_type: extra.mediaType, data: extra.base64 } }, { type: 'text', text: content }]
  }
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  if (signal?.aborted) controller.abort()
  let timedOut = false
  const timer = setTimeout(() => { timedOut = true; controller.abort() }, 90000)
  try {
    const response = await fetch(import.meta.env.VITE_API_URL || 'https://prismapi.arshamchabok.workers.dev', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', signal: controller.signal,
      body: JSON.stringify({ model: 'claude-sonnet-4-5', max_tokens: 5000, system: PROMPTS[kind], messages: [{ role: 'user', content }] }),
    })
    if (!response.ok) {
      if (response.status === 429) throw new Error('Too many requests. Please wait a minute and try again.')
      if (response.status === 413) throw new Error('This image is too large. Please choose a smaller image.')
      if (response.status === 400) throw new Error('The request could not be processed. Check your description and image, then try again.')
      throw new Error('Persona generation is temporarily unavailable. Please try again shortly.')
    }
    return parsePersonas(await response.json(), kind)
  } catch (error) {
    if (timedOut) throw new Error('Generation took too long. Please try again.')
    if (error instanceof TypeError) throw new Error('Could not connect. Check your connection and try again.')
    throw error
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}
