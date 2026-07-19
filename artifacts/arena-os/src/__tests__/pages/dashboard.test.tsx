import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '../test-utils';

// Dashboard page uses framer-motion for entry animations
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ children, ...rest }: any) =>
          React.createElement(tag, rest, children),
    },
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

import Dashboard from '@/pages/dashboard';

describe('Dashboard page', () => {
  it('renders without crashing', () => {
    render(<Dashboard />);
  });

  it('renders the Topbar', () => {
    render(<Dashboard />);
    expect(screen.getByText('Simulation Mode')).toBeInTheDocument();
  });

  it('shows major feature cards', () => {
    render(<Dashboard />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Emergency')).toBeInTheDocument();
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });
});
