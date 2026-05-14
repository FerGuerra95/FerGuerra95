import { createClient } from 'redis';

let redisFailure = false;
let redisPromise = null;

function getRedisUrl() {
  return String(process.env.REDIS_URL || '').trim();
}

/**
 * Cliente Redis compartido (OIDC state, rate limit, etc.).
 * Si no hay REDIS_URL o la conexión falla, devuelve null.
 */
export async function getSharedRedis() {
  const url = getRedisUrl();
  if (!url || redisFailure) return null;

  if (!redisPromise) {
    redisPromise = (async () => {
      try {
        const client = createClient({ url });
        client.on('error', (err) => {
          console.error('[redis]', err?.message || err);
        });
        await client.connect();
        return client;
      } catch (err) {
        redisFailure = true;
        console.error(
          '[redis] Conexión fallida; funciones distribuidas usan fallback local.',
          err?.message || err
        );
        return null;
      }
    })();
  }

  return redisPromise;
}
