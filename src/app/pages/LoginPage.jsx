import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../shared/components/ui/Button.jsx';
import { BrandLogo } from '../../shared/components/brand/BrandLogo.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';
import { getResolvedApiBaseUrl, httpClient } from '../../shared/services/httpClient.js';

const LOGIN_COPY = {
  title: 'Acceso privado',
  subtitle: 'Inicia sesión para acceder al workspace de M&A, Compliance y Funding.',
  emptyCredentials: 'Introduce email y contraseña.',
  invalidCredentials: 'Email o contraseña incorrectos.',
  genericError: 'No se pudo iniciar sesión.',
  ssoLabel: 'Continuar con SSO',
  ssoUnavailable: 'El inicio de sesión SSO no está disponible en este entorno.',
  ssoStartError: 'No se pudo iniciar SSO.',
  ssoNetworkError: 'No se pudo conectar con el servidor para SSO.',
  forgotPassword: '¿Olvidaste tu contraseña?',
  forgotTitle: 'Restablecer contraseña',
  forgotHint:
    'Te enviaremos un enlace si el email está registrado (revisa también la carpeta de spam).',
  forgotEmailLabel: 'Email de la cuenta',
  forgotSubmit: 'Enviar enlace',
  forgotSubmitting: 'Enviando...',
  forgotEmptyEmail: 'Introduce el email de tu cuenta.',
  forgotBack: 'Volver al inicio de sesión',
  enterpriseNote: 'Sesión cifrada · MFA/SSO ready · Auditoría de acceso'
};

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

function readAccessTokenFromHash() {
  const raw = window.location.hash?.replace(/^#/, '') || '';
  if (!raw) return '';
  return String(new URLSearchParams(raw).get('access_token') || '').trim();
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    completeSessionWithToken,
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

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  const [ssoStarting, setSsoStarting] = useState(false);

  const from = resolveRedirectPath(location);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('sso_error');
    if (!err) return;

    try {
      setError(decodeURIComponent(err));
    } catch {
      setError(err);
    }

    params.delete('sso_error');
    const qs = params.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
    window.history.replaceState(null, '', next);
  }, []);

  useEffect(() => {
    const token = readAccessTokenFromHash();
    if (!token) return undefined;

    let cancelled = false;

    (async () => {
      const result = await completeSessionWithToken(token);
      if (cancelled) return;

      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`
      );

      if (result?.ok) {
        navigate(from, { replace: true });
      } else {
        setError(result?.message || 'No se pudo validar la sesión SSO.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [completeSessionWithToken, from, navigate]);

  function updateField(key, value) {
    setError('');

    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function openForgot() {
    setShowForgot(true);
    setForgotEmail(String(form.email || '').trim());
    setForgotError('');
    setForgotSuccess('');
    setError('');
  }

  function closeForgot() {
    setShowForgot(false);
    setForgotError('');
    setForgotSuccess('');
  }

  async function handleForgotSubmit(event) {
    event.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const email = String(forgotEmail || '').trim();
    if (!email) {
      setForgotError(LOGIN_COPY.forgotEmptyEmail);
      return;
    }

    setForgotSubmitting(true);

    try {
      const payload = await httpClient.post('/auth/password-reset/request', {
        email
      });
      const data = payload?.data ?? payload;
      setForgotSuccess(
        data?.message ||
          'Si el email existe en el sistema, recibirás instrucciones para restablecer la contraseña.'
      );
    } catch (e) {
      setForgotError(e?.message || LOGIN_COPY.genericError);
    } finally {
      setForgotSubmitting(false);
    }
  }

  async function handleSsoStart() {
    setError('');
    setSsoStarting(true);
    const startUrl = `${getResolvedApiBaseUrl()}/auth/oidc/start`;

    try {
      const res = await fetch(startUrl, {
        method: 'GET',
        redirect: 'manual',
        credentials: 'include'
      });

      if (res.status === 503) {
        let msg = LOGIN_COPY.ssoUnavailable;
        try {
          const payload = await res.json();
          msg = payload?.error?.message || msg;
        } catch {
          // ignore
        }
        setError(msg);
        return;
      }

      if (
        res.type === 'opaqueredirect' ||
        (res.status >= 300 && res.status < 400)
      ) {
        window.location.assign(startUrl);
        return;
      }

      if (!res.ok) {
        let msg = LOGIN_COPY.ssoStartError;
        try {
          const payload = await res.json();
          msg = payload?.error?.message || msg;
        } catch {
          // ignore
        }
        setError(msg);
        return;
      }

      window.location.assign(startUrl);
    } catch {
      setError(LOGIN_COPY.ssoNetworkError);
    } finally {
      setSsoStarting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const email = String(form.email || '').trim();
    const password = String(form.password || '').trim();

    if (!email || !password) {
      setError(LOGIN_COPY.emptyCredentials);
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
        setError(result?.message || LOGIN_COPY.invalidCredentials);
        return;
      }

      navigate(from, { replace: true });
    } catch {
      setError(LOGIN_COPY.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  if (isLoading) {
    return (
      <main
        className="login-page login-page--center"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="login-loading-text">Cargando sesión...</div>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <main className="login-page login-page--center">
      <div className="card login-card">
        <div className="login-header">
          <div className="login-brand-emblem-wrap">
            <BrandLogo
              variant="emblem"
              emblemAsset="lion"
              size="auth"
              surface="transparent"
              loading="eager"
              className="login-brand-emblem-logo"
            />
          </div>

          <h1 className="login-title">{LOGIN_COPY.title}</h1>

          <p id="login-description" className="muted" style={{ marginTop: 10 }}>
            {LOGIN_COPY.subtitle}
          </p>
        </div>

        {showForgot ? (
          <div className="login-forgot-panel">
            <h2 className="login-title" style={{ fontSize: '1.15rem' }}>
              {LOGIN_COPY.forgotTitle}
            </h2>
            <p className="login-forgot-hint">{LOGIN_COPY.forgotHint}</p>

            <form className="stack" onSubmit={handleForgotSubmit}>
              <div className="field">
                <label htmlFor="forgot-email">{LOGIN_COPY.forgotEmailLabel}</label>
                <input
                  id="forgot-email"
                  className="input"
                  type="email"
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                  autoComplete="email"
                  disabled={forgotSubmitting}
                  required
                />
              </div>

              {forgotError ? (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="card login-form-error-card"
                >
                  <p className="muted login-form-error-copy">{forgotError}</p>
                </div>
              ) : null}

              {forgotSuccess ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="card login-success-card"
                >
                  <p className="muted login-form-error-copy" style={{ margin: 0 }}>
                    {forgotSuccess}
                  </p>
                  <p className="muted login-forgot-hint" style={{ marginTop: 10 }}>
                    Tras restablecer la contraseña podrás{' '}
                    <Link to="/login">volver a iniciar sesión</Link>.
                  </p>
                </div>
              ) : null}

              <Button
                type="submit"
                loading={forgotSubmitting}
                disabled={forgotSubmitting}
              >
                {forgotSubmitting ? LOGIN_COPY.forgotSubmitting : LOGIN_COPY.forgotSubmit}
              </Button>

              <p className="login-back-row">
                <button
                  type="button"
                  className="login-forgot-link"
                  onClick={closeForgot}
                >
                  {LOGIN_COPY.forgotBack}
                </button>
              </p>
            </form>
          </div>
        ) : (
          <form
            className="stack"
            onSubmit={handleSubmit}
            id="login-form"
            aria-describedby={
              error ? 'login-description login-form-error' : 'login-description'
            }
          >
            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="input"
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                autoComplete="email"
                disabled={isSubmitting || ssoStarting}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="login-password">Contraseña</label>

              <div className="login-password-wrap">
                <input
                  id="login-password"
                  className="input login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  autoComplete="current-password"
                  disabled={isSubmitting || ssoStarting}
                  required
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
                  disabled={isSubmitting || ssoStarting}
                  className="login-password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error ? (
              <div
                id="login-form-error"
                role="alert"
                aria-live="assertive"
                className="card login-form-error-card"
              >
                <p className="muted login-form-error-copy">{error}</p>
              </div>
            ) : null}

            <div className="login-actions-secondary">
              <Button
                type="button"
                variant="secondary"
                loading={ssoStarting}
                disabled={isSubmitting || ssoStarting}
                onClick={handleSsoStart}
              >
                <KeyRound size={16} />
                {LOGIN_COPY.ssoLabel}
              </Button>
              <button
                type="button"
                className="login-forgot-link"
                onClick={openForgot}
                disabled={isSubmitting || ssoStarting}
              >
                {LOGIN_COPY.forgotPassword}
              </button>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting || ssoStarting}
            >
              <LogIn size={16} />
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="login-enterprise-note" role="note" aria-live="polite">
              <ShieldCheck size={16} />
              <span>{LOGIN_COPY.enterpriseNote}</span>
            </div>
          </form>
        )}

        {isDemoAuthEnabled ? (
          <div className="card login-demo-card">
            <div className="row">
              <Lock size={16} />
              <div>
                <strong>Credenciales demo</strong>
                <p className="muted login-demo-copy">
                  admin@ceoos.local - admin123
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
