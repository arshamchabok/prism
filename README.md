# Prism — AI Customer Persona Generator

Turn a short product description into three research-grade customer personas, instantly.

## What it does

Prism takes a description of any product or service and generates three genuinely distinct customer personas — different roles, motivations, budgets, and decision-making styles. Each persona includes:

- Name, age, job title, and location
- One-line summary in the context of the product
- An authentic voice quote capturing their core frustration
- Goals & motivations
- Daily pain points
- Discovery channels
- A tailored messaging hook

## Setup

This is a single-file HTML app. No build step, no dependencies to install.

### Run locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/prism.git
cd prism

# Open directly in browser
open index.html

# Or serve with any static server
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080`

### Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set Source to `Deploy from a branch` → `main` → `/ (root)`
4. Your app will be live at `https://YOUR_USERNAME.github.io/prism/`

## API Key

This app calls the Anthropic API directly from the browser. The API key is handled by Claude's built-in artifact infrastructure — **no key setup needed** when running via Claude.

For standalone deployment outside of Claude, you would need to:
1. Add your Anthropic API key to the fetch headers
2. Consider proxying API calls through a backend to keep the key private

## Tech stack

- Vanilla HTML/CSS/JS — zero dependencies
- Anthropic Claude API (claude-sonnet-4-20250514)
- Google Fonts: Instrument Serif + DM Sans
- Single file, GitHub Pages compatible

## Project structure

```
prism/
├── index.html   # The entire app
└── README.md
```
