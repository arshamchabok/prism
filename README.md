# Prism

A React application for exploring fictional customer personas across general products, fashion, B2B software, restaurants, and fitness. Vite builds the frontend for GitHub Pages at `/prism/`; a separate Cloudflare Worker calls Anthropic.

Every tool is a single screen with nothing below it — headline, input, examples — so there is no scrolling on the way to generating. The four industry tools live in the toolbar menu. On the results view, clicking a profile opens it full width at a larger reading size.

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

Browser tests use installed Microsoft Edge on Windows and Playwright Chromium elsewhere. Install Chromium with `npx playwright install --with-deps chromium` on Linux. Tests mock AI responses; they cover all five generation flows, malformed output, errors, cancellation, image validation, sensitive URL removal, mobile layouts, keyboard navigation, WCAG 2.1 AA checks with axe on every view, and PDF downloads without sending test inputs to Anthropic. `npm run preview` serves the production build at `http://localhost:4173/prism/`.

## Deployment

Pushing `main` runs `.github/workflows/deploy.yml`. Unit tests, production build, and browser tests must pass before GitHub Pages publishes. The frontend uses the existing Worker endpoint unless `VITE_API_URL` is supplied during the build.

**The API Worker is deployed separately, and this release changes the request format — deploy it whenever the frontend ships.** Log in with `npx wrangler login`, ensure the `ANTHROPIC_API_KEY` Worker secret is configured (`npx wrangler secret put ANTHROPIC_API_KEY`), then run:

```sh
npm run worker:check
npm run worker:deploy
```

`wrangler.toml` includes both required rate-limiter bindings. The Worker fails closed if either binding or the API key is missing. Production accepts only `https://arshamchabok.github.io`; custom frontend hosts require an explicit comma-separated `ALLOWED_ORIGINS` Worker variable. Local origins belong in `.dev.vars`, not the production allowlist.

## Request format and model cost

The browser sends `{ "tool": "main" | "fashion" | "deploy" | "plate" | "fitness", "messages": [one user message] }` and nothing else. The Worker owns the model, the system prompt, the token ceiling and every tuning flag, so none of them can be set from a browser. Any other key is rejected before a request reaches Anthropic.

Generation cost is controlled in four places:

- **Model.** `claude-sonnet-5`, the current generation of the tier this app already used, at $2/$10 per million tokens against $3/$15 for `claude-sonnet-4-5`.
- **Thinking off.** This is structured writing, not reasoning, and thinking tokens bill at output rates. Sonnet 5 runs adaptive thinking when the field is omitted, so leaving it out would have raised the bill for no gain.
- **Prompts.** The five prompts share one core block covering the output contract, distinctness, the specificity test, voice and safety; each tool block carries only its schema, its archetypes and its industry calibration. The industry prompts are 33–58% smaller than the previous ones and more directive.
- **Per-tool `max_tokens`.** Between 2,600 and 3,600 instead of a flat 5,000, set above the observed ceiling — truncated output costs a full retry, which is more expensive than the headroom.

The system prompt carries a `cache_control` breakpoint, so repeat generations of the same tool inside the five-minute window read the prompt at cache rates. If the account or model rejects the optional tuning fields, the Worker retries the same generation once without them rather than failing.

These limits are cost *shaping*, not a cap. Set a spend limit in the Anthropic console as well.

## Privacy and operational limits

- Inputs and results stay in page memory; application code does not persist or log their contents. Generation sends input through Cloudflare to Anthropic. Hosting and API providers have their own retention policies, linked from the Privacy page.
- Uploaded images are limited to 4 MB, resized to a maximum edge of 1568 pixels, and re-encoded in the browser to strip embedded metadata. Visible private information in an image remains visible. File names are not sent. Optional URL queries and fragments are removed, and embedded credentials are rejected; URLs are not fetched.
- CORS is not authentication. This remains a public, anonymous service. Limits are five requests per IP per minute and thirty total requests per minute **per Cloudflare location**, using eventually consistent counters. These are abuse mitigations, not a global billing cap. Set appropriate provider spending limits and monitor usage; a higher-traffic release may need authenticated quotas or bot verification. See [Cloudflare's rate-limit documentation](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
- API errors are sanitized, responses are not cached, and model output is validated before rendering. AI output is fictional and requires customer research to validate.
- Fonts are hosted locally. The PDF font is Noto Sans, distributed under the SIL Open Font License in `public/fonts/OFL.txt`. It supports Latin, Greek, and Cyrillic text; the app does not promise full PDF coverage of every writing system.
- Build output, dependencies, credentials, and local Cloudflare metadata are ignored. Removing previously tracked cache files does not erase historical Git commits. Do not commit secrets.

Legacy `about.html` and `clothing.html` links redirect to the maintained React routes.
