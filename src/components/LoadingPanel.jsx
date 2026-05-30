import { useEffect, useRef, useState } from 'react'

const STEPS = [
  { threshold: 0,  label: 'Analyzing your input' },
  { threshold: 25, label: 'Identifying distinct segments' },
  { threshold: 50, label: 'Building persona profiles' },
  { threshold: 75, label: 'Crafting messaging hooks' },
]

function getLabel(pct) {
  let label = STEPS[0].label
  for (const s of STEPS) { if (pct >= s.threshold) label = s.label }
  return label
}

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function LoadingPanel({ message = 'Refracting your audience…', accentColor = '#dc2626' }) {
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) { setProgress(60); return }

    const DURATION_MS = 8000
    const TICK_MS = 80
    const TARGET = 90
    const increment = (TARGET / DURATION_MS) * TICK_MS

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment
        if (next >= TARGET) {
          clearInterval(intervalRef.current)
          return TARGET
        }
        return next
      })
    }, TICK_MS)

    return () => clearInterval(intervalRef.current)
  }, [])

  const label = getLabel(progress)

  return (
    <section className="loading-section">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="lg2" x1="4" y1="4" x2="44" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7c6cfa"/>
            <stop offset="50%" stopColor="#c084fc"/>
            <stop offset="100%" stopColor="#22d3ee"/>
          </linearGradient>
        </defs>
        <polygon
          className={prefersReducedMotion ? '' : 'tri-trace'}
          points="24,4 44,40 4,40"
          fill="none"
          stroke="url(#lg2)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      <div className="loading-text">{message}</div>

      <div className="loading-progress-wrap">
        <div className="loading-progress-label">{label}</div>
        <div className="loading-progress-track">
          <div
            className="loading-progress-bar"
            style={{
              width: `${progress}%`,
              background: accentColor,
              transition: prefersReducedMotion ? 'none' : 'width 0.08s linear',
            }}
          />
        </div>
      </div>
    </section>
  )
}
