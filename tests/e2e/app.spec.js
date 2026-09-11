import { test, expect } from 'playwright/test'
import { apiResponse } from '../fixtures.js'
import AxeBuilder from '@axe-core/playwright'

const endpoint = 'https://prismapi.arshamchabok.workers.dev/**'
const kinds = ['main', 'fashion', 'deploy', 'plate', 'fitness']
const routeFor = kind => kind === 'main' ? './' : `./#/${kind}`

for (const kind of kinds) {
  test(`${kind}: accessible input, generation, PDF export, and reset`, async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.route(endpoint, route => route.fulfill({ json: apiResponse(kind) }))
    await page.goto(routeFor(kind))
    const input = page.getByRole('textbox').first()
    await expect(input).toBeVisible()
    await expect(page.getByRole('button', { name: /Generate (Personas|Profiles)/ })).toBeDisabled()
    await input.fill('A neighborhood service for busy working families')
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
    await page.getByRole('button', { name: /Generate (Personas|Profiles)/ }).click()
    await expect(page.locator('.persona-card')).toHaveCount(3)
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
    await page.screenshot({ path: `test-results/${kind}-results.png`, fullPage: true })
    const downloadEvent = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download as PDF' }).click()
    const download = await downloadEvent
    await download.saveAs(`test-results/${kind}-report.pdf`)
    expect(await download.failure()).toBeNull()
    await page.getByRole('button', { name: /New (product|brand)/ }).click()
    await expect(input).toHaveValue('')
    expect(errors).toEqual([])
  })

  test(`${kind}: usable mobile layout and accessibility`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(routeFor(kind))
    await expect(page.getByRole('textbox').first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(results.violations).toEqual([])
    await page.screenshot({ path: `test-results/${kind}-mobile.png`, fullPage: true })
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.locator('#cardnav-panel').getByRole('link', { name: 'Privacy', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Privacy at Prism' })).toBeVisible()
  })
}

test('malformed AI results and upstream failures preserve the draft and allow retry', async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({ json: { content: [{ type: 'text', text: '[null,null,null]' }] } }))
  await page.goto('./')
  await page.getByRole('textbox').fill('A helpful service for busy families')
  await page.getByRole('button', { name: 'Generate Personas' }).click()
  await expect(page.getByRole('alert')).toContainText('invalid profile')
  await expect(page.getByRole('textbox')).toHaveValue('A helpful service for busy families')
  await page.unroute(endpoint)
  await page.route(endpoint, route => route.fulfill({ status: 429, json: { error: { message: 'private provider detail' } } }))
  await page.getByRole('button', { name: 'Generate Personas' }).click()
  await expect(page.getByRole('alert')).toContainText('wait a minute')
  await page.unroute(endpoint)
  await page.route(endpoint, route => route.fulfill({ json: apiResponse('main') }))
  await page.getByRole('button', { name: 'Generate Personas' }).click()
  await expect(page.locator('.persona-card')).toHaveCount(3)
})

test('cancel and navigation cannot display a late response', async ({ page }) => {
  let pending
  await page.route(endpoint, route => { pending = route })
  await page.goto('./')
  await page.getByRole('textbox').fill('A service with a delayed response')
  await page.getByRole('button', { name: 'Generate Personas' }).click()
  await expect(page.getByRole('button', { name: 'Cancel generation' })).toBeVisible()
  await page.getByRole('button', { name: 'Cancel generation' }).click()
  await expect(page.getByRole('textbox')).toHaveValue('A service with a delayed response')
  await pending.fulfill({ json: apiResponse('main') }).catch(() => {})
  await expect(page.locator('.persona-card')).toHaveCount(0)
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('link', { name: 'Go to Prism Fashion' }).click()
  await expect(page.getByRole('textbox')).toHaveValue('')
})

for (const kind of ['fashion', 'plate']) test(`${kind}: upload validation, preparation, removal, and image-only submission`, async ({ page }) => {
  let sent
  await page.route(endpoint, route => { sent = route.request().postDataJSON(); return route.fulfill({ json: apiResponse(kind) }) })
  await page.goto(routeFor(kind))
  const file = page.locator('input[type=file]')
  await file.setInputFiles({ name: 'wrong.txt', mimeType: 'text/plain', buffer: Buffer.from('private') })
  await expect(page.getByRole('alert')).toContainText('JPEG')
  await file.setInputFiles({ name: 'large.png', mimeType: 'image/png', buffer: Buffer.alloc(4 * 1024 * 1024 + 1) })
  await expect(page.getByRole('alert')).toContainText('4 MB')
  await file.setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not a real image') })
  await expect(page.getByRole('alert')).toContainText('could not be read')
  await file.setInputFiles('public/assets/fashion-card.jpg')
  await expect(page.getByRole('img', { name: 'Image prepared' })).toBeVisible()
  await page.getByRole('button', { name: 'Remove image' }).click()
  await expect(page.getByRole('button', { name: 'Generate Personas' })).toBeDisabled()
  await file.setInputFiles('public/assets/fashion-card.jpg')
  await page.getByRole('button', { name: 'Generate Personas' }).click()
  await expect(page.locator('.persona-card')).toHaveCount(3)
  expect(sent.messages[0].content[0].source.media_type).toBe('image/jpeg')
  expect(JSON.stringify(sent)).not.toContain('fashion-card.jpg')
})

test('URLs exclude secrets, fitness selection is sent, and no third party resources load on entry', async ({ page }) => {
  const requests = []
  let sent
  page.on('request', request => requests.push(request.url()))
  await page.route(endpoint, route => { sent = route.request().postDataJSON(); return route.fulfill({ json: apiResponse('deploy') }) })
  await page.goto('./#/deploy')
  await expect(page.getByRole('textbox').first()).toBeVisible()
  expect(requests.filter(url => !url.startsWith('http://127.0.0.1:4173/'))).toEqual([])
  await page.getByRole('textbox').first().fill('Software that automates routine work')
  await page.getByRole('button', { name: 'Add landing page or competitor URL' }).click()
  await page.getByRole('textbox', { name: 'Landing page or competitor URL' }).fill('https://user:password@example.com')
  await page.getByRole('button', { name: 'Generate Profiles' }).click()
  await expect(page.getByRole('alert')).toContainText('without login credentials')
  await page.getByRole('textbox', { name: 'Landing page or competitor URL' }).fill('https://example.com/product?token=secret#private')
  await page.getByRole('button', { name: 'Generate Profiles' }).click()
  await expect(page.locator('.persona-card')).toHaveCount(3)
  expect(sent.messages[0].content).toContain('https://example.com/product')
  expect(sent.messages[0].content).not.toMatch(/secret|private/)
  await page.unroute(endpoint)
  await page.route(endpoint, route => { sent = route.request().postDataJSON(); return route.fulfill({ json: apiResponse('fitness') }) })
  await page.goto('./#/fitness')
  await page.getByRole('button', { name: 'Performance', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Performance', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('textbox').fill('A gym for dedicated local athletes')
  await page.getByRole('button', { name: 'Generate Personas' }).click()
  await expect(page.locator('.persona-card')).toHaveCount(3)
  expect(sent.messages[0].content).toContain('Focus goal: Performance')
})

test('keyboard menu, unknown routes, narrow layout, and unavailable WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...args) { return type.includes('webgl') ? null : original.call(this, type, ...args) }
  })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  await expect(page.getByRole('textbox')).toBeVisible()
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('link', { name: 'Go to Prism Fashion' }).focus()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
  await page.setViewportSize({ width: 320, height: 568 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.goto('./#/unknown')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await page.getByRole('link', { name: 'Return to Prism' }).click()
  await expect(page.getByRole('textbox')).toBeVisible()
})
