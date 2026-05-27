import { useState } from 'react'

const SYSTEM_PROMPT = `You are a senior fashion industry strategist with 15+ years of experience spanning luxury houses, direct-to-consumer streetwear, sustainable labels, and mass-market retail. Your task is to generate exactly THREE detailed, research-grade customer personas for a clothing brand described by the user.

Each persona must represent a GENUINELY DISTINCT fashion customer segment — different demographics, style identities, budgets, purchase triggers, and brand discovery paths. Do not create variations of the same consumer archetype.

Respond ONLY with a valid JSON array (no markdown fences, no preamble, no trailing text). The array must contain exactly 3 persona objects with this exact structure:

[
  {
    "name": "Full Name",
    "age": 28,
    "jobTitle": "Job Title",
    "location": "City, Country",
    "styleArchetype": "One word or short phrase — e.g. Minimalist, Streetwear, Classic, Maximalist, Boho, Athleisure, Avant-Garde, Old Money, Dark Academia, Y2K",
    "monthlyBudget": "$200–$400/mo",
    "quote": "A direct quote in their authentic voice about how they relate to fashion and this brand specifically (25–40 words, first person)",
    "goals": ["fashion-specific goal 1", "fashion-specific goal 2", "fashion-specific goal 3"],
    "shoppingBehavior": ["Online or in-store preference and why", "Impulse or planned purchase style", "Fast fashion or premium or luxury tier"],
    "discoveryChannels": ["specific platform or context 1", "specific platform or context 2", "specific platform or context 3"],
    "messagingHook": "The single most compelling sentence for this persona — written to their fashion psychology, style identity, and emotional relationship with clothing (20–35 words)",
    "imageReaction": "Only include this field when an image was provided. 1–2 sentences describing how this specific persona would react to seeing the image — would they buy immediately, scroll past, save for later, share with friends? Make it personal to their style archetype and psychology."
  }
]

Rules:
- Make names realistic and diverse across ethnicities and genders
- Ages must vary meaningfully (e.g. 22, 34, 51 — not clustered in the same decade)
- styleArchetype: how this person self-identifies aesthetically — their fashion tribe
- monthlyBudget: realistic range including currency symbol and "/mo" suffix
- goals (3 items): fashion-specific motivations — self-expression, status signaling, sustainability ethics, wardrobe investment, trend relevance, personal reinvention, etc.
- shoppingBehavior: exactly 3 strings, one per dimension: (1) online vs in-store channel preference, (2) impulse vs planned purchase behavior, (3) fast fashion vs premium vs luxury tier loyalty
- discoveryChannels (3 items): be specific — e.g. "TikTok #OOTD hauls", "Vogue editorial spreads", "Fashion week street style photography", "Pinterest mood boards", "Trusted friends' recommendations", "Instagram micro-influencers", "In-store browsing on weekends"
- messagingHook: must speak to this persona's specific fashion identity and emotional trigger — not generic ad copy. What headline stops them mid-scroll?
- imageReaction: only include this field when an image was provided. 1–2 sentences on how this persona would react to seeing that specific image — immediate purchase, scroll past, screenshot to save, send to a friend? Ground the reaction in their style archetype and emotional relationship with fashion
- Do not include any text outside the JSON array

If an image is provided, analyze it carefully for: the color palette and mood, the style aesthetic (minimalist, maximalist, streetwear, luxury, bohemian, etc.), the apparent price point and quality level, the target gender and age group suggested by the styling, the occasion it's designed for (casual, formal, athletic, editorial), and any brand identity signals. Use these visual cues as the PRIMARY input for persona generation, and treat any text description as supplementary context. Each persona must explicitly reference what they saw in the image — their style archetype and purchase triggers should directly reflect the visual aesthetic.`

async function callAPI(brandDescription, imageData) {
  let userContent

  if (imageData) {
    userContent = [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: imageData.mediaType,
          data: imageData.base64
        }
      },
      {
        type: 'text',
        text: brandDescription
          ? `Analyze this fashion image and the following brand description: ${brandDescription}. Generate 3 distinct customer personas.`
          : 'Analyze this fashion image. Generate 3 distinct customer personas for the clothing brand or style shown.'
      }
    ]
  } else {
    userContent = `Clothing Brand: ${brandDescription}`
  }

  const response = await fetch('https://prismapi.arshamchabok.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }]
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

export function useFashionGeneration() {
  const [view, setView] = useState('input')
  const [personas, setPersonas] = useState([])
  const [brandInput, setBrandInput] = useState('')
  const [error, setError] = useState('')
  const [sessionCount, setSessionCount] = useState(0)

  const handleGenerate = async (brandText, imageData) => {
    const label = brandText || (imageData ? 'uploaded image' : '')
    setBrandInput(label)
    setView('loading')
    setError('')

    try {
      const result = await callAPI(brandText, imageData)
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
