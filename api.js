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
- Do not include any text outside the JSON array`;

export async function generatePersonas(productDescription) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Product/Service: ${productDescription}` }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const raw = data.content?.find(b => b.type === 'text')?.text || '';
  const cleaned = raw.replace(/```json|```/g, '').trim();

  let personas;
  try {
    personas = JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse persona data. Please try again.');
  }

  if (!Array.isArray(personas) || personas.length === 0) {
    throw new Error('Unexpected response format. Please try again.');
  }

  return personas;
}
