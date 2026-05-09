import React from 'react';

const BRAND_EMBLEM = '/brand/ceos-os-emblem.png';
const BRAND_HORIZONTAL = '/brand/ceos-os-horizontal.png';

/**
 * CEO's OS brand marks served from `public/brand` (URLs `/brand/...`).
 * @param {'emblem' | 'horizontal'} [variant]
 */
export function BrandLogo({
  variant = 'emblem',
  className,
  style,
  alt,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}) {
  const src = variant === 'horizontal' ? BRAND_HORIZONTAL : BRAND_EMBLEM;
  const resolvedAlt =
    alt ??
    (variant === 'horizontal'
      ? "CEO's OS — executive intelligence"
      : "CEO's OS emblem");

  return (
    <img
      src={src}
      alt={resolvedAlt}
      className={className}
      style={style}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  );
}

export default BrandLogo;
