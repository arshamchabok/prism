const GOAL_TYPES = ['Weight Loss', 'Muscle Gain', 'General Health', 'Recovery', 'Performance']

export default function FitnessInputPanel({ value, onChange, goalType, onGoalTypeChange, onGenerate }) {
  const handleChange = (e) => {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
    onChange(el.value)
  }

  const canGenerate = value.trim().length >= 5

  const handleSubmit = () => {
    if (canGenerate) {
      onGenerate(value.trim(), goalType)
    }
  }

  return (
    <section className="input-section">
      <div className="input-card">
        <div className="fitness-goal-row">
          <span className="fitness-goal-label">Goal:</span>
          {GOAL_TYPES.map(g => (
            <button
              key={g}
              type="button"
              className={`fitness-goal-pill${goalType === g ? ' active' : ''}`}
              onClick={() => onGoalTypeChange(goalType === g ? null : g)}
            >
              {g}
            </button>
          ))}
        </div>

        <textarea
          value={value}
          onChange={handleChange}
          placeholder='Describe your gym or wellness brand… e.g. "A boutique HIIT studio offering 45-minute group classes for busy professionals who want results without a 2-hour gym commitment"'
          maxLength={800}
        />

        <div className="input-footer" style={{ justifyContent: 'flex-end' }}>
          <button className="generate-btn" disabled={!canGenerate} onClick={handleSubmit}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Generate Personas
          </button>
        </div>
      </div>
    </section>
  )
}
