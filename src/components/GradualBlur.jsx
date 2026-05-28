import './GradualBlur.css'

export default function GradualBlur({
  position = 'bottom',
  height = '50%',
  strength = 6,
  divCount = 6,
  curve = 'linear',
  animated = false,
  duration = '0.5s',
}) {
  // Direction of the gradient — which end gets the most blur
  const gradDir = { bottom: 'to bottom', top: 'to top', left: 'to left', right: 'to right' }[position] ?? 'to bottom'

  const layers = Array.from({ length: divCount }, (_, i) => {
    // Normalized position 0→1 across the layers (0 = least blur, 1 = most blur)
    const t = divCount > 1 ? i / (divCount - 1) : 1
    // Smoothstep bezier easing or linear
    const t2 = curve === 'bezier' ? t * t * (3 - 2 * t) : t
    const blurPx = t2 * strength * 4

    // Each layer is masked to its own strip along the gradient axis
    const startPct = (i / divCount) * 100
    const endPct = ((i + 1) / divCount) * 100
    const midPct = (startPct + endPct) / 2
    const mask = `linear-gradient(${gradDir}, transparent ${startPct}%, black ${midPct}%, transparent ${endPct}%)`

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: `blur(${blurPx}px)`,
          WebkitBackdropFilter: `blur(${blurPx}px)`,
          maskImage: mask,
          WebkitMaskImage: mask,
          ...(animated && {
            transition: `backdrop-filter ${duration} ease, -webkit-backdrop-filter ${duration} ease`,
          }),
        }}
      />
    )
  })

  const isVertical = position === 'top' || position === 'bottom'
  const wrapStyle = isVertical
    ? { position: 'absolute', left: 0, right: 0, height, [position]: 0, pointerEvents: 'none', zIndex: 2 }
    : { position: 'absolute', top: 0, bottom: 0, width: height, [position]: 0, pointerEvents: 'none', zIndex: 2 }

  return (
    <div className="gradual-blur" style={wrapStyle}>
      {layers}
    </div>
  )
}
