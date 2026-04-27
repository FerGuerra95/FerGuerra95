import React from 'react';

export function Card({ light = false, className = '', children }) {
  return <section className={`card ${light ? 'light' : ''} ${className}`.trim()}>{children}</section>;
}
