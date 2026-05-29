import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import InputPanel from '../components/InputPanel.jsx'
import SpotlightCard from '../components/SpotlightCard.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import PersonaCard from '../components/PersonaCard.jsx'
import { usePersonaGeneration } from '../hooks/usePersonaGeneration.js'
import { truncate } from '../utils/helpers.js'

const EXAMPLES = [
  { label: 'Meal kit delivery', text: 'A meal kit delivery service targeting busy families who want to cook healthy dinners at home without the hassle of grocery shopping' },
  { label: 'B2B project management', text: 'A B2B project management platform built for remote software engineering teams who need real-time collaboration across time zones' },
  { label: 'First-time homebuyer app', text: 'A mobile app that helps first-time homebuyers understand the mortgage process, compare loan options, and track their application status' },
  { label: 'Freelance design marketplace', text: 'An online marketplace connecting independent graphic designers with small business owners who need affordable brand identity work' },
]

export default function MainPage() {
  const { view, personas, productInput, error, handleGenerate, reset } = usePersonaGeneration()
  const [scrollY, setScrollY] = useState(0)
  const [inputText, setInputText] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Phase 1: 0–800px — hero shrinks + input reveals
  const p1 = Math.min(scrollY / 800, 1)
  const heroScale = 1 - 0.15 * p1
  const heroTranslateY = -150 * p1
  const inputTranslateY = 120 * (1 - p1)
  const inputBlur = 16 * (1 - p1)
  const inputOpacity = p1

  // Phase 2: 1400–2200px — fashion card + blur overlay reveal, input fades out
  const p2 = Math.min(Math.max((scrollY - 1400) / 800, 0), 1)
  const fashionScale = 0.85 + 0.15 * p2
  const blurAmount = 12 * p2
  const inputFinalOpacity = inputOpacity * (1 - p2)

  const handleReset = () => {
    reset()
    setInputText('')
    setScrollY(0)
    window.scrollTo(0, 0)
  }

  return (
    <div id="app" className="page-main">
      <Header variant="main" />

      {(view === 'input' || view === 'error') && (
        <div style={{ minHeight: '500vh', position: 'relative' }}>

          {/* FIXED: hero — centered on load */}
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

          {/* FIXED: input + pills — rises from below during phase 1, fades out during phase 2 */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '100%',
            maxWidth: '700px',
            zIndex: 3,
            transform: `translateX(-50%) translateY(${inputTranslateY}px)`,
            opacity: inputFinalOpacity,
            filter: `blur(${inputBlur}px)`,
            pointerEvents: p1 > 0.75 && p2 < 0.5 ? 'auto' : 'none',
          }}>
            <InputPanel
              value={inputText}
              onChange={setInputText}
              onGenerate={handleGenerate}
            />
            <div className="examples-row" style={{ padding: '0 0.75rem' }}>
              <span className="examples-row-label">Try:</span>
              {EXAMPLES.map(e => (
                <button
                  key={e.label}
                  className="example-pill"
                  onClick={() => setInputText(e.text)}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* FIXED: blur overlay — fades in during phase 2, sits between input (z3) and card (z5) */}
          {p2 > 0 && (
            <div style={{
              position: 'fixed',
              inset: 0,
              zIndex: 4,
              backdropFilter: `blur(${blurAmount}px)`,
              WebkitBackdropFilter: `blur(${blurAmount}px)`,
              background: `rgba(5, 4, 12, ${0.4 * p2})`,
              opacity: p2,
              pointerEvents: 'none',
            }} />
          )}

          {/* FIXED: fashion SpotlightCard — reveals during phase 2, z-index above blur */}
          {p2 > 0 && (
            <div
              className="fashion-reveal-wrapper"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                width: '70vw',
                maxWidth: '900px',
                height: '60vh',
                minHeight: '320px',
                zIndex: 5,
                transform: `translate(-50%, -50%) scale(${fashionScale})`,
                opacity: p2,
                pointerEvents: p2 > 0.5 ? 'auto' : 'none',
              }}
            >
              <SpotlightCard className="fashion-spotlight-card" spotlightColor="rgba(34, 211, 238, 0.25)">
                {/* Decorative color blobs */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', borderRadius: '24px' }}>
                  <div style={{ position: 'absolute', top: '-15%', right: '-8%', width: '55%', height: '80%', background: 'radial-gradient(ellipse, rgba(34,211,238,0.11) 0%, transparent 65%)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '45%', height: '65%', background: 'radial-gradient(ellipse, rgba(236,72,153,0.09) 0%, transparent 65%)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', top: '25%', left: '30%', width: '40%', height: '55%', background: 'radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 65%)', borderRadius: '50%' }} />
                </div>

                {/* Card link — fills the full card */}
                <a
                  href="/clothing.html"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.25rem',
                    height: '100%',
                    padding: '3rem 3.5rem',
                    textDecoration: 'none',
                    color: 'inherit',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#22d3ee',
                  }}>
                    ✦ Prism
                  </span>

                  <h2 style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(2.8rem, 5vw, 5rem)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.03em',
                    margin: 0,
                    color: 'var(--text)',
                  }}>
                    Prism:{' '}
                    <span style={{
                      background: 'linear-gradient(135deg, #7c6cfa, #22d3ee)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>Fashion</span>
                  </h2>

                  <p style={{
                    fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
                    color: 'rgba(240, 240, 248, 0.55)',
                    maxWidth: '400px',
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    For the brands people wear, not just buy.
                  </p>

                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, #7c6cfa, #22d3ee)',
                    color: '#fff',
                    borderRadius: '999px',
                    padding: '0.8rem 1.75rem',
                    fontSize: '14px',
                    fontWeight: 700,
                    marginTop: '0.5rem',
                    boxShadow: '0 12px 40px rgba(124, 108, 250, 0.3)',
                  }}>
                    Open
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                      <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </a>
              </SpotlightCard>
            </div>
          )}
        </div>
      )}

      {view === 'error' && (
        <div className="error-section" style={{ position: 'fixed', bottom: '7rem', left: 0, right: 0, zIndex: 6 }}>
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
