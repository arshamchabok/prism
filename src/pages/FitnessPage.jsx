import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import FitnessInputPanel from '../components/FitnessInputPanel.jsx'
import SpotlightCard from '../components/SpotlightCard.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import FitnessPersonaCard from '../components/FitnessPersonaCard.jsx'
import { useFitnessGeneration } from '../hooks/useFitnessGeneration.js'
import { truncate } from '../utils/helpers.js'
import { downloadPersonasPdf } from '../utils/downloadPdf.js'

const FITNESS_EXAMPLES = [
  { label: 'Boutique HIIT studio', text: 'A boutique HIIT studio offering 45-minute group classes for busy professionals who want efficient results without a long gym commitment' },
  { label: 'Online personal trainer', text: 'An online personal training service pairing remote clients with certified coaches for 12-week customized strength and nutrition programs' },
  { label: 'Yoga & wellness studio', text: 'A yoga and mindfulness wellness studio serving adults seeking stress relief, flexibility, and a supportive community in an urban neighborhood' },
  { label: 'CrossFit gym', text: 'A CrossFit affiliate gym focused on building a tight-knit community of athletes who push each other toward elite functional fitness' },
]

export default function FitnessPage() {
  const { view, personas, brandInput, error, handleGenerate, reset } = useFitnessGeneration()
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [inputText, setInputText] = useState('')
  const [goalType, setGoalType] = useState(null)

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

  // Phase 2: 1400–2200px — card + blur overlay reveal, input fades out
  const p2 = Math.min(Math.max((scrollY - 1400) / 800, 0), 1)
  const cardScale = 0.85 + 0.15 * p2
  const blurAmount = 12 * p2
  const inputFinalOpacity = inputOpacity * (1 - p2)

  const handleReset = () => {
    reset()
    setInputText('')
    setGoalType(null)
    setScrollY(0)
    window.scrollTo(0, 0)
  }

  return (
    <div id="app" className="page-fitness">
      <Header variant="fitness" />

      {(view === 'input' || view === 'error') && (
        <div style={{ minHeight: '500vh', position: 'relative' }}>

          {/* FIXED: hero — centered on load, rises on scroll */}
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
                Know your member<br />before they{' '}
                <em style={{
                  fontStyle: 'italic',
                  color: '#34d399',
                  WebkitTextFillColor: '#34d399',
                  background: 'none',
                  WebkitBackgroundClip: 'unset',
                  backgroundClip: 'unset',
                }}>commit.</em>
              </h1>
              <p style={{
                fontSize: '1.08rem',
                color: 'rgba(240, 240, 248, 0.6)',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: 1.8,
              }}>
                Describe your gym, program, or wellness brand and get three precision profiles of the people who start, stick, and transform.
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
            <FitnessInputPanel
              value={inputText}
              onChange={setInputText}
              goalType={goalType}
              onGoalTypeChange={setGoalType}
              onGenerate={handleGenerate}
            />
            <div className="examples-row" style={{ padding: '0 0.75rem' }}>
              <span className="examples-row-label">Try:</span>
              {FITNESS_EXAMPLES.map(e => (
                <button key={e.label} className="example-pill" onClick={() => setInputText(e.text)}>
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* FIXED: blur overlay — fades in during phase 2 */}
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

          {/* FIXED: cross-promo card — reveals during phase 2 */}
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
                transform: `translate(-50%, -50%) scale(${cardScale})`,
                opacity: p2,
                pointerEvents: p2 > 0.5 ? 'auto' : 'none',
              }}
            >
              <SpotlightCard className="fashion-spotlight-card" spotlightColor="rgba(52, 211, 153, 0.18)">
                {/* Green color blobs */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', borderRadius: '24px' }}>
                  <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '85%', background: 'radial-gradient(ellipse, rgba(52,211,153,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '45%', height: '60%', background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 60%)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', top: '30%', right: '18%', width: '30%', height: '45%', background: 'radial-gradient(ellipse, rgba(124,108,250,0.05) 0%, transparent 60%)', borderRadius: '50%' }} />
                </div>

                {/* Card content */}
                <div
                  onClick={() => navigate('/')}
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
                    Prism
                  </h2>

                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                    color: '#8a89a0',
                    maxWidth: '60ch',
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    Know your customer before they know you. Describe any product or service and get three precision customer profiles covering demographics, motivations, objections, and the single message that converts a visitor into a buyer.
                  </p>

                  <span className="fashion-card-btn">
                    Open
                    <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                      <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

      {view === 'loading' && <LoadingPanel message="Training your audience…" accentColor="#34d399" />}

      {view === 'results' && (
        <>
          <section className="results-section">
            <div className="results-header">
              <div>
                <div className="results-title">Your Member Personas</div>
                <div className="results-subtitle">Generated for: <em>{truncate(brandInput)}</em></div>
              </div>
              <button className="reset-btn" onClick={handleReset}>← New brand</button>
            </div>
            <div className="personas-grid">
              {personas.map((p, i) => <FitnessPersonaCard key={i} persona={p} />)}
            </div>
          </section>
          <div style={{ textAlign: 'center', padding: '0.5rem 0 2rem' }}>
            <button className="download-pdf-btn" onClick={() => downloadPersonasPdf(personas, brandInput, false, false, false, true)}>
              ↓ Download as PDF
            </button>
          </div>
          <div style={{ flex: 1 }} />
          <footer>
            <span className="footer-left">Prism: Fitness &mdash; AI-powered fitness audience intelligence</span>
            <div className="footer-right">
              <Link to="/">Prism</Link>
              <Link to="/fashion">Fashion</Link>
              <Link to="/about">About</Link>
              <a href="#">Privacy</a>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
