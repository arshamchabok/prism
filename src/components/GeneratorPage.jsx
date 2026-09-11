import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
import Footer from './Footer.jsx'
import { useGeneration } from '../hooks/useGeneration.js'
import { truncate } from '../utils/helpers.js'

const BAND_COLORS = ['#fb7185', '#fbbf24', '#22d3ee']

const settings = {
  main: {
    tool: null,
    title: 'Know your customer before they know',
    emphasis: 'you.',
    subtitle: 'Describe what you sell. Prism splits it into three customer profiles you can argue with, test, and take to a real interview.',
    accent: '#fb7185',
    Panel: InputPanel,
    Card: PersonaCard,
    results: 'Your customer personas',
    bands: [
      ['Goals and motivations', 'What each person is actually trying to get done.'],
      ['Daily pain points', 'The friction that makes them look for something new.'],
      ['The message that lands', 'One sentence written to their psychology, not yours.'],
    ],
  },
  fashion: {
    tool: 'Fashion',
    title: 'Know your shopper’s style before they know',
    emphasis: 'yours.',
    subtitle: 'Describe your label or upload a lookbook image. Prism reads the aesthetic and returns three shoppers who would wear it.',
    accent: '#60a5fa',
    Panel: FashionInputPanel,
    Card: FashionPersonaCard,
    results: 'Your fashion personas',
    bands: [
      ['Style archetype', 'The fashion tribe each shopper identifies with.'],
      ['Budget and behaviour', 'What they spend, and whether they plan or impulse buy.'],
      ['Where they find you', 'The specific feeds, shops and people they follow.'],
    ],
  },
  deploy: {
    tool: 'Deploy',
    title: 'Know your buyer before they',
    emphasis: 'sign.',
    subtitle: 'Describe your software. Prism maps the three people behind every B2B deal — and what each one needs before they say yes.',
    accent: '#a78bfa',
    Panel: DeployInputPanel,
    Card: DeployPersonaCard,
    results: 'Your buyer profiles',
    bands: [
      ['The economic buyer', 'Signs the contract. Kills deals at security and legal.'],
      ['The champion', 'Ran the trial and staked their credibility on it.'],
      ['The end user', 'In the product daily. Decides whether it survives renewal.'],
    ],
  },
  plate: {
    tool: 'Plate',
    title: 'Know your diners before they',
    emphasis: 'walk in.',
    subtitle: 'Describe your restaurant or upload a dish. Prism returns the three people who fill your room on a normal week.',
    accent: '#fbbf24',
    Panel: PlateInputPanel,
    Card: PlatePersonaCard,
    results: 'Your dining personas',
    bands: [
      ['The regular', 'Has a usual. Notices when the price or the cook changes.'],
      ['The occasion diner', 'Books ahead, spends more, tells six people after.'],
      ['The discoverer', 'First visit. Decides in the first four minutes.'],
    ],
  },
  fitness: {
    tool: 'Fitness',
    title: 'Know your members before they',
    emphasis: 'commit.',
    subtitle: 'Pick a goal and describe your programme. Prism returns three members, what brought them in, and what makes them stay.',
    accent: '#34d399',
    Panel: FitnessInputPanel,
    Card: FitnessPersonaCard,
    results: 'Your fitness personas',
    bands: [
      ['The beginner', 'Starting over. Fear, not motivation, is the barrier.'],
      ['The committed regular', 'Trains four times a week and judges your programming.'],
      ['The comeback', 'Returning after a gap. Motivated, and easy to lose.'],
    ],
  },
}

export default function GeneratorPage({ kind, examples }) {
  const { view, personas, description, error, handleGenerate, reset, cancel } = useGeneration(kind)
  const [input, setInput] = useState('')
  const [extra, setExtra] = useState(null)
  const [pdfError, setPdfError] = useState('')
  const [exporting, setExporting] = useState(false)
  const resultsRef = useRef(null)
  const consoleRef = useRef(null)
  const config = settings[kind]
  const { Panel, Card } = config
  const composing = view === 'input' || view === 'error'

  useEffect(() => {
    if (view === 'results') resultsRef.current?.focus()
  }, [view])

  // Snap points only exist while the hero and the input are the whole page.
  useEffect(() => {
    document.documentElement.classList.toggle('stage-snap', composing)
    return () => document.documentElement.classList.remove('stage-snap')
  }, [composing])

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
        {composing && <>
          <section className="stage-hero" aria-labelledby="generator-title">
            {config.tool && <p className="hero-tool">Prism <span>{config.tool}</span></p>}
            <h1 className="hero-title" id="generator-title">{config.title} <em>{config.emphasis}</em></h1>
            <p className="hero-sub">{config.subtitle}</p>
            <div className="hero-spectrum">
              {config.bands.map(([label, note], index) => (
                <div className="hero-band" key={label} style={{ '--band': BAND_COLORS[index] }}>
                  <b>{label}</b>
                  <span>{note}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="hero-cue"
              onClick={() => consoleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              Start describing
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v9M2 6.5 6 10.5 10 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </section>

          <section className="stage-console" ref={consoleRef} aria-label="Describe your product">
            <div className="console-inner">
              {error && <div className="error-box" role="alert">{error}</div>}
              <Panel
                value={input}
                onChange={setInput}
                image={extra}
                onImageChange={setExtra}
                url={extra || ''}
                onUrlChange={setExtra}
                goalType={extra}
                onGoalTypeChange={setExtra}
                onGenerate={handleGenerate}
              />
              <div className="examples-row">
                <span className="examples-row-label">Try one:</span>
                {examples.map(example => (
                  <button key={example.label} className="example-pill" onClick={() => setInput(example.text)}>{example.label}</button>
                ))}
              </div>
              <p className="privacy-note">
                Your description and any image or URL are sent through Cloudflare to Anthropic when you generate. Leave out personal or confidential details. <Link to="/privacy">How Prism handles your input</Link>
              </p>
            </div>
            <Footer />
          </section>
        </>}

        {view === 'loading' && <>
          <LoadingPanel accentColor={config.accent} />
          <div className="generation-actions"><button className="reset-btn" onClick={cancel}>Cancel generation</button></div>
        </>}

        {view === 'results' && <section className="results-section">
          <div className="results-header">
            <div>
              <h1 className="results-title" ref={resultsRef} tabIndex={-1}>{config.results}</h1>
              <div className="results-subtitle">Generated for: <em>{truncate(description)}</em></div>
            </div>
            <button className="reset-btn" onClick={newProduct}>← New {kind === 'main' || kind === 'deploy' ? 'product' : 'brand'}</button>
          </div>
          <p className="results-note">These are AI-generated hypotheses, not research. Test them in a real customer conversation before you build or spend against them.</p>
          <div className="personas-grid">{personas.map((persona, index) => <Card key={index} persona={persona} />)}</div>
          <div className="generation-actions">
            <button className="download-pdf-btn" disabled={exporting} onClick={download}>{exporting ? 'Preparing PDF…' : '↓ Download as PDF'}</button>
          </div>
          {pdfError && <p className="error-box" role="alert">{pdfError}</p>}
        </section>}
      </main>
      {!composing && <Footer />}
    </div>
  )
}
