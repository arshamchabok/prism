import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import GradualBlur from '../components/GradualBlur.jsx'
import InputPanel from '../components/InputPanel.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import PersonaCard from '../components/PersonaCard.jsx'
import { usePersonaGeneration } from '../hooks/usePersonaGeneration.js'
import { truncate } from '../utils/helpers.js'

export default function MainPage() {
  const { view, personas, productInput, error, sessionCount, handleGenerate, reset } = usePersonaGeneration()
  const inputWrapRef = useRef(null)
  const fashionBarRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (view !== 'input' && view !== 'error') return

    const onScroll = () => {
      if (window.scrollY > 100) {
        const section = inputWrapRef.current?.querySelector('.input-section')
        if (section) section.classList.add('revealed')
        if (fashionBarRef.current) fashionBarRef.current.classList.add('visible')
        setRevealed(true)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [view])

  const handleReset = () => {
    reset()
    setRevealed(false)
    window.scrollTo(0, 0)
  }

  return (
    <div id="app" className="page-main">
      <Header sessionCount={sessionCount} variant="main" />

      {(view === 'input' || view === 'error') && (
        <>
          <Hero variant="main" fullscreen />
          <div ref={inputWrapRef}>
            <div className={`input-wrapper${revealed ? ' revealed' : ''}`}>
              <GradualBlur
                position="bottom"
                height="100%"
                strength={revealed ? 0 : 3}
                divCount={8}
                curve="bezier"
                animated={true}
                duration="0.8s"
              />
              <InputPanel onGenerate={handleGenerate} />
            </div>
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
            <button className="reset-btn" onClick={handleReset}>← New product</button>
          </div>
          <div className="personas-grid">
            {personas.map((p, i) => <PersonaCard key={i} persona={p} />)}
          </div>
        </section>
      )}

      <div style={{ flex: 1 }} />

      {view !== 'loading' && (
        <Link ref={fashionBarRef} to="/fashion" className="fashion-bar">
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
