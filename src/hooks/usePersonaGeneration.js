import { useState } from 'react'

const SYSTEM_PROMPT = `You are a senior market strategist and customer research expert. Your task is to generate exactly THREE detailed, research-grade customer personas for a product or service described by the user.

Each persona must represent a GENUINELY DISTINCT buyer segment — different roles, budgets, decision-making styles, motivations, and discovery channels. Do not create variations of the same person.

Respond ONLY with a valid JSON array (no markdown fences, no preamble, no trailing text). The array must contain exactly 3 persona objects with this exact structure:

[
  {
    "name": "Full Name",
    "age": 34,
    "jobTitle": "Job Title",
    "location": "City, Country",
    "summary": "One sentence describing who this person is in the context of the product (under 20 words)",
    "quote": "A direct quote in their authentic voice capturing their core frustration or desire (25-40 words, first person)",
    "goals": ["goal 1", "goal 2", "goal 3"],
    "painPoints": ["pain point 1", "pain point 2", "pain point 3"],
    "discoveryChannels": ["channel 1", "channel 2", "channel 3"],
    "messagingHook": "The single most compelling message for this persona — the sentence that would stop them in their tracks (20-35 words)"
  }
]

Rules:
- Make names realistic and diverse (different ethnicities, genders, ages)
- Ages should vary meaningfully across personas (e.g. 28, 42, 57 — not all 30-35)
- Goals, pain points, and discovery channels: 3 items each, concise (under 12 words each)
- The messaging hook must be specific to this persona's psychology — not generic marketing copy
- Do not include any text outside the JSON array`

async function callAPI(productDescription) {
  const response = await fetch('https://prismapi.arshamchabok.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Product/Service: ${productDescription}` }]
    })
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const raw = data.content?.find(b => b.type === 'text')?.text || ''
  const cleaned = raw.replace(/```json|```/g, '').trim()

  let personas
  try {
    personas = JSON.parse(cleaned)
  } catch {
    throw new Error('Failed to parse persona data. Please try again.')
  }

  if (!Array.isArray(personas) || personas.length === 0) {
    throw new Error('Unexpected response format. Please try again.')
  }

  return personas
}

export function usePersonaGeneration() {
  const [view, setView] = useState('input')
  const [personas, setPersonas] = useState([])
  const [productInput, setProductInput] = useState('')
  const [error, setError] = useState('')
  const [sessionCount, setSessionCount] = useState(0)

  const handleGenerate = async (productText) => {
    setProductInput(productText)
    setView('loading')
    setError('')

    try {
      const result = await callAPI(productText)
      setPersonas(result)
      setSessionCount(c => c + 1)
      setView('results')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message)
      setView('error')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const reset = () => {
    setView('input')
    setPersonas([])
    setProductInput('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { view, personas, productInput, error, sessionCount, handleGenerate, reset }
}
