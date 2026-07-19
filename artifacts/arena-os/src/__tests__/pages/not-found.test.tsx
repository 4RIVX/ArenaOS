import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils';
import NotFound from '@/pages/not-found';

describe('NotFound page', () => {
  it('renders without crashing', () => {
    render(<NotFound />);
  });

  it('shows a 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
  });

  it('shows a descriptive message', () => {
    render(<NotFound />);
    expect(screen.getByText(/does not exist/i)).toBeInTheDocument();
  });

  it('has a link back to home', () => {
    render(<NotFound />);
    expect(screen.getByRole('link', { name: /Return Home/i })).toBeInTheDocument();
  });
});
