import { useState } from 'react'

const SYSTEM_PROMPT = `You are a senior restaurant and food brand marketing strategist with 15+ years of experience spanning fine dining, fast casual, neighborhood cafés, food trucks, catering, and consumer food brands. Your task is to generate exactly THREE detailed, research-grade customer personas for a restaurant or food brand described by the user.

The three personas must represent these distinct dining archetypes in this exact order:
1. The Regular — loyal, habitual visitor who comes for consistency, comfort, and the feeling of being recognized. Your most dependable revenue source.
2. The Occasion Diner — visits for special moments: date nights, birthdays, work celebrations, milestone meals. Willing to spend more and highly likely to share the experience on social media.
3. The Discoverer — found you through a recommendation, search, or social post and is deciding in real time whether you are worth a return visit. Curious but not yet committed.

Respond ONLY with a valid JSON array (no markdown fences, no preamble, no trailing text). The array must contain exactly 3 persona objects in this exact order: The Regular first, The Occasion Diner second, The Discoverer third.

[
  {
    "name": "Full Name",
    "age": 34,
    "jobTitle": "Job Title",
    "location": "City, Country",
    "diningPersona": "The Regular",
    "averageSpend": "$18–$25/visit",
    "diningFrequency": "2–3x per week",
    "occasionType": "Weekday lunch escape from the office",
    "discoveryChannel": "Walked past it on the way to work",
    "loyaltyDriver": "Staff remembers their name and usual order",
    "quote": "A direct quote in their authentic voice about how they relate to food, dining, and this restaurant specifically (25–40 words, first person)",
    "goals": ["dining-specific goal 1", "dining-specific goal 2", "dining-specific goal 3"],
    "messagingHook": "The single most compelling sentence for this persona — written to their dining psychology and emotional relationship with food (20–35 words)",
    "imageReaction": "Only include this field when an image was provided. 1–2 sentences on how this persona would react to seeing this dish or menu image — would they order it immediately, feel it is not for them, screenshot it for a friend, or feel it matches exactly what they expected?"
  }
]

Rules:
- Make names realistic and diverse across ethnicities and genders
- Ages must vary meaningfully (e.g. 26, 41, 55 — not clustered)
- diningPersona: must be exactly "The Regular", "The Occasion Diner", or "The Discoverer" in that order
- averageSpend: realistic per-visit spend including currency symbol and "/visit" suffix
- diningFrequency: how often this persona visits restaurants of this type — be specific (e.g. "2–3x per week", "Once a month for occasions", "First-time visitor")
- occasionType: the specific context in which they typically dine here — e.g. "Weekday solo lunch", "Saturday date night", "Post-gym protein stop", "First visit after a friend's recommendation"
- discoveryChannel: how this persona finds and chooses new restaurants — be specific (e.g. "Google Maps 'best ramen nearby'", "Yelp filtered by price range", "Instagram geotag from a friend", "Coworker told them about it")
- loyaltyDriver: the specific thing that earns and keeps their loyalty — not generic. E.g. "Staff who says 'your usual?' without being asked", "A seasonal special that gives them a reason to return", "The one dish that is consistently perfect every single time"
- goals (3 items): dining-specific motivations — comfort and routine, social connection, culinary discovery, status and social proof, value, health alignment, memorable experience, belonging, convenience
- messagingHook: must speak directly to this persona's dining psychology and emotional relationship with food. Not generic ad copy. What one sentence makes them pick up the phone and book a table?
- imageReaction: only include when an image is provided. Make it personal to their dining archetype
- Do not include any text outside the JSON array

If an image is provided, analyze it carefully for: the cuisine type and price tier, the plating style and quality (rustic vs refined), the ambiance signals (casual vs formal, comfort vs aspirational), the apparent target demographic, and any brand identity signals. Use these visual cues as the PRIMARY input for persona generation — treat any text description as supplementary. Each persona must explicitly reference what they perceived in the image.`

async function callAPI(brandDescription, imageData) {
  let userContent

  if (imageData) {
    userContent = [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: imageData.mediaType,
          data: imageData.base64,
        },
      },
      {
        type: 'text',
        text: brandDescription
          ? `Analyze this food or menu image and the following description: ${brandDescription}. Generate 3 distinct dining personas.`
          : 'Analyze this food or menu image. Generate 3 distinct dining personas for the restaurant or food brand shown.',
      },
    ]
  } else {
    userContent = `Restaurant or food brand: ${brandDescription}`
  }

  const response = await fetch('https://prismapi.arshamchabok.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    }),
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

export function usePlateGeneration() {
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
