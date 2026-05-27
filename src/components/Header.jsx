import { Link } from 'react-router-dom'

export default function Header({ sessionCount = 0, variant = 'main' }) {
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
        {variant === 'fashion' && <span className="logo-tag">Fashion</span>}
      </div>
      <div className="header-right">
        {variant === 'fashion' ? (
          <Link to="/" className="nav-link">← Back to Prism</Link>
        ) : (
          <span className="badge-count">
            {sessionCount > 0
              ? `${sessionCount} persona set${sessionCount > 1 ? 's' : ''} generated`
              : ''}
          </span>
        )}
      </div>
    </header>
  )
}
