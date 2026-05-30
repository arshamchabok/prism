import { Link } from 'react-router-dom'

export default function Header({ variant = 'main' }) {
  return (
    <header>
      <div className="logo">
        <svg className="logo-prism" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="prism-grad" x1="2" y1="2" x2="26" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7c6cfa"/>
              <stop offset="100%" stopColor="#22d3ee"/>
            </linearGradient>
          </defs>
          <polygon points="14,2 26,24 2,24" fill="none" stroke="url(#prism-grad)" strokeWidth="2" strokeLinejoin="miter"/>
        </svg>
        Prism
      </div>
      <div className="header-right">
        {variant === 'main' && (
          <>
            <Link to="/deploy" className="nav-link" style={{ color: '#22d3ee', borderColor: 'rgba(34,211,238,0.3)' }}>
              Deploy ↗
            </Link>
            <Link to="/plate" className="nav-link" style={{ color: '#fbbf24', borderColor: 'rgba(251,191,36,0.3)' }}>
              Plate ↗
            </Link>
          </>
        )}
        {(variant === 'fashion' || variant === 'deploy' || variant === 'plate') && (
          <Link to="/" className="nav-link">← Back to Prism</Link>
        )}
      </div>
    </header>
  )
}
