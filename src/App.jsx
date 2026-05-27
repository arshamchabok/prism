import { HashRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage.jsx'
import FashionPage from './pages/FashionPage.jsx'
import AboutPage from './pages/AboutPage.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/fashion" element={<FashionPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </HashRouter>
  )
}
