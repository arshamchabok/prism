import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './FlowingMenu.css'

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function edgeDirection(e, el) {
  const { width, height, top, left } = el.getBoundingClientRect()
  const nx = (e.clientX - left - width / 2) / (width / 2)
  const ny = (e.clientY - top - height / 2) / (height / 2)
  if (Math.abs(nx) > Math.abs(ny)) return nx > 0 ? 'right' : 'left'
  return ny > 0 ? 'bottom' : 'top'
}

const OFFSCREEN = {
  top:    { x: '0%',    y: '-110%' },
  bottom: { x: '0%',    y: '110%'  },
  left:   { x: '-110%', y: '0%'    },
  right:  { x: '110%',  y: '0%'    },
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function MenuItem({ label, accent, isSelected, onClick }) {
  const itemRef = useRef(null)
  const fillRef = useRef(null)

  useEffect(() => {
    const item = itemRef.current
    const fill = fillRef.current
    if (!item || !fill || prefersReduced) return

    gsap.set(fill, OFFSCREEN.left)

    function onEnter(e) {
      const { x, y } = OFFSCREEN[edgeDirection(e, item)]
      gsap.killTweensOf(fill)
      gsap.fromTo(fill, { x, y }, { x: '0%', y: '0%', duration: 0.42, ease: 'power3.out' })
    }

    function onLeave(e) {
      const { x, y } = OFFSCREEN[edgeDirection(e, item)]
      gsap.killTweensOf(fill)
      gsap.to(fill, { x, y, duration: 0.38, ease: 'power3.in' })
    }

    item.addEventListener('mouseenter', onEnter)
    item.addEventListener('mouseleave', onLeave)
    return () => {
      item.removeEventListener('mouseenter', onEnter)
      item.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(fill)
    }
  }, [])

  return (
    <div
      ref={itemRef}
      className={`flow-item${isSelected ? ' flow-item--active' : ''}`}
      style={{
        '--flow-accent':        accent,
        '--flow-accent-bg':     hexToRgba(accent, 0.07),
        '--flow-accent-border': hexToRgba(accent, 0.32),
        '--flow-accent-fill':   hexToRgba(accent, 0.22),
        '--flow-accent-active': hexToRgba(accent, 0.14),
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-pressed={isSelected}
    >
      {/* Directional fill — GSAP slides this in from cursor edge */}
      <span ref={fillRef} className="flow-fill" />
      {/* Single label — accent-colored, one source of truth, no overlap */}
      <span className="flow-label">{label}</span>
    </div>
  )
}

export default function FlowingMenu({ items, selected, onSelect }) {
  return (
    <nav className="flowing-menu" aria-label="Choose a vertical">
      {items.map((item, i) => (
        <MenuItem
          key={item.label}
          label={item.label}
          accent={item.accent}
          isSelected={selected === i}
          onClick={() => onSelect(i)}
        />
      ))}
    </nav>
  )
}
