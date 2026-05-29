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

  const progress = Math.min(scrollY / 400, 1)

  const heroScale = 1 - 0.15 * progress
  const heroTranslateY = -120 * progress

  const inputTranslateY = 120 * (1 - progress)
  const inputBlur = 16 * (1 - progress)
  const inputOpacity = progress

  const handleReset = () => {
    reset()
    setScrollY(0)
    window.scrollTo(0, 0)
  }

  return (
    <div id="app" className="page-main">
      <Header variant="main" />

      {(view === 'input' || view === 'error') && (
        <div style={{ minHeight: '320vh', position: 'relative' }}>

          {/* FIXED: hero — centered on load, scales up and moves on scroll */}
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            pointerEvents: 'none',
          }}>
            <div style={{
              textAlign: 'center',
              padding: '0 2.5rem',
              maxWidth: '900px',
              transform: `scale(${heroScale}) translateY(${heroTranslateY}px)`,
              transformOrigin: 'center center',
            }}>
              <h1 style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(3.5rem, 7vw, 6rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                color: 'var(--text)',
                margin: '0 0 1rem',
              }}>
                Know your customer before they know{' '}
                <em style={{
                  fontStyle: 'italic',
                  color: '#fb7185',
                  WebkitTextFillColor: '#fb7185',
                  background: 'none',
                  WebkitBackgroundClip: 'unset',
                  backgroundClip: 'unset',
                }}>you</em>
              </h1>
              <p style={{
                fontSize: '1.08rem',
                color: 'rgba(240, 240, 248, 0.6)',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: 1.8,
              }}>
                Type what you sell. Get three razor sharp customer profiles back in seconds.
              </p>
            </div>
          </div>

          {/* FIXED: input box — rises from below as user scrolls 0–400px */}
          <div style={{
            position: 'fixed',
            top: '57%',
            left: '50%',
            width: '100%',
            maxWidth: '700px',
            zIndex: 3,
            transform: `translateX(-50%) translateY(${inputTranslateY}px)`,
            opacity: inputOpacity,
            filter: `blur(${inputBlur}px)`,
            pointerEvents: progress > 0.75 ? 'auto' : 'none',
          }}>
            <InputPanel onGenerate={handleGenerate} />
          </div>

          {/* STATIC: fashion section — only visible far below, after a lot of scrolling */}
          <div style={{
            position: 'absolute',
            top: '220vh',
            left: 0,
            width: '100%',
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
