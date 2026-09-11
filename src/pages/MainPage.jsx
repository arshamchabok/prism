import GeneratorPage from '../components/GeneratorPage.jsx'

const examples = [
  { label: 'Meal kit delivery', text: 'A meal kit delivery service targeting busy families who want to cook healthy dinners at home without the hassle of grocery shopping' },
  { label: 'B2B project management', text: 'A B2B project management platform built for remote software engineering teams who need real-time collaboration across time zones' },
  { label: 'First-time homebuyer app', text: 'A mobile app that helps first-time homebuyers understand the mortgage process, compare loan options, and track their application status' },
  { label: 'Freelance design marketplace', text: 'An online marketplace connecting independent graphic designers with small business owners who need affordable brand identity work' },
]

export default function MainPage() {
  return <GeneratorPage kind="main" examples={examples} />
}
