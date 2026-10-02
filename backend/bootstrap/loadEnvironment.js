import dotenv from 'dotenv';

/**
 * Load .env before any module captures process.env at evaluation time.
 * Existing process.env values are kept. dotenv does not override them.
 */
export function loadEnvironment(options = {}) {
  const dotenvOptions = {};

  if (options.path) {
    dotenvOptions.path = options.path;
  }

  return dotenv.config(dotenvOptions);
}
