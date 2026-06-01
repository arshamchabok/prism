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
          <p>Prism is an AI-powered customer intelligence tool built for founders, marketers, and business owners who need to understand their audience before they can sell to them. Describe what you offer and Prism returns three precise, distinct customer profiles in seconds.</p>

          <p>Every Prism tool works the same way. You give it context about your product, service, or brand, and the AI does the strategic thinking for you. Each profile covers who the customer is, what motivates them, how they discover things, and the message most likely to convert them.</p>

          <p>Prism is available across five focused tools, each built for a specific industry.</p>

          <div className="about-persona-list">
            <div className="about-persona-item">
              <strong>Prism</strong>
              <p>The general purpose tool. Describe any product or service and get three customer profiles covering demographics, motivations, objections, and the single message that moves someone from interested to bought in.</p>
            </div>
            <div className="about-persona-item">
              <strong>Prism Fashion</strong>
              <p>Built for clothing and lifestyle brands. Upload a lookbook or describe your label and Prism returns profiles calibrated to style, budget, and how your customers actually discover and shop for what you make.</p>
            </div>
            <div className="about-persona-item">
              <strong>Prism Deploy</strong>
              <p>Built for software products and SaaS companies. Describe your product or paste your landing page and Prism maps out the real people behind every buying decision so your outreach and messaging hit the right person with the right angle.</p>
            </div>
            <div className="about-persona-item">
              <strong>Prism Plate</strong>
              <p>Built for restaurants, cafes, and food brands. Describe your concept and Prism reveals who your diners are, what brings them through the door, and what keeps them coming back so you can fill seats and build loyalty.</p>
            </div>
            <div className="about-persona-item">
              <strong>Prism Fitness</strong>
              <p>Built for gyms, trainers, and wellness brands. Pick a goal type, describe your program, and Prism shows you exactly who you are reaching and what keeps them committed so you can grow your membership and reduce churn.</p>
            </div>
          </div>

          <div className="about-includes">
            <p>Every profile includes a name, age, job title, location, a quote in their own voice, their goals, daily frustrations, how they find products, and the one message most likely to make them act.</p>
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
