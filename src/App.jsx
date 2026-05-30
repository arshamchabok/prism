import { HashRouter, Routes, Route } from 'react-router-dom'
import Prism from './components/Prism.jsx'
import MainPage from './pages/MainPage.jsx'
import FashionPage from './pages/FashionPage.jsx'
import DeployPage from './pages/DeployPage.jsx'
import AboutPage from './pages/AboutPage.jsx'

export default function App() {
  return (
    <HashRouter>
      <div className="prism-background">
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
      </div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/fashion" element={<FashionPage />} />
        <Route path="/deploy" element={<DeployPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </HashRouter>
  )
}
