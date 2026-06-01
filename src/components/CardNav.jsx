import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import gsap from 'gsap'
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

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function CardNav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const panelRef = useRef(null)
  const cardsRef = useRef([])
  const tlRef    = useRef(null)

  useEffect(() => {
    const panel = panelRef.current
    const cards = cardsRef.current.filter(Boolean)
    if (!panel) return
    gsap.set(panel, { autoAlpha: 0, y: -10 })
    gsap.set(cards, { y: 28, opacity: 0 })
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) doClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!e.target.closest('.cardnav')) doClose() }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])  // eslint-disable-line react-hooks/exhaustive-deps

  const doOpen = useCallback(() => {
    setOpen(true)
    const panel = panelRef.current
    const cards = cardsRef.current.filter(Boolean)
    if (prefersReduced) {
      gsap.set(panel, { autoAlpha: 1, y: 0 })
      gsap.set(cards, { y: 0, opacity: 1 })
      return
    }
    tlRef.current?.kill()
    tlRef.current = gsap.timeline()
    tlRef.current
      .to(panel, { autoAlpha: 1, y: 0, duration: 0.38, ease: 'power3.out' })
      .to(cards, { y: 0, opacity: 1, duration: 0.36, stagger: 0.07, ease: 'power3.out' }, '-=0.22')
  }, [])

  const doClose = useCallback((onComplete) => {
    const panel = panelRef.current
    const cards = cardsRef.current.filter(Boolean)
    if (prefersReduced) {
      gsap.set(panel, { autoAlpha: 0, y: -10 })
      gsap.set(cards, { y: 28, opacity: 0 })
      setOpen(false)
      onComplete?.()
      return
    }
    tlRef.current?.kill()
    tlRef.current = gsap.timeline({
      onComplete: () => { setOpen(false); onComplete?.() },
    })
    tlRef.current
      .to(cards, { y: -14, opacity: 0, duration: 0.2, stagger: 0.04, ease: 'power3.in' })
      .to(panel, { autoAlpha: 0, y: -10, duration: 0.28, ease: 'power3.in' }, '-=0.1')
  }, [])

  const toggle = () => (open ? doClose() : doOpen())

  const handleCardClick = useCallback((route) => {
    doClose(() => navigate(route))
  }, [doClose, navigate])

  return (
    <nav
      className={`cardnav${open ? ' cardnav--open' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* ── Floating pill bar ──────────────────────────── */}
      <div className="cardnav-bar">
        {/* Hamburger */}
        <button
          className="cardnav-toggle"
          onClick={toggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="cardnav-panel"
        >
          <span className="cardnav-line" />
          <span className="cardnav-line" />
        </button>

        {/* Logo — absolutely centered so left/right widths don't affect it */}
        <a
          href="/"
          className="cardnav-logo"
          onClick={(e) => { e.preventDefault(); navigate('/') }}
          aria-label="Prism home"
        >
          <svg className="cardnav-prism-icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="cnav-grad" x1="2" y1="2" x2="26" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c6cfa" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <polygon points="14,2 26,24 2,24" fill="none" stroke="url(#cnav-grad)" strokeWidth="2" strokeLinejoin="miter" />
          </svg>
          <span>Prism</span>
        </a>

        {/* Right: About + Privacy links */}
        <div className="cardnav-right">
          <Link to="/about" className="cardnav-nav-link">About</Link>
          <a href="#" className="cardnav-nav-link">Privacy</a>
        </div>
      </div>

      {/* ── Expandable panel ────────────────────────────── */}
      <div
        ref={panelRef}
        className="cardnav-panel"
        id="cardnav-panel"
        aria-hidden={!open}
      >
        <div className="cardnav-cards">
          {VERTICALS.map((v, i) => (
            <button
              key={v.label}
              ref={(el) => { cardsRef.current[i] = el }}
              className="cardnav-card"
              onClick={() => handleCardClick(v.route)}
              style={{ '--accent': v.accent }}
              aria-label={`Go to Prism ${v.label}`}
              tabIndex={open ? 0 : -1}
            >
              <div
                className="cardnav-card-img"
                style={{ backgroundImage: `url(${v.image})` }}
                aria-hidden="true"
              />
              <div className="cardnav-card-overlay" aria-hidden="true" />

              <div className="cardnav-card-content">
                <div className="cardnav-card-text">
                  <span className="cardnav-card-label">{v.label}</span>
                  <span className="cardnav-card-desc">{v.desc}</span>
                </div>
                <span className="cardnav-card-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              <div className="cardnav-card-bar" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
