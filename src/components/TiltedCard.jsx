import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import './TiltedCard.css'

const TILT_SPRING  = { stiffness: 280, damping: 24 }
const SCALE_SPRING = { stiffness: 300, damping: 28 }

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

export default function TiltedCard({
  imageUrl,
  tag,
  label,
  accent,
  accentDark,
  tagline,
  description,
  onLaunch,
}) {
  const cardRef = useRef(null)

  // Raw motion values → springs for smooth, physical feel
  const rawX  = useMotionValue(0)
  const rawY  = useMotionValue(0)
  const rotX  = useSpring(rawX,  TILT_SPRING)
  const rotY  = useSpring(rawY,  TILT_SPRING)
  const scale = useSpring(1,     SCALE_SPRING)

  const onMove = useCallback((e) => {
    if (prefersReduced) return
    const el = cardRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    // Normalise cursor to −0.5 … +0.5 relative to card centre
    const nx = (e.clientX - left) / width  - 0.5
    const ny = (e.clientY - top)  / height - 0.5
    rawY.set(nx *  22)   // left/right tilt ±11°
    rawX.set(ny * -16)   // up/down tilt   ±8°
  }, [rawX, rawY])

  const onEnter = useCallback(() => {
    if (!prefersReduced) scale.set(1.03)
  }, [scale])

  const onLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
    scale.set(1)
  }, [rawX, rawY, scale])

  return (
    <div
      className="tc-scene"
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <motion.article
        ref={cardRef}
        className="tc-card"
        style={{ rotateX: rotX, rotateY: rotY, scale }}
        onClick={onLaunch}
        role="button"
        tabIndex={0}
        aria-label={`Launch Prism ${label}`}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onLaunch?.()}
      >
        {/* Background photo — key change triggers fade-in on vertical swap */}
        <img
          key={imageUrl}
          src={imageUrl}
          alt=""
          aria-hidden="true"
          className="tc-bg"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />

        {/* Dark gradient overlay — ensures text contrast over any image */}
        <div className="tc-overlay" />

        {/* Content — key change re-triggers vp-fade-in on vertical swap */}
        <div key={label} className="tc-body vp-content-anim">
          <span
            className="vp-tag"
            style={{ borderColor: hexToRgba(accent, 0.55), color: accent }}
          >
            {tag}
          </span>

          <h2 className="vp-name">
            Prism:{' '}
            <em style={{ color: accent, fontStyle: 'italic' }}>{label}</em>
          </h2>

          <p className="vp-desc">{description}</p>

          <button
            className="vp-launch-btn"
            onClick={(e) => { e.stopPropagation(); onLaunch?.() }}
            style={{
              background: `linear-gradient(135deg, ${accentDark}, ${accent})`,
              boxShadow: `0 14px 35px ${hexToRgba(accent, 0.3)}`,
            }}
          >
            Launch
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </motion.article>
    </div>
  )
}
