import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CardNav from '../components/CardNav.jsx'
import FitnessInputPanel from '../components/FitnessInputPanel.jsx'
import FlowingMenu from '../components/FlowingMenu.jsx'
import TiltedCard from '../components/TiltedCard.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import FitnessPersonaCard from '../components/FitnessPersonaCard.jsx'
import { useFitnessGeneration } from '../hooks/useFitnessGeneration.js'
import { truncate } from '../utils/helpers.js'
import { downloadPersonasPdf } from '../utils/downloadPdf.js'
import { ALL_VERTICALS } from '../data/verticals.js'

const FITNESS_EXAMPLES = [
  { label: 'Boutique HIIT studio', text: 'A boutique HIIT studio offering 45-minute group classes for busy professionals who want efficient results without a long gym commitment' },
  { label: 'Online personal trainer', text: 'An online personal training service pairing remote clients with certified coaches for 12-week customized strength and nutrition programs' },
  { label: 'Yoga and wellness studio', text: 'A yoga and mindfulness wellness studio serving adults seeking stress relief, flexibility, and a supportive community in an urban neighborhood' },
  { label: 'CrossFit gym', text: 'A CrossFit affiliate gym focused on building a tight-knit community of athletes who push each other toward elite functional fitness' },
]

const OTHER_VERTICALS = ALL_VERTICALS.filter(v => v.label !== 'Fitness')

export default function FitnessPage() {
  const { view, personas, brandInput, error, handleGenerate, reset } = useFitnessGeneration()
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [inputText, setInputText] = useState('')
  const [goalType, setGoalType] = useState(null)
  const [selectedVertical, setSelectedVertical] = useState(0)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const p1 = Math.min(scrollY / 2700, 1)
  const heroScale = 1 - 0.15 * p1
  const heroTranslateY = -150 * p1
  const inputTranslateY = 120 * (1 - p1)
  const inputBlur = 16 * (1 - p1)
  const inputOpacity = p1
  const exitPx = Math.max(scrollY - 2700, 0)
  const scrollOutY = -(exitPx * 1.0)
  const scrollOutOpacity = Math.max(1 - exitPx / 500, 0)

  const handleReset = () => { reset(); setInputText(''); setGoalType(null); setScrollY(0); window.scrollTo(0, 0) }
  const v = OTHER_VERTICALS[selectedVertical]

  return (
    <div id="app" className="page-fitness">
      <CardNav />

      {(view === 'input' || view === 'error') && (
        <>
          <div style={{ minHeight: 'calc(100vh + 3600px)', position: 'relative' }}>
            {scrollOutOpacity > 0 && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', transform: `translateY(${scrollOutY}px)`, opacity: scrollOutOpacity }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '0 2.5rem', maxWidth: '900px', transform: `scale(${heroScale}) translateY(${heroTranslateY}px)`, transformOrigin: 'center center' }}>
                    <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(3.5rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.04em', color: 'var(--text)', margin: '0 0 1rem' }}>
                      Know your member<br />before they{' '}
                      <em style={{ fontStyle: 'italic', color: '#34d399', WebkitTextFillColor: '#34d399', background: 'none', WebkitBackgroundClip: 'unset', backgroundClip: 'unset' }}>commit.</em>
                    </h1>
                    <p style={{ fontSize: '1.08rem', color: 'rgba(240, 240, 248, 0.6)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>Describe your gym, program, or wellness brand and get three precision profiles of the people who start, stick, and transform.</p>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', maxWidth: '800px', zIndex: 3, transform: `translateX(-50%) translateY(${inputTranslateY}px)`, opacity: inputOpacity, filter: `blur(${inputBlur}px)`, pointerEvents: p1 > 0.75 && scrollOutOpacity > 0.5 ? 'auto' : 'none' }}>
                  <FitnessInputPanel value={inputText} onChange={setInputText} goalType={goalType} onGoalTypeChange={setGoalType} onGenerate={handleGenerate} />
                  <div className="examples-row" style={{ padding: '0 0.75rem' }}>
                    <span className="examples-row-label">Try:</span>
                    {FITNESS_EXAMPLES.map(e => <button key={e.label} className="example-pill" onClick={() => setInputText(e.text)}>{e.label}</button>)}
                  </div>
                </div>
              </div>
            )}
          </div>
          <section className="vertical-picker">
            <div className="vp-inner">
              <div className="vp-left"><FlowingMenu items={OTHER_VERTICALS} selected={selectedVertical} onSelect={setSelectedVertical} /></div>
              <div className="vp-right"><TiltedCard key={selectedVertical} imageUrl={v.cardImageUrl} tag={v.tag} label={v.label} accent={v.accent} accentDark={v.accentDark} tagline={v.tagline} description={v.description} onLaunch={() => navigate(v.route)} /></div>
            </div>
          </section>
        </>
      )}

      {view === 'error' && <div className="error-section" style={{ position: 'fixed', bottom: '7rem', left: 0, right: 0, zIndex: 6 }}><div className="error-box">Something went wrong: {error}</div></div>}
      {view === 'loading' && <LoadingPanel message="Training your audience…" accentColor="#34d399" />}

      {view === 'results' && (
        <>
          <section className="results-section">
            <div className="results-header">
              <div><div className="results-title">Your Member Personas</div><div className="results-subtitle">Generated for: <em>{truncate(brandInput)}</em></div></div>
              <button className="reset-btn" onClick={handleReset}>← New brand</button>
            </div>
            <div className="personas-grid">{personas.map((p, i) => <FitnessPersonaCard key={i} persona={p} />)}</div>
          </section>
          <div style={{ textAlign: 'center', padding: '0.5rem 0 2rem' }}><button className="download-pdf-btn" onClick={() => downloadPersonasPdf(personas, brandInput, false, false, false, true)}>↓ Download as PDF</button></div>
          <div style={{ flex: 1 }} />
          <footer>
            <span className="footer-left">Prism: Fitness — AI-powered fitness audience intelligence</span>
            <div className="footer-right"><Link to="/">Prism</Link><Link to="/about">About</Link><a href="#">Privacy</a></div>
          </footer>
        </>
      )}
    </div>
  )
}
