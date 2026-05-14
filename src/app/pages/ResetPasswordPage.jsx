import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound } from 'lucide-react';

import { Button } from '../../shared/components/ui/Button.jsx';
import { httpClient } from '../../shared/services/httpClient.js';

function extractData(payload) {
  if (!payload) return null;
  return payload.data ?? payload;
}

const PASSWORD_HINT =
  'Mínimo 12 caracteres y al menos tres de: minúsculas, mayúsculas, números y símbolos.';

function validateClientPasswordStrength(password) {
  if (password.length < 12) {
    return PASSWORD_HINT;
  }
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const classes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean)
    .length;
  if (classes < 3) {
    return PASSWORD_HINT;
  }
  return '';
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = String(searchParams.get('token') || '').trim();

  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Enlace inválido. Solicita un nuevo restablecimiento desde el login.');
      return;
    }

    if (password !== password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const strengthError = validateClientPasswordStrength(password);
    if (strengthError) {
      setError(strengthError);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = await httpClient.post('/auth/password-reset/confirm', {
        token,
        password
      });
      const data = extractData(payload);
      setSuccess(data?.message || 'Contraseña actualizada.');
      setTimeout(() => navigate('/login', { replace: true }), 1600);
    } catch (err) {
      setError(err?.message || 'No se pudo restablecer la contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page login-page--center">
      <div className="card login-card">
        <div className="login-header">
          <div className="login-reset-icon-wrap" aria-hidden="true">
            <KeyRound size={28} />
          </div>
          <h1 className="login-title">Nueva contraseña</h1>
          <p id="reset-description" className="muted login-reset-lead">
            Introduce tu nueva contraseña para volver a acceder al workspace.
            <span className="login-forgot-hint" style={{ display: 'block', marginTop: 8 }}>
              {PASSWORD_HINT}
            </span>
          </p>
        </div>

        <form
          className="stack"
          onSubmit={handleSubmit}
          aria-describedby="reset-description"
        >
          {error ? (
            <div
              className="card login-form-error-card"
              role="alert"
              aria-live="assertive"
            >
              <p className="muted login-form-error-copy">{error}</p>
            </div>
          ) : null}

          {success ? (
            <div className="card login-success-card" role="status">
              <p className="muted login-form-error-copy">{success}</p>
            </div>
          ) : null}

          <div className="field">
            <label htmlFor="reset-password">Nueva contraseña</label>
            <input
              id="reset-password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={isSubmitting}
              required
              minLength={8}
            />
          </div>

          <div className="field">
            <label htmlFor="reset-password-2">Confirmar contraseña</label>
            <input
              id="reset-password-2"
              className="input"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              autoComplete="new-password"
              disabled={isSubmitting}
              required
              minLength={8}
            />
          </div>

          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            Guardar contraseña
          </Button>

          <p className="login-back-row">
            <Link to="/login" className="login-forgot-link">
              Volver al login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
