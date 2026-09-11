import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FlowingMenu from './FlowingMenu.jsx'
import TiltedCard from './TiltedCard.jsx'
import { ALL_VERTICALS } from '../data/verticals.js'
import './CardNav.css'

export default function CardNav() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const toggle = useRef(null)
  const nav = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  // The current tool is never offered as a destination.
  const tools = ALL_VERTICALS.filter(tool => tool.route !== location.pathname)
  const preview = tools[Math.min(selected, tools.length - 1)]

  useEffect(() => { setOpen(false); setSelected(0) }, [location.pathname])

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

  return (
    <nav
      ref={nav}
      className={'cardnav' + (open ? ' cardnav--open' : '')}
      aria-label="Main navigation"
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}
    >
      <a
        className="skip-link"
        href="#main-content"
        onClick={event => {
          event.preventDefault()
          const main = document.getElementById('main-content')
          if (main) { main.tabIndex = -1; main.focus(); main.scrollIntoView() }
        }}
      >Skip to content</a>

      <div className="cardnav-bar">
        <button
          ref={toggle}
          className="cardnav-toggle"
          onClick={() => setOpen(value => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="cardnav-panel"
        >
          <span className="cardnav-lines" aria-hidden="true">
            <span className="cardnav-line" />
            <span className="cardnav-line" />
            <span className="cardnav-line" />
          </span>
          <span className="cardnav-toggle-text">{open ? 'Close' : 'Tools'}</span>
        </button>

        <Link to="/" className="cardnav-logo" aria-label="Prism home">
          <svg className="cardnav-prism-icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <polygon points="14,2 26,24 2,24" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M14 2 L20 24" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
          </svg>
          <span>Prism</span>
        </Link>

        <div className="cardnav-right">
          <Link to="/about" className="cardnav-nav-link">About</Link>
          <Link to="/privacy" className="cardnav-nav-link">Privacy</Link>
        </div>
      </div>

      <div className="cardnav-panel" id="cardnav-panel" hidden={!open}>
        <div className="cardnav-panel-inner">
          <div className="cardnav-menu">
            <FlowingMenu items={tools} selected={selected} onSelect={setSelected} />
          </div>
          {preview && (
            <div className="cardnav-preview">
              <TiltedCard key={preview.label} {...preview} imageUrl={preview.cardImageUrl} onLaunch={() => navigate(preview.route)} />
            </div>
          )}
        </div>
        <div className="cardnav-mobile-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </nav>
  )
}
