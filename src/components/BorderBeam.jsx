export const BorderBeam = ({
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = '#7c6cfa',
  colorTo = '#22d3ee',
  delay = 0,
}) => {
  return (
    <div
      className="border-beam"
      style={{
        '--size': size,
        '--duration': duration,
        '--anchor': anchor,
        '--border-width': borderWidth,
        '--color-from': colorFrom,
        '--color-to': colorTo,
        '--delay': `-${delay}s`,
      }}
    />
  )
}
