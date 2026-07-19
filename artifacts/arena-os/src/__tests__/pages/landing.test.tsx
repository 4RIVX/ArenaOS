import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '../test-utils';

// framer-motion's motion.div uses browser APIs (requestAnimationFrame, etc.)
// that are not fully supported in jsdom — mock it to plain HTML elements.
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

import Landing from '@/pages/landing';

describe('Landing page', () => {
  it('renders without crashing', () => {
    render(<Landing />);
  });

  it('shows the ArenaOS product name', () => {
    render(<Landing />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ArenaOS/i);
  });

  it('shows the FIFA World Cup 2026 badge', () => {
    render(<Landing />);
    expect(screen.getByText(/FIFA World Cup 2026/i)).toBeInTheDocument();
  });

  it('has a primary call-to-action link', () => {
    render(<Landing />);
    expect(screen.getByRole('link', { name: /Launch ArenaOS/i })).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<Landing />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Emergency')).toBeInTheDocument();
  });
});
