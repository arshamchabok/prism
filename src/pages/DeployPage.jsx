import GeneratorPage from '../components/GeneratorPage.jsx'

const examples = [
  { label: 'Sales intelligence', text: 'AI-powered sales intelligence platform helping enterprise SDRs identify and engage high-intent B2B accounts through intent signals and automated research' },
  { label: 'HR automation', text: 'HR automation software for mid-market companies streamlining benefits enrollment, onboarding workflows, and compliance reporting' },
  { label: 'DevOps observability', text: 'Developer observability SaaS helping platform engineering teams monitor microservice health, trace distributed systems, and debug production incidents' },
  { label: 'Construction PM', text: 'B2B project management tool for construction firms tracking subcontractor schedules, budget variance, and safety compliance across job sites' },
]

export default function DeployPage() {
  return <GeneratorPage kind="deploy" examples={examples} />
}
