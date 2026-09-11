import { Link } from 'react-router-dom'
import CardNav from '../components/CardNav.jsx'
import Footer from '../components/Footer.jsx'

const GLANCE = [
  ['No account', 'Prism asks for no sign-in, no email, and no payment details.'],
  ['Nothing stored by Prism', 'Inputs and results live in page memory until you reset, navigate away, or reload.'],
  ['No trackers', 'No analytics, no advertising, no third-party scripts. Fonts and images ship with the site.'],
  ['Three processors', 'GitHub Pages serves the page, Cloudflare handles the request, Anthropic generates the profiles.'],
]

export default function PrivacyPage() {
  return (
    <div id="app" className="page-fashion">
      <CardNav />
      <main id="main-content" className="doc">
        <Link to="/" className="doc-back">← Back to Prism</Link>

        <header className="doc-head">
          <p className="doc-eyebrow">Privacy</p>
          <h1 className="doc-title">Privacy at Prism</h1>
          <p className="doc-lead">
            Prism generates fictional customer profiles from the context you give it. This page says exactly what
            leaves your browser, who touches it, and what is kept — in the order you would ask.
          </p>
        </header>

        <div className="doc-layout">
          <nav className="doc-toc" aria-label="On this page">
            <a href="#glance">At a glance</a>
            <a href="#sent">What gets sent</a>
            <a href="#images">Images and URLs</a>
            <a href="#storage">Storage and retention</a>
            <a href="#providers">Who processes it</a>
            <a href="#limits">Rate limits and abuse</a>
            <a href="#advice">Use non-sensitive examples</a>
          </nav>

          <div className="doc-body">
            <section className="doc-section" id="glance">
              <h2>At a glance</h2>
              <div className="field-table field-table--two">
                {GLANCE.map(([label, note]) => (
                  <div className="field-row" key={label}>
                    <b>{label}</b>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="doc-section" id="sent">
              <h2>What gets sent</h2>
              <p>
                Nothing leaves your browser until you press Generate. At that point Prism sends your description, the
                fitness goal if you picked one, and any attached image or URL to a Cloudflare Worker, which forwards
                the request to Anthropic’s API. Only submit material you are comfortable sharing with those two
                services.
              </p>
              <p>
                The Worker accepts one bounded message against a fixed prompt and model. It does not accept arbitrary
                instructions, and it strips provider response headers and metadata before anything reaches your
                browser.
              </p>
            </section>

            <section className="doc-section" id="images">
              <h2>Images and URLs</h2>
              <p>
                Images are processed on your device before they are sent: Prism resizes them to a maximum edge of 1568
                pixels and re-encodes the pixels, which removes embedded file metadata such as GPS coordinates. File
                names are never sent. Anything visible in the picture is still visible to the model, so crop what you
                would not want read.
              </p>
              <p>
                For a URL, Prism removes the query string and fragment, rejects embedded credentials, and sends only
                the bare address as context. The page itself is never fetched or inspected.
              </p>
            </section>

            <section className="doc-section" id="storage">
              <h2>Storage and retention</h2>
              <p>
                Prism’s own code writes nothing to a database, a cookie, or browser storage, and does not log the
                contents of your input or results. They stay in page memory until you reset the tool, leave it, or
                reload. A PDF export is generated on your device and lives wherever you save it.
              </p>
            </section>

            <section className="doc-section" id="providers">
              <h2>Who processes it</h2>
              <p>
                GitHub Pages hosts the site, Cloudflare handles API requests, and Anthropic processes the generation
                itself. These providers may process network information such as IP addresses and retain service data
                under their own policies; Prism cannot promise zero retention on their behalf. Cloudflare also uses
                your IP address for temporary request limiting.
              </p>
              <p>
                Their policies: <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noreferrer">GitHub</a>,{' '}
                <a href="https://www.cloudflare.com/privacypolicy/" rel="noreferrer">Cloudflare</a>, and{' '}
                <a href="https://www.anthropic.com/legal/privacy" rel="noreferrer">Anthropic</a>.
              </p>
            </section>

            <section className="doc-section" id="limits">
              <h2>Rate limits and abuse</h2>
              <p>
                Prism is a public, anonymous service, so requests are limited to five per IP address per minute and
                thirty per minute per Cloudflare location. Those are abuse mitigations rather than a billing cap, and
                the counters are eventually consistent. If you hit one, the tool tells you to wait a minute.
              </p>
            </section>

            <section className="doc-section" id="advice">
              <h2>Use non-sensitive examples</h2>
              <p>
                Describe your product or audience in general terms. Leave out customer records, health information,
                access tokens, private URLs, and confidential business material. Generated names, quotes and behaviours
                are fictional; they are not information about identified people, and they should not be presented as
                such.
              </p>
              <div className="callout">
                <b>Questions about a specific request</b>
                <p>Prism keeps no record of it, so there is nothing to look up or delete. That is the trade: no history, no recovery.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
