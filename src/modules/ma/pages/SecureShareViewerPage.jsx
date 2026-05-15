import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../shared/services/httpClient.js';

const SHARE_RESTORE_KEY = 'ceo_os_ma_secure_share_bundle_v3';

/** React Strict Mode / remount-safe: one in-flight GET per shareId+token. */
const shareFetchDedupeByKey = new Map();

function parseShareFromHash() {
  if (typeof window === 'undefined') return { shareId: '', token: '' };

  const raw = window.location.hash?.startsWith('#')
    ? window.location.hash.slice(1)
    : '';

  if (!raw) return { shareId: '', token: '' };

  const params = new URLSearchParams(raw);
  const shareId =
    params.get('sid') || params.get('shareId') || params.get('share') || '';
  const token = params.get('t') || params.get('token') || '';

  return { shareId, token };
}

function stripSecretsFromLocation() {
  if (typeof window === 'undefined') return;

  const path = `${window.location.pathname}${window.location.search}`;

  window.history.replaceState({}, '', `${path}`);
}

export function SecureShareViewerPage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading');
  const [detail, setDetail] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  useLayoutEffect(() => {
    const bundle = parseShareFromHash();

    if (bundle.shareId && bundle.token) {
      try {
        sessionStorage.setItem(SHARE_RESTORE_KEY, JSON.stringify(bundle));
      } catch {
        //
      }

      stripSecretsFromLocation();
    }
  }, []);

  const loadSecureShareEnvelope = useCallback(async (shareId, token) => {
    const dedupeKey = `${shareId}:${token}`;

    if (!shareFetchDedupeByKey.has(dedupeKey)) {
      const promise = httpClient
        .get(`/ma/public/secure-shares/${encodeURIComponent(shareId)}`, {
          headers: {
            'X-MA-Share-Token': token
          },
          skipAuthExpiredEvent: true
        })
        .finally(() => {
          queueMicrotask(() => shareFetchDedupeByKey.delete(dedupeKey));
        });

      shareFetchDedupeByKey.set(dedupeKey, promise);
    }

    return shareFetchDedupeByKey.get(dedupeKey);
  }, []);

  const loadShare = useCallback(async () => {
    let bundle = {};

    try {
      const restored = sessionStorage.getItem(SHARE_RESTORE_KEY);
      bundle = restored ? JSON.parse(restored) : {};
    } catch {
      bundle = {};
    }

    const shareId = bundle.shareId || '';
    const token = bundle.token || '';

    if (!shareId || !token) {
      setStatus('error');
      setErrorMessage(
        'Este enlace de secure share es invalido o ha caducado en el navegador. Genera uno nuevo desde el informe ejecutivo.'
      );

      return;
    }

    setStatus('loading');

    try {
      const envelope = await loadSecureShareEnvelope(shareId, token);

      const data = envelope?.data ?? envelope;

      if (!data?.report) {
        setStatus('error');
        setErrorMessage('No se pudo cargar el informe para este secure share.');
        return;
      }

      try {
        sessionStorage.removeItem(SHARE_RESTORE_KEY);
      } catch {
        //
      }

      setDetail(data);
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error?.message ||
          'No autorizado para ver este recurso o el token ya no es valido.'
      );
    }
  }, [loadSecureShareEnvelope]);

  useEffect(() => {
    loadShare();
  }, [loadShare]);

  const reportTitle = detail?.report?.title || 'Informe M&A ejecutivo';
  const reportHtml = detail?.report?.payload?.html || '';

  const sandboxFlags = useMemo(
    () => 'allow-downloads allow-modals allow-popups allow-popups-to-escape-sandbox',
    []
  );

  if (status === 'error') {
    return (
      <div className="ma-secure-share-view ma-executive-shell" style={{ padding: '48px 32px', maxWidth: 720 }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 22, letterSpacing: '-0.02em' }}>
            Secure share M&A no disponible
          </h1>
          <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.55 }}>{errorMessage}</p>
        </header>

        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.5 }}>
          El modelo enterprise exige iniciar sesion en la organizacion correcta antes de usar un enlace secure share.
          Inicia sesion y vuelve a abrir el enlace desde la app, o navega al Data Room.
        </p>

        <button
          type="button"
          style={{
            marginTop: 20,
            padding: '12px 20px',
            borderRadius: 10,
            border: 'none',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            cursor: 'pointer',
            fontWeight: 700
          }}
          onClick={() => navigate('/ma/data-room', { replace: true })}
        >
          Ir al Data Room
        </button>
      </div>
    );
  }

  if (status === 'loading' || status === 'ready') {
    return (
      <div className="ma-secure-share-view ma-executive-shell">
        <div
          style={{
            padding: '32px clamp(24px, 6vw, 56px)',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc'
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <p
              style={{
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: 0,
                fontSize: 11,
                color: '#64748b'
              }}
            >
              Secure share ejecutivo · acceso controlado por sesion CEO OS
            </p>
            <h1
              style={{
                margin: '12px 0 4px',
                fontSize: 'clamp(22px, 4vw, 28px)',
                color: '#0f172a'
              }}
            >
              {status === 'loading' ? 'Cargando recurso protegido...' : reportTitle}
            </h1>
            {status === 'ready' ? (
              <p style={{ margin: 0, color: '#475569', fontSize: 14 }}>
                Contenido compartido unicamente dentro de usuarios autorizados de esta organizacion. No distribuir fuera del NDA.
              </p>
            ) : null}
          </div>
        </div>

        <div style={{ padding: '0 clamp(8px, 3vw, 16px)', minHeight: '60vh', backgroundColor: '#0f172a' }}>
          {status === 'loading' ? (
            <div
              style={{
                maxWidth: 480,
                margin: '96px auto',
                textAlign: 'center',
                color: '#e2e8f0'
              }}
            >
              Validando enlace seguro...
            </div>
          ) : (
            <iframe
              title={reportTitle}
              srcDoc={reportHtml || '<html><body><p>No hay HTML embebido en este recurso.</p></body></html>'}
              sandbox={sandboxFlags}
              style={{
                width: '100%',
                border: 'none',
                margin: '24px auto 40px',
                display: 'block',
                borderRadius: 16,
                minHeight: '72vh',
                backgroundColor: '#fff',
                boxShadow: '0 24px 60px rgba(15,23,42,0.35)'
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return null;
}
