// Fixed: P3-28 (React Error Boundary)
import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#0a0e1a',
          color: '#e2e8f0',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'rgba(239,68,68,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: '#f1f5f9' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: 400, marginBottom: 24, lineHeight: 1.6 }}>
            An unexpected error occurred. Please refresh the page or contact support if the issue persists.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              background: 'linear-gradient(135deg, #3B5FCC, #7C3AED)',
              color: 'white',
              border: 'none',
              padding: '12px 28px',
              borderRadius: 12,
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(59,95,204,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 32px rgba(59,95,204,0.4)'; }}
            onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 24px rgba(59,95,204,0.3)'; }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
