# Prism

A React application for exploring fictional customer personas across general products, fashion, B2B software, restaurants, and fitness. Vite builds the frontend for GitHub Pages at `/prism/`; a separate Cloudflare Worker calls Anthropic.

## Local development

Use Node 22.12+ (Node 22 LTS is used in CI).

```sh
npm ci
npm run dev
```

The development frontend runs at `http://localhost:3000`. For local generation, copy `.env.example` to `.env.local`, enable `VITE_API_URL=http://localhost:8787`, copy `.dev.vars.example` to `.dev.vars`, set your development API key, and run `npm run worker:dev` in a second terminal. Restart Vite after changing environment variables. Never put an API key in a `VITE_*` variable: these are public browser values.

## Verification

```sh
npm test
npm run build
npm run test:e2e
npm run worker:check
npm audit
```

Browser tests use installed Microsoft Edge on Windows and Playwright Chromium elsewhere. Install Chromium with `npx playwright install --with-deps chromium` on Linux. Tests mock AI responses; they cover all five generation flows, malformed output, errors, cancellation, image validation, sensitive URL removal, mobile layouts, keyboard navigation, accessibility, and PDF downloads without sending test inputs to Anthropic. `npm run preview` serves the production build at `http://localhost:4173/prism/`.

## Deployment

Pushing `main` runs `.github/workflows/deploy.yml`. Unit tests, production build, and browser tests must pass before GitHub Pages publishes. The frontend uses the existing Worker endpoint unless `VITE_API_URL` is supplied during the build.

**The API Worker is deployed separately.** Log in with `npx wrangler login`, ensure the `ANTHROPIC_API_KEY` Worker secret is configured (`npx wrangler secret put ANTHROPIC_API_KEY`), then run:

```sh
npm run worker:check
npm run worker:deploy
```

`wrangler.toml` includes both required rate-limiter bindings. The Worker fails closed if either binding or the API key is missing. Production accepts only `https://arshamchabok.github.io`; custom frontend hosts require an explicit comma-separated `ALLOWED_ORIGINS` Worker variable. Local origins belong in `.dev.vars`, not the production allowlist.

The request envelope remains compatible with the earlier frontend deployment. The updated Worker accepts only the five exact shared prompt templates, one bounded user message, supported image formats, and a fixed model/output-token ceiling. Deploy the Worker before changing prompt templates in future releases.

## Privacy and operational limits

- Inputs and results stay in page memory; application code does not persist or log their contents. Generation sends input through Cloudflare to Anthropic. Hosting and API providers have their own retention policies, linked from the Privacy page.
- Uploaded images are limited to 4 MB, resized to a maximum edge of 1568 pixels, and re-encoded in the browser to strip embedded metadata. Visible private information in an image remains visible. File names are not sent. Optional URL queries and fragments are removed, and embedded credentials are rejected; URLs are not fetched.
- CORS is not authentication. This remains a public, anonymous service. Limits are five requests per IP per minute and thirty total requests per minute **per Cloudflare location**, using eventually consistent counters. These are abuse mitigations, not a global billing cap. Set appropriate provider spending limits and monitor usage; a higher-traffic release may need authenticated quotas or bot verification. See [Cloudflare's rate-limit documentation](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
- API errors are sanitized, responses are not cached, and model output is validated before rendering. AI output is fictional and requires customer research to validate.
- Fonts are hosted locally. The PDF font is Noto Sans, distributed under the SIL Open Font License in `public/fonts/OFL.txt`. It supports Latin, Greek, and Cyrillic text; the app does not promise full PDF coverage of every writing system.
- Build output, dependencies, credentials, and local Cloudflare metadata are ignored. Removing previously tracked cache files does not erase historical Git commits. Do not commit secrets.

Legacy `about.html` and `clothing.html` links redirect to the maintained React routes.
