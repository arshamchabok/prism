import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './CardNav.css'

const BASE = import.meta.env.BASE_URL

const VERTICALS = [
  {
    label: 'Fashion',
    desc:  'Clothing and lifestyle brands. Upload a lookbook and get three precise buyer profiles.',
    route: '/fashion',
    accent: '#60a5fa',
    image: `${BASE}assets/fashion-card.jpg`,
  },
  {
    label: 'Deploy',
    desc:  'Software products and SaaS. Map every real person behind the buying decision.',
    route: '/deploy',
    accent: '#a78bfa',
    image: `${BASE}assets/deploy-card.jpg`,
  },
  {
    label: 'Plate',
    desc:  'Restaurants, cafes and food brands. See who walks in and who keeps coming back.',
    route: '/plate',
    accent: '#fbbf24',
    image: `${BASE}assets/plate-card.jpg`,
  },
  {
    label: 'Fitness',
    desc:  'Gyms, trainers and wellness brands. Know your member before they commit.',
    route: '/fitness',
    accent: '#34d399',
    image: `${BASE}assets/fitness-card.jpg`,
  },
]


export default function CardNav() {
  const [open, setOpen] = useState(false)
  const toggle = useRef(null)
  const nav = useRef(null)
  const location = useLocation()
  useEffect(() => { setOpen(false) }, [location.pathname])
  useEffect(() => {
    if (!open) return
    const close = event => {
      if (event.type === 'keydown') {
        if (event.key !== 'Escape') return
        toggle.current?.focus()
      } else if (nav.current?.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener('keydown', close)
    document.addEventListener('pointerdown', close)
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', close) }
  }, [open])
  return <nav ref={nav} className={'cardnav' + (open ? ' cardnav--open' : '')} aria-label="Main navigation" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }}>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); const main = document.getElementById('main-content'); if (main) { main.tabIndex = -1; main.focus(); main.scrollIntoView() } }}>Skip to content</a>
    <div className="cardnav-bar">
      <button ref={toggle} className="cardnav-toggle" onClick={() => setOpen(value => !value)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="cardnav-panel"><span className="cardnav-line" /><span className="cardnav-line" /></button>
      <Link to="/" className="cardnav-logo" aria-label="Prism home"><svg className="cardnav-prism-icon" viewBox="0 0 28 28" fill="none" aria-hidden="true"><polygon points="14,2 26,24 2,24" stroke="#a78bfa" strokeWidth="2" /></svg><span>Prism</span></Link>
      <div className="cardnav-right"><Link to="/about" className="cardnav-nav-link">About</Link><Link to="/privacy" className="cardnav-nav-link">Privacy</Link></div>
    </div>
    <div className="cardnav-panel" id="cardnav-panel" hidden={!open}>
      <div className="cardnav-cards">{VERTICALS.map(vertical => <Link key={vertical.label} className="cardnav-card" to={vertical.route} style={{ '--accent': vertical.accent }} aria-label={'Go to Prism ' + vertical.label}>
        <div className="cardnav-card-img" style={{ backgroundImage: 'url(' + vertical.image + ')' }} aria-hidden="true" />
        <div className="cardnav-card-overlay" aria-hidden="true" />
        <div className="cardnav-card-content"><div className="cardnav-card-text"><span className="cardnav-card-label">{vertical.label}</span><span className="cardnav-card-desc">{vertical.desc}</span></div></div>
        <div className="cardnav-card-bar" aria-hidden="true" />
      </Link>)}</div>
      <div className="cardnav-mobile-links"><Link to="/">Home</Link><Link to="/about">About</Link><Link to="/privacy">Privacy</Link></div>
    </div>
  </nav>
}
