import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import InputPanel from '../components/InputPanel.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import PersonaCard from '../components/PersonaCard.jsx'
import { usePersonaGeneration } from '../hooks/usePersonaGeneration.js'
import { truncate } from '../utils/helpers.js'

export default function MainPage() {
  const { view, personas, productInput, error, handleGenerate, reset } = usePersonaGeneration()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const ip = Math.min(y / 300, 1)
      console.log('scrollY:', y, 'inputProgress:', ip)
      setScrollY(y)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const inputProgress = Math.min(scrollY / 300, 1)
  const fashionProgress = Math.max(0, Math.min((scrollY - 300) / 300, 1))

  const handleReset = () => {
    reset()
    setScrollY(0)
    window.scrollTo(0, 0)
  }

  return (
    <div id="app" className="page-main">
      <Header variant="main" />

      {(view === 'input' || view === 'error') && (
        // Non-fixed wrapper — creates scrollable space so window.scroll fires
        <div style={{ minHeight: '200vh' }}>
          <Hero
            variant="main"
            overlayStyle={{
              transform: `translateY(-${inputProgress * 40}px) scale(${1 - inputProgress * 0.15})`,
              transition: 'none',
            }}
          />

          <div style={{
            position: 'fixed', top: '58vh', left: 0, right: 0, zIndex: 2,
            opacity: inputProgress,
            transform: `translateY(${(1 - inputProgress) * 80}px)`,
            filter: `blur(${(1 - inputProgress) * 16}px)`,
            transition: 'none',
            pointerEvents: inputProgress > 0.5 ? 'auto' : 'none',
          }}>
            <InputPanel onGenerate={handleGenerate} />
          </div>

          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2,
            opacity: fashionProgress,
            transition: 'none',
            pointerEvents: fashionProgress > 0.5 ? 'auto' : 'none',
          }}>
            <Link to="/fashion" className="fashion-bar">
              ✦ Try Prism: Fashion — Upload a lookbook or describe your brand →
            </Link>
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
