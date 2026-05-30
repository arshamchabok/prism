import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import InputPanel from '../components/InputPanel.jsx'
import SpotlightCard from '../components/SpotlightCard.jsx'
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

const VERTICALS = [
  {
    label: 'Fashion',
    accent: '#60a5fa',
    accentDark: '#3b82f6',
    route: '/fashion',
    tag: 'Consumer Brand',
    tagline: 'Three style-aware buyer profiles for clothing and lifestyle brands.',
    description: 'Upload a lookbook, describe your aesthetic, or paste a product description. Get three precision customer personas covering style archetype, monthly budget, discovery channels, and the exact message that converts.',
  },
  {
    label: 'Deploy',
    accent: '#a78bfa',
    accentDark: '#7c6cfa',
    route: '/deploy',
    tag: 'B2B SaaS',
    tagline: 'Map your buying committee before the first call.',
    description: 'Economic Buyer, Champion, and End User — built from your product description. Each comes with adoption blockers, churn risks, and the specific message that moves them from interested to signed.',
  },
  {
    label: 'Plate',
    accent: '#fbbf24',
    accentDark: '#d97706',
    route: '/plate',
    tag: 'Food & Beverage',
    tagline: 'Know your diner before they order.',
    description: 'The Regular, the Occasion Diner, and the Discoverer — drawn from your restaurant\'s DNA. Includes dining frequency, discovery channel, loyalty drivers, and the message that fills seats.',
  },
  {
    label: 'Fitness',
    accent: '#34d399',
    accentDark: '#059669',
    route: '/fitness',
    tag: 'Wellness & Gym',
    tagline: 'Know your member before they commit.',
    description: 'The Beginner, the Committed Regular, and the Comeback. Select a goal type for personas calibrated to that specific motivation — from weight loss psychology to performance periodization.',
  },
]

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

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

  // Phase 1: 0–800px — hero shrinks, input rises into view
  const p1 = Math.min(scrollY / 800, 1)
  const heroScale       = 1 - 0.15 * p1
  const heroTranslateY  = -150 * p1
  const inputTranslateY = 120 * (1 - p1)
  const inputBlur       = 16 * (1 - p1)
  const inputOpacity    = p1

  // Phase 2: 800px+ — whole fixed zone scrolls naturally up and fades out
  const exitPx           = Math.max(scrollY - 800, 0)
  const scrollOutY       = -(exitPx * 0.9)                    // follows page scroll at ~90%
  const scrollOutOpacity = Math.max(1 - exitPx / 380, 0)     // fades over 380px

  const handleReset = () => {
    reset()
    setInputText('')
    setScrollY(0)
    window.scrollTo(0, 0)
  }

  const v = VERTICALS[selectedVertical]

  return (
    <div id="app" className="page-main">
      <Header variant="main" />

      {(view === 'input' || view === 'error') && (
        <>
          {/* Scroll spacer — creates room for phase 1 before picker arrives */}
          <div style={{ minHeight: 'calc(100vh + 1000px)', position: 'relative' }}>

            {/*
              Single fixed container for hero + input.
              transform: translateY scrolls it upward at ~90% of scroll speed
              once the user is past 800px, creating a natural "page flow" feel.
              opacity fades it out over 380px of additional scroll.
            */}
            <div style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2,
              pointerEvents: 'none',
              transform: `translateY(${scrollOutY}px)`,
              opacity: scrollOutOpacity,
            }}>
              {/* Hero — centered inside the fixed container */}
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
                maxWidth: '700px',
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
                <SpotlightCard
                  className="vp-card"
                  spotlightColor={hexToRgba(v.accent, 0.18)}
                  style={{ borderColor: hexToRgba(v.accent, 0.28) }}
                >
                  <div key={selectedVertical} className="vp-content-anim">
                    <span className="vp-tag" style={{ borderColor: hexToRgba(v.accent, 0.3), color: v.accent }}>
                      {v.tag}
                    </span>

                    <h2 className="vp-name">
                      Prism:{' '}
                      <em style={{ color: v.accent, fontStyle: 'italic' }}>{v.label}</em>
                    </h2>

                    <p className="vp-tagline">{v.tagline}</p>
                    <p className="vp-desc">{v.description}</p>

                    <button
                      className="vp-launch-btn"
                      onClick={() => navigate(v.route)}
                      style={{
                        background: `linear-gradient(135deg, ${v.accentDark}, ${v.accent})`,
                        boxShadow: `0 14px 35px ${hexToRgba(v.accent, 0.25)}`,
                      }}
                    >
                      Launch
                      <svg width="13" height="13" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                        <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </SpotlightCard>
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
