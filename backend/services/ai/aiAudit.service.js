const SECRET_KEY_PATTERNS = [
  /password/i,
  /passwordHash/i,
  /passwordSalt/i,
  /token/i,
  /accessToken/i,
  /refreshToken/i,
  /idToken/i,
  /cookie/i,
  /authorization/i,
  /authHeader/i,
  /secureShareToken/i,
  /apiKey/i,
  /secret/i,
  /privateKey/i
];

const REDACTED = '[REDACTED]';

function isSecretKey(key) {
  return SECRET_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

export function redactAiPayload(payload) {
  if (Array.isArray(payload)) {
    return payload.map((item) => redactAiPayload(item));
  }
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (isSecretKey(key)) {
        return [key, REDACTED];
      }
      return [key, redactAiPayload(value)];
    })
  );
}

export function buildAiAuditRecord({
  useCase,
  organizationId,
  actorId,
  provider,
  promptVersion,
  result,
  blockedReason,
  metadata
} = {}) {
  const safeMetadata = redactAiPayload(metadata ?? {});

  return {
    useCase,
    organizationId,
    actorId: actorId ?? null,
    timestamp: new Date().toISOString(),
    provider: provider ?? 'disabled',
    promptVersion: promptVersion ?? null,
    result: result ?? 'blocked',
    blockedReason: blockedReason ?? null,
    metadata: safeMetadata
  };
}
