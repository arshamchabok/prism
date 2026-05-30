import { useState } from 'react'

export default function DeployInputPanel({ value, onChange, url, onUrlChange, onGenerate }) {
  const [showUrl, setShowUrl] = useState(false)

  const handleChange = (e) => {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
    onChange(el.value)
  }

  const canGenerate = value.trim().length >= 5

  const handleSubmit = () => {
    if (canGenerate) {
      onGenerate(value.trim(), url.trim() || null)
    }
  }

  const urlActive = showUrl || !!url

  return (
    <section className="input-section">
      <div className="input-card">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder='Describe your software… e.g. "AI-powered sales intelligence platform helping enterprise SDRs identify and engage high-intent B2B accounts"'
          maxLength={800}
        />

        {showUrl && (
          <div className="url-input-row">
            <label htmlFor="deploy-url" className="url-input-label" aria-label="URL input">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </label>
            <input
              id="deploy-url"
              type="url"
              value={url}
              onChange={e => onUrlChange(e.target.value)}
              placeholder="Paste your landing page or competitor URL (optional)"
              aria-label="Landing page or competitor URL"
            />
            {url && (
              <button
                onClick={() => onUrlChange('')}
                type="button"
                className="upload-clear"
                title="Clear URL"
                aria-label="Clear URL"
              >
                &times;
              </button>
            )}
          </div>
        )}

        <div className="input-footer" style={{ justifyContent: 'space-between' }}>
          <button
            className="upload-trigger-btn"
            onClick={() => setShowUrl(v => !v)}
            type="button"
            aria-label="Add landing page or competitor URL"
            title="Add landing page or competitor URL"
            style={urlActive ? { color: '#a78bfa' } : {}}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>
          <button className="generate-btn" disabled={!canGenerate} onClick={handleSubmit}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Generate Profiles
          </button>
        </div>
      </div>
    </section>
  )
}
