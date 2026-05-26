import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AppErrorBoundary } from '../../../src/app/layout/AppErrorBoundary.jsx';

function Boom({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('boom');
  }
  return React.createElement('div', null, 'ok');
}

function renderBoundary(resetKey, shouldThrow) {
  return render(
    React.createElement(
      AppErrorBoundary,
      { resetKey },
      React.createElement(Boom, { shouldThrow })
    )
  );
}

describe('AppErrorBoundary', () => {
  it('clears latched error when resetKey changes', () => {
    const view = renderBoundary('/dashboard', true);

    expect(screen.getByRole('heading', { name: /Algo salió mal/i })).toBeTruthy();

    view.rerender(
      React.createElement(
        AppErrorBoundary,
        { resetKey: '/reporting/dashboard' },
        React.createElement(Boom, { shouldThrow: false })
      )
    );

    expect(screen.queryByRole('heading', { name: /Algo salió mal/i })).toBeNull();
    expect(screen.getByText('ok')).toBeTruthy();
  });
});
