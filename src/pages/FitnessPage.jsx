import GeneratorPage from '../components/GeneratorPage.jsx'

const examples = [
  { label: 'Boutique HIIT studio', text: 'A boutique HIIT studio offering 45-minute group classes for busy professionals who want efficient results without a long gym commitment' },
  { label: 'Online personal trainer', text: 'An online personal training service pairing remote clients with certified coaches for 12-week customized strength and nutrition programs' },
  { label: 'Yoga and wellness studio', text: 'A yoga and mindfulness wellness studio serving adults seeking stress relief, flexibility, and a supportive community in an urban neighborhood' },
  { label: 'CrossFit gym', text: 'A CrossFit affiliate gym focused on building a tight-knit community of athletes who push each other toward elite functional fitness' },
]

export default function FitnessPage() {
  return <GeneratorPage kind="fitness" examples={examples} />
}
