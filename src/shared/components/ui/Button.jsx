import React from 'react';

export function Button({
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) {
  const isDisabled = disabled || loading;

  function handleClick(event) {
    if (isDisabled) return;

    if (typeof onClick === 'function') {
      onClick(event);
    }
  }

  return (
    <button
      type={type}
      className={`button ${variant} ${loading ? 'is-loading' : ''} ${className}`.trim()}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <span className="button-loading-dot" aria-hidden="true" />
      ) : null}

      <span className="button-content">{children}</span>
    </button>
  );
}