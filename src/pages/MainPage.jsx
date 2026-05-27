import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import InputPanel from '../components/InputPanel.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import PersonaCard from '../components/PersonaCard.jsx'
import { usePersonaGeneration } from '../hooks/usePersonaGeneration.js'
import { truncate } from '../utils/helpers.js'

export default function MainPage() {
  const { view, personas, productInput, error, sessionCount, handleGenerate, reset } = usePersonaGeneration()
  const inputWrapRef = useRef(null)
  const hasRevealed = useRef(false)

  useEffect(() => {
    if (view !== 'input' && view !== 'error') return
    const wrap = inputWrapRef.current
    if (!wrap) return
    const section = wrap.querySelector('.input-section')
    if (!section) return

    // After the first reveal (e.g. after reset), show immediately without waiting for scroll
    if (hasRevealed.current) {
      section.classList.add('visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('visible')
          hasRevealed.current = true
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [view])

  return (
    <div id="app" className="page-main">
      <Header sessionCount={sessionCount} variant="main" />

      {(view === 'input' || view === 'error') && (
        <>
          <Hero variant="main" fullscreen />
          <div ref={inputWrapRef}>
            <InputPanel onGenerate={handleGenerate} />
          </div>
        </>
      )}

      {view === 'error' && (
        <div className="error-section">
          <div className="error-box">Something went wrong: {error}</div>
        </div>
      )}

      {view === 'loading' && <LoadingPanel message="Refracting your audience…" />}

      {view === 'results' && (
        <section className="results-section">
          <div className="results-header">
            <div>
              <div className="results-title">Your Customer Personas</div>
              <div className="results-subtitle">
                Generated for: <em>{truncate(productInput)}</em>
              </div>
            </div>
            <button className="reset-btn" onClick={reset}>← New product</button>
          </div>
          <div className="personas-grid">
            {personas.map((p, i) => <PersonaCard key={i} persona={p} />)}
          </div>
        </section>
      )}

      <div style={{ flex: 1 }} />

      {view !== 'loading' && (
        <Link to="/fashion" className="fashion-bar">
          ✦ Try Prism: Fashion — Upload a lookbook or describe your brand →
        </Link>
      )}

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
