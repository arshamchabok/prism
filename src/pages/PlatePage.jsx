import GeneratorPage from '../components/GeneratorPage.jsx'

const examples = [
  { label: 'Neighborhood trattoria', text: 'A cozy neighborhood Italian trattoria offering wood-fired pizza and house-made pasta in a family-friendly atmosphere' },
  { label: 'Farm-to-table brunch', text: 'An upscale farm-to-table brunch spot in a trendy urban neighborhood focused on locally sourced seasonal ingredients and natural wines' },
  { label: 'Fast-casual Korean BBQ', text: 'A fast-casual Korean BBQ chain targeting millennials who want bold flavors and customizable bowls at a quick weekday lunch' },
  { label: 'Specialty coffee cafe', text: 'A boutique specialty coffee roaster and cafe attracting remote workers and coffee enthusiasts in a creative district with single-origin pour-overs' },
]

export default function PlatePage() {
  return <GeneratorPage kind="plate" examples={examples} />
}
