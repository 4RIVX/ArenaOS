import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils';
import { Topbar } from '@/components/layout/topbar';

describe('Topbar', () => {
  it('renders without crashing', () => {
    render(<Topbar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays the ArenaOS brand name', () => {
    render(<Topbar />);
    expect(screen.getByText('ArenaOS')).toBeInTheDocument();
  });

  it('shows the Simulation Mode badge', () => {
    render(<Topbar />);
    expect(screen.getByText('Simulation Mode')).toBeInTheDocument();
  });

  it('shows the selected stadium from context defaults', () => {
    render(<Topbar />);
    expect(screen.getByText('Lusail Stadium')).toBeInTheDocument();
  });

  it('shows the selected gate from context defaults', () => {
    render(<Topbar />);
    expect(screen.getByText('Gate A')).toBeInTheDocument();
  });

  it('has a Change role button', () => {
    render(<Topbar />);
    expect(screen.getByRole('button', { name: /change/i })).toBeInTheDocument();
  });
});
