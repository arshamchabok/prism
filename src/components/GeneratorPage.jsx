import { useEffect, useRef, useState } from 'react'
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

const settings = {
  main: {
    title: 'Know your customer before they know',
    emphasis: 'you.',
    subtitle: 'Describe what you sell. Meet the three people who buy it.',
    accent: '#fb7185',
    Panel: InputPanel,
    Card: PersonaCard,
    results: 'Your customer personas',
  },
  fashion: {
    title: 'Know your shopper before they know',
    emphasis: 'yours.',
    subtitle: 'Describe your label. Meet the three shoppers who wear it.',
    accent: '#60a5fa',
    Panel: FashionInputPanel,
    Card: FashionPersonaCard,
    results: 'Your fashion personas',
  },
  deploy: {
    title: 'Know your buyer before they',
    emphasis: 'sign.',
    subtitle: 'Describe your product. Meet the three people who sign for it.',
    accent: '#a78bfa',
    Panel: DeployInputPanel,
    Card: DeployPersonaCard,
    results: 'Your buyer profiles',
  },
  plate: {
    title: 'Know your diners before they',
    emphasis: 'walk in.',
    subtitle: 'Describe your restaurant. Meet the three people who book it.',
    accent: '#fbbf24',
    Panel: PlateInputPanel,
    Card: PlatePersonaCard,
    results: 'Your dining personas',
  },
  fitness: {
    title: 'Know your members before they',
    emphasis: 'commit.',
    subtitle: 'Pick a goal. Meet the three members who show up for it.',
    accent: '#34d399',
    Panel: FitnessInputPanel,
    Card: FitnessPersonaCard,
    results: 'Your fitness personas',
  },
}

export default function GeneratorPage({ kind, examples }) {
  const { view, personas, description, error, handleGenerate, reset, cancel } = useGeneration(kind)
  const [input, setInput] = useState('')
  const [extra, setExtra] = useState(null)
  const [pdfError, setPdfError] = useState('')
  const [exporting, setExporting] = useState(false)
  const [openCard, setOpenCard] = useState(-1)
  const resultsRef = useRef(null)
  const config = settings[kind]
  const { Panel, Card } = config
  const composing = view === 'input' || view === 'error'

  useEffect(() => {
    if (view === 'results') { resultsRef.current?.focus(); setOpenCard(-1) }
  }, [view])

  // An opened profile moves in the grid — bring it back into view if it left.
  useEffect(() => {
    if (openCard < 0) return
    document.querySelector('.persona-slot.is-open')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [openCard])

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
        {composing && (
          <section className="stage" aria-labelledby="generator-title">
            <header className="stage-head">
              <h1 className="hero-title" id="generator-title">{config.title} <em>{config.emphasis}</em></h1>
              <p className="hero-sub">{config.subtitle}</p>
            </header>
            <div className="stage-console">
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
            </div>
          </section>
        )}

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
          <p className="results-note">These are AI-generated hypotheses, not research. Test them in a real customer conversation before you build or spend against them. Open a profile to read it full width.</p>
          <div className={`personas-grid${openCard >= 0 ? ' has-open' : ''}`}>
            {personas.map((persona, index) => {
              const open = openCard === index
              const toggle = () => setOpenCard(open ? -1 : index)
              return (
                <div key={index} className={`persona-slot${open ? ' is-open' : ''}`} onClick={toggle}>
                  <Card persona={persona} />
                  <button
                    type="button"
                    className="persona-toggle"
                    aria-expanded={open}
                    onClick={event => { event.stopPropagation(); toggle() }}
                  >
                    {open ? 'Collapse' : 'Open'} {persona.name}
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d={open ? 'M2 7.5 6 3.5 10 7.5' : 'M2 4.5 6 8.5 10 4.5'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
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
