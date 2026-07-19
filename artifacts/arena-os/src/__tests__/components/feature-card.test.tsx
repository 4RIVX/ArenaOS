import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import { FeatureCard } from '@/components/layout/feature-card';
import { Navigation } from 'lucide-react';

describe('FeatureCard', () => {
  it('renders the feature name', () => {
    render(<FeatureCard icon={Navigation} name="Navigation" description="Find your way" />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<FeatureCard icon={Navigation} name="Navigation" description="Find your way around" />);
    expect(screen.getByText('Find your way around')).toBeInTheDocument();
  });

  it('renders as a button when no href is provided', () => {
    render(<FeatureCard icon={Navigation} name="Navigation" description="Desc" onClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Open Navigation feature/i })).toBeInTheDocument();
  });

  it('renders as a link when href is provided', () => {
    render(<FeatureCard icon={Navigation} name="Navigation" description="Desc" href="/navigate" />);
    expect(screen.getByRole('link', { name: /Open Navigation feature/i })).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const handleClick = vi.fn();
    render(<FeatureCard icon={Navigation} name="Navigation" description="Desc" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button', { name: /Open Navigation feature/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
