import { useState } from 'react'

const SYSTEM_PROMPT = `You are a senior B2B SaaS go-to-market strategist with 15+ years of experience across enterprise software, PLG products, developer tools, and vertical SaaS. Your task is to generate exactly THREE detailed, research-grade buyer personas for a software product described by the user.

The three personas must represent the B2B buying committee in this exact order:
1. The Economic Buyer — controls the budget, evaluates ROI and business case, signs the contract. Typically a VP, Director, or C-suite executive.
2. The Champion — the internal advocate who discovers, evaluates, and builds the internal business case. Typically a senior manager, team lead, or power user who will own the tool's success.
3. The End User — the person who uses the product daily. Their workflow friction, adoption speed, and daily satisfaction determine retention and renewal.

Respond ONLY with a valid JSON array (no markdown fences, no preamble, no trailing text). The array must contain exactly 3 persona objects in this exact order: Economic Buyer first, Champion second, End User third.

[
  {
    "name": "Full Name",
    "age": 42,
    "jobTitle": "Job Title",
    "location": "City, Country",
    "buyingRole": "Economic Buyer",
    "companySize": "200–1,000 employees (Series B/C or mid-market)",
    "technicalLevel": "Non-technical",
    "roleInBuyingDecision": "Signs the contract and owns the budget. Evaluates ROI, vendor risk, and strategic fit.",
    "quote": "A direct quote in their authentic voice about their relationship to this problem and how this software fits their world (25–40 words, first person)",
    "goals": ["business goal 1", "business goal 2", "business goal 3"],
    "adoptionBlockers": ["barrier 1 — why they stall or push back on buying", "barrier 2", "barrier 3"],
    "churnRisks": ["reason 1 — why they cancel or do not renew", "reason 2", "reason 3"],
    "messagingHook": "The single most compelling sentence for this persona — speaks directly to their ROI calculus, risk tolerance, or strategic priority (20–35 words)"
  }
]

Rules:
- Make names realistic and diverse across ethnicities and genders
- Ages must vary meaningfully across the three roles (e.g. 29, 38, 54 — not clustered)
- buyingRole: must be exactly "Economic Buyer", "Champion", or "End User" in that order
- companySize: describe the ideal target company size — include headcount range and funding stage or market segment where relevant
- technicalLevel: must be exactly one of: "Non-technical", "Business-savvy", "Technical", "Highly technical"
- roleInBuyingDecision: 1–2 sentences on how this person participates in the buying process
- goals (3 items): business-level motivations — efficiency gains, cost reduction, risk mitigation, competitive advantage, team performance, career impact
- adoptionBlockers (3 items): specific reasons this persona would stall, push back, or delay purchase — security reviews, budget cycles, internal politics, competing priorities, skepticism about ROI
- churnRisks (3 items): reasons this persona would cancel or not renew — lack of visible ROI, poor adoption, weak support, replaced by a competitor, internal champion left the company
- messagingHook: must speak to this persona's specific decision-making trigger — the one message that moves them from interested to committed. Not generic ad copy.
- Do not include any text outside the JSON array

If a URL is provided, use your training knowledge about that domain or product (if recognized) to sharpen persona specificity. Factor in any visible positioning signals — value proposition language, targeted segments, competitive angle, and integration ecosystem signals — to make the personas feel specific to this product in this market.`

async function callAPI(softwareDescription, urlInput) {
  let userText = `Software product: ${softwareDescription}`
  if (urlInput) {
    userText += `\n\nURL provided for context: ${urlInput}. Use your knowledge of this domain or product to factor in positioning signals.`
  }

  const response = await fetch('https://prismapi.arshamchabok.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userText }]
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

export function useDeployGeneration() {
  const [view, setView] = useState('input')
  const [personas, setPersonas] = useState([])
  const [brandInput, setBrandInput] = useState('')
  const [error, setError] = useState('')
  const [sessionCount, setSessionCount] = useState(0)

  const handleGenerate = async (softwareText, urlInput) => {
    setBrandInput(softwareText)
    setView('loading')
    setError('')

    try {
      const result = await callAPI(softwareText, urlInput)
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
    setBrandInput('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { view, personas, brandInput, error, sessionCount, handleGenerate, reset }
}
