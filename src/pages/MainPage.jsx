import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [inputText, setInputText] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
                {/* Prism light refraction — right side of card, behind text */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', borderRadius: '24px' }}>
                  <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '65%', height: '90%', background: 'radial-gradient(ellipse, rgba(34,211,238,0.09) 0%, transparent 60%)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(236,72,153,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', top: '30%', right: '15%', width: '35%', height: '45%', background: 'radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 60%)', borderRadius: '50%' }} />
                </div>

                {/* Card link */}
                <div
                  onClick={() => navigate('/fashion')}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    height: '100%',
                    padding: '3.5rem 4rem',
                    cursor: 'pointer',
                    color: 'inherit',
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '62%',
                  }}
                >
                  <h2 style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(2.8rem, 4.5vw, 4.8rem)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.03em',
                    margin: 0,
                    color: '#f0eff8',
                  }}>
                    Prism:{' '}
                    <span style={{ color: '#60a5fa' }}>Fashion</span>
                  </h2>

                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                    color: '#8a89a0',
                    maxWidth: '60ch',
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    Fashion is not bought, it is identified with. Prism: Fashion reads the aesthetic of your collection and returns three style aware customer profiles, each with their own archetype, spending habits, discovery channels, and the single message that turns a scroller into a buyer.
                  </p>

                  <span className="fashion-card-btn">
                    Open
                    <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                      <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
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
