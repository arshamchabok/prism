import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, isPreview, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiOrigin = new URL(env.VITE_API_URL || 'https://prismapi.arshamchabok.workers.dev').origin
  return {
    plugins: [react(), {
      name: 'production-security-policy',
      transformIndexHtml(html, context) {
        if (context.server) return html
        return [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' ${apiOrigin}; object-src 'none'; base-uri 'self'; form-action 'none'` }, injectTo: 'head-prepend' }]
      },
    }],
    base: command === 'build' || isPreview ? '/prism/' : '/',
    server: { port: 3000, strictPort: true },
  }
})
