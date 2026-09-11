export const TEXT_LIMIT = 800
export const IMAGE_LIMIT = 4 * 1024 * 1024
export const GOALS = ['Weight Loss', 'Muscle Gain', 'General Health', 'Recovery', 'Performance']
const common = ['name', 'jobTitle', 'location', 'quote', 'messagingHook']
const fields = {
  main: ['summary'],
  fashion: ['styleArchetype', 'monthlyBudget'],
  deploy: ['buyingRole', 'companySize', 'technicalLevel', 'roleInBuyingDecision'],
  plate: ['diningPersona', 'averageSpend', 'diningFrequency', 'occasionType', 'discoveryChannel', 'loyaltyDriver'],
  fitness: ['fitnessPersona', 'fitnessGoal', 'experienceLevel', 'motivationStyle', 'biggestObstacle', 'commitmentDriver'],
}
const lists = {
  main: ['goals', 'painPoints', 'discoveryChannels'],
  fashion: ['goals', 'shoppingBehavior', 'discoveryChannels'],
  deploy: ['goals', 'adoptionBlockers', 'churnRisks'],
  plate: ['goals'], fitness: ['goals'],
}
const text = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 2000

export function validatePersonas(value, kind) {
  if (!Object.hasOwn(fields, kind) || !Array.isArray(value) || value.length !== 3) throw new Error('The AI returned incomplete profiles. Please try again.')
  return value.map(persona => {
    if (!persona || typeof persona !== 'object' || !Number.isInteger(persona.age) || persona.age < 1 || persona.age > 120) throw new Error('The AI returned an invalid profile. Please try again.')
    const result = { age: persona.age }
    for (const key of [...common, ...fields[kind]]) {
      if (!text(persona[key])) throw new Error('The AI returned an incomplete profile. Please try again.')
      result[key] = persona[key].trim()
    }
    for (const key of lists[kind]) {
      if (!Array.isArray(persona[key]) || persona[key].length !== 3 || !persona[key].every(text)) throw new Error('The AI returned incomplete profile details. Please try again.')
      result[key] = persona[key].map(item => item.trim())
    }
    for (const key of ['imageReaction', 'urlReaction']) {
      if (persona[key] != null) {
        if (!text(persona[key])) throw new Error('The AI returned invalid profile details. Please try again.')
        result[key] = persona[key].trim()
      }
    }
    return result
  })
}

export function parsePersonas(data, kind) {
  if (data?.stop_reason === 'max_tokens') throw new Error('The AI response was cut short. Please try again.')
  const raw = Array.isArray(data?.content) ? data.content.filter(block => block.type === 'text').map(block => block.text).join('\n') : ''
  let value
  try { value = JSON.parse(raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')) }
  catch { throw new Error('The AI returned unreadable profiles. Please try again.') }
  return validatePersonas(value, kind)
}

export function cleanUrl(value) {
  if (!value?.trim()) return ''
  let url
  try { url = new URL(value.trim()) } catch { throw new Error('Enter a full public URL starting with https:// or http://.') }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.href.length > 2048) throw new Error('Use a public http or https URL without login credentials.')
  // Query strings and fragments frequently contain tracking IDs or access tokens.
  url.search = ''
  url.hash = ''
  return url.href
}
