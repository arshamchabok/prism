import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <main className="about-section"><h1>Prism could not display this page.</h1><p>Please reload to try again. Reloading clears the current draft.</p><button className="reset-btn" onClick={() => window.location.reload()}>Reload Prism</button></main>
    return this.props.children
  }
}
