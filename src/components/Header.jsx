import { Link } from 'react-router-dom'

export default function Header({ sessionCount = 0, variant = 'main' }) {
  return (
    <header>
      <div className="logo">
        <svg className="logo-prism" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="14,2 26,22 2,22" fill="none" stroke="url(#prism-grad)" strokeWidth="1.5" strokeLinejoin="round"/>
          <line x1="14" y1="2" x2="14" y2="22" stroke="rgba(124,108,250,0.3)" strokeWidth="1"/>
          <line x1="14" y1="22" x2="4" y2="10" stroke="rgba(192,132,252,0.3)" strokeWidth="1"/>
          <line x1="14" y1="22" x2="24" y2="10" stroke="rgba(34,211,238,0.3)" strokeWidth="1"/>
          <defs>
            <linearGradient id="prism-grad" x1="2" y1="2" x2="26" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7c6cfa"/>
              <stop offset="100%" stopColor="#22d3ee"/>
            </linearGradient>
          </defs>
        </svg>
        Prism
        <span className="logo-tag">{variant === 'fashion' ? 'Fashion' : 'Beta'}</span>
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
