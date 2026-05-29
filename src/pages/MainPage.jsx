import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import InputPanel from '../components/InputPanel.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import PersonaCard from '../components/PersonaCard.jsx'
import { usePersonaGeneration } from '../hooks/usePersonaGeneration.js'
import { truncate } from '../utils/helpers.js'

export default function MainPage() {
  const { view, personas, productInput, error, handleGenerate, reset } = usePersonaGeneration()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const inputProgress = Math.min(scrollY / 600, 1)

  const handleReset = () => {
    reset()
    setScrollY(0)
    window.scrollTo(0, 0)
  }

  return (
    <div id="app" className="page-main">
      <Header variant="main" />

      {(view === 'input' || view === 'error') && (
        <div style={{ minHeight: '300vh', position: 'relative' }}>
          {/* FIXED: headline — always centered, never moves */}
          <div style={{
            position: 'fixed', top: '35%', left: 0, right: 0, zIndex: 2,
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <div className="hero-overlay" style={{ padding: '0 2.5rem' }}>
              <h1>Know your customer<br />before they know <em>you</em></h1>
              <p>Type what you sell. Get three razor sharp customer profiles back in seconds.</p>
            </div>
          </div>

          {/* FIXED: input box — reveals via opacity + blur as user scrolls 0–600px */}
          <div style={{
            position: 'fixed',
            top: '65%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '580px',
            maxWidth: 'calc(100% - 2rem)',
            zIndex: 3,
            opacity: inputProgress,
            filter: `blur(${(1 - inputProgress) * 12}px)`,
            pointerEvents: inputProgress > 0.5 ? 'auto' : 'none',
            transition: 'none',
          }}>
            <InputPanel onGenerate={handleGenerate} />
          </div>

          {/* STATIC: fashion section sits at bottom of the tall page */}
          <div style={{
            position: 'absolute',
            top: '200vh',
            left: 0,
            width: '100%',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <section className="fashion-section">
              <span className="fashion-section-eyebrow">✦ Prism: Fashion</span>
              <h2>Built for the way clothing brands actually sell</h2>
              <p>Upload a lookbook or describe your brand voice. Get three style-aware customer profiles — archetype, spending habits, discovery channels, and the hook that converts.</p>
              <a href="/clothing.html" className="fashion-section-btn">
                Open Prism: Fashion
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </section>
          </div>
        </div>
      )}

      {view === 'error' && (
        <div className="error-section" style={{ position: 'fixed', bottom: '7rem', left: 0, right: 0, zIndex: 5 }}>
          <div className="error-box">Something went wrong: {error}</div>
        </div>
      )}

      {view === 'loading' && <LoadingPanel message="Refracting your audience…" />}

      {view === 'results' && (
        <>
          <section className="results-section">
            <div className="results-header">
              <div>
                <div className="results-title">Your Customer Personas</div>
                <div className="results-subtitle">Generated for: <em>{truncate(productInput)}</em></div>
              </div>
              <button className="reset-btn" onClick={handleReset}>← New product</button>
            </div>
            <div className="personas-grid">
              {personas.map((p, i) => <PersonaCard key={i} persona={p} />)}
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
        </>
      )}
    </div>
  )
}
