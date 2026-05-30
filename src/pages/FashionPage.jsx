import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import FashionInputPanel from '../components/FashionInputPanel.jsx'
import SpotlightCard from '../components/SpotlightCard.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import FashionPersonaCard from '../components/FashionPersonaCard.jsx'
import { useFashionGeneration } from '../hooks/useFashionGeneration.js'
import { truncate } from '../utils/helpers.js'

const FASHION_EXAMPLES = [
  { label: 'Minimalist basics', text: 'A minimalist womenswear brand offering timeless, sustainable basics made from organic cotton for urban professionals' },
  { label: 'Limited drop streetwear', text: 'A high-end streetwear label releasing monthly limited drops targeting Gen Z sneakerheads and culture makers in major cities' },
  { label: 'Luxury leather goods', text: 'A luxury leather goods brand selling handcrafted bags and accessories to discerning shoppers who value heritage craftsmanship over trends' },
  { label: 'Size-inclusive activewear', text: 'A size-inclusive activewear brand empowering women of all body types with bold, functional performance wear designed for everyday movement' },
]

export default function FashionPage() {
  const { view, personas, brandInput, error, handleGenerate, reset } = useFashionGeneration()
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [inputText, setInputText] = useState('')
  const [inputImage, setInputImage] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Phase 1: 0–800px — hero shrinks + fashion input reveals
  const p1 = Math.min(scrollY / 800, 1)
  const heroScale = 1 - 0.15 * p1
  const heroTranslateY = -150 * p1
  const inputTranslateY = 120 * (1 - p1)
  const inputBlur = 16 * (1 - p1)
  const inputOpacity = p1

  // Phase 2: 1400–2200px — main Prism card + blur overlay reveal, input fades out
  const p2 = Math.min(Math.max((scrollY - 1400) / 800, 0), 1)
  const cardScale = 0.85 + 0.15 * p2
  const blurAmount = 12 * p2
  const inputFinalOpacity = inputOpacity * (1 - p2)

  const handleReset = () => {
    reset()
    setInputText('')
    setInputImage(null)
    setScrollY(0)
    window.scrollTo(0, 0)
  }

  return (
    <div id="app" className="page-fashion">
      <Header variant="fashion" />

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
                Know your shopper's style<br />before they know{' '}
                <em style={{
                  fontStyle: 'italic',
                  color: '#60a5fa',
                  WebkitTextFillColor: '#60a5fa',
                  background: 'none',
                  WebkitBackgroundClip: 'unset',
                  backgroundClip: 'unset',
                }}>yours</em>
              </h1>
              <p style={{
                fontSize: '1.08rem',
                color: 'rgba(240, 240, 248, 0.6)',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: 1.8,
              }}>
                Describe your clothing brand. Get three distinct fashion customer profiles in seconds.
              </p>
            </div>
          </div>

          {/* FIXED: fashion input + pills — rises from below during phase 1, fades out during phase 2 */}
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
            <FashionInputPanel
              value={inputText}
              onChange={setInputText}
              image={inputImage}
              onImageChange={setInputImage}
              onGenerate={handleGenerate}
            />
            <div className="examples-row" style={{ padding: '0 0.75rem' }}>
              <span className="examples-row-label">Try:</span>
              {FASHION_EXAMPLES.map(e => (
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

          {/* FIXED: main Prism cross-promo card — reveals during phase 2 */}
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
              <SpotlightCard className="fashion-spotlight-card" spotlightColor="rgba(124, 108, 250, 0.25)">
                {/* Prism color blobs — purple/coral/gold on the right */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', borderRadius: '24px' }}>
                  <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '85%', background: 'radial-gradient(ellipse, rgba(124,108,250,0.1) 0%, transparent 60%)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '45%', height: '60%', background: 'radial-gradient(ellipse, rgba(251,113,133,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', top: '30%', right: '18%', width: '30%', height: '45%', background: 'radial-gradient(ellipse, rgba(251,191,36,0.05) 0%, transparent 60%)', borderRadius: '50%' }} />
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
                    Know your customer before they know you. Describe any product or service and get three precision customer profiles — demographics, motivations, objections, and the single message that converts a visitor into a buyer.
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

      {view === 'loading' && <LoadingPanel message="Styling your audience…" />}

      {view === 'results' && (
        <>
          <section className="results-section">
            <div className="results-header">
              <div>
                <div className="results-title">Your Fashion Personas</div>
                <div className="results-subtitle">Generated for: <em>{truncate(brandInput)}</em></div>
              </div>
              <button className="reset-btn" onClick={handleReset}>← New brand</button>
            </div>
            <div className="personas-grid">
              {personas.map((p, i) => <FashionPersonaCard key={i} persona={p} />)}
            </div>
          </section>
          <div style={{ flex: 1 }} />
          <footer>
            <span className="footer-left">Prism: Fashion &mdash; AI-powered fashion customer intelligence</span>
            <div className="footer-right">
              <Link to="/">Prism</Link>
              <Link to="/about">About</Link>
              <a href="#">Privacy</a>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
