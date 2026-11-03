import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
    try {
      window.__LAST_ERROR__ = {
        message: error?.message,
        stack: error?.stack,
        componentStack: errorInfo?.componentStack
      };
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0B0F17',
          color: '#FAF9F6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#F5A623' }}>
            Sahara Staffing Inc.
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: '16px', maxWidth: '420px', lineHeight: '1.6' }}>
            A temporary interface glitch occurred. Click below to refresh the page.
          </p>

          {this.state.error && (
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              padding: '16px',
              maxWidth: '680px',
              width: '100%',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <div style={{ color: '#F87171', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                {this.state.error.name}: {this.state.error.message}
              </div>
              <pre style={{
                color: '#94A3B8',
                fontSize: '11px',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                margin: 0,
                maxHeight: '160px',
                overflow: 'auto'
              }}>
                {this.state.error.stack}
              </pre>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#F5A623',
              color: '#0B0F17',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '9999px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

