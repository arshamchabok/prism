export function personas(kind) {
  return [0, 1, 2].map(index => ({
    name: ['Alex Rivera', 'Samira Haddad', 'Renée Müller'][index], age: 28 + index * 12,
    jobTitle: 'Operations director at a regional business', location: 'Austin, Texas',
    summary: 'A practical buyer looking for dependable services.',
    quote: 'I want a reliable service that fits my schedule and helps me spend more time on the work I enjoy.',
    goals: ['Save time during busy weeks', 'Make informed decisions', 'Find a dependable solution'],
    painPoints: ['Unclear pricing', 'Too many manual steps', 'Limited time to compare options'],
    discoveryChannels: ['Recommendations from colleagues', 'Industry newsletters', 'Local search results'],
    messagingHook: 'A dependable service that makes your busiest days easier, with clear pricing and a simple start.',
    styleArchetype: 'Minimalist', monthlyBudget: '$200–$400/month', shoppingBehavior: ['Shops online', 'Plans purchases', 'Chooses durable premium basics'],
    buyingRole: ['Economic Buyer', 'Champion', 'End User'][index], companySize: '160–600 employees, Series C software business', technicalLevel: 'Business-savvy', roleInBuyingDecision: 'Approves vendor spend after finance and security reviews.',
    adoptionBlockers: ['Security review', 'Integration gap', 'Budget cycle'], churnRisks: ['Low adoption', 'Rising prices', 'Changing needs'],
    diningPersona: ['The Regular', 'The Occasion Diner', 'The Discoverer'][index], averageSpend: '$24–$31/visit', diningFrequency: 'Visits every Tuesday for lunch with colleagues.', occasionType: 'A quiet weekday lunch between meetings.', discoveryChannel: 'A colleague recommended the restaurant.', loyaltyDriver: 'Staff remember their usual order.',
    fitnessPersona: ['The Beginner', 'The Committed Regular', 'The Comeback'][index], fitnessGoal: 'Build strength and a consistent weekly routine.', experienceLevel: 'Beginner', motivationStyle: 'Values encouragement and accountability.', biggestObstacle: 'Finding time between work and family.', commitmentDriver: 'A coach who notices their progress.',
  }))
}

export const apiResponse = kind => ({ content: [{ type: 'text', text: JSON.stringify(personas(kind)) }], stop_reason: 'end_turn' })
