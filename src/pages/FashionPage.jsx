import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import FashionInputPanel from '../components/FashionInputPanel.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import FashionPersonaCard from '../components/FashionPersonaCard.jsx'
import { useFashionGeneration } from '../hooks/useFashionGeneration.js'
import { truncate } from '../utils/helpers.js'

export default function FashionPage() {
  const { view, personas, brandInput, error, handleGenerate, reset } = useFashionGeneration()
  const inputWrapRef = useRef(null)
  const hasRevealed = useRef(false)

  useEffect(() => {
    if (view !== 'input' && view !== 'error') return
    const wrap = inputWrapRef.current
    if (!wrap) return
    const section = wrap.querySelector('.input-section')
    if (!section) return

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
    <div id="app" className="page-fashion">
      <Header variant="fashion" />

      {(view === 'input' || view === 'error') && (
        <>
          <Hero variant="fashion" fullscreen />
          <div ref={inputWrapRef}>
            <FashionInputPanel onGenerate={handleGenerate} />
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
            <button className="reset-btn" onClick={reset}>← New brand</button>
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
