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

function buildGradient(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const lr = Math.min(255, Math.round(r + (255 - r) * 0.45))
  const lg = Math.min(255, Math.round(g + (255 - g) * 0.45))
  const lb = Math.min(255, Math.round(b + (255 - b) * 0.45))
  const dr = Math.round(r * 0.6)
  const dg = Math.round(g * 0.6)
  const db = Math.round(b * 0.6)
  const lighter = `rgb(${lr},${lg},${lb})`
  const darker = `rgb(${dr},${dg},${db})`
  return `conic-gradient(${darker}, ${hex}, ${lighter}, ${hex}, ${darker})`
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
  const gradient = buildGradient(accentColor)
  const sideStyle = { background: gradient }
  const shadowStyle = { background: accentColor }

  return (
    <section className="loading-section">
      <div className="pyramid-loader">
        <div className="wrapper">
          <span className="side side1" style={sideStyle}></span>
          <span className="side side2" style={sideStyle}></span>
          <span className="side side3" style={sideStyle}></span>
          <span className="side side4" style={sideStyle}></span>
          <span className="shadow" style={shadowStyle}></span>
        </div>
      </div>

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
