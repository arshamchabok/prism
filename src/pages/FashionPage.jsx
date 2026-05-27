import { useEffect } from 'react'
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

  useEffect(() => {
    document.body.classList.add('page-fashion')
    return () => document.body.classList.remove('page-fashion')
  }, [])

  return (
    <div id="app">
      <Header variant="fashion" />

      {(view === 'input' || view === 'error') && (
        <>
          <Hero variant="fashion" />
          <FashionInputPanel onGenerate={handleGenerate} />
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
