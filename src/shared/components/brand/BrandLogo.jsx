import React from 'react';

const BRAND_EMBLEM = '/brand/ceos-os-emblem.png';
const BRAND_HORIZONTAL = '/brand/ceos-os-horizontal.png';

/** @typedef {'horizontal' | 'emblem' | 'compact'} BrandVariant */
/** @typedef {'sm' | 'md' | 'lg' | 'xl' | 'hero'} BrandSize */
/** @typedef {'transparent' | 'framed' | 'hero'} BrandSurface */

const HORIZONTAL_DIMS = {
  sm: { maxHeight: 30, maxWidth: 220 },
  md: { maxHeight: 40, maxWidth: 320 },
  lg: { maxHeight: 96, maxWidth: 400 },
  xl: { maxHeight: 120, maxWidth: 460 },
  hero: {}
};

const EMBLEM_DIMS = {
  sm: { width: 44, height: 44 },
  md: { width: 52, height: 52 },
  lg: { width: 112, height: 112 },
  xl: { width: 144, height: 144 },
  hero: { width: 168, height: 168 }
};

const COMPACT_SIZE = /** @type {const} */ ({
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'md',
  hero: 'lg'
});

/**
 * CEO's OS brand marks from `public/brand` (`/brand/...`).
 * For a pixel-perfect look on any background, export PNG/SVG with **transparent** alpha.
 * Until then, use `surface="framed"` or `surface="hero"` to blend non-transparent art.
 *
 * @param {object} props
 * @param {BrandVariant} [props.variant]
 * @param {BrandSize} [props.size]
 * @param {BrandSurface} [props.surface]
 * @param {string} [props.className] — wrapper
 * @param {React.CSSProperties} [props.style] — wrapper
 * @param {string} [props.imgClassName]
 */
export function BrandLogo({
  variant = 'emblem',
  size = 'md',
  surface = 'transparent',
  className,
  style,
  imgClassName,
  alt,
  loading = 'lazy',
  decoding = 'async',
  ...imgRest
}) {
  const effectiveVariant = variant === 'compact' ? 'emblem' : variant;
  const effectiveSize =
    variant === 'compact' ? COMPACT_SIZE[size] || 'sm' : size;

  const src =
    effectiveVariant === 'horizontal' ? BRAND_HORIZONTAL : BRAND_EMBLEM;

  const resolvedAlt =
    alt ??
    (effectiveVariant === 'horizontal'
      ? "CEO's OS — executive intelligence"
      : "CEO's OS emblem");

  const isHorizontal = effectiveVariant === 'horizontal';

  const dimTable = isHorizontal ? HORIZONTAL_DIMS : EMBLEM_DIMS;
  const dim =
    dimTable[effectiveSize] ||
    (isHorizontal ? HORIZONTAL_DIMS.md : EMBLEM_DIMS.md);

  const wrapperSurface =
    surface === 'hero' && !isHorizontal ? 'framed' : surface;

  const surfaceStyle = getSurfaceStyle(wrapperSurface, effectiveSize, isHorizontal);

  const imgDims = isHorizontal
    ? effectiveSize === 'hero'
      ? {
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: 'none'
        }
      : {
          width: 'auto',
          height: 'auto',
          maxWidth:
            typeof dim.maxWidth === 'number' ? dim.maxWidth : dim.maxWidth,
          maxHeight:
            typeof dim.maxHeight === 'number' ? dim.maxHeight : dim.maxHeight
        }
    : {
        width: dim.width,
        height: dim.height,
        maxWidth: '100%',
        maxHeight: '100%'
      };

  const imgFilter =
    wrapperSurface === 'transparent'
      ? 'drop-shadow(0 2px 12px rgba(0,0,0,0.35))'
      : 'drop-shadow(0 1px 8px rgba(0,0,0,0.45))';

  const rootClass = ['ceos-brand-logo-root', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass} style={{ ...surfaceStyle, ...style }}>
      <img
        src={src}
        alt={resolvedAlt}
        className={imgClassName}
        style={{
          objectFit: 'contain',
          display: 'block',
          margin: 0,
          ...imgDims,
          filter: imgFilter
        }}
        loading={loading}
        decoding={decoding}
        {...imgRest}
      />
    </div>
  );
}

/**
 * @param {BrandSurface} surface
 * @param {BrandSize} size
 * @param {boolean} isHorizontal
 */
function getSurfaceStyle(surface, size, isHorizontal) {
  if (surface === 'transparent') {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      padding: 0
    };
  }

  const padSmall = size === 'sm' || size === 'md';
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    background:
      'radial-gradient(ellipse 110% 100% at 50% -10%, rgba(16,185,129,0.09), rgba(11,16,32,0.96) 48%, rgba(7,10,20,0.99))',
    border: '1px solid rgba(148, 163, 184, 0.14)',
    boxShadow:
      '0 14px 44px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.045)',
    borderRadius: surface === 'hero' ? 26 : 18,
    padding: padSmall ? '9px 12px' : '12px 16px'
  };

  if (surface === 'hero' && isHorizontal) {
    return {
      ...base,
      padding: '16px 22px',
      borderRadius: 26,
      width: '100%',
      maxWidth: 'min(100%, 760px)'
    };
  }

  return base;
}

export default BrandLogo;
