import jsPDF from 'jspdf'

let fontPromise
async function loadFont() {
  if (!fontPromise) fontPromise = fetch(`${import.meta.env.BASE_URL}fonts/NotoSans-Regular.ttf`)
    .then(async response => {
      if (!response.ok) throw new Error('Could not load the report font.')
      const bytes = new Uint8Array(await response.arrayBuffer())
      let binary = ''
      for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192))
      return btoa(binary)
    }).catch(error => { fontPromise = null; throw error })
  return fontPromise
}

const labels = {
  summary: 'Overview', styleArchetype: 'Style archetype', monthlyBudget: 'Monthly budget',
  buyingRole: 'Buying role', companySize: 'Company size', technicalLevel: 'Technical level', roleInBuyingDecision: 'Role in the buying decision',
  diningPersona: 'Dining persona', averageSpend: 'Average spend', diningFrequency: 'Dining frequency', occasionType: 'Occasion', discoveryChannel: 'Discovery', loyaltyDriver: 'Loyalty driver',
  fitnessPersona: 'Fitness persona', fitnessGoal: 'Fitness goal', experienceLevel: 'Experience level', motivationStyle: 'Motivation style', biggestObstacle: 'Biggest obstacle', commitmentDriver: 'What keeps them coming back',
  quote: 'In their words', goals: 'Goals and motivations', painPoints: 'Daily pain points', shoppingBehavior: 'Shopping behavior', discoveryChannels: 'Discovery channels', adoptionBlockers: 'Adoption blockers', churnRisks: 'Churn risks', imageReaction: 'Image reaction', urlReaction: 'URL context', messagingHook: 'Messaging hook',
}

export async function downloadPersonasPdf(personas, description, isFashion = false, isDeploy = false, isPlate = false, isFitness = false) {
  const font = await loadFont()
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  doc.addFileToVFS('NotoSans-Regular.ttf', font)
  doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal')
  doc.setFont('NotoSans', 'normal')
  const margin = 18
  const width = doc.internal.pageSize.getWidth() - margin * 2
  const bottom = doc.internal.pageSize.getHeight() - 20
  let y = margin
  const ensure = (height = 6) => {
    if (y + height > bottom) { doc.addPage(); y = margin }
  }
  const paragraph = (value, size = 10, color = [48, 45, 63], indent = 0) => {
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const lineHeight = size * 0.3528 * 1.5
    const lines = doc.splitTextToSize(String(value), width - indent)
    for (const line of lines) {
      ensure(lineHeight)
      doc.text(line, margin + indent, y)
      y += lineHeight
    }
  }
  const title = isFashion ? 'Prism: Fashion' : isDeploy ? 'Prism: Deploy' : isPlate ? 'Prism: Plate' : isFitness ? 'Prism: Fitness' : 'Prism'
  paragraph(title, 23, [62, 40, 104])
  paragraph('Customer Persona Report', 12)
  paragraph(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 9, [85, 85, 100])
  y += 5
  paragraph(`Generated for: ${description}`, 10)
  y += 4
  paragraph('AI-generated fictional profiles. Validate these hypotheses with customer research before making decisions.', 9, [85, 85, 100])
  personas.forEach((persona, index) => {
    doc.addPage()
    y = margin
    paragraph(`${index + 1}. ${persona.name}`, 19, [62, 40, 104])
    paragraph(`Age ${persona.age} | ${persona.jobTitle} | ${persona.location}`, 10, [85, 85, 100])
    y += 5
    for (const [field, label] of Object.entries(labels)) {
      const value = persona[field]
      if (!value || (Array.isArray(value) && !value.length)) continue
      ensure(18)
      paragraph(label.toUpperCase(), 8, [93, 60, 140])
      if (Array.isArray(value)) value.forEach(item => paragraph(`• ${item}`, 10, [48, 45, 63], 2))
      else paragraph(value)
      y += 4
    }
  })
  const total = doc.getNumberOfPages()
  for (let page = 1; page <= total; page++) {
    doc.setPage(page)
    doc.setFontSize(8)
    doc.setTextColor(95, 95, 110)
    doc.text('Prism | Fictional customer profiles', margin, bottom + 10)
    doc.text(`${page} / ${total}`, margin + width, bottom + 10, { align: 'right' })
  }
  doc.save('prism-personas.pdf')
}
