import { saveMemoryState, takeMemoryState } from './oidcStateStore.memory.js';
import { getSharedRedis } from '../../lib/redisClient.js';

const STATE_TTL_SECONDS = 600;

function redisKey(state) {
  return `ceos:oidc:state:${state}`;
}

export async function saveOidcState(state, payload) {
  const safeState = String(state || '');
  if (!safeState) return;

  const body = {
    nonce: payload.nonce,
    codeVerifier: payload.codeVerifier,
    expires: Date.now() + STATE_TTL_SECONDS * 1000
  };

  const redis = await getSharedRedis();
  if (redis) {
    await redis.set(redisKey(safeState), JSON.stringify(body), {
      EX: STATE_TTL_SECONDS
    });
    return;
  }

  saveMemoryState(safeState, body);
}

export async function takeOidcState(state) {
  const safeState = String(state || '');
  if (!safeState) return null;

  const redis = await getSharedRedis();
  if (redis) {
    const key = redisKey(safeState);
    const raw = await redis.get(key);
    if (raw) {
      await redis.del(key);
    }
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  return takeMemoryState(safeState);
}
