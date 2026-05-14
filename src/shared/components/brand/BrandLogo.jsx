import React from 'react';

import brandEmblemUrl from '../../../assets/brand/ceos-os-emblem.png?url';
import brandEmblemWebpUrl from '../../../assets/brand/ceos-os-emblem.webp?url';
import brandLionEmblemUrl from '../../../assets/brand/ceos-os-emblem-lion.png?url';
import brandLionEmblemWebpUrl from '../../../assets/brand/ceos-os-emblem-lion.webp?url';
import brandHorizontalUrl from '../../../assets/brand/ceos-os-horizontal.png?url';
import brandHorizontalColorUrl from '../../../assets/brand/ceos-os-horizontal-color.png?url';
import brandHorizontalColorWebpUrl from '../../../assets/brand/ceos-os-horizontal-color.webp?url';
import brandWordmarkLettersUrl from '../../../assets/brand/ceos-os-wordmark-letters.png?url';
import brandWordmarkLettersWebpUrl from '../../../assets/brand/ceos-os-wordmark-letters.webp?url';
import brandNavLettersUrl from '../../../assets/brand/ceos-os-landing-nav-letters.png?url';
import brandNavLettersWebpUrl from '../../../assets/brand/ceos-os-landing-nav-letters.webp?url';

/** @typedef {'horizontal' | 'emblem' | 'compact' | 'lockup'} BrandVariant */
/** @typedef {'default' | 'color' | 'letters'} BrandHorizontalAsset — `color` = horizontal a color; `letters` = solo nombre */
/** @typedef {'default' | 'lion'} BrandEmblemAsset — `lion` = rueda león + segmentos (PNG a color) */
/** @typedef {'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'auth'} BrandSize — `auth` = login (emblema, clamp) */
/** @typedef {'transparent' | 'framed' | 'hero' | 'subtle'} BrandSurface — `subtle` = minimal dark plate */

const HORIZONTAL_DIMS = {
  sm: { maxHeight: 38, maxWidth: 300 },
  md: { maxHeight: 44, maxWidth: 360 },
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

/** Hero: scale with viewport so mark holds weight vs clamp(42px, 6vw, 78px) headline. */
const HORIZONTAL_HERO_MAX_TRANSPARENT =
  'clamp(52px, min(19vw, 16vh), 156px)';

/**
 * CEO's OS brand marks — bundled from `src/assets/brand/*.png` via Vite `?url` (content-hashed).
 * Landing: nav = wordmark letras; hero/pie = horizontal a color.
 * Login: emblema león sin placa (surface transparent).
 *
 * @param {object} props
 * @param {BrandVariant} [props.variant]
 * @param {BrandHorizontalAsset} [props.horizontalAsset]
 * @param {BrandEmblemAsset} [props.emblemAsset]
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
  horizontalAsset = 'default',
  emblemAsset = 'default',
  className,
  style,
  imgClassName,
  alt,
  loading = 'lazy',
  decoding = 'async',
  lockupResponsive = true,
  ...imgRest
}) {
  const effectiveVariant = variant === 'compact' ? 'emblem' : variant;
  const effectiveSize =
    variant === 'compact' ? COMPACT_SIZE[size] || 'sm' : size;

  const src = (() => {
    if (effectiveVariant === 'horizontal') {
      if (horizontalAsset === 'color') {
        return { png: brandHorizontalColorUrl, webp: brandHorizontalColorWebpUrl };
      }
      if (horizontalAsset === 'letters') {
        return { png: brandNavLettersUrl, webp: brandNavLettersWebpUrl };
      }
      return { png: brandHorizontalUrl, webp: null };
    }
    return emblemAsset === 'lion'
      ? { png: brandLionEmblemUrl, webp: brandLionEmblemWebpUrl }
      : { png: brandEmblemUrl, webp: brandEmblemWebpUrl };
  })();

  const resolvedAlt =
    alt ??
    (effectiveVariant === 'horizontal'
      ? horizontalAsset === 'color'
        ? "CEO's OS — marca horizontal a color"
        : horizontalAsset === 'letters'
          ? "CEO's OS — nombre"
          : "CEO's OS — executive intelligence"
      : emblemAsset === 'lion'
        ? "CEO's OS — emblema león"
        : "CEO's OS emblem");

  const isLockup = effectiveVariant === 'lockup';
  const isHorizontal = effectiveVariant === 'horizontal' || isLockup;

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
  const isLionWheel = emblemAsset === 'lion';

  const imgDims = !isLockup
    ? isHorizontal
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
            maxWidth: 'min(100%, 680px)',
            maxHeight:
              surface === 'transparent'
                ? HORIZONTAL_HERO_MAX_TRANSPARENT
                : 'clamp(44px, min(11vw, 10vh), 86px)'
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
          height: isLionWheel
            ? 'clamp(112px, min(40vmin, 72vw), 200px)'
            : 'clamp(88px, min(32vmin, 44vw), 138px)',
          width: 'auto',
          maxWidth: '100%'
        }
      : {
          height: dim.height,
          width: 'auto',
          maxWidth: '100%',
          maxHeight: '100%'
        }
    : null;

  const rootClass = ['ceos-brand-logo-root', isLockup ? 'ceos-brand-logo-lockup' : '', className]
    .filter(Boolean)
    .join(' ');

  if (isLockup) {
    const emblem = emblemAsset === 'lion'
      ? { png: brandLionEmblemUrl, webp: brandLionEmblemWebpUrl }
      : { png: brandEmblemUrl, webp: brandEmblemWebpUrl };
    const wordmark = horizontalAsset === 'letters'
      ? { png: brandNavLettersUrl, webp: brandNavLettersWebpUrl }
      : horizontalAsset === 'color'
        ? { png: brandHorizontalColorUrl, webp: brandHorizontalColorWebpUrl }
        : { png: brandWordmarkLettersUrl, webp: brandWordmarkLettersWebpUrl };

    const lockupDims =
      effectiveSize === 'hero'
        ? {
            emblemMaxH: 'clamp(118px, min(24vw, 22vh), 220px)',
            wordmarkMaxH: 'clamp(46px, min(9.2vw, 8.4vh), 84px)',
            wordmarkMaxW: 'min(58vw, 620px)',
            gap: 'clamp(14px, 2.6vw, 24px)'
          }
        : {
            emblemMaxH: 'clamp(88px, min(18vw, 16vh), 144px)',
            wordmarkMaxH: 'clamp(40px, min(8vw, 7vh), 72px)',
            wordmarkMaxW: 'min(56vw, 420px)',
            gap: 'clamp(12px, 2vw, 20px)'
          };

    return (
      <div className={rootClass} style={{ ...surfaceStyle, ...style }}>
        <div
          className={`ceos-brand-lockup ${lockupResponsive ? 'ceos-brand-lockup-responsive' : ''}`}
          role={alt ? 'img' : undefined}
          aria-label={alt}
          style={{ gap: lockupDims.gap }}
        >
          <BrandPicture
            src={emblem}
            alt=""
            className={imgClassName}
            loading={loading}
            decoding={decoding}
            style={{
              width: 'auto',
              height: 'auto',
              maxHeight: lockupDims.emblemMaxH,
              maxWidth: 'min(44vw, 280px)',
              objectFit: 'contain',
              display: 'block'
            }}
            {...imgRest}
          />
          <BrandPicture
            src={wordmark}
            alt=""
            loading={loading}
            decoding={decoding}
            style={{
              width: 'auto',
              height: 'auto',
              maxHeight: lockupDims.wordmarkMaxH,
              maxWidth: lockupDims.wordmarkMaxW,
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={rootClass} style={{ ...surfaceStyle, ...style }}>
      <BrandPicture
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

function BrandPicture({ src, ...imgProps }) {
  return (
    <picture>
      {src.webp ? <source srcSet={src.webp} type="image/webp" /> : null}
      <img src={src.png} {...imgProps} />
    </picture>
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
