import React from 'react';

import brandEmblemUrl from '../../../assets/brand/ceos-os-emblem.png?url';
import brandHorizontalUrl from '../../../assets/brand/ceos-os-horizontal.png?url';

/** @typedef {'horizontal' | 'emblem' | 'compact'} BrandVariant */
/** @typedef {'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'auth'} BrandSize — `auth` = emblem on login (responsive clamp) */
/** @typedef {'transparent' | 'framed' | 'hero' | 'subtle'} BrandSurface — `subtle` = minimal dark plate */

const HORIZONTAL_DIMS = {
  sm: { maxHeight: 34, maxWidth: 268 },
  md: { maxHeight: 42, maxWidth: 340 },
  lg: { maxHeight: 96, maxWidth: 400 },
  xl: { maxHeight: 120, maxWidth: 460 },
  hero: {},
  auth: {}
};

const EMBLEM_DIMS = {
  sm: { width: 44, height: 44 },
  md: { width: 52, height: 52 },
  lg: { width: 112, height: 112 },
  xl: { width: 120, height: 120 },
  hero: { width: 168, height: 168 },
  auth: {}
};

const COMPACT_SIZE = /** @type {const} */ ({
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'md',
  hero: 'lg'
});

/**
 * CEO's OS brand marks — bundled from `src/assets/brand/*.png` via Vite `?url` (content-hashed
 * in production). RGB mat composited on `#0b1020` (same as `index.html` body), no alpha.
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
    effectiveVariant === 'horizontal' ? brandHorizontalUrl : brandEmblemUrl;

  const resolvedAlt =
    alt ??
    (effectiveVariant === 'horizontal'
      ? "CEO's OS — executive intelligence"
      : "CEO's OS emblem");

  const isHorizontal = effectiveVariant === 'horizontal';

  const dimTable = isHorizontal ? HORIZONTAL_DIMS : EMBLEM_DIMS;
  const dim =
    effectiveSize === 'auth' && !isHorizontal
      ? EMBLEM_DIMS.md
      : dimTable[effectiveSize] ||
        (isHorizontal ? HORIZONTAL_DIMS.md : EMBLEM_DIMS.md);

  const wrapperSurface =
    surface === 'hero' && !isHorizontal ? 'framed' : surface;

  const surfaceStyle = getSurfaceStyle(wrapperSurface, effectiveSize, isHorizontal);

  const isAuthEmblem = !isHorizontal && effectiveSize === 'auth';

  const imgDims = isHorizontal
    ? effectiveSize === 'hero'
      ? surface === 'hero'
        ? {
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: 'clamp(44px, min(11vw, 10vh), 86px)'
          }
        : {
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: 'clamp(44px, min(11vw, 10vh), 86px)'
          }
      : {
          width: 'auto',
          height: 'auto',
          maxWidth:
            typeof dim.maxWidth === 'number' ? dim.maxWidth : dim.maxWidth,
          maxHeight:
            typeof dim.maxHeight === 'number' ? dim.maxHeight : dim.maxHeight
        }
    : isAuthEmblem
      ? {
          width: 'clamp(80px, 24vmin, 128px)',
          height: 'clamp(80px, 24vmin, 128px)',
          maxWidth: '100%',
          maxHeight: '100%'
        }
      : {
          width: dim.width,
          height: dim.height,
          maxWidth: '100%',
          maxHeight: '100%'
        };

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
          ...imgDims
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

  if (surface === 'subtle') {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      isolation: 'isolate',
      background: 'linear-gradient(180deg, #050814 0%, #030712 100%)',
      border: '1px solid rgba(255, 255, 255, 0.045)',
      borderRadius: 20,
      padding: '10px 12px',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.028)'
    };
  }

  const padSmall = size === 'sm' || size === 'md' || size === 'auth';
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    isolation: 'isolate',
    background: 'linear-gradient(180deg, #070b16 0%, #050814 52%, #030712 100%)',
    border: '1px solid rgba(255, 255, 255, 0.055)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    borderRadius: surface === 'hero' ? 22 : 16,
    padding: padSmall ? '8px 11px' : '11px 14px'
  };

  if (surface === 'hero' && isHorizontal) {
    return {
      ...base,
      padding: '12px 16px',
      borderRadius: 22,
      width: '100%',
      maxWidth: 'min(100%, 720px)',
      background: 'linear-gradient(180deg, #070b16 0%, #050814 48%, #030712 100%)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.032)'
    };
  }

  return base;
}

export default BrandLogo;
