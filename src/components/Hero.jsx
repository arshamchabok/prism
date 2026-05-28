export default function Hero({ variant = 'main', fullscreen = false, overlayStyle }) {
  return (
    <section className={`hero${fullscreen ? ' hero--fullscreen' : ''}`}>
      <div className="hero-overlay" style={overlayStyle}>
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
    </section>
  )
}
