import jsPDF from 'jspdf'

const MARGIN = 18
const LINE_H = 5.2

function wrap(doc, text, x, y, maxW) {
  const lines = doc.splitTextToSize(String(text), maxW)
  doc.text(lines, x, y)
  return y + lines.length * LINE_H
}

function sectionLabel(doc, label, x, y) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(140, 130, 200)
  doc.text(label.toUpperCase(), x, y)
  return y + 4.5
}

function maybeNewPage(doc, y, needed = 30) {
  const pageH = doc.internal.pageSize.getHeight()
  if (y + needed > pageH - MARGIN) {
    doc.addPage()
    return MARGIN + 4
  }
  return y
}

export function downloadPersonasPdf(personas, description, isFashion = false, isDeploy = false) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const contentW = pageW - MARGIN * 2

  // ── Cover header ─────────────────────────────────────────────
  doc.setFillColor(12, 10, 22)
  doc.rect(0, 0, pageW, 38, 'F')

  doc.setTextColor(240, 240, 248)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  const title = isFashion ? 'Prism: Fashion' : isDeploy ? 'Prism: Deploy' : 'Prism'
  doc.text(title, MARGIN, 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(156, 163, 175)
  doc.text('Customer Persona Report', MARGIN, 23)

  doc.setFontSize(8)
  doc.setTextColor(100, 110, 130)
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  doc.text(dateStr, MARGIN, 30)

  let y = 48

  // Product description
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(90, 90, 110)
  y = wrap(doc, `Generated for: ${description}`, MARGIN, y, contentW)
  y += 6

  // ── Separator ─────────────────────────────────────────────────
  doc.setDrawColor(60, 50, 90)
  doc.setLineWidth(0.4)
  doc.line(MARGIN, y, pageW - MARGIN, y)
  y += 10

  // ── Personas ─────────────────────────────────────────────────
  personas.forEach((p, idx) => {
    y = maybeNewPage(doc, y, 50)

    // Persona number + name
    doc.setFillColor(22, 18, 38)
    doc.roundedRect(MARGIN, y - 5, contentW, 14, 2, 2, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(240, 240, 248)
    doc.text(`${idx + 1}. ${p.name || ''}`, MARGIN + 4, y + 2)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(180, 175, 210)
    const meta = [p.age && `Age ${p.age}`, p.jobTitle, p.location].filter(Boolean).join('  ·  ')
    doc.text(meta, MARGIN + 4, y + 7.5)
    y += 17

    // Fashion badges
    if (isFashion && (p.styleArchetype || p.monthlyBudget)) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(124, 108, 250)
      const badges = [p.styleArchetype && `◆ ${p.styleArchetype}`, p.monthlyBudget && `Budget: ${p.monthlyBudget}`].filter(Boolean).join('    ')
      doc.text(badges, MARGIN, y)
      y += 7
    }

    // Deploy badges
    if (isDeploy && (p.buyingRole || p.companySize || p.technicalLevel)) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(34, 211, 238)
      const badges = [p.buyingRole && `◆ ${p.buyingRole}`, p.companySize, p.technicalLevel].filter(Boolean).join('    ')
      doc.text(badges, MARGIN, y)
      y += 5
      if (p.roleInBuyingDecision) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 130)
        y = wrap(doc, p.roleInBuyingDecision, MARGIN, y, contentW)
        y += 2
      }
    }

    // Quote
    y = maybeNewPage(doc, y, 18)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9.5)
    doc.setTextColor(200, 195, 230)
    y = wrap(doc, `"${p.quote || ''}"`, MARGIN, y, contentW)
    y += 6

    // Summary (main page personas)
    if (p.summary) {
      y = maybeNewPage(doc, y, 12)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(110, 110, 140)
      y = wrap(doc, p.summary, MARGIN, y, contentW)
      y += 5
    }

    // Helper for bullet sections
    const section = (label, items) => {
      if (!items?.length) return
      y = maybeNewPage(doc, y, 16)
      y = sectionLabel(doc, label, MARGIN, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(70, 68, 100)
      items.forEach(item => {
        y = maybeNewPage(doc, y, 8)
        y = wrap(doc, `• ${item}`, MARGIN + 3, y, contentW - 3)
        y += 1
      })
      y += 4
    }

    const prose = (label, text) => {
      if (!text) return
      y = maybeNewPage(doc, y, 16)
      y = sectionLabel(doc, label, MARGIN, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(70, 68, 100)
      y = wrap(doc, text, MARGIN, y, contentW)
      y += 4
    }

    section('Goals & Motivations', p.goals)
    section('Pain Points', p.painPoints)
    section('Shopping Behavior', p.shoppingBehavior)
    section('Discovery Channels', p.discoveryChannels)
    prose('Image Reaction', p.imageReaction)
    section('Adoption Blockers', p.adoptionBlockers)
    section('Churn Risks', p.churnRisks)
    prose('Reaction to URL', p.urlReaction)

    // Messaging hook — highlighted
    if (p.messagingHook) {
      y = maybeNewPage(doc, y, 20)
      y = sectionLabel(doc, 'Messaging Hook', MARGIN, y)
      doc.setFillColor(18, 14, 30)
      const hookLines = doc.splitTextToSize(`"${p.messagingHook}"`, contentW - 8)
      doc.roundedRect(MARGIN, y - 3, contentW, hookLines.length * LINE_H + 6, 2, 2, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(220, 215, 250)
      doc.text(hookLines, MARGIN + 4, y + 1)
      y += hookLines.length * LINE_H + 10
    }

    // Divider between personas
    if (idx < personas.length - 1) {
      y = maybeNewPage(doc, y, 10)
      doc.setDrawColor(50, 45, 75)
      doc.setLineWidth(0.3)
      doc.line(MARGIN, y, pageW - MARGIN, y)
      y += 10
    }
  })

  // ── Footer on last page ───────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight()
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(100, 100, 130)
  doc.text('Generated by Prism', MARGIN, pageH - 8)
  doc.text(dateStr, pageW - MARGIN, pageH - 8, { align: 'right' })

  doc.save('prism-personas.pdf')
}
