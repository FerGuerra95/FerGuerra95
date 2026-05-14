import nodemailer from 'nodemailer';

function getEnv(name) {
  return String(process.env[name] || '').trim();
}

export function isSmtpConfigured() {
  return Boolean(getEnv('SMTP_HOST') && getEnv('EMAIL_FROM'));
}

function buildTransport() {
  const host = getEnv('SMTP_HOST');
  const port = Number.parseInt(getEnv('SMTP_PORT') || '587', 10);
  const user = getEnv('SMTP_USER');
  const pass = getEnv('SMTP_PASS') || getEnv('SMTP_PASSWORD');
  const secure =
    getEnv('SMTP_SECURE') === 'true' ||
    port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined
  });
}

/**
 * Envía el correo de restablecimiento cuando SMTP está configurado.
 * Si no hay SMTP, el caller puede seguir con log solo en desarrollo.
 */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      reason: 'smtp_not_configured'
    };
  }

  const from = getEnv('EMAIL_FROM');
  const subject = 'Restablecer contraseña — CEO OS';
  const text = [
    'Has solicitado restablecer tu contraseña.',
    '',
    `Enlace (válido 1 hora): ${resetUrl}`,
    '',
    'Si no fuiste tú, ignora este mensaje.'
  ].join('\n');

  const html = `
    <p>Has solicitado restablecer tu contraseña.</p>
    <p><a href="${resetUrl}">Restablecer contraseña</a></p>
    <p style="color:#666;font-size:12px">Si no fuiste tú, ignora este mensaje.</p>
  `;

  const transport = buildTransport();
  await transport.sendMail({
    from,
    to,
    subject,
    text,
    html
  });

  return { sent: true };
}
