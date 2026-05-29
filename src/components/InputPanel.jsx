export default function InputPanel({ value, onChange, onGenerate }) {
  const handleChange = (e) => {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
    onChange(el.value)
  }

  const handleSubmit = () => {
    if (value.trim().length >= 10) onGenerate(value.trim())
  }

  return (
    <section className="input-section">
      <div className="input-card">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder='Describe your product or service… e.g. "A SaaS tool that helps freelancers send invoices and track payments automatically"'
          maxLength={800}
        />
        <div className="input-footer">
          <span className="char-count">{value.length} / 800</span>
          <button
            className="generate-btn"
            disabled={value.trim().length < 10}
            onClick={handleSubmit}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generate Personas
          </button>
        </div>
      </div>
    </section>
  )
}
