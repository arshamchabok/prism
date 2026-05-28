import Prism from './Prism.jsx'

export default function Hero({ variant = 'main', fullscreen = false }) {
  return (
    <section className={`hero${fullscreen ? ' hero--fullscreen' : ''}`}>
      <Prism
        animationType="3drotate"
        timeScale={0.5}
        scale={2}
        height={4.4}
        baseWidth={5.5}
        noise={0}
        glow={0.7}
        hueShift={0}
        colorFrequency={1}
      />
      <div className="hero-overlay">
        {variant === 'fashion' ? (
          <>
            <h1>Know your shopper's style<br />before they know <em>yours</em></h1>
            <p>Describe your clothing brand. Get three distinct fashion customer profiles in seconds — each one reveals a style archetype, spending habits, discovery channels, and the hook that makes them convert.</p>
          </>
        ) : (
          <>
            <h1>Know your customer<br />before they know <em>you</em></h1>
            <p>Type what you sell. Get three razor sharp customer profiles back in seconds.</p>
          </>
        )}
      </div>
      {fullscreen && (
        <div className="scroll-indicator" aria-hidden="true">
          <span className="scroll-indicator-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      )}
    </section>
  )
}
