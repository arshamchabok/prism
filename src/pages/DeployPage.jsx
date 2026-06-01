import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CardNav from '../components/CardNav.jsx'
import DeployInputPanel from '../components/DeployInputPanel.jsx'
import FlowingMenu from '../components/FlowingMenu.jsx'
import TiltedCard from '../components/TiltedCard.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import DeployPersonaCard from '../components/DeployPersonaCard.jsx'
import { useDeployGeneration } from '../hooks/useDeployGeneration.js'
import { truncate } from '../utils/helpers.js'
import { downloadPersonasPdf } from '../utils/downloadPdf.js'
import { ALL_VERTICALS } from '../data/verticals.js'

const DEPLOY_EXAMPLES = [
  { label: 'Sales intelligence', text: 'AI-powered sales intelligence platform helping enterprise SDRs identify and engage high-intent B2B accounts through intent signals and automated research' },
  { label: 'HR automation', text: 'HR automation software for mid-market companies streamlining benefits enrollment, onboarding workflows, and compliance reporting' },
  { label: 'DevOps observability', text: 'Developer observability SaaS helping platform engineering teams monitor microservice health, trace distributed systems, and debug production incidents' },
  { label: 'Construction PM', text: 'B2B project management tool for construction firms tracking subcontractor schedules, budget variance, and safety compliance across job sites' },
]

const OTHER_VERTICALS = ALL_VERTICALS.filter(v => v.label !== 'Deploy')

export default function DeployPage() {
  const { view, personas, brandInput, error, handleGenerate, reset } = useDeployGeneration()
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [inputText, setInputText] = useState('')
  const [inputUrl, setInputUrl] = useState('')
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

  const handleReset = () => { reset(); setInputText(''); setInputUrl(''); setScrollY(0); window.scrollTo(0, 0) }
  const v = OTHER_VERTICALS[selectedVertical]

  return (
    <div id="app" className="page-deploy">
      <CardNav />

      {(view === 'input' || view === 'error') && (
        <>
          <div style={{ minHeight: 'calc(100vh + 3600px)', position: 'relative' }}>
            {scrollOutOpacity > 0 && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', transform: `translateY(${scrollOutY}px)`, opacity: scrollOutOpacity }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '0 2.5rem', maxWidth: '900px', transform: `scale(${heroScale}) translateY(${heroTranslateY}px)`, transformOrigin: 'center center' }}>
                    <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(3.5rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.04em', color: 'var(--text)', margin: '0 0 1rem' }}>
                      Know your buyer<br />before they{' '}
                      <em style={{ fontStyle: 'italic', color: '#a78bfa', WebkitTextFillColor: '#a78bfa', background: 'none', WebkitBackgroundClip: 'unset', backgroundClip: 'unset' }}>sign.</em>
                    </h1>
                    <p style={{ fontSize: '1.08rem', color: 'rgba(240, 240, 248, 0.6)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>Describe your software and get three precision profiles of the people who decide, champion, and use it.</p>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', maxWidth: '800px', zIndex: 3, transform: `translateX(-50%) translateY(${inputTranslateY}px)`, opacity: inputOpacity, filter: `blur(${inputBlur}px)`, pointerEvents: p1 > 0.75 && scrollOutOpacity > 0.5 ? 'auto' : 'none' }}>
                  <DeployInputPanel value={inputText} onChange={setInputText} url={inputUrl} onUrlChange={setInputUrl} onGenerate={handleGenerate} />
                  <div className="examples-row" style={{ padding: '0 0.75rem' }}>
                    <span className="examples-row-label">Try:</span>
                    {DEPLOY_EXAMPLES.map(e => <button key={e.label} className="example-pill" onClick={() => setInputText(e.text)}>{e.label}</button>)}
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
      {view === 'loading' && <LoadingPanel message="Mapping your buying committee…" accentColor="#a78bfa" />}

      {view === 'results' && (
        <>
          <section className="results-section">
            <div className="results-header">
              <div><div className="results-title">Your Buyer Profiles</div><div className="results-subtitle">Generated for: <em>{truncate(brandInput)}</em></div></div>
              <button className="reset-btn" onClick={handleReset}>← New product</button>
            </div>
            <div className="personas-grid">{personas.map((p, i) => <DeployPersonaCard key={i} persona={p} />)}</div>
          </section>
          <div style={{ textAlign: 'center', padding: '0.5rem 0 2rem' }}><button className="download-pdf-btn" onClick={() => downloadPersonasPdf(personas, brandInput, false, true)}>↓ Download as PDF</button></div>
          <div style={{ flex: 1 }} />
          <footer>
            <span className="footer-left">Prism: Deploy — AI-powered B2B buyer intelligence</span>
            <div className="footer-right"><Link to="/">Prism</Link><Link to="/about">About</Link><a href="#">Privacy</a></div>
          </footer>
        </>
      )}
    </div>
  )
}
