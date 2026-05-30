import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './FlowingMenu.css'

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Returns which edge the cursor entered/exited from
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

function MenuItem({ label, accent, isSelected, onClick }) {
  const itemRef    = useRef(null)
  const fillRef    = useRef(null)
  const marqueeRef = useRef(null)

  useEffect(() => {
    const item    = itemRef.current
    const fill    = fillRef.current
    const marquee = marqueeRef.current
    if (!item || !fill || !marquee || prefersReduced) return

    gsap.set(fill,    OFFSCREEN.left)
    gsap.set(marquee, { y: '110%' })

    function onEnter(e) {
      const { x, y } = OFFSCREEN[edgeDirection(e, item)]
      gsap.killTweensOf([fill, marquee])
      gsap.fromTo(fill,    { x, y },      { x: '0%', y: '0%', duration: 0.55, ease: 'power3.out' })
      gsap.fromTo(marquee, { y: '110%' }, { y: '0%',          duration: 0.5,  ease: 'power3.out' })
    }

    function onLeave(e) {
      const { x, y } = OFFSCREEN[edgeDirection(e, item)]
      gsap.killTweensOf([fill, marquee])
      gsap.to(fill,    { x, y,        duration: 0.45, ease: 'power3.in' })
      gsap.to(marquee, { y: '110%',   duration: 0.4,  ease: 'power3.in' })
    }

    item.addEventListener('mouseenter', onEnter)
    item.addEventListener('mouseleave', onLeave)
    return () => {
      item.removeEventListener('mouseenter', onEnter)
      item.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf([fill, marquee])
    }
  }, [])

  // Enough copies so the -50% translate loops seamlessly
  const marqueeStr = Array(8).fill(`${label} — `).join('')

  return (
    <div
      ref={itemRef}
      className={`flow-item${isSelected ? ' flow-item--active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-pressed={isSelected}
    >
      <span ref={fillRef} className="flow-fill" style={{ background: accent }} />

      <div className="flow-label">
        <span style={isSelected ? { color: accent } : undefined}>{label}</span>
      </div>

      <div ref={marqueeRef} className="flow-marquee">
        <span className="flow-marquee-track">{marqueeStr}</span>
      </div>
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
