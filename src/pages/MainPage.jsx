import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CardNav from '../components/CardNav.jsx'
import InputPanel from '../components/InputPanel.jsx'
import TiltedCard from '../components/TiltedCard.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import PersonaCard from '../components/PersonaCard.jsx'
import FlowingMenu from '../components/FlowingMenu.jsx'
import { usePersonaGeneration } from '../hooks/usePersonaGeneration.js'
import { truncate } from '../utils/helpers.js'
import { downloadPersonasPdf } from '../utils/downloadPdf.js'

const EXAMPLES = [
  { label: 'Meal kit delivery', text: 'A meal kit delivery service targeting busy families who want to cook healthy dinners at home without the hassle of grocery shopping' },
  { label: 'B2B project management', text: 'A B2B project management platform built for remote software engineering teams who need real-time collaboration across time zones' },
  { label: 'First-time homebuyer app', text: 'A mobile app that helps first-time homebuyers understand the mortgage process, compare loan options, and track their application status' },
  { label: 'Freelance design marketplace', text: 'An online marketplace connecting independent graphic designers with small business owners who need affordable brand identity work' },
]

import { ALL_VERTICALS } from '../data/verticals.js'

const VERTICALS = ALL_VERTICALS


export default function MainPage() {
  const { view, personas, productInput, error, handleGenerate, reset } = usePersonaGeneration()
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [inputText, setInputText] = useState('')
  const [selectedVertical, setSelectedVertical] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Phase 1: 0–2700px — hero shrinks, input rises into view
  const p1 = Math.min(scrollY / 2700, 1)
  const heroScale       = 1 - 0.15 * p1
  const heroTranslateY  = -150 * p1
  const inputTranslateY = 120 * (1 - p1)
  const inputBlur       = 16 * (1 - p1)
  const inputOpacity    = p1

  // Phase 2: 2700px+ — whole fixed zone scrolls up and fades out completely
  // translateY at 1× scroll speed = elements leave screen exactly like normal page flow
  // opacity reaches 0 after 500px of additional scroll (at 3200px)
  const exitPx           = Math.max(scrollY - 2700, 0)
  const scrollOutY       = -(exitPx * 1.0)
  const scrollOutOpacity = Math.max(1 - exitPx / 500, 0)

  const handleReset = () => {
    reset()
    setInputText('')
    setScrollY(0)
    window.scrollTo(0, 0)
  }

  const v = VERTICALS[selectedVertical]

  return (
    <div id="app" className="page-main">
      <CardNav />

      {(view === 'input' || view === 'error') && (
        <>
          {/* Scroll spacer — spacer ends at calc(100vh+3600px); picker enters viewport
               at scrollY≈3600px regardless of viewport height. scrollOutOpacity
               reaches 0 at scrollY=3200px, so the wrapper is unmounted 400px
               before the picker arrives — no overlap possible. */}
          <div style={{ minHeight: 'calc(100vh + 3600px)', position: 'relative' }}>

            {/* Single fixed wrapper: hero + input. Unmounted once fully transparent. */}
            {scrollOutOpacity > 0 && (
              <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2,
                pointerEvents: 'none',
                transform: `translateY(${scrollOutY}px)`,
                opacity: scrollOutOpacity,
              }}>
                {/* Hero — centered, shrinks during phase 1 */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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

                {/* Input + pills — rises from below during phase 1 */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100%',
                  maxWidth: '800px',
                  transform: `translateX(-50%) translateY(${inputTranslateY}px)`,
                  opacity: inputOpacity,
                  filter: `blur(${inputBlur}px)`,
                  pointerEvents: p1 > 0.75 && scrollOutOpacity > 0.5 ? 'auto' : 'none',
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
              </div>
            )}
          </div>

          {/* NORMAL SCROLL: vertical picker section */}
          <section className="vertical-picker">
            <div className="vp-inner">
              <div className="vp-left">
                <FlowingMenu
                  items={VERTICALS}
                  selected={selectedVertical}
                  onSelect={setSelectedVertical}
                />
              </div>

              <div className="vp-right">
                <TiltedCard
                  key={selectedVertical}
                  imageUrl={v.cardImageUrl}
                  tag={v.tag}
                  label={v.label}
                  accent={v.accent}
                  accentDark={v.accentDark}
                  tagline={v.tagline}
                  description={v.description}
                  onLaunch={() => navigate(v.route)}
                />
              </div>
            </div>
          </section>
        </>
      )}

      {view === 'error' && (
        <div className="error-section" style={{ position: 'fixed', bottom: '7rem', left: 0, right: 0, zIndex: 6 }}>
          <div className="error-box">Something went wrong: {error}</div>
        </div>
      )}

      {view === 'loading' && <LoadingPanel message="Refracting your audience…" accentColor="#dc2626" />}

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
          <div style={{ textAlign: 'center', padding: '0.5rem 0 2rem' }}>
            <button className="download-pdf-btn" onClick={() => downloadPersonasPdf(personas, productInput, false)}>
              ↓ Download as PDF
            </button>
          </div>
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
