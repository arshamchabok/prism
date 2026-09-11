import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
const Prism = lazy(() => import('./components/Prism.jsx'))
import MainPage from './pages/MainPage.jsx'
import FashionPage from './pages/FashionPage.jsx'
import DeployPage from './pages/DeployPage.jsx'
import PlatePage from './pages/PlatePage.jsx'
import FitnessPage from './pages/FitnessPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import CardNav from './components/CardNav.jsx'

function RouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.title = pathname === '/' ? 'Prism — AI Customer Persona Generator' : `Prism — ${pathname.slice(1).replace(/^./, c => c.toUpperCase())}`
  }, [pathname])
  return null
}

export default function App() {
  return (
    <HashRouter>
      <RouteEffects />
      <div className="prism-background" aria-hidden="true">
        <Suspense fallback={null}>
        <Prism
          animationType="3drotate"
          timeScale={0.5}
          scale={2}
          height={4.4}
          baseWidth={5.5}
          noise={0}
          glow={0.7}
          hueShift={0}
          colorFrequency={1}
        />
        </Suspense>
      </div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/fashion" element={<FashionPage />} />
        <Route path="/deploy" element={<DeployPage />} />
        <Route path="/plate" element={<PlatePage />} />
        <Route path="/fitness" element={<FitnessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<div id="app"><CardNav /><main id="main-content" className="about-section"><h1>Page not found</h1><Link to="/">Return to Prism</Link></main></div>} />
      </Routes>
    </HashRouter>
  )
}
