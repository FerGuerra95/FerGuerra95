import React, { useState } from 'react';
import { Eye, EyeOff, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../shared/components/ui/Button.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

function resolveInitialForm(isDemoAuthEnabled) {
  if (isDemoAuthEnabled) {
    return {
      email: 'admin@ceoos.local',
      password: 'admin123'
    };
  }

  return {
    email: '',
    password: ''
  };
}

function resolveRedirectPath(location) {
  const from = location.state?.from?.pathname;

  if (!from || from === '/login') {
    return '/dashboard';
  }

  return from;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated,
    isLoading,
    isDemoAuthEnabled = false
  } = useAuth();

  const [form, setForm] = useState(() =>
    resolveInitialForm(isDemoAuthEnabled)
  );

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = resolveRedirectPath(location);

  function updateField(key, value) {
    setError('');

    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const email = String(form.email || '').trim();
    const password = String(form.password || '').trim();

    if (!email || !password) {
      setError('Introduce email y contraseña.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const result = await login({
        email,
        password
      });

      if (!result?.ok) {
        setError(result?.message || 'Email o contraseña incorrectos.');
        return;
      }

      navigate(from, { replace: true });
    } catch {
      setError('No se pudo iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#0b1020',
          color: '#e8edf7'
        }}
      >
        Cargando sesión...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background:
          'radial-gradient(circle at top left, rgba(16,185,129,0.16), transparent 34%), #0b1020'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 460
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 16px',
              background: 'rgba(16,185,129,0.16)',
              border: '1px solid rgba(16,185,129,0.35)'
            }}
          >
            <ShieldCheck size={28} className="text-success" />
          </div>

          <div className="badge" style={{ marginBottom: 12 }}>
            CEO&apos;s OS
          </div>

          <h1 style={{ margin: 0, fontSize: 30 }}>
            Acceso privado
          </h1>

          <p className="muted" style={{ marginTop: 10 }}>
            Inicia sesion para acceder al workspace de M&A, Compliance y Funding.
          </p>
        </div>

        <form className="stack" onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>

          <div className="field">
            <label>Contraseña</label>

            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <input
                className="input"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
                style={{
                  paddingRight: 52
                }}
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                title={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                disabled={isSubmitting}
                style={{
                  position: 'absolute',
                  right: 10,
                  width: 34,
                  height: 34,
                  border: 0,
                  borderRadius: 12,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#95a0b8'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error ? (
            <div
              className="card"
              style={{
                background: 'rgba(239,68,68,0.10)',
                borderColor: 'rgba(239,68,68,0.28)',
                padding: 14
              }}
            >
              <p className="muted" style={{ marginBottom: 0 }}>
                {error}
              </p>
            </div>
          ) : null}

          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            <LogIn size={16} />
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {isDemoAuthEnabled ? (
          <div
            className="card"
            style={{
              marginTop: 18,
              background: 'rgba(255,255,255,0.04)',
              padding: 14
            }}
          >
            <div className="row">
              <Lock size={16} />
              <div>
                <strong>Credenciales demo</strong>
                <p className="muted" style={{ marginBottom: 0 }}>
                  admin@ceoos.local - admin123
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
