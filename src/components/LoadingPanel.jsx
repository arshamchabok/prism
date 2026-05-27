import { useEffect, useRef } from 'react'

const STEPS = [
  'Analyzing your product space',
  'Identifying distinct buyer segments',
  'Building persona profiles',
  'Crafting messaging hooks'
]

export default function LoadingPanel({ message = 'Refracting your audience…' }) {
  const stepsRef = useRef([])

  useEffect(() => {
    const stepEls = stepsRef.current
    stepEls.forEach(el => { if (el) el.className = 'loading-step' })

    let current = 0
    const interval = setInterval(() => {
      if (current > 0 && stepEls[current - 1]) {
        stepEls[current - 1].classList.remove('active')
        stepEls[current - 1].classList.add('done')
      }
      if (current < stepEls.length) {
        if (stepEls[current]) stepEls[current].classList.add('active')
        current++
      } else {
        clearInterval(interval)
      }
    }, 1400)

    return () => clearInterval(interval)
  }, [])

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
          className="tri-trace"
          points="24,4 44,40 4,40"
          fill="none"
          stroke="url(#lg2)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <div className="loading-text">{message}</div>
      <div className="loading-steps">
        {STEPS.map((label, i) => (
          <div key={i} className="loading-step" ref={el => { stepsRef.current[i] = el }}>
            {label}
          </div>
        ))}
      </div>
    </section>
  )
}
