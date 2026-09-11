import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <span className="footer-left">Prism — customer hypotheses, generated in seconds. Verify before you spend.</span>
      <div className="footer-right">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/privacy">Privacy</Link>
      </div>
    </footer>
  )
}
