import { Component, StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? (
      <div className="flex min-h-screen items-center justify-center bg-cream p-6 text-center font-serif text-charcoal">
        <div>
          <h1 className="font-display text-2xl text-burgundy">ERROR: TOO MANY FEELINGS.</h1>
          <p className="mt-2">This time it is real. Your shelf is safe. Please reload the page.</p>
          <button className="btn btn-primary mx-auto mt-4" onClick={() => location.reload()}>Reload</button>
        </div>
      </div>
    ) : (
      this.props.children
    )
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Boundary>
      <App />
    </Boundary>
  </StrictMode>,
)
