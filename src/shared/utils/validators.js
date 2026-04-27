export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function requiredString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
