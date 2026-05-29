import './GradualBlur.css'

export default function GradualBlur({
  target = 'parent',
  position = 'bottom',
  height = '50%',
  strength = 6,
  divCount = 6,
  curve = 'linear',
  exponential = false,
  opacity = 1,
  animated = false,
  duration = '0.5s',
  zIndex = 2,
}) {
  const gradDir = { bottom: 'to bottom', top: 'to top', left: 'to left', right: 'to right' }[position] ?? 'to bottom'

  const layers = Array.from({ length: divCount }, (_, i) => {
    const t = divCount > 1 ? i / (divCount - 1) : 1
    let factor = t
    if (curve === 'bezier') factor = t * t * (3 - 2 * t)
    if (exponential) factor = (Math.pow(2, factor * 4) - 1) / 15
    const blurPx = factor * strength * 4

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

  const positionStrategy = target === 'page' ? 'fixed' : 'absolute'
  const isVertical = position === 'top' || position === 'bottom'
  const wrapStyle = isVertical
    ? { position: positionStrategy, left: 0, right: 0, height, [position]: 0, pointerEvents: 'none', zIndex, opacity }
    : { position: positionStrategy, top: 0, bottom: 0, width: height, [position]: 0, pointerEvents: 'none', zIndex, opacity }

  return (
    <div className="gradual-blur" style={wrapStyle}>
      {layers}
    </div>
  )
}
