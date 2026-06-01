import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import './CardNav.css'

const BASE = import.meta.env.BASE_URL

const VERTICALS = [
  { label: 'Fashion', route: '/fashion', accent: '#60a5fa', image: `${BASE}assets/fashion-card.jpg` },
  { label: 'Deploy',  route: '/deploy',  accent: '#a78bfa', image: `${BASE}assets/deploy-card.jpg` },
  { label: 'Plate',   route: '/plate',   accent: '#fbbf24', image: `${BASE}assets/plate-card.jpg` },
  { label: 'Fitness', route: '/fitness', accent: '#34d399', image: `${BASE}assets/fitness-card.jpg` },
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

  // Set initial hidden state after mount
  useEffect(() => {
    const panel = panelRef.current
    const cards = cardsRef.current.filter(Boolean)
    if (!panel) return
    gsap.set(panel, { autoAlpha: 0, y: -10 })
    gsap.set(cards, { y: 28, opacity: 0 })
  }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) doClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])  // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
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

  // Accepts an optional onComplete callback so card clicks can navigate after animation
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
    <nav className={`cardnav${open ? ' cardnav--open' : ''}`} role="navigation" aria-label="Main navigation">
      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="cardnav-bar">
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

        {/* Centered logo */}
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

        {/* Spacer — mirrors hamburger width so logo is visually centered */}
        <div className="cardnav-right" aria-hidden="true" />
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
              {/* Photo background */}
              <div
                className="cardnav-card-img"
                style={{ backgroundImage: `url(${v.image})` }}
                aria-hidden="true"
              />

              {/* Legibility overlay */}
              <div className="cardnav-card-overlay" aria-hidden="true" />

              {/* Label + arrow */}
              <div className="cardnav-card-content">
                <span className="cardnav-card-label">{v.label}</span>
                <span className="cardnav-card-arrow" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              {/* Accent bottom bar */}
              <div className="cardnav-card-bar" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
