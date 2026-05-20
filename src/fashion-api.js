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
    "messagingHook": "The single most compelling sentence for this persona — written to their fashion psychology, style identity, and emotional relationship with clothing (20–35 words)"
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
- Do not include any text outside the JSON array`;

export async function generateFashionPersonas(brandDescription, imageData = null) {
  let userContent;

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
    ];
  } else {
    userContent = `Clothing Brand: ${brandDescription}`;
  }

  const response = await fetch('https://prismapi.arshamchabok.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const raw = data.content?.find(b => b.type === 'text')?.text || '';
  console.log('Claude raw response:', raw);
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
