const levels = ['debug', 'info', 'warn', 'error'];
const currentLevel = process.env.LOG_LEVEL || 'info';

function shouldLog(level) {
  return levels.indexOf(level) >= levels.indexOf(currentLevel);
}

function baseLog(level, message, meta = {}) {
  if (!shouldLog(level)) return;
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
  console.log(JSON.stringify(payload));
}

export const logger = {
  debug: (message, meta) => baseLog('debug', message, meta),
  info: (message, meta) => baseLog('info', message, meta),
  warn: (message, meta) => baseLog('warn', message, meta),
  error: (message, meta) => baseLog('error', message, meta)
};
