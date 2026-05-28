import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import GradualBlur from '../components/GradualBlur.jsx'
import FashionInputPanel from '../components/FashionInputPanel.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import FashionPersonaCard from '../components/FashionPersonaCard.jsx'
import { useFashionGeneration } from '../hooks/useFashionGeneration.js'
import { truncate } from '../utils/helpers.js'

export default function FashionPage() {
  const { view, personas, brandInput, error, handleGenerate, reset } = useFashionGeneration()
  const inputWrapRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (view !== 'input' && view !== 'error') return

    const onScroll = () => {
      if (window.scrollY > 100) {
        const section = inputWrapRef.current?.querySelector('.input-section')
        if (section) section.classList.add('revealed')
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
    <div id="app" className="page-fashion">
      <Header variant="fashion" />

      {(view === 'input' || view === 'error') && (
        <>
          <Hero variant="fashion" fullscreen />
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
              <FashionInputPanel onGenerate={handleGenerate} />
            </div>
          </div>
        </>
      )}

      {view === 'error' && (
        <div className="error-section">
          <div className="error-box">Something went wrong: {error}</div>
        </div>
      )}

      {view === 'loading' && <LoadingPanel message="Styling your audience…" />}

      {view === 'results' && (
        <section className="results-section">
          <div className="results-header">
            <div>
              <div className="results-title">Your Fashion Personas</div>
              <div className="results-subtitle">
                Generated for: <em>{truncate(brandInput)}</em>
              </div>
            </div>
            <button className="reset-btn" onClick={handleReset}>← New brand</button>
          </div>
          <div className="personas-grid">
            {personas.map((p, i) => <FashionPersonaCard key={i} persona={p} />)}
          </div>
        </section>
      )}

      <div style={{ flex: 1 }} />

      <footer>
        <span className="footer-left">Prism: Fashion &mdash; AI-powered fashion customer intelligence</span>
        <div className="footer-right">
          <Link to="/">Prism</Link>
          <Link to="/about">About</Link>
          <a href="#">Privacy</a>
        </div>
      </footer>
    </div>
  )
}
