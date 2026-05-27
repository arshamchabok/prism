import { useState } from 'react'

const EXAMPLES = [
  {
    label: 'Meal kit delivery',
    text: 'A meal kit delivery service targeting busy families who want to cook healthy dinners at home without the hassle of grocery shopping'
  },
  {
    label: 'B2B project management',
    text: 'A B2B project management platform built for remote software engineering teams who need real-time collaboration across time zones'
  },
  {
    label: 'First-time homebuyer app',
    text: 'A mobile app that helps first-time homebuyers understand the mortgage process, compare loan options, and track their application status'
  },
  {
    label: 'Freelance design marketplace',
    text: 'An online marketplace connecting independent graphic designers with small business owners who need affordable brand identity work'
  }
]

export default function InputPanel({ onGenerate }) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (text.trim().length >= 10) onGenerate(text.trim())
  }

  return (
    <section className="input-section">
      <div className="input-card">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='Describe your product or service… e.g. "A SaaS tool that helps freelancers send invoices and track payments automatically"'
          maxLength={800}
        />
        <div className="input-footer">
          <span className="char-count">{text.length} / 800</span>
          <button
            className="generate-btn"
            disabled={text.trim().length < 10}
            onClick={handleSubmit}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1L13 7.5L7.5 14M1 7.5H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generate Personas
          </button>
        </div>
      </div>
      <div className="examples-row">
        <span className="examples-row-label">Try:</span>
        {EXAMPLES.map(e => (
          <button key={e.label} className="example-pill" onClick={() => setText(e.text)}>
            {e.label}
          </button>
        ))}
      </div>
    </section>
  )
}
