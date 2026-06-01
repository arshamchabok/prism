import { Link } from 'react-router-dom'
import CardNav from '../components/CardNav.jsx'

export default function AboutPage() {
  return (
    <div id="app">
      <CardNav />

      <section className="about-section">
        <Link to="/" className="about-back">← Back to Prism</Link>

        <h1 className="about-headline">What is Prism?</h1>

        <div className="about-body">
          <p>Prism is an AI-powered customer intelligence tool built for founders, marketers, and business owners who are tired of guessing who their customer actually is.</p>

          <p>You type a short description of your product or service. Prism's AI thinks like a senior market strategist and returns three completely distinct customer personas in under ten seconds.</p>

          <p>Each persona is a different type of buyer — not three versions of the same person. They have different jobs, different budgets, different reasons for buying, and different ways of discovering products like yours.</p>

          <p>The three personas typically represent:</p>

          <div className="about-persona-list">
            <div className="about-persona-item">
              <strong>The Power User</strong>
              <p>Someone deeply embedded in the problem space, technical or experienced, who wants the most out of your product and will advocate for it if you win them over.</p>
            </div>
            <div className="about-persona-item">
              <strong>The Pragmatist</strong>
              <p>A busy decision-maker or mid-level professional who just needs the problem solved, doesn't want complexity, and is comparing you against alternatives.</p>
            </div>
            <div className="about-persona-item">
              <strong>The Skeptic</strong>
              <p>Someone who has the pain point but hasn't committed to solving it yet, needs to be convinced the juice is worth the squeeze, and responds to social proof and clear ROI.</p>
            </div>
          </div>

          <div className="about-includes">
            <p>Each persona includes: name, age, job title, location, a quote in their own voice, their goals, their daily pain points, how they discover products, and the exact messaging hook most likely to make them act.</p>
          </div>
        </div>
      </section>

      <div style={{ flex: 1 }} />

      <footer>
        <span className="footer-left">Prism &mdash; AI-powered customer intelligence</span>
        <div className="footer-right">
          <Link to="/about">About</Link>
          <a href="#">Privacy</a>
        </div>
      </footer>
    </div>
  )
}
