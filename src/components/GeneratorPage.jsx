import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CardNav from './CardNav.jsx'
import InputPanel from './InputPanel.jsx'
import FashionInputPanel from './FashionInputPanel.jsx'
import DeployInputPanel from './DeployInputPanel.jsx'
import PlateInputPanel from './PlateInputPanel.jsx'
import FitnessInputPanel from './FitnessInputPanel.jsx'
import PersonaCard from './PersonaCard.jsx'
import FashionPersonaCard from './FashionPersonaCard.jsx'
import DeployPersonaCard from './DeployPersonaCard.jsx'
import PlatePersonaCard from './PlatePersonaCard.jsx'
import FitnessPersonaCard from './FitnessPersonaCard.jsx'
import LoadingPanel from './LoadingPanel.jsx'
import FlowingMenu from './FlowingMenu.jsx'
import TiltedCard from './TiltedCard.jsx'
import Footer from './Footer.jsx'
import { ALL_VERTICALS } from '../data/verticals.js'
import { useGeneration } from '../hooks/useGeneration.js'
import { truncate } from '../utils/helpers.js'

const settings = {
  main: { title: 'Know your customer before they know', emphasis: 'you.', subtitle: 'Describe what you sell. Explore three distinct customer profiles.', accent: '#fb7185', Panel: InputPanel, Card: PersonaCard, results: 'Your Customer Personas' },
  fashion: { title: "Know your shopper’s style before they know", emphasis: 'yours.', subtitle: 'Describe your clothing brand or upload an image to explore three fashion customer profiles.', accent: '#60a5fa', Panel: FashionInputPanel, Card: FashionPersonaCard, results: 'Your Fashion Personas' },
  deploy: { title: 'Know your buyer before they', emphasis: 'sign.', subtitle: 'Describe your software and explore the people who decide, champion, and use it.', accent: '#a78bfa', Panel: DeployInputPanel, Card: DeployPersonaCard, results: 'Your Buyer Profiles' },
  plate: { title: 'Know your diners before they', emphasis: 'walk in.', subtitle: 'Describe your restaurant or food brand. Explore the people who come back for more.', accent: '#fbbf24', Panel: PlateInputPanel, Card: PlatePersonaCard, results: 'Your Dining Personas' },
  fitness: { title: 'Know your members before they', emphasis: 'commit.', subtitle: 'Describe your gym or wellness brand. Explore what motivates three distinct members.', accent: '#34d399', Panel: FitnessInputPanel, Card: FitnessPersonaCard, results: 'Your Fitness Personas' },
}

export default function GeneratorPage({ kind, examples }) {
  const { view, personas, description, error, handleGenerate, reset, cancel } = useGeneration(kind)
  const [input, setInput] = useState('')
  const [extra, setExtra] = useState(null)
  const [selected, setSelected] = useState(0)
  const [pdfError, setPdfError] = useState('')
  const [exporting, setExporting] = useState(false)
  const resultsRef = useRef(null)
  const navigate = useNavigate()
  const config = settings[kind]
  const { Panel, Card } = config
  const verticals = ALL_VERTICALS.filter(vertical => vertical.route !== `/${kind}`)
  const vertical = verticals[selected]

  useEffect(() => {
    if (view === 'results') resultsRef.current?.focus()
  }, [view])

  const newProduct = () => { reset(); setInput(''); setExtra(null); setPdfError('') }
  const download = async () => {
    if (exporting) return
    setExporting(true)
    setPdfError('')
    try {
      const { downloadPersonasPdf } = await import('../utils/downloadPdf.js')
      await downloadPersonasPdf(personas, description, kind === 'fashion', kind === 'deploy', kind === 'plate', kind === 'fitness')
    } catch { setPdfError('The PDF could not be created. Please try again.') }
    finally { setExporting(false) }
  }

  return (
    <div id="app" className={`page-${kind}`}>
      <CardNav />
      <main id="main-content">
        {(view === 'input' || view === 'error') && <>
          <section className="generator-intro" aria-labelledby="generator-title">
            <div className="generator-heading">
              <h1 id="generator-title">{config.title} <em style={{ color: config.accent }}>{config.emphasis}</em></h1>
              <p>{config.subtitle}</p>
            </div>
            <div className="generator-form">
              {error && <div className="error-box" role="alert">{error}</div>}
              <Panel value={input} onChange={setInput} image={extra} onImageChange={setExtra} url={extra || ''} onUrlChange={setExtra} goalType={extra} onGoalTypeChange={setExtra} onGenerate={handleGenerate} />
              <p className="privacy-note">When you generate, your description and any image or URL are sent through Cloudflare to Anthropic. Avoid personal or confidential information. <Link to="/privacy">Privacy details</Link></p>
              <div className="examples-row"><span className="examples-row-label">Try:</span>{examples.map(example => <button key={example.label} className="example-pill" onClick={() => setInput(example.text)}>{example.label}</button>)}</div>
            </div>
          </section>
          <section className="vertical-picker" aria-label="Explore Prism tools">
            <div className="vp-inner">
              <div className="vp-left"><FlowingMenu items={verticals} selected={selected} onSelect={setSelected} /></div>
              <div className="vp-right"><TiltedCard key={vertical.label} {...vertical} imageUrl={vertical.cardImageUrl} onLaunch={() => navigate(vertical.route)} /></div>
            </div>
          </section>
        </>}
        {view === 'loading' && <><LoadingPanel accentColor={config.accent} /><div className="generation-actions"><button className="reset-btn" onClick={cancel}>Cancel generation</button></div></>}
        {view === 'results' && <section className="results-section">
          <div className="results-header">
            <div><h1 className="results-title" ref={resultsRef} tabIndex={-1}>{config.results}</h1><div className="results-subtitle">Generated for: <em>{truncate(description)}</em></div></div>
            <button className="reset-btn" onClick={newProduct}>← New {kind === 'main' || kind === 'deploy' ? 'product' : 'brand'}</button>
          </div>
          <p className="results-note">AI-generated fictional profiles. Validate these hypotheses with customer research before making decisions.</p>
          <div className="personas-grid">{personas.map((persona, index) => <Card key={index} persona={persona} />)}</div>
          <div className="generation-actions"><button className="download-pdf-btn" disabled={exporting} onClick={download}>{exporting ? 'Preparing PDF…' : '↓ Download as PDF'}</button></div>
          {pdfError && <p className="error-box" role="alert">{pdfError}</p>}
        </section>}
      </main>
      <Footer />
    </div>
  )
}
