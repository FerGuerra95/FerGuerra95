import React from 'react';

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100dvh',
            display: 'grid',
            placeItems: 'center',
            padding: 32,
            background: '#0b1020',
            color: '#e8edf7',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <h1 style={{ fontSize: 20, marginBottom: 12 }}>Algo salió mal</h1>
            <p style={{ opacity: 0.85, lineHeight: 1.5, marginBottom: 20 }}>
              La interfaz encontró un error inesperado. Puedes recargar la página
              o volver al inicio.
            </p>
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.06)',
                color: '#e8edf7',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Ir al inicio
            </button>
            {import.meta.env?.DEV ? (
              <pre
                style={{
                  marginTop: 24,
                  textAlign: 'left',
                  fontSize: 11,
                  opacity: 0.7,
                  overflow: 'auto',
                  maxHeight: 200
                }}
              >
                {String(this.state.error?.stack || this.state.error?.message || '')}
              </pre>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
