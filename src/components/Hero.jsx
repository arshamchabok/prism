import Prism from './Prism.jsx'

export default function Hero({ variant = 'main' }) {
  return (
    <section className="hero">
      <Prism
        animationType="rotate"
        scale={3.6}
        glow={1.2}
        noise={0.4}
        transparent={true}
        timeScale={0.4}
        colorFrequency={0.8}
        bloom={1.2}
        suspendWhenOffscreen={true}
      />
      <div className="hero-overlay">
        {variant !== 'fashion' && (
          <div className="hero-eyebrow">AI-Powered Audience Intelligence</div>
        )}
        {variant === 'fashion' ? (
          <>
            <h1>Know your shopper's style<br />before they know <em>yours</em></h1>
            <p>Describe your clothing brand. Get three distinct fashion customer profiles in seconds — each one reveals a style archetype, spending habits, discovery channels, and the hook that makes them convert.</p>
          </>
        ) : (
          <>
            <h1>Know your customer<br />before they know <em>you</em></h1>
            <p>Describe your product or service. Prism generates three research-grade customer personas — distinct buyers, real motivations, precise messaging hooks — in under ten seconds.</p>
          </>
        )}
      </div>
    </section>
  )
}
