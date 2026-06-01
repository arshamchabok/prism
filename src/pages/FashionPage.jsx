import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CardNav from '../components/CardNav.jsx'
import FashionInputPanel from '../components/FashionInputPanel.jsx'
import FlowingMenu from '../components/FlowingMenu.jsx'
import TiltedCard from '../components/TiltedCard.jsx'
import LoadingPanel from '../components/LoadingPanel.jsx'
import FashionPersonaCard from '../components/FashionPersonaCard.jsx'
import { useFashionGeneration } from '../hooks/useFashionGeneration.js'
import { truncate } from '../utils/helpers.js'
import { downloadPersonasPdf } from '../utils/downloadPdf.js'
import { ALL_VERTICALS } from '../data/verticals.js'

const FASHION_EXAMPLES = [
  { label: 'Minimalist basics', text: 'A minimalist womenswear brand offering timeless, sustainable basics made from organic cotton for urban professionals' },
  { label: 'Limited drop streetwear', text: 'A high-end streetwear label releasing monthly limited drops targeting Gen Z sneakerheads and culture makers in major cities' },
  { label: 'Luxury leather goods', text: 'A luxury leather goods brand selling handcrafted bags and accessories to discerning shoppers who value heritage craftsmanship over trends' },
  { label: 'Size-inclusive activewear', text: 'A size-inclusive activewear brand empowering women of all body types with bold, functional performance wear designed for everyday movement' },
]

const OTHER_VERTICALS = ALL_VERTICALS.filter(v => v.label !== 'Fashion')

export default function FashionPage() {
  const { view, personas, brandInput, error, handleGenerate, reset } = useFashionGeneration()
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [inputText, setInputText] = useState('')
  const [inputImage, setInputImage] = useState(null)
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

  const handleReset = () => { reset(); setInputText(''); setInputImage(null); setScrollY(0); window.scrollTo(0, 0) }
  const v = OTHER_VERTICALS[selectedVertical]

  return (
    <div id="app" className="page-fashion">
      <CardNav />

      {(view === 'input' || view === 'error') && (
        <>
          <div style={{ minHeight: 'calc(100vh + 3600px)', position: 'relative' }}>
            {scrollOutOpacity > 0 && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', transform: `translateY(${scrollOutY}px)`, opacity: scrollOutOpacity }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '0 2.5rem', maxWidth: '900px', transform: `scale(${heroScale}) translateY(${heroTranslateY}px)`, transformOrigin: 'center center' }}>
                    <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(3.5rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.04em', color: 'var(--text)', margin: '0 0 1rem' }}>
                      Know your shopper's style<br />before they know{' '}
                      <em style={{ fontStyle: 'italic', color: '#60a5fa', WebkitTextFillColor: '#60a5fa', background: 'none', WebkitBackgroundClip: 'unset', backgroundClip: 'unset' }}>yours</em>
                    </h1>
                    <p style={{ fontSize: '1.08rem', color: 'rgba(240, 240, 248, 0.6)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.8 }}>Describe your clothing brand. Get three distinct fashion customer profiles in seconds.</p>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', maxWidth: '800px', zIndex: 3, transform: `translateX(-50%) translateY(${inputTranslateY}px)`, opacity: inputOpacity, filter: `blur(${inputBlur}px)`, pointerEvents: p1 > 0.75 && scrollOutOpacity > 0.5 ? 'auto' : 'none' }}>
                  <FashionInputPanel value={inputText} onChange={setInputText} image={inputImage} onImageChange={setInputImage} onGenerate={handleGenerate} />
                  <div className="examples-row" style={{ padding: '0 0.75rem' }}>
                    <span className="examples-row-label">Try:</span>
                    {FASHION_EXAMPLES.map(e => <button key={e.label} className="example-pill" onClick={() => setInputText(e.text)}>{e.label}</button>)}
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
      {view === 'loading' && <LoadingPanel message="Styling your audience…" accentColor="#60a5fa" />}

      {view === 'results' && (
        <>
          <section className="results-section">
            <div className="results-header">
              <div><div className="results-title">Your Fashion Personas</div><div className="results-subtitle">Generated for: <em>{truncate(brandInput)}</em></div></div>
              <button className="reset-btn" onClick={handleReset}>← New brand</button>
            </div>
            <div className="personas-grid">{personas.map((p, i) => <FashionPersonaCard key={i} persona={p} />)}</div>
          </section>
          <div style={{ textAlign: 'center', padding: '0.5rem 0 2rem' }}><button className="download-pdf-btn" onClick={() => downloadPersonasPdf(personas, brandInput, true)}>↓ Download as PDF</button></div>
          <div style={{ flex: 1 }} />
          <footer>
            <span className="footer-left">Prism: Fashion — AI-powered fashion customer intelligence</span>
            <div className="footer-right"><Link to="/">Prism</Link><Link to="/about">About</Link><a href="#">Privacy</a></div>
          </footer>
        </>
      )}
    </div>
  )
}
