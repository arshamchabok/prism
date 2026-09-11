import { Link } from 'react-router-dom'
import CardNav from '../components/CardNav.jsx'
import Footer from '../components/Footer.jsx'
import { ALL_VERTICALS } from '../data/verticals.js'

const STEPS = [
  ['Describe what you sell', 'One paragraph is enough. Fashion and Plate also read an uploaded image; Deploy takes an optional URL as context.'],
  ['Prism splits the input', 'A single description goes to Claude with a prompt written for that industry, and comes back as three deliberately different people.'],
  ['Take them to a real person', 'Use the goals, objections and hooks as interview questions. Keep what survives contact with a customer.'],
]

const PROFILE_FIELDS = [
  ['Name, age, role, location', 'A specific person, not a demographic bracket.'],
  ['A quote in their voice', 'How they would describe the problem to a friend.'],
  ['Goals', 'What they are trying to get done, in their terms.'],
  ['Pain points', 'The friction that sends them looking for an alternative.'],
  ['Discovery channels', 'The named places they would actually run into you.'],
  ['Messaging hook', 'The one sentence written to this person alone.'],
]

export default function AboutPage() {
  return (
    <div id="app" className="page-deploy">
      <CardNav />
      <main id="main-content" className="doc">
        <Link to="/" className="doc-back">← Back to Prism</Link>

        <header className="doc-head">
          <p className="doc-eyebrow">About</p>
          <h1 className="doc-title">One description in, <em>three customers</em> out.</h1>
          <p className="doc-lead">
            Prism is a customer research starting point for founders, marketers and operators. You describe what you
            offer; it returns three fictional profiles built to disagree with each other, so you leave with hypotheses
            worth testing instead of one flattering guess.
          </p>
        </header>

        <div className="doc-layout">
          <nav className="doc-toc" aria-label="On this page">
            <a href="#how">How it works</a>
            <a href="#tools">The five tools</a>
            <a href="#profile">What a profile contains</a>
            <a href="#limits">What Prism is not</a>
            <a href="#built">How it is built</a>
          </nav>

          <div className="doc-body">
            <section className="doc-section" id="how">
              <h2>How it works</h2>
              <div className="doc-steps">
                {STEPS.map(([title, body]) => (
                  <div className="doc-step" key={title}>
                    <b>{title}</b>
                    <span>{body}</span>
                  </div>
                ))}
              </div>
              <p>
                Generation takes around thirty seconds. Nothing is saved: close the tab and the profiles are gone, so
                export the PDF if you want to keep them.
              </p>
            </section>

            <section className="doc-section" id="tools">
              <h2>The five tools</h2>
              <p>
                Every tool asks for the same thing and returns the same shape of answer. What changes is the prompt
                behind it — each one is written around how its industry actually buys.
              </p>
              <div className="tool-grid">
                <div className="tool-entry" style={{ '--tool': '#fb7185' }}>
                  <b>Prism</b>
                  <span>The general tool. Any product or service, three distinct buyer segments with different budgets and triggers.</span>
                  <span className="tool-meta">You are here</span>
                </div>
                {ALL_VERTICALS.map(tool => (
                  <Link className="tool-entry" key={tool.label} to={tool.route} style={{ '--tool': tool.accent }}>
                    <b>Prism {tool.label}</b>
                    <span>{tool.description}</span>
                    <span className="tool-meta">{tool.tag}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="doc-section" id="profile">
              <h2>What a profile contains</h2>
              <div className="field-table">
                {PROFILE_FIELDS.map(([label, note]) => (
                  <div className="field-row" key={label}>
                    <b>{label}</b>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
              <p>
                Industry tools add their own fields: a style archetype and monthly budget in Fashion, buying role and
                adoption blockers in Deploy, average spend and loyalty driver in Plate, experience level and the
                obstacle that breaks the streak in Fitness.
              </p>
            </section>

            <section className="doc-section" id="limits">
              <h2>What Prism is not</h2>
              <p>
                It is not research. Names, quotes, numbers and habits are generated hypotheses — plausible, specific,
                and unverified. A persona is useful because it gives you something concrete to disprove, not because it
                is true. Treat any figure it produces as a prompt for a question, never as a finding.
              </p>
              <div className="callout">
                <b>Before you act on a profile</b>
                <p>Find three real people who look like it and ask them the questions it implies. Keep the parts they recognise.</p>
              </div>
            </section>

            <section className="doc-section" id="built">
              <h2>How it is built</h2>
              <p>
                A React single-page app built with Vite and hosted on GitHub Pages. Generation runs through a
                Cloudflare Worker that holds the API key, pins the model and prompt, enforces per-IP and global rate
                limits, validates every image and URL, and checks the model output against a schema before the browser
                ever sees it. The browser never holds a key and never talks to Anthropic directly.
              </p>
              <ul className="stack-list">
                <li>React + Vite</li>
                <li>Cloudflare Workers</li>
                <li>Claude API</li>
                <li>WebGL background (OGL)</li>
                <li>GSAP + Motion</li>
                <li>Playwright + axe</li>
              </ul>
              <p>
                Read the <Link to="/privacy">privacy page</Link> for exactly what leaves your browser and who processes it.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
