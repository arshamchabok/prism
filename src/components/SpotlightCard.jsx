import { useRef, useCallback } from 'react'
import './SpotlightCard.css'

export default function SpotlightCard({ children, className = '', spotlightColor = 'rgba(34, 211, 238, 0.25)' }) {
  const divRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const el = divRef.current
    if (!el) return
    const { left, top } = el.getBoundingClientRect()
    el.style.setProperty('--mouse-x', `${e.clientX - left}px`)
    el.style.setProperty('--mouse-y', `${e.clientY - top}px`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = divRef.current
    if (!el) return
    el.style.setProperty('--mouse-x', '50%')
    el.style.setProperty('--mouse-y', '50%')
  }, [])

  return (
    <div
      ref={divRef}
      className={`spotlight-card ${className}`}
      style={{ '--spotlight-color': spotlightColor }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
